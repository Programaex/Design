import * as C from '@executar/core';
import { db } from '@/lib/server/db';
import { fail, json, requireUser, route } from '@/lib/server/http';
import { HttpError, loadPlan, writePlan } from '@/lib/server/plans';
import { PlanSchema } from '@/lib/server/schemas';

/** POST /api/plans/import-csv?nome=… — body: CSV #3 of plano-operacional-rastreavel (text/csv). */
export const POST = route(async (req: Request) => {
	const u = await requireUser();
	const text = await req.text();
	if (text.length > 1_000_000) return fail(413, 'Arquivo grande demais.');
	const nome = (new URL(req.url).searchParams.get('nome') || 'Plano operacional').slice(0, 120);
	let parsed;
	try { parsed = C.planFromCsv(text, nome); } catch (e) { throw new HttpError(400, e instanceof Error ? e.message : 'CSV inválido'); }
	const plan = PlanSchema.parse(parsed.plan);
	await db().$transaction(tx => writePlan(tx, plan, parsed.setup, u.id, true));
	return json(await loadPlan(plan.id), { status: 201 });
});
