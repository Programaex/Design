// Workflow em grafo (REF-004/005, FR-04/06): tarefas e dependências FS como DAG em camadas.
// Fases recolhem em um card-grupo com contagem (conectores vão ao grupo; nada é apagado).
// "Ligar" cria dependência com validação de ciclo; "Adicionar" cria sucessora. Orientação LR/TB.
import React from 'react';
import { Button, SegmentedControl, TextField } from '../ds.js';
import { dagLayout } from '../../../lib/ops/layout.mjs';
import { addDependency, createTask, removeDependency } from '../../../lib/ops/model.mjs';
import { catStyle, fmtRange, STATUS_LABEL, usePanZoom } from './shared.jsx';
import { wrap } from './mindmap.jsx';
import { useOps } from './store.jsx';

export const DAG_NODE = { w: 240, h: 96, gapX: 72, gapY: 16 };

export function DagSvg({ layout, selected, linking, onSelect, onToggleGroup, node = DAG_NODE }) {
	const pos = new Map(layout.items.map(i => [i.task.id, i]));
	return (
		<g>
			<defs><marker id="ops-arrow" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" className="ops-arrow" /></marker></defs>
			{layout.links.map(l => {
				const a = pos.get(l.source), b = pos.get(l.target);
				if (!a || !b) return null;
				const tb = b.y > a.y + node.h / 2 && Math.abs(b.x - a.x) < node.w;
				const [x1, y1, x2, y2] = tb ? [a.x + node.w / 2, a.y + node.h, b.x + node.w / 2, b.y] : [a.x + node.w, a.y + node.h / 2, b.x, b.y + node.h / 2];
				return <path key={l.id} d={tb ? `M${x1},${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2}` : `M${x1},${y1} C${(x1 + x2) / 2},${y1} ${(x1 + x2) / 2},${y2} ${x2},${y2}`} className="ops-link-path is-dep" markerEnd="url(#ops-arrow)" />;
			})}
			{layout.items.map(({ task: t, x, y }) => {
				const group = t.id.startsWith('G:');
				const lines = wrap(t.title, 34).slice(0, 3);
				return (
					<g key={t.id} transform={`translate(${x},${y})`} data-node={t.id} className={'ops-node is-task' + (group ? ' is-group' : '') + (selected === t.id ? ' is-selected' : '') + (linking === t.id ? ' is-linking' : '')} style={catStyle(t.categoryId)} onClick={() => (group ? onToggleGroup?.(t.phase) : onSelect?.(t.id))}>
						<rect width={node.w} height={node.h} rx="12" />
						<rect width="6" height={node.h} rx="3" className="ops-node-cat" />
						<text x="16" y="18" className="ops-node-id">{group ? `Fase recolhida · ${t.count} tarefas` : `${t.id} · ${STATUS_LABEL[t.status] || t.status}`}</text>
						{lines.map((ln, i) => <text key={i} x="16" y={38 + i * 15}>{ln}</text>)}
						{!group && <text x="16" y={node.h - 8} className="ops-node-id">{fmtRange(t)}{t.dateKind === 'window' ? ' · janela' : ''}</text>}
					</g>
				);
			})}
		</g>
	);
}

// Substitui tarefas de fases recolhidas por um card-grupo; dependências passam a apontar para o grupo.
export function collapsePhases(tasks, deps, collapsed) {
	const groupOf = t => (collapsed.has(t.phase) ? 'G:' + t.phase : t.id);
	const visible = [], seen = new Set();
	for (const t of tasks) {
		const id = groupOf(t);
		if (seen.has(id)) { if (id.startsWith('G:')) visible.find(v => v.id === id).count++; continue; }
		seen.add(id);
		visible.push(id.startsWith('G:') ? { id, title: t.phase, phase: t.phase, count: 1, categoryId: 'outros', plannedStart: t.plannedStart } : t);
	}
	const byId = new Map(tasks.map(t => [t.id, t]));
	const links = new Map();
	for (const d of deps) {
		const a = byId.get(d.predecessorId), b = byId.get(d.successorId);
		if (!a || !b) continue;
		const s = groupOf(a), e = groupOf(b);
		if (s !== e) links.set(s + '>' + e, { id: d.id, predecessorId: s, successorId: e });
	}
	return { tasks: visible, deps: [...links.values()] };
}

export function Workflow({ doc, tasks, openTask, viewState, setViewState }) {
	const { apply } = useOps();
	const direction = viewState.direction || 'LR';
	const collapsed = new Set(viewState.collapsed || []);
	const [selected, setSelected] = React.useState(null);
	const [linking, setLinking] = React.useState(null);
	const [title, setTitle] = React.useState('');
	const box = React.useRef(null);
	const pz = usePanZoom();
	const phases = [...new Set(tasks.map(t => t.phase))];
	const deps = doc.dependencies.filter(d => tasks.some(t => t.id === d.predecessorId) && tasks.some(t => t.id === d.successorId));
	const view = collapsePhases(tasks, deps, collapsed);
	const layout = React.useMemo(() => dagLayout(view.tasks, view.deps, { direction, node: DAG_NODE }), [JSON.stringify(view.deps), view.tasks.length, direction, tasks]);
	const fit = () => { const el = box.current; if (el && layout.items.length) pz.fit(layout.bounds, el.clientWidth, el.clientHeight); };
	React.useEffect(() => { fit(); }, [direction, viewState.collapsed]);
	const toggleGroup = ph => { const s = new Set(collapsed); s.has(ph) ? s.delete(ph) : s.add(ph); setViewState(v => ({ ...v, collapsed: [...s] })); };
	const onSelect = id => {
		if (linking && linking !== id) { apply(d => addDependency(d, linking, id)); setLinking(null); setSelected(id); return; }
		setSelected(id);
	};
	const sel = doc.tasks.find(t => t.id === selected);
	const inbound = sel ? doc.dependencies.filter(d => d.successorId === sel.id) : [];
	const outbound = sel ? doc.dependencies.filter(d => d.predecessorId === sel.id) : [];
	const addSuccessor = () => {
		const r = apply(d => createTask(d, { title, phase: sel.phase, categoryId: sel.categoryId }));
		if (r?.task) { apply(d => addDependency(d, sel.id, r.task.id)); setTitle(''); setSelected(r.task.id); }
	};
	return (
		<div className="ops-map">
			<div className="ops-toolbar">
				<SegmentedControl name="wfdir" value={direction} onChange={v => setViewState(s => ({ ...s, direction: v }))} ariaLabel="Orientação" options={[{ value: 'LR', label: 'Esq → dir' }, { value: 'TB', label: 'Cima → baixo' }]} />
				<div className="ops-phases" role="group" aria-label="Fases">
					{phases.map(ph => <button key={ph} className={'ops-chip' + (collapsed.has(ph) ? ' is-off' : '')} aria-pressed={!collapsed.has(ph)} onClick={() => toggleGroup(ph)}>{collapsed.has(ph) ? '▸ ' : '▾ '}{ph}</button>)}
				</div>
				<span className="text-muted ops-small">{deps.length} dependências · {linking ? `Ligando a partir de ${linking}: clique na sucessora (Esc cancela)` : 'Selecione uma tarefa para ligar ou adicionar'}</span>
			</div>
			<div className={'ops-map-body' + (sel ? ' has-panel' : '')}>
				<div className="ops-canvas" ref={box} {...pz.handlers} tabIndex={0} onKeyDown={e => e.key === 'Escape' && setLinking(null)}>
					<svg width="100%" height="100%" role="img" aria-label="Workflow de tarefas">
						<g transform={`translate(${pz.vp.x},${pz.vp.y}) scale(${pz.vp.k})`}>
							<DagSvg layout={layout} selected={selected} linking={linking} onSelect={onSelect} onToggleGroup={toggleGroup} />
						</g>
					</svg>
					<div className="ops-zoom"><button onClick={() => pz.zoom(1.2)} aria-label="Aproximar">+</button><button onClick={() => pz.zoom(1 / 1.2)} aria-label="Afastar">−</button><button onClick={fit} aria-label="Ajustar">⤢</button></div>
				</div>
				{sel && (
					<aside className="cms-panel ops-panel" aria-label="Detalhes da tarefa">
						<div className="cms-detail-head"><code>{sel.id}</code><Button size="sm" variant="ghost" onClick={() => setSelected(null)}>Fechar</Button></div>
						<h3>{sel.title}</h3>
						<p className="ops-small text-muted">{fmtRange(sel)} · {sel.phase}</p>
						<div className="cms-actions"><Button size="sm" onClick={() => openTask(sel)}>Abrir</Button><Button size="sm" variant="secondary" onClick={() => setLinking(sel.id)}>Ligar a sucessora</Button></div>
						<h4>Depende de</h4>
						{inbound.length ? <ul className="cms-list">{inbound.map(d => <li key={d.id}><code>{d.predecessorId}</code><button className="ops-link" onClick={() => apply(x => removeDependency(x, d.id))}>remover</button></li>)}</ul> : <p className="text-muted ops-small">Nenhuma.</p>}
						<h4>Libera</h4>
						{outbound.length ? <ul className="cms-list">{outbound.map(d => <li key={d.id}><code>{d.successorId}</code><button className="ops-link" onClick={() => apply(x => removeDependency(x, d.id))}>remover</button></li>)}</ul> : <p className="text-muted ops-small">Nenhuma.</p>}
						<div className="ops-form"><TextField label="Nova sucessora" value={title} onChange={e => setTitle(e.target.value)} /><Button size="sm" variant="secondary" disabled={!title.trim()} onClick={addSuccessor}>Adicionar</Button></div>
					</aside>
				)}
			</div>
		</div>
	);
}
