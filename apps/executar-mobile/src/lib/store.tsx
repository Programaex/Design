// App state for the native Prisma — same behaviour as the web hook (apps/executar-web/src/lib/use-prisma-app.ts):
// every change is applied locally first, queued in the outbox and merged by POST /api/sync when online.
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as C from '@executar/core';
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { AppState as RNAppState } from 'react-native';
import { api, ApiError, getToken, type Member, type Settings } from './api';
import { rescheduleReminders } from './reminders';

const STORAGE_KEY = 'executar-prisma-v1';
export interface ExecState { gran: C.Granularity; idx: number; minutes: number; auto: boolean; ctx: boolean; timer: C.Timer }
export const EXEC0 = (): ExecState => ({ gran: 'action', idx: 0, minutes: 30, auto: false, ctx: false, timer: C.timerReady(30) });
const DEFAULT_SETTINGS: Settings = { reminders: true, remTime: '08:30', lateAlerts: true, ai: false };

export interface State {
	ready: boolean; started: boolean; step: number; err: string;
	setup: C.Setup; plan: C.Plan | null; base: C.Plan | null; open: Record<string, boolean>;
	user: { name: string; email: string } | null;
	offline: boolean; outbox: C.OutboxEntry[]; syncing: boolean; lastSync: number | null; conflict: C.Conflict | null;
	settings: Settings; exec: ExecState; exportTpl: C.TemplateId; members: Member[]; toast: string; netDown: boolean;
}
const initial = (): State => ({
	ready: false, started: false, step: 0, err: '', setup: C.defaultSetup(), plan: null, base: null, open: {}, user: null,
	offline: false, outbox: [], syncing: false, lastSync: null, conflict: null, settings: DEFAULT_SETTINGS, exec: EXEC0(),
	exportTpl: 'prisma', members: [], toast: '', netDown: false
});
const PERSIST: (keyof State)[] = ['started', 'step', 'setup', 'plan', 'base', 'open', 'user', 'offline', 'outbox', 'lastSync', 'conflict', 'settings', 'exec', 'exportTpl', 'members'];

function useStoreValue() {
	const [s, setS] = useState<State>(initial);
	const ref = useRef(s); ref.current = s;
	const [, tick] = useState(0);
	const timers = useRef<{ toast?: ReturnType<typeof setTimeout>; flush?: ReturnType<typeof setTimeout> }>({});
	const inFlight = useRef(false);
	const flushRef = useRef<() => Promise<void>>(async () => undefined);

	const up = useCallback((patch: Partial<State> | ((st: State) => Partial<State>)) => setS(st => ({ ...st, ...(typeof patch === 'function' ? patch(st) : patch) })), []);
	const say = useCallback((toast: string) => { up({ toast }); clearTimeout(timers.current.toast); timers.current.toast = setTimeout(() => up({ toast: '' }), 1800); }, [up]);

	/* boot: restore, reset routines on a new day, refresh the account */
	useEffect(() => {
		(async () => {
			const st: State = { ...initial(), ready: true };
			try {
				const saved = JSON.parse((await AsyncStorage.getItem(STORAGE_KEY)) || 'null') as Partial<State> | null;
				if (saved) {
					PERSIST.forEach(k => { if (saved[k] !== undefined) (st as unknown as Record<string, unknown>)[k] = saved[k]; });
					st.setup = { ...C.defaultSetup(), ...(saved.setup || {}) };
					st.settings = { ...DEFAULT_SETTINGS, ...(saved.settings || {}) };
					st.exec = { ...EXEC0(), ...(saved.exec || {}) };
					if (st.plan) st.plan = C.resetRoutinesIfNewDay(st.plan);
				}
			} catch { /* corrupted storage: start fresh */ }
			setS(st);
			if (await getToken()) void refreshAccount();
		})();
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	useEffect(() => {
		if (!s.ready) return;
		const out: Record<string, unknown> = {};
		PERSIST.forEach(k => { out[k] = s[k]; });
		AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(out)).catch(() => undefined);
	}, [s]);

	/* local notifications follow the plan and the settings */
	const planKey = s.plan ? s.plan.id + s.plan.lang + s.plan.rotinas.map(r => r.k).join() + C.lateCount(s.plan) : '';
	useEffect(() => {
		if (!s.ready) return;
		rescheduleReminders(ref.current.plan, s.settings).catch(() => undefined);
	}, [s.ready, planKey, s.settings]);

	const flush = useCallback(async () => {
		const st = ref.current;
		if (!st.user || !st.plan || st.offline || inFlight.current) return;
		inFlight.current = true;
		const sent = st.plan, sentCount = st.outbox.length;
		up({ syncing: true });
		try {
			const r = await api.sync({ base: st.base, local: sent, setup: st.setup });
			const changed = ref.current.plan !== sent;
			up(cur => ({
				plan: cur.plan && cur.plan !== sent ? C.mergePlans(sent, cur.plan, r.plan).merged : r.plan, base: r.plan, syncing: false, netDown: false,
				outbox: cur.outbox.slice(sentCount), lastSync: Date.now(), conflict: r.conflicts[0] ?? cur.conflict, members: r.members.length ? r.members : cur.members
			}));
			if (changed) setTimeout(() => { void flushRef.current(); }, 0);
		} catch (e) {
			if (e instanceof ApiError && e.status === 401) up({ syncing: false, user: null });
			else if (e instanceof ApiError && e.status === 403 && !st.base) {
				up(cur => ({ syncing: false, plan: cur.plan ? { ...cur.plan, id: C.planUid(), version: 1 } : cur.plan }));
				setTimeout(() => { void flushRef.current(); }, 0);
			} else up({ syncing: false, netDown: e instanceof ApiError && e.status === 0 });
		} finally { inFlight.current = false; }
	}, [up]);
	flushRef.current = flush;
	const scheduleFlush = useCallback((ms = 600) => { clearTimeout(timers.current.flush); timers.current.flush = setTimeout(() => { void flushRef.current(); }, ms); }, []);

	/* retry when the app returns to the foreground */
	useEffect(() => {
		const sub = RNAppState.addEventListener('change', a => { if (a === 'active' && ref.current.outbox.length) scheduleFlush(0); });
		return () => sub.remove();
	}, [scheduleFlush]);

	async function refreshAccount() {
		try {
			const { user } = await api.me();
			if (!user) { up({ user: null }); return; }
			const cur = ref.current;
			up({ user: { name: user.name, email: user.email }, settings: { ...cur.settings, ...(user.settings || {}) }, started: true });
			if (cur.plan) { scheduleFlush(0); return; }
			const { plans } = await api.plans();
			if (!plans.length) return;
			const r = await api.plan(plans[0].id);
			up({ plan: r.plan, base: r.plan, setup: { ...C.defaultSetup(), ...(r.setup || {}) }, members: r.members, lastSync: Date.now() });
		} catch { up({ netDown: true }); }
	}

	const track = useCallback((label: string) => {
		if (!ref.current.user) return;
		up(st => ({ outbox: [...st.outbox, { id: C.uid(), label, at: Date.now() }] }));
		scheduleFlush();
	}, [up, scheduleFlush]);
	const mutate = useCallback((fn: (p: C.Plan) => C.Plan, label: string) => { up(st => (st.plan ? { plan: fn(st.plan) } : {})); track(label); }, [up, track]);

	/* execution timer (timestamps survive background and restarts) */
	const execMove = useCallback((d: number, keepRunning = false) => {
		const st = ref.current; if (!st.plan) return;
		const q = C.executionQueue(st.plan, st.exec.gran), cur = Math.min(st.exec.idx, Math.max(0, q.length - 1));
		const n = Math.max(0, Math.min(q.length - 1, cur + d)); if (n === cur) return;
		const t = C.timerReady(st.exec.minutes);
		up({ exec: { ...st.exec, idx: n, ctx: false, timer: keepRunning ? C.timerStart(t) : t } });
	}, [up]);
	const setExec = useCallback((p: Partial<ExecState>) => up(st => ({ exec: { ...st.exec, ...p } })), [up]);
	useEffect(() => {
		const iv = setInterval(() => {
			const st = ref.current;
			if (st.exec.timer.state !== 'running') return;
			if (C.timerLeft(st.exec.timer) > 0) { tick(n => n + 1); return; }
			if (st.exec.auto && st.plan && st.exec.idx < C.executionQueue(st.plan, st.exec.gran).length - 1) { execMove(1, true); say('Auto-scroll · próximo item'); return; }
			up({ exec: { ...st.exec, timer: C.timerTimeUp(st.exec.timer) } });
		}, 250);
		return () => clearInterval(iv);
	}, [execMove, say, up]);

	const a = useMemo(() => ({
		up, say, mutate, track, setExec, execMove, refreshAccount,
		setSetup(fn: (x: C.Setup) => C.Setup) { up(st => ({ setup: fn({ ...st.setup }), err: '' })); },
		/** Returns true when the plan was generated (last step). */
		next(): boolean {
			const st = ref.current, step = C.STEPS[st.step], err = C.validate(step.id, st.setup);
			if (err) { up({ err }); return false; }
			if (st.step === C.STEPS.length - 1) {
				up({ plan: C.buildPlan(st.setup), base: null, open: {}, err: '', conflict: null, step: 0,
					members: st.members.length ? st.members : [{ name: st.user?.name || 'Você', email: st.user?.email || '', role: 'owner' }] });
				track('Plano criado'); say('Prisma gerado');
				return true;
			}
			let setup = st.setup; const nx = st.step + 1;
			if (C.STEPS[nx].id === 'dist') setup = { ...setup, ents: C.autoAssign(setup.ents, false) };
			up({ step: nx, setup, err: '' });
			return false;
		},
		toggleOpen(k: string, def: boolean) { up(st => ({ open: { ...st.open, [k]: !(k in st.open ? st.open[k] : def) } })); },
		setAll(v: boolean) {
			up(st => {
				if (!st.plan) return {};
				const o: Record<string, boolean> = {};
				st.plan.ents.forEach(e => { o['d:' + e.id] = v; o['e:' + e.id] = v; }); C.GKEYS.forEach(g => { o['g:' + g] = v; });
				return { open: { ...st.open, ...o } };
			});
		},
		syncNow() {
			const st = ref.current;
			if (!st.user) return say('Crie uma conta para sincronizar.');
			if (st.offline) return say('Modo offline. As mudanças ficam na fila.');
			const n = st.outbox.length;
			void flushRef.current().then(() => say(ref.current.netDown ? 'Sem conexão. As mudanças ficam na fila.' : n ? `${n} mudança${n > 1 ? 's' : ''} enviada${n > 1 ? 's' : ''}` : 'Tudo sincronizado'));
		},
		resolve(choice: 'local' | 'remote') {
			const st = ref.current; if (!st.plan || !st.conflict) return;
			const c = st.conflict;
			up({ plan: C.resolveConflict(st.plan, c, choice), conflict: null }); track('Conflito resolvido'); say('Conflito resolvido');
		},
		setOffline(off: boolean) { up({ offline: off }); if (!off) scheduleFlush(0); },
		saveSettings(p: Partial<Settings>) {
			const settings = { ...ref.current.settings, ...p }; up({ settings });
			if (ref.current.user) api.saveSettings(settings).catch(() => undefined);
		},
		async share(email: string) {
			const st = ref.current;
			if (!/\S+@\S+\.\S+/.test(email)) { say('Digite um e-mail válido'); return false; }
			if (!st.user || !st.plan) { say('Crie uma conta para compartilhar.'); return false; }
			try {
				if (!st.base) await flushRef.current();
				const r = await api.addMember(st.plan.id, email.trim()); up({ members: r.members }); say('Convite enviado'); return true;
			} catch (e) { say(e instanceof ApiError ? e.message : 'Sem conexão.'); return false; }
		},
		importPlan(r: { plan: C.Plan; setup: C.Setup }) { up({ plan: r.plan, base: null, setup: r.setup, open: {} }); track('Plano importado'); say('Plano importado'); },
		async logout() { await api.logout(); up({ user: null, base: null, outbox: [], conflict: null }); },
		async wipe() { await AsyncStorage.removeItem(STORAGE_KEY).catch(() => undefined); await api.logout(); setS({ ...initial(), ready: true }); }
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}), [up, say, mutate, track, setExec, execMove, scheduleFlush]);

	return { s, a };
}

export type Store = ReturnType<typeof useStoreValue>;
const Ctx = createContext<Store | null>(null);
export function StoreProvider({ children }: { children: ReactNode }) {
	const v = useStoreValue();
	return <Ctx.Provider value={v}>{children}</Ctx.Provider>;
}
export function useStore() {
	const v = useContext(Ctx);
	if (!v) throw new Error('useStore fora do StoreProvider');
	return v;
}
export const isOpen = (open: Record<string, boolean>, k: string, def: boolean) => (k in open ? open[k] : def);

export function syncInfo(s: State) {
	const offline = s.offline || s.netDown, n = s.outbox.length;
	const kind = !s.user ? 'local' : s.conflict ? 'conflict' : offline ? 'offline' : s.syncing ? 'syncing' : n ? 'pending' : 'ok';
	const M = {
		local: ['Neste aparelho', 'neutral', 'device-mobile', 'Só neste aparelho', 'Crie uma conta para guardar o plano na nuvem.'],
		conflict: ['Conflito', 'danger', 'warning-circle', 'Precisa da sua escolha', 'Uma tarefa mudou em dois aparelhos.'],
		offline: [`Offline · ${n}`, 'warning', 'cloud-slash', 'Sem conexão', `${n} mudança(s) aguardando envio.`],
		pending: [`Pendente · ${n}`, 'warning', 'cloud-slash', 'Aguardando envio', `${n} mudança(s) aguardando envio.`],
		syncing: ['Sincronizando…', 'accent', 'arrows-clockwise', 'Sincronizando…', 'Enviando suas mudanças.'],
		ok: ['Sincronizado', 'success', 'cloud-check', 'Tudo sincronizado', s.lastSync ? 'Última vez ' + ago(s.lastSync) + '.' : 'Pronto para sincronizar.']
	} as const;
	const [label, dot, icon, title, desc] = M[kind];
	return { kind, label, dot, icon, title, desc };
}
export function ago(t: number) {
	const m = Math.round((Date.now() - t) / 60000);
	return m < 1 ? 'agora' : m < 60 ? `há ${m} min` : `há ${Math.round(m / 60)} h`;
}
