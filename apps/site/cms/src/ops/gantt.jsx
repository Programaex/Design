// Gantt (FR-12/13/20): tabela fixa + escala dia/semana/mês. Editar datas sincroniza calendário/foco/grafo.
// Mover respeita FS: conflito é mostrado; cascata só depois de confirmar o diff. Sem caminho crítico inventado.
import React from 'react';
import { Button, Dialog, SegmentedControl, Table } from '../ds.js';
import { addDays, diffDays, todayIn } from '../../../lib/ops/calendar.mjs';
import { bar, groupTasks, range, ticks } from '../../../lib/ops/gantt.mjs';
import { cascadeDiff, fsViolations, updateTask } from '../../../lib/ops/model.mjs';
import { catStyle, fmt, StatusTag } from './shared.jsx';
import { useOps } from './store.jsx';

const DAY_PX = { dia: 28, semana: 10, mes: 4 };

function MoveDialog({ task, onClose }) {
	const { doc, apply } = useOps();
	const [shift, setShift] = React.useState(1);
	const start = addDays(task.plannedStart, shift), end = addDays(task.plannedEnd || task.plannedStart, shift);
	const override = { [task.id]: { plannedStart: start, plannedEnd: end } };
	const conflicts = fsViolations(doc, override);
	const diff = cascadeDiff(doc, task.id, start, end);
	const applyMove = all => {
		for (const d of all ? diff : diff.slice(0, 1)) {
			const r = apply(cur => updateTask(cur, d.id, { plannedStart: d.after[0], plannedEnd: d.after[1] }, { author: 'gantt' }));
			if (r?.error) return;
		}
		onClose();
	};
	return (
		<Dialog title={`Mover ${task.id}`} onClose={onClose} actions={<>
			<Button variant="ghost" onClick={onClose}>Cancelar</Button>
			{diff.length > 1 && <Button variant="secondary" onClick={() => applyMove(false)}>Só esta tarefa</Button>}
			<Button onClick={() => applyMove(diff.length > 1)}>{diff.length > 1 ? `Aplicar cascata (${diff.length})` : 'Mover'}</Button>
		</>}>
			<label className="field"><span className="field-label">Deslocar (dias)</span><input className="input" type="number" value={shift} onChange={e => setShift(Number(e.target.value) || 0)} /></label>
			<p>Prévia: {fmt(task.plannedStart)} → <b>{fmt(start)}</b>{task.plannedEnd !== task.plannedStart && <> até <b>{fmt(end)}</b></>}</p>
			{conflicts.length > 0 && <p className="ops-notice is-warning">Viola {conflicts.length} dependência(s) FS: {conflicts.map(c => `${c.predecessorId} → ${c.successorId}`).join(', ')}.</p>}
			{diff.length > 1 && (
				<>
					<p>Diff da cascata proposta (nada é aplicado sem confirmação):</p>
					<Table columns={[{ key: 'id', label: 'ID', render: d => <code>{d.id}</code> }, { key: 'b', label: 'Antes', render: d => d.before.map(fmt).join(' → ') }, { key: 'a', label: 'Depois', render: d => d.after.map(fmt).join(' → ') }]} rows={diff} />
				</>
			)}
		</Dialog>
	);
}

export function Gantt({ doc, tasks, openTask, viewState, setViewState }) {
	const scale = viewState.scale || 'semana';
	const by = viewState.groupBy || 'phase';
	const [moving, setMoving] = React.useState(null);
	const r = range(tasks);
	const { groups, unscheduled } = groupTasks(tasks, by);
	const viol = new Set(fsViolations(doc).flatMap(d => [d.predecessorId, d.successorId]));
	const deps = doc.dependencies.filter(d => tasks.some(t => t.id === d.predecessorId) && tasks.some(t => t.id === d.successorId));
	const total = r ? diffDays(r.from, r.to) + 1 : 0;
	const width = total * DAY_PX[scale];
	const today = todayIn();
	return (
		<div className="ops-gantt-wrap">
			<div className="ops-toolbar">
				<SegmentedControl name="gscale" value={scale} onChange={v => setViewState(s => ({ ...s, scale: v }))} ariaLabel="Escala" options={[{ value: 'dia', label: 'Dia' }, { value: 'semana', label: 'Semana' }, { value: 'mes', label: 'Mês' }]} />
				<label className="field ops-filter"><span className="field-label">Agrupar por</span><select className="input" value={by} onChange={e => setViewState(s => ({ ...s, groupBy: e.target.value }))}><option value="phase">Fase</option><option value="campaign">Campanha</option><option value="owner">Responsável</option></select></label>
				<span className="text-muted ops-small">{deps.length} dependências FS · caminho crítico não calculado (durações e dependências incompletas)</span>
			</div>
			{!r ? <p className="text-muted">Nenhuma tarefa agendada com os filtros atuais.</p> : (
				<div className="ops-gantt" role="table" aria-label="Gantt">
					<div className="ops-gantt-scroll">
						<div className="ops-gantt-head" role="row">
							<div className="ops-gantt-fixed" role="columnheader">Tarefa · responsável · status</div>
							<div className="ops-gantt-scale" style={{ width }}>
								{ticks(r, scale).map(t => <span key={t} style={{ left: (diffDays(r.from, t) / total) * width }}>{scale === 'mes' ? t.slice(5, 7) + '/' + t.slice(2, 4) : fmt(t).slice(0, 5)}</span>)}
								{today >= r.from && today <= r.to && <i className="ops-today" style={{ left: (diffDays(r.from, today) / total) * width }} title="Hoje" />}
							</div>
						</div>
						{groups.map(g => (
							<React.Fragment key={g.name}>
								<div className="ops-gantt-group" role="row"><div className="ops-gantt-fixed">{g.name} <span className="text-muted">({g.tasks.length})</span></div><div style={{ width }} /></div>
								{g.tasks.map(t => {
									const b = bar(t, r);
									return (
										<div key={t.id} className="ops-gantt-row" role="row">
											<div className="ops-gantt-fixed" role="cell">
												<button className="ops-link" onClick={() => openTask(t)}><code>{t.id}</code> {t.title}</button>
												<span className="ops-gantt-meta">{t.ownerId || 'Sem responsável'} · <StatusTag status={t.status} /></span>
											</div>
											<div className="ops-gantt-track" style={{ width }} role="cell">
												<button className={'ops-gantt-bar' + (b.milestone ? ' is-milestone' : '') + (t.dateKind === 'window' ? ' is-window' : '') + (viol.has(t.id) ? ' is-conflict' : '')} style={{ left: b.left * width, width: b.milestone ? 14 : Math.max(6, b.width * width), ...catStyle(t.categoryId) }}
													onClick={() => setMoving(t)} title={`${t.title}: ${fmt(t.plannedStart)} → ${fmt(t.plannedEnd)}${t.dateKind === 'window' ? ' (janela)' : ''}. Clique para mover.`}
													aria-label={`Mover ${t.id}`} />
											</div>
										</div>
									);
								})}
							</React.Fragment>
						))}
					</div>
				</div>
			)}
			{unscheduled.length > 0 && (
				<section className="cms-panel"><h2>Não agendadas ({unscheduled.length})</h2>
					<ul className="cms-list">{unscheduled.map(t => <li key={t.id}><code>{t.id}</code><button className="ops-link" onClick={() => openTask(t)}>{t.title}</button><StatusTag status={t.status} /></li>)}</ul>
				</section>
			)}
			{moving && <MoveDialog task={moving} onClose={() => setMoving(null)} />}
		</div>
	);
}
