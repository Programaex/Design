// Automação observável (ADR): botões visíveis desde já, sem backend. Cada disparo mostra o payload que seria
// enviado e fica registrado no log (KV). Quando houver webhook/runner, basta ligar o endpoint.
import React from 'react';
import { Button, Dialog, Table, Tag } from '../ds.js';

export const ACTIONS = {
	publicar: { label: 'Publicar no blog', icon: 'ph-upload-simple', endpoint: 'POST /hooks/blog/publish', deps: ['QA aprovado', 'SEO preenchido', 'Capa real'] },
	derivar: { label: 'Gerar derivados', icon: 'ph-copy', endpoint: 'POST /hooks/derivados', deps: ['Conteúdo-mãe aceito'] },
	agendar: { label: 'Agendar distribuição', icon: 'ph-calendar-plus', endpoint: 'POST /hooks/metricool/schedule', deps: ['Derivados aceitos', 'Calendário definido'] },
	linkedin: { label: 'Postar no LinkedIn', icon: 'ph-linkedin-logo', endpoint: 'POST /hooks/social/linkedin', deps: ['Post textual aceito'] },
	newsletter: { label: 'Enviar newsletter', icon: 'ph-envelope-simple', endpoint: 'POST /hooks/newsletter', deps: ['Edição revisada'] },
	deps: { label: 'Sincronizar dependências', icon: 'ph-tree-structure', endpoint: 'POST /hooks/deps/sync', deps: [] },
	medir: { label: 'Coletar métricas', icon: 'ph-chart-line-up', endpoint: 'POST /hooks/analytics/pull', deps: ['Publicado'] },
	webhook: { label: 'Disparar webhook', icon: 'ph-plugs-connected', endpoint: 'POST /hooks/custom', deps: [] },
};

// Botão de automação reutilizável (Kanban, preview do blog, módulos editoriais).
export function AutomationButton({ action, target, payload = {}, automation, size = 'sm', variant = 'secondary' }) {
	const [open, setOpen] = React.useState(false);
	const a = ACTIONS[action];
	const body = { action, target, ...payload };
	const confirm = () => { automation.record({ action, target, endpoint: a.endpoint, payload: body, result: 'não conectado' }); setOpen(false); };
	return (
		<>
			<Button size={size} variant={variant} icon={<i className={'ph ' + a.icon} />} onClick={() => setOpen(true)}>{a.label}</Button>
			<Dialog open={open} title={a.label} onClose={() => setOpen(false)} actions={<><Button variant="ghost" onClick={() => setOpen(false)}>Fechar</Button><Button onClick={confirm}>Registrar disparo</Button></>}>
				<p><Tag tone="warning">Backend não conectado</Tag> O disparo fica registrado no log. Quando o endpoint existir, este mesmo botão envia:</p>
				<pre className="cms-pre">{a.endpoint + '\n' + JSON.stringify(body, null, 2)}</pre>
				{a.deps.length > 0 && <p className="text-muted">Dependências: {a.deps.join(' · ')}</p>}
			</Dialog>
		</>
	);
}

export function Automation({ automation }) {
	return (
		<div className="cms-page">
			<header className="cms-head"><div><span className="cms-kicker">Hooks → Jobs → APIs/Webhooks → executores</span><h1>Automação</h1>
				<p className="text-muted">Os botões já existem e registram a intenção. Nenhum backend é chamado por enquanto.</p></div></header>
			<div className="cms-auto-grid">
				{Object.entries(ACTIONS).map(([id, a]) => (
					<div key={id} className="cms-panel cms-auto">
						<div className="cms-auto-head"><i className={'ph ' + a.icon} /><b>{a.label}</b></div>
						<code className="text-muted">{a.endpoint}</code>
						<p className="text-muted">{a.deps.length ? 'Depende de: ' + a.deps.join(' · ') : 'Sem dependências'}</p>
						<AutomationButton action={id} target="manual" automation={automation} />
					</div>
				))}
			</div>
			<section className="cms-panel">
				<h2>Log de disparos <small className="text-muted">({automation.log.length})</small></h2>
				{automation.log.length ? <Table columns={[
					{ key: 'at', label: 'Quando', render: e => new Date(e.at).toLocaleString('pt-BR') },
					{ key: 'action', label: 'Ação', render: e => <code>{e.action}</code> },
					{ key: 'target', label: 'Alvo' },
					{ key: 'endpoint', label: 'Endpoint', muted: true },
					{ key: 'result', label: 'Resultado', render: e => <Tag tone="warning">{e.result}</Tag> },
				]} rows={automation.log.map((e, i) => ({ ...e, id: i }))} /> : <p className="text-muted">Nenhum disparo ainda.</p>}
			</section>
		</div>
	);
}
