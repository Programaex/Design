import { env, SELF } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { analytics } from '../worker/index.js';

const login = (user, pass) =>
	SELF.fetch('https://cms.test/api/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ user, pass }) });

async function sessionCookie() {
	const r = await login('000', '003');
	return r.headers.get('set-cookie').split(';')[0];
}

describe('login', () => {
	it('aceita 000 / 003 e devolve cookie HttpOnly', async () => {
		const r = await login('000', '003');
		expect(r.status).toBe(200);
		expect(r.headers.get('set-cookie')).toMatch(/cms_session=.+HttpOnly/);
	});
	it('recusa senha errada', async () => {
		const r = await login('000', '999');
		expect(r.status).toBe(401);
		expect(r.headers.get('set-cookie')).toBeNull();
	});
	it('redireciona páginas sem sessão para /login com next', async () => {
		const r = await SELF.fetch('https://cms.test/cms/?x=1', { redirect: 'manual' });
		expect(r.status).toBe(302);
		expect(r.headers.get('location')).toBe('https://cms.test/login?next=%2Fcms%2F%3Fx%3D1');
	});
	it('nega API sem sessão', async () => {
		expect((await SELF.fetch('https://cms.test/api/kv/progress')).status).toBe(401);
	});
	it('recusa cookie adulterado', async () => {
		const c = (await sessionCookie()).replace(/.$/, ch => (ch === 'A' ? 'B' : 'A'));
		expect((await SELF.fetch('https://cms.test/api/session', { headers: { cookie: c } })).status).toBe(401);
	});
});

describe('KV de progresso', () => {
	it('grava e lê o documento', async () => {
		const cookie = await sessionCookie();
		const doc = { done: { 'blog:capa': true }, cards: {} };
		const put = await SELF.fetch('https://cms.test/api/kv/progress', { method: 'PUT', headers: { cookie }, body: JSON.stringify(doc) });
		expect(put.status).toBe(200);
		const get = await SELF.fetch('https://cms.test/api/kv/progress', { headers: { cookie } });
		expect(await get.json()).toEqual(doc);
		expect(await env.CMS_KV.get('progress', 'json')).toEqual(doc);
	});
	it('rejeita JSON inválido e chaves desconhecidas', async () => {
		const cookie = await sessionCookie();
		expect((await SELF.fetch('https://cms.test/api/kv/progress', { method: 'PUT', headers: { cookie }, body: '{x' })).status).toBe(400);
		expect((await SELF.fetch('https://cms.test/api/kv/segredos', { headers: { cookie } })).status).toBe(404);
	});
});

describe('analytics', () => {
	it('sem secrets responde connected:false', async () => {
		expect(await analytics({})).toMatchObject({ connected: false });
	});
	it('agrega requests por dia', async () => {
		const fake = async () => new Response(JSON.stringify({ data: { viewer: { accounts: [{ workersInvocationsAdaptive: [
			{ sum: { requests: 3, errors: 1 }, dimensions: { date: '2026-10-15' } },
			{ sum: { requests: 2, errors: 0 }, dimensions: { date: '2026-10-15' } },
			{ sum: { requests: 5, errors: 0 }, dimensions: { date: '2026-10-16' } },
		] }] } } }));
		const r = await analytics({ CF_ANALYTICS_TOKEN: 't', CF_ACCOUNT_ID: 'a' }, 7, fake);
		expect(r.totals).toEqual({ requests: 10, errors: 1 });
		expect(r.series).toHaveLength(2);
	});
});
