'use client';
// WorkflowHero: EXECUTAR → API/MCP → Ferramentas · Organização IA · Entregáveis. A 10.5 s timeline drives the grid,
// orthogonal connectors (stroke-dashoffset), travelling signals and output activation. `Diagram` is a pure function of
// time, so the storyboard frames (and a 1920×1080 video render) reuse the exact same drawing.
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from 'react';
import { Icon } from '../ds';

const W = 640, H = 400;
export const TIMELINE_END = 10.5;
const clamp01 = (x: number) => Math.max(0, Math.min(1, x));
const ease = (x: number) => { x = clamp01(x); return x * x * (3 - 2 * x); };
const seg = (t: number, a: number, b: number) => ease((t - a) / (b - a));
type Pt = [number, number];
const PATHS: { pts: Pt[]; a: number; b: number; s: number }[] = [
	{ pts: [[160, 200], [200, 200], [200, 130], [230, 130]], a: 2.0, b: 3.0, s: 4.0 },
	{ pts: [[160, 200], [200, 200], [200, 270], [230, 270]], a: 2.2, b: 3.2, s: 4.2 },
	{ pts: [[330, 130], [400, 130], [400, 90], [460, 90]], a: 3.0, b: 4.0, s: 5.0 },
	{ pts: [[330, 130], [400, 130], [400, 200], [460, 200]], a: 3.1, b: 4.1, s: 5.1 },
	{ pts: [[330, 270], [400, 270], [400, 200], [460, 200]], a: 3.2, b: 4.2, s: 5.2 },
	{ pts: [[330, 270], [400, 270], [400, 310], [460, 310]], a: 3.3, b: 4.3, s: 5.3 }
];
const dOf = (pts: Pt[]) => pts.map((p, i) => (i ? 'L' : 'M') + p[0] + ' ' + p[1]).join(' ');
function along(pts: Pt[], f: number): Pt {
	const L: number[] = []; let tot = 0;
	for (let i = 1; i < pts.length; i++) { const l = Math.abs(pts[i][0] - pts[i - 1][0]) + Math.abs(pts[i][1] - pts[i - 1][1]); L.push(l); tot += l; }
	let d = f * tot;
	for (let i = 0; i < L.length; i++) {
		if (d <= L[i]) { const r = L[i] ? d / L[i] : 0; return [pts[i][0] + (pts[i + 1][0] - pts[i][0]) * r, pts[i][1] + (pts[i + 1][1] - pts[i][1]) * r]; }
		d -= L[i];
	}
	return pts[pts.length - 1];
}
const OUT = [
	{ x: 460, y: 40, t: 'Ferramentas', ic: 'wrench', c: '#7E9CC6', a: 6.0 },
	{ x: 460, y: 150, t: 'Organização IA', ic: 'sparkle', c: '#E78B67', a: 6.6 },
	{ x: 460, y: 260, t: 'Entregáveis', ic: 'file-text', c: '#1d1d1f', a: 7.2 }
];
export const STEPS: [number, string][] = [[2, '01 / Surgir'], [4, '02 / Conectar'], [6, '03 / Sincronizar'], [8, '04 / Entregar'], [99, '05 / Executar']];
const pct = (v: number, of: number) => (v / of * 100) + '%';
const fs = (k: number) => (k / W * 100) + 'cqw';

export function Diagram({ t, id = 'wf' }: { t: number; id?: string }) {
	const node = (a: number): CSSProperties => { const e = seg(t, a, a + 0.7); return { opacity: e, transform: `translateY(${(1 - e) * 10}px)` }; };
	const tile = (key: string, x: number, y: number, w: number, hh: number, extra: CSSProperties, kids: ReactNode) => (
		<div key={key} style={{ position: 'absolute', left: pct(x, W), top: pct(y, H), width: pct(w, W), height: pct(hh, H), boxSizing: 'border-box', ...extra }}>{kids}</div>
	);
	const msg = seg(t, 8, 9);
	return (
		<div style={{ position: 'relative', width: '100%', aspectRatio: `${W}/${H}`, containerType: 'inline-size', background: '#FCFCFB', overflow: 'hidden' }}>
			<svg viewBox={`0 0 ${W} ${H}`} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }} aria-hidden>
				<defs><pattern id={id + '-grid'} width={32} height={32} patternUnits="userSpaceOnUse"><path d="M16 13v6M13 16h6" stroke="#D9D9D6" strokeWidth={0.8} /></pattern></defs>
				<rect width={W} height={H} fill={`url(#${id}-grid)`} opacity={seg(t, 0, 1.2)} />
				{PATHS.map((p, i) => <path key={i} d={dOf(p.pts)} fill="none" stroke="#B9BAC0" strokeWidth={1.4} strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - seg(t, p.a, p.b)} />)}
				{PATHS.map((p, i) => {
					const f = (t - p.s) / 1.0; if (f <= 0 || f >= 1) return null;
					const [x, y] = along(p.pts, ease(f));
					return <g key={'s' + i}><circle cx={x} cy={y} r={9} fill="rgba(0,113,227,.15)" /><circle cx={x} cy={y} r={4} fill="#0071e3" /></g>;
				})}
			</svg>
			{tile('in', 40, 140, 120, 120, { borderRadius: fs(22), background: '#0071e3', color: '#fff', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: fs(6), boxShadow: `0 ${fs(14)} ${fs(30)} rgba(0,113,227,.28)`, ...node(0.2) },
				<><Icon name="squares-four" style={{ fontSize: fs(44) }} /><span style={{ fontSize: fs(11), fontWeight: 600, letterSpacing: '.04em' }}>EXECUTAR</span></>)}
			{([['API', 'plugs', 112, 0.8], ['MCP', 'circles-three', 252, 1.0]] as const).map(([l, ic, y, a]) =>
				tile(l, 230, y, 100, 36, { borderRadius: fs(18), background: '#fff', border: '1px solid #E3E2DE', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: fs(6), fontSize: fs(14), fontWeight: 600, color: '#1d1d1f', boxShadow: `0 ${fs(4)} ${fs(12)} rgba(0,0,0,.06)`, ...node(a) },
					<><Icon name={ic} /><span>{l}</span></>))}
			{OUT.map((o, i) => {
				const on = seg(t, o.a, o.a + 0.8) > 0.5;
				return tile(o.t, o.x, o.y, 120, 100, { borderRadius: fs(20), background: on ? o.c : '#fff', border: '1px solid ' + (on ? o.c : '#E3E2DE'), color: on ? '#fff' : '#6e6e73', transition: 'background .5s, color .5s, border-color .5s', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: fs(6), boxShadow: on ? `0 ${fs(12)} ${fs(26)} rgba(0,0,0,.14)` : 'none', ...node(1.2 + i * 0.2) },
					<><Icon name={o.ic} style={{ fontSize: fs(30) }} /><span style={{ fontSize: fs(11), fontWeight: 600 }}>{o.t}</span></>);
			})}
			<div style={{ position: 'absolute', left: pct(40, W), bottom: pct(22, H), opacity: msg, transform: `translateY(${(1 - msg) * 8}px)`, fontSize: fs(17), fontWeight: 600, letterSpacing: '-0.01em', color: '#1d1d1f' }}>Da intenção à execução.</div>
		</div>
	);
}

export function WorkflowHero({ reduced }: { reduced: boolean }) {
	const [t, setT] = useState(reduced ? TIMELINE_END : 0);
	const [play, setPlay] = useState(!reduced);
	const raf = useRef(0);
	useEffect(() => { if (reduced) { setT(TIMELINE_END); setPlay(false); } }, [reduced]);
	useEffect(() => {
		if (!play) return;
		let last = performance.now();
		const loop = (now: number) => {
			const dt = (now - last) / 1000; last = now;
			setT(v => { const n = Math.min(TIMELINE_END, v + dt); if (n >= TIMELINE_END) setPlay(false); return n; });
			raf.current = requestAnimationFrame(loop);
		};
		raf.current = requestAnimationFrame(loop);
		return () => cancelAnimationFrame(raf.current);
	}, [play]);
	const step = STEPS.find(s => t < s[0])![1];
	const btn = (label: string, icon: string, onClick: () => void, disabled = false) => (
		<button type="button" aria-label={label} title={label} onClick={onClick} disabled={disabled}
			className="grid h-11 w-11 place-items-center rounded-full border-0 bg-[#F0F0F2] text-[18px] text-[#1d1d1f] disabled:cursor-default disabled:opacity-40" style={{ cursor: disabled ? 'default' : 'pointer' }}>
			<Icon name={icon} />
		</button>
	);
	return (
		<div role="img" aria-label="Diagrama: entrada EXECUTAR conectada por API e MCP a ferramentas, organização com IA e entregáveis.">
			<Diagram t={t} id="hero" />
			<div className="flex items-center gap-2 border-t border-[#EFEEEB] py-2.5 pr-3.5 pl-5">
				<span className="flex-1 text-[12px] font-semibold text-[#6e6e73] tabular-nums" aria-live="off">{step} · {Math.min(10, t).toFixed(1)} s</span>
				{btn(play ? 'Pausar animação' : 'Reproduzir animação', play ? 'pause' : 'play', () => { if (t >= TIMELINE_END) setT(0); setPlay(!play); }, reduced)}
				{btn('Reiniciar animação', 'arrow-counter-clockwise', () => { if (reduced) { setT(TIMELINE_END); return; } setT(0); setPlay(true); })}
			</div>
		</div>
	);
}
