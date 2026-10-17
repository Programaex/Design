import React from 'react';
import { DEFAULT_OPTIONS, MIN_PT, fitToPage, mmToPx, pageCss, suggestions, usableArea } from '../../site/lib/ops/pagefit.mjs';
import { computeKpis, dueOf, fmtDate, fmtDay, groupRows, isDone, isLate, lacunas, milestonesWithDays, range, upcoming } from '../lib/kpis.mjs';
import { Gantt } from './gantt.jsx';

// Folha única A4 paisagem (SPEC-03): margens de 10 mm, sem cabeçalho/rodapé do navegador, piso de 9 pt.
export const PRINT_OPTS = { ...DEFAULT_OPTIONS, paper: 'A4', orientation: 'landscape', includeHeader: false, includeLegend: false };
export const MIN_FONT_PX = 12; // menor fonte usada na folha (12 px = 9 pt em escala 1)
const W = Math.floor(usableArea(PRINT_OPTS).px[0]);

const fmtStamp = d => `${fmtDate(d.toISOString().slice(0, 10))} ${d.toISOString().slice(11, 16)} UTC`;

function Header({ view, data, qr, today }) {
	const e = data.epic;
	return (
		<header className="ps-head">
			<div className="ps-qr">
				<div dangerouslySetInnerHTML={{ __html: qr || '' }} />
				<span>#{e.number} · ID / QR</span>
			</div>
			<div className="ps-title">
				<span className="ps-kicker">PAINEL DE GESTÃO · PROGRAMA EXECUTAR</span>
				<h1>{view.label}</h1>
				<p>{view.objective}</p>
			</div>
			<dl className="ps-fields">
				<dt>Épico</dt><dd>{e.id}</dd>
				<dt>Período</dt><dd>{fmtDate(e.start)} → {fmtDate(e.due)}</dd>
				<dt>Owner</dt><dd>{e.owner}{e.co?.length ? ` · co: ${e.co.join(', ')}` : ''}</dd>
				<dt>Data</dt><dd>{fmtDate(today)}</dd>
				<dt>Fonte</dt><dd>{data.source === 'github' ? 'GitHub ao vivo' : 'Snapshot do workbook'}</dd>
				<dt>Versão</dt><dd>v1.0</dd>
			</dl>
		</header>
	);
}

function SectionC({ view, items, solo, today }) {
	if (view.withSoloCampaign && solo) {
		const by = p => solo.matrix.filter(m => m.priority === p).map(m => `${m.qty} ${m.fragment.toLowerCase().replace(/ \(.*\)$/, '')}`).join(', ');
		return (
			<div className="ps-col">
				<h2>C · Solo Campaign System (sprint de 10 dias)</h2>
				<table className="ps-tbl">
					<colgroup><col className="c-day" /><col className="c-blk" /><col /></colgroup>
					<tbody>{solo.sprint.map(d => <tr key={d.day} className={d.checkpoint ? 'is-cp' : ''}><td className="mono">{d.day}</td><td className="mono">{d.blocks}b</td><td>{d.tasks}{d.checkpoint ? ` · Checkpoint ${d.checkpoint}` : ''}</td></tr>)}</tbody>
				</table>
				<p className="ps-moscow"><b>Must:</b> {by('Must')}.</p>
				<p className="ps-moscow"><b>Should:</b> {by('Should')}. <b>Could:</b> {by('Could')}.</p>
				<p className="ps-warn"><b>Conflito a decidir:</b> PDF publica a Campanha 02 de 01 a 20/11; plano lança o site em 05/11.</p>
			</div>
		);
	}
	const rows = groupRows(items, view).filter(r => r.name !== 'Pontos de decisão');
	return (
		<div className="ps-col">
			<h2>C · Trilhas</h2>
			<table className="ps-tbl">
				<colgroup><col style={{ width: '42%' }} /><col className="c-n" /><col /></colgroup>
				<thead><tr><th>Trilha</th><th>Feitas</th><th>Próximo prazo</th></tr></thead>
				<tbody>{rows.map(r => {
					const open = r.items.filter(i => !isDone(i)).sort((a, b) => (dueOf(a) || '9').localeCompare(dueOf(b) || '9'))[0];
					return <tr key={r.name}><td>{r.name}</td><td className="mono">{r.items.filter(isDone).length}/{r.items.length}</td><td>{open ? `${fmtDay(dueOf(open))} · ${open.title}` : '—'}</td></tr>;
				})}</tbody>
			</table>
		</div>
	);
}

// Conteúdo da folha (sem escala). width = área útil em px.
export function PrintSheet({ view, data, solo, qr, today, now = new Date() }) {
	const items = data.items;
	const kpis = computeKpis(items, view, today);
	const tiles = kpis.length + view.milestones.length;
	const { from, to } = range(items, view);
	const nextStart = items.filter(i => !isDone(i) && i.start > today).sort((a, b) => a.start.localeCompare(b.start))[0];
	const next = upcoming(items, today, 14).slice(0, 5);
	const gaps = lacunas(items).slice(0, 2);
	const gates = items.filter(i => i.type === 'gate' && !isDone(i)).sort((a, b) => (dueOf(a) || '').localeCompare(dueOf(b) || '')).slice(0, 4);
	return (
		<div className="ps" style={{ width: W }}>
			<Header view={view} data={data} qr={qr} today={today} />
			<section className="ps-a">
				<h2>A · Indicadores e marcos</h2>
				<div className="ps-kpis" style={{ gridTemplateColumns: `repeat(${tiles > 10 ? Math.ceil(tiles / 2) : tiles}, minmax(0, 1fr))` }}>
					{kpis.map(k => <div key={k.id} className="ps-kpi"><span>{k.label}</span><b>{k.value}</b></div>)}
					{milestonesWithDays(view, today).map(m => <div key={m.date} className="ps-kpi is-m"><span>{fmtDay(m.date)} · {m.label}</span><b>{m.days < 0 ? 'feito' : `${m.days} d`}</b></div>)}
				</div>
			</section>
			<section className="ps-b">
				<h2>B · Cronograma por {view.id === 'emprego' ? 'trilha' : 'frente'} (losango = ponto de decisão)</h2>
				<Gantt rows={groupRows(items, view)} from={from} to={to} today={today} milestones={view.milestones} compact width={W} labelW={250} rowH={18} />
			</section>
			<section className="ps-c">
				<SectionC view={view} items={items} solo={solo} today={today} />
				<div className="ps-col">
					<h2>Próximos 14 dias</h2>
					<ul>{next.length ? next.map(i => <li key={i.number} className={isLate(i, today) ? 'is-late' : ''}><span className="mono">{dueOf(i) ? fmtDay(dueOf(i)) : 'a def.'}</span> {i.alias || '#' + i.number} · {i.title}</li>) : <li>Nada no período{nextStart ? ` · próximo início ${fmtDay(nextStart.start)}: ${nextStart.alias || '#' + nextStart.number} · ${nextStart.title}` : ''}.</li>}</ul>
					<h2>Pontos de decisão abertos</h2>
					<ul>{gates.map(g => <li key={g.number}><span className="mono">{fmtDay(dueOf(g))}</span> {g.alias} · {g.title}</li>)}</ul>
					{gaps.length > 0 && <><h2>Lacunas</h2><ul>{gaps.map((g, k) => <li key={k}>{g.alias || '#' + g.number}: {g.text}</li>)}{lacunas(items).length > gaps.length && <li>+ {lacunas(items).length - gaps.length} lacunas no painel</li>}</ul></>}
				</div>
			</section>
			<footer className="ps-foot">
				Emitido em {fmtStamp(now)} · {data.source === 'github' ? `GitHub ao vivo${data.fetchedAt ? ' (' + fmtStamp(new Date(data.fetchedAt)) + ')' : ''}` : `snapshot do workbook ${data.snapshotSource?.commit || ''} (${fmtDate(String(data.snapshotAt).slice(0, 10))})`} · Programa EXECUTAR · página 1/1
			</footer>
		</div>
	);
}

// Mede a folha e devolve escala, fonte final e legibilidade (piso de 9 pt).
export function measure(el) {
	// Largura limitada à folha (W): a diferença sub-pixel do arredondamento não deve reduzir a escala.
	const bounds = { x: 0, y: 0, width: Math.min(el.scrollWidth, W), height: el.scrollHeight };
	const fit = fitToPage(bounds, PRINT_OPTS, { fontPx: MIN_FONT_PX, minPt: MIN_PT });
	return { ...fit, bounds, alternatives: fit.legible ? [] : suggestions(bounds, PRINT_OPTS, { fontPx: MIN_FONT_PX }) };
}

// Área de impressão: folha medida, escalada e centralizada; publica window.__printReady para o gerador de PDF.
export function PrintRoot({ children, onMeasure }) {
	const ref = React.useRef(null);
	const [fit, setFit] = React.useState(null);
	const last = React.useRef('');
	// Mede depois de cada renderização, mas só publica quando a medida muda (evita laço de renderização).
	React.useLayoutEffect(() => {
		let off = false;
		(document.fonts?.ready || Promise.resolve()).then(() => {
			if (off || !ref.current) return;
			const f = measure(ref.current);
			const key = `${f.bounds.width}x${f.bounds.height}`;
			if (key === last.current) return;
			last.current = key;
			setFit(f);
			onMeasure?.(f);
			window.__printReady = f.legible;
			window.__printFit = { pt: f.pt, scale: f.scale, legible: f.legible };
		});
		return () => { off = true; };
	});
	const s = fit ? fit.scale : 1;
	return (
		<div id="print-root">
			<style>{`@media print { ${pageCss(PRINT_OPTS)} }`}</style>
			<div className="ps-stage" style={{ width: Math.ceil(mmToPx(277)), height: Math.floor(mmToPx(190)) }}>
				<div ref={ref} style={{ transform: `scale(${s})`, transformOrigin: 'top left' }}>{children}</div>
			</div>
		</div>
	);
}
