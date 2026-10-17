import 'server-only';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { db } from './db';
import { HttpError } from './plans';
import { sessionUserId } from './session';

export const json = (data: unknown, init?: ResponseInit) => NextResponse.json(data, init);
export const fail = (status: number, error: string) => NextResponse.json({ error }, { status });

/** Wraps a route handler: maps validation, auth and database errors to JSON responses. */
export function route<A extends unknown[]>(fn: (...args: A) => Promise<Response>) {
	return async (...args: A) => {
		try {
			return await fn(...args);
		} catch (e) {
			if (e instanceof HttpError) return fail(e.status, e.message);
			if (e instanceof z.ZodError) return fail(400, 'Dados inválidos: ' + e.issues.slice(0, 3).map(i => i.path.join('.') + ' ' + i.message).join('; '));
			if (e instanceof SyntaxError) return fail(400, 'JSON inválido');
			console.error(e);
			return fail(500, 'Erro interno');
		}
	};
}

export async function requireUser() {
	const uid = await sessionUserId();
	if (!uid) throw new HttpError(401, 'Entre para continuar.');
	const user = await db().user.findUnique({ where: { id: uid } });
	if (!user) throw new HttpError(401, 'Sessão expirada. Entre de novo.');
	return user;
}

/** Bodies above `max` bytes are rejected before parsing. */
export async function readJson(req: Request, max = 1_000_000): Promise<unknown> {
	const len = Number(req.headers.get('content-length') || 0);
	if (len > max) throw new HttpError(413, 'Arquivo grande demais.');
	const text = await req.text();
	if (text.length > max) throw new HttpError(413, 'Arquivo grande demais.');
	return JSON.parse(text);
}
export const displayName = (u: { name: string | null; email: string }) => u.name || u.email.split('@')[0];
export const DEFAULT_SETTINGS = { reminders: true, remTime: '08:30', lateAlerts: true, ai: false };
