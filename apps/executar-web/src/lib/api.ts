// Typed client for the EXECUTAR API routes (used by the web app; the Expo app has its own copy pointing at EXPO_PUBLIC_API_URL).
import type { Conflict, Plan, Setup } from '@executar/core';

export interface ApiUser { id: string; email: string; name: string; settings: Settings }
export interface Settings { reminders: boolean; remTime: string; lateAlerts: boolean; ai: boolean }
export interface Member { name: string; email: string; role: 'owner' | 'editor' | 'viewer' | 'invited' }
export interface SyncResponse { plan: Plan; setup: Setup | null; conflicts: Conflict[]; members: Member[] }

export class ApiError extends Error {
	constructor(public status: number, message: string) { super(message); }
}

async function call<T>(path: string, init?: RequestInit & { json?: unknown }): Promise<T> {
	const res = await fetch(path, {
		...init,
		credentials: 'same-origin',
		headers: { ...(init?.json !== undefined ? { 'content-type': 'application/json' } : {}), ...init?.headers },
		body: init?.json !== undefined ? JSON.stringify(init.json) : init?.body
	});
	const data = await res.json().catch(() => ({}));
	if (!res.ok) throw new ApiError(res.status, (data && data.error) || 'Falha na requisição');
	return data as T;
}

export const api = {
	me: () => call<{ user: ApiUser | null }>('/api/me'),
	requestLogin: (email: string, next = '/app') => call<{ sent: boolean; devLink?: string }>('/api/auth/email', { method: 'POST', json: { email, next } }),
	logout: () => call<{ ok: true }>('/api/auth/logout', { method: 'POST' }),
	plans: () => call<{ plans: { id: string; nome: string; updatedAt: string }[] }>('/api/plans'),
	plan: (id: string) => call<SyncResponse>('/api/plans/' + encodeURIComponent(id)),
	sync: (body: { base: Plan | null; local: Plan; setup: Setup }) => call<SyncResponse>('/api/sync', { method: 'POST', json: body }),
	addMember: (planId: string, email: string) => call<{ members: Member[] }>('/api/plans/' + encodeURIComponent(planId) + '/members', { method: 'POST', json: { email } }),
	saveSettings: (settings: Settings) => call<{ settings: Settings }>('/api/me/settings', { method: 'PATCH', json: settings })
};
