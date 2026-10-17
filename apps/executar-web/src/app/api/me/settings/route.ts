import { db } from '@/lib/server/db';
import { json, readJson, requireUser, route } from '@/lib/server/http';
import { SettingsSchema } from '@/lib/server/schemas';

export const PATCH = route(async (req: Request) => {
	const u = await requireUser();
	const settings = SettingsSchema.parse(await readJson(req, 4096));
	await db().user.update({ where: { id: u.id }, data: { settings } });
	return json({ settings });
});
