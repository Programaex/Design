'use client';
// Scroll Task (apps/scroll-task): one executable item in the centre, timer that never completes anything by itself,
// four scopes, swipe / wheel / buttons / ↑ ↓ navigation and a context drawer opened by button or double tap.
import * as C from '@executar/core';
import { useRef } from 'react';
import { Button, Icon, Switch, Tag } from '../ds';
import type { PrismaApp } from '../use-prisma-app';

const ST: Record<C.ItemStatus, [string, 'neutral' | 'success' | 'warning']> = { ready: ['Pronto', 'neutral'], done: ['Concluído', 'success'], deferred: ['Adiado', 'warning'] };

export function ExecutarTab({ app, plan }: { app: PrismaApp; plan: C.Plan }) {
	const { s, a } = app;
	const ex = s.exec, q = C.executionQueue(plan, ex.gran);
	const i = Math.min(ex.idx, Math.max(0, q.length - 1)), it = q[i], t = ex.timer;
	const left = C.timerLeft(t), running = t.state === 'running', up = t.state === 'time_up';
	const g = useRef({ acc: 0, lock: false, accT: 0 as unknown as ReturnType<typeof setTimeout>, ty: null as number | null });

	const onWheel = (e: React.WheelEvent) => {
		const w = g.current; if (w.lock) return;
		w.acc += e.deltaY; clearTimeout(w.accT); w.accT = setTimeout(() => { w.acc = 0; }, 220);
		if (Math.abs(w.acc) > 140) { const d = w.acc > 0 ? 1 : -1; w.acc = 0; w.lock = true; setTimeout(() => { w.lock = false; }, 700); a.execMove(d); }
	};
	const presets = [...C.PRESETS.map(m => ({ m, t: m + '′' })), { m: 1 / 6, t: '10″' }];
	const done = it?.status === 'done';
	const clockColor = up ? 'var(--color-danger)' : 'var(--color-text)';

	return (
		<div data-screen-label="Executar" className="relative flex h-full flex-col" onWheel={onWheel}
			onTouchStart={e => { g.current.ty = e.touches[0].clientY; }}
			onTouchEnd={e => { const ty = g.current.ty; if (ty == null) return; const dy = ty - e.changedTouches[0].clientY; g.current.ty = null; if (Math.abs(dy) > 80) a.execMove(dy > 0 ? 1 : -1); }}>
			<div className="relative flex flex-none flex-col gap-2 border-b border-divider px-4 pt-1 pb-2.5">
				<div className="flex items-center gap-2">
					<button type="button" onClick={() => a.up({ execMenu: !s.execMenu })} aria-expanded={s.execMenu} aria-haspopup="menu" aria-label="Escopo de execução"
						className="flex h-11 flex-none cursor-pointer items-center gap-1.5 rounded-full border-0 bg-surface px-3.5 text-[14px] text-text">
						<Icon name="dots-three" className="text-[18px]" />{C.GRANULARITY.find(x => x.id === ex.gran)!.t}
					</button>
					<span className="min-w-0 flex-1 truncate text-[15px] font-semibold">{plan.nome}</span>
					<span className="flex-none text-[14px] text-text-muted tabular-nums">{C.pendingCount(q)} pendentes</span>
				</div>
				{s.execMenu && (
					<div role="menu" className="absolute top-[52px] left-4 z-10 w-[220px] overflow-hidden rounded-md border border-divider bg-bg shadow-[var(--shadow-md)]">
						{C.GRANULARITY.map((x, k) => (
							<button key={x.id} type="button" role="menuitemradio" aria-checked={x.id === ex.gran}
								className="flex min-h-11 w-full cursor-pointer items-center justify-between border-0 bg-transparent px-3.5 text-left text-[15px] text-text"
								style={{ borderTop: `1px solid ${k ? 'var(--color-divider)' : 'transparent'}` }}
								onClick={() => { a.up({ execMenu: false }); if (x.id !== ex.gran) { a.setExec({ gran: x.id, idx: 0, ctx: false, timer: C.timerReady(ex.minutes) }); a.track('Escopo: ' + x.t); } }}>
								<span>{x.t}</span>{x.id === ex.gran && <Icon name="check" className="text-accent" />}
							</button>
						))}
					</div>
				)}
				<div className="flex items-center gap-1.5">
					{presets.map(p => {
						const on = Math.abs(ex.minutes - p.m) < 1e-6;
						return <button key={p.t} type="button" aria-pressed={on} onClick={() => a.setExec({ minutes: p.m, timer: C.timerReady(p.m) })}
							className="h-11 min-w-11 flex-none cursor-pointer rounded-full border-0 px-2 text-[13px] whitespace-nowrap"
							style={{ background: on ? 'var(--color-text)' : 'var(--color-surface)', color: on ? 'var(--color-bg)' : 'var(--color-text)' }}>{p.t}</button>;
					})}
					<span className="flex-1" />
					<span role="timer" aria-live="off" className="text-[17px] font-semibold tabular-nums" style={{ color: clockColor }}>{C.fmtClock(left)}</span>
					<button type="button" aria-label={running ? 'Pausar timer' : 'Iniciar timer'} onClick={() => a.setExec({ timer: running ? C.timerPause(t) : C.timerStart(up ? C.timerReady(ex.minutes) : t) })}
						className="grid h-11 w-11 flex-none cursor-pointer place-items-center rounded-full border-0 bg-accent text-[18px] text-white"><Icon name={running ? 'pause' : 'play'} /></button>
					<button type="button" aria-label="Reiniciar timer" onClick={() => a.setExec({ timer: C.timerReady(ex.minutes) })}
						className="grid h-11 w-11 flex-none cursor-pointer place-items-center rounded-full border-0 bg-surface text-[18px] text-text"><Icon name="arrow-counter-clockwise" /></button>
				</div>
				<div className="h-[3px] overflow-hidden rounded-full bg-surface"><div className="h-full" style={{ background: clockColor, width: Math.min(100, (1 - left / Math.max(1, t.minutes * 60000)) * 100) + '%' }} /></div>
			</div>

			<div className="no-scrollbar grid min-h-0 flex-1 grid-rows-[minmax(72px,1fr)_auto_minmax(120px,1fr)] overflow-auto px-5">
				<div className="flex min-w-0 flex-col items-center justify-end gap-1 pb-4">
					<span className="max-w-full truncate text-center text-[14px] text-text-muted">{q[i - 1]?.title ?? ''}</span>
					<button type="button" onClick={() => a.execMove(-1)} aria-label="Item anterior" className="h-11 w-11 cursor-pointer rounded-full border-0 bg-transparent text-[20px] text-text-muted" style={{ opacity: i > 0 ? 1 : 0.25 }}><Icon name="caret-up" /></button>
				</div>
				<div className="min-w-0">
					{!it && <div className="text-center text-[15px] text-text-muted">Nenhum item neste escopo.</div>}
					{it && (
						<div onDoubleClick={() => { a.setExec({ ctx: !ex.ctx }); if (!ex.ctx) a.track('Contexto aberto'); }} aria-live="polite" className="flex flex-col gap-3.5 border-y border-divider py-5">
							<div className="flex items-center gap-1.5 text-[12px] font-semibold text-text-muted">
								<span className="tabular-nums">{i + 1} / {q.length}</span><span>·</span><span>{C.GRANULARITY.find(x => x.id === it.type)!.t}</span>
								<span className="flex-1" />
								<Tag tone={(['accent', 'warning', 'neutral'] as const)[it.hz]}>{C.HZ[it.hz].nome}</Tag>
								<Tag tone={ST[it.status][1]}>{ST[it.status][0]}</Tag>
							</div>
							<h1 className="m-0 text-[32px] leading-[1.1] font-semibold tracking-[-0.015em] text-balance" style={{ color: done ? 'var(--color-text-muted)' : 'var(--color-text)', textDecoration: done ? 'line-through' : 'none' }}>{it.title}</h1>
							<div className="text-[14px] text-text-muted">{it.sub}</div>
							{up && (
								<div role="alert" className="flex flex-col gap-2.5 rounded-md bg-surface p-3">
									<div className="flex items-center gap-1.5 text-[15px] font-semibold text-danger"><Icon name="alarm" />Tempo previsto encerrado</div>
									<div className="grid grid-cols-2 gap-2">
										<Button block onClick={() => complete(it)}>Concluir</Button>
										<Button variant="secondary" block onClick={() => a.setExec({ timer: C.timerStart(C.timerReady(5)) })}>+5 min</Button>
										<Button variant="secondary" block onClick={() => { if (it.status !== 'deferred') a.mutate(p => C.deferItem(p, it.id), 'Item adiado'); a.execMove(1); }}>Adiar</Button>
										<Button variant="secondary" block onClick={() => a.execMove(1)}>Próxima</Button>
									</div>
								</div>
							)}
							<div className="grid grid-cols-3 gap-2">
								<Button block onClick={() => complete(it)}>{done ? 'Desfazer' : 'Concluir'}</Button>
								<Button variant="secondary" block aria-expanded={ex.ctx} onClick={() => { a.setExec({ ctx: !ex.ctx }); if (!ex.ctx) a.track('Contexto aberto'); }}>{ex.ctx ? 'Fechar' : 'Contexto'}</Button>
								<Button variant="ghost" block onClick={() => a.mutate(p => C.deferItem(p, it.id), it.status === 'deferred' ? 'Item retomado' : 'Item adiado')}>{it.status === 'deferred' ? 'Retomar' : 'Adiar'}</Button>
							</div>
							{ex.ctx && (
								<div className="flex flex-col gap-3 rounded-md bg-surface p-3.5">
									<div><div className="text-[12px] font-semibold text-text-muted">{it.type === 'action' || it.type === 'task' ? 'Prova de conclusão' : 'Entregáveis'}</div><div className="mt-0.5 text-[15px] leading-[1.43]">{it.context}</div></div>
									<div><div className="text-[12px] font-semibold text-text-muted">Progresso</div><div className="mt-0.5 text-[15px]">{it.d} de {it.n} tarefas feitas</div></div>
									<label className="flex flex-col gap-1.5"><span className="text-[12px] font-semibold text-text-muted">Nota</span>
										<textarea value={it.notes} rows={3} placeholder="O que ficou pendente ou bloqueado?"
											onChange={e => { const v = e.target.value; a.up(st => (st.plan ? { plan: C.setNote(st.plan, it.id, v) } : {})); }}
											onBlur={() => { if (it.notes) a.track('Nota registrada'); }}
											className="box-border w-full resize-y rounded-md border border-divider bg-bg px-3 py-2.5 text-[15px] text-text" />
									</label>
								</div>
							)}
						</div>
					)}
				</div>
				<div className="flex min-w-0 flex-col items-center gap-1 pt-4">
					<button type="button" onClick={() => a.execMove(1)} aria-label="Próximo item" className="h-11 w-11 cursor-pointer rounded-full border-0 bg-transparent text-[20px] text-text-muted" style={{ opacity: i < q.length - 1 ? 1 : 0.25 }}><Icon name="caret-down" /></button>
					<span className="max-w-full truncate text-center text-[14px] text-text-muted">{q[i + 1]?.title ?? ''}</span>
					<div className="mt-auto flex items-center gap-2.5 pt-3 pb-2">
						<span className="text-[14px] text-text-muted">Auto-scroll</span>
						<Switch label="Auto-scroll" on={ex.auto} onToggle={() => { a.setExec({ auto: !ex.auto }); a.track(ex.auto ? 'Auto-scroll desligado' : 'Auto-scroll ligado'); }} />
					</div>
					<span className="pb-3 text-center text-[12px] text-text-muted">Deslize, use a roda ou ↑ ↓. Duplo toque abre o contexto.</span>
				</div>
			</div>
		</div>
	);

	function complete(item: C.ExecItem) {
		const isDone = item.status === 'done';
		a.mutate(p => C.setItemDone(p, item, !isDone), isDone ? 'Conclusão desfeita' : 'Item concluído');
		if (!isDone) { a.say('Concluído'); if (up) a.setExec({ timer: C.timerReady(ex.minutes) }); }
	}
}
