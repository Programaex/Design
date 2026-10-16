// Preview do blog = o site real. O iframe abre a rota do ecossistema (#/blog e #/blog/<slug>), que usa o mesmo
// pacote de tokens e componentes e lê os artigos gerados de apps/site/content/articles.
import React from 'react';
import { Button, SegmentedControl, Tag } from '../ds.js';
import { go } from '../store.js';
import { AutomationButton } from './automation.jsx';

export function BlogPreview({ data, slug, automation }) {
	const [viewport, setViewport] = React.useState('desktop');
	const art = data.articles.find(a => a.slug === slug);
	const src = '/ui_kits/ecossistema/#/blog' + (art ? '/' + art.slug : '');
	const counts = art ? { panels: art.segments.filter(s => s.t === 'panel').length, ascii: art.segments.filter(s => s.t === 'ascii').length, figures: art.segments.filter(s => s.t === 'figure').length + (art.cover ? 1 : 0) } : null;
	return (
		<div className="cms-page cms-blog">
			<header className="cms-head"><div><span className="cms-kicker">Preview idêntico ao real</span><h1>{art ? art.title : 'Blog'}</h1>
				<p className="text-muted">Rota real: <code>{src.replace('/ui_kits/ecossistema/#', '')}</code> · mesmos tokens e componentes do site publicado.</p></div>
				<div className="cms-actions"><SegmentedControl name="vp" value={viewport} onChange={setViewport} ariaLabel="Viewport" options={[{ value: 'desktop', label: 'Desktop' }, { value: 'mobile', label: 'Celular' }]} /><Button variant="secondary" size="sm" href={src} target="_blank">Abrir ↗</Button></div></header>
			<div className="cms-blog-layout">
				<aside className="cms-blog-list">
					<button className={'cms-blog-item' + (!art ? ' is-on' : '')} onClick={() => go('blog')}><b>Catálogo /blog</b><span className="text-muted">Lista com filtros</span></button>
					{data.articles.map(a => (
						<button key={a.slug} className={'cms-blog-item' + (art?.slug === a.slug ? ' is-on' : '')} onClick={() => go('blog/' + a.slug)}>
							<code>{a.code}</code><b>{a.title}</b><span><Tag tone="success">{a.status}</Tag> <span className="text-muted">{a.readingMinutes} min · {a.contentType}</span></span>
						</button>
					))}
				</aside>
				<div className="cms-blog-main">
					{art && (
						<div className="cms-panel cms-hooks">
							<div><b>Anexos no preview:</b> {counts.figures} imagens · {counts.panels} PlainTextPanel · {counts.ascii} AsciiDiagram · {art.sources.length} fontes</div>
							<div className="cms-actions">
								{['publicar', 'linkedin', 'newsletter', 'agendar'].map(a => <AutomationButton key={a} action={a} target={art.slug} payload={{ title: art.title, url: '/blog/' + art.slug, tags: art.tags }} automation={automation} />)}
							</div>
						</div>
					)}
					<div className={'cms-frame is-' + viewport}><iframe key={src} src={src} title="Preview do blog" /></div>
				</div>
			</div>
		</div>
	);
}
