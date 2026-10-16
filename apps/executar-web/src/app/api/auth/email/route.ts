import { db } from '@/lib/server/db';
import { fail, json, readJson, route } from '@/lib/server/http';
import { EmailSchema } from '@/lib/server/schemas';
import { newLoginToken } from '@/lib/server/session';

const TTL_MIN = 15;

/** POST /api/auth/email — starts a magic-link login. */
export const POST = route(async (req: Request) => {
	const { email, next } = EmailSchema.parse(await readJson(req, 4096));
	const recent = await db().loginToken.count({ where: { email, createdAt: { gt: new Date(Date.now() - 10 * 60_000) } } });
	if (recent >= 5) return fail(429, 'Muitas tentativas. Espere alguns minutos.');
	const { token, hash } = newLoginToken();
	await db().loginToken.create({ data: { tokenHash: hash, email, expires: new Date(Date.now() + TTL_MIN * 60_000) } });
	const safeNext = next && next.startsWith('/') && !next.startsWith('//') ? next : '/app';
	const link = new URL('/api/auth/verify?token=' + token + '&next=' + encodeURIComponent(safeNext), req.url).toString();
	const devLinks = process.env.NODE_ENV !== 'production' || process.env.AUTH_DEV_LINKS === '1';
	if (devLinks) {
		console.info('[auth] link de acesso para %s: %s', email, link);
		return json({ sent: true, devLink: link });
	}
	// Production e-mail delivery is not wired yet (no provider configured in this repository).
	return fail(501, 'O envio do link por e-mail ainda não está configurado neste servidor.');
});
