'use client';
import * as C from '@executar/core';
import { useRouter } from 'next/navigation';
import { useRef } from 'react';
import { Button, Check, Icon, ProgressBar, SegmentedControl, Switch, Tag } from '../ds';
import type { AppState, PrismaApp } from '@/lib/use-prisma-app';

const H1 = 'mt-1 text-[34px] leading-[1.08] font-semibold tracking-[-0.015em]';
const SECTION = 'px-1 pb-2 text-[12px] font-semibold text-text-muted';

export function ago(t: number) {
	const m = Math.round((Date.now() - t) / 60000);
	return m < 1 ? 'agora' : m < 60 ? `há ${m} min` : `há ${Math.round(m / 60)} h`;
}

export type SyncKind = 'local' | 'conflict' | 'offline' | 'syncing' | 'ok';
export function syncInfo(s: AppState) {
	const offline = s.offline || (typeof navigator !== 'undefined' && !navigator.onLine);
	const kind: SyncKind = !s.user ? 'local' : s.conflict ? 'conflict' : offline ? 'offline' : s.syncing ? 'syncing' : s.outbox.length ? 'offline' : 'ok';
	const n = s.outbox.length;
	const SY: Record<SyncKind, [string, string, string, string, string]> = {
		local: ['Neste aparelho', 'var(--color-neutral-400)', 'device-mobile', 'Só neste aparelho', 'Crie uma conta para guardar o plano na nuvem.'],
		conflict: ['Conflito', 'var(--color-danger)', 'warning-circle', 'Precisa da sua escolha', 'Uma tarefa mudou em dois aparelhos.'],
		offline: [offline ? `Offline · ${n}` : `Pendente · ${n}`, 'var(--color-warning)', 'cloud-slash', offline ? 'Sem conexão' : 'Aguardando envio', `${n} mudança(s) aguardando envio.`],
		syncing: ['Sincronizando…', 'var(--color-accent)', 'arrows-clockwise', 'Sincronizando…', 'Enviando suas mudanças.'],
		ok: ['Sincronizado', 'var(--color-success)', 'cloud-check', 'Tudo sincronizado', s.lastSync ? 'Última vez ' + ago(s.lastSync) + '.' : 'Pronto para sincronizar.']
	};
	const [label, dot, icon, title, desc] = SY[kind];
	return { kind, label, dot, icon, title, desc };
}

function Row({ label, sub, children, first }: { label: string; sub?: string; children: React.ReactNode; first?: boolean }) {
	return (
		<div className="flex min-h-14 items-center gap-3 px-4 py-2" style={{ borderTop: `1px solid ${first ? 'transparent' : 'var(--color-divider)'}` }}>
			<span className="min-w-0 flex-1"><span className="block text-[17px]">{label}</span>{sub && <span className="block text-[12px] text-text-muted">{sub}</span>}</span>
			{children}
		</div>
	);
}

export function RotinasTab({ app, plan }: { app: PrismaApp; plan: C.Plan }) {
	const { s, a } = app;
	const lang = plan.lang, done = plan.rotinas.filter(r => r.done).length;
	return (
		<div data-screen-label="Rotinas" className="px-4 pt-1 pb-8">
			<h1 className={H1 + ' mb-1.5'}>Rotinas do dia</h1>
			<p className="m-0 text-[15px] text-text-muted">{done} de {plan.rotinas.length} feitas hoje. Reiniciam toda manhã.</p>
			<ProgressBar className="mt-3.5" pct={plan.rotinas.length ? done / plan.rotinas.length * 100 : 0} />
			<div className="mt-5 flex flex-col gap-2">
				{plan.rotinas.filter(r => C.ROT[r.k]).map(r => {
					const R = C.ROT[r.k];
					return (
						<button key={r.id} type="button" aria-pressed={r.done} onClick={() => a.mutate(p => C.toggleRoutine(p, r.id), 'Rotina marcada')}
							className="flex w-full cursor-pointer items-center gap-3 rounded-lg border-0 bg-surface px-4 py-3.5 text-left text-text">
							<Check done={r.done} size={26} />
							<span className="min-w-0 flex-1">
								<span className="block text-[12px] text-text-muted">{R.w}</span>
								<span className="block text-[17px] font-semibold tracking-[-0.022em]" style={{ textDecoration: r.done ? 'line-through' : 'none' }}>{R.n[lang]}</span>
								<span className="mt-0.5 block text-[14px] text-text-muted">{R.d[lang]}</span>
							</span>
							<span className="flex flex-none items-center gap-1 text-[12px] text-text-muted"><Icon name={s.settings.reminders && R.at !== '—' ? 'bell' : 'bell-slash'} />{R.at}</span>
						</button>
					);
				})}
				{!plan.rotinas.length && <div className="text-[15px] text-text-muted">Nenhuma rotina escolhida. Refaça o questionário para adicionar.</div>}
			</div>
			<div className="mt-3"><Button variant="ghost" onClick={() => { a.mutate(p => C.resetRoutines(p), 'Rotinas zeradas'); a.say('Dia reiniciado'); }}>Zerar o dia</Button></div>
		</div>
	);
}

export function ContaTab({ app }: { app: PrismaApp }) {
	const { s, a } = app;
	const sy = syncInfo(s);
	const rows: [string, string, string, () => void][] = [
		['cloud', 'Sincronização', sy.label, () => a.up({ sub: 'sync' })],
		['users', 'Compartilhar plano', s.members.length > 1 ? s.members.length + ' pessoas' : '', () => a.openSheet({ kind: 'share', title: 'Compartilhar plano', desc: 'Quem você convidar pode marcar e editar tarefas.', inputLabel: 'E-mail', placeholder: 'nome@exemplo.com', cta: 'Enviar convite' })],
		['download-simple', 'Exportar e importar', '', () => a.up({ sub: 'export' })],
		['gear-six', 'Ajustes', '', () => a.up({ sub: 'settings' })],
		['arrow-counter-clockwise', 'Refazer questionário', '', () => a.openSheet({ kind: 'redo', title: 'Refazer questionário?', desc: 'Suas respostas ficam preenchidas. O progresso das tarefas recomeça ao gerar de novo.', cta: 'Refazer' })],
		['sign-out', s.user ? 'Sair' : 'Entrar', '', () => { if (s.user) void a.logout(); else a.up({ screen: 'login' }); }]
	];
	return (
		<div data-screen-label="Conta" className="px-4 pt-1 pb-8">
			<h1 className={H1 + ' mb-4'}>Conta</h1>
			<div className="flex items-center gap-3.5 rounded-lg bg-surface p-4">
				<span className="grid h-[52px] w-[52px] flex-none place-items-center rounded-full bg-text text-[21px] font-semibold text-bg">{s.user ? s.user.name[0]?.toUpperCase() : '?'}</span>
				<span className="min-w-0 flex-1"><span className="block text-[17px] font-semibold">{s.user ? s.user.name : 'Sem conta'}</span><span className="block truncate text-[14px] text-text-muted">{s.user ? s.user.email : 'Dados só neste aparelho'}</span></span>
				{!s.user && <Button size="sm" onClick={() => a.up({ screen: 'login' })}>Criar conta</Button>}
			</div>
			<div className="mt-5 overflow-hidden rounded-lg bg-surface">
				{rows.map(([icon, label, value, onClick], i) => (
					<button key={label} type="button" onClick={onClick} className="flex min-h-[52px] w-full cursor-pointer items-center gap-3 border-0 bg-transparent px-4 text-left text-[17px]"
						style={{ borderTop: `1px solid ${i ? 'var(--color-divider)' : 'transparent'}`, color: label === 'Sair' ? 'var(--color-danger)' : 'var(--color-text)' }}>
						<Icon name={icon} className="flex-none text-[20px]" />
						<span className="flex-1">{label}</span>
						<span className="text-[14px] text-text-muted">{value}</span>
						<Icon name="caret-right" className="text-[14px] text-text-muted" />
					</button>
				))}
			</div>
			<p className="mx-1 mt-5 text-[12px] text-text-muted">Prisma · EXECUTAR</p>
		</div>
	);
}

export function SyncScreen({ app, plan }: { app: PrismaApp; plan: C.Plan }) {
	const { s, a } = app;
	const sy = syncInfo(s), c = s.conflict;
	const conflictTask = c && plan.ents.flatMap(e => e.tarefas).find(t => t.id === c.taskId);
	return (
		<div data-screen-label="Sincronização" className="px-4 pb-8">
			<h1 className={H1 + ' mb-5'}>Sincronização</h1>
			<div className="flex flex-col items-center gap-1.5 rounded-lg bg-surface px-4 py-6 text-center">
				<Icon name={sy.icon} className={sy.kind === 'syncing' ? 'animate-pmspin text-[44px]' : 'text-[44px]'} style={{ color: sy.dot }} />
				<div className="mt-1 text-[21px] font-semibold">{sy.title}</div>
				<div className="text-[14px] text-text-muted">{sy.desc}</div>
				<div className="mt-3"><Button onClick={a.syncNow}>Sincronizar agora</Button></div>
			</div>
			{c && (
				<div className="mt-5 rounded-lg border border-danger p-4">
					<div className="flex items-center gap-1.5 text-[14px] font-semibold text-danger"><Icon name="warning" />Conflito em uma tarefa</div>
					<p className="mt-1.5 mb-3 text-[14px] text-text-muted">{c.by} editou a mesma tarefa enquanto você estava sem conexão. Escolha a versão que fica.{!conflictTask && ' (A tarefa não existe mais.)'}</p>
					<div className="grid grid-cols-2 gap-2">
						{(['local', 'remote'] as const).map(side => {
							const v = c[side];
							return (
								<button key={side} type="button" onClick={() => a.resolve(side)} className="cursor-pointer rounded-md border border-divider bg-bg p-3 text-left text-text">
									<span className="block text-[12px] text-text-muted">{side === 'local' ? 'Este aparelho' : 'Nuvem'}</span>
									<span className="mt-1 block text-[14px]">{v.custom}</span>
									<Tag tone={v.done ? 'success' : 'neutral'} className="mt-2">{v.done ? 'Feito' : 'Aberta'}</Tag>
								</button>
							);
						})}
					</div>
				</div>
			)}
			<div className="mt-5 px-1 text-[12px] font-semibold text-text-muted">Fila de envio</div>
			<div className="mt-2 overflow-hidden rounded-lg bg-surface">
				{!s.outbox.length && <div className="px-4 py-3.5 text-[15px] text-text-muted">Nada pendente.</div>}
				{s.outbox.map((o, i) => (
					<div key={o.id} className="flex items-center gap-2.5 px-4 py-3 text-[15px]" style={{ borderTop: `1px solid ${i ? 'var(--color-divider)' : 'transparent'}` }}>
						<Icon name="clock" className="text-warning" /><span className="flex-1">{o.label}</span><span className="text-[12px] text-text-muted">{new Date(o.at).toTimeString().slice(0, 5)}</span>
					</div>
				))}
			</div>
			<div className="mt-5 overflow-hidden rounded-lg bg-surface">
				<Row first label="Modo offline" sub="Edições entram na fila até a conexão voltar."><Switch label="Modo offline" on={s.offline} onToggle={() => a.setOffline(!s.offline)} /></Row>
			</div>
		</div>
	);
}

export function DadosScreen({ app, plan }: { app: PrismaApp; plan: C.Plan }) {
	const { s, a } = app;
	const router = useRouter();
	const fileRef = useRef<HTMLInputElement>(null);
	const openExport = () => {
		if (app.isolated) return a.say('Abra o app para exportar');
		router.push('/app/exportar?template=' + s.exportTpl);
	};
	const exportJson = () => {
		const blob = new Blob([JSON.stringify(C.exportPayload(plan, s.setup), null, 2)], { type: 'application/json' });
		const el = document.createElement('a'); el.href = URL.createObjectURL(blob); el.download = 'prisma-' + (C.slug(plan.nome) || 'plano') + '.json';
		document.body.appendChild(el); el.click(); el.remove(); setTimeout(() => URL.revokeObjectURL(el.href), 1000);
		a.say('Arquivo exportado');
	};
	const importFile = async (ev: React.ChangeEvent<HTMLInputElement>) => {
		const f = ev.target.files?.[0]; ev.target.value = ''; if (!f) return;
		try {
			const txt = await f.text(), csv = /\.csv$/i.test(f.name);
			a.importPlan(csv ? C.planFromCsv(txt, f.name.replace(/\.csv$/i, '')) : C.parseImport(txt));
		} catch (e) { a.say(e instanceof Error && /Colunas|CSV/.test(e.message) ? e.message : 'Arquivo inválido'); }
	};
	const rows = [
		{ icon: 'file-arrow-down', label: 'Exportar arquivo', sub: 'Baixa o plano em JSON.', onClick: exportJson },
		{ icon: 'file-arrow-up', label: 'Importar arquivo', sub: 'JSON do Prisma ou CSV do plano operacional.', onClick: () => fileRef.current?.click() },
		{ icon: 'file-pdf', label: 'PDF do modelo escolhido', sub: 'Abre a visualização com Imprimir / PDF.', onClick: openExport }
	];
	return (
		<div data-screen-label="Dados" className="px-4 pb-8">
			<h1 className={H1 + ' mb-1.5'}>Dados</h1>
			<p className="mt-0 mb-5 text-[15px] text-text-muted">Escolha um modelo para o plano preenchido ou leve os dados para outro aparelho.</p>
			<div className={SECTION}>Modelos de exportação</div>
			<div className="flex flex-col gap-2" role="radiogroup" aria-label="Modelos de exportação">
				{C.TEMPLATES.map(t => {
					const on = s.exportTpl === t.id;
					return (
						<button key={t.id} type="button" role="radio" aria-checked={on} onClick={() => a.up({ exportTpl: t.id })}
							className="box-border flex w-full cursor-pointer items-center gap-3 rounded-lg bg-surface px-3.5 py-3 text-left text-text"
							style={{ border: `2px solid ${on ? 'var(--color-accent)' : 'transparent'}` }}>
							<span className="grid h-[50px] w-[38px] flex-none place-items-center rounded-[6px] border border-divider bg-bg text-[18px] text-text-muted"><Icon name={t.icon} /></span>
							<span className="min-w-0 flex-1"><span className="block text-[17px] font-semibold tracking-[-0.022em]">{t.t}</span><span className="mt-0.5 block text-[13px] text-text-muted">{t.s}</span></span>
							<Icon name={on ? 'check-circle' : 'circle'} className="flex-none text-[22px]" style={{ color: on ? 'var(--color-accent)' : 'var(--color-neutral-300)' }} />
						</button>
					);
				})}
			</div>
			<div className="mt-3 mb-7"><Button block onClick={openExport}>Visualizar e exportar</Button></div>
			<div className={SECTION}>Dados do plano</div>
			<div className="flex flex-col gap-2">
				{rows.map(r => (
					<button key={r.label} type="button" onClick={r.onClick} className="flex w-full cursor-pointer items-center gap-3.5 rounded-lg border-0 bg-surface p-4 text-left text-text">
						<span className="grid h-10 w-10 flex-none place-items-center rounded-md bg-bg text-[20px]"><Icon name={r.icon} /></span>
						<span className="min-w-0 flex-1"><span className="block text-[17px] font-semibold">{r.label}</span><span className="block text-[14px] text-text-muted">{r.sub}</span></span>
					</button>
				))}
			</div>
			<input ref={fileRef} type="file" accept="application/json,.json,text/csv,.csv" onChange={importFile} className="hidden" aria-hidden tabIndex={-1} />
		</div>
	);
}

export function AjustesScreen({ app, plan }: { app: PrismaApp; plan: C.Plan }) {
	const { s, a } = app;
	return (
		<div data-screen-label="Ajustes" className="px-4 pb-8">
			<h1 className={H1 + ' mb-5'}>Ajustes</h1>
			<div className={SECTION}>Texto das tarefas</div>
			<SegmentedControl name="lang" ariaLabel="Linguagem" className="w-full" value={plan.lang}
				options={[{ value: 'p', label: 'Simples' }, { value: 'e', label: 'Executiva' }]}
				onChange={v => { a.up(st => ({ plan: st.plan ? C.setLang(st.plan, v) : st.plan, setup: { ...st.setup, lang: v } })); a.track('Linguagem alterada'); }} />
			<div className={SECTION + ' pt-6'}>Notificações</div>
			<div className="overflow-hidden rounded-lg bg-surface">
				<Row first label="Lembretes das rotinas" sub="Notificação no horário de cada rotina."><Switch label="Lembretes das rotinas" on={s.settings.reminders} onToggle={() => a.saveSettings({ reminders: !s.settings.reminders })} /></Row>
				<Row label="Alertas de atraso" sub="Aviso quando uma tarefa passa da data."><Switch label="Alertas de atraso" on={s.settings.lateAlerts} onToggle={() => a.saveSettings({ lateAlerts: !s.settings.lateAlerts })} /></Row>
				<div className="flex min-h-[52px] items-center gap-3 border-t border-divider px-4">
					<label htmlFor="rem-time" className="flex-1 text-[17px]">Horário do lembrete</label>
					<input id="rem-time" type="time" value={s.settings.remTime} onChange={e => a.saveSettings({ remTime: e.target.value })} className="rounded-sm border-0 bg-bg px-2 py-1.5 text-[15px] text-text" />
				</div>
			</div>
			<div className={SECTION + ' pt-6'}>Assistente</div>
			<div className="overflow-hidden rounded-lg bg-surface">
				<Row first label="Sugestões de tarefas" sub="Propõe tarefas a partir de cada entregável."><Switch label="Sugestões de tarefas" on={s.settings.ai} onToggle={() => a.saveSettings({ ai: !s.settings.ai })} /></Row>
			</div>
			<button type="button" onClick={a.wipe} className="mt-6 min-h-[52px] w-full cursor-pointer rounded-lg border-0 bg-surface text-[17px] text-danger">Apagar dados deste aparelho</button>
		</div>
	);
}
