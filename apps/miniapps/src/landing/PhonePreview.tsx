// Phone-framed, isolated Prisma demo for the landing (sample data, no storage, no server).
import { AjustesScreen, Button, ContaTab, DadosScreen, ExecutarTab, Icon, Login, MapaTab, PrismaTab, RotinasTab, SheetView, SyncScreen, Wizard, syncInfo, usePrismaApp, type PrismaApp as App, type StartView, type Tab } from '@executar/ui';
import { useEffect, useRef } from 'react';

const TABS: [Tab, string, string][] = [['prisma', 'Prisma', 'list-checks'], ['executar', 'Executar', 'play-circle'], ['mapa', 'Mapa', 'tree-structure'], ['rotinas', 'Rotinas', 'sun-horizon'], ['conta', 'Conta', 'user-circle']];

export function PrismaApp({ startView, theme = 'light' }: { isolated?: boolean; frame?: 'phone'; startView?: StartView; theme?: 'light' | 'dark' }) {
	const app = usePrismaApp({ isolated: true, remote: false, startView });
	return (
		<div data-theme={theme} data-screen-label="Phone" className="box-content h-[844px] w-[390px] flex-none rounded-[56px] bg-[#1d1d1f] p-[11px] shadow-[0_30px_60px_rgba(0,0,0,.18)]">
			<div className="relative flex h-[844px] w-[390px] flex-col overflow-hidden rounded-[46px] bg-bg text-text"><Screen app={app} framed chrome="ios" /></div>
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


