import { displayName, json, readJson, requireUser, route } from '@/lib/server/http';
import { syncPlan } from '@/lib/server/plans';
import { SyncSchema } from '@/lib/server/schemas';

/**
 * POST /api/sync { base, local, setup } — offline-first sync. `base` is the last plan this device received from the
 * server (null on first upload). Returns the merged plan, the members and any task-level conflicts to resolve.
 */
export const POST = route(async (req: Request) => {
	const u = await requireUser();
	const body = SyncSchema.parse(await readJson(req));
	return json(await syncPlan(u.id, displayName(u), body));
});
