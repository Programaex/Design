// Vite plugin: one web app manifest per mini app and a single service worker (/m/sw.js) that precaches every page
// and built asset, so any mini app opens offline after the first visit to any of them.
import { createHash } from 'node:crypto';
import type { Plugin } from 'vite';
import catalog from './catalog.json';

export const BASE = '/m/';
export const APPS = catalog.apps;

export function pwa(): Plugin {
	return {
		name: 'executar-miniapps-pwa',
		apply: 'build',
		generateBundle(_, bundle) {
			for (const a of APPS) {
				const scope = BASE + a.slug + '/';
				this.emitFile({
					type: 'asset',
					fileName: a.slug + '/manifest.webmanifest',
					source: JSON.stringify({
						id: scope, name: a.name, short_name: a.title, description: a.description, lang: 'pt-BR', dir: 'ltr',
						start_url: scope, scope, display: 'standalone', background_color: '#ffffff', theme_color: '#ffffff',
						icons: [
							{ src: BASE + 'icons/' + a.slug + '-192.png', sizes: '192x192', type: 'image/png', purpose: 'any' },
							{ src: BASE + 'icons/' + a.slug + '-512.png', sizes: '512x512', type: 'image/png', purpose: 'any' },
							{ src: BASE + 'icons/' + a.slug + '-maskable.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
							{ src: BASE + 'icons/' + a.slug + '.svg', sizes: 'any', type: 'image/svg+xml', purpose: 'any' }
						],
						shortcuts: APPS.filter(o => o.slug !== a.slug && o.catalog === 'apps').slice(0, 3).map(o => ({ name: o.title, url: BASE + o.slug + '/' }))
					}, null, 2)
				});
			}
			const files = Object.keys(bundle).filter(f => !f.endsWith('.map'));
			const pages = files.filter(f => f.endsWith('index.html')).map(f => BASE + f.replace(/index\.html$/, ''));
			const assets = files.filter(f => !f.endsWith('.html')).map(f => BASE + f);
			const icons = APPS.flatMap(a => [`${BASE}icons/${a.slug}.svg`, `${BASE}icons/${a.slug}-192.png`]);
			// built file names carry content hashes, so this changes exactly when something changed
			const version = createHash('sha256').update(files.sort().join('\n')).digest('hex').slice(0, 12);
			this.emitFile({ type: 'asset', fileName: 'sw.js', source: serviceWorker([...pages, ...assets, ...icons], version) });
		}
	};
}

function serviceWorker(precache: string[], version: string) {
	return `// EXECUTAR mini apps service worker (gerado por apps/miniapps/pwa.ts). Escopo: ${BASE}
const CACHE = 'executar-miniapps-${version}';
const PRECACHE = ${JSON.stringify(precache)};
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(PRECACHE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => {
	e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k.startsWith('executar-miniapps-') && k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
	const req = e.request, url = new URL(req.url);
	if (req.method !== 'GET' || url.origin !== location.origin || !url.pathname.startsWith('${BASE}')) return;
	if (req.mode === 'navigate') {
		// rede primeiro (versão nova quando há conexão); sem conexão, a página guardada
		e.respondWith(fetch(req).then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(url.pathname, copy)); } return res; })
			.catch(() => caches.match(url.pathname, { ignoreSearch: true }).then(r => r || caches.match('${BASE}'))));
		return;
	}
	e.respondWith(caches.match(req, { ignoreSearch: true }).then(hit => hit || fetch(req).then(res => {
		if (res.ok && url.pathname.startsWith('${BASE}')) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); }
		return res;
	})));
});
`;
}
