// Peças comuns das views de Operações e Dados: abas, filtros, legenda de categorias e diálogo de tarefa.
import React from 'react';
import { Button, Dialog, Tag, TextField } from '../ds.js';
import { CATEGORIES } from '../../../lib/ops/editorial.mjs';
import { TASK_STATUSES, updateTask } from '../../../lib/ops/model.mjs';
import { useOps } from './store.jsx';

export const VIEWS = [
	['dashboard', 'Dashboard', 'ph-gauge'], ['calendario', 'Calendário', 'ph-calendar'], ['gantt', 'Gantt', 'ph-chart-bar-horizontal'],
	['mapa', 'Mapa mental', 'ph-graph'], ['workflow', 'Workflow', 'ph-flow-arrow'], ['foco', 'Foco', 'ph-target'],
	['importar', 'Importar', 'ph-upload-simple'], ['exportar', 'Exportar', 'ph-printer'],
];

// Cores por categoria = paleta "brain" do design system (fundo claro + texto escuro + rótulo).
const TOKEN = { blog: '--brain-blue', shorts: '--brain-pink', instagram: '--brain-orange', linkedin: '--brain-violet', threads: '--brain-green', newsletter: '--brain-yellow', multi: '--color-accent', owned: '--color-neutral-500', outros: '--color-neutral-400' };
export const catStyle = id => ({ '--cat': `var(${TOKEN[id] || TOKEN.outros})` });
export const catLabel = id => (CATEGORIES.find(c => c.id === id) || {}).label || id;
export const STATUS_LABEL = { unconfirmed: 'Não confirmado', pending: 'Pendente', ready: 'Pronta', running: 'Em execução', completed: 'Concluída', error: 'Erro', blocked: 'Bloqueada' };
export const STATUS_TONE = { completed: 'success', running: 'accent', error: 'danger', blocked: 'danger', unconfirmed: 'neutral', pending: 'neutral', ready: 'accent' };
export const fmt = d => (d ? d.split('-').reverse().join('/') : '—');
export const fmtRange = t => (t.plannedStart ? (t.plannedEnd && t.plannedEnd !== t.plannedStart ? `${fmt(t.plannedStart)} → ${fmt(t.plannedEnd)}` : fmt(t.plannedStart)) : 'Não agendada');

export function Legend({ ids }) {
	return (
		<div className="ops-legend" aria-label="Legenda de categorias">
			{(ids || CATEGORIES.map(c => c.id)).map(id => <span key={id} className="ops-chip" style={catStyle(id)}><i aria-hidden="true" />{catLabel(id)}</span>)}
			<span className="ops-chip is-window"><i aria-hidden="true" />Janela editorial (sem data exata)</span>
		</div>
	);
}

export function Notice() {
	const { notice, setNotice, mode } = useOps();
	return (
		<>
			{mode === 'local' && !notice && <div className="ops-notice is-warning" role="status">Modo local: alterações ficam só neste navegador.</div>}
			{notice && <div className={'ops-notice is-' + notice.tone} role="alert">{notice.text}<button aria-label="Fechar aviso" onClick={() => setNotice(null)}>×</button></div>}
		</>
	);
}

// Filtros compartilhados. inapplicable: lista de filtros que não se aplicam à view (informados, não ocultos).
export function Filters({ filters, setFilters, tasks, inapplicable = [] }) {
	const opts = k => [...new Set(tasks.map(t => t[k]).filter(Boolean))].sort();
	const field = (k, label, values, labelOf = v => v) => (
		<label className="field ops-filter"><span className="field-label">{label}{inapplicable.includes(k) && <small className="text-muted"> · não se aplica</small>}</span>
			<select className="input" value={filters[k] || ''} disabled={inapplicable.includes(k)} onChange={e => setFilters(f => ({ ...f, [k]: e.target.value || undefined }))}>
				<option value="">Todos</option>
				{k === 'ownerId' && <option value="__none">Sem responsável</option>}
				{values.map(v => <option key={v} value={v}>{labelOf(v)}</option>)}
			</select>
		</label>
	);
	const active = Object.values(filters).filter(Boolean).length;
	return (
		<div className="ops-filters" role="group" aria-label="Filtros">
			{field('projectId', 'Campanha', opts('projectId'))}
			{field('ownerId', 'Responsável', opts('ownerId'))}
			{field('categoryId', 'Canal', opts('categoryId'), catLabel)}
			{field('status', 'Status', TASK_STATUSES, s => STATUS_LABEL[s])}
			{active > 0 && <Button size="sm" variant="ghost" onClick={() => setFilters({})}>Limpar ({active})</Button>}
		</div>
	);
}

// Edição de tarefa por formulário (alternativa a arrastar). Salva por revisão; sincroniza todas as views.
export function TaskDialog({ task, onClose }) {
	const { doc, apply } = useOps();
	const [f, setF] = React.useState(() => ({ title: task.title, plannedStart: task.plannedStart || '', plannedEnd: task.plannedEnd || '', dateKind: task.dateKind, categoryId: task.categoryId, channel: task.channel || '', ownerId: task.ownerId || '', status: task.status, instruction: task.instruction || '', expectedOutput: task.expectedOutput || '', requiredEvidence: task.requiredEvidence || '' }));
	const [err, setErr] = React.useState(null);
	const set = k => e => setF(x => ({ ...x, [k]: e.target.value }));
	const save = () => {
		const patch = { ...f, plannedStart: f.plannedStart || null, plannedEnd: f.plannedEnd || f.plannedStart || null, ownerId: f.ownerId || null };
		const r = apply(d => updateTask(d, task.id, patch, { expectedRevision: task.revision }));
		if (r?.error) setErr(r.error); else onClose();
	};
	const hist = doc.history.filter(h => h.taskId === task.id).slice(-6).reverse();
	return (
		<Dialog title={`Editar ${task.id}`} onClose={onClose} actions={<><Button variant="ghost" onClick={onClose}>Cancelar</Button><Button onClick={save}>Salvar</Button></>}>
			<div className="ops-form">
				<TextField label="Título" value={f.title} onChange={set('title')} />
				{task.flags?.length > 0 && <p className="ops-flags">{task.flags.map(x => <Tag key={x} tone="warning">{x}</Tag>)}</p>}
				<div className="ops-row">
					<TextField label="Início" type="date" value={f.plannedStart} onChange={set('plannedStart')} />
					<TextField label="Fim" type="date" value={f.plannedEnd} onChange={set('plannedEnd')} />
				</div>
				<div className="ops-row">
					<label className="field"><span className="field-label">Tipo de data</span><select className="input" value={f.dateKind} onChange={set('dateKind')}><option value="exact">Data exata (dia inteiro)</option><option value="window">Janela editorial</option></select></label>
					<label className="field"><span className="field-label">Status</span><select className="input" value={f.status} onChange={set('status')}>{TASK_STATUSES.map(s => <option key={s} value={s}>{STATUS_LABEL[s]}</option>)}</select></label>
				</div>
				<div className="ops-row">
					<label className="field"><span className="field-label">Categoria (cor)</span><select className="input" value={f.categoryId} onChange={set('categoryId')}>{CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}</select></label>
					<TextField label="Canal" value={f.channel} onChange={set('channel')} />
				</div>
				<TextField label="Responsável" value={f.ownerId} onChange={set('ownerId')} placeholder="Não informado" />
				<TextField label="Instrução" multiline rows={2} value={f.instruction} onChange={set('instruction')} />
				<TextField label="Saída esperada" value={f.expectedOutput} onChange={set('expectedOutput')} />
				<TextField label="Evidência requerida" value={f.requiredEvidence} onChange={set('requiredEvidence')} />
				{task.originalStart && <p className="text-muted ops-small">Data original: {fmt(task.originalStart)}{task.originalEnd !== task.originalStart ? ' → ' + fmt(task.originalEnd) : ''} · fonte: <code>{task.plannedDateRaw}</code></p>}
				{err && <p className="login-error" role="alert">{err}</p>}
				{hist.length > 0 && <details><summary>Histórico ({hist.length})</summary><ul className="ops-small">{hist.map((h, i) => <li key={i}><code>{h.field}</code>: {JSON.stringify(h.before)} → {JSON.stringify(h.after)} <span className="text-muted">{h.author}{h.at ? ' · ' + new Date(h.at).toLocaleString('pt-BR') : ''}</span></li>)}</ul></details>}
			</div>
		</Dialog>
	);
}

export function StatusTag({ status }) {
	return <Tag tone={STATUS_TONE[status] || 'neutral'}>{STATUS_LABEL[status] || status}</Tag>;
}

// Pan/zoom simples para canvas SVG (fundo arrasta; controles e roda fazem zoom).
export function usePanZoom(initial = { x: 40, y: 40, k: 1 }) {
	const [vp, setVp] = React.useState(initial);
	const drag = React.useRef(null);
	const onPointerDown = e => { if (e.target.closest('[data-node]')) return; drag.current = { x: e.clientX, y: e.clientY, vp }; e.currentTarget.setPointerCapture(e.pointerId); };
	const onPointerMove = e => { if (!drag.current) return; const d = drag.current; setVp({ ...d.vp, x: d.vp.x + e.clientX - d.x, y: d.vp.y + e.clientY - d.y }); };
	const onPointerUp = () => { drag.current = null; };
	const onWheel = e => { if (!e.ctrlKey && !e.metaKey) return; e.preventDefault(); setVp(v => ({ ...v, k: Math.min(2.5, Math.max(0.2, v.k * (e.deltaY < 0 ? 1.1 : 0.9))) })); };
	const zoom = f => setVp(v => ({ ...v, k: Math.min(2.5, Math.max(0.2, v.k * f)) }));
	const fit = (bounds, w, h, pad = 32) => { const k = Math.min(1.5, (w - pad * 2) / bounds.width, (h - pad * 2) / bounds.height); setVp({ k, x: pad - bounds.x * k + (w - pad * 2 - bounds.width * k) / 2, y: pad - bounds.y * k + (h - pad * 2 - bounds.height * k) / 2 }); };
	return { vp, setVp, zoom, fit, handlers: { onPointerDown, onPointerMove, onPointerUp, onPointerLeave: onPointerUp, onWheel } };
}
