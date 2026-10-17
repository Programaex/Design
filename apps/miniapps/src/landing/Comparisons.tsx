// The three comparators of the EXECUTAR wireframes. Each one shows the *same* content in both states.
import type { ReactNode } from 'react';
import { ComparisonSlider } from './ComparisonSlider';

const OBJETIVO = 'Publicar uma landing page para captação de leads até sexta-feira, às 17h.';

function SectionHead({ num, title, lead, tags }: { num: string; title: ReactNode; lead: string; tags: string[] }) {
	return (
		<div data-reveal className="flex flex-wrap items-end justify-between gap-6">
			<div className="max-w-[640px]">
				<div className="text-[12px] font-semibold text-[#6e6e73]">{num}</div>
				<h2 className="mt-2 mb-3 text-[clamp(36px,5.5vw,56px)] leading-[1.07] font-semibold tracking-[-0.02em]">{title}</h2>
				<p className="m-0 text-[17px] leading-[1.47] text-[#6e6e73]">{lead}</p>
			</div>
			<div className="flex flex-wrap gap-2">{tags.map(t => <span key={t} className="tag tag-outline">{t}</span>)}</div>
		</div>
	);
}
const Section = ({ id, label, children }: { id?: string; label: string; children: ReactNode }) => (
	<section id={id} data-screen-label={label} className="border-t border-[#E3E2DE] px-5 py-[clamp(72px,10vw,120px)]">
		<div className="mx-auto max-w-[1180px]">{children}</div>
	</section>
);
const Card = ({ children, max = 620 }: { children: ReactNode; max?: number }) => (
	<div className="mx-auto rounded-[18px] bg-white p-[clamp(16px,2.5vw,28px)] shadow-[0_10px_30px_rgba(29,29,31,.06)]" style={{ maxWidth: max }}>{children}</div>
);
const ObjHead = ({ kicker, tag, tone }: { kicker: string; tag: string; tone: 'accent' | 'neutral' }) => (
	<div className="flex items-start justify-between gap-3 border-b border-[#EAEAE8] pb-3.5">
		<div><div className="text-[11px] font-semibold text-[#6e6e73]">{kicker}</div><div className="mt-1 text-[clamp(15px,1.6vw,17px)] leading-[1.35] font-semibold">{OBJETIVO}</div></div>
		<span className={'tag tag-' + tone + ' flex-none'}>{tag}</span>
	</div>
);

const TASKS_BEFORE: [string, string, string][] = [['Ver os textos', '0 0 6px 0', '-0.6deg'], ['Mexer no visual', '4px 0 10px 42px', '0.8deg'], ['Checar cadastro', '0 0 4px 12px', '-1.2deg'], ['Falar com a equipe', '8px 0 8px 70px', '0.5deg'], ['Colocar no ar', '2px 0 0 24px', '-0.4deg']];
const TASKS_AFTER: [string, string, string][] = [['Revisar', 'título, proposta de valor e CTA', '10h'], ['Ajustar', 'espaçamento e contraste visual', '12h'], ['Testar', 'três envios do formulário', '14h'], ['Solicitar', 'aprovação ao responsável', '16h'], ['Publicar', 'a página e verificar a URL', '17h']];

export function TasksComparison({ initial }: { initial?: number }) {
	return (
		<Section id="comparar" label="Comparar tarefas">
			<SectionHead num="02 · Tarefas e objetivos" title={<>O mesmo objetivo.<br />Próximas ações mais claras.</>} lead="Compare cinco intenções vagas com as mesmas cinco ações descritas com verbo, critério de conclusão e prazo." tags={['SMART', 'Verbos de ação', 'Próximos passos']} />
			<div data-reveal className="mt-8">
				<ComparisonSlider initial={initial} title="Publicar landing de leads até sexta, 17h" dot="var(--color-accent)" hint="Arraste o divisor para comparar" ariaLabel="Comparar estrutura das tarefas" beforeLabel="Antes · vago" afterLabel="Depois · ação"
					after={<Card><ObjHead kicker="Objetivo · SMART" tag="Plano estruturado" tone="accent" />
						<ol className="mt-3.5 flex list-none flex-col gap-2 p-0">
							{TASKS_AFTER.map(([verb, rest, time], i) => (
								<li key={verb} className="flex min-h-12 items-center gap-3 rounded-md bg-[#F5F5F7] px-3 text-[clamp(14px,1.5vw,15px)]">
									<span className="w-[22px] flex-none text-[12px] font-semibold text-accent tabular-nums">0{i + 1}</span>
									<span className="min-w-0 flex-1 leading-[1.35]"><strong className="font-semibold">{verb}</strong> {rest}</span>
									<span className="flex-none rounded-full bg-white px-2.5 py-[3px] text-[12px] font-semibold tabular-nums">{time}</span>
								</li>
							))}
						</ol>
						<div className="mt-3.5 text-[13px] text-[#6e6e73]">Critério de execução: resultado observável e prazo para cada ação.</div></Card>}
					before={<Card><ObjHead kicker="Objetivo · sem planejamento" tag="Rascunho" tone="neutral" />
						<ul className="mt-3.5 flex list-none flex-col p-0">
							{TASKS_BEFORE.map(([t, m, rot]) => (
								<li key={t} className="flex min-h-10 w-fit items-center gap-2.5 rounded-sm border border-[#EAEAE8] px-3 text-[14px] text-[#6e6e73]" style={{ margin: m, transform: `rotate(${rot})` }}>
									<span className="h-3.5 w-3.5 rounded-full border-[1.5px] border-[#c7c7cc]" />{t}
								</li>
							))}
						</ul>
						<div className="mt-3.5 text-[13px] text-[#6e6e73]">Sem critério claro de conclusão nem prazo individual.</div></Card>} />
			</div>
		</Section>
	);
}

const ENV_CHAOS: [string, string, string, string, string][] = [['Notificação', 'Reunião · 15h', '6%', '8%', '-3deg'], ['Mensagem', 'Resposta ao cliente', '58%', '2%', '2.5deg'], ['Lembrete', 'Publicação da landing', '34%', '34%', '-1.5deg'], ['Pendência', 'Revisão de texto', '64%', '58%', '3deg'], ['Verificação', 'Teste do formulário', '4%', '64%', '1.5deg']];
const ENV_GROUPS = [
	{ h: '01 · Foco agora', bg: '#EAF2FE', fg: '#0058B0', items: [['Publicação da landing', 'Principal entrega'], ['Teste do formulário', 'Checagem necessária']] },
	{ h: '02 · Em seguida', bg: '#F5F5F7', fg: '#6e6e73', items: [['Revisão de texto', 'Conteúdo'], ['Reunião · 15h', 'Alinhamento']] },
	{ h: '03 · Referência', bg: '#F5F5F7', fg: '#6e6e73', items: [['Resposta ao cliente', 'Mensagem']] }
];
const PanelHead = ({ t }: { t: string }) => <div className="flex justify-between border-b border-[#EAEAE8] px-1 pb-3 text-[13px] font-semibold">{t}<span className="tracking-[2px] text-[#c7c7cc]" aria-hidden>•••</span></div>;

export function EnvironmentComparison({ initial }: { initial?: number }) {
	return (
		<Section label="Comparar ambiente">
			<SectionHead num="03 · Ambiente de informação" title={<>Mesmo conteúdo.<br />Menos disputa por atenção.</>} lead="Cinco sinais idênticos, duas formas de apresentar: tudo concorre pela atenção ou é agrupado por momento de uso." tags={['Agrupamento', 'Hierarquia', 'Foco']} />
			<div data-reveal className="mt-8">
				<ComparisonSlider initial={initial} title="Painel de trabalho · cinco informações" dot="#7567DA" hint="Os dados são iguais nos dois estados" ariaLabel="Comparar organização visual do ambiente" beforeLabel="Antes · disperso" afterLabel="Depois · agrupado"
					after={<Card max={760}><PanelHead t="Visão de trabalho · organizada" />
						<div className="mt-3 grid min-h-[250px] grid-cols-[repeat(auto-fit,minmax(150px,1fr))] gap-2.5">
							{ENV_GROUPS.map(g => (
								<div key={g.h} className="flex flex-col gap-2 rounded-md p-3" style={{ background: g.bg }}>
									<div className="text-[11px] font-semibold" style={{ color: g.fg }}>{g.h}</div>
									{g.items.map(([t, s]) => <div key={t} className="rounded-sm bg-white px-3 py-2.5 text-[14px] font-semibold shadow-[0_1px_2px_rgba(0,0,0,.05)]">{t}<span className="mt-0.5 block text-[12px] font-normal text-[#6e6e73]">{s}</span></div>)}
								</div>
							))}
						</div></Card>}
					before={<Card max={760}><PanelHead t="Visão de trabalho · sem agrupamento" />
						<div className="relative mt-3 min-h-[250px]">
							{ENV_CHAOS.map(([k, t, x, y, rot]) => (
								<div key={t} className="absolute box-border w-[clamp(130px,30%,200px)] rounded-[10px] bg-white px-3 py-2.5 shadow-[0_8px_20px_rgba(29,29,31,.12)]" style={{ left: x, top: y, transform: `rotate(${rot})` }}>
									<span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-[#E5533D]" />
									<div className="text-[10px] font-semibold text-[#6e6e73]">{k}</div>
									<div className="mt-0.5 text-[14px] font-semibold">{t}</div>
								</div>
							))}
						</div></Card>} />
			</div>
		</Section>
	);
}

const DOC_STEPS: [string, string][] = [['Revisar', 'título, proposta de valor e CTA.'], ['Ajustar', 'espaçamento e contraste.'], ['Testar', 'três envios do formulário.'], ['Solicitar', 'aprovação do responsável.'], ['Publicar', 'até sexta, às 17h, e verificar a URL.']];

export function DocumentComparison({ initial }: { initial?: number }) {
	const sheet = 'mx-auto box-border min-h-[340px] max-w-[560px] bg-white p-[clamp(20px,3.5vw,40px)] shadow-[0_10px_30px_rgba(29,29,31,.08)]';
	return (
		<Section label="Comparar documento">
			<SectionHead num="04 · Documento" title={<>Mesmo texto.<br />Outra experiência de leitura.</>} lead="O conteúdo não desaparece: ele ganha estrutura, ritmo visual, marcadores consistentes e ênfase nas etapas." tags={['Leitura segmentada', 'Cores funcionais', 'Acessibilidade']} />
			<div data-reveal className="mt-8">
				<ComparisonSlider initial={initial} title="Checklist de publicação · mesmo conteúdo" dot="#E78B67" hint="Texto idêntico em outra hierarquia" ariaLabel="Comparar formatação do documento" beforeLabel="Antes · denso" afterLabel="Depois · estruturado"
					after={<article className={sheet}>
						<span className="text-[11px] font-semibold text-accent">Guia operacional · publicação</span>
						<h3 className="mt-2 mb-1 text-[clamp(22px,2.6vw,28px)] font-semibold tracking-[-0.01em]">Checklist de publicação</h3>
						<div className="text-[15px] text-[#6e6e73]">Cinco verificações antes de publicar a página.</div>
						<ol className="mt-5 flex list-none flex-col gap-2.5 p-0">
							{DOC_STEPS.map(([verb, rest], i) => (
								<li key={verb} className="flex items-baseline gap-3 rounded-md px-3 py-2.5 text-[16px] leading-[1.5]" style={{ background: i === 4 ? '#EAF2FE' : '#F5F5F7' }}>
									<span className="flex-none text-[12px] font-semibold tabular-nums" style={{ color: i === 4 ? '#0058B0' : 'var(--color-accent)' }}>0{i + 1}</span>
									<span><strong className="font-semibold">{verb}</strong> {rest}</span>
								</li>
							))}
						</ol>
					</article>}
					before={<article className={sheet}>
						<div className="text-[15px] font-semibold">Checklist de publicação</div>
						<p className="mt-1.5 mb-0 text-justify font-[Georgia,'Times_New_Roman',serif] text-[12.5px] leading-[1.28] text-[#3a3a3c]">Checklist de publicação. Cinco verificações antes de publicar a página. Revisar título, proposta de valor e CTA. Ajustar espaçamento e contraste. Testar três envios do formulário. Solicitar aprovação do responsável. Publicar até sexta, às 17h, e verificar a URL.</p>
					</article>} />
			</div>
		</Section>
	);
}
