// Reusable before/after comparator: pointer drag (mouse, touch, pen), keyboard (← → PgUp PgDn Home End) and presets.
// Both states render the same content; the "before" layer is clipped, never removed, so nothing changes between states.
import { useRef, useState, type ReactNode } from 'react';
import { Icon } from '@executar/ui';

export interface ComparisonSliderProps {
	/** Header line, e.g. the shared objective. */
	title: ReactNode;
	dot: string;
	hint: string;
	ariaLabel: string;
	beforeLabel: string;
	afterLabel: string;
	before: ReactNode;
	after: ReactNode;
	initial?: number;
}

export function ComparisonSlider({ title, dot, hint, ariaLabel, beforeLabel, afterLabel, before, after, initial = 50 }: ComparisonSliderProps) {
	const [pos, setPosRaw] = useState(initial);
	const drag = useRef(false);
	const setPos = (v: number) => setPosRaw(Math.max(0, Math.min(100, v)));
	const fromEvent = (e: React.PointerEvent<HTMLDivElement>) => { const r = e.currentTarget.getBoundingClientRect(); setPos((e.clientX - r.left) / r.width * 100); };
	const onKey = (e: React.KeyboardEvent) => {
		const m = ({ ArrowLeft: -5, ArrowRight: 5, PageDown: -10, PageUp: 10 } as Record<string, number>)[e.key];
		if (m != null) { e.preventDefault(); setPos(pos + m); }
		else if (e.key === 'Home') { e.preventDefault(); setPos(0); }
		else if (e.key === 'End') { e.preventDefault(); setPos(100); }
	};
	const r = Math.round(pos);
	const layer = 'col-start-1 row-start-1 px-[clamp(16px,4vw,56px)] py-[clamp(40px,5vw,56px)]';
	const chip = 'absolute top-3.5 rounded-full bg-white px-2.5 py-1 text-[11px] font-semibold transition-opacity';
	return (
		<div className="overflow-hidden rounded-[28px] bg-white shadow-[0_24px_60px_rgba(29,29,31,.07)]">
			<div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#EAEAE8] px-5 py-3.5 text-[13px]">
				<span className="flex items-center gap-2 font-semibold"><span className="h-2 w-2 rounded-full" style={{ background: dot }} />{title}</span>
				<span className="text-[#6e6e73]">{hint}</span>
			</div>
			<div className="relative grid cursor-ew-resize touch-pan-y bg-[#F2F4FA] select-none"
				onPointerDown={e => { if (e.button) return; drag.current = true; try { e.currentTarget.setPointerCapture(e.pointerId); } catch { /* ignore */ } fromEvent(e); }}
				onPointerMove={e => { if (drag.current) fromEvent(e); }}
				onPointerUp={() => { drag.current = false; }} onPointerCancel={() => { drag.current = false; }}>
				<div className={layer}>{after}</div>
				<div className={layer + ' bg-[#FAF9F6]'} aria-hidden={pos < 1} style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }}>{before}</div>
				<span className={chip + ' left-3.5 text-[#8A4B2E]'} style={{ opacity: pos > 12 ? 1 : 0 }}>{beforeLabel}</span>
				<span className={chip + ' right-3.5 text-accent'} style={{ opacity: pos < 88 ? 1 : 0 }}>{afterLabel}</span>
				<span aria-hidden className="pointer-events-none absolute top-0 bottom-0 -ml-px w-0.5 bg-white shadow-[0_0_0_1px_rgba(0,0,0,.06)]" style={{ left: pos + '%' }} />
				<div role="slider" tabIndex={0} aria-label={ariaLabel} aria-valuemin={0} aria-valuemax={100} aria-valuenow={r} aria-valuetext={`${r}% antes, ${100 - r}% depois`} onKeyDown={onKey}
					className="absolute top-1/2 -mt-6 -ml-6 grid h-12 w-12 cursor-grab place-items-center rounded-full bg-white text-[18px] text-[#1d1d1f] shadow-[0_6px_20px_rgba(0,0,0,.18)] outline-offset-[3px]" style={{ left: pos + '%' }}>
					<Icon name="arrows-horizontal" />
				</div>
			</div>
			<div className="flex flex-wrap items-center justify-between gap-3 border-t border-[#EAEAE8] px-5 py-3">
				<span className="text-[13px] text-[#6e6e73]">Arraste a alça ou use as setas do teclado</span>
				<div className="flex gap-1.5">
					{([['Antes', 100], ['50 / 50', 50], ['Depois', 0]] as const).map(([t, v]) => {
						const on = r === v;
						return <button key={t} type="button" aria-pressed={on} onClick={() => setPos(v)} className="min-h-11 cursor-pointer rounded-full border-0 px-3.5 text-[13px] font-semibold"
							style={{ background: on ? '#1d1d1f' : '#F0F0F2', color: on ? '#fff' : '#1d1d1f' }}>{t}</button>;
					})}
				</div>
			</div>
		</div>
	);
}
