// End-to-end API test against a running server with a real database:
//   E2E_BASE_URL=http://localhost:3000 npm test -w apps/executar-web
// (the server must run with AUTH_DEV_LINKS=1 so the magic link comes back in the response).
import * as C from '@executar/core';
import { describe, expect, it } from 'vitest';

const base = process.env.E2E_BASE_URL;
const jar: Record<string, string> = {};
const run = Math.random().toString(36).slice(2, 8);

async function call(path: string, { method = 'GET', body, who = 'a', raw = false }: { method?: string; body?: unknown; who?: string; raw?: boolean } = {}) {
	const res = await fetch(base + path, {
		method, redirect: 'manual',
		headers: { ...(body !== undefined ? { 'content-type': raw ? 'text/csv' : 'application/json' } : {}), ...(jar[who] ? { cookie: jar[who] } : {}) },
		body: body === undefined ? undefined : raw ? String(body) : JSON.stringify(body)
	});
	const sc = res.headers.get('set-cookie'); if (sc) jar[who] = sc.split(';')[0];
	const txt = await res.text();
	let data: any; try { data = JSON.parse(txt); } catch { data = txt; } // eslint-disable-line @typescript-eslint/no-explicit-any
	return { status: res.status, data, headers: res.headers };
}
async function login(who: string, email: string) {
	const r = await call('/api/auth/email', { method: 'POST', body: { email }, who });
	expect(r.status).toBe(200);
	const u = new URL(r.data.devLink);
	const v = await call(u.pathname + u.search, { who });
	expect(v.status).toBe(303);
	expect(v.headers.get('location')).toMatch(/login=ok/);
	const again = await call(u.pathname + u.search, { who: 'nobody' });
	expect(again.headers.get('location')).toMatch(/login=expirado/);
}

describe.skipIf(!base)('API end-to-end', () => {
	const { plan, setup } = C.demoPlan();
	let base0: C.Plan;

	it('logs two people in with single-use magic links', async () => {
		expect((await call('/api/me', { who: 'guest' })).data.user).toBeNull();
		await login('a', `ana-${run}@exemplo.com`);
		await login('b', `bruno-${run}@exemplo.com`);
		expect((await call('/api/me')).data.user.email).toBe(`ana-${run}@exemplo.com`);
	});

	it('creates the plan on first sync and round-trips it', async () => {
		const r = await call('/api/sync', { method: 'POST', body: { base: null, local: plan, setup } });
		expect(r.status).toBe(200);
		expect(r.data.plan.ents).toEqual(plan.ents);
		expect(r.data.members[0].role).toBe('owner');
		base0 = r.data.plan;
		expect((await call('/api/sync', { method: 'POST', body: { base: null, local: plan }, who: 'b' })).status).toBe(403);
	});

	it('shares, merges concurrent edits and reports conflicts', async () => {
		const inv = await call(`/api/plans/${plan.id}/members`, { method: 'POST', body: { email: `bruno-${run}@exemplo.com` } });
		expect(inv.data.members).toHaveLength(2);
		const t0 = base0.ents[0].tarefas[2].id;
		const sb = await call('/api/sync', { method: 'POST', body: { base: base0, local: C.toggleTask(base0, t0) }, who: 'b' });
		expect(sb.data.conflicts).toEqual([]);
		const sa = await call('/api/sync', { method: 'POST', body: { base: base0, local: C.renameTask(base0, t0, 'Texto local') } });
		expect(sa.data.conflicts).toHaveLength(1);
		expect(sa.data.conflicts[0].by).toMatch(/bruno/);
		const resolved = C.resolveConflict(sa.data.plan, sa.data.conflicts[0], 'local');
		const sr = await call('/api/sync', { method: 'POST', body: { base: sa.data.plan, local: resolved } });
		expect(sr.data.plan.ents[0].tarefas[2]).toMatchObject({ custom: 'Texto local', done: false });
		expect((await call('/api/plans', { who: 'b' })).data.plans[0].role).toBe('editor');
		expect((await call(`/api/plans/${plan.id}`, { method: 'DELETE', who: 'b' })).status).toBe(403);
	});

	it('exports filled A4 templates and imports JSON / CSV', async () => {
		const ex = await call(`/api/plans/${plan.id}/export?template=workbook`);
		expect(ex.status).toBe(200);
		expect(ex.data).toContain('<section class="page"');
		expect((await call(`/api/plans/${plan.id}/export?template=nope`)).status).toBe(400);
		const csv = 'tarefa_id;cluster_id;cluster_nome;titulo;prioridade\nT1;C1;Site;Publicar;Alta\nT2;C2;Vendas;Ligar;Baixa';
		const ic = await call('/api/plans/import-csv?nome=Ops', { method: 'POST', body: csv, raw: true });
		expect(ic.status).toBe(201);
		expect(ic.data.plan.ents).toHaveLength(2);
		const ij = await call('/api/plans/import', { method: 'POST', body: C.exportPayload(plan, setup) });
		expect(ij.status).toBe(201);
		expect(ij.data.plan.id).not.toBe(plan.id);
	});

	it('validates input, saves settings and logs out', async () => {
		expect((await call('/api/sync', { method: 'POST', body: { base: null, local: { ...plan, nome: 'x'.repeat(500) } } })).status).toBe(400);
		expect((await call('/api/me/settings', { method: 'PATCH', body: { reminders: false, remTime: '07:00', lateAlerts: true, ai: true } })).data.settings.remTime).toBe('07:00');
		expect((await call('/api/auth/logout', { method: 'POST' })).status).toBe(200);
		expect((await call('/api/me')).data.user).toBeNull();
	});
});
