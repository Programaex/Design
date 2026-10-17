// Entrada do Worker com assets embutidos (deploy:inline). Reproduz o que o binding ASSETS faz:
// "/" → index.html, "/login" → login.html, caminho sem extensão desconhecido → 404.html com status 404.
import worker from '../worker/index.js';
import assets from '../.inline/assets.json';

const decode = b64 => Uint8Array.from(atob(b64), c => c.charCodeAt(0));
const respond = (asset, method, status = 200) =>
	new Response(method === 'HEAD' ? null : decode(asset.body), { status, headers: { 'content-type': asset.type, 'cache-control': 'no-cache' } });

const ASSETS = {
	async fetch(input) {
		const request = input instanceof Request ? input : new Request(input);
		const { pathname } = new URL(request.url);
		if (request.method !== 'GET' && request.method !== 'HEAD') return new Response('Method Not Allowed', { status: 405 });
		const path = pathname.endsWith('/') ? pathname + 'index.html' : pathname;
		const asset = assets[path] ?? assets[path + '.html'] ?? assets[path.replace(/\/index\.html$/, '.html')];
		if (asset) return respond(asset, request.method);
		return respond(assets['/404.html'], request.method, 404);
	},
};

export default {
	fetch: (request, env, ctx) => worker.fetch(request, { ...env, ASSETS }, ctx),
};
