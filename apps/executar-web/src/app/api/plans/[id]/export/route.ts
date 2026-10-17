import * as C from '@executar/core';
import { fail, requireUser, route } from '@/lib/server/http';
import { loadPlan, membership } from '@/lib/server/plans';

type Ctx = { params: Promise<{ id: string }> };

/** GET /api/plans/[id]/export?template=prisma|semana|workbook|status — the filled A4 template as a standalone HTML file. */
export const GET = route(async (req: Request, { params }: Ctx) => {
	const u = await requireUser();
	const { id } = await params;
	if (!(await membership(id, u.id))) return fail(404, 'Plano não encontrado.');
	const t = new URL(req.url).searchParams.get('template') || 'prisma';
	if (!C.isTemplateId(t)) return fail(400, 'Modelo desconhecido. Use prisma, semana, workbook ou status.');
	const doc = C.documentHtml(t, (await loadPlan(id))!.plan);
	return new Response(doc.html, { headers: { 'content-type': 'text/html; charset=utf-8', 'content-disposition': `inline; filename="${doc.filename}"`, 'x-pages': String(doc.pages) } });
});
