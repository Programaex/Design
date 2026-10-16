import 'server-only';
import { createHash, createHmac, randomBytes, timingSafeEqual } from 'node:crypto';
import { cookies, headers } from 'next/headers';

// Stateless session: base64url(JSON {uid, exp}) + "." + HMAC-SHA256(AUTH_SECRET). HttpOnly, SameSite=Lax.
export const SESSION_COOKIE = 'executar_session';
const MAX_AGE = 60 * 60 * 24 * 60; // 60 days

function secret() {
	const s = process.env.AUTH_SECRET;
	if (s && s.length >= 32) return s;
	if (process.env.NODE_ENV === 'production') throw new Error('AUTH_SECRET precisa ter pelo menos 32 caracteres em produção');
	return 'executar-dev-secret-not-for-production-use-0000';
}
const b64 = (b: Buffer | string) => Buffer.from(b).toString('base64url');
const sign = (payload: string) => createHmac('sha256', secret()).update(payload).digest('base64url');

export function encodeSession(uid: string, now = Date.now()) {
	const payload = b64(JSON.stringify({ uid, exp: now + MAX_AGE * 1000 }));
	return payload + '.' + sign(payload);
}
export function decodeSession(token: string | undefined, now = Date.now()): string | null {
	if (!token) return null;
	const [payload, mac] = token.split('.');
	if (!payload || !mac) return null;
	const a = Buffer.from(mac), b = Buffer.from(sign(payload));
	if (a.length !== b.length || !timingSafeEqual(a, b)) return null;
	try {
		const { uid, exp } = JSON.parse(Buffer.from(payload, 'base64url').toString());
		return typeof uid === 'string' && typeof exp === 'number' && exp > now ? uid : null;
	} catch { return null; }
}

export async function setSession(uid: string) {
	(await cookies()).set(SESSION_COOKIE, encodeSession(uid), { httpOnly: true, sameSite: 'lax', secure: process.env.NODE_ENV === 'production', path: '/', maxAge: MAX_AGE });
}
export async function clearSession() {
	(await cookies()).delete(SESSION_COOKIE);
}
/** Browser: HttpOnly cookie. Native app: `Authorization: Bearer <session>` (same signed token, kept in the device keychain). */
export async function sessionUserId() {
	const auth = (await headers()).get('authorization');
	if (auth?.startsWith('Bearer ')) return decodeSession(auth.slice(7).trim());
	return decodeSession((await cookies()).get(SESSION_COOKIE)?.value);
}

/** Magic-link token: random 32 bytes; only its hash is stored. */
export function newLoginToken() {
	const token = randomBytes(32).toString('base64url');
	return { token, hash: hashToken(token) };
}
export const hashToken = (t: string) => createHash('sha256').update(t).digest('hex');
