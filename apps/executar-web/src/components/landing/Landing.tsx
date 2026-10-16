'use client';
// EXECUTAR landing — Claude Design "EXECUTAR Landing" (Apple product-page architecture: sticky product nav,
// hero + live workflow, highlights carousel, big-type method, three comparators, strategies rail,
// "Explore os detalhes" with the real app, video storyboard, closing).
import Image from 'next/image';
import Link from 'next/link';
import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { PrismaApp } from '../app/PrismaApp';
import { Button, Icon } from '@executar/ui';
import { DocumentComparison, EnvironmentComparison, TasksComparison } from './Comparisons';
import { Diagram, WorkflowHero } from './WorkflowHero';

const HL = [
	{ img: '/landing/ruido.gif', alt: 'Pessoa cercada por objetos flutuando', pos: 'center 30%', bg: '#DADADA', t1: 'Ruído por todos os lados.', t2: 'Um lugar para o que importa.' },
	{ img: '/landing/mesa.jpeg', alt: 'Mesa de trabalho com celular, notas e lápis', pos: 'center 55%', bg: '#2E8B57', t1: 'Seu plano em três horizontes.', t2: 'Agora, próximo e depois.' },
	{ img: '/landing/cadeira.jpeg', alt: 'Pessoa ajustando uma cadeira de escritório', pos: 'center 40%', bg: '#E8E6E1', t1: 'Uma ação por vez.', t2: 'Sem perder o fio.' },
	{ img: null, alt: '', pos: '', bg: '#F5F5F7', t1: 'Leve o plano para o papel.', t2: 'A4 em três faces.' }
];
const STRAT = [
	{ n: 18, icon: 'eye', t: 'Reduza', sub: 'Esforço no estudo', body: 'Com seu planejamento sempre à vista, a possibilidade de esquecer diminui.', inApp: 'o Prisma fica na primeira aba, com o que vence hoje no topo.' },
	{ n: 19, icon: 'arrows-clockwise', t: 'Atualize', sub: 'A visualização das tarefas', body: 'Ao transformar objetivos, tarefas e processos em mapas executivos visuais, diminui-se a carga cognitiva.', inApp: 'o mapa mental abre grupo, entregável e tarefa em camadas.' },
	{ n: 20, icon: 'pen-nib', t: 'Mude', sub: 'A forma de escrever', body: 'Ao anotar uma tarefa ou processo, estruture sempre com verbo de ação. A escolha das palavras influencia a assimilação e a recuperação de contexto.', inApp: 'toda tarefa gerada começa com um verbo, em linguagem simples ou executiva.' },
	{ n: 21, icon: 'magnifying-glass', t: 'Explore', sub: 'Estratégias baseadas em ciência', body: 'Independentemente do diagnóstico, ao identificar seus riscos cognitivos surge a oportunidade de desenvolver novas habilidades.', inApp: 'rotinas de abertura, foco e fechamento sustentam o plano.' },
	{ n: 22, icon: 'warning', t: 'Identifique', sub: 'Riscos cognitivos', body: 'Só é possível desenvolver novas habilidades quando se tem clareza sobre os pontos fracos. Identificar para prevenir é o primeiro passo para gerir e se desenvolver.', inApp: 'atrasos aparecem em destaque e pedem nova data.' },
	{ n: 23, icon: 'funnel-simple', t: 'Retire', sub: 'Excessos desnecessários', body: 'Seus ambientes — mental, físico, analógico e digital — influenciam diretamente a carga cognitiva. Ao reduzir excessos, a execução tende a exigir menos esforço.', inApp: 'Executar mostra só a ação atual; o resto espera.' }
];
const DETAILS = [
	['prisma', 'Prisma', 'Oito perguntas, um plano.', 'Entregáveis em três horizontes, cada um com prova de conclusão.'],
	['executar', 'Executar', 'Uma ação no centro da tela.', 'Timer de 15, 30 ou 45 minutos. A conclusão é sempre sua.'],
	['mapa', 'Mapa mental', 'Do grupo à tarefa.', 'Toque em um nó para abrir o próximo nível.'],
	['rotinas', 'Rotinas', 'Hábitos que recomeçam.', 'Reiniciam toda manhã, com lembrete no horário de cada um.'],
	['export', 'Exportar', 'Quatro modelos A4.', 'PDF ou HTML que abre no celular, já preenchido.']
] as const;
export const FRAMES: [number, string, string, string][] = [[1.2, '0–2 s', 'Surgir', 'Grade e nós aparecem em sequência.'], [3.4, '2–4 s', 'Conectar', 'Fios ortogonais ligam API e MCP.'], [5.3, '4–6 s', 'Sincronizar', 'Sinais percorrem cada conexão.'], [7.6, '6–8 s', 'Entregar', 'As saídas ganham cor uma a uma.'], [10, '8–10 s', 'Executar', '“Da intenção à execução.”']];
const FACTS = [['Três horizontes', 'agora, próximo e depois'], ['Quatro escopos', 'ação, tarefa, fase e workflow'], ['Offline primeiro', 'edições ficam na fila e sincronizam depois'], ['A4 em três faces', 'quatro modelos de exportação']];

function useReducedMotion() {
	const [r, setR] = useState(false);
	useEffect(() => {
		const m = window.matchMedia('(prefers-reduced-motion: reduce)');
		const f = () => setR(m.matches); f();
		m.addEventListener('change', f); return () => m.removeEventListener('change', f);
	}, []);
	return r;
}

export function Landing({ slideSeconds = 5, compareStart = 50 }: { slideSeconds?: number; compareStart?: number }) {
	const reduced = useReducedMotion();
	const root = useRef<HTMLDivElement>(null);
	const stratRef = useRef<HTMLDivElement>(null);
	const [hl, setHl] = useState(0);
	const [hlPlay, setHlPlay] = useState(true);
	const [det, setDet] = useState<(typeof DETAILS)[number][0]>('prisma');
	const [strat, setStrat] = useState<Record<number, boolean>>({});
	const hx = useRef<number | null>(null);
	const n = HL.length;
	const playing = hlPlay && !reduced;

	useEffect(() => {
		if (reduced || !root.current || !('IntersectionObserver' in window)) return;
		const io = new IntersectionObserver(es => es.forEach(e => { if (e.isIntersecting) { e.target.setAttribute('data-reveal', 'shown'); io.unobserve(e.target); } }), { rootMargin: '0px 0px -8% 0px' });
		root.current.querySelectorAll('[data-reveal]').forEach(el => {
			if (el.getBoundingClientRect().top < window.innerHeight * 0.92) return;
			el.setAttribute('data-reveal', 'hidden'); io.observe(el);
		});
		return () => io.disconnect();
	}, [reduced]);

	const goTo = (id: string) => (e?: React.MouseEvent) => {
		e?.preventDefault();
		const el = document.getElementById(id); if (!el) return;
		window.scrollTo({ top: el.getBoundingClientRect().top + window.scrollY - 76, behavior: reduced ? 'auto' : 'smooth' });
	};
	const scrollStrat = (d: number) => stratRef.current?.scrollBy({ left: d * 360, behavior: reduced ? 'auto' : 'smooth' });

	return (
		<div ref={root} lang="pt-BR" className="overflow-x-clip bg-warm font-[family-name:var(--font-body)] text-[#1d1d1f] antialiased">
			<a href="#topo" className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded-full focus:bg-white focus:px-4 focus:py-2">Pular para o conteúdo</a>
			{/* PRODUCT NAV */}
			<div className="sticky top-2.5 z-50 px-3">
				<nav aria-label="EXECUTAR" className="mx-auto box-border flex min-h-14 max-w-[1180px] items-center gap-3 rounded-[20px] border border-black/8 bg-white/80 py-1.5 pr-2 pl-5 backdrop-blur-[20px] backdrop-saturate-[180%]">
					<a href="#topo" onClick={goTo('topo')} className="flex items-center gap-2 text-[19px] font-semibold tracking-[-0.01em] text-[#1d1d1f] no-underline hover:no-underline hover:text-[#1d1d1f]">
						<span className="grid h-[26px] w-[26px] place-items-center rounded-[7px] bg-accent text-[15px] text-white"><Icon name="squares-four" /></span>EXECUTAR
					</a>
					<span className="flex-1" />
					<div className="hidden gap-5 text-[13px] min-[860px]:flex">
						{[['Destaques', 'destaques'], ['Comparar', 'comparar'], ['Detalhes', 'detalhes'], ['Storyboard', 'storyboard']].map(([t, id]) => (
							<a key={id} href={'#' + id} onClick={goTo(id)} className="text-[#1d1d1f] no-underline opacity-80 hover:text-[#1d1d1f] hover:no-underline hover:opacity-100">{t}</a>
						))}
					</div>
					<Button variant="secondary" size="sm" onClick={goTo('destaques')}>Explorar</Button>
					<Link href="/app" className="btn btn-primary btn-sm min-h-8">Começar</Link>
				</nav>
			</div>

			<main>
				{/* HERO */}
				<header id="topo" data-screen-label="Hero" className="px-5 pt-[clamp(56px,9vw,104px)] text-center">
					<div data-reveal className="mx-auto max-w-[980px]">
						<div className="text-[clamp(19px,2.2vw,24px)] font-semibold tracking-[-0.01em]">EXECUTAR</div>
						<h1 className="mt-2.5 mb-0 text-[clamp(48px,9vw,96px)] leading-[1.02] font-semibold tracking-[-0.025em] text-balance">Menos ruído.<br />Mais execução.</h1>
						<p className="mx-auto mt-5 mb-0 max-w-[34ch] text-[clamp(17px,1.9vw,21px)] leading-[1.45] text-pretty text-[#6e6e73]">Do objetivo às próximas ações. Um workflow visual que conecta ferramentas, organiza informações e torna o caminho mais claro.</p>
						<div className="mt-7 flex flex-wrap justify-center gap-3">
							<Button onClick={goTo('comparar')}>Explorar comparadores</Button>
							<Button variant="secondary" onClick={goTo('detalhes')}>Ver o app</Button>
						</div>
					</div>
					<div data-reveal className="mx-auto mt-[clamp(40px,6vw,72px)] max-w-[1080px]">
						<div className="overflow-hidden rounded-[28px] bg-white shadow-[0_30px_80px_rgba(29,29,31,.08),0_1px_0_rgba(0,0,0,.04)]"><WorkflowHero reduced={reduced} /></div>
					</div>
				</header>

				<div className="mt-[clamp(48px,7vw,80px)] bg-[#ECEBE7]">
					<div className="mx-auto flex max-w-[1180px] flex-wrap items-center justify-between gap-4 px-5 py-[18px]">
						<span className="text-[17px] font-semibold">Funciona no navegador, mesmo sem conexão.</span>
						<Link href="/app" className="btn btn-primary min-h-11">Abrir o app</Link>
					</div>
				</div>

				{/* HIGHLIGHTS */}
				<section id="destaques" data-screen-label="Destaques" aria-roledescription="carrossel" aria-label="Destaques" className="bg-[#F5F5F7] pt-[clamp(72px,10vw,120px)] pb-[clamp(56px,8vw,96px)]">
					<div data-reveal className="mx-auto flex max-w-[1180px] flex-wrap items-end justify-between gap-4 px-5">
						<h2 className="m-0 text-[clamp(36px,5.5vw,56px)] leading-[1.07] font-semibold tracking-[-0.02em]">Comece pelos destaques.</h2>
						<a href="#storyboard" onClick={goTo('storyboard')} className="inline-flex items-center gap-1.5 text-[19px] no-underline">Ver o storyboard do vídeo <Icon name="play-circle" className="text-[22px]" /></a>
					</div>
					<div className="mt-10 overflow-hidden [--cw:min(980px,calc(100vw-72px))]"
						onPointerDown={e => { hx.current = e.clientX; }}
						onPointerUp={e => { if (hx.current == null) return; const dx = e.clientX - hx.current; hx.current = null; if (Math.abs(dx) > 50) setHl(h => (h + (dx < 0 ? 1 : n - 1)) % n); }}
						onPointerCancel={() => { hx.current = null; }}>
						<div className="flex touch-pan-y gap-6 pl-[calc(50%-var(--cw)/2)] transition-transform duration-[600ms] ease-[var(--ease-standard)]" style={{ transform: `translateX(calc(${-hl} * (var(--cw) + 24px)))` }}>
							{HL.map((x, i) => (
								<article key={i} aria-roledescription="slide" aria-label={`${i + 1} de ${n}: ${x.t1}`} aria-hidden={i !== hl}
									className="flex h-[clamp(460px,62vw,640px)] w-[var(--cw)] flex-none flex-col overflow-hidden rounded-[28px] bg-white transition-opacity duration-[600ms]" style={{ opacity: i === hl ? 1 : 0.4 }}>
									<div className="relative min-h-0 flex-1" style={{ background: x.bg }}>
										{x.img ? <Image src={x.img} alt={x.alt} fill sizes="(max-width: 1052px) 100vw, 980px" draggable={false} unoptimized={x.img.endsWith('.gif')} priority={i === 0} style={{ objectFit: 'cover', objectPosition: x.pos }} /> : <A4Sheets />}
									</div>
									<div className="flex-none px-6 py-[clamp(20px,3vw,32px)] text-center">
										<p className="mx-auto my-0 max-w-[28ch] text-[clamp(21px,2.6vw,28px)] leading-[1.2] font-semibold tracking-[-0.01em] text-balance">{x.t1}<br />{x.t2}</p>
									</div>
								</article>
							))}
						</div>
					</div>
					<div className="mt-8 flex items-center justify-center gap-4">
						<div role="tablist" aria-label="Destaques" className="flex h-14 items-center gap-1.5 rounded-full bg-pill px-5">
							{HL.map((_, i) => {
								const on = i === hl;
								return (
									<button key={i} type="button" role="tab" aria-selected={on} aria-label={'Destaque ' + (i + 1)} onClick={() => setHl(i)}
										className="relative mx-0.5 h-2 cursor-pointer overflow-hidden rounded-full border-0 p-0 transition-[width] duration-[400ms] ease-[var(--ease-standard)]" style={{ width: on ? 48 : 8, background: on ? '#AEAEB2' : '#86868B' }}>
										{on && <span key={hl} onAnimationEnd={() => setHl(h => (h + 1) % n)} className="absolute inset-0 origin-left rounded-full bg-[#1d1d1f]"
											style={{ animation: reduced ? 'none' : `hlprog ${slideSeconds}s linear forwards`, animationPlayState: playing ? 'running' : 'paused', transform: reduced ? 'scaleX(1)' : undefined }} />}
									</button>
								);
							})}
						</div>
						<button type="button" onClick={() => setHlPlay(!hlPlay)} aria-label={playing ? 'Pausar destaques' : 'Reproduzir destaques'} disabled={reduced}
							className="grid h-14 w-14 cursor-pointer place-items-center rounded-full border-0 bg-pill text-[22px] text-[#1d1d1f] disabled:opacity-40"><Icon name={playing ? 'pause' : 'play'} /></button>
					</div>
				</section>

				{/* METHOD */}
				<section data-screen-label="Visão geral" className="bg-white px-5 py-[clamp(80px,11vw,140px)]">
					<div className="mx-auto max-w-[720px]">
						<div data-reveal className="text-center text-[19px] font-semibold">O método</div>
						<h2 data-reveal className="mt-3 mb-0 text-center text-[clamp(40px,7vw,80px)] leading-[1.04] font-semibold tracking-[-0.025em] text-balance">Um plano aberto a execução.</h2>
						<p data-reveal className="mt-8 mb-0 text-[clamp(19px,2.2vw,24px)] leading-[1.42] text-pretty text-[#6e6e73]">Responda oito perguntas e o EXECUTAR monta o plano: <span className="text-[#1d1d1f]">entregáveis com prova de conclusão</span>, distribuídos em três horizontes. Na hora de fazer, <span className="text-[#1d1d1f]">uma ação por vez ocupa a tela</span>, com timer e contexto à mão. Quando precisar levar para o papel, o mesmo plano vira uma folha A4 dobrável. Nenhuma tarefa é marcada como feita sem você.</p>
						<div className="mt-[clamp(48px,7vw,80px)] flex flex-col gap-[clamp(28px,4vw,44px)]">
							{FACTS.map(([big, small]) => (
								<div key={big} data-reveal>
									<div className="text-[clamp(40px,6.5vw,72px)] leading-[1.02] font-semibold tracking-[-0.025em]">{big}</div>
									<div className="mt-1.5 text-[clamp(17px,1.8vw,21px)]">{small}</div>
								</div>
							))}
						</div>
					</div>
				</section>

				<TasksComparison initial={compareStart} />
				<EnvironmentComparison initial={compareStart} />
				<DocumentComparison initial={compareStart} />

				{/* STRATEGIES */}
				<section data-screen-label="Estratégias" className="bg-white py-[clamp(72px,10vw,120px)]">
					<div data-reveal className="mx-auto max-w-[1180px] px-5">
						<h2 className="m-0 text-[clamp(36px,5.5vw,56px)] leading-[1.07] font-semibold tracking-[-0.02em]">Na forma que seu dia pedir.</h2>
						<p className="mt-3 mb-0 max-w-[52ch] text-[17px] leading-[1.47] text-[#6e6e73]">Seis estratégias que orientam cada tela do EXECUTAR.</p>
					</div>
					<div ref={stratRef} className="no-scrollbar mt-9 flex snap-x snap-mandatory scroll-px-[max(20px,calc(50%-570px))] gap-5 overflow-x-auto px-[max(20px,calc(50%-570px))] pt-1 pb-2">
						{STRAT.map(x => (
							<div key={x.n} className="flex w-[min(340px,82vw)] flex-none snap-start flex-col gap-3">
								<article className="relative box-border min-h-[240px] rounded-[18px] border border-[#DCDCE0] bg-[#F0F0F2] px-7 pt-7 pb-6">
									<button type="button" onClick={() => setStrat(st => ({ ...st, [x.n]: !st[x.n] }))} aria-expanded={!!strat[x.n]} aria-label={'Mais sobre ' + x.t}
										className="absolute top-3 right-3 grid h-[30px] w-[52px] cursor-pointer place-items-center rounded-full border-0 bg-[#6e6e73] text-[18px] text-white"><Icon name="dots-three" /></button>
									<Icon name={x.icon} className="text-[28px] text-accent" />
									<div className="mt-2.5 text-[28px] font-semibold tracking-[-0.015em]">{x.t}</div>
									<div className="mt-0.5 text-[17px] font-semibold">{x.sub}</div>
									<p className="mt-3 mb-0 text-[14px] leading-[1.5] text-[#3a3a3c]">{x.body}</p>
									{strat[x.n] && <div className="mt-3 border-t border-[#DCDCE0] pt-3 text-[14px]"><span className="text-[#6e6e73]">No app: </span>{x.inApp}</div>}
								</article>
								<div className="flex items-center gap-2 pl-1 text-[21px]"><Icon name="presentation" className="text-[24px]" />{x.n}</div>
							</div>
						))}
					</div>
					<div className="mx-auto mt-4 flex max-w-[1180px] justify-end gap-3 px-5">
						<button type="button" onClick={() => scrollStrat(-1)} aria-label="Anterior" className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border-0 bg-pill text-[18px]"><Icon name="caret-left" /></button>
						<button type="button" onClick={() => scrollStrat(1)} aria-label="Próximo" className="grid h-11 w-11 cursor-pointer place-items-center rounded-full border-0 bg-pill text-[18px]"><Icon name="caret-right" /></button>
					</div>
				</section>

				{/* DETAILS */}
				<section id="detalhes" data-screen-label="Explore os detalhes" className="bg-[#F5F5F7] px-5 py-[clamp(72px,10vw,120px)]">
					<div className="mx-auto max-w-[1180px]">
						<div data-reveal className="flex flex-wrap items-end justify-between gap-4">
							<h2 className="m-0 text-[clamp(36px,5.5vw,56px)] leading-[1.07] font-semibold tracking-[-0.02em]">Explore os detalhes.</h2>
							<Link href="/galeria" className="inline-flex items-center gap-1.5 text-[19px] no-underline">Ver todas as telas <Icon name="caret-right" /></Link>
						</div>
						<div className="mt-12 flex flex-wrap items-center justify-between gap-12">
							<div role="tablist" aria-orientation="vertical" aria-label="Funcionalidades" className="flex max-w-[440px] flex-[1_1_300px] flex-col items-start gap-3">
								{DETAILS.map(([id, t, lead, desc]) => {
									const on = det === id;
									return (
										<button key={id} type="button" role="tab" aria-selected={on} aria-controls="detail-phone" onClick={() => setDet(id)}
											className="flex max-w-full cursor-pointer items-start gap-3.5 border-0 text-left text-[#1d1d1f] transition-[background,border-radius] duration-[240ms]"
											style={{ padding: on ? '18px 22px' : '14px 22px 14px 14px', borderRadius: on ? 28 : 980, background: on ? '#fff' : '#E8E8ED' }}>
											<span className="grid h-[30px] w-[30px] flex-none place-items-center rounded-full border-[1.5px] border-[#1d1d1f] text-[15px] transition-transform duration-[240ms]" style={{ transform: `rotate(${on ? 45 : 0}deg)` }}><Icon name="plus" /></span>
											<span className="min-w-0"><span className="block text-[19px] leading-[30px] font-semibold">{t}</span>
												{on && <span className="mt-1 block max-w-[34ch] text-[17px] leading-[1.47] text-[#6e6e73]"><strong className="font-semibold text-[#1d1d1f]">{lead}</strong> {desc}</span>}</span>
										</button>
									);
								})}
							</div>
							<div className="flex flex-[1_1_300px] justify-center">
								<div id="detail-phone" role="tabpanel" aria-label={DETAILS.find(d => d[0] === det)![1]} className="relative h-[694px] w-[330px] flex-none">
									<div className="absolute top-0 left-0 h-[866px] w-[412px] origin-top-left scale-[.8]">
										<PrismaApp key={det} isolated frame="phone" startView={det} theme="light" />
									</div>
								</div>
							</div>
						</div>
					</div>
				</section>

				{/* STORYBOARD */}
				<section id="storyboard" data-screen-label="Storyboard" className="bg-white px-5 py-[clamp(72px,10vw,120px)]">
					<div className="mx-auto max-w-[1180px]">
						<div data-reveal className="max-w-[720px]">
							<div className="text-[12px] font-semibold text-[#6e6e73]">Vídeo promocional · 1920 × 1080 · 30 fps · 10 s</div>
							<h2 className="mt-2 mb-3 text-[clamp(36px,5.5vw,56px)] leading-[1.07] font-semibold tracking-[-0.02em]">Da intenção à execução,<br />em cinco tempos.</h2>
							<p className="m-0 text-[17px] leading-[1.47] text-[#6e6e73]">Cada quadro é o próprio workflow do topo, congelado no instante indicado. O vídeo final segue a mesma linha do tempo — abra <Link href="/storyboard/render">o quadro 1920 × 1080</Link> para gravar.</p>
						</div>
						<div className="mt-10 grid grid-cols-[repeat(auto-fill,minmax(min(100%,340px),1fr))] gap-6">
							{FRAMES.map(([t, time, title, d]) => (
								<figure key={time} data-reveal className="m-0 flex flex-col gap-3">
									<div className="flex aspect-video items-center overflow-hidden rounded-[18px] border border-[#EAEAE8] bg-white" aria-hidden><div className="w-full"><Diagram t={t} id={'f' + t} /></div></div>
									<figcaption className="flex items-baseline gap-3"><span className="flex-none text-[12px] font-semibold text-accent tabular-nums">{time}</span>
										<span><span className="block text-[17px] font-semibold">{title}</span><span className="mt-0.5 block text-[14px] text-[#6e6e73]">{d}</span></span></figcaption>
								</figure>
							))}
						</div>
					</div>
				</section>

				{/* CLOSING */}
				<section data-screen-label="Fechamento" className="bg-warm px-5 py-[clamp(88px,12vw,160px)] text-center">
					<div data-reveal className="mx-auto max-w-[900px]">
						<div className="text-[19px] font-semibold">EXECUTAR</div>
						<h2 className="mt-2.5 mb-0 text-[clamp(40px,7vw,80px)] leading-[1.04] font-semibold tracking-[-0.025em] text-balance">O trabalho não mudou.<br />A maneira de enxergá-lo, sim.</h2>
						<p className="mx-auto mt-5 mb-0 max-w-[46ch] text-[17px] leading-[1.47] text-[#6e6e73]">As comparações mostram diferenças de clareza e organização. Não atribuímos resultados clínicos nem números que não medimos.</p>
						<div className="mt-7 flex flex-wrap justify-center gap-3">
							<Link href="/app" className="btn btn-primary min-h-11">Começar agora</Link>
							<Link href="/app/exportar?content=lorem" className="btn btn-secondary min-h-11">Ver modelos A4</Link>
						</div>
					</div>
				</section>
			</main>
			<footer className="border-t border-[#E3E2DE] p-5 text-[12px] text-[#6e6e73]">
				<div className="mx-auto flex max-w-[1180px] flex-wrap justify-between gap-3"><span>EXECUTAR · Conteúdo educativo. Não substitui avaliação clínica.</span><span>Risco Cognitivo</span></div>
			</footer>
		</div>
	);
}

function A4Sheets() {
	const sheets: [string, string][] = [['-4deg', '12px'], ['0deg', '0px'], ['4deg', '12px']];
	return (
		<div className="absolute inset-0 flex items-center justify-center gap-[clamp(8px,2vw,24px)] p-6" aria-hidden>
			{sheets.map(([rot, y], j) => (
				<div key={j} className="box-border grid aspect-[210/297] w-[clamp(90px,17vw,180px)] flex-none grid-rows-3 gap-[4%] rounded-[6px] bg-white p-[7%] shadow-[0_18px_40px_rgba(0,0,0,.12)]" style={{ transform: `rotate(${rot}) translateY(${y})` }}>
					{[0, 1, 2].map(k => {
						const st = (w: string, h: string, bg: string): CSSProperties => ({ height: h, width: w, borderRadius: 2, background: bg });
						return (
							<div key={k} className="flex flex-col gap-[6%] pt-[6%]" style={{ borderTop: k ? '1px dashed #d2d2d7' : 0 }}>
								<span style={st(['70%', '55%', '62%'][(j + k) % 3], '9%', '#1d1d1f')} />
								<span style={st('90%', '6%', '#d2d2d7')} />
								<span style={st(['60%', '75%', '50%'][(j + k) % 3], '6%', '#d2d2d7')} />
								<span style={st('40%', '6%', 'var(--color-accent)')} />
							</div>
						);
					})}
				</div>
			))}
		</div>
	);
}
