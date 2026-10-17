import React from 'react';
import { computeKpis, dueOf, fmtDate, fmtDay, groupRows, isBlocked, isDone, isLate, lacunas, milestonesWithDays, range, upcoming } from '../lib/kpis.mjs';
import { Button, Dialog, Tag } from './ds.js';
import { Gantt } from './gantt.jsx';

const statusTag = (i, today, byNumber) =>
	isDone(i) ? <Tag tone="success">concluída</Tag>
		: isLate(i, today) ? <Tag tone="danger">atrasada</Tag>
			: isBlocked(i, byNumber) ? <Tag tone="warning">bloqueada</Tag>
				: <Tag tone="neutral">aberta</Tag>;

export function Detail({ item, onClose, byNumber, today }) {
	if (!item) return null;
	const blocker = item.blockedBy ? byNumber.get(item.blockedBy) : null;
	return (
		<Dialog title={`${item.alias || ''} #${item.number}`} onClose={onClose} actions={<><Button variant="secondary" onClick={onClose}>Fechar</Button><Button href={item.url} target="_blank" rel="noopener">Abrir no GitHub</Button></>}>
			<h3 className="detail-title">{item.title}</h3>
			<dl className="detail">
				<dt>Status</dt><dd>{statusTag(item, today, byNumber)}</dd>
				<dt>Início → Prazo</dt><dd>{fmtDate(item.start)} → {item.due ? fmtDate(item.due) : `a definir${item.dueWindow ? ` (janela até ${fmtDate(item.dueWindow[1])})` : ''}`}</dd>
				<dt>Frente</dt><dd>{item.frente || '—'}</dd>
				<dt>Owner</dt><dd>{item.owner}{item.co?.length ? ` · co: ${item.co.join(', ')}` : ''}</dd>
				{item.prioridade && <><dt>Prioridade</dt><dd>{item.prioridade}</dd></>}
				{item.horas && <><dt>Tempo estimado</dt><dd>{String(item.horas).replace('.', ',')} h</dd></>}
				<dt>Passos</dt><dd>{item.checks?.total ? `${item.checks.done}/${item.checks.total} marcados` : '—'}</dd>
				{blocker && <><dt>Bloqueada por</dt><dd>#{blocker.number} {blocker.title} ({isDone(blocker) ? 'concluída' : 'aberta'})</dd></>}
				{item.lacunas?.length > 0 && <><dt>Lacunas</dt><dd>{item.lacunas.join('; ')}</dd></>}
				<dt>Fonte</dt><dd>{item.origin === 'github' ? 'GitHub ao vivo' : 'snapshot do workbook'}{item.outsideSnapshot ? ' · fora do snapshot' : ''}</dd>
			</dl>
		</Dialog>
	);
}

export function KpiRow({ kpis, onDrill, drill }) {
	return (
		<div className="kpis">
			{kpis.map(k => (
				<button key={k.id} type="button" className={'kpi' + (drill === k.id ? ' is-on' : '')} title={'Regra: ' + k.rule} onClick={() => onDrill(drill === k.id ? null : k.id)} disabled={!k.numbers.length}>
					<span className="kpi-label">{k.label}</span>
					<b>{k.value}</b>
					<span className="kpi-sub">{k.sub}</span>
				</button>
			))}
		</div>
	);
}

function ItemTable({ items, today, byNumber, onPick }) {
	return (
		<table className="tbl">
			<thead><tr><th>Item</th><th>Título</th><th>Prazo</th><th>Status</th></tr></thead>
			<tbody>
				{items.map(i => (
					<tr key={i.number} onClick={() => onPick(i)}>
						<td className="mono">{i.alias || '#' + i.number}</td>
						<td>{i.title}</td>
						<td className="mono">{dueOf(i) ? fmtDay(dueOf(i)) : 'a definir'}{!i.due && i.dueWindow ? '*' : ''}</td>
						<td>{statusTag(i, today, byNumber)}</td>
					</tr>
				))}
			</tbody>
		</table>
	);
}

function SoloCampaign({ solo, today }) {
	return (
		<section className="panel">
			<h2>Solo Campaign System <small>{solo.source}</small></h2>
			<p className="note">{solo.model}</p>
			<div className="banner warn"><i className="ph ph-warning" /> <span><b>Conflito de calendário a decidir.</b> {solo.conflict}</span></div>
			<h3>Cadência de janelas (PDF)</h3>
			<Gantt extra={solo.cadence} from="2026-10-10" to="2026-12-31" today={today} milestones={[{ date: '2026-11-05', label: 'Lançamento (plano)' }, { date: '2026-12-05', label: 'Fim do ciclo (plano)' }]} width={1000} labelW={200} />
			<div className="grid2">
				<div>
					<h3>Sprint de 10 dias · caminho crítico {solo.criticalPath.join(' → ')}</h3>
					<table className="tbl">
						<thead><tr><th>Dia</th><th>Blocos</th><th>Tarefa</th><th>Pronto quando</th></tr></thead>
						<tbody>{solo.sprint.map(d => <tr key={d.day} className={d.checkpoint ? 'is-cp' : ''}><td className="mono">{d.day}{d.checkpoint ? ` · CP ${d.checkpoint}` : ''}</td><td className="mono">{d.blocks}</td><td>{d.tasks}</td><td>{d.done}</td></tr>)}</tbody>
					</table>
					{solo.checkpoints.map(c => <p key={c.id} className="note"><b>Checkpoint {c.id} ({c.day}):</b> {c.rule}</p>)}
				</div>
				<div>
					<h3>Matriz de 27 peças (MoSCoW)</h3>
					<table className="tbl">
						<thead><tr><th>Peça</th><th>Qtd</th><th>Origem</th><th>Prioridade</th></tr></thead>
						<tbody>{solo.matrix.map(m => <tr key={m.fragment}><td>{m.fragment}</td><td className="mono">{m.qty}</td><td>{m.from}</td><td><Tag tone={m.priority === 'Must' ? 'accent' : m.priority === 'Should' ? 'neutral' : 'outline'}>{m.priority}</Tag></td></tr>)}</tbody>
					</table>
					<p className="note">{solo.matrixNote} {solo.cutOrder}</p>
					<h3>Decisões antes do dia 1 (defaults)</h3>
					<ul className="plain">{solo.decisions.map(d => <li key={d.name}><b>{d.name}:</b> {d.default}</li>)}</ul>
				</div>
			</div>
		</section>
	);
}

export function Dashboard({ view, data, today, solo }) {
	const [pick, setPick] = React.useState(null);
	const [drill, setDrill] = React.useState(null);
	const items = data.items;
	const byNumber = React.useMemo(() => new Map(items.map(i => [i.number, i])), [items]);
	const kpis = computeKpis(items, view, today);
	const rows = groupRows(items, view);
	const { from, to } = range(items, view);
	const next = upcoming(items, today, 14);
	const nextStart = items.filter(i => !isDone(i) && i.start > today).sort((a, b) => a.start.localeCompare(b.start))[0];
	const gaps = lacunas(items);
	const gates = items.filter(i => i.type === 'gate').sort((a, b) => (dueOf(a) || '').localeCompare(dueOf(b) || ''));
	const drilled = drill ? items.filter(i => kpis.find(k => k.id === drill).numbers.includes(i.number)) : null;
	const e = data.epic;

	return (
		<>
			<header className="page-head">
				<div>
					<span className="kicker">{e.id} · <a href={e.url} target="_blank" rel="noopener">#{e.number} no GitHub</a></span>
					<h1>{view.label}</h1>
					<p>{view.objective}</p>
					<div className="tags">
						<Tag tone="accent">owner:{e.owner}</Tag>
						{(e.co || []).map(c => <Tag key={c} tone="outline">co:{c}</Tag>)}
						<Tag tone="neutral">{fmtDate(e.start)} → {fmtDate(e.due)}</Tag>
					</div>
				</div>
				<div className="milestones">
					{milestonesWithDays(view, today).map(m => (
						<div key={m.date} className={'milestone' + (m.days < 0 ? ' is-past' : '')}>
							<b>{m.days < 0 ? 'feito' : m.days === 0 ? 'hoje' : `${m.days} d`}</b>
							<span>{fmtDay(m.date)} · {m.label}</span>
						</div>
					))}
				</div>
			</header>
			{data.warnings?.map(w => <div key={w} className="banner"><i className="ph ph-info" /> {w}</div>)}
			<KpiRow kpis={kpis} drill={drill} onDrill={setDrill} />
			{drilled && (
				<section className="panel">
					<h2>{kpis.find(k => k.id === drill).label} <small>{kpis.find(k => k.id === drill).rule}</small></h2>
					<ItemTable items={drilled} today={today} byNumber={byNumber} onPick={setPick} />
				</section>
			)}
			<section className="panel">
				<h2>Cronograma <small>barras = issues · losangos = pontos de decisão · linha vermelha = hoje</small></h2>
				<div className="scroll-x"><Gantt rows={rows} from={from} to={to} today={today} milestones={view.milestones} onPick={setPick} width={1100} labelW={340} /></div>
			</section>
			<div className="grid2">
				<section className="panel">
					<h2>Próximos 14 dias <small>abertas em andamento, com início no período ou atrasadas</small></h2>
					{next.length ? <ItemTable items={next} today={today} byNumber={byNumber} onPick={setPick} /> : <p className="note">Nada no período.{nextStart ? <> Próximo início: {fmtDay(nextStart.start)} · <button type="button" className="link" onClick={() => setPick(nextStart)}>{nextStart.alias || '#' + nextStart.number}</button> {nextStart.title}.</> : ''}</p>}
				</section>
				<section className="panel">
					<h2>Pontos de decisão</h2>
					<ItemTable items={gates} today={today} byNumber={byNumber} onPick={setPick} />
					<h2 className="mt">Lacunas abertas <small>informação que falta; não preenchida por estimativa</small></h2>
					{gaps.length ? <ul className="plain">{gaps.map((g, k) => <li key={k}><button type="button" className="link" onClick={() => setPick(byNumber.get(g.number))}>{g.alias || '#' + g.number}</button> {g.text}</li>)}</ul> : <p className="note">Nenhuma lacuna aberta.</p>}
				</section>
			</div>
			{view.withSoloCampaign && solo && <SoloCampaign solo={solo} today={today} />}
			<Detail item={pick} onClose={() => setPick(null)} byNumber={byNumber} today={today} />
		</>
	);
}
