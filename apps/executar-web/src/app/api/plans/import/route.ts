import * as C from '@executar/core';
import { db } from '@/lib/server/db';
import { json, readJson, requireUser, route } from '@/lib/server/http';
import { loadPlan, writePlan } from '@/lib/server/plans';
import { PlanSchema, SetupSchema } from '@/lib/server/schemas';

/** POST /api/plans/import — body: the JSON exported by the app ({ versao, plan, setup }). Always creates a new plan. */
export const POST = route(async (req: Request) => {
	const u = await requireUser();
	const r = C.parseImport(JSON.stringify(await readJson(req)));
	const plan = PlanSchema.parse({ ...r.plan, id: C.planUid(), version: 1 });
	const setup = SetupSchema.parse(r.setup);
	await db().$transaction(tx => writePlan(tx, plan, setup, u.id, true));
	return json(await loadPlan(plan.id), { status: 201 });
});
