import { NextResponse } from 'next/server';
import { db } from '@/lib/server/db';
import { hashToken, setSession } from '@/lib/server/session';

/** GET /api/auth/verify?token=… — consumes the magic link, creates the user on first login, sets the session cookie. */
export async function GET(req: Request) {
	const url = new URL(req.url);
	const token = url.searchParams.get('token') || '';
	const next = url.searchParams.get('next') || '/app';
	const dest = new URL(next.startsWith('/') && !next.startsWith('//') ? next : '/app', url);
	const row = token ? await db().loginToken.findUnique({ where: { tokenHash: hashToken(token) } }) : null;
	if (!row || row.expires < new Date()) {
		dest.searchParams.set('login', 'expirado');
		return NextResponse.redirect(dest, 303);
	}
	await db().loginToken.delete({ where: { tokenHash: row.tokenHash } });
	const user = await db().user.upsert({ where: { email: row.email }, update: {}, create: { email: row.email, name: row.email.split('@')[0] } });
	await setSession(user.id);
	dest.searchParams.set('login', 'ok');
	return NextResponse.redirect(dest, 303);
}
