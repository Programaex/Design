// Analytics da Cloudflare (Workers Analytics via GraphQL), lido pelo Worker em /api/analytics.
import React from 'react';
import { SegmentedControl, Tag } from '../ds.js';

export function Analytics() {
	const [days, setDays] = React.useState('7');
	const [res, setRes] = React.useState(null);
	React.useEffect(() => {
		setRes(null);
		fetch('/api/analytics?days=' + days).then(r => r.json()).then(setRes).catch(e => setRes({ connected: false, reason: String(e) }));
	}, [days]);
	const max = res?.series ? Math.max(1, ...res.series.map(d => d.requests)) : 1;
	return (
		<div className="cms-page">
			<header className="cms-head"><div><span className="cms-kicker">Cloudflare · Worker "design"</span><h1>Analytics</h1></div>
				<SegmentedControl name="days" value={days} onChange={setDays} ariaLabel="Período" options={[{ value: '1', label: '24 h' }, { value: '7', label: '7 dias' }, { value: '30', label: '30 dias' }]} /></header>
			{!res && <p className="text-muted">Carregando…</p>}
			{res && !res.connected && (
				<div className="cms-panel">
					<h2><Tag tone="warning">Não conectado</Tag></h2>
					<p>{res.reason}</p>
					<ol className="cms-steps">
						<li>No painel da Cloudflare, crie um API Token com a permissão <b>Account Analytics: Read</b>.</li>
						<li>Grave os secrets no Worker: <code>npx wrangler secret put CF_ANALYTICS_TOKEN</code> e <code>npx wrangler secret put CF_ACCOUNT_ID</code> (em <code>apps/site</code>).</li>
						<li>Recarregue esta página. Os dados vêm direto da Cloudflare, sem expor o token ao navegador.</li>
					</ol>
				</div>
			)}
			{res?.connected && !res.ok && <div className="cms-panel"><Tag tone="danger">Erro</Tag> {res.error}</div>}
			{res?.ok && (
				<>
					<section className="cms-kpis">
						<div className="cms-kpi"><i className="ph ph-arrows-down-up cms-kpi-icon" /><div><b>{res.totals.requests.toLocaleString('pt-BR')}</b><span>requisições</span></div></div>
						<div className="cms-kpi"><i className="ph ph-warning-circle cms-kpi-icon" /><div><b>{res.totals.errors.toLocaleString('pt-BR')}</b><span>erros</span></div></div>
						<div className="cms-kpi"><i className="ph ph-percent cms-kpi-icon" /><div><b>{res.totals.requests ? ((res.totals.errors / res.totals.requests) * 100).toFixed(2) : '0.00'}%</b><span>taxa de erro</span></div></div>
					</section>
					<section className="cms-panel">
						<h2>Requisições por dia</h2>
						<div className="cms-chart" role="img" aria-label="Requisições por dia">
							{res.series.map(d => (
								<div key={d.date} className="cms-col" title={`${d.date}: ${d.requests} requisições, ${d.errors} erros`}>
									<span className="cms-col-bar" style={{ height: (d.requests / max) * 100 + '%' }} />
									<span className="cms-col-label">{d.date.slice(5)}</span>
								</div>
							))}
						</div>
					</section>
				</>
			)}
		</div>
	);
}
