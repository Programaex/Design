// /m/ — os seis mini apps, com o plano atual deste aparelho.
import { readSaved } from '@executar/ui';
import { AppIcon } from '../shell/MiniApp';
import { APPS, appUrl } from '../shell/catalog';
import { mount } from './mount';

function Hub() {
	const plan = readSaved()?.plan;
	return (
		<div className="min-h-dvh bg-bg px-5 py-10 text-text" data-theme={window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'}>
			<div className="mx-auto max-w-[720px]">
				<div className="text-[12px] font-semibold text-text-muted"><a href="/ui_kits/ecossistema/#/apps">EXECUTAR</a> · mini apps</div>
				<h1 className="mt-2 mb-2 text-[40px] leading-[1.05] font-semibold tracking-[-0.015em]">Um plano.<br />Seis apps.</h1>
				<p className="m-0 max-w-[48ch] text-[17px] leading-[1.47] text-text-muted">Funcionam no navegador, sem conta e sem conexão. Todos usam o mesmo plano salvo neste aparelho{plan ? <> — agora: <strong className="text-text">{plan.nome}</strong></> : ''}. Para instalar, abra o app e use “Adicionar à tela de início”.</p>
				<div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
					{APPS.map(a => (
						<a key={a.slug} href={appUrl(a.slug)} className="flex items-start gap-3.5 rounded-lg bg-surface p-4 text-text no-underline transition-transform duration-200 hover:scale-[1.01] hover:no-underline">
							<AppIcon slug={a.slug} size={44} />
							<span className="min-w-0"><span className="block text-[12px] font-semibold text-text-muted">{a.kicker} · {a.catalog === 'apps' ? 'App' : 'Ferramenta'}</span><span className="block text-[17px] font-semibold">{a.title}</span><span className="mt-1 block text-[14px] leading-[1.43] text-text-muted">{a.description}</span></span>
						</a>
					))}
				</div>
			</div>
		</div>
	);
}
mount(<Hub />);
