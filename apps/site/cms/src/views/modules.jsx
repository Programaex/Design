// Módulos editoriais do Hub (arquitetura e conteúdo reaproveitados do Hub-Editorial-CMS): lista + painel de detalhe.
// Dados no KV ("hub"), semeados com o seed original na primeira abertura. ID mestre gerado por prefixo.
import React from 'react';
import { Button, Table, Tag, TextField } from '../ds.js';
import { useDoc } from '../store.js';
import { AutomationButton } from './automation.jsx';

const uid = () => 'r' + Math.random().toString(36).slice(2, 10);
function nextId(rows, field, prefix) {
	const max = rows.reduce((n, r) => (typeof r[field] === 'string' && r[field].startsWith(prefix) ? Math.max(n, parseInt(r[field].slice(prefix.length), 10) || 0) : n), 0);
	return prefix + String(max + 1).padStart(4, '0');
}
const TONE = { PUBLICADO: 'success', PRONTO: 'success', ACEITO: 'success', DECIDIDA: 'success', BLOQUEADO: 'danger', 'CRÍTICA': 'danger', ALTA: 'warning', 'EM REVISÃO': 'accent', 'EM PRODUÇÃO': 'accent', PENDENTE: 'warning' };

function Field({ f, value, onChange, vocab, readOnly }) {
	const [key, label, type] = f;
	if (type.startsWith('select:')) {
		const opts = vocab[type.slice(7)] || [];
		return <label className="field"><span className="field-label">{label}</span><select className="input" value={value || ''} onChange={e => onChange(key, e.target.value)}><option value="">—</option>{opts.map(o => <option key={o}>{o}</option>)}</select></label>;
	}
	return <TextField label={label} value={value ?? ''} readOnly={readOnly || type === 'id'} multiline={type === 'longtext'} rows={type === 'longtext' ? 3 : undefined} type={type === 'number' ? 'number' : type === 'date' ? 'date' : 'text'} onChange={e => onChange(key, e.target.value)} />;
}

export function ModuleView({ data, moduleId, automation }) {
	const mod = data.hub.modules.find(m => m.id === moduleId);
	const [hub, setHub] = useDoc('hub', () => Object.fromEntries(data.hub.modules.map(m => [m.id, (data.hub.seed[m.id] || []).map(r => ({ _id: uid(), ...r }))])));
	const [sel, setSel] = React.useState(null);
	const [q, setQ] = React.useState('');
	if (!mod) return <div className="cms-page"><p>Módulo desconhecido: {moduleId}</p></div>;
	if (!hub) return <div className="cms-page text-muted">Carregando…</div>;
	const rows = hub[mod.id] || [];
	const shown = q ? rows.filter(r => Object.values(r).join(' ').toLowerCase().includes(q.toLowerCase())) : rows;
	const rec = rows.find(r => r._id === sel);
	const statusKey = mod.fields.find(f => /select:status/i.test(f[2]))?.[0];
	const update = (k, v) => setHub(h => ({ ...h, [mod.id]: h[mod.id].map(r => (r._id === sel ? { ...r, [k]: v } : r)) }));
	const add = () => {
		const r = { _id: uid(), [mod.idField]: mod.idPrefix ? nextId(rows, mod.idField, mod.idPrefix) : '' };
		setHub(h => ({ ...h, [mod.id]: [...(h[mod.id] || []), r] }));
		setSel(r._id);
	};
	const remove = () => { setHub(h => ({ ...h, [mod.id]: h[mod.id].filter(r => r._id !== sel) })); setSel(null); };
	const columns = [
		{ key: mod.idField, label: 'ID', render: r => <code>{r[mod.idField]}</code> },
		{ key: mod.titleField, label: mod.fields.find(f => f[0] === mod.titleField)?.[1] || 'Título', render: r => r[mod.titleField] || r[mod.titleField2] || '(sem título)' },
		...(mod.subtitleField ? [{ key: mod.subtitleField, label: mod.fields.find(f => f[0] === mod.subtitleField)?.[1], muted: true }] : []),
		...(statusKey ? [{ key: statusKey, label: 'Status', render: r => r[statusKey] ? <Tag tone={TONE[r[statusKey]] || 'neutral'}>{r[statusKey]}</Tag> : '—' }] : []),
	];
	return (
		<div className="cms-page">
			<header className="cms-head"><div><span className="cms-kicker">{mod.sheet}</span><h1>{mod.plural || mod.label}</h1><p className="text-muted">{rows.length} registros · ID mestre <code>{mod.idPrefix || mod.idField}</code></p></div>
				<div className="cms-actions"><Button size="sm" icon={<i className="ph ph-plus" />} onClick={add}>Novo {mod.singular?.toLowerCase() || 'registro'}</Button></div></header>
			<div className="cms-toolbar"><TextField placeholder="Buscar…" value={q} onChange={e => setQ(e.target.value)} aria-label="Buscar" /></div>
			<div className={'cms-split' + (rec ? ' has-detail' : '')}>
				<div className="cms-scroll-x"><Table columns={columns} rows={shown.map(r => ({ ...r, id: r._id }))} onRowClick={r => setSel(r._id)} /></div>
				{rec && (
					<aside className="cms-detail cms-panel" aria-label="Detalhe">
						<div className="cms-detail-head"><code>{rec[mod.idField]}</code><Button size="sm" variant="ghost" onClick={() => setSel(null)}>Fechar</Button></div>
						{mod.fields.map(f => <Field key={f[0]} f={f} value={rec[f[0]]} vocab={data.hub.vocab} onChange={update} />)}
						<div className="cms-actions">
							{mod.id === 'content' && <AutomationButton action="derivar" target={rec[mod.idField]} automation={automation} />}
							{['content', 'production', 'seo'].includes(mod.id) && <AutomationButton action="publicar" target={rec[mod.idField]} automation={automation} />}
							{['social', 'shorts', 'distribution', 'calendar'].includes(mod.id) && <AutomationButton action="agendar" target={rec[mod.idField]} automation={automation} />}
							<Button size="sm" variant="ghost" onClick={remove}>Excluir</Button>
						</div>
					</aside>
				)}
			</div>
		</div>
	);
}

export function VocabView({ data }) {
	return (
		<div className="cms-page">
			<header className="cms-head"><div><span className="cms-kicker">Vocabulário controlado</span><h1>Listas controladas</h1></div></header>
			<div className="cms-auto-grid">
				{Object.entries(data.hub.vocab).map(([k, list]) => <section key={k} className="cms-panel"><h2><code>{k}</code></h2><div className="cms-tags">{list.map(v => <Tag key={v}>{v}</Tag>)}</div></section>)}
				<section className="cms-panel"><h2><code>estadosADR</code></h2><div className="cms-tags">{data.adrStates.map(v => <Tag key={v} tone="accent">{v}</Tag>)}</div></section>
			</div>
		</div>
	);
}
