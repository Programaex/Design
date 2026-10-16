'use client';
// "Prisma Galeria": every screen as a live, isolated phone (sample data, never your plan) + the four A4 templates.
import * as C from '@executar/core';
import Link from 'next/link';
import { useEffect, useMemo, useState } from 'react';
import { PrismaApp } from '../app/PrismaApp';
import { SegmentedControl } from '../ds';
import { readSaved, type StartView } from '@/lib/use-prisma-app';

const VIEWS: [StartView, string, string, number?, boolean?][] = [
	['login', 'Login', 'E-mail, Apple, Google ou uso sem conta.'],
	['wizard', 'Questionário · grupos', 'Pergunta 3 de 8: tipos de trabalho.', 2],
	['wizard', 'Questionário · horizontes', 'Pergunta 5 de 8: quando cada entregável fica pronto.', 4],
	['prisma', 'Prisma', 'Agora, próximo e depois, com tarefas editáveis.'],
	['executar', 'Executar', 'Scroll Task: um item por vez, timer e auto-scroll.'],
	['executar', 'Executar · contexto', 'Duplo toque abre prova, progresso e nota.', 0, true],
	['mapa', 'Mapa mental', 'Grupos → entregáveis → tarefas.'],
	['rotinas', 'Rotinas do dia', 'Hábitos que reiniciam toda manhã.'],
	['conta', 'Conta', 'Perfil, compartilhar, dados e ajustes.'],
	['sync', 'Sincronização', 'Fila offline e resolução de conflitos.'],
	['export', 'Dados · modelos', 'Escolha do modelo de exportação e importação.'],
	['settings', 'Ajustes', 'Linguagem, lembretes e assistente.']
];

export function Gallery() {
	const [filter, setFilter] = useState<'all' | 'app' | 'export'>('all');
	const [chrome, setChrome] = useState<'ios' | 'android'>('ios');
	const [theme, setTheme] = useState<'light' | 'dark'>('light');
	const [plan, setPlan] = useState<C.Plan | null>(null);
	useEffect(() => { setPlan(readSaved()?.plan ?? C.demoPlan().plan); }, []);
	const thumbs = useMemo(() => plan ? C.TEMPLATES.map(t => ({ t, html: C.pageHtml(C.viewModel(t.id, plan).pages[0]) })) : [], [plan]);

	return (
		<div className="min-h-dvh bg-[#e8e8ed] px-6 py-10 font-[family-name:var(--font-body)] text-[#1d1d1f]">
			<header className="mx-auto flex max-w-[1400px] flex-wrap items-end justify-between gap-8">
				<div>
					<div className="text-[12px] font-semibold text-[#6e6e73]"><Link href="/">EXECUTAR</Link> · Prisma</div>
					<h1 className="mt-1 mb-2 text-[48px] leading-[1.05] font-semibold tracking-[-0.015em]">Telas e modelos.<br />Tudo em um lugar.</h1>
					<p className="m-0 max-w-[56ch] text-[17px] text-[#6e6e73]">Cada telefone é o app real, com dados de exemplo e isolado dos seus dados. Os modelos de exportação usam o plano salvo neste aparelho.</p>
				</div>
				<div className="flex min-w-[320px] flex-col gap-2.5">
					<SegmentedControl name="filtro" ariaLabel="Filtro" className="w-full" value={filter} onChange={setFilter} options={[{ value: 'all', label: 'Tudo' }, { value: 'app', label: 'Telas do app' }, { value: 'export', label: 'Modelos' }]} />
					<div className="grid grid-cols-2 gap-2">
						<SegmentedControl name="chrome" ariaLabel="Aparelho" className="w-full" value={chrome} onChange={setChrome} options={[{ value: 'ios', label: 'iOS' }, { value: 'android', label: 'Android' }]} />
						<SegmentedControl name="tema" ariaLabel="Tema" className="w-full" value={theme} onChange={setTheme} options={[{ value: 'light', label: 'Claro' }, { value: 'dark', label: 'Escuro' }]} />
					</div>
				</div>
			</header>
			{filter !== 'export' && (
				<section aria-label="Telas do app" className="mx-auto mt-12 grid max-w-[1400px] grid-cols-[repeat(auto-fill,minmax(330px,1fr))] justify-items-center gap-x-8 gap-y-12">
					{VIEWS.map(([view, t, sub, step, ctx], i) => (
						<figure key={i} className="m-0 flex flex-col gap-3">
							<div className="relative h-[694px] w-[330px]">
								<div className="absolute top-0 left-0 h-[866px] w-[412px] origin-top-left scale-[.8]">
									<PrismaApp key={chrome + theme} isolated frame="phone" startView={view} startStep={step} execContext={ctx} chrome={chrome} theme={theme} />
								</div>
							</div>
							<figcaption><span className="font-[family-name:var(--font-mono-doc)] text-[11px] text-[#6e6e73]">A{String(i + 1).padStart(2, '0')}</span><span className="block text-[17px] font-semibold">{t}</span><span className="block text-[14px] text-[#6e6e73]">{sub}</span></figcaption>
						</figure>
					))}
				</section>
			)}
			{filter !== 'app' && (
				<section aria-label="Modelos de exportação" className="mx-auto mt-14 grid max-w-[1400px] grid-cols-[repeat(auto-fill,minmax(300px,1fr))] gap-8">
					{thumbs.map(({ t, html }, i) => (
						<Link key={t.id} href={'/app/exportar?template=' + t.id} className="group flex flex-col gap-3 text-[#1d1d1f] no-underline hover:no-underline">
							<div className="relative h-[397px] w-[281px] overflow-hidden rounded-[6px] bg-white shadow-[0_18px_40px_rgba(0,0,0,.12)] transition-transform duration-[240ms] group-hover:scale-[1.01]">
								<div className="pointer-events-none origin-top-left scale-[.354]" aria-hidden dangerouslySetInnerHTML={{ __html: html }} />
							</div>
							<span><span className="font-[family-name:var(--font-mono-doc)] text-[11px] text-[#6e6e73]">M{String(i + 1).padStart(2, '0')}</span><span className="block text-[17px] font-semibold">{t.t}</span><span className="block text-[14px] text-[#6e6e73]">{t.s}</span></span>
						</Link>
					))}
				</section>
			)}
		</div>
	);
}
