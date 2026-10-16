'use client';
// 1920 × 1080 stage for the promotional video. `?t=4.2` freezes the timeline (frame capture by
// scripts/render-video.mjs at 30 fps); without it the 10 s timeline plays in real time for screen recording.
import { useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Diagram, STEPS, TIMELINE_END } from './WorkflowHero';

export function StoryboardRender() {
	const q = useSearchParams();
	const fixed = q.get('t');
	const [t, setT] = useState(fixed != null ? Number(fixed) : 0);
	useEffect(() => {
		if (fixed != null) { setT(Number(fixed)); return; }
		let raf = 0; const t0 = performance.now();
		const loop = (now: number) => { const v = Math.min(TIMELINE_END, (now - t0) / 1000); setT(v); if (v < TIMELINE_END) raf = requestAnimationFrame(loop); };
		raf = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(raf);
	}, [fixed]);
	const step = STEPS.find(s => t < s[0])![1];
	return (
		<div id="stage" data-ready="1" className="relative flex h-[1080px] w-[1920px] flex-col items-center justify-center overflow-hidden bg-warm font-[family-name:var(--font-body)] text-[#1d1d1f]">
			<div className="absolute top-16 left-24 text-[28px] font-semibold tracking-[-0.01em]">EXECUTAR</div>
			<div className="absolute top-16 right-24 text-[22px] font-semibold text-[#6e6e73] tabular-nums">{step}</div>
			<div className="w-[1440px] overflow-hidden rounded-[48px] bg-white shadow-[0_40px_120px_rgba(29,29,31,.10)]"><Diagram t={t} id="stage" /></div>
		</div>
	);
}
