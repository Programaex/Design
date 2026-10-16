'use client';
// "Prisma Export": the four A4 templates filled with the saved plan (or lorem ipsum for the layout audit).
// Opens in the same tab, so it works inside installed PWAs and on phones; pages are zoomed to fit and print at true size.
import * as C from '@executar/core';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { Button, Icon, SegmentedControl } from '../ds';
import { readSaved, STORAGE_KEY } from '@/lib/use-prisma-app';

type Content = 'lorem' | 'plan';
interface Audit { faces: number; over: string[]; clamped: number }

export function ExportViewer({ chrome = 'full', template, content: contentProp, plan: planProp }: { chrome?: 'full' | 'none'; template?: C.TemplateId; content?: Content; plan?: C.Plan }) {
	const router = useRouter();
	const q = useSearchParams();
	const [ready, setReady] = useState(false);
	const [saved, setSaved] = useState<{ plan: C.Plan | null; user: { email: string } | null; tpl: C.TemplateId | null }>({ plan: null, user: null, tpl: null });
	const qTpl = q.get('template'), qContent = q.get('content');
	const [tpl, setTpl] = useState<C.TemplateId>(template ?? (C.isTemplateId(qTpl) ? qTpl : 'prisma'));
	const [content, setContent] = useState<Content>(contentProp ?? (qContent === 'lorem' || qContent === 'plan' ? qContent : 'plan'));
	const [audit, setAudit] = useState<Audit | null>(null);
	const [shareLabel, setShareLabel] = useState('Salvar HTML');
	const pk = useRef<HTMLDivElement>(null);

	useEffect(() => {
		const load = () => {
			const s = readSaved();
			setSaved({ plan: s?.plan ?? null, user: s?.user ?? null, tpl: s?.exportTpl ?? null });
			if (!qTpl && !template && s?.exportTpl) setTpl(s.exportTpl);
			setReady(true);
		};
		load();
		const onStorage = (e: StorageEvent) => { if (e.key === STORAGE_KEY) load(); };
		window.addEventListener('storage', onStorage);
		if (typeof navigator.share === 'function') setShareLabel('Compartilhar');
		return () => window.removeEventListener('storage', onStorage);
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	const lorem = useMemo(() => C.loremPlan(), []);
	const fallback = useMemo(() => C.demoPlan().plan, []);
	const plan = content === 'lorem' ? lorem : planProp ?? saved.plan ?? fallback;
	const T = C.TEMPLATES.find(t => t.id === tpl)!;
	const vm = useMemo(() => C.viewModel(tpl, plan), [tpl, plan]);
	const html = useMemo(() => C.pagesHtml(vm.pages), [vm]);

	/* fit: A4 is ~794 px wide; zoom the stack on phones, never at print */
	const fit = useCallback(() => {
		const el = pk.current; if (!el || chrome === 'none') return;
		const w = window.innerWidth, need = 860;
		el.style.zoom = w < need ? String(Math.max(0.35, w / need)) : '';
	}, [chrome]);
	useLayoutEffect(() => {
		fit();
		const before = () => { if (pk.current) pk.current.style.zoom = ''; clearMarks(); };
		window.addEventListener('resize', fit); window.addEventListener('beforeprint', before); window.addEventListener('afterprint', fit);
		return () => { window.removeEventListener('resize', fit); window.removeEventListener('beforeprint', before); window.removeEventListener('afterprint', fit); };
	}, [fit]);

	const clearMarks = () => pk.current?.querySelectorAll<HTMLElement>('[data-face]').forEach(el => { el.style.outline = ''; });
	/* audit: a face overflows when its content exceeds the 92.33 mm box; clamped text is reported separately */
	useEffect(() => {
		if (!ready) return;
		let cancelled = false;
		const run = () => {
			const root = pk.current; if (!root || cancelled) return;
			const faces = [...root.querySelectorAll<HTMLElement>('[data-face]')], over: string[] = [];
			faces.forEach(el => { const bad = el.scrollHeight > el.clientHeight + 1; el.style.outline = bad && chrome !== 'none' ? '2px solid #A33A32' : ''; if (bad) over.push(el.dataset.face || ''); });
			const clamped = [...root.querySelectorAll<HTMLElement>('[data-clamp]')].filter(el => el.scrollHeight > el.clientHeight + 1 || el.scrollWidth > el.clientWidth + 1).length;
			setAudit({ faces: faces.length, over, clamped });
		};
		setAudit(null);
		const t = setTimeout(() => { (document.fonts?.ready ?? Promise.resolve()).then(run); }, 300);
		return () => { cancelled = true; clearTimeout(t); };
	}, [html, ready, chrome]);

	useEffect(() => {
		if (ready && q.get('print') === '1') { const t = setTimeout(() => window.print(), 1200); return () => clearTimeout(t); }
	}, [ready, q]);

	const share = () => {
		const doc = C.documentHtml(tpl, plan);
		const blob = new Blob([doc.html], { type: 'text/html' });
		const dl = () => { const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = doc.filename; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 1500); };
		try {
			const file = new File([blob], doc.filename, { type: 'text/html' });
			if (navigator.canShare?.({ files: [file] })) { navigator.share({ files: [file], title: T.t }).catch(e => { if (!e || e.name !== 'AbortError') dl(); }); return; }
		} catch { /* fall through to download */ }
		dl();
	};
	const pickTpl = (id: C.TemplateId) => {
		setTpl(id);
		const s = readSaved();
		if (s) try { localStorage.setItem(STORAGE_KEY, JSON.stringify({ ...s, exportTpl: id })); } catch { /* ignore */ }
		router.replace('/app/exportar?template=' + id + (content === 'lorem' ? '&content=lorem' : ''), { scroll: false });
	};
	const ok = audit && !audit.over.length;

	return (
		<div className="min-h-dvh bg-[#F5F5F4]">
			<style>{'@page{size:A4 portrait;margin:0}@media print{.page{box-shadow:none!important;break-after:page}.page:last-child{break-after:auto}#pk{padding:0!important;gap:0!important;display:block!important}}*{-webkit-print-color-adjust:exact;print-color-adjust:exact}'}</style>
			{chrome !== 'none' && (
				<div data-noprint className="sticky top-0 z-20 flex flex-col gap-2 border-b border-[#EAEAE8] bg-white/90 px-3 py-2.5 backdrop-blur-[20px] backdrop-saturate-[180%]">
					<div className="flex flex-wrap items-center gap-2">
						<button type="button" onClick={() => router.push('/app')} className="flex h-11 cursor-pointer items-center gap-1 border-0 bg-transparent pr-2.5 pl-1 text-[16px] text-[#2563EB]"><Icon name="caret-left" className="text-[20px]" />App</button>
						<span className="flex min-w-[140px] flex-1 flex-col">
							<span className="text-[15px] font-semibold text-[#202124]">{T.t}</span>
							<span className="font-[family-name:var(--font-mono-doc)] text-[10px] tracking-[.06em] text-[#6B7280]">A4 retrato · margem 10 mm · 3 faces de 92,33 mm · {vm.pages.length} {vm.pages.length === 1 ? 'página' : 'páginas'}</span>
						</span>
						<Button variant="secondary" size="sm" onClick={share}>{shareLabel}</Button>
						<Button size="sm" onClick={() => { clearMarks(); if (pk.current) pk.current.style.zoom = ''; window.print(); }}>Imprimir / PDF</Button>
					</div>
					<div className="no-scrollbar flex gap-1.5 overflow-x-auto pb-0.5" role="radiogroup" aria-label="Modelo">
						{C.TEMPLATES.map(t => {
							const on = t.id === tpl;
							return (
								<button key={t.id} type="button" role="radio" aria-checked={on} onClick={() => pickTpl(t.id)}
									className="flex h-9 flex-none cursor-pointer items-center gap-1.5 rounded-[40px] border px-3 text-[13px] whitespace-nowrap"
									style={{ borderColor: on ? '#202124' : '#D1D5DB', background: on ? '#202124' : '#FFFFFF', color: on ? '#FFFFFF' : '#202124' }}>
									<Icon name={t.icon} />{t.t}
								</button>
							);
						})}
					</div>
					<div className="flex flex-wrap items-center gap-2.5">
						<div className="w-[220px]"><SegmentedControl name="conteudo" ariaLabel="Conteúdo" className="w-full" value={content} onChange={setContent} options={[{ value: 'lorem', label: 'Lorem ipsum' }, { value: 'plan', label: 'Meu plano' }]} /></div>
						<span role="status" className="inline-flex items-center gap-1.5 font-[family-name:var(--font-mono-doc)] text-[11px]" style={{ color: !audit ? '#6B7280' : ok ? '#304E83' : '#A33A32' }}>
							<Icon name={!audit ? 'circle-notch' : ok ? 'check-circle' : 'warning'} className="text-[14px]" />
							{!audit ? 'Auditando faces…' : ok ? `${audit.faces} faces sem overflow · ${audit.clamped} textos truncados` : `${audit.over.length} de ${audit.faces} faces com overflow: ${audit.over.join(', ')}`}
						</span>
					</div>
				</div>
			)}
			<div id="pk" ref={pk} className="flex flex-col items-center gap-4 py-4 [&_.page]:shadow-[0_8px_28px_rgb(0_0_0/.10)]" dangerouslySetInnerHTML={{ __html: ready ? html : '' }} />
		</div>
	);
}
