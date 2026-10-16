import { db } from '@/lib/server/db';
import { fail, json, requireUser, route } from '@/lib/server/http';
import { loadPlan, membership } from '@/lib/server/plans';

type Ctx = { params: Promise<{ id: string }> };

export const GET = route(async (_req: Request, { params }: Ctx) => {
	const u = await requireUser();
	const { id } = await params;
	if (!(await membership(id, u.id))) return fail(404, 'Plano não encontrado.');
	const r = await loadPlan(id);
	return r ? json({ ...r, conflicts: [] }) : fail(404, 'Plano não encontrado.');
});

export const DELETE = route(async (_req: Request, { params }: Ctx) => {
	const u = await requireUser();
	const { id } = await params;
	const role = await membership(id, u.id);
	if (!role) return fail(404, 'Plano não encontrado.');
	if (role !== 'owner') return fail(403, 'Só quem criou o plano pode apagá-lo.');
	await db().plan.delete({ where: { id } });
	return json({ ok: true });
});
