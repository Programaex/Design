// FocusLock: Durable Object (instância única "global") que arbitra WIP=1 em todo o CMS (ADR-003/ADR-007).
// Operações são serializadas pelo DO. Cada comando leva idempotencyKey: repetir a mesma chave devolve o mesmo
// resultado sem novo efeito. Iniciar uma segunda tarefa enquanto outra está em execução é rejeitado (409).
import { DurableObject } from 'cloudflare:workers';

const EMPTY = { activeTaskId: null, status: 'idle', revision: 0, startedAt: null, attempts: [], results: {} };

export class FocusLock extends DurableObject {
	async state() {
		return (await this.ctx.storage.get('state')) || structuredClone(EMPTY);
	}

	async command(cmd) {
		const s = await this.state();
		if (cmd.idempotencyKey && s.results[cmd.idempotencyKey]) return { ...s.results[cmd.idempotencyKey], replayed: true };
		const res = this.apply(s, cmd);
		if (cmd.idempotencyKey) {
			s.results[cmd.idempotencyKey] = res;
			const keys = Object.keys(s.results);
			if (keys.length > 500) for (const k of keys.slice(0, keys.length - 500)) delete s.results[k];
		}
		await this.ctx.storage.put('state', s);
		return res;
	}

	apply(s, { action, taskId, expectedRevision, note, evidence, returnTo, at = new Date().toISOString() }) {
		const view = () => ({ ok: true, state: { activeTaskId: s.activeTaskId, status: s.status, revision: s.revision, startedAt: s.startedAt, attempts: s.attempts.slice(-50) } });
		const conflict = message => ({ ok: false, status: 409, message, state: view().state });
		if (expectedRevision != null && expectedRevision !== s.revision) return conflict(`Revisão ${expectedRevision} desatualizada (atual ${s.revision}).`);
		switch (action) {
			case 'start':
				if (!taskId) return { ok: false, status: 400, message: 'taskId obrigatório.' };
				if (s.activeTaskId && s.activeTaskId !== taskId) return conflict(`WIP=1: ${s.activeTaskId} já está em execução.`);
				if (s.activeTaskId === taskId) return conflict(`${taskId} já está em execução.`);
				s.activeTaskId = taskId; s.status = 'running'; s.startedAt = at;
				break;
			case 'complete':
			case 'fail':
			case 'reject':
				if (!s.activeTaskId || s.activeTaskId !== taskId) return conflict(`${taskId} não é a tarefa em execução.`);
				s.attempts.push({ taskId, outcome: action === 'complete' ? 'completed' : action === 'fail' ? 'error' : 'rejected', startedAt: s.startedAt, endedAt: at, note: note || '', evidence: evidence || null, returnTo: returnTo || null });
				s.activeTaskId = null; s.status = 'idle'; s.startedAt = null;
				break;
			case 'state':
				return view();
			default:
				return { ok: false, status: 400, message: 'Ação desconhecida.' };
		}
		s.revision++;
		return view();
	}
}

export async function focusRoute(request, env, action) {
	if (!env.FOCUS_LOCK) return new Response(JSON.stringify({ ok: false, message: 'Durable Object FOCUS_LOCK não vinculado.' }), { status: 503, headers: { 'content-type': 'application/json' } });
	const stub = env.FOCUS_LOCK.get(env.FOCUS_LOCK.idFromName('global'));
	const body = request.method === 'POST' ? await request.json().catch(() => ({})) : {};
	const res = await stub.command({ ...body, action });
	return new Response(JSON.stringify(res), { status: res.ok ? 200 : res.status || 400, headers: { 'content-type': 'application/json', 'cache-control': 'no-store' } });
}
