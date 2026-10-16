// Prisma: questionário → plano em três horizontes; aba "Dados" exporta/importa JSON e CSV e abre as Folhas A4.
import { DadosScreen, PrismaTab, SegmentedControl, Wizard } from '@executar/ui';
import { useState } from 'react';
import { MiniApp } from '../shell/MiniApp';
import { useMiniApp } from '../shell/store';
import { mount } from './mount';

function Prisma() {
	const app = useMiniApp('prisma');
	const { s } = app;
	const [view, setView] = useState<'plano' | 'dados'>('plano');
	if (!s.ready) return <MiniApp slug="prisma"><div /></MiniApp>;
	if (s.screen === 'wizard' || !s.plan) return <MiniApp slug="prisma" app={app} fill><Wizard app={app} /></MiniApp>;
	return (
		<MiniApp slug="prisma" app={app}>
			<div className="px-4 pt-3"><SegmentedControl name="vista" ariaLabel="Vista" className="w-full" value={view} onChange={setView} options={[{ value: 'plano', label: 'Plano' }, { value: 'dados', label: 'Dados e A4' }]} /></div>
			{view === 'plano' ? <PrismaTab app={app} plan={s.plan} /> : <div className="pt-3"><DadosScreen app={app} plan={s.plan} /></div>}
			{view === 'dados' && (
				<div className="px-4 pb-10">
					<button type="button" className="min-h-[52px] w-full cursor-pointer rounded-lg border-0 bg-surface text-[17px] text-link"
						onClick={() => app.a.openSheet({ kind: 'redo', title: 'Refazer questionário?', desc: 'Suas respostas ficam preenchidas. O progresso das tarefas recomeça ao gerar de novo.', cta: 'Refazer' })}>Refazer questionário</button>
				</div>
			)}
		</MiniApp>
	);
}
mount(<Prisma />);
