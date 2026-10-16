// Dashboard (REF-001 / FR-16): KPIs operacionais com numerador/denominador, fonte, período e drill-down.
// KPIs comerciais ficam N/D até existir contrato de fonte (Q-03). Denominador zero → N/D, nunca 0%.
import React from 'react';
import { Table, TextField } from '../ds.js';
import { fsViolations } from '../../../lib/ops/model.mjs';
import { todayIn } from '../../../lib/ops/calendar.mjs';
import { catLabel, catStyle, fmtRange, StatusTag, STATUS_LABEL } from './shared.jsx';

const inPeriod = (t, from, to) => t.plannedStart && t.plannedStart <= to && (t.plannedEnd || t.plannedStart) >= from;
const pct = (n, d) => (d ? `${Math.round((n / d) * 100)}%` : 'N/D');

export function Dashboard({ doc, tasks, openTask }) {
	const dates = doc.tasks.filter(t => t.plannedStart);
	const [from, setFrom] = React.useState(() => dates.map(t => t.plannedStart).sort()[0] || todayIn());
	const [to, setTo] = React.useState(() => dates.map(t => t.plannedEnd || t.plannedStart).sort().at(-1) || todayIn());
	const [drill, setDrill] = React.useState(null);
	const today = todayIn();
	const scoped = tasks.filter(t => inPeriod(t, from, to));
	const viol = new Set(fsViolations(doc).map(d => d.successorId));
	const sets = {
		concluidas: scoped.filter(t => t.status === 'completed'),
		atrasadas: scoped.filter(t => t.plannedEnd && t.plannedEnd < today && !['completed', 'unconfirmed'].includes(t.status)),
		naoConfirmadas: scoped.filter(t => t.status === 'unconfirmed'),
		publicacoes: scoped.filter(t => t.dateKind === 'exact'),
		janelas: scoped.filter(t => t.dateKind === 'window'),
		bloqueios: scoped.filter(t => ['blocked', 'error'].includes(t.status) || viol.has(t.id)),
		revisao: scoped.filter(t => t.flags?.length),
	};
	const updated = doc.history.map(h => h.at).filter(Boolean).sort().at(-1);
	const source = `Documento ops · revisão ${doc.revision}${updated ? ' · atualizado ' + new Date(updated).toLocaleString('pt-BR') : ' · dados do seed'}`;
	const kpis = [
		['concluidas', 'Tarefas concluídas', sets.concluidas.length, `${pct(sets.concluidas.length, scoped.length)} de ${scoped.length} no período`, 'status = concluída'],
		['atrasadas', 'Em atraso', sets.atrasadas.length, `fim < ${today.split('-').reverse().join('/')}, status conhecido e não concluídas`, 'plannedEnd anterior a hoje; não confirmadas ficam fora'],
		['naoConfirmadas', 'Execução não confirmada', sets.naoConfirmadas.length, 'a fonte não informa se foi executada', 'status = unconfirmed'],
		['publicacoes', 'Publicações (data exata)', sets.publicacoes.length, `${sets.janelas.length} janelas contadas à parte`, 'dateKind = exata'],
		['bloqueios', 'Bloqueios', sets.bloqueios.length, 'bloqueadas, com erro ou dependência FS violada', 'status + dependências'],
		['revisao', 'Pendências de fonte', sets.revisao.length, 'títulos [cortado] e realocações a revisar', 'quality_flags'],
	];
	const research = { total: doc.nodes.length, locked: doc.nodes.filter(n => n.answerStatus === 'locked').length, available: doc.nodes.filter(n => n.answerStatus === 'available').length };
	// Gráfico: tarefas por semana (início) e categoria.
	const weeks = [...new Set(scoped.map(t => t.phase || 'Sem fase'))];
	const cats = [...new Set(scoped.map(t => t.categoryId))];
	const max = Math.max(1, ...weeks.map(w => scoped.filter(t => (t.phase || 'Sem fase') === w).length));
	const byStatus = Object.keys(STATUS_LABEL).map(s => [s, scoped.filter(t => t.status === s).length]).filter(([, n]) => n);
	const list = drill ? sets[drill] : scoped;
	return (
		<div className="ops-dash">
			<div className="ops-toolbar">
				<TextField label="De" type="date" value={from} onChange={e => setFrom(e.target.value)} />
				<TextField label="Até" type="date" value={to} onChange={e => setTo(e.target.value)} />
				<p className="text-muted ops-small">Fonte: {source}. Período: {from.split('-').reverse().join('/')} a {to.split('-').reverse().join('/')}.</p>
			</div>
			<section className="ops-kpis">
				{kpis.map(([id, label, n, sub, rule]) => (
					<button key={id} className={'ops-kpi' + (drill === id ? ' is-on' : '')} onClick={() => setDrill(drill === id ? null : id)} title={'Regra: ' + rule}>
						<span className="ops-kpi-label">{label}</span><b>{n}</b><span className="ops-kpi-sub">{sub}</span>
					</button>
				))}
				{['Receita', 'Leads', 'Conversão'].map(l => <div key={l} className="ops-kpi is-na"><span className="ops-kpi-label">{l}</span><b>N/D</b><span className="ops-kpi-sub">fonte comercial não contratada (Q-03)</span></div>)}
			</section>
			<div className="ops-dash-grid">
				<section className="cms-panel">
					<h2>Tarefas por fase e canal</h2>
					<svg className="ops-chart" viewBox={`0 0 ${Math.max(1, weeks.length) * 90} 220`} role="img" aria-label="Tarefas por fase e canal">
						{weeks.map((w, i) => {
							let y = 190;
							return (
								<g key={w} transform={`translate(${i * 90 + 20},0)`}>
									{cats.map(c => {
										const n = scoped.filter(t => (t.phase || 'Sem fase') === w && t.categoryId === c).length;
										if (!n) return null;
										const h = (n / max) * 170; y -= h;
										return <rect key={c} x="0" y={y} width="50" height={h} style={catStyle(c)} className="ops-bar"><title>{`${w} · ${catLabel(c)}: ${n}`}</title></rect>;
									})}
									<text x="25" y="208" textAnchor="middle" className="ops-axis">{w.split('·')[0].trim()}</text>
								</g>
							);
						})}
					</svg>
				</section>
				<section className="cms-panel">
					<h2>Resumo</h2>
					<ul className="ops-summary">
						{byStatus.map(([s, n]) => <li key={s}><StatusTag status={s} /><b>{n}</b></li>)}
						<li><span>Perguntas de pesquisa</span><b>{research.total}</b></li>
						<li><span>Respostas disponíveis</span><b>{research.available}</b></li>
						<li><span>Respostas bloqueadas</span><b>{research.locked}</b></li>
						<li><span>Taxa de respostas disponíveis</span><b>{pct(research.available, research.total)}</b></li>
					</ul>
				</section>
			</div>
			<section className="cms-panel">
				<h2>{drill ? kpis.find(k => k[0] === drill)[1] : 'Tarefas do período'} <small className="text-muted">({list.length})</small></h2>
				<div className="cms-scroll-x">
					<Table onRowClick={openTask} columns={[
						{ key: 'id', label: 'ID', render: t => <code>{t.id}</code> },
						{ key: 'title', label: 'Título' },
						{ key: 'categoryId', label: 'Canal', render: t => <span className="ops-chip" style={catStyle(t.categoryId)}><i />{catLabel(t.categoryId)}</span> },
						{ key: 'plannedStart', label: 'Data', render: t => <>{fmtRange(t)} {t.dateKind === 'window' && <span className="ops-window-label">janela</span>}</> },
						{ key: 'status', label: 'Status', render: t => <StatusTag status={t.status} /> },
					]} rows={list} />
				</div>
			</section>
		</div>
	);
}
