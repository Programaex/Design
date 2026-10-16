// Exportação (FR-14/15/19, SPEC-03): JSON/CSV com schemaVersion e IDs, e PDF via render de impressão dedicado.
// O render mede o conteúdo real (depois de document.fonts.ready), calcula escala por página e só libera
// imprimir se todos os títulos ficarem ≥ 9 pt — senão pede papel maior ou escopo menor (overflow "ask").
import React from 'react';
import { Button, SegmentedControl, Tag, TextField } from '../ds.js';
import { exportJson, importJson, toCsv } from '../../../lib/ops/exportio.mjs';
import { bar, groupTasks, range } from '../../../lib/ops/gantt.mjs';
import { dagLayout, treeLayout } from '../../../lib/ops/layout.mjs';
import { DEFAULT_OPTIONS, MIN_PT, mmToPx, pageCss, sheetMm, usableArea } from '../../../lib/ops/pagefit.mjs';
import { catLabel, catStyle, fmt, Legend } from './shared.jsx';
import { MAP_NODE, TreeSvg } from './mindmap.jsx';
import { MonthWeeks } from './calendar.jsx';
import { DAG_NODE, DagSvg } from './workflow.jsx';
import { useOps } from './store.jsx';

const MONTHS = ['janeiro', 'fevereiro', 'março', 'abril', 'maio', 'junho', 'julho', 'agosto', 'setembro', 'outubro', 'novembro', 'dezembro'];
const FONT_PX = { calendar: 12, agenda: 12, mindmap: 12, workflow: 12, gantt: 11 };

function download(name, text, type) {
	const a = document.createElement('a');
	a.href = URL.createObjectURL(new Blob([text], { type }));
	a.download = name;
	a.click();
	setTimeout(() => URL.revokeObjectURL(a.href), 1000);
}

// ---------- conteúdo de cada página (tamanho natural; a escala é aplicada depois da medição) ----------
function CalendarMonth({ ym, events, taskOf, widthPx }) {
	const [y, m] = ym.split('-').map(Number);
	return <div className="print-cal" style={{ width: widthPx }}><h3>{MONTHS[m - 1]} de {y}</h3><MonthWeeks year={y} month={m} events={events} taskOf={taskOf} print /></div>;
}

// Agenda paginada por registros (SPEC-03): lista cronológica, títulos inteiros, cabeçalho repetido por página.
const AGENDA_PER_PAGE = 14;
function AgendaPage({ events, widthPx }) {
	const byDay = events.reduce((acc, ev) => ((acc[ev.dateStart] ||= []).push(ev), acc), {});
	return (
		<div className="print-agenda" style={{ width: widthPx }}>
			{Object.entries(byDay).map(([day, evs]) => (
				<section key={day}><h4>{fmt(day)}</h4>{evs.map(ev => (
					<div key={ev.id} className={'print-ev' + (ev.kind === 'window' ? ' is-window' : '')} style={catStyle(ev.categoryId)}>
						<span className="print-ev-meta">{ev.taskId} · {ev.kind === 'window' ? `Janela até ${fmt(ev.dateEnd)}` : 'Dia inteiro'} · {catLabel(ev.categoryId)}</span><span>{ev.title}</span>
					</div>
				))}</section>
			))}
		</div>
	);
}

function SvgPage({ layout, children, pad = 16 }) {
	const b = layout.bounds;
	return <svg className="print-svg" width={b.width + pad * 2} height={b.height + pad * 2} viewBox={`${b.x - pad} ${b.y - pad} ${b.width + pad * 2} ${b.height + pad * 2}`}>{children}</svg>;
}

function GanttPrint({ tasks }) {
	const r = range(tasks);
	if (!r) return <p>Nenhuma tarefa agendada.</p>;
	const { groups } = groupTasks(tasks);
	const days = Math.round((new Date(r.to) - new Date(r.from)) / 864e5) + 1;
	const W = days * 10;
	return (
		<div className="print-gantt">
			{groups.map(g => (
				<div key={g.name}>
					<div className="print-gantt-group">{g.name}</div>
					{g.tasks.map(t => { const b = bar(t, r); return (
						<div key={t.id} className="print-gantt-row">
							<div className="print-gantt-label"><b>{t.id}</b> {t.title}<br /><small>{fmt(t.plannedStart)} → {fmt(t.plannedEnd)}{t.dateKind === 'window' ? ' · janela' : ''}</small></div>
							<div className="print-gantt-track" style={{ width: W }}><span style={{ left: b.left * W, width: Math.max(4, b.width * W), ...catStyle(t.categoryId) }} /></div>
						</div>
					); })}
				</div>
			))}
		</div>
	);
}

// Monta as páginas pedidas pelas opções e escopo.
function buildPages(o, doc, tasks, viewState) {
	const scopeTasks = o.scope === 'all' ? doc.tasks : tasks;
	const ids = new Set(scopeTasks.map(t => t.id));
	const taskOf = id => doc.tasks.find(t => t.id === id);
	const [Uw] = usableArea(o).px;
	if (o.view === 'calendar') {
		const events = doc.events.filter(e => ids.has(e.taskId));
		const months = o.scope === 'selection' ? [(viewState.calendario?.anchor || events.map(e => e.dateStart).sort()[0] || '2026-09-01').slice(0, 7)]
			: [...new Set(events.flatMap(e => [e.dateStart.slice(0, 7), (e.dateEnd || e.dateStart).slice(0, 7)]))].sort();
		return months.map(ym => ({ key: ym, title: `Calendário · ${ym}`, count: events.filter(e => e.dateStart.slice(0, 7) <= ym && (e.dateEnd || e.dateStart).slice(0, 7) >= ym).length, node: <CalendarMonth ym={ym} events={events} taskOf={taskOf} widthPx={Uw} /> }));
	}
	if (o.view === 'agenda') {
		const events = doc.events.filter(e => ids.has(e.taskId)).sort((a, b) => a.dateStart.localeCompare(b.dateStart) || a.title.localeCompare(b.title));
		const pages = [];
		for (let i = 0; i < events.length; i += AGENDA_PER_PAGE) pages.push(events.slice(i, i + AGENDA_PER_PAGE));
		return (pages.length ? pages : [[]]).map((chunk, i) => ({ key: 'agenda-' + (i + 1), title: 'Agenda', count: chunk.length, node: <AgendaPage events={chunk} widthPx={Uw} /> }));
	}
	if (o.view === 'mindmap') {
		const sel = viewState.mapa?.datasetId || doc.datasets[0]?.id;
		const sets = o.scope === 'selection' ? doc.datasets.filter(d => d.id === sel) : doc.datasets;
		return sets.map(ds => {
			const nodes = doc.nodes.filter(n => n.datasetId === ds.id);
			const root = nodes.find(n => !n.parentId);
			const visible = o.visibleOnly ? new Set(viewState.mapa?.expanded?.[ds.id] || [root.id]) : new Set(nodes.map(n => n.id));
			const layout = treeLayout(root.id, nodes, { direction: o.layoutDirection, expanded: visible, node: MAP_NODE });
			return { key: ds.id, title: `Mapa ${ds.id} · ${ds.name}`, count: layout.items.length, hidden: nodes.length - layout.items.length, node: <SvgPage layout={layout}><TreeSvg layout={layout} interactive={false} /></SvgPage> };
		});
	}
	if (o.view === 'workflow') {
		const dir = o.layoutDirection === 'TB' ? 'TB' : 'LR';
		const layout = dagLayout(scopeTasks, doc.dependencies, { direction: dir, node: DAG_NODE });
		return [{ key: 'wf', title: 'Workflow de tarefas', count: layout.items.length, node: <SvgPage layout={layout}><DagSvg layout={layout} /></SvgPage> }];
	}
	return [{ key: 'gantt', title: 'Gantt', count: scopeTasks.filter(t => t.plannedStart).length, node: <GanttPrint tasks={scopeTasks} /> }];
}

function PrintSheet({ page, o, index, total, onMeasure, filtersLabel }) {
	const [w, h] = sheetMm(o);
	const m = o.marginsMm;
	const { px: [Uw, Uh] } = usableArea(o);
	const inner = React.useRef(null);
	const [fit, setFit] = React.useState(null);
	React.useLayoutEffect(() => {
		let alive = true;
		document.fonts.ready.then(() => requestAnimationFrame(() => {
			if (!alive || !inner.current) return;
			const W = inner.current.scrollWidth, H = inner.current.scrollHeight;
			const s = Math.min(1, Uw / W, Uh / H);
			const pt = FONT_PX[o.view] * s * 72 / 96;
			const f = { W, H, s, pt, legible: pt >= MIN_PT - 0.01, dx: (Uw - s * W) / 2, dy: ['calendar', 'agenda'].includes(o.view) ? 0 : (Uh - s * H) / 2 };
			setFit(f);
			onMeasure(page.key, f);
		}));
		return () => { alive = false; };
	}, [page.key, Uw, Uh]);
	return (
		<section className="print-sheet" style={{ width: `${w - m.left - m.right}mm`, height: `${h - m.top - m.bottom}mm` }} data-page={index + 1}>
			{o.includeHeader && <header className="print-head" style={{ height: `${o.headerMm}mm` }}><b>{page.title}</b><span>{filtersLabel} · {page.count} registros{page.hidden ? ` · ${page.hidden} ocultos (estado visível)` : ''} · página {index + 1}/{total}</span></header>}
			<div className="print-body" style={{ width: Uw, height: Uh }}>
				<div ref={inner} className="print-inner" style={fit ? { transform: `translate(${fit.dx}px, ${fit.dy}px) scale(${fit.s})` } : { visibility: 'hidden' }}>{page.node}</div>
			</div>
			{o.includeLegend && <footer className="print-foot" style={{ height: `${o.footerMm}mm` }}><Legend /></footer>}
		</section>
	);
}

export function Export({ doc, tasks, filters, viewState }) {
	const { replace } = useOps();
	const [o, setO] = React.useState({ ...DEFAULT_OPTIONS, visibleOnly: false });
	const [fits, setFits] = React.useState({});
	const [jsonMsg, setJsonMsg] = React.useState(null);
	const set = patch => { setFits({}); window.__printReady = false; setO(x => ({ ...x, ...patch })); };
	const pages = React.useMemo(() => buildPages(o, doc, tasks, viewState), [o, doc, tasks, viewState]);
	const measured = pages.every(p => fits[p.key]);
	const illegible = pages.filter(p => fits[p.key] && !fits[p.key].legible);
	const multi = pages.length > 1 && o.overflowMode === 'ask';
	const blocked = !measured || illegible.length > 0 || multi;
	React.useEffect(() => { if (measured) { window.__printReady = true; document.documentElement.dataset.printReady = blocked ? 'blocked' : 'ok'; } }, [measured, blocked]);
	const filtersLabel = Object.entries(filters).filter(([, v]) => v).map(([k, v]) => `${k}=${v}`).join(', ') || 'sem filtros';
	const sug = illegible.length ? ['A3 landscape', 'A3 portrait', 'A4 portrait'].filter(s => s !== `${o.paper} ${o.orientation}`) : [];
	const importFile = async f => {
		const r = importJson(await f.text());
		if (r.error) return setJsonMsg({ tone: 'danger', text: r.error });
		if (!confirm(`Substituir os dados atuais por ${r.data.tasks.length} tarefas e ${r.data.nodes.length} nós do arquivo?`)) return;
		replace({ ...doc, ...r.data, schemaVersion: doc.schemaVersion, revision: doc.revision + 1 });
		setJsonMsg({ tone: 'success', text: 'Importado com IDs preservados.' });
	};
	return (
		<div className="ops-export">
			<style>{`${pageCss(o)}
@media print {
  body * { visibility: hidden !important; }
  #print-root, #print-root * { visibility: visible !important; }
  #print-root { position: absolute; left: 0; top: 0; width: auto; }
  #print-root .print-preview-scale { transform: none !important; }
  .print-sheet { break-after: page; box-shadow: none !important; margin: 0 !important; }
  .print-sheet:last-child { break-after: auto; }
  .print-root { print-color-adjust: exact; -webkit-print-color-adjust: exact; }
}`}</style>
			<section className="cms-panel">
				<h2>Dados (JSON / CSV)</h2>
				<p className="text-muted ops-small">JSON preserva IDs, relações e schemaVersion para reimportar. CSV é para planilhas: células que começam com = + − @ recebem apóstrofo.</p>
				<div className="cms-actions">
					<Button size="sm" onClick={() => download('executar-ops.json', exportJson(doc), 'application/json')}>Baixar JSON</Button>
					{['tasks', 'nodes', 'edges', 'dependencies', 'events', 'history'].map(k => <Button key={k} size="sm" variant="secondary" onClick={() => download(`executar-${k}.csv`, toCsv(doc[k].map(({ rawFields, sourceCells, ...r }) => r)), 'text/csv')}>CSV {k}</Button>)}
					<label className="btn btn-ghost btn-sm ops-file">Importar JSON<input type="file" accept=".json,application/json" onChange={e => e.target.files[0] && importFile(e.target.files[0])} /></label>
				</div>
				{jsonMsg && <p className={'ops-notice is-' + jsonMsg.tone}>{jsonMsg.text}</p>}
			</section>
			<section className="cms-panel">
				<h2>PDF</h2>
				<div className="ops-print-opts">
					<label className="field"><span className="field-label">View</span><select className="input" value={o.view} onChange={e => set({ view: e.target.value })}><option value="calendar">Calendário (mês)</option><option value="agenda">Agenda (paginada)</option><option value="mindmap">Mapa mental</option><option value="workflow">Workflow</option><option value="gantt">Gantt</option></select></label>
					<label className="field"><span className="field-label">Escopo</span><select className="input" value={o.scope} onChange={e => set({ scope: e.target.value })}><option value="selection">Seleção atual</option><option value="filtered">Filtrado</option><option value="all">Tudo</option></select></label>
					<label className="field"><span className="field-label">Papel</span><select className="input" value={o.paper} onChange={e => set({ paper: e.target.value })}><option>A4</option><option>A3</option></select></label>
					<SegmentedControl name="ori" value={o.orientation} onChange={v => set({ orientation: v })} ariaLabel="Orientação" options={[{ value: 'landscape', label: 'Paisagem' }, { value: 'portrait', label: 'Retrato' }]} />
					<TextField label="Margens (mm)" type="number" min="0" max="30" value={o.marginsMm.top} onChange={e => { const v = Math.max(0, Math.min(30, Number(e.target.value) || 0)); set({ marginsMm: { top: v, right: v, bottom: v, left: v } }); }} />
					{(o.view === 'mindmap' || o.view === 'workflow') && <label className="field"><span className="field-label">Layout</span><select className="input" value={o.layoutDirection} onChange={e => set({ layoutDirection: e.target.value })}><option value="LR">Esq → dir</option><option value="TB">Cima → baixo</option>{o.view === 'mindmap' && <option value="bilateral">Bilateral</option>}</select></label>}
					{o.view === 'mindmap' && <label className="ops-check"><input type="checkbox" checked={o.visibleOnly} onChange={e => set({ visibleOnly: e.target.checked })} /> Só o estado visível (não expandir tudo)</label>}
					<label className="ops-check"><input type="checkbox" checked={o.includeLegend} onChange={e => set({ includeLegend: e.target.checked })} /> Legenda</label>
					<label className="ops-check"><input type="checkbox" checked={o.includeHeader} onChange={e => set({ includeHeader: e.target.checked })} /> Cabeçalho</label>
					<label className="field"><span className="field-label">Se não couber</span><select className="input" value={o.overflowMode} onChange={e => set({ overflowMode: e.target.value })}><option value="ask">Perguntar (uma página)</option><option value="paginate">Paginar</option></select></label>
				</div>
				<div className="ops-print-status" role="status">
					<b>{pages.length} página(s) · {pages.reduce((a, p) => a + p.count, 0)} registros</b>
					{pages.map(p => fits[p.key] && <span key={p.key}><code>{p.key}</code> escala {(fits[p.key].s * 100).toFixed(0)}% → fonte {fits[p.key].pt.toFixed(1)} pt {fits[p.key].legible ? <Tag tone="success">legível</Tag> : <Tag tone="danger">abaixo de {MIN_PT} pt</Tag>}</span>)}
					{illegible.length > 0 && <p className="ops-notice is-warning">Não cabe legível em {o.paper} {o.orientation === 'landscape' ? 'paisagem' : 'retrato'}. Tente {sug.join(' ou ')}, reduza o escopo (filtros, "Seleção atual" ou "Só o estado visível") ou escolha outra view. Nenhum PDF ilegível é gerado.</p>}
					{multi && illegible.length === 0 && <p className="ops-notice is-warning">O escopo gera {pages.length} páginas. Escolha "Paginar" para imprimir todas ou "Seleção atual" para uma página.</p>}
				</div>
				<div className="cms-actions"><Button disabled={blocked} onClick={() => window.print()}>Imprimir / salvar PDF</Button><span className="text-muted ops-small">No diálogo do navegador, desative "Cabeçalhos e rodapés" e ative "Gráficos de fundo".</span></div>
			</section>
			<div id="print-root" className="print-root">
				<div className="print-preview-scale">
					{pages.map((p, i) => <PrintSheet key={p.key + JSON.stringify(o)} page={p} o={o} index={i} total={pages.length} filtersLabel={filtersLabel} onMeasure={(k, f) => setFits(x => ({ ...x, [k]: f }))} />)}
				</div>
			</div>
		</div>
	);
}
