// Worker do CMS EXECUTAR: sessão por cookie assinado, progresso em KV e proxy de analytics.
// Os arquivos estáticos (dist/) só são servidos depois que a sessão é validada aqui.
const COOKIE = 'cms_session';
const SESSION_TTL = 60 * 60 * 12; // 12 h
const LOGIN_PAGES = ['/login', '/login/'];
// Fora da sessão: a tela de login e o site público — o ecossistema (/ui_kits/), os mini apps PWA (/m/) e o que eles
// carregam (tokens, componentes, assets). O CMS (/, /cms/), os documentos do repo (/files/) e a API continuam com login.
const PUBLIC_ASSETS = ['/styles.css', '/tokens/', '/components/components.css', '/cms/login.js', '/cms/cms.css', '/favicon.ico', '/assets/', '/_ds_bundle.js', '/ui_kits/', '/m/'];

const enc = new TextEncoder();
const b64url = buf => btoa(String.fromCharCode(...new Uint8Array(buf))).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

async function hmac(secret, data) {
	const key = await crypto.subtle.importKey('raw', enc.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, ['sign']);
	return b64url(await crypto.subtle.sign('HMAC', key, enc.encode(data)));
}

// Credenciais padrão enquanto os secrets não estão no Worker. Defina CMS_USER/CMS_PASS para trocá-las.
// Não exportar constantes: o workerd só aceita funções/handlers como exports nomeados do módulo principal.
const DEFAULT_USER = '000';
const DEFAULT_PASS = '003';
const creds = env => ({ user: env.CMS_USER || DEFAULT_USER, pass: env.CMS_PASS || DEFAULT_PASS });

function secretOf(env) {
	// SESSION_SECRET dedicado; se faltar, deriva das credenciais (sessões caem quando a senha muda).
	const c = creds(env);
	return env.SESSION_SECRET || `${c.user}:${c.pass}:executar-cms`;
}

export async function makeSession(env, now = Date.now()) {
	const exp = Math.floor(now / 1000) + SESSION_TTL;
	const payload = `${creds(env).user}.${exp}`;
	return `${payload}.${await hmac(secretOf(env), payload)}`;
}

export async function readSession(env, request, now = Date.now()) {
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

function cookie(value, maxAge) {
	return `${COOKIE}=${value}; Path=/; HttpOnly; Secure; SameSite=Lax; Max-Age=${maxAge}`;
}

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

// Progresso: um documento JSON por chave ("progress" para completude/Kanban, "automation-log" etc.).
const KV_KEYS = new Set(['progress', 'automation-log', 'settings', 'hub']);

async function kvRoute(request, env, key) {
	if (!KV_KEYS.has(key)) return json({ error: 'chave desconhecida' }, 404);
	if (!env.CMS_KV) return json({ error: 'KV CMS_KV não vinculado' }, 503);
	if (request.method === 'GET') return json((await env.CMS_KV.get(key, 'json')) ?? null);
	if (request.method === 'PUT') {
		const text = await request.text();
		if (text.length > 1_000_000) return json({ error: 'documento grande demais' }, 413);
		try { JSON.parse(text); } catch { return json({ error: 'JSON inválido' }, 400); }
		await env.CMS_KV.put(key, text);
		return json({ ok: true });
	}
	return json({ error: 'método não permitido' }, 405);
}

// Analytics do próprio Worker via GraphQL Analytics API. Sem token: { connected:false }.
const ANALYTICS_QUERY = `query($account:String!,$script:String!,$since:Time!,$until:Time!){viewer{accounts(filter:{accountTag:$account}){
 workersInvocationsAdaptive(limit:1000,filter:{scriptName:$script,datetime_geq:$since,datetime_leq:$until},orderBy:[date_ASC]){
  sum{requests errors subrequests} dimensions{date} }}}}`;

export async function analytics(env, days = 7, fetcher = fetch) {
	if (!env.CF_ANALYTICS_TOKEN || !env.CF_ACCOUNT_ID) return { connected: false, reason: 'Defina os secrets CF_ANALYTICS_TOKEN e CF_ACCOUNT_ID' };
	const until = new Date(), since = new Date(until.getTime() - days * 864e5);
	const r = await fetcher('https://api.cloudflare.com/client/v4/graphql', {
		method: 'POST',
		headers: { authorization: `Bearer ${env.CF_ANALYTICS_TOKEN}`, 'content-type': 'application/json' },
		body: JSON.stringify({ query: ANALYTICS_QUERY, variables: { account: env.CF_ACCOUNT_ID, script: env.CF_SCRIPT_NAME || 'design', since: since.toISOString(), until: until.toISOString() } }),
	});
	const data = await r.json().catch(() => ({}));
	if (!r.ok || data.errors?.length) return { connected: true, ok: false, error: data.errors?.[0]?.message || `HTTP ${r.status}` };
	const rows = data.data?.viewer?.accounts?.[0]?.workersInvocationsAdaptive || [];
	const byDay = {};
	for (const row of rows) {
		const d = row.dimensions.date;
		byDay[d] ??= { date: d, requests: 0, errors: 0 };
		byDay[d].requests += row.sum.requests;
		byDay[d].errors += row.sum.errors;
	}
	const series = Object.values(byDay);
	return { connected: true, ok: true, days, series, totals: series.reduce((t, d) => ({ requests: t.requests + d.requests, errors: t.errors + d.errors }), { requests: 0, errors: 0 }) };
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
		if (path === '/api/analytics') return json(await analytics(env, Math.min(30, Number(url.searchParams.get('days')) || 7)));
		const kv = path.match(/^\/api\/kv\/([a-z-]+)$/);
		if (kv) return kvRoute(request, env, kv[1]);
		if (path.startsWith('/api/')) return json({ error: 'rota desconhecida' }, 404);

		return env.ASSETS.fetch(request);
	},
};
