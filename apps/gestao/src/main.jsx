import React from 'react';
import { createRoot } from 'react-dom/client';
import { VIEWS } from '../lib/views.mjs';
import { Dashboard } from './dashboard.jsx';
import { Button, Tag } from './ds.js';
import { PrintRoot, PrintSheet } from './print.jsx';

const params = new URLSearchParams(location.search);
// "Hoje" no fuso do titular; ?hoje=AAAA-MM-DD fixa a data (conferência e PDF de uma data específica).
const TODAY = /^\d{4}-\d{2}-\d{2}$/.test(params.get('hoje') || '') ? params.get('hoje') : new Date().toLocaleDateString('sv-SE', { timeZone: 'America/Sao_Paulo' });
const PRINT_ONLY = params.get('print') === '1';

const routeOf = () => (location.hash.replace(/^#\/?/, '').split('?')[0] in VIEWS ? location.hash.replace(/^#\/?/, '').split('?')[0] : 'epic01');
function useRoute() {
	const [r, setR] = React.useState(routeOf);
	React.useEffect(() => { const f = () => setR(routeOf()); addEventListener('hashchange', f); return () => removeEventListener('hashchange', f); }, []);
	return r;
}

// API do Worker (GitHub + snapshot); sem API (arquivo local, sessão expirada), o snapshot embarcado no build.
async function loadEpic(n, fresh = false) {
	try {
		const r = await fetch(`/api/epicos/${n}${fresh ? '?fresh=1' : ''}`, { credentials: 'same-origin' });
		if (r.status === 401) { location.href = '/login?next=' + encodeURIComponent(location.pathname + location.hash); return null; }
		if (r.ok) return r.json();
	} catch {}
	const s = await fetch(`data/epicos-${n}.json`).then(r => r.json());
	return { ...s, warnings: ['Sem acesso à API; exibindo o snapshot embarcado no build.', ...(s.warnings || []).filter(w => !/^Exibindo/.test(w))] };
}

function useStatic(path) {
	const [v, setV] = React.useState(null);
	React.useEffect(() => { fetch(path).then(r => r.json()).then(setV).catch(() => setV({})); }, [path]);
	return v;
}

function SourceBadge({ data }) {
	if (!data) return null;
	const mins = data.fetchedAt ? Math.max(0, Math.round((Date.now() - Date.parse(data.fetchedAt)) / 60000)) : null;
	return data.source === 'github'
		? <Tag tone="success" icon={<i className="ph ph-github-logo" />}>GitHub ao vivo{mins !== null ? ` · há ${mins} min` : ''}</Tag>
		: <Tag tone="warning" icon={<i className="ph ph-archive" />}>Snapshot de {String(data.snapshotAt).slice(8, 10)}/{String(data.snapshotAt).slice(5, 7)}</Tag>;
}

function App() {
	const route = useRoute();
	const view = VIEWS[route];
	const [cache, setCache] = React.useState({});
	const [busy, setBusy] = React.useState(false);
	const [preview, setPreview] = React.useState(false);
	const [fit, setFit] = React.useState(null);
	const solo = useStatic('data/solo-campaign.json');
	const qr = useStatic('data/qr.json');
	const data = cache[view.epic];

	const refresh = React.useCallback(async (fresh = false) => {
		setBusy(true);
		const d = await loadEpic(view.epic, fresh);
		if (d) setCache(c => ({ ...c, [view.epic]: d }));
		setBusy(false);
	}, [view.epic]);
	React.useEffect(() => { if (!cache[view.epic]) refresh(); }, [view.epic]);

	const sheet = data && solo && qr && <PrintSheet view={view} data={data} solo={solo} qr={qr[view.epic]} today={TODAY} />;
	if (PRINT_ONLY) return sheet ? <PrintRoot onMeasure={setFit}>{sheet}</PrintRoot> : null;

	const print = () => { if (fit?.legible) window.print(); };
	return (
		<div className="app">
			<aside className="rail">
				<div className="brand"><img src="/assets/brand/svg/01_stack_check.svg" alt="" /> Gestão <small>EXECUTAR</small></div>
				<nav>
					<span className="nav-title">Épicos</span>
					{Object.values(VIEWS).map(v => (
						<a key={v.id} href={'#/' + v.id} className={'nav-item' + (v.id === route ? ' is-on' : '')}><i className={'ph ' + v.icon} /> {v.short}<small>#{v.epic}</small></a>
					))}
				</nav>
				<div className="rail-foot">
					<SourceBadge data={data} />
					<Button variant="ghost" size="sm" onClick={async () => { await fetch('/api/logout'); location.href = '/login'; }}>Sair</Button>
				</div>
			</aside>
			<main className="main">
				<div className="toolbar">
					<span className="note">Hoje: {TODAY.split('-').reverse().join('/')}</span>
					<Button variant="secondary" size="sm" icon={<i className="ph ph-arrows-clockwise" />} onClick={() => refresh(true)} disabled={busy}>{busy ? 'Atualizando…' : 'Atualizar do GitHub'}</Button>
					<Button variant="secondary" size="sm" icon={<i className="ph ph-eye" />} onClick={() => setPreview(true)} disabled={!sheet}>Pré-visualizar PDF</Button>
					<Button size="sm" icon={<i className="ph ph-printer" />} onClick={print} disabled={!fit?.legible} title={fit && !fit.legible ? 'Abaixo de 9 pt em A4: use A3 ou reduza o escopo' : 'Imprimir em uma página A4 paisagem'}>Imprimir PDF</Button>
					{fit && <span className="note">{fit.legible ? `1 página A4 paisagem · menor fonte ${fit.pt.toFixed(1).replace('.', ',')} pt` : `Não cabe legível em A4 (${fit.pt.toFixed(1).replace('.', ',')} pt)${fit.alternatives.length ? ' · use ' + fit.alternatives[0].paper + ' ' + (fit.alternatives[0].orientation === 'landscape' ? 'paisagem' : 'retrato') : ''}`}</span>}
				</div>
				{data ? <Dashboard view={view} data={data} today={TODAY} solo={solo} /> : <p className="note">Carregando…</p>}
			</main>
			{sheet && <div className="print-host"><PrintRoot onMeasure={setFit}>{sheet}</PrintRoot></div>}
			{preview && sheet && (
				<div className="preview" role="dialog" aria-modal="true" aria-label="Pré-visualização do PDF">
					<div className="preview-bar">
						<b>Pré-visualização · A4 paisagem · 1 página</b>
						<span className="note">{fit ? `menor fonte ${fit.pt.toFixed(1).replace('.', ',')} pt` : ''}</span>
						<Button variant="secondary" size="sm" onClick={() => setPreview(false)}>Fechar</Button>
						<Button size="sm" icon={<i className="ph ph-printer" />} onClick={print} disabled={!fit?.legible}>Imprimir PDF</Button>
					</div>
					<div className="preview-page"><div className="preview-sheet" style={{ transform: `scale(${fit ? fit.scale : 1})` }}>{sheet}</div></div>
				</div>
			)}
		</div>
	);
}

document.body.classList.toggle('print-only', PRINT_ONLY);
createRoot(document.getElementById('root')).render(<App />);
