// Foco WIP=1 global (REF-006–012, FR-07/08): cabeçalho, stepper e barra de ações fixos; só o card muda.
// Iniciar/concluir/falhar/rejeitar passam pelo Durable Object (/api/focus/*) com chave idempotente:
// clique duplo não duplica e uma segunda aba não inicia outra tarefa. Passos futuros só para leitura.
import React from 'react';
import { Button, Tag, TextField } from '../ds.js';
import { addEvidence, updateTask } from '../../../lib/ops/model.mjs';
import { catLabel, catStyle, fmtRange, StatusTag } from './shared.jsx';
import { useOps } from './store.jsx';

const key = () => (crypto.randomUUID ? crypto.randomUUID() : String(Date.now()) + Math.random());

async function focusCall(action, body = {}) {
	const r = await fetch('/api/focus/' + action, { method: 'POST', credentials: 'same-origin', headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) }).catch(() => null);
	if (!r) return { ok: false, message: 'Sem conexão com o servidor.' };
	return r.json().catch(() => ({ ok: false, message: 'HTTP ' + r.status }));
}

export function eligibility(doc, task) {
	const blockers = doc.dependencies.filter(d => d.successorId === task.id).map(d => doc.tasks.find(t => t.id === d.predecessorId)).filter(p => p && p.status !== 'completed');
	return { eligible: task.status !== 'completed' && blockers.length === 0, blockers };
}

export function Focus({ doc, tasks, openTask }) {
	const { apply } = useOps();
	const [server, setServer] = React.useState(null);
	const [err, setErr] = React.useState(null);
	const [busy, setBusy] = React.useState(false);
	const [cursor, setCursor] = React.useState(null);
	const [ev, setEv] = React.useState({ uri: '', label: '', note: '' });
	const pending = React.useRef(null); // chave idempotente da ação em curso (protege clique duplo)
	const titleRef = React.useRef(null);
	const queue = [...tasks].filter(t => t.plannedStart || t.status === 'running').sort((a, b) => (a.plannedStart || '').localeCompare(b.plannedStart || '') || a.id.localeCompare(b.id));
	const active = server?.activeTaskId ? doc.tasks.find(t => t.id === server.activeTaskId) : null;
	const firstEligible = queue.find(t => eligibility(doc, t).eligible);
	const current = doc.tasks.find(t => t.id === cursor) || active || firstEligible || queue[0];
	const idx = queue.findIndex(t => t.id === current?.id);
	const refresh = React.useCallback(async () => { const r = await focusCall('state'); if (r.ok) { setServer(r.state); setErr(null); } else setErr(r.message); }, []);
	React.useEffect(() => { refresh(); const t = setInterval(refresh, 15000); return () => clearInterval(t); }, [refresh]);
	React.useEffect(() => { titleRef.current?.focus(); }, [current?.id]);

	const run = async (action, extra = {}) => {
		if (pending.current) return; // segundo clique durante a mesma ação: ignorado
		pending.current = { action, key: key() };
		setBusy(true); setErr(null);
		const r = await focusCall(action, { taskId: current.id, expectedRevision: server?.revision, idempotencyKey: pending.current.key, ...extra });
		pending.current = null; setBusy(false);
		if (!r.ok) { setErr(r.message); if (r.state) setServer(r.state); return false; }
		setServer(r.state);
		return true;
	};
	const start = async () => { if (await run('start')) apply(d => updateTask(d, current.id, { status: 'running' }, { author: 'foco' })); };
	const complete = async () => {
		if (current.requiredEvidence && !ev.uri && !ev.label) { setErr('Esta tarefa exige evidência: informe link ou descrição.'); return; }
		if (await run('complete', { evidence: ev.uri || ev.label ? { uri: ev.uri, label: ev.label } : null, note: ev.note })) {
			if (ev.uri || ev.label) apply(d => addEvidence(d, { taskId: current.id, uri: ev.uri, label: ev.label }, { author: 'foco' }));
			apply(d => updateTask(d, current.id, { status: 'completed' }, { author: 'foco' }));
			setEv({ uri: '', label: '', note: '' }); setCursor(null);
		}
	};
	const fail = async () => { if (await run('fail', { note: ev.note })) apply(d => updateTask(d, current.id, { status: 'error' }, { author: 'foco' })); };
	const reject = async () => { if (await run('reject', { note: ev.note, returnTo: queue[idx - 1]?.id || null })) apply(d => updateTask(d, current.id, { status: 'pending' }, { author: 'foco' })); };

	if (!current) return <p className="text-muted">Nenhuma tarefa agendada com os filtros atuais.</p>;
	const { eligible, blockers } = eligibility(doc, current);
	const isActive = server?.activeTaskId === current.id;
	const otherActive = server?.activeTaskId && !isActive;
	const attempts = (server?.attempts || []).filter(a => a.taskId === current.id);
	const evidence = doc.evidence.filter(e => e.taskId === current.id);
	return (
		<div className="ops-focus">
			<header className="ops-focus-head">
				<div><span className="cms-kicker">Execução global · WIP = 1</span><b>{active ? `Em execução: ${active.id}` : 'Nenhuma tarefa em execução'}</b></div>
				<span className="text-muted ops-small">{queue.filter(t => t.status === 'completed').length}/{queue.length} concluídas · revisão {server?.revision ?? '—'}</span>
			</header>
			<ol className="ops-stepper" aria-label="Sequência">
				{queue.map((t, i) => (
					<li key={t.id} className={(t.id === current.id ? 'is-current ' : '') + (t.status === 'completed' ? 'is-done ' : '') + (server?.activeTaskId === t.id ? 'is-running' : '')}>
						<button onClick={() => setCursor(t.id)} aria-current={t.id === current.id ? 'step' : undefined} title={t.title}><span>{i + 1}</span>{t.id}</button>
					</li>
				))}
			</ol>
			<div className="ops-focus-stage" aria-live="polite">
				<article className="cms-panel ops-focus-card" key={current.id}>
					<div className="ops-focus-meta"><code>{current.id}</code><StatusTag status={current.status} /><span className="ops-chip" style={catStyle(current.categoryId)}><i />{catLabel(current.categoryId)}</span>{!eligible && current.status !== 'completed' && <Tag tone="warning">Só leitura: dependências abertas</Tag>}{otherActive && <Tag tone="warning">Outra tarefa em execução</Tag>}</div>
					<h2 tabIndex={-1} ref={titleRef}>{current.title}</h2>
					<dl className="ops-dl">
						<dt>Responsável</dt><dd>{current.ownerId || 'Não informado'}</dd>
						<dt>Data</dt><dd>{fmtRange(current)}{current.dateKind === 'window' ? ' (janela editorial)' : ''}</dd>
						<dt>Insumos</dt><dd>{current.pieceType || current.format ? `${current.pieceType || ''} · ${current.format || ''} · ${current.channel || ''}` : current.sourceNodeId ? `Pergunta ${current.sourceNodeId}` : 'Não informados'}</dd>
						<dt>Dependências</dt><dd>{blockers.length ? blockers.map(b => b.id).join(', ') + ' (abertas)' : 'Nenhuma aberta'}</dd>
						<dt>Instrução</dt><dd>{current.instruction || 'Não informada'}</dd>
						<dt>Saída esperada</dt><dd>{current.expectedOutput || 'Não informada'}</dd>
						<dt>Evidência requerida</dt><dd>{current.requiredEvidence || 'Não informada'}</dd>
					</dl>
					{current.flags?.length > 0 && <p className="ops-flags">{current.flags.map(f => <Tag key={f} tone="warning">{f}</Tag>)}</p>}
					{isActive && (
						<div className="ops-form">
							<div className="ops-progress" role="progressbar" aria-label="Executando" aria-busy="true"><span /></div>
							<div className="ops-row"><TextField label="Evidência (link)" value={ev.uri} onChange={e => setEv(x => ({ ...x, uri: e.target.value }))} /><TextField label="Evidência (descrição)" value={ev.label} onChange={e => setEv(x => ({ ...x, label: e.target.value }))} /></div>
							<TextField label="Nota (falha ou rejeição)" value={ev.note} onChange={e => setEv(x => ({ ...x, note: e.target.value }))} />
						</div>
					)}
					{(attempts.length > 0 || evidence.length > 0) && (
						<details><summary>Histórico ({attempts.length} tentativa(s), {evidence.length} evidência(s))</summary>
							<ul className="ops-small">{attempts.map((a, i) => <li key={i}>{a.outcome} · {new Date(a.endedAt).toLocaleString('pt-BR')}{a.note ? ' · ' + a.note : ''}</li>)}{evidence.map(e => <li key={e.id}>Evidência: {e.label || e.uri} {e.uri && <a href={e.uri} target="_blank" rel="noreferrer">↗</a>}</li>)}</ul>
						</details>
					)}
				</article>
			</div>
			<footer className="ops-focus-actions">
				{err && <p className="ops-notice is-danger" role="alert">{err}</p>}
				<Button variant="ghost" onClick={() => setCursor(queue[Math.max(0, idx - 1)]?.id)} disabled={idx <= 0}>‹ Anterior</Button>
				<Button variant="secondary" onClick={() => openTask(current)}>Editar</Button>
				{isActive ? (
					<>
						<Button variant="secondary" onClick={reject} disabled={busy}>Rejeitar gate</Button>
						<Button variant="secondary" onClick={fail} disabled={busy}>Registrar falha</Button>
						<Button onClick={complete} disabled={busy}>Concluir</Button>
					</>
				) : (
					<Button onClick={start} disabled={busy || !eligible || otherActive || current.status === 'completed'}>{current.status === 'error' ? 'Tentar de novo' : 'Iniciar'}</Button>
				)}
				<Button variant="ghost" onClick={() => setCursor(queue[Math.min(queue.length - 1, idx + 1)]?.id)} disabled={idx >= queue.length - 1}>Próxima ›</Button>
			</footer>
		</div>
	);
}
