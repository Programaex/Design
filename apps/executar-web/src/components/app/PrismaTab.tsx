'use client';
import * as C from '@executar/core';
import { Check, Icon, ProgressBar, Tag } from '../ds';
import type { PrismaApp } from '@/lib/use-prisma-app';

export const isOpen = (open: Record<string, boolean>, k: string, def: boolean) => (k in open ? open[k] : def);

export function TaskRow({ app, plan, t, e, today }: { app: PrismaApp; plan: C.Plan; t: C.Task; e: C.Deliverable; today: string }) {
	const { a } = app;
	const st = C.statusOf(plan, t, e.hz, today);
	return (
		<div className="flex min-h-12 items-center gap-1 rounded-md bg-bg px-1">
			<button type="button" onClick={() => a.mutate(p => C.toggleTask(p, t.id), t.done ? 'Tarefa reaberta' : 'Tarefa concluída')} aria-pressed={t.done} aria-label="Marcar tarefa"
				className="grid h-11 w-11 flex-none cursor-pointer place-items-center border-0 bg-transparent p-0"><Check done={t.done} /></button>
			<button type="button" className="min-w-0 flex-1 cursor-text border-0 bg-transparent py-1.5 text-left text-[15px] leading-[1.35]"
				style={{ color: t.done ? 'var(--color-text-muted)' : 'var(--color-text)', textDecoration: t.done ? 'line-through' : 'none' }}
				onClick={() => a.openSheet({ kind: 'rename', taskId: t.id, title: 'Editar tarefa', inputLabel: 'Tarefa', placeholder: 'Deixe vazio para remover', cta: 'Salvar' }, C.taskText(t, plan.lang))}>
				{C.taskText(t, plan.lang)}
			</button>
			<Tag tone={st.tone} className="flex-none whitespace-nowrap">{st.label}</Tag>
			<button type="button" aria-label="Remover tarefa" onClick={() => { a.mutate(p => C.removeTask(p, t.id), 'Tarefa removida'); a.say('Tarefa removida'); }}
				className="h-11 w-9 flex-none cursor-pointer border-0 bg-transparent text-[16px] text-text-muted"><Icon name="trash" /></button>
		</div>
	);
}

export function PrismaTab({ app, plan }: { app: PrismaApp; plan: C.Plan }) {
	const { s, a } = app;
	const lang = plan.lang, L = (p: string, e: string) => lang === 'e' ? e : p;
	const today = C.todayISO(), all = C.prog(plan.ents), late = C.lateCount(plan, today);
	const stats = [
		{ label: 'Entregáveis', value: plan.ents.length, note: C.groupsUsed(plan).length + ' grupos', color: 'var(--color-text)' },
		{ label: L('Tarefas feitas', 'Ações concluídas'), value: all.d + '/' + all.n, note: 'no total', color: 'var(--color-text)' },
		{ label: 'Concluído', value: C.pct(all) + '%', note: 'do plano', color: 'var(--color-text)' },
		{ label: 'Em atraso', value: late, note: late ? L('pedem nova data', 'pedem reprevisão') : 'tudo no prazo', color: late ? 'var(--color-danger)' : 'var(--color-text)' }
	];
	return (
		<div data-screen-label="Prisma" className="px-4 pt-1 pb-8">
			<div className="text-[12px] font-semibold text-text-muted">{plan.nome} · {C.fmt(plan.inicio)} → {C.fmt(C.endDate(plan))}</div>
			<h1 className="mt-1 mb-1.5 text-[34px] leading-[1.08] font-semibold tracking-[-0.015em]">Agora, próximo<br />e depois.</h1>
			<p className="m-0 text-[15px] leading-[1.47] text-text-muted">{L('Comece pelo que vence primeiro. Toque no texto de uma tarefa para editar.', 'Priorize o caminho crítico. Toque em uma ação para editar.')}</p>
			<div className="mt-5 grid grid-cols-2 gap-2">
				{stats.map(st => (
					<div key={st.label} className="rounded-lg bg-surface px-4 py-3.5">
						<div className="text-[12px] text-text-muted">{st.label}</div>
						<div className="mt-1 text-[28px] font-semibold tracking-[-0.02em] tabular-nums" style={{ color: st.color }}>{st.value}</div>
						<div className="text-[12px] text-text-muted">{st.note}</div>
					</div>
				))}
			</div>
			<div className="mt-8 flex flex-col gap-7">
				{C.HZ.map((h, i) => {
					const es = plan.ents.filter(e => e.hz === i), pr = C.prog(es), k = 'h:' + i, open = isOpen(s.open, k, true);
					return (
						<section key={i}>
							<button type="button" onClick={() => a.toggleOpen(k, true)} aria-expanded={open} className="flex w-full cursor-pointer items-end gap-3 border-0 bg-transparent p-0 text-left text-text">
								<span className="min-w-0 flex-1">
									<span className="block text-[12px] font-semibold text-text-muted">{String(i + 1).padStart(2, '0')} · {h.nome} · {C.fmt(C.hzDate(plan, i))}</span>
									<span className="mt-0.5 block text-[21px] font-semibold tracking-[-0.01em]">{h.tit[lang]}</span>
								</span>
								<span className="flex-none text-[14px] text-text-muted tabular-nums">{pr.d}/{pr.n}</span>
								<Icon name="caret-down" className="mb-[3px] flex-none text-[16px] text-text-muted transition-transform duration-200" style={{ transform: `rotate(${open ? 0 : -90}deg)` }} />
							</button>
							<ProgressBar className="mt-2.5" pct={C.pct(pr)} />
							{open && (
								<div className="mt-3 flex flex-col gap-2">
									{!es.length && <div className="py-2 text-[14px] text-text-muted">Nenhum entregável neste horizonte.</div>}
									{es.map(e => {
										const ep = C.prog([e]), ek = 'e:' + e.id, eo = isOpen(s.open, ek, false);
										return (
											<div key={e.id} className="overflow-hidden rounded-lg bg-surface">
												<button type="button" onClick={() => a.toggleOpen(ek, false)} aria-expanded={eo} className="flex min-h-14 w-full cursor-pointer items-center gap-2.5 border-0 bg-transparent px-4 py-3 text-left text-text">
													<span className="h-2 w-2 flex-none rounded-full" style={{ background: C.GROUPS[e.grupo].color }} />
													<span className="min-w-0 flex-1"><span className="block text-[12px] text-text-muted">{C.GROUPS[e.grupo].nome}</span><span className="block text-[17px] font-semibold tracking-[-0.022em]">{e.titulo}</span></span>
													<span className="text-[14px] text-text-muted tabular-nums">{ep.d}/{ep.n}</span>
													<Icon name="caret-right" className="text-[14px] text-text-muted transition-transform duration-200" style={{ transform: `rotate(${eo ? 90 : 0}deg)` }} />
												</button>
												{eo && (
													<div className="flex flex-col gap-1.5 px-3 pb-3.5">
														<div className="mb-1 rounded-md bg-bg px-3 py-2.5">
															<div className="text-[12px] font-semibold text-text-muted">{L('Prova de conclusão', 'Evidência de conclusão')}</div>
															<div className="mt-0.5 text-[14px] leading-[1.43]">{C.provaText(e, lang)}</div>
														</div>
														{e.tarefas.map(t => <TaskRow key={t.id} app={app} plan={plan} t={t} e={e} today={today} />)}
														<button type="button" className="flex h-11 cursor-pointer items-center gap-1.5 border-0 bg-transparent px-2 text-[15px] text-link"
															onClick={() => a.openSheet({ kind: 'add', entId: e.id, title: L('Nova tarefa', 'Nova ação'), desc: e.titulo, inputLabel: 'Tarefa', placeholder: 'O que precisa ser feito?', cta: 'Adicionar' })}>
															<Icon name="plus" />{L('Adicionar tarefa', 'Incluir ação')}
														</button>
													</div>
												)}
											</div>
										);
									})}
								</div>
							)}
						</section>
					);
				})}
			</div>
			<div className="mt-8 rounded-lg bg-surface p-4">
				<div className="text-[12px] font-semibold text-text-muted">Pergunta de controle</div>
				<div className="mt-1 text-[15px] leading-[1.47]">A prova de conclusão existe? Se não existe, o entregável ainda não terminou.</div>
			</div>
		</div>
	);
}

export function MapaTab({ app, plan }: { app: PrismaApp; plan: C.Plan }) {
	const { s, a } = app;
	const all = C.prog(plan.ents);
	return (
		<div data-screen-label="Mapa mental" className="px-4 pt-1 pb-8">
			<h1 className="mt-1 mb-1.5 text-[34px] leading-[1.08] font-semibold tracking-[-0.015em]">Mapa mental</h1>
			<p className="m-0 text-[15px] text-text-muted">Toque em um nó para abrir o próximo nível.</p>
			<div className="mt-3 mb-5 flex gap-1">
				<button type="button" className="btn btn-secondary btn-sm" onClick={() => a.setAll(true)}>Abrir tudo</button>
				<button type="button" className="btn btn-ghost btn-sm" onClick={() => a.setAll(false)}>Fechar tudo</button>
			</div>
			<div className="rounded-lg bg-section p-4 text-on-section">
				<div className="text-[12px] opacity-70">Mapa de trabalho</div>
				<div className="mt-0.5 text-[21px] font-semibold">{plan.nome}</div>
				<div className="mt-1 text-[12px] opacity-70">{C.fmt(plan.inicio)} → {C.fmt(C.endDate(plan))} · {all.d}/{all.n} feitas</div>
				<ProgressBar className="mt-2.5" pct={C.pct(all)} color="var(--color-on-section)" track="var(--color-section-ghost)" />
			</div>
			<div className="ml-5 flex flex-col gap-2.5 border-l-2 border-divider pt-3 pl-4">
				{C.groupsUsed(plan).map(g => {
					const es = plan.ents.filter(e => e.grupo === g), pr = C.prog(es), k = 'g:' + g, open = isOpen(s.open, k, true);
					return (
						<div key={g} className="relative">
							<span className="absolute top-7 -left-4 w-3.5 border-t-2 border-divider" />
							<button type="button" onClick={() => a.toggleOpen(k, true)} aria-expanded={open} className="flex w-full cursor-pointer items-center gap-2.5 rounded-lg border border-divider bg-bg px-3.5 py-3 text-left text-text">
								<span className="relative grid h-8 w-8 flex-none place-items-center rounded-sm bg-surface text-[16px]">
									<Icon name={C.GROUPS[g].ic} />
									<span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-bg" style={{ background: C.GROUPS[g].color }} />
								</span>
								<span className="min-w-0 flex-1"><span className="block text-[17px] font-semibold">{C.GROUPS[g].nome}</span><span className="block text-[12px] text-text-muted">{es.length} entregáveis · {C.pct(pr)}%</span></span>
								<Icon name="caret-right" className="text-[14px] text-text-muted transition-transform duration-200" style={{ transform: `rotate(${open ? 90 : 0}deg)` }} />
							</button>
							{open && (
								<div className="ml-5 flex flex-col gap-2 border-l-2 border-divider pt-2 pl-3.5">
									{es.map(e => {
										const ep = C.prog([e]), dk = 'd:' + e.id, eo = isOpen(s.open, dk, false);
										return (
											<div key={e.id} className="relative">
												<span className="absolute top-6 -left-3.5 w-3 border-t-2 border-divider" />
												<button type="button" onClick={() => a.toggleOpen(dk, false)} aria-expanded={eo} className="block w-full cursor-pointer rounded-md border-0 bg-surface px-3 py-2.5 text-left text-text">
													<span className="flex items-center justify-between gap-2"><Tag tone={(['accent', 'warning', 'neutral'] as const)[e.hz]}>{C.HZ[e.hz].nome} · {C.fmt(C.hzDate(plan, e.hz))}</Tag><span className="text-[12px] text-text-muted">{ep.d}/{ep.n}</span></span>
													<span className="mt-1.5 block text-[15px] font-semibold">{e.titulo}</span>
													<ProgressBar className="mt-2" height={3} pct={C.pct(ep)} track="var(--color-divider)" />
												</button>
												{eo && (
													<div className="ml-4 flex flex-col gap-1.5 border-l-2 border-divider pt-1.5 pl-3">
														{e.tarefas.map(t => (
															<button key={t.id} type="button" onClick={() => a.mutate(p => C.toggleTask(p, t.id), t.done ? 'Tarefa reaberta' : 'Tarefa concluída')}
																className="flex min-h-11 w-full cursor-pointer items-center gap-2 rounded-md border border-divider bg-bg py-1 pr-2.5 pl-1.5 text-left text-text">
																<Check done={t.done} size={20} />
																<span className="min-w-0 flex-1 text-[14px] leading-[1.35]" style={{ color: t.done ? 'var(--color-text-muted)' : 'var(--color-text)', textDecoration: t.done ? 'line-through' : 'none' }}>{C.taskText(t, plan.lang)}</span>
															</button>
														))}
														<div className="rounded-md border border-dashed border-divider px-2.5 py-2"><div className="text-[12px] font-semibold text-text-muted">Prova</div><div className="mt-0.5 text-[13px] leading-[1.4]">{C.provaText(e, plan.lang)}</div></div>
													</div>
												)}
											</div>
										);
									})}
								</div>
							)}
						</div>
					);
				})}
			</div>
		</div>
	);
}
