import { SELF } from 'cloudflare:test';
import { describe, expect, it } from 'vitest';
import { loadEpic } from '../worker/index.js';

const login = (user, pass) =>
	SELF.fetch('https://gestao.test/api/login', { method: 'POST', headers: { 'content-type': 'application/json' }, body: JSON.stringify({ user, pass }) });
const sessionCookie = async () => (await login('000', '003')).headers.get('set-cookie').split(';')[0];

describe('sessão', () => {
	it('aceita as credenciais e devolve cookie HttpOnly', async () => {
		const r = await login('000', '003');
		expect(r.status).toBe(200);
		expect(r.headers.get('set-cookie')).toMatch(/gestao_session=.+HttpOnly/);
	});
	it('recusa senha errada', async () => {
		expect((await login('000', '999')).status).toBe(401);
	});
	it('redireciona a página sem sessão para /login com next', async () => {
		const r = await SELF.fetch('https://gestao.test/#/epic01', { redirect: 'manual' });
		expect(r.status).toBe(302);
		expect(r.headers.get('location')).toBe('https://gestao.test/login?next=%2F');
	});
	it('nega a API sem sessão e recusa cookie adulterado', async () => {
		expect((await SELF.fetch('https://gestao.test/api/epicos/3')).status).toBe(401);
		const c = (await sessionCookie()).replace(/.$/, ch => (ch === 'A' ? 'B' : 'A'));
		expect((await SELF.fetch('https://gestao.test/api/session', { headers: { cookie: c } })).status).toBe(401);
	});
	it('só serve os épicos do painel', async () => {
		const r = await SELF.fetch('https://gestao.test/api/epicos/9', { headers: { cookie: await sessionCookie() } });
		expect(r.status).toBe(404);
	});
});

const env = { GITHUB_REPO: 'Programaex/workbook' };
const ghFetcher = (state = 'closed') => async url => {
	if (url.endsWith('/issues/5')) return Response.json({ number: 5, title: '[EPIC] Emprego', state: 'open', labels: [{ name: 'tipo:epic' }, { name: 'co:GV.PES' }], body: '**Início:** 2026-11-19 · **Prazo:** 2027-03-30' });
	if (url.includes('/issues/5/sub_issues')) return Response.json([{ number: 69, title: 'Planejar', state, labels: [{ name: 'tipo:issue' }], body: '**Início:** 2026-11-19 · **Prazo:** 2026-11-21' }]);
	return new Response('not found', { status: 404 });
};

describe('loadEpic (GitHub + snapshot)', () => {
	it('mescla o GitHub sobre o snapshot', async () => {
		const d = await loadEpic(env, 5, { fetcher: ghFetcher(), cache: null });
		expect(d.source).toBe('github');
		expect(d.items.find(i => i.number === 69).state).toBe('closed');
		expect(d.items.filter(i => i.missingOnGithub).length).toBe(23);
		expect(d.snapshotAt).toBeTruthy();
	});
	it('usa o snapshot quando o GitHub falha', async () => {
		const d = await loadEpic(env, 5, { fetcher: async () => new Response('rate limit', { status: 403 }), cache: null });
		expect(d.source).toBe('snapshot');
		expect(d.items.length).toBe(24);
		expect(d.warnings[0]).toMatch(/GitHub 403/);
	});
	it('guarda a resposta no cache e reaproveita na segunda chamada', async () => {
		let calls = 0;
		const f = async (url, init) => { calls++; return ghFetcher('open')(url, init); };
		const cache = await caches.open('teste-gestao');
		await loadEpic(env, 5, { fetcher: f, cache });
		await loadEpic(env, 5, { fetcher: f, cache });
		expect(calls).toBe(2);
	});
});
