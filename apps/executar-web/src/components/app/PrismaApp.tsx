'use client';
import * as C from '@executar/core';
import Link from 'next/link';
import { useEffect, useRef, useState, useSyncExternalStore } from 'react';
import { AjustesScreen, Button, ContaTab, DadosScreen, ExecutarTab, Icon, Login, MapaTab, PrismaTab, RotinasTab, SyncScreen, Tag, TextField, Wizard, syncInfo, usePrismaApp, type PrismaApp as App, type StartView, type Tab } from '@executar/ui';
import { useRouter } from 'next/navigation';

const TABS: [Tab, string, string][] = [['prisma', 'Prisma', 'list-checks'], ['executar', 'Executar', 'play-circle'], ['mapa', 'Mapa', 'tree-structure'], ['rotinas', 'Rotinas', 'sun-horizon'], ['conta', 'Conta', 'user-circle']];

/** Screen → real code map (the "upstream" panel of the prototype, now pointing at this repository). */
const ARCH: Record<string, { t: string; route: string; ui: string[]; core: string[]; api: string[] }> = {
	login: { t: 'Login / conta', route: 'components/app/Login.tsx', ui: ['Login', 'TextField', 'Button'], core: [], api: ['POST /api/auth/email', 'GET /api/auth/verify'] },
	wizard: { t: 'Questionário', route: 'components/app/Wizard.tsx', ui: ['Wizard', 'SegmentedControl'], core: ['STEPS', 'validate()', 'autoAssign()', 'buildPlan()'], api: ['POST /api/sync'] },
	prisma: { t: 'Prisma', route: 'components/app/PrismaTab.tsx', ui: ['PrismaTab', 'TaskRow'], core: ['hzDate()', 'statusOf()', 'prog()', 'toggleTask()', 'addTask()', 'removeTask()'], api: ['POST /api/sync', 'GET /api/plans/[id]'] },
	executar: { t: 'Executar · Scroll Task', route: 'components/app/ExecutarTab.tsx', ui: ['ExecutarTab', 'Switch'], core: ['executionQueue()', 'setItemDone()', 'deferItem()', 'setNote()', 'timerStart()', 'timerLeft()'], api: ['POST /api/sync'] },
	mapa: { t: 'Mapa mental', route: 'components/app/PrismaTab.tsx#MapaTab', ui: ['MapaTab'], core: ['GROUPS', 'prog()', 'groupsUsed()'], api: ['GET /api/plans/[id]'] },
	rotinas: { t: 'Rotinas do dia', route: 'components/app/AccountTabs.tsx#RotinasTab', ui: ['RotinasTab'], core: ['ROT', 'toggleRoutine()', 'resetRoutinesIfNewDay()'], api: ['POST /api/sync'] },
	conta: { t: 'Conta', route: 'components/app/AccountTabs.tsx#ContaTab', ui: ['ContaTab', 'Sheet'], core: [], api: ['GET /api/me', 'POST /api/plans/[id]/members'] },
	sync: { t: 'Sincronização', route: 'components/app/AccountTabs.tsx#SyncScreen', ui: ['SyncScreen', 'Switch'], core: ['mergePlans()', 'resolveConflict()'], api: ['POST /api/sync'] },
	export: { t: 'Exportar / importar', route: 'app/app/exportar/page.tsx', ui: ['DadosScreen', 'ExportViewer'], core: ['viewModel()', 'documentHtml()', 'exportPayload()', 'parseImport()', 'planFromCsv()'], api: ['GET /api/plans/[id]/export?template=…', 'POST /api/plans/import', 'POST /api/plans/import-csv'] },
	settings: { t: 'Ajustes', route: 'components/app/AccountTabs.tsx#AjustesScreen', ui: ['AjustesScreen', 'Switch'], core: ['setLang()', 'taskText()'], api: ['PATCH /api/me/settings'] }
};

const wideQuery = '(min-width: 640px)';
function useWide() {
	return useSyncExternalStore(
		cb => { const m = window.matchMedia(wideQuery); m.addEventListener('change', cb); return () => m.removeEventListener('change', cb); },
		() => window.matchMedia(wideQuery).matches,
		() => true
	);
}

export interface PrismaAppProps {
	/** Demo instance (landing, gallery): sample data, no storage, no server. */
	isolated?: boolean;
	startView?: StartView;
	startStep?: number;
	execContext?: boolean;
	/** "auto": full screen on phones, device frame + panel on wider screens. */
	frame?: 'auto' | 'phone';
	chrome?: 'ios' | 'android';
	theme?: 'light' | 'dark';
}

export function PrismaApp({ isolated, startView, startStep, execContext, frame = 'auto', chrome = 'ios', theme: themeProp }: PrismaAppProps) {
	const router = useRouter();
	const app = usePrismaApp({ isolated, remote: true, startView, startStep, execContext, onOpenExport: tpl => router.push('/app/exportar?template=' + tpl) });
	const wide = useWide();
	const [theme, setTheme] = useState<'light' | 'dark'>(themeProp ?? 'light');
	useEffect(() => {
		if (themeProp || isolated) return;
		const m = window.matchMedia('(prefers-color-scheme: dark)');
		const f = () => setTheme(m.matches ? 'dark' : 'light'); f();
		m.addEventListener('change', f); return () => m.removeEventListener('change', f);
	}, [themeProp, isolated]);
	useEffect(() => {
		if (isolated || !('serviceWorker' in navigator) || process.env.NODE_ENV !== 'production') return;
		navigator.serviceWorker.register('/sw.js').catch(() => undefined);
	}, [isolated]);

	const framed = frame === 'phone' || wide;
	const screen = <Screen app={app} framed={framed} chrome={chrome} />;

	if (!framed) {
		return (
			<div data-theme={theme} className="relative flex h-dvh flex-col overflow-hidden bg-bg pt-[env(safe-area-inset-top)] text-text">{screen}</div>
		);
	}
	const phone = (
		<div data-theme={theme} data-screen-label="Phone" className="box-content h-[844px] w-[390px] flex-none rounded-[56px] bg-[#1d1d1f] p-[11px] shadow-[0_30px_60px_rgba(0,0,0,.18)]">
			<div className="relative flex h-[844px] w-[390px] flex-col overflow-hidden rounded-[46px] bg-bg text-text">{screen}</div>
		</div>
	);
	if (frame === 'phone') return phone;
	return (
		<div className="flex min-h-dvh flex-wrap items-start justify-center gap-12 bg-[#e8e8ed] px-6 py-10 font-[family-name:var(--font-body)] text-[#1d1d1f]">
			{phone}
			<UpstreamPanel app={app} theme={theme} onTheme={setTheme} />
		</div>
	);
}

function Screen({ app, framed, chrome }: { app: App; framed: boolean; chrome: 'ios' | 'android' }) {
	const { s, a } = app;
	const appRef = useRef<HTMLDivElement>(null);
	useEffect(() => { if (appRef.current) appRef.current.scrollTop = 0; }, [s.tab, s.sub]);
	const plan = s.plan;
	const sy = syncInfo(s);
	return (
		<>
			{framed && (chrome === 'ios' ? (
				<div className="relative flex h-[54px] flex-none items-center justify-between pr-8 pl-10 text-[16px] font-semibold" aria-hidden>
					<span>9:41</span>
					<div className="absolute top-[11px] left-1/2 h-9 w-[124px] -translate-x-1/2 rounded-[20px] bg-black" />
					<span className="flex gap-1.5 text-[17px]"><Icon name="cell-signal-full" /><Icon name="wifi-high" /><Icon name="battery-full" /></span>
				</div>
			) : (
				<div className="relative flex h-10 flex-none items-center justify-between px-6 text-[14px] font-medium" aria-hidden>
					<span>9:41</span>
					<div className="absolute top-3 left-1/2 h-4 w-4 -translate-x-1/2 rounded-full bg-black" />
					<span className="flex gap-[5px] text-[15px]"><Icon name="wifi-high" /><Icon name="cell-signal-full" /><Icon name="battery-full" /></span>
				</div>
			))}

			{!s.ready && <div className="grid flex-1 place-items-center text-[14px] text-text-muted">Carregando…</div>}
			{s.ready && s.screen === 'login' && <Login app={app} />}
			{s.ready && s.screen === 'wizard' && <Wizard app={app} />}
			{s.ready && s.screen === 'app' && !plan && (
				<div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 text-center">
					<p className="text-[17px] text-text-muted">Nenhum plano neste aparelho.</p>
					<Button onClick={() => a.up({ screen: 'wizard', step: 0 })}>Responder o questionário</Button>
				</div>
			)}
			{s.ready && s.screen === 'app' && plan && (
				<div className="flex min-h-0 flex-1 flex-col">
					<main ref={appRef} className="no-scrollbar min-h-0 flex-1 overflow-auto">
						{!s.sub && s.tab !== 'executar' && (
							<div className="flex justify-end px-4 pt-1">
								<button type="button" onClick={() => a.up({ tab: 'conta', sub: 'sync' })} className="inline-flex h-[30px] cursor-pointer items-center gap-1.5 rounded-full border-0 bg-surface px-3 text-[12px] text-text">
									<span className="h-[7px] w-[7px] rounded-full" style={{ background: sy.dot }} />{sy.label}
								</button>
							</div>
						)}
						{s.sub && (
							<div className="flex h-11 items-center px-2">
								<button type="button" onClick={() => a.up({ sub: null })} className="flex h-11 cursor-pointer items-center gap-0.5 border-0 bg-transparent text-[17px] text-link"><Icon name="caret-left" className="text-[20px]" />Conta</button>
							</div>
						)}
						{!s.sub && s.tab === 'prisma' && <PrismaTab app={app} plan={plan} />}
						{!s.sub && s.tab === 'executar' && <ExecutarTab app={app} plan={plan} />}
						{!s.sub && s.tab === 'mapa' && <MapaTab app={app} plan={plan} />}
						{!s.sub && s.tab === 'rotinas' && <RotinasTab app={app} plan={plan} />}
						{!s.sub && s.tab === 'conta' && <ContaTab app={app} />}
						{s.sub === 'sync' && <SyncScreen app={app} plan={plan} />}
						{s.sub === 'export' && <DadosScreen app={app} plan={plan} />}
						{s.sub === 'settings' && <AjustesScreen app={app} plan={plan} />}
					</main>
					<nav aria-label="Seções" className="flex flex-none border-t border-divider px-1 pt-1.5 backdrop-blur-[20px] backdrop-saturate-[180%]"
						style={{ background: 'color-mix(in srgb, var(--color-bg) 80%, transparent)', paddingBottom: framed ? (chrome === 'ios' ? 28 : 22) : 'max(8px, env(safe-area-inset-bottom))' }}>
						{TABS.map(([k, label, icon]) => {
							const on = s.tab === k;
							return (
								<button key={k} type="button" aria-current={on ? 'page' : undefined} onClick={() => a.up({ tab: k, sub: null })}
									className="flex min-h-12 flex-1 cursor-pointer flex-col items-center gap-0.5 border-0 bg-transparent py-1 text-[11px]" style={{ color: on ? 'var(--color-accent)' : 'var(--color-text-muted)' }}>
									<Icon name={icon} className="text-[24px]" />{label}
								</button>
							);
						})}
					</nav>
				</div>
			)}

			{s.toast && <div role="status" className="absolute bottom-[110px] left-1/2 z-30 max-w-[90%] -translate-x-1/2 truncate rounded-full bg-text px-4 py-2.5 text-[14px] whitespace-nowrap text-bg shadow-[0_8px_24px_rgba(0,0,0,.18)]">{s.toast}</div>}
			{s.sheet && <SheetView app={app} />}
			{framed && <div aria-hidden className={'pointer-events-none absolute bottom-2 left-1/2 -translate-x-1/2 rounded-full ' + (chrome === 'ios' ? 'h-[5px] w-[134px] bg-text' : 'h-1 w-[108px] bg-text-muted')} />}
		</>
	);
}

function SheetView({ app }: { app: App }) {
	const { s, a } = app;
	const sh = s.sheet!;
	const close = () => a.up({ sheet: null });
	useEffect(() => {
		const k = (e: KeyboardEvent) => { if (e.key === 'Escape') a.up({ sheet: null }); };
		window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
	}, [a]);
	const hasInput = sh.kind !== 'redo';
	return (
		<div className="absolute inset-0 z-20 flex items-end backdrop-blur-[8px]" style={{ background: 'var(--color-scrim)' }} onClick={close}>
			<div role="dialog" aria-modal="true" aria-label={sh.title} onClick={e => e.stopPropagation()} className="box-border flex w-full flex-col gap-3.5 rounded-t-[28px] bg-bg px-5 pt-2.5 pb-10 text-text">
				<div className="h-[5px] w-9 self-center rounded-full bg-divider" />
				<div className="flex items-center justify-between"><span className="text-[21px] font-semibold">{sh.title}</span>
					<button type="button" onClick={close} aria-label="Fechar" className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border-0 bg-surface text-text-muted"><Icon name="x" /></button></div>
				{'desc' in sh && sh.desc && <p className="m-0 text-[15px] leading-[1.47] text-text-muted">{sh.desc}</p>}
				{hasInput && <TextField label={sh.inputLabel} placeholder={sh.placeholder} value={s.draft} autoFocus type={sh.kind === 'share' ? 'email' : 'text'}
					onChange={e => a.up({ draft: e.target.value })} onKeyDown={e => { if (e.key === 'Enter') void a.confirmSheet(); }} />}
				{sh.kind === 'share' && (
					<div className="overflow-hidden rounded-lg bg-surface">
						{s.members.map((m, i) => (
							<div key={m.email || m.name} className="flex items-center gap-2.5 px-3.5 py-2.5" style={{ borderTop: `1px solid ${i ? 'var(--color-divider)' : 'transparent'}` }}>
								<span className="grid h-8 w-8 place-items-center rounded-full bg-bg text-[14px] font-semibold">{(m.name || m.email)[0]?.toUpperCase()}</span>
								<span className="flex-1 text-[15px]">{m.name || m.email}</span>
								<Tag tone={m.role === 'owner' ? 'accent' : 'neutral'}>{({ owner: 'Dono', editor: 'Editor', viewer: 'Leitura', invited: 'Convite enviado' } as const)[m.role]}</Tag>
							</div>
						))}
					</div>
				)}
				<Button block onClick={() => void a.confirmSheet()}>{sh.cta}</Button>
			</div>
		</div>
	);
}

function UpstreamPanel({ app, theme, onTheme }: { app: App; theme: 'light' | 'dark'; onTheme: (t: 'light' | 'dark') => void }) {
	const { s, a } = app;
	const cur = s.screen !== 'app' ? s.screen : (s.sub || s.tab);
	const arch = ARCH[cur] || ARCH.login;
	return (
		<aside data-screen-label="Upstream" className="flex min-w-[300px] flex-[0_1_400px] flex-col gap-4">
			<div>
				<div className="text-[12px] font-semibold text-[#6e6e73]">EXECUTAR · Prisma · Next.js + Prisma ORM</div>
				<h2 className="mt-1 mb-1.5 text-[28px] leading-[1.14] font-semibold tracking-[-0.01em]">Uma tela.<br />Seus módulos.</h2>
				<p className="m-0 text-[15px] leading-[1.47] text-[#6e6e73]">A lógica vive em <code className="text-[13px]">@executar/core</code> — funções puras usadas por este app, pelas rotas da API e pelo app nativo. Toque numa tela para navegar.</p>
			</div>
			<div className="flex flex-col gap-3.5 rounded-[18px] bg-white p-5">
				<div className="flex items-center justify-between gap-2"><span className="text-[21px] font-semibold">{arch.t}</span><span className="tag tag-accent">Tela atual</span></div>
				<div><div className="text-[12px] text-[#6e6e73]">Arquivo</div><code className="text-[13px] text-[#1d1d1f]">{arch.route}</code></div>
				<div><div className="mb-1.5 text-[12px] text-[#6e6e73]">Componentes</div><div className="flex flex-wrap gap-1.5">{arch.ui.map(x => <span key={x} className="tag tag-neutral">{x}</span>)}</div></div>
				{arch.core.length > 0 && <div><div className="mb-1.5 text-[12px] text-[#6e6e73]">@executar/core</div><div className="flex flex-wrap gap-1.5">{arch.core.map(x => <span key={x} className="tag tag-outline">{x}</span>)}</div></div>}
				<div><div className="mb-1.5 text-[12px] text-[#6e6e73]">API</div><div className="flex flex-col gap-1">{arch.api.map(x => <code key={x} className="text-[13px] text-[#1d1d1f]">{x}</code>)}</div></div>
			</div>
			<div className="overflow-hidden rounded-[18px] bg-white">
				{Object.entries(ARCH).map(([k, v], i) => (
					<button key={k} type="button" onClick={() => a.go(k as StartView)} className="flex min-h-11 w-full cursor-pointer items-center gap-2.5 border-0 px-4 text-left text-[15px] text-[#1d1d1f]"
						style={{ borderTop: `1px solid ${i ? 'rgba(0,0,0,.08)' : 'transparent'}`, background: k === cur ? 'var(--color-accent-100)' : 'transparent' }}>
						<span className="flex-1">{v.t}</span>
					</button>
				))}
			</div>
			<div className="flex flex-wrap gap-2">
				<Button variant="secondary" size="sm" onClick={a.loadDemo}>Carregar exemplo</Button>
				<Button variant="secondary" size="sm" onClick={() => onTheme(theme === 'dark' ? 'light' : 'dark')}>{theme === 'dark' ? 'Tema claro' : 'Tema escuro'}</Button>
				<Button variant="ghost" size="sm" onClick={a.wipe}>Recomeçar</Button>
			</div>
			<p className="m-0 text-[12px] text-[#6e6e73]"><Link href="/">Landing</Link> · <Link href="/app/exportar">Modelos de exportação</Link> · <Link href="/galeria">Galeria</Link> · plano: {s.plan ? C.fmt(s.plan.inicio) + ' → ' + C.fmt(C.endDate(s.plan)) : '—'}</p>
		</aside>
	);
}
