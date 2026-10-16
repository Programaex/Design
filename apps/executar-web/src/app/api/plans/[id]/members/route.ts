import { db } from '@/lib/server/db';
import { fail, json, readJson, requireUser, route } from '@/lib/server/http';
import { loadPlan, membership } from '@/lib/server/plans';
import { EmailSchema } from '@/lib/server/schemas';

type Ctx = { params: Promise<{ id: string }> };

export const GET = route(async (_req: Request, { params }: Ctx) => {
	const u = await requireUser();
	const { id } = await params;
	if (!(await membership(id, u.id))) return fail(404, 'Plano não encontrado.');
	return json({ members: (await loadPlan(id))!.members });
});

/** POST /api/plans/[id]/members { email } — invites someone as editor (the account is created on their first login). */
export const POST = route(async (req: Request, { params }: Ctx) => {
	const u = await requireUser();
	const { id } = await params;
	const role = await membership(id, u.id);
	if (!role) return fail(404, 'Sincronize o plano antes de compartilhar.');
	if (role === 'viewer') return fail(403, 'Seu acesso a este plano é só de leitura.');
	const { email } = EmailSchema.parse(await readJson(req, 4096));
	const invitee = await db().user.upsert({ where: { email }, update: {}, create: { email, name: email.split('@')[0] } });
	await db().planMember.upsert({ where: { planId_userId: { planId: id, userId: invitee.id } }, update: {}, create: { planId: id, userId: invitee.id, role: 'editor' } });
	return json({ members: (await loadPlan(id))!.members });
});
