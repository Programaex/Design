// Client for the EXECUTAR API (apps/executar-web). The session is the same signed token the web cookie carries,
// sent as a bearer header and stored in the device keychain.
import type { Conflict, Plan, Setup } from '@executar/core';
import Constants from 'expo-constants';
import * as SecureStore from 'expo-secure-store';

export interface Settings { reminders: boolean; remTime: string; lateAlerts: boolean; ai: boolean }
export interface ApiUser { id: string; email: string; name: string; settings?: Settings }
export interface Member { name: string; email: string; role: 'owner' | 'editor' | 'viewer' | 'invited' }
export interface SyncResponse { plan: Plan; setup: Setup | null; conflicts: Conflict[]; members: Member[] }

export const API_URL = (process.env.EXPO_PUBLIC_API_URL || (Constants.expoConfig?.extra as { apiUrl?: string } | undefined)?.apiUrl || 'http://localhost:3000').replace(/\/$/, '');
const KEY = 'executar.session';

export class ApiError extends Error {
	constructor(public status: number, message: string) { super(message); }
}

let token: string | null | undefined;
export async function getToken() {
	if (token === undefined) token = await SecureStore.getItemAsync(KEY).catch(() => null);
	return token;
}
export async function setToken(t: string | null) {
	token = t;
	if (t) await SecureStore.setItemAsync(KEY, t); else await SecureStore.deleteItemAsync(KEY).catch(() => undefined);
}

async function call<T>(path: string, init: { method?: string; json?: unknown; text?: string } = {}): Promise<T> {
	const tk = await getToken();
	let res: Response;
	try {
		res = await fetch(API_URL + path, {
			method: init.method ?? 'GET',
			headers: { ...(init.json !== undefined ? { 'content-type': 'application/json' } : {}), ...(tk ? { authorization: 'Bearer ' + tk } : {}) },
			body: init.json !== undefined ? JSON.stringify(init.json) : init.text
		});
	} catch {
		throw new ApiError(0, 'Sem conexão com o servidor.');
	}
	const data = await res.json().catch(() => ({}));
	if (!res.ok) throw new ApiError(res.status, (data && data.error) || 'Falha na requisição');
	return data as T;
}

export const api = {
	me: () => call<{ user: ApiUser | null }>('/api/me'),
	requestLogin: (email: string) => call<{ sent: boolean; devLink?: string }>('/api/auth/email', { method: 'POST', json: { email, client: 'native' } }),
	/** Exchanges the magic-link token (executar://entrar?token=…) for a bearer session. */
	verify: async (loginToken: string) => {
		const r = await call<{ session: string; user: ApiUser }>('/api/auth/verify?format=json&token=' + encodeURIComponent(loginToken));
		await setToken(r.session);
		return r.user;
	},
	logout: () => setToken(null),
	plans: () => call<{ plans: { id: string; nome: string; updatedAt: string }[] }>('/api/plans'),
	plan: (id: string) => call<SyncResponse>('/api/plans/' + encodeURIComponent(id)),
	sync: (body: { base: Plan | null; local: Plan; setup: Setup }) => call<SyncResponse>('/api/sync', { method: 'POST', json: body }),
	addMember: (planId: string, email: string) => call<{ members: Member[] }>('/api/plans/' + encodeURIComponent(planId) + '/members', { method: 'POST', json: { email } }),
	saveSettings: (settings: Settings) => call<{ settings: Settings }>('/api/me/settings', { method: 'PATCH', json: settings })
};
