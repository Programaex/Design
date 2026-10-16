'use client';
// Client state of the Prisma app — the logic of the Claude Design prototype ("Prisma Mobile"), with the simulated
// sync replaced by the real offline-first flow: every change lands in the outbox and is merged by POST /api/sync.
import * as C from '@executar/core';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { api, ApiError, type ApiUser, type Member, type Settings } from './api';

export const STORAGE_KEY = 'executar-prisma-v1';
export type Screen = 'login' | 'wizard' | 'app';
export type Tab = 'prisma' | 'executar' | 'mapa' | 'rotinas' | 'conta';
export type Sub = 'sync' | 'export' | 'settings' | null;
export type StartView = 'login' | 'wizard' | Tab | Exclude<Sub, null>;
export const SUBS = ['sync', 'export', 'settings'] as const;

export interface ExecState { gran: C.Granularity; idx: number; minutes: number; auto: boolean; ctx: boolean; timer: C.Timer }
export const EXEC0 = (): ExecState => ({ gran: 'action', idx: 0, minutes: 30, auto: false, ctx: false, timer: C.timerReady(30) });

export type Sheet =
	| { kind: 'add'; entId: string; title: string; desc: string; inputLabel: string; placeholder: string; cta: string }
	| { kind: 'rename'; taskId: string; title: string; inputLabel: string; placeholder: string; cta: string }
	| { kind: 'share'; title: string; desc: string; inputLabel: string; placeholder: string; cta: string }
	| { kind: 'redo'; title: string; desc: string; cta: string };

export interface AppState {
	ready: boolean;
	screen: Screen; tab: Tab; sub: Sub; step: number; err: string;
	setup: C.Setup; plan: C.Plan | null;
	/** Last plan acknowledged by the server — the common ancestor for the three-way merge. */
	base: C.Plan | null;
	open: Record<string, boolean>;
	user: { name: string; email: string } | null;
	email: string;
	offline: boolean; outbox: C.OutboxEntry[]; syncing: boolean; lastSync: number | null; conflict: C.Conflict | null;
	settings: Settings; exec: ExecState; execMenu: boolean; exportTpl: C.TemplateId;
	sheet: Sheet | null; draft: string; drafts: Record<string, string>; members: Member[]; toast: string;
}

const DEFAULT_SETTINGS: Settings = { reminders: true, remTime: '08:30', lateAlerts: true, ai: false };
const initial = (): AppState => ({
	ready: false, screen: 'login', tab: 'prisma', sub: null, step: 0, err: '', setup: C.defaultSetup(), plan: null, base: null, open: {},
	user: null, email: '', offline: false, outbox: [], syncing: false, lastSync: null, conflict: null, settings: DEFAULT_SETTINGS,
	exec: EXEC0(), execMenu: false, exportTpl: 'prisma', sheet: null, draft: '', drafts: {}, members: [], toast: ''
});
const PERSIST: (keyof AppState)[] = ['screen', 'tab', 'sub', 'step', 'setup', 'plan', 'base', 'open', 'user', 'offline', 'outbox', 'lastSync', 'settings', 'members', 'conflict', 'exec', 'exportTpl'];

export function readSaved(): Partial<AppState> | null {
	try { return JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null'); } catch { return null; }
}
const demoUser = { name: 'Você', email: 'voce@exemplo.com' };
const demoMembers: Member[] = [{ name: 'Você', email: demoUser.email, role: 'owner' }];
function demo(): Pick<AppState, 'setup' | 'plan' | 'open'> {
	const r = C.demoPlan();
	return { ...r, open: { ['e:' + r.plan.ents[0].id]: true } };
}

export interface PrismaAppOptions {
	/** Demo instance (landing, gallery): sample data, no storage, no server. */
	isolated?: boolean;
	/** Talks to the EXECUTAR API (session, sync, sharing). Off in the local mini apps: the plan lives only on this device. */
	remote?: boolean;
	startView?: StartView; startStep?: number; execContext?: boolean;
	/** Opens the A4 export for a template (each host routes it its own way). */
	onOpenExport?: (template: C.TemplateId) => void;
}

export function usePrismaApp({ isolated = false, remote = false, startView, startStep, execContext, onOpenExport }: PrismaAppOptions = {}) {
	const online = remote && !isolated;
	const [s, setS] = useState<AppState>(initial);
	const ref = useRef(s);
	ref.current = s;
	const [, setNow] = useState(0);
	const timers = useRef<{ toast?: ReturnType<typeof setTimeout>; flush?: ReturnType<typeof setTimeout> }>({});
	const inFlight = useRef(false);
	const flushRef = useRef<() => Promise<void>>(async () => undefined);

	const up = useCallback((patch: Partial<AppState> | ((st: AppState) => Partial<AppState>)) => {
		setS(st => ({ ...st, ...(typeof patch === 'function' ? patch(st) : patch) }));
	}, []);
	const say = useCallback((msg: string) => {
		up({ toast: msg });
		clearTimeout(timers.current.toast);
		timers.current.toast = setTimeout(() => up({ toast: '' }), 1800);
	}, [up]);

	/* ---------- boot ---------- */
	useEffect(() => {
		const st: AppState = { ...initial(), ready: true };
		const saved = isolated ? null : readSaved();
		if (saved) {
			PERSIST.forEach(k => { if (saved[k] !== undefined) (st as unknown as Record<string, unknown>)[k] = saved[k]; });
			st.setup = { ...C.defaultSetup(), ...(saved.setup || {}) };
			st.settings = { ...DEFAULT_SETTINGS, ...(saved.settings || {}) };
			st.exec = { ...EXEC0(), ...(saved.exec || {}) };
			if (st.plan) st.plan = C.resetRoutinesIfNewDay(st.plan);
		}
		if (startView) {
			if (startView !== 'login' && !st.plan) Object.assign(st, demo());
			if (startView !== 'login' && !st.user) { st.user = demoUser; st.members = demoMembers; }
			if (startView === 'login') st.screen = 'login';
			else if (startView === 'wizard') { st.screen = 'wizard'; st.step = startStep ?? 0; st.setup = { ...st.setup, ...C.demoPlan().setup }; }
			else {
				st.screen = 'app';
				if ((SUBS as readonly string[]).includes(startView)) { st.tab = 'conta'; st.sub = startView as Sub; } else { st.tab = startView as Tab; st.sub = null; }
			}
			if (startView === 'executar' && execContext) st.exec = { ...st.exec, ctx: true };
		}
		setS(st);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	/* ---------- persistence ---------- */
	useEffect(() => {
		if (!s.ready || isolated) return;
		const out: Record<string, unknown> = {};
		PERSIST.forEach(k => { out[k] = s[k]; });
		try { localStorage.setItem(STORAGE_KEY, JSON.stringify(out)); } catch { /* quota or private mode: keep working in memory */ }
	}, [s, isolated]);

	/* ---------- server session ---------- */
	const flush = useCallback(async () => {
		const st = ref.current;
		if (!online || !st.user || !st.plan || st.offline || inFlight.current) return;
		if (typeof navigator !== 'undefined' && !navigator.onLine) return;
		inFlight.current = true;
		const sent = st.plan, sentCount = st.outbox.length;
		up({ syncing: true });
		try {
			const r = await api.sync({ base: st.base, local: sent, setup: st.setup });
			const changedMeanwhile = ref.current.plan !== sent;
			up(cur => {
				// edits made while the request was in flight are merged on top of the server result
				const plan = cur.plan && cur.plan !== sent ? C.mergePlans(sent, cur.plan, r.plan).merged : r.plan;
				return { plan, base: r.plan, syncing: false, outbox: cur.outbox.slice(sentCount), lastSync: Date.now(),
					conflict: r.conflicts[0] ?? cur.conflict, members: r.members.length ? r.members : cur.members };
			});
			if (changedMeanwhile) setTimeout(() => { void flushRef.current(); }, 0);
		} catch (e) {
			if (e instanceof ApiError && e.status === 401) up({ syncing: false, user: null });
			else if (e instanceof ApiError && e.status === 403 && !st.base) {
				// an imported file carries someone else's plan id: keep the content as a new plan of this account
				up(cur => ({ syncing: false, plan: cur.plan ? { ...cur.plan, id: C.planUid(), version: 1 } : cur.plan }));
				setTimeout(() => { void flushRef.current(); }, 0);
			} else up({ syncing: false });
		} finally {
			inFlight.current = false;
		}
	}, [online, up]);

	flushRef.current = flush;

	const scheduleFlush = useCallback((ms = 600) => {
		clearTimeout(timers.current.flush);
		timers.current.flush = setTimeout(() => { void flush(); }, ms);
	}, [flush]);

	useEffect(() => {
		if (!s.ready || !online) return;
		let cancelled = false;
		api.me().then(async ({ user }) => {
			if (cancelled) return;
			if (!user) {
				// signed out on the server: keep the local-only session, drop a stale account
				if (ref.current.user && ref.current.user.email !== demoUser.email) up({ user: null });
				return;
			}
			const u = { name: user.name, email: user.email };
			const cur = ref.current;
			up({ user: u, settings: { ...cur.settings, ...user.settings } });
			if (cur.plan) { scheduleFlush(0); return; }
			const { plans } = await api.plans();
			if (!plans.length || cancelled) { if (ref.current.screen === 'login') up({ screen: 'wizard', step: 0 }); return; }
			const r = await api.plan(plans[0].id);
			if (cancelled) return;
			up({ plan: r.plan, base: r.plan, setup: { ...C.defaultSetup(), ...(r.setup || {}) }, members: r.members, screen: 'app', tab: 'prisma', sub: null, lastSync: Date.now() });
		}).catch(() => { /* offline: keep working locally */ });
		const onOnline = () => scheduleFlush(0);
		window.addEventListener('online', onOnline);
		return () => { cancelled = true; window.removeEventListener('online', onOnline); };
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [s.ready, online]);

	const track = useCallback((label: string) => {
		if (!online || !ref.current.user) return;
		up(st => ({ outbox: [...st.outbox, { id: C.uid(), label, at: Date.now() }] }));
		scheduleFlush();
	}, [online, up, scheduleFlush]);

	const mutate = useCallback((fn: (p: C.Plan) => C.Plan, label: string) => {
		up(st => (st.plan ? { plan: fn(st.plan) } : {}));
		track(label);
	}, [up, track]);

	/* ---------- execution timer ---------- */
	const execMove = useCallback((d: number, keepRunning = false) => {
		const st = ref.current; if (!st.plan) return;
		const q = C.executionQueue(st.plan, st.exec.gran), cur = Math.min(st.exec.idx, Math.max(0, q.length - 1));
		const n = Math.max(0, Math.min(q.length - 1, cur + d)); if (n === cur) return;
		const t = C.timerReady(st.exec.minutes);
		up({ exec: { ...st.exec, idx: n, ctx: false, timer: keepRunning ? C.timerStart(t) : t } });
	}, [up]);
	const setExec = useCallback((patch: Partial<ExecState>) => up(st => ({ exec: { ...st.exec, ...patch } })), [up]);

	useEffect(() => {
		const iv = setInterval(() => {
			const st = ref.current;
			if (st.exec.timer.state !== 'running') return;
			if (C.timerLeft(st.exec.timer) > 0) { setNow(Date.now()); return; }
			if (st.exec.auto && st.plan) {
				const q = C.executionQueue(st.plan, st.exec.gran);
				if (st.exec.idx < q.length - 1) { execMove(1, true); say('Auto-scroll · próximo item'); return; }
			}
			up({ exec: { ...st.exec, timer: C.timerTimeUp(st.exec.timer) } });
			if (typeof navigator !== 'undefined' && 'vibrate' in navigator) navigator.vibrate?.(200);
		}, 250);
		return () => clearInterval(iv);
	}, [execMove, say, up]);

	useEffect(() => {
		if (isolated) return;
		const key = (e: KeyboardEvent) => {
			const st = ref.current;
			if (st.screen !== 'app' || st.tab !== 'executar' || st.sub) return;
			if (/INPUT|TEXTAREA|SELECT/.test((document.activeElement as HTMLElement | null)?.tagName || '')) return;
			if (e.key === 'ArrowDown') { e.preventDefault(); execMove(1); }
			if (e.key === 'ArrowUp') { e.preventDefault(); execMove(-1); }
		};
		window.addEventListener('keydown', key);
		return () => window.removeEventListener('keydown', key);
	}, [isolated, execMove]);

	/* ---------- actions ---------- */
	const actions = useMemo(() => ({
		up, say, mutate, track, setExec, execMove,
		syncNow() {
			const st = ref.current;
			if (!st.user) return say('Crie uma conta para sincronizar.');
			if (st.offline || !navigator.onLine) return say('Sem conexão. As mudanças ficam na fila.');
			const n = st.outbox.length;
			void flush().then(() => say(n ? `${n} mudança${n > 1 ? 's' : ''} enviada${n > 1 ? 's' : ''}` : 'Tudo sincronizado'));
		},
		setSetup(fn: (x: C.Setup) => C.Setup) { up(st => ({ setup: fn({ ...st.setup }), err: '' })); },
		next() {
			const st = ref.current, step = C.STEPS[st.step], err = C.validate(step.id, st.setup);
			if (err) return up({ err });
			if (st.step === C.STEPS.length - 1) {
				const plan = C.buildPlan(st.setup);
				const members = st.members.length ? st.members : [{ name: st.user?.name || 'Você', email: st.user?.email || '', role: 'owner' as const }];
				up({ plan, base: null, screen: 'app', tab: 'prisma', sub: null, open: {}, err: '', members, conflict: null });
				track('Plano criado'); say('Prisma gerado');
				return;
			}
			let setup = st.setup; const nx = st.step + 1;
			if (C.STEPS[nx].id === 'dist') setup = { ...setup, ents: C.autoAssign(setup.ents, false) };
			up({ step: nx, setup, err: '' });
		},
		async requestLogin(email: string) {
			const em = email.trim();
			if (!/\S+@\S+\.\S+/.test(em)) return say('Digite um e-mail válido');
			if (!online) return say('Abra o app para entrar');
			try {
				const r = await api.requestLogin(em);
				if (r.devLink) { window.location.href = r.devLink; return; }
				say('Enviamos um link de acesso para ' + em);
			} catch (e) {
				say(e instanceof ApiError ? e.message : 'Sem conexão. Tente de novo.');
			}
		},
		oauth(provider: 'Apple' | 'Google') { say(`Entrar com ${provider} ainda não está configurado neste servidor.`); },
		guest() { up(st => ({ user: null, screen: st.plan ? 'app' : 'wizard', step: 0 })); },
		async logout() {
			if (online) await api.logout().catch(() => undefined);
			up({ user: null, screen: 'login', base: null, outbox: [], conflict: null });
		},
		toggleOpen(k: string, def: boolean) { up(st => ({ open: { ...st.open, [k]: !(k in st.open ? st.open[k] : def) } })); },
		setAll(v: boolean) {
			up(st => {
				if (!st.plan) return {};
				const o: Record<string, boolean> = {};
				st.plan.ents.forEach(e => { o['d:' + e.id] = v; o['e:' + e.id] = v; });
				C.GKEYS.forEach(g => { o['g:' + g] = v; });
				return { open: { ...st.open, ...o } };
			});
		},
		openSheet(sheet: Sheet, draft = '') { up({ sheet, draft }); },
		async confirmSheet() {
			const st = ref.current, sh = st.sheet, v = st.draft.trim(); if (!sh) return;
			if (sh.kind === 'add') { if (!v) return; mutate(p => C.addTask(p, sh.entId, v), 'Tarefa adicionada'); say('Tarefa adicionada'); }
			if (sh.kind === 'rename') { if (v) mutate(p => C.renameTask(p, sh.taskId, v), 'Tarefa editada'); else mutate(p => C.removeTask(p, sh.taskId), 'Tarefa removida'); }
			if (sh.kind === 'share') {
				if (!/\S+@\S+\.\S+/.test(v)) return say('Digite um e-mail válido');
				if (!online || !st.user || !st.plan) return say('Crie uma conta para compartilhar.');
				try {
					if (!st.base) await flush();
					const r = await api.addMember(st.plan.id, v);
					up({ members: r.members, draft: '' }); say('Convite enviado');
				} catch (e) { say(e instanceof ApiError ? e.message : 'Sem conexão. Tente de novo.'); }
				return;
			}
			if (sh.kind === 'redo') { up({ plan: null, base: null, screen: 'wizard', step: 0, sheet: null }); return; }
			up({ sheet: null, draft: '' });
		},
		resolve(choice: 'local' | 'remote') {
			const st = ref.current; if (!st.plan || !st.conflict) return;
			const c = st.conflict;
			up({ plan: C.resolveConflict(st.plan, c, choice), conflict: null });
			track('Conflito resolvido'); say('Conflito resolvido');
		},
		setOffline(off: boolean) { up({ offline: off }); if (!off) scheduleFlush(0); },
		saveSettings(patch: Partial<Settings>) {
			const settings = { ...ref.current.settings, ...patch };
			up({ settings });
			if (online && ref.current.user) api.saveSettings(settings).catch(() => undefined);
		},
		importPlan(r: { plan: C.Plan; setup: C.Setup }) {
			up({ plan: r.plan, base: null, setup: r.setup, tab: 'prisma', sub: null, open: {}, screen: 'app' });
			track('Plano importado'); say('Plano importado');
		},
		loadDemo() {
			up(st => ({ ...demo(), base: null, user: st.user || demoUser, members: st.members.length ? st.members : demoMembers, screen: 'app', tab: 'prisma', sub: null }));
			say('Exemplo carregado');
		},
		wipe() {
			try { localStorage.removeItem(STORAGE_KEY); } catch { /* ignore */ }
			up({ ...initial(), ready: true });
		},
		go(key: StartView) {
			up(st => {
				const patch: Partial<AppState> = { sheet: null, err: '' };
				if (key === 'login') patch.screen = 'login';
				else if (key === 'wizard') { patch.screen = 'wizard'; patch.step = 0; }
				else {
					if (!st.plan) Object.assign(patch, demo());
					patch.screen = 'app';
					if ((SUBS as readonly string[]).includes(key)) { patch.tab = 'conta'; patch.sub = key as Sub; } else { patch.tab = key as Tab; patch.sub = null; }
				}
				return patch;
			});
		}
	}), [up, say, mutate, track, setExec, execMove, flush, isolated, online, scheduleFlush]);

	return { s, a: actions, isolated, online, openExport: (tpl: C.TemplateId) => (isolated || !onOpenExport ? actions.say('Abra o app para exportar') : onOpenExport(tpl)) };
}

export type PrismaApp = ReturnType<typeof usePrismaApp>;
export type { ApiUser };
