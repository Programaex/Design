// CMS EXECUTAR — Central de controle (ADR-CENTRAL-CONTROLE): entrada única, ID primeiro, guiado por estado,
// automação observável. Arquitetura e conteúdo do Hub Editorial; visual 100% do pacote de design system.
import React from 'react';
import { createRoot } from 'react-dom/client';
import { Button, ProgressRing, Tag } from './ds.js';
import { go, useAutomationLog, useData, useDoc, useRoute } from './store.js';
import { progressOf } from './progress.js';
import { Folders, DocView } from './views/folders.jsx';
import { RoutesView } from './views/routes.jsx';
import { Storybook } from './views/storybook.jsx';
import { BlogPreview } from './views/blog.jsx';
import { Automation } from './views/automation.jsx';
import { Analytics } from './views/analytics.jsx';
import { Completeness, Kanban } from './views/completeness.jsx';
import { ModuleView, VocabView } from './views/modules.jsx';
import { OpsArea } from './ops/index.jsx';

const NAV = [
	{ title: null, items: [['painel', 'Painel de hoje', 'ph-squares-four']] },
	{ title: 'Operações e Dados', items: [['ops/dashboard', 'Dashboard', 'ph-gauge'], ['ops/calendario', 'Calendário', 'ph-calendar'], ['ops/gantt', 'Gantt', 'ph-chart-bar-horizontal'], ['ops/mapa', 'Mapa mental', 'ph-graph'], ['ops/workflow', 'Workflow', 'ph-flow-arrow'], ['ops/foco', 'Foco', 'ph-target'], ['ops/importar', 'Importar', 'ph-upload-simple'], ['ops/exportar', 'Exportar / PDF', 'ph-printer']] },
	{ title: 'Controle', items: [['completude', 'Completude', 'ph-chart-donut'], ['kanban', 'Kanban', 'ph-kanban'], ['automacao', 'Automação', 'ph-lightning'], ['analytics', 'Analytics', 'ph-chart-line-up']] },
	{ title: 'Ecossistema', items: [['pastas', 'Pastas e docs', 'ph-folders'], ['rotas', 'Rotas e QR', 'ph-qr-code'], ['blog', 'Preview do blog', 'ph-article'], ['storybook', 'Storybook', 'ph-stack'], ['site', 'Site real ↗', 'ph-globe']] },
	{ title: 'Editorial', items: [['m/content', 'Conteúdos', 'ph-files'], ['m/brief', 'Briefs', 'ph-clipboard-text'], ['m/arguments', 'Argumentos', 'ph-chats'], ['m/evidence', 'Evidências', 'ph-books'], ['m/production', 'Produção de texto', 'ph-pen-nib']] },
	{ title: 'Derivados por canal', items: [['m/assets', 'Ativos derivados', 'ph-copy'], ['m/visuals', 'Infográficos', 'ph-chart-bar'], ['m/ytlong', 'YouTube longo', 'ph-youtube-logo'], ['m/shorts', 'Shorts & Reels', 'ph-device-mobile'], ['m/social', 'Social cross-platform', 'ph-share-network'], ['m/newsletter', 'Newsletter', 'ph-envelope']] },
	{ title: 'Publicação', items: [['m/seo', 'SEO & metadados', 'ph-magnifying-glass'], ['m/calendar', 'Calendário', 'ph-calendar'], ['m/distribution', 'Distribuição', 'ph-paper-plane-tilt'], ['m/performance', 'Performance', 'ph-gauge']] },
	{ title: 'Estratégia', items: [['m/backlog', 'Backlog de ideias', 'ph-lightbulb'], ['m/taxonomy', 'Taxonomia', 'ph-tree-structure'], ['m/decisions', 'Log de decisões', 'ph-gavel'], ['listas', 'Listas controladas', 'ph-list-checks'], ['adr', 'ADR · Sobre', 'ph-info']] },
];

function Rail({ route, mode }) {
	const logout = async () => { await fetch('/api/logout'); location.href = '/login'; };
	return (
		<nav className="cms-rail" aria-label="CMS">
			<div className="cms-brand"><img src="/assets/brand/svg/01_stack_check.svg" alt="" /><span>EXECUTAR</span><small>CMS</small></div>
			{NAV.map((g, k) => (
				<div key={k} className="cms-nav-group">
					{g.title && <div className="cms-nav-title">{g.title}</div>}
					{g.items.map(([id, label, icon]) => id === 'site'
						? <a key={id} className="cms-nav-item" href="/ui_kits/ecossistema/#/" target="_blank" rel="noreferrer"><i className={'ph ' + icon} />{label}</a>
						: <a key={id} className={'cms-nav-item' + (route === id || route.startsWith(id + '/') ? ' is-on' : '')} href={'#/' + id}><i className={'ph ' + icon} />{label}</a>)}
				</div>
			))}
			<div className="cms-rail-foot">
				<Tag tone={mode === 'kv' ? 'success' : 'warning'}>{mode === 'kv' ? 'Sincronizado (KV)' : mode === 'local' ? 'Somente neste navegador' : 'Carregando…'}</Tag>
				<Button variant="ghost" size="sm" onClick={logout}>Sair</Button>
			</div>
		</nav>
	);
}

function Painel({ data, progress, log }) {
	const p = progressOf(data, progress);
	const content = (data.hub.seed.content || []);
	return (
		<div className="cms-page">
			<header className="cms-head"><div><span className="cms-kicker">Painel de hoje</span><h1>Entrada única do ecossistema</h1><p className="text-muted">CAPTURAR → PRIORIZAR → PRODUZIR → DERIVAR → VALIDAR → AGENDAR → PUBLICAR → MEDIR → APRENDER</p></div></header>
			<section className="cms-kpis">
				<button className="cms-kpi" onClick={() => go('completude')}><ProgressRing value={p.pct} size={72} label="Completude geral" /><div><b>Completude para lançamento</b><span>{p.done} de {p.total} itens micro concluídos</span></div></button>
				<div className="cms-kpi"><i className="ph ph-flag-banner cms-kpi-icon" /><div><b>{data.routes.length} rotas</b><span>{data.completeness.length} macros · {data.routes.filter(r => r.access === 'publico').length} públicas</span></div></div>
				<div className="cms-kpi"><i className="ph ph-article cms-kpi-icon" /><div><b>{data.articles.length} artigos prontos</b><span>status ready · aguardando publicação</span></div></div>
				<div className="cms-kpi"><i className="ph ph-warning cms-kpi-icon" /><div><b>{data.scan.lorem} ocorrências de lorem</b><span>{data.scan.placeholders} referências a placeholders no site real</span></div></div>
			</section>
			<div className="cms-grid2">
				<section className="cms-panel">
					<h2>Macros</h2>
					{p.macros.map(m => (
						<button key={m.id} className="cms-bar-row" onClick={() => go('completude/' + m.id)}>
							<span>{data.completeness.find(x => x.id === m.id).title}</span>
							<span className="cms-bar"><span style={{ width: m.pct + '%' }} /></span>
							<span className="cms-num">{Math.round(m.pct)}%</span>
						</button>
					))}
				</section>
				<section className="cms-panel">
					<h2>Conteúdos-mãe</h2>
					<ul className="cms-list">
						{content.slice(0, 6).map(c => <li key={c.Content_ID}><code>{c.Content_ID}</code><span>{c.Titulo_trabalho}</span><Tag>{c.Status_editorial || '—'}</Tag></li>)}
					</ul>
					<h2>Últimas automações</h2>
					{log.length ? <ul className="cms-list">{log.slice(0, 5).map((e, k) => <li key={k}><code>{e.action}</code><span>{e.target}</span><span className="text-muted">{new Date(e.at).toLocaleString('pt-BR')}</span></li>)}</ul> : <p className="text-muted">Nenhuma automação disparada ainda.</p>}
				</section>
			</div>
		</div>
	);
}

function App() {
	const route = useRoute();
	const { data, error } = useData();
	const [progress, setProgress, mode] = useDoc('progress', () => ({ state: {}, updatedAt: null }));
	const automation = useAutomationLog();
	if (error) return <p className="cms-page">Erro ao carregar dados: {error}</p>;
	if (!data || !progress) return <p className="cms-page text-muted">Carregando…</p>;
	const [view, ...rest] = route.split('/');
	const arg = rest.join('/');
	const props = { data, progress, setProgress, automation };
	let body;
	switch (view) {
		case 'ops': body = <OpsArea view={arg} />; break;
		case 'completude': body = <Completeness {...props} focus={arg} />; break;
		case 'kanban': body = <Kanban {...props} />; break;
		case 'automacao': body = <Automation {...props} />; break;
		case 'analytics': body = <Analytics />; break;
		case 'pastas': body = <Folders data={data} folder={arg} />; break;
		case 'docs': body = <DocView data={data} path={decodeURIComponent(arg)} />; break;
		case 'rotas': body = <RoutesView data={data} />; break;
		case 'blog': body = <BlogPreview {...props} slug={arg} />; break;
		case 'storybook': body = <Storybook data={data} />; break;
		case 'm': body = <ModuleView data={data} moduleId={arg} automation={automation} />; break;
		case 'listas': body = <VocabView data={data} />; break;
		case 'adr': body = <DocView data={data} path="docs/adr/ADR-CENTRAL-CONTROLE-CMS.md" />; break;
		default: body = <Painel data={data} progress={progress} log={automation.log} />;
	}
	return <div className="cms"><Rail route={route} mode={mode} /><main className="cms-main" key={view === 'ops' ? 'ops' : route}>{body}</main></div>;
}

createRoot(document.getElementById('root')).render(<App />);
