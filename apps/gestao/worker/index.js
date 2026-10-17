// Worker do painel de gestão: sessão por cookie assinado (mesmo modelo do apps/site) e
// /api/epicos/:n, que mescla o snapshot do workbook com as issues ao vivo do GitHub.
import snapshot from '../data/snapshot.json';
import { mergeEpic } from '../lib/merge.mjs';

const COOKIE = 'gestao_session';
const SESSION_TTL = 60 * 60 * 12; // 12 h
const LOGIN_PAGES = ['/login', '/login/'];
// Só o necessário para desenhar a tela de login fica fora da sessão.
const PUBLIC_ASSETS = ['/styles.css', '/tokens/', '/components/components.css', '/app/login.js', '/app/app.css', '/assets/brand/', '/favicon.ico'];
const GITHUB_TTL_S = 600;
const EPICS = new Set(Object.keys(snapshot.epics).map(Number));

const enc = new TextEncoder();
const b64url = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

async function hmac(secret, data) {
	const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
	return b64url(await crypto.subtle.sign('HMAC', key, enc.encode(data)));
}

// Credenciais padrão enquanto os secrets não estão no Worker. Defina CMS_USER/CMS_PASS para trocá-las.
const DEFAULT_USER = '000';
const DEFAULT_PASS = '003';
const creds = env => ({ user: env.CMS_USER || DEFAULT_USER, pass: env.CMS_PASS || DEFAULT_PASS });
const secretOf = env => env.SESSION_SECRET || `${creds(env).user}:${creds(env).pass}:executar-gestao`;

async function makeSession(env, now = Date.now()) {
	const exp = Math.floor(now / 1000) + SESSION_TTL;
	const payload = `${creds(env).user}.${exp}`;
	return `${payload}.${await hmac(secretOf(env), payload)}`;
}

async function readSession(env, request, now = Date.now()) {
	const raw = (request.headers.get('cookie') || '').split(/;\s*/).find(c => c.startsWith(COOKIE + '='));
	if (!raw) return null;
	const value = raw.slice(COOKIE.length + 1);
	const i = value.lastIndexOf('.');
	if (i < 0) return null;
	const payload = value.slice(0, i), sig = value.slice(i + 1);
	if (sig !== (await hmac(secretOf(env), payload))) return null;
	const exp = Number(payload.split('.').pop());
	return exp * 1000 > now ? { user: creds(env).user } : null;
}

const json = (data, status = 200, headers = {}) =>
	new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json; charset=utf-8', 'cache-control': 'no-store', ...headers } });
const cookie = (value, maxAge) => `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;

async function login(request, env) {
	let body = {};
	const type = request.headers.get('content-type') || '';
	if (type.includes('application/json')) body = await request.json().catch(() => ({}));
	else body = Object.fromEntries(await request.formData().catch(() => new FormData()));
	const c = creds(env);
	const ok = String(body.user ?? '') === c.user && String(body.pass ?? '') === c.pass;
	if (!ok) return json({ ok: false, error: 'Usuário ou senha inválidos' }, 401);
	return json({ ok: true }, 200, { 'set-cookie': cookie(await makeSession(env), SESSION_TTL) });
}

// GET na API do GitHub com cache de 10 min (Cache API). GITHUB_TOKEN é opcional: o repositório é público,
// o token só sobe o limite de 60 para 5000 chamadas/hora.
async function githubJson(env, path, { fetcher = fetch, cache = globalThis.caches?.default, fresh = false } = {}) {
	const url = `https://api.github.com/repos/${env.GITHUB_REPO || 'Programaex/workbook'}${path}`;
	const key = new Request(url);
	if (cache && !fresh) {
		const hit = await cache.match(key);
		if (hit) return { data: await hit.json(), fetchedAt: hit.headers.get('x-fetched-at') };
	}
	const res = await fetcher(url, {
		headers: { Accept: 'application/vnd.github+json', 'User-Agent': 'executar-gestao', 'X-GitHub-Api-Version': '2022-11-28', ...(env.GITHUB_TOKEN ? { Authorization: `Bearer ${env.GITHUB_TOKEN}` } : {}) },
	});
	if (!res.ok) throw new Error(`GitHub ${res.status}`);
	const text = await res.text();
	const fetchedAt = new Date().toISOString();
	if (cache) await cache.put(key, new Response(text, { headers: { 'content-type': 'application/json', 'cache-control': `max-age=${GITHUB_TTL_S}`, 'x-fetched-at': fetchedAt } }));
	return { data: JSON.parse(text), fetchedAt };
}

export async function loadEpic(env, n, opts = {}) {
	const base = snapshot.epics[n];
	let live = null, error = null, fetchedAt = null;
	try {
		const [epic, subs] = await Promise.all([githubJson(env, `/issues/${n}`, opts), githubJson(env, `/issues/${n}/sub_issues?per_page=100`, opts)]);
		live = { epic: epic.data, subs: subs.data };
		fetchedAt = epic.fetchedAt;
	} catch (e) {
		error = e.message;
	}
	return { ...mergeEpic(base, live, { error }), fetchedAt, snapshotAt: snapshot.generatedAt, snapshotSource: snapshot.source };
}

export default {
	async fetch(request, env) {
		const url = new URL(request.url);
		const path = url.pathname;

		if (path === '/api/login' && request.method === 'POST') return login(request, env);
		if (path === '/api/logout') return json({ ok: true }, 200, { 'set-cookie': cookie('', 0) });
		if (LOGIN_PAGES.includes(path)) return env.ASSETS.fetch(new Request(new URL('/login', url), request));
		if (PUBLIC_ASSETS.some(p => (p.endsWith('/') ? path.startsWith(p) : path === p))) return env.ASSETS.fetch(request);

		const session = await readSession(env, request);
		if (!session) {
			if (path.startsWith('/api/')) return json({ error: 'não autenticado' }, 401);
			const to = new URL('/login', url);
			to.searchParams.set('next', path + url.search);
			return Response.redirect(to.toString(), 302);
		}

		if (path === '/api/session') return json({ user: session.user });
		const epic = path.match(/^\/api\/epicos\/(\d+)$/);
		if (epic) {
			const n = Number(epic[1]);
			if (!EPICS.has(n)) return json({ error: 'épico fora do painel' }, 404);
			return json(await loadEpic(env, n, { fresh: url.searchParams.get('fresh') === '1' }));
		}
		if (path.startsWith('/api/')) return json({ error: 'rota desconhecida' }, 404);
		return env.ASSETS.fetch(request);
	},
};
