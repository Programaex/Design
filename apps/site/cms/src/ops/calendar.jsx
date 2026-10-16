// Calendário de conteúdo (FR-09/10/11): agenda, dia, semana útil, semana e mês sobre os mesmos registros.
// Todos os compromissos atuais são de dia inteiro: nenhum horário é inventado. Janela editorial ≠ data exata.
import React from 'react';
import { Button, SegmentedControl, TextField } from '../ds.js';
import { addDays, agenda, eventsOn, monthGrid, todayIn, viewDays, weekSegments } from '../../../lib/ops/calendar.mjs';
import { createTask } from '../../../lib/ops/model.mjs';
import { CATEGORIES } from '../../../lib/ops/editorial.mjs';
import { catLabel, catStyle, fmt, Legend, StatusTag } from './shared.jsx';
import { useOps } from './store.jsx';

const DOW = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const dow = d => DOW[new Date(d + 'T12:00:00Z').getUTCDay()];

// Mês em semanas: cada compromisso vira um segmento contínuo (janelas não se repetem por dia).
// Tela: até maxLanes pistas por semana com "+N" para expandir. Impressão: todas as pistas, sem omissão.
export function MonthWeeks({ year, month, events, taskOf, onOpen, onCreate, print = false, maxLanes = 4 }) {
	const [open, setOpen] = React.useState({});
	const weeks = monthGrid(year, month);
	const today = todayIn();
	return (
		<div className={print ? 'print-month' : 'ops-month'} role="grid" aria-label={`${MONTHS[month - 1]} de ${year}`}>
			<div className="ops-month-head" role="row">{weeks[0].map(d => <div key={d.date} role="columnheader">{dow(d.date)}</div>)}</div>
			{weeks.map((w, i) => {
				const days = w.map(d => d.date);
				const { segments, lanes } = weekSegments(events, days);
				const cap = print || open[i] ? lanes : Math.min(lanes, maxLanes);
				const hidden = segments.filter(sg => sg.lane >= cap);
				return (
					<div key={i} className="ops-mweek" role="row" style={{ gridTemplateRows: `auto repeat(${cap}, auto) auto` }}>
						{w.map((d, c) => <div key={d.date} className={'ops-mcell' + (d.inMonth ? '' : ' is-out') + (d.date === today && !print ? ' is-today' : '')} style={{ gridColumn: c + 1 }} role="gridcell" />)}
						{w.map((d, c) => (
							<div key={'n' + d.date} className="ops-mday" style={{ gridColumn: c + 1, gridRow: 1 }}>
								{print ? <span className="ops-cell-day">{Number(d.date.slice(8))}</span> : <button className="ops-cell-day" onClick={() => onCreate?.(d.date)} aria-label={`Criar em ${fmt(d.date)}`}>{Number(d.date.slice(8))}</button>}
							</div>
						))}
						{segments.filter(sg => sg.lane < cap).map(sg => (
							<div key={sg.event.id} className="ops-mseg" style={{ gridColumn: `${sg.col + 1} / span ${sg.span}`, gridRow: sg.lane + 2 }}>
								<EventCard ev={sg.event} task={taskOf(sg.event.taskId)} onOpen={onOpen} print={print} cont={{ before: sg.continuesBefore, after: sg.continuesAfter }} />
							</div>
						))}
						{!print && (hidden.length > 0 || open[i]) && <button className="ops-more" style={{ gridColumn: '1 / -1', gridRow: cap + 2 }} onClick={() => setOpen(o => ({ ...o, [i]: !o[i] }))}>{open[i] ? 'Mostrar menos' : `+${hidden.length} nesta semana`}</button>}
					</div>
				);
			})}
		</div>
	);
}

export function EventCard({ ev, task, onOpen, compact, cont, print }) {
	const El = print ? 'div' : 'button';
	return (
		<El className={'ops-ev' + (ev.kind === 'window' ? ' is-window' : '') + (compact ? ' is-compact' : '')} style={catStyle(ev.categoryId)} onClick={print ? undefined : () => onOpen(task)}
			title={`${ev.title} · ${catLabel(ev.categoryId)} · ${ev.kind === 'window' ? 'janela' : 'data exata'} ${fmt(ev.dateStart)}${ev.dateEnd !== ev.dateStart ? ' → ' + fmt(ev.dateEnd) : ''}`}>
			<span className="ops-ev-meta">{cont?.before && '‹ '}{ev.kind === 'window' ? 'Janela' : 'Dia inteiro'} · {catLabel(ev.categoryId)}{cont?.after && ' ›'}</span>
			<span className="ops-ev-title">{ev.title}</span>
			{task && task.status !== 'unconfirmed' && <StatusTag status={task.status} />}
		</El>
	);
}

function NewTask({ date, onClose }) {
	const { apply } = useOps();
	const [f, setF] = React.useState({ title: '', plannedStart: date, plannedEnd: date, dateKind: 'exact', categoryId: 'blog' });
	const set = k => e => setF(x => ({ ...x, [k]: e.target.value }));
	return (
		<form className="cms-panel ops-new" onSubmit={e => { e.preventDefault(); const r = apply(d => createTask(d, f)); if (!r?.error) onClose(); }}>
			<TextField label="Novo compromisso" value={f.title} onChange={set('title')} required autoFocus />
			<TextField label="Início" type="date" value={f.plannedStart} onChange={set('plannedStart')} />
			<TextField label="Fim" type="date" value={f.plannedEnd} onChange={set('plannedEnd')} />
			<label className="field"><span className="field-label">Tipo</span><select className="input" value={f.dateKind} onChange={set('dateKind')}><option value="exact">Data exata</option><option value="window">Janela</option></select></label>
			<label className="field"><span className="field-label">Categoria</span><select className="input" value={f.categoryId} onChange={set('categoryId')}>{CATEGORIES.map(c => <option key={c.id} value={c.id}>{c.label}</option>)}</select></label>
			<div className="cms-actions"><Button type="submit" size="sm">Criar</Button><Button size="sm" variant="ghost" onClick={onClose}>Cancelar</Button></div>
		</form>
	);
}

export function Calendar({ doc, tasks, openTask, viewState, setViewState }) {
	const ids = new Set(tasks.map(t => t.id));
	const events = doc.events.filter(e => ids.has(e.taskId));
	const taskOf = id => doc.tasks.find(t => t.id === id);
	const first = events.map(e => e.dateStart).sort()[0] || todayIn();
	const view = viewState.view || 'mes';
	const anchor = viewState.anchor || first;
	const set = patch => setViewState(v => ({ ...v, ...patch }));
	const [creating, setCreating] = React.useState(null);
	const step = { dia: 1, 'semana-util': 7, semana: 7, agenda: 30 }[view];
	const move = dir => {
		if (view === 'mes') { const [y, m] = anchor.split('-').map(Number); const d = new Date(Date.UTC(y, m - 1 + dir, 1, 12)); set({ anchor: d.toISOString().slice(0, 10) }); }
		else set({ anchor: addDays(anchor, dir * step) });
	};
	const [y, m] = anchor.split('-').map(Number);
	const title = view === 'mes' ? `${MONTHS[m - 1]} de ${y}` : view === 'agenda' ? `Agenda a partir de ${fmt(anchor)}` : view === 'dia' ? `${dow(anchor)}, ${fmt(anchor)}` : `${fmt(viewDays(view, anchor)[0])} – ${fmt(viewDays(view, anchor).at(-1))}`;
	const open = t => t && openTask(t);

	let body;
	if (view === 'mes') {
		body = <MonthWeeks year={y} month={m} events={events} taskOf={taskOf} onOpen={open} onCreate={setCreating} />;
	} else if (view === 'agenda') {
		const list = agenda(events, anchor, addDays(anchor, 60));
		const byDay = list.reduce((acc, ev) => ((acc[ev.dateStart] ||= []).push(ev), acc), {});
		body = (
			<div className="ops-agenda">
				{Object.keys(byDay).length ? Object.entries(byDay).map(([day, evs]) => (
					<section key={day}><h3>{dow(day)}, {fmt(day)}</h3>{evs.map(ev => <EventCard key={ev.id} ev={ev} task={taskOf(ev.taskId)} onOpen={open} />)}</section>
				)) : <p className="text-muted">Nenhum compromisso nos próximos 60 dias.</p>}
			</div>
		);
	} else {
		const days = viewDays(view, anchor);
		const { segments, lanes } = weekSegments(events, days);
		body = (
			<div className="ops-week" style={{ '--days': days.length }}>
				<div className="ops-week-head">{days.map(d => <div key={d} className={d === todayIn() ? 'is-today' : ''}><button className="ops-cell-day" onClick={() => setCreating(d)}>{dow(d)} {fmt(d).slice(0, 5)}</button></div>)}</div>
				<div className="ops-allday" style={{ gridTemplateRows: `repeat(${Math.max(1, lanes)}, auto)` }} aria-label="Dia inteiro">
					{segments.map(s => (
						<div key={s.event.id} style={{ gridColumn: `${s.col + 1} / span ${s.span}`, gridRow: s.lane + 1 }}>
							<EventCard ev={s.event} task={taskOf(s.event.taskId)} onOpen={open} cont={{ before: s.continuesBefore, after: s.continuesAfter }} />
						</div>
					))}
					{!segments.length && <p className="text-muted ops-small" style={{ gridColumn: '1 / -1' }}>Sem compromissos neste período.</p>}
				</div>
				<p className="text-muted ops-small">Grade horária vazia: os registros atuais são de dia inteiro ou janelas editoriais, sem hora informada.</p>
			</div>
		);
	}

	return (
		<div className="ops-cal">
			<div className="ops-toolbar">
				<div className="cms-actions">
					<Button size="sm" variant="secondary" onClick={() => move(-1)} aria-label="Anterior">‹</Button>
					<Button size="sm" variant="secondary" onClick={() => set({ anchor: todayIn() })}>Hoje</Button>
					<Button size="sm" variant="secondary" onClick={() => move(1)} aria-label="Próximo">›</Button>
					<b className="ops-cal-title">{title}</b>
				</div>
				<SegmentedControl name="calview" value={view} onChange={v => set({ view: v })} ariaLabel="Visualização" options={[{ value: 'agenda', label: 'Agenda' }, { value: 'dia', label: 'Dia' }, { value: 'semana-util', label: 'Semana útil' }, { value: 'semana', label: 'Semana' }, { value: 'mes', label: 'Mês' }]} />
			</div>
			<Legend ids={[...new Set(events.map(e => e.categoryId))]} />
			{creating && <NewTask date={creating} onClose={() => setCreating(null)} />}
			{body}
		</div>
	);
}
