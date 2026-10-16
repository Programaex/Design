// Completude dinâmica (macro → meso → micro) e Kanban com os estados do ADR.
// Um micro conta como concluído quando chega a PUBLICADO, MEDIDO ou RECICLAR.
import React from 'react';
import { Button, KanbanCard, ProgressRing, SegmentedControl, Tag } from '../ds.js';
import { DONE_STATES, go } from '../store.js';
import { progressOf, stateOf } from '../progress.js';
import { previewPath } from './routes.jsx';

const setState = (setProgress, ids, state) =>
	setProgress(p => ({ ...p, state: { ...(p.state || {}), ...Object.fromEntries(ids.map(id => [id, state])) }, updatedAt: new Date().toISOString() }));

export function Completeness({ data, progress, setProgress, focus }) {
	const p = progressOf(data, progress);
	const [open, setOpen] = React.useState(focus || null);
	return (
		<div className="cms-page">
			<header className="cms-head"><div><span className="cms-kicker">Lançamento = 100%</span><h1>Completude</h1>
				<p className="text-muted">Para chegar a 100%, cada bloco de cada rota precisa ter lorem, placeholders e imagens substituídos. Marque o micro quando ele for publicado: os percentuais de meso e macro recalculam na hora.</p></div>
				<ProgressRing value={p.pct} size={96} stroke={8} label="Completude geral" /></header>
			<p className="cms-summary"><b>{Math.round(p.pct)}%</b> geral · {p.done}/{p.total} micros · {data.routes.length} mesos (rotas) · {data.completeness.length} macros (grupos)</p>
			{data.completeness.map((m, mi) => {
				const ms = p.macros[mi];
				const isOpen = open === m.id;
				return (
					<section key={m.id} className="cms-panel cms-macro">
						<button className="cms-macro-head" aria-expanded={isOpen} onClick={() => setOpen(isOpen ? null : m.id)}>
							<ProgressRing value={ms.pct} size={48} stroke={5} label={m.title} />
							<b>{m.title}</b><span className="text-muted">{ms.done}/{ms.total} micros · {m.mesos.length} rotas</span><i className={'ph ' + (isOpen ? 'ph-caret-up' : 'ph-caret-down')} />
						</button>
						{isOpen && m.mesos.map((s, si) => {
							const ss = ms.mesos[si];
							const allIds = s.micros.map(x => x.id);
							return (
								<div key={s.id} className="cms-meso">
									<div className="cms-meso-head">
										<ProgressRing value={ss.pct} size={36} stroke={4} label={s.title} />
										<div><b>{s.title}</b> <code>{s.url}</code></div>
										<div className="cms-actions">
											<Button size="sm" variant="ghost" href={previewPath(s.url)} target="_blank">Ver rota</Button>
											<Button size="sm" variant="secondary" onClick={() => setState(setProgress, allIds, ss.done === ss.total ? 'CAPTURADO' : 'PUBLICADO')}>{ss.done === ss.total ? 'Reabrir tudo' : 'Concluir tudo'}</Button>
										</div>
									</div>
									<ul className="cms-micros">
										{s.micros.map(x => {
											const st = stateOf(progress, x.id), done = DONE_STATES.has(st);
											return (
												<li key={x.id}>
													<label><input type="checkbox" checked={done} onChange={e => setState(setProgress, [x.id], e.target.checked ? 'PUBLICADO' : 'QA')} /> {x.title}</label>
													<Tag tone={done ? 'success' : st === 'CAPTURADO' ? 'neutral' : 'accent'}>{st}</Tag>
												</li>
											);
										})}
									</ul>
								</div>
							);
						})}
					</section>
				);
			})}
		</div>
	);
}

export function Kanban({ data, progress, setProgress }) {
	const [macro, setMacro] = React.useState(data.completeness[0].id);
	const [meso, setMeso] = React.useState('todas');
	const [drag, setDrag] = React.useState(null);
	const m = data.completeness.find(x => x.id === macro);
	const cards = m.mesos.filter(s => meso === 'todas' || s.id === meso).flatMap(s => s.micros.map(x => ({ ...x, meso: s })));
	const p = progressOf(data, progress);
	const mp = p.macros.find(x => x.id === macro);
	const move = (id, dir) => {
		const i = data.adrStates.indexOf(stateOf(progress, id));
		const next = data.adrStates[Math.max(0, Math.min(data.adrStates.length - 1, i + dir))];
		setState(setProgress, [id], next);
	};
	return (
		<div className="cms-page cms-kanban-page">
			<header className="cms-head"><div><span className="cms-kicker">ADR · estados</span><h1>Kanban</h1>
				<p className="text-muted">Arraste os cartões entre colunas (ou use ‹ ›). Ao chegar em PUBLICADO, o micro conta na completude.</p></div>
				<div className="cms-actions"><ProgressRing value={mp.pct} size={56} label={'Completude de ' + m.title} /><Button size="sm" variant="secondary" onClick={() => go('completude/' + macro)}>Ver completude</Button></div></header>
			<div className="cms-toolbar">
				<label className="field"><span className="field-label">Macro</span><select className="input" value={macro} onChange={e => { setMacro(e.target.value); setMeso('todas'); }}>{data.completeness.map(x => <option key={x.id} value={x.id}>{x.title}</option>)}</select></label>
				<label className="field"><span className="field-label">Meso (rota)</span><select className="input" value={meso} onChange={e => setMeso(e.target.value)}><option value="todas">Todas as rotas</option>{m.mesos.map(s => <option key={s.id} value={s.id}>{s.title}</option>)}</select></label>
				<span className="text-muted">{cards.length} cartões</span>
			</div>
			<div className="cms-board">
				{data.adrStates.map(col => {
					const list = cards.filter(c => stateOf(progress, c.id) === col);
					return (
						<section key={col} className={'cms-col-kb' + (DONE_STATES.has(col) ? ' is-done' : '')}
							onDragOver={e => e.preventDefault()} onDrop={() => { if (drag) setState(setProgress, [drag], col); setDrag(null); }}>
							<h3>{col} <span className="text-muted">{list.length}</span></h3>
							{list.map(c => (
								<KanbanCard key={c.id} id={c.id} context={c.meso.title} title={c.title.split(':')[0]} done={DONE_STATES.has(col)} draggable onDragStart={() => setDrag(c.id)}>
									<div className="kb-move"><button aria-label="Voltar estado" onClick={() => move(c.id, -1)}>‹</button><button aria-label="Avançar estado" onClick={() => move(c.id, 1)}>›</button></div>
								</KanbanCard>
							))}
						</section>
					);
				})}
			</div>
		</div>
	);
}
