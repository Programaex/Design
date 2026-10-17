// EXECUTAR · Prisma service worker: the app shell keeps working offline (the plan itself lives in localStorage
// and syncs through /api/sync when the connection is back). API calls are never cached.
const CACHE = 'prisma-shell-v1';
const SHELL = ['/app', '/app/exportar', '/icon.svg', '/manifest.webmanifest'];

self.addEventListener('install', e => {
	e.waitUntil(caches.open(CACHE).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', e => {
	e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', e => {
	const req = e.request, url = new URL(req.url);
	if (req.method !== 'GET' || url.origin !== location.origin || url.pathname.startsWith('/api/')) return;
	if (req.mode === 'navigate') {
		// network first, cached page when offline
		e.respondWith(fetch(req).then(res => { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); return res; })
			.catch(() => caches.match(req).then(r => r || caches.match('/app'))));
		return;
	}
	if (url.pathname.startsWith('/_next/static/') || /\.(?:css|js|woff2?|svg|png|jpe?g|gif)$/.test(url.pathname)) {
		// immutable build assets: cache first
		e.respondWith(caches.match(req).then(hit => hit || fetch(req).then(res => { if (res.ok) { const copy = res.clone(); caches.open(CACHE).then(c => c.put(req, copy)); } return res; })));
	}
});
