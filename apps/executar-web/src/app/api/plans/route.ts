import { json, requireUser, route } from '@/lib/server/http';
import { listPlans } from '@/lib/server/plans';

/** GET /api/plans — plans the signed-in user owns or was invited to. */
export const GET = route(async () => {
	const u = await requireUser();
	return json({ plans: await listPlans(u.id) });
});
