'use client';
import * as C from '@executar/core';
import { useEffect, useRef } from 'react';
import { Button, Icon, ProgressBar, SegmentedControl, TextField } from '../ds';
import type { PrismaApp } from '@/lib/use-prisma-app';

interface Opt { key: string; t: string; s: string; on: boolean; onClick: () => void; ic?: string; color?: string }

export function Wizard({ app }: { app: PrismaApp }) {
	const { s, a } = app;
	const st = C.STEPS[s.step], su = s.setup;
	const scRef = useRef<HTMLDivElement>(null);
	useEffect(() => { if (scRef.current) scRef.current.scrollTop = 0; }, [s.step]);

	const choose = <T extends string | number>(list: C.Choice<T>[], key: 'periodo' | 'energia' | 'lang'): Opt[] => list.map(o => ({
		key: String(o.id), t: o.t, s: o.s, on: su[key] === o.id, onClick: () => a.setSetup(x => ({ ...x, [key]: o.id }))
	}));
	const multi = (ids: string[], key: 'grupos' | 'rotinas', meta: (id: string) => { t: string; s: string; ic?: string; color?: string }): Opt[] => ids.map(id => {
		const on = (su[key] as string[]).includes(id);
		return { key: id, ...meta(id), on, onClick: () => a.setSetup(x => {
			const arr = on ? (x[key] as string[]).filter(k => k !== id) : [...(x[key] as string[]), id];
			const nx = { ...x, [key]: arr } as C.Setup;
			if (key === 'grupos') nx.ents = x.ents.filter(e => arr.includes(e.grupo));
			return nx;
		}) };
	});
	let opts: Opt[] = [];
	if (st.id === 'periodo') opts = choose(C.PERIODOS, 'periodo');
	if (st.id === 'energia') opts = choose(C.ENERGIA, 'energia');
	if (st.id === 'lang') opts = choose(C.LANGS, 'lang');
	if (st.id === 'grupos') opts = multi(C.GKEYS, 'grupos', g => ({ t: C.GROUPS[g as C.GroupKey].nome, s: C.GROUPS[g as C.GroupKey].desc, ic: C.GROUPS[g as C.GroupKey].ic, color: C.GROUPS[g as C.GroupKey].color }));
	if (st.id === 'rotinas') opts = multi(C.ROT_KEYS, 'rotinas', k => ({ t: C.ROT[k as C.RoutineKey].n.p, s: C.ROT[k as C.RoutineKey].w + ' · ' + C.ROT[k as C.RoutineKey].d.p }));

	const addEnt = (g: C.GroupKey) => {
		const t = (s.drafts[g] || '').trim(); if (!t) return;
		a.up({ drafts: { ...s.drafts, [g]: '' } });
		a.setSetup(x => x.ents.some(e => e.grupo === g && e.titulo.toLowerCase() === t.toLowerCase()) ? x : { ...x, ents: [...x.ents, { id: C.uid(), titulo: t, grupo: g, hz: null }] });
	};
	const last = s.step === C.STEPS.length - 1;

	return (
		<div data-screen-label="Questionário" className="flex min-h-0 flex-1 flex-col">
			<div className="flex flex-none items-center gap-2 px-3 pt-1">
				<button type="button" onClick={() => s.step > 0 && a.up({ step: s.step - 1, err: '' })} aria-label="Voltar" className="grid h-11 w-11 cursor-pointer place-items-center border-0 bg-transparent text-[22px] text-link" style={{ opacity: s.step ? 1 : 0.3 }}><Icon name="caret-left" /></button>
				<span className="flex-1 text-center text-[14px] text-text-muted">Pergunta {s.step + 1} de {C.STEPS.length}</span>
				<button type="button" onClick={() => a.up({ screen: 'app', err: '' })} className="h-11 min-w-11 cursor-pointer border-0 bg-transparent text-[17px] text-link" style={{ visibility: s.plan ? 'visible' : 'hidden' }}>Fechar</button>
			</div>
			<ProgressBar className="mx-5 mt-1.5 flex-none" pct={(s.step + 1) / C.STEPS.length * 100} />
			<div ref={scRef} className="no-scrollbar flex-1 overflow-auto px-5 py-6">
				<h1 className="m-0 mb-2 text-[28px] leading-[1.14] font-semibold tracking-[-0.01em]">{st.q}</h1>
				<p className="m-0 mb-6 text-[17px] leading-[1.47] text-text-muted">{st.h}</p>

				{st.id === 'nome' && (
					<TextField label="Nome do plano" placeholder="Ex.: Lançamento do blog" maxLength={60} value={su.nome} autoFocus
						onChange={e => { const v = e.target.value; a.setSetup(x => ({ ...x, nome: v })); }} onKeyDown={e => { if (e.key === 'Enter') a.next(); }} />
				)}

				{opts.length > 0 && (
					<div className="flex flex-col gap-2">
						{opts.map(o => (
							<button key={o.key} type="button" onClick={o.onClick} aria-pressed={o.on}
								className="box-border flex min-h-16 w-full cursor-pointer items-center gap-3.5 rounded-md bg-surface px-4 py-3 text-left text-text"
								style={{ border: `2px solid ${o.on ? 'var(--color-accent)' : 'transparent'}` }}>
								{o.ic && (
									<span className="relative grid h-8 w-8 flex-none place-items-center rounded-sm bg-bg text-[17px]">
										<Icon name={o.ic} />
										<span className="absolute -right-0.5 -bottom-0.5 h-2.5 w-2.5 rounded-full border-2 border-surface" style={{ background: o.color }} />
									</span>
								)}
								<span className="min-w-0 flex-1"><span className="block text-[17px] font-semibold tracking-[-0.022em]">{o.t}</span><span className="mt-0.5 block text-[14px] text-text-muted">{o.s}</span></span>
								<Icon name={o.on ? 'check-circle' : 'circle'} className="flex-none text-[22px]" style={{ color: o.on ? 'var(--color-accent)' : 'var(--color-neutral-300)' }} />
							</button>
						))}
					</div>
				)}

				{st.id === 'ents' && (
					<div className="flex flex-col gap-3">
						{su.grupos.map(g => {
							const list = C.SUG[g].slice();
							su.ents.filter(e => e.grupo === g && !list.includes(e.titulo)).forEach(e => list.push(e.titulo));
							return (
								<div key={g} className="rounded-lg bg-surface p-4">
									<div className="flex items-center gap-2 text-[14px] font-semibold"><span className="h-2 w-2 rounded-full" style={{ background: C.GROUPS[g].color }} />{C.GROUPS[g].nome}</div>
									<div className="mt-3 flex flex-wrap gap-2">
										{list.map(t => {
											const on = su.ents.some(e => e.grupo === g && e.titulo === t);
											return (
												<button key={t} type="button" aria-pressed={on} className="min-h-9 cursor-pointer rounded-full border border-divider px-3.5 text-[14px]"
													style={{ background: on ? 'var(--color-text)' : 'var(--color-bg)', color: on ? 'var(--color-bg)' : 'var(--color-text)' }}
													onClick={() => a.setSetup(x => ({ ...x, ents: on ? x.ents.filter(e => !(e.grupo === g && e.titulo === t)) : [...x.ents, { id: C.uid(), titulo: t, grupo: g, hz: null }] }))}>{t}</button>
											);
										})}
									</div>
									<div className="mt-3 flex gap-2">
										<input value={s.drafts[g] || ''} onChange={e => a.up({ drafts: { ...s.drafts, [g]: e.target.value } })} onKeyDown={e => { if (e.key === 'Enter') addEnt(g); }}
											placeholder="Outro entregável…" maxLength={70} aria-label="Novo entregável"
											className="h-10 min-w-0 flex-1 rounded-md border border-divider bg-bg px-3 text-[15px] text-text" />
										<button type="button" onClick={() => addEnt(g)} aria-label="Adicionar" className="grid h-10 w-10 flex-none cursor-pointer place-items-center rounded-full border-0 bg-accent text-[18px] text-white"><Icon name="plus" /></button>
									</div>
								</div>
							);
						})}
					</div>
				)}

				{st.id === 'dist' && (
					<div className="flex flex-col gap-2">
						<div><Button variant="ghost" size="sm" onClick={() => a.setSetup(x => ({ ...x, ents: C.autoAssign(x.ents, true) }))}>Distribuir automaticamente</Button></div>
						{su.ents.map(e => (
							<div key={e.id} className="flex flex-col gap-2.5 rounded-lg bg-surface px-4 py-3.5">
								<div className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: C.GROUPS[e.grupo].color }} /><span className="text-[17px] font-semibold tracking-[-0.022em]">{e.titulo}</span></div>
								<SegmentedControl name={'hz-' + e.id} ariaLabel="Horizonte" className="w-full" value={String(e.hz ?? 0)}
									options={C.HZ.map((h, i) => ({ value: String(i), label: h.nome }))}
									onChange={val => a.setSetup(x => ({ ...x, ents: x.ents.map(y => y.id === e.id ? { ...y, hz: Number(val) as C.Hz } : y) }))} />
							</div>
						))}
					</div>
				)}

				{s.err && <div role="alert" className="mt-4 flex items-center gap-2 text-[14px] text-danger"><Icon name="warning" />{s.err}</div>}
			</div>
			<div className="flex-none border-t border-divider px-5 pt-3 pb-9">
				<Button variant="primary" block onClick={a.next}>{last ? 'Gerar meu Prisma' : 'Continuar'}</Button>
			</div>
		</div>
	);
}
