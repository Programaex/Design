// Frame shared by every mini app: header (back to the ecosystem catalog · app · plan), content, bottom switcher,
// toast and bottom sheet. Mobile-first; on wide screens the app sits in a centred phone-width column.
import { Button, Icon, SheetView, type PrismaApp } from '@executar/ui';
import { useEffect, useState, type ReactNode } from 'react';
import { APPS, SWITCHER, appBySlug, appUrl, catalogUrl } from './catalog';

function useTheme() {
	const [dark, setDark] = useState(false);
	useEffect(() => {
		const m = window.matchMedia('(prefers-color-scheme: dark)');
		const f = () => setDark(m.matches); f();
		m.addEventListener('change', f); return () => m.removeEventListener('change', f);
	}, []);
	return dark ? 'dark' : 'light';
}

let swRegistered = false;
function registerServiceWorker() {
	if (swRegistered || !('serviceWorker' in navigator) || import.meta.env.DEV) return;
	swRegistered = true;
	navigator.serviceWorker.register('/m/sw.js', { scope: '/m/' }).catch(() => undefined);
}

export function AppIcon({ slug, size = 28 }: { slug: string; size?: number }) {
	return <img src={'/m/icons/' + slug + '.svg'} alt="" width={size} height={size} className="flex-none rounded-[22%]" />;
}

export function MiniApp({ slug, app, wide = false, fill = false, children }: { slug: string; app?: PrismaApp; wide?: boolean; fill?: boolean; children: ReactNode }) {
	const def = appBySlug(slug);
	const theme = useTheme();
	useEffect(registerServiceWorker, []);
	const plan = app?.s.plan;
	return (
		<div data-theme={theme} className="flex h-dvh flex-col bg-bg text-text">
			<header className={(wide ? '' : 'sticky top-0 ') + 'z-20 flex-none border-b border-divider backdrop-blur-[20px] backdrop-saturate-[180%]'} style={{ background: 'color-mix(in srgb, var(--color-bg) 85%, transparent)', paddingTop: 'env(safe-area-inset-top)' }}>
				<div className={'mx-auto flex h-12 items-center gap-2 px-3 ' + (wide ? 'max-w-[1180px]' : 'max-w-[480px]')}>
					<a href={catalogUrl(def)} className="flex h-11 items-center gap-0.5 pr-1 text-[15px] text-link no-underline hover:no-underline" aria-label={'Voltar para ' + (def.catalog === 'apps' ? 'Apps' : 'Ferramentas')}>
						<Icon name="caret-left" className="text-[18px]" />{def.catalog === 'apps' ? 'Apps' : 'Ferramentas'}
					</a>
					<span className="flex min-w-0 flex-1 items-center justify-center gap-2"><AppIcon slug={slug} size={22} /><span className="truncate text-[15px] font-semibold">{def.title}</span></span>
					{app && (
						<a href={appUrl('prisma')} title={plan ? 'Plano: ' + plan.nome : 'Nenhum plano neste aparelho'} className="flex h-[30px] max-w-[38%] items-center gap-1.5 rounded-full bg-surface px-3 text-[12px] text-text no-underline hover:no-underline">
							<span className="h-[7px] w-[7px] flex-none rounded-full" style={{ background: plan ? 'var(--color-success)' : 'var(--color-neutral-400)' }} />
							<span className="truncate">{plan ? plan.nome : 'Sem plano'}</span>
						</a>
					)}
				</div>
			</header>

			<main className={'relative min-h-0 flex-1 ' + (fill ? 'flex flex-col overflow-hidden' : 'no-scrollbar overflow-auto')}>
				<div className={wide ? '' : 'mx-auto flex h-full min-h-0 max-w-[480px] flex-col'}>{children}</div>
				{app?.s.toast && <div role="status" className="pointer-events-none fixed bottom-24 left-1/2 z-30 max-w-[90%] -translate-x-1/2 truncate rounded-full bg-text px-4 py-2.5 text-[14px] text-bg shadow-[0_8px_24px_rgba(0,0,0,.18)]">{app.s.toast}</div>}
				{app?.s.sheet && <div className="fixed inset-0 z-40 mx-auto max-w-[480px]"><SheetView app={app} /></div>}
			</main>

			{!wide && (
				<nav aria-label="Mini apps" className="flex-none border-t border-divider backdrop-blur-[20px] backdrop-saturate-[180%]" style={{ background: 'color-mix(in srgb, var(--color-bg) 85%, transparent)', paddingBottom: 'max(8px, env(safe-area-inset-bottom))' }}>
					<div className="mx-auto flex max-w-[480px] px-1 pt-1.5">
						{SWITCHER.map(k => {
							const a = APPS.find(x => x.slug === k)!, on = k === slug;
							return (
								<a key={k} href={appUrl(k)} aria-current={on ? 'page' : undefined} className="flex min-h-12 flex-1 flex-col items-center gap-0.5 py-1 text-[11px] no-underline hover:no-underline" style={{ color: on ? 'var(--color-accent)' : 'var(--color-text-muted)' }}>
									<Icon name={a.icon} className="text-[24px]" />{a.title}
								</a>
							);
						})}
					</div>
				</nav>
			)}
		</div>
	);
}

/** No plan on this device yet: create it, import it or try the example. */
export function EmptyPlan({ app, what }: { app: PrismaApp; what: string }) {
	return (
		<div className="flex flex-1 flex-col items-center justify-center gap-3 px-8 py-16 text-center">
			<AppIcon slug="prisma" size={56} />
			<h1 className="m-0 text-[24px] leading-[1.15] font-semibold tracking-[-0.01em]">Nenhum plano neste aparelho.</h1>
			<p className="m-0 max-w-[32ch] text-[15px] leading-[1.47] text-text-muted">{what} usa o plano criado no Prisma. Tudo fica só neste aparelho, sem conta.</p>
			<a href={appUrl('prisma')} className="btn btn-primary mt-2 min-h-11">Criar no Prisma</a>
			<div className="flex flex-wrap justify-center gap-2">
				<a href={appUrl('importar-csv')} className="btn btn-secondary btn-sm min-h-8">Importar CSV</a>
				<Button variant="ghost" size="sm" onClick={app.a.loadDemo}>Carregar exemplo</Button>
			</div>
		</div>
	);
}
