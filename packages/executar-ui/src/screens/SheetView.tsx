'use client';
// Bottom sheet of the prototype: add / rename a task, share the plan, redo the questionnaire.
import { useEffect } from 'react';
import { Button, Icon, Tag, TextField } from '../ds';
import type { PrismaApp as App } from '../use-prisma-app';

export function SheetView({ app }: { app: App }) {
	const { s, a } = app;
	const sh = s.sheet!;
	const close = () => a.up({ sheet: null });
	useEffect(() => {
		const k = (e: KeyboardEvent) => { if (e.key === 'Escape') a.up({ sheet: null }); };
		window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
	}, [a]);
	const hasInput = sh.kind !== 'redo';
	return (
		<div className="absolute inset-0 z-20 flex items-end backdrop-blur-[8px]" style={{ background: 'var(--color-scrim)' }} onClick={close}>
			<div role="dialog" aria-modal="true" aria-label={sh.title} onClick={e => e.stopPropagation()} className="box-border flex w-full flex-col gap-3.5 rounded-t-[28px] bg-bg px-5 pt-2.5 pb-10 text-text">
				<div className="h-[5px] w-9 self-center rounded-full bg-divider" />
				<div className="flex items-center justify-between"><span className="text-[21px] font-semibold">{sh.title}</span>
					<button type="button" onClick={close} aria-label="Fechar" className="grid h-8 w-8 cursor-pointer place-items-center rounded-full border-0 bg-surface text-text-muted"><Icon name="x" /></button></div>
				{'desc' in sh && sh.desc && <p className="m-0 text-[15px] leading-[1.47] text-text-muted">{sh.desc}</p>}
				{hasInput && <TextField label={sh.inputLabel} placeholder={sh.placeholder} value={s.draft} autoFocus type={sh.kind === 'share' ? 'email' : 'text'}
					onChange={e => a.up({ draft: e.target.value })} onKeyDown={e => { if (e.key === 'Enter') void a.confirmSheet(); }} />}
				{sh.kind === 'share' && (
					<div className="overflow-hidden rounded-lg bg-surface">
						{s.members.map((m, i) => (
							<div key={m.email || m.name} className="flex items-center gap-2.5 px-3.5 py-2.5" style={{ borderTop: `1px solid ${i ? 'var(--color-divider)' : 'transparent'}` }}>
								<span className="grid h-8 w-8 place-items-center rounded-full bg-bg text-[14px] font-semibold">{(m.name || m.email)[0]?.toUpperCase()}</span>
								<span className="flex-1 text-[15px]">{m.name || m.email}</span>
								<Tag tone={m.role === 'owner' ? 'accent' : 'neutral'}>{({ owner: 'Dono', editor: 'Editor', viewer: 'Leitura', invited: 'Convite enviado' } as const)[m.role]}</Tag>
							</div>
						))}
					</div>
				)}
				<Button block onClick={() => void a.confirmSheet()}>{sh.cta}</Button>
			</div>
		</div>
	);
}
