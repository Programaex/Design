import 'server-only';
import * as C from '@executar/core';
import type { Prisma } from '@/generated/prisma/client';
import { db, type Db } from './db';

type Tx = Prisma.TransactionClient | Db;
export type Role = 'owner' | 'editor' | 'viewer';
export interface MemberOut { name: string; email: string; role: Role | 'invited' }

const dateOnly = (iso: string) => new Date(iso + 'T00:00:00.000Z');
const isoOf = (d: Date) => d.toISOString().slice(0, 10);

const planInclude = {
	entregas: { orderBy: { order: 'asc' }, include: { tarefas: { orderBy: { order: 'asc' } } } },
	rotinas: { orderBy: { order: 'asc' } },
	members: { include: { user: { select: { email: true, name: true, createdAt: true } } } }
} satisfies Prisma.PlanInclude;
type PlanRow = Prisma.PlanGetPayload<{ include: typeof planInclude }>;

function toCore(row: PlanRow): C.Plan {
	return {
		id: row.id, nome: row.nome, inicio: isoOf(row.inicio), periodo: row.periodo, lang: row.lang, rotDate: isoOf(row.rotDate), version: row.version,
		notes: (row.notes ?? {}) as Record<string, string>, itemStatus: (row.itemStatus ?? {}) as Record<string, 'deferred' | 'ready'>,
		ents: row.entregas.map(e => ({
			id: e.id, titulo: e.titulo, grupo: e.grupo, hz: e.hz as C.Hz, prova: { p: e.provaP, e: e.provaE },
			tarefas: e.tarefas.map(t => ({ id: t.id, ...(t.ref ? { ref: t.ref } : {}), p: t.p, e: t.e, ...(t.custom != null ? { custom: t.custom } : {}), done: t.done, updatedAt: t.updatedAt.getTime() }))
		})),
		rotinas: row.rotinas.map(r => ({ id: r.id, k: r.k as C.RoutineKey, done: r.done }))
	};
}
function membersOf(row: PlanRow): MemberOut[] {
	return row.members.map(m => ({ name: m.user.name || m.user.email.split('@')[0], email: m.user.email, role: m.role }))
		.sort((a, b) => (a.role === 'owner' ? -1 : b.role === 'owner' ? 1 : a.email.localeCompare(b.email)));
}

export async function membership(planId: string, userId: string, tx: Tx = db()) {
	const m = await tx.planMember.findUnique({ where: { planId_userId: { planId, userId } } });
	return m?.role ?? null;
}

export async function loadPlan(planId: string, tx: Tx = db()) {
	const row = await tx.plan.findUnique({ where: { id: planId }, include: planInclude });
	if (!row) return null;
	return { plan: toCore(row), setup: (row.setup && Object.keys(row.setup as object).length ? row.setup : null) as C.Setup | null, members: membersOf(row) };
}

export async function listPlans(userId: string) {
	const rows = await db().planMember.findMany({ where: { userId }, include: { plan: { select: { id: true, nome: true, updatedAt: true } } }, orderBy: { plan: { updatedAt: 'desc' } } });
	return rows.map(r => ({ id: r.plan.id, nome: r.plan.nome, updatedAt: r.plan.updatedAt.toISOString(), role: r.role }));
}

/** Replaces the plan's tree with `plan` (the merge already happened in memory). */
export async function writePlan(tx: Tx, plan: C.Plan, setup: C.Setup | undefined, userId: string, create: boolean) {
	const data = {
		nome: plan.nome, inicio: dateOnly(plan.inicio), periodo: plan.periodo, lang: plan.lang, rotDate: dateOnly(plan.rotDate), version: plan.version,
		notes: plan.notes ?? {}, itemStatus: plan.itemStatus ?? {}, updatedBy: userId, ...(setup ? { setup: setup as unknown as Prisma.InputJsonValue } : {})
	};
	if (create) {
		await tx.plan.create({ data: { id: plan.id, ...data, members: { create: { userId, role: 'owner' } } } });
	} else {
		await tx.plan.update({ where: { id: plan.id }, data });
		await tx.task.deleteMany({ where: { planId: plan.id } });
		await tx.deliverable.deleteMany({ where: { planId: plan.id } });
		await tx.routine.deleteMany({ where: { planId: plan.id } });
	}
	if (plan.ents.length) await tx.deliverable.createMany({ data: plan.ents.map((e, i) => ({ planId: plan.id, id: e.id, titulo: e.titulo, grupo: e.grupo, hz: e.hz, provaP: e.prova.p, provaE: e.prova.e, order: i })) });
	const tasks = plan.ents.flatMap(e => e.tarefas.map((t, i) => ({ planId: plan.id, id: t.id, deliverableId: e.id, ref: t.ref ?? null, p: t.p, e: t.e, custom: t.custom ?? null, done: t.done, order: i, updatedAt: new Date(t.updatedAt) })));
	if (tasks.length) await tx.task.createMany({ data: tasks });
	if (plan.rotinas.length) await tx.routine.createMany({ data: plan.rotinas.map((r, i) => ({ planId: plan.id, id: r.id, k: r.k, done: r.done, order: i })) });
}

export class HttpError extends Error {
	constructor(public status: number, message: string) { super(message); }
}

/**
 * POST /api/sync core: creates the plan on first upload, otherwise three-way merges (base · device · server).
 * Runs in a serializable transaction so two devices syncing at once cannot both win.
 */
export async function syncPlan(userId: string, userName: string, input: { base: C.Plan | null; local: C.Plan; setup?: C.Setup }) {
	const { base, local, setup } = input;
	return db().$transaction(async tx => {
		const existing = await tx.plan.findUnique({ where: { id: local.id }, select: { id: true, updatedBy: true } });
		if (!existing) {
			const plan = { ...local, version: Math.max(1, local.version) };
			await writePlan(tx, plan, setup, userId, true);
			return { ...(await loadPlan(plan.id, tx))!, conflicts: [] as C.Conflict[] };
		}
		const role = await membership(local.id, userId, tx);
		if (!role) throw new HttpError(403, 'Você não tem acesso a este plano.');
		if (role === 'viewer') throw new HttpError(403, 'Seu acesso a este plano é só de leitura.');
		const remote = (await loadPlan(local.id, tx))!;
		let by = 'Outro aparelho';
		if (existing.updatedBy && existing.updatedBy !== userId) {
			const u = await tx.user.findUnique({ where: { id: existing.updatedBy }, select: { name: true, email: true } });
			if (u) by = u.name || u.email;
		} else if (existing.updatedBy === userId) by = userName + ' (outro aparelho)';
		const { merged, conflicts } = C.mergePlans(base, local, remote.plan, by);
		merged.version = remote.plan.version + 1;
		await writePlan(tx, merged, setup, userId, false);
		return { ...(await loadPlan(merged.id, tx))!, conflicts };
	}, { isolationLevel: 'Serializable', timeout: 15000 });
}
