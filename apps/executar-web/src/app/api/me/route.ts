import { db } from '@/lib/server/db';
import { DEFAULT_SETTINGS, displayName, json, route } from '@/lib/server/http';
import { sessionUserId } from '@/lib/server/session';

/** GET /api/me — the signed-in user, or { user: null } for guests (local-only mode is a normal state, not an error). */
export const GET = route(async () => {
	const uid = await sessionUserId();
	const u = uid ? await db().user.findUnique({ where: { id: uid } }) : null;
	if (!u) return json({ user: null });
	return json({ user: { id: u.id, email: u.email, name: displayName(u), settings: { ...DEFAULT_SETTINGS, ...(u.settings as object) } } });
});
