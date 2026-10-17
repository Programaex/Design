// Local plan store for the mini apps: the @executar/ui hook without server sync, plus cross-tab sync.
// Every mini app reads and writes the same localStorage document (STORAGE_KEY), so a plan created in the
// Prisma shows up in Executar, Mapa, Rotinas and Folhas A4 — also when they are open side by side.
import { readSaved, STORAGE_KEY, usePrismaApp, type AppState, type StartView } from '@executar/ui';
import { useEffect, useRef } from 'react';
import { appUrl } from './catalog';

/** Fields that belong to the plan (shared). View fields (screen, tab, sub, step…) stay per mini app. */
export const SHARED = ['plan', 'setup', 'exec', 'settings', 'exportTpl', 'open'] as const;

/** Returns the shared fields of `incoming` that differ from `current` (empty = nothing to do, which ends write ping-pong). */
export function sharedPatch(current: Partial<AppState>, incoming: Partial<AppState> | null): Partial<AppState> {
	const patch: Partial<AppState> = {};
	if (!incoming) return patch;
	for (const k of SHARED) {
		if (incoming[k] !== undefined && JSON.stringify(incoming[k]) !== JSON.stringify(current[k])) (patch as Record<string, unknown>)[k] = incoming[k];
	}
	return patch;
}

export function useMiniApp(view?: StartView) {
	const app = usePrismaApp({ remote: false, onOpenExport: tpl => { window.location.href = appUrl('folhas-a4') + '?template=' + tpl; } });
	const { s, a } = app;
	const current = useRef(s);
	current.current = s;

	// each mini app shows its own screen, whatever the last one saved
	useEffect(() => {
		if (!s.ready) return;
		if (view === 'wizard' || (view === 'prisma' && !s.plan)) a.up({ screen: 'wizard', sub: null });
		else if (view) a.up({ screen: 'app', tab: view === 'export' ? 'conta' : (view as AppState['tab']), sub: view === 'export' ? 'export' : null });
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, [s.ready, !!s.plan]);

	useEffect(() => {
		const onStorage = (e: StorageEvent) => {
			if (e.key !== STORAGE_KEY) return;
			// no change to the shared fields → no state update → no write back (another tab only changed its view)
			const patch = sharedPatch(current.current, readSaved());
			if (Object.keys(patch).length) a.up(patch);
		};
		window.addEventListener('storage', onStorage);
		return () => window.removeEventListener('storage', onStorage);
	}, [a]);

	return app;
}
