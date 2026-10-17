import { describe, expect, it, vi } from 'vitest';

vi.mock('server-only', () => ({}));
vi.mock('next/headers', () => ({ cookies: async () => ({ get: () => undefined, set: () => undefined, delete: () => undefined }) }));
const { decodeSession, encodeSession, hashToken, newLoginToken } = await import('../src/lib/server/session');

describe('session cookie', () => {
	it('round-trips and rejects tampering or expiry', () => {
		const t = encodeSession('user-1', 1000);
		expect(decodeSession(t, 2000)).toBe('user-1');
		expect(decodeSession(t.slice(0, -2) + 'xx', 2000)).toBeNull();
		const [payload, mac] = t.split('.');
		const forged = Buffer.from(JSON.stringify({ uid: 'admin', exp: 9e15 })).toString('base64url') + '.' + mac;
		expect(decodeSession(forged, 2000)).toBeNull();
		expect(decodeSession(payload + '.' + mac, 1000 + 61 * 864e5)).toBeNull();
		expect(decodeSession(undefined)).toBeNull();
	});
	it('stores only the hash of login tokens', () => {
		const { token, hash } = newLoginToken();
		expect(hash).toBe(hashToken(token));
		expect(hash).not.toContain(token);
	});
});
