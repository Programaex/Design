// Mapa mental (FR-04/05): árvore por dataset AlsoAsked em SVG vetorial. LR/TB/bilateral sem mudar relações;
// expandir/recolher com badge; zoom/pan/fit; busca expande o caminho; painel de detalhes; lista hierárquica
// sincronizada como alternativa acessível ao canvas. Adicionar filho/irmão e converter em tarefa são comandos distintos.
import React from 'react';
import { Button, SegmentedControl, Tag, TextField } from '../ds.js';
import { childrenMap, pathTo, treeLayout } from '../../../lib/ops/layout.mjs';
import { addNode, convertQuestionToTask } from '../../../lib/ops/model.mjs';
import { usePanZoom } from './shared.jsx';
import { useOps } from './store.jsx';

export const MAP_NODE = { w: 220, h: 56, gapX: 56, gapY: 14 };

export function wrap(text, max = 30) {
	const lines = [];
	let cur = '';
	for (const w of String(text).split(/\s+/)) {
		if ((cur + ' ' + w).trim().length > max && cur) { lines.push(cur); cur = w; }
		else cur = (cur + ' ' + w).trim();
	}
	if (cur) lines.push(cur);
	return lines;
}

const STATUS_TONE = { available: 'success', locked: 'warning', missing: 'neutral' };
const STATUS_TXT = { available: 'Resposta disponível', locked: 'Bloqueada na fonte', missing: 'Sem resposta' };

// SVG puro de um layout de árvore (usado na tela e na impressão).
export function TreeSvg({ layout, selected, highlight = new Set(), onSelect, onToggle, node = MAP_NODE, interactive = true }) {
	const pos = new Map(layout.items.map(i => [i.node.id, i]));
	return (
		<g>
			{layout.links.map(l => {
				const a = pos.get(l.source), b = pos.get(l.target);
				if (!a || !b) return null;
				const tb = Math.abs(b.y - a.y) > Math.abs(b.x - a.x) && Math.abs(b.x - a.x) < node.w;
				const [x1, y1, x2, y2] = tb ? [a.x + node.w / 2, a.y + node.h, b.x + node.w / 2, b.y] : b.x >= a.x ? [a.x + node.w, a.y + node.h / 2, b.x, b.y + node.h / 2] : [a.x, a.y + node.h / 2, b.x + node.w, b.y + node.h / 2];
				const d = tb ? `M${x1},${y1} C${x1},${(y1 + y2) / 2} ${x2},${(y1 + y2) / 2} ${x2},${y2}` : `M${x1},${y1} C${(x1 + x2) / 2},${y1} ${(x1 + x2) / 2},${y2} ${x2},${y2}`;
				return <path key={l.source + l.target} d={d} className="ops-link-path" />;
			})}
			{layout.items.map(it => {
				const n = it.node;
				const lines = wrap(n.title).slice(0, 3);
				const cls = 'ops-node' + (it.depth === 0 ? ' is-root' : '') + (selected === n.id ? ' is-selected' : '') + (highlight.has(n.id) ? ' is-hit' : '') + ' is-' + (n.answerStatus || 'missing');
				return (
					<g key={n.id} transform={`translate(${it.x},${it.y})`} className={cls} data-node={n.id}>
						<rect width={node.w} height={node.h} rx="12" onClick={() => onSelect?.(n.id)} />
						{lines.map((ln, i) => <text key={i} x="12" y={20 + i * 15} onClick={() => onSelect?.(n.id)}>{ln}</text>)}
						{it.hasChildren && interactive && (
							<g className="ops-toggle" transform={`translate(${it.side === -1 ? -12 : node.w - 12},${node.h / 2 - 12})`} onClick={() => onToggle?.(n.id)} role="button" aria-label={it.collapsedCount ? `Expandir (${it.collapsedCount})` : 'Recolher'}>
								<rect width="24" height="24" rx="12" />
								<text x="12" y="16" textAnchor="middle">{it.collapsedCount ? it.collapsedCount : '−'}</text>
							</g>
						)}
						{it.hasChildren && !interactive && it.collapsedCount > 0 && <text x={node.w - 10} y={node.h - 8} textAnchor="end" className="ops-badge-txt">+{it.collapsedCount}</text>}
					</g>
				);
			})}
		</g>
	);
}

function TreeList({ nodes, rootId, expanded, toggle, selected, select }) {
	const kids = React.useMemo(() => childrenMap(nodes), [nodes]);
	const render = id => {
		const n = nodes.find(x => x.id === id);
		const ch = kids.get(id) || [];
		return (
			<li key={id} role="treeitem" aria-expanded={ch.length ? expanded.has(id) : undefined} aria-selected={selected === id}>
				<span className="ops-tree-row">
					{ch.length ? <button className="ops-tree-toggle" onClick={() => toggle(id)} aria-label={expanded.has(id) ? 'Recolher' : 'Expandir'}>{expanded.has(id) ? '▾' : '▸'}</button> : <span className="ops-tree-toggle" />}
					<button className={'ops-link' + (selected === id ? ' is-on' : '')} onClick={() => select(id)}>{n.title}</button>
				</span>
				{ch.length > 0 && expanded.has(id) && <ul role="group">{ch.map(c => render(c.id))}</ul>}
			</li>
		);
	};
	return <ul className="ops-tree" role="tree" aria-label="Lista hierárquica">{render(rootId)}</ul>;
}

export function MindMap({ doc, openTask, viewState, setViewState }) {
	const { apply } = useOps();
	const datasets = doc.datasets;
	const dsId = viewState.datasetId && datasets.some(d => d.id === viewState.datasetId) ? viewState.datasetId : datasets[0]?.id;
	const nodes = doc.nodes.filter(n => n.datasetId === dsId);
	const root = nodes.find(n => !n.parentId);
	const direction = viewState.direction || 'LR';
	const expanded = new Set(viewState.expanded?.[dsId] || (root ? [root.id] : []));
	const selected = viewState.selected?.[dsId] || null;
	const mode = viewState.mode || 'canvas';
	const [q, setQ] = React.useState('');
	const [newTitle, setNewTitle] = React.useState('');
	const box = React.useRef(null);
	const pz = usePanZoom();
	const save = patch => setViewState(v => ({ ...v, ...patch }));
	const setExpanded = s => save({ expanded: { ...(viewState.expanded || {}), [dsId]: [...s] } });
	const select = id => save({ selected: { ...(viewState.selected || {}), [dsId]: id } });
	const toggle = id => { const s = new Set(expanded); s.has(id) ? s.delete(id) : s.add(id); setExpanded(s); };
	const layout = React.useMemo(() => (root ? treeLayout(root.id, nodes, { direction, expanded, node: MAP_NODE }) : null), [root, nodes, direction, viewState.expanded, dsId]);
	const hits = React.useMemo(() => new Set(q.trim().length > 1 ? nodes.filter(n => n.title.toLowerCase().includes(q.toLowerCase())).map(n => n.id) : []), [q, nodes]);
	const fit = () => { const el = box.current; if (el && layout) pz.fit(layout.bounds, el.clientWidth, el.clientHeight); };
	React.useEffect(() => { fit(); }, [dsId, direction]);
	const search = () => {
		const first = [...hits][0];
		if (!first) return;
		const s = new Set(expanded);
		pathTo(nodes, first).slice(0, -1).forEach(id => s.add(id));
		setExpanded(s); select(first);
	};
	const sel = nodes.find(n => n.id === selected);
	const task = sel && doc.tasks.find(t => t.sourceNodeId === sel.id);
	const add = kind => {
		const parentId = kind === 'child' ? sel.id : sel.parentId;
		if (!parentId) return;
		const r = apply(d => addNode(d, { parentId, title: newTitle }));
		if (r?.node) { setNewTitle(''); const s = new Set(expanded); s.add(parentId); setExpanded(s); select(r.node.id); }
	};
	if (!root) return <p className="text-muted">Nenhum dataset importado. Use Importar.</p>;
	return (
		<div className="ops-map">
			<div className="ops-toolbar">
				<label className="field ops-filter"><span className="field-label">Dataset</span><select className="input" value={dsId} onChange={e => save({ datasetId: e.target.value })}>{datasets.map(d => <option key={d.id} value={d.id}>{d.id} · {d.name} ({d.records})</option>)}</select></label>
				<SegmentedControl name="mapdir" value={direction} onChange={v => save({ direction: v })} ariaLabel="Orientação" options={[{ value: 'LR', label: 'Esq → dir' }, { value: 'TB', label: 'Cima → baixo' }, { value: 'bilateral', label: 'Bilateral' }]} />
				<SegmentedControl name="mapmode" value={mode} onChange={v => save({ mode: v })} ariaLabel="Modo" options={[{ value: 'canvas', label: 'Mapa' }, { value: 'list', label: 'Lista' }]} />
				<form className="ops-search" onSubmit={e => { e.preventDefault(); search(); }}><TextField placeholder="Buscar pergunta…" value={q} onChange={e => setQ(e.target.value)} aria-label="Buscar" /><span className="text-muted ops-small">{q.length > 1 ? `${hits.size} resultado(s)` : ''}</span></form>
				<div className="cms-actions">
					<Button size="sm" variant="secondary" onClick={() => setExpanded(new Set(nodes.map(n => n.id)))}>Expandir tudo</Button>
					<Button size="sm" variant="secondary" onClick={() => setExpanded(new Set([root.id]))}>Recolher</Button>
				</div>
			</div>
			<div className={'ops-map-body' + (sel ? ' has-panel' : '')}>
				{mode === 'canvas' ? (
					<div className="ops-canvas" ref={box} {...pz.handlers}>
						<svg width="100%" height="100%" role="img" aria-label={`Mapa ${dsId}`}>
							<g transform={`translate(${pz.vp.x},${pz.vp.y}) scale(${pz.vp.k})`}>
								<TreeSvg layout={layout} selected={selected} highlight={hits} onSelect={select} onToggle={toggle} />
							</g>
						</svg>
						<div className="ops-zoom">
							<button onClick={() => pz.zoom(1.2)} aria-label="Aproximar">+</button>
							<button onClick={() => pz.zoom(1 / 1.2)} aria-label="Afastar">−</button>
							<button onClick={fit} aria-label="Ajustar ao mapa">⤢</button>
							{sel && <button onClick={() => { const it = layout.items.find(i => i.node.id === sel.id); if (it) pz.fit({ x: it.x - 40, y: it.y - 40, width: MAP_NODE.w + 80, height: MAP_NODE.h + 80 }, box.current.clientWidth, box.current.clientHeight); }} aria-label="Ajustar à seleção">◎</button>}
						</div>
						<p className="ops-canvas-hint text-muted">Arraste o fundo para mover · Ctrl + roda para zoom · {layout.items.length}/{nodes.length} nós visíveis</p>
					</div>
				) : <div className="ops-list-wrap"><TreeList nodes={nodes} rootId={root.id} expanded={expanded} toggle={toggle} selected={selected} select={select} /></div>}
				{sel && (
					<aside className="cms-panel ops-panel" aria-label="Detalhes do nó">
						<div className="cms-detail-head"><code>{sel.id}</code><Button size="sm" variant="ghost" onClick={() => select(null)}>Fechar</Button></div>
						<h3>{sel.title}</h3>
						<p><Tag tone={STATUS_TONE[sel.answerStatus]}>{STATUS_TXT[sel.answerStatus]}</Tag> {sel.createdInCms && <Tag tone="accent">Criado no CMS</Tag>} <Tag>Revisão editorial: {sel.editorialReview}</Tag></p>
						{sel.answer ? <p className="ops-answer">{sel.answer}</p> : <p className="text-muted">{sel.answerStatus === 'locked' ? 'A fonte bloqueia esta resposta ("Upgrade to Lite/Pro"). Nada foi preenchido.' : 'Sem resposta na fonte.'}</p>}
						{sel.url && <p className="ops-small"><a href={sel.url} target="_blank" rel="noreferrer">{sel.pageTitle || sel.url}</a></p>}
						{sel.lockedFields?.length > 0 && <p className="ops-small text-muted">Campos bloqueados: {sel.lockedFields.join(', ')}</p>}
						{sel.sourceFile && <p className="ops-small text-muted">Fonte: {sel.sourceFile} · registro {sel.sourceRecord} · posição ({sel.tier1},{sel.tier2})</p>}
						<div className="ops-form">
							<TextField label="Nova pergunta" value={newTitle} onChange={e => setNewTitle(e.target.value)} />
							<div className="cms-actions">
								<Button size="sm" variant="secondary" disabled={!newTitle.trim()} onClick={() => add('child')}>Adicionar filho</Button>
								<Button size="sm" variant="secondary" disabled={!newTitle.trim() || !sel.parentId} onClick={() => add('sibling')}>Adicionar irmão</Button>
							</div>
						</div>
						{task ? <Button size="sm" onClick={() => openTask(task)}>Abrir tarefa {task.id}</Button>
							: <Button size="sm" onClick={() => { const r = apply(d => convertQuestionToTask(d, sel.id)); if (r?.task) openTask(r.task); }}>Converter em tarefa</Button>}
						<p className="ops-small text-muted">Converter cria uma tarefa vinculada (sourceNodeId); a hierarquia do mapa não vira dependência.</p>
					</aside>
				)}
			</div>
		</div>
	);
}
