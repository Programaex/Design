import React from 'react';
import { DAY, dueOf, fmtDay, isDone, isLate, parseDay } from '../lib/kpis.mjs';

// Escala de dias: data ISO → x em px dentro da faixa [x0, x0 + width].
export function scale(from, to, x0, width) {
	const a = parseDay(from).getTime(), b = parseDay(to).getTime() + DAY;
	return d => x0 + ((parseDay(d).getTime() - a) / (b - a)) * width;
}

// Marcas de mês (dia 1) e de semana (segundas) dentro da janela.
export function ticks(from, to) {
	const out = [{ iso: from, kind: 'start' }];
	for (let t = parseDay(from).getTime(); t <= parseDay(to).getTime(); t += DAY) {
		const d = new Date(t);
		if (t === parseDay(from).getTime()) continue;
		if (d.getUTCDate() === 1) out.push({ iso: d.toISOString().slice(0, 10), kind: 'month' });
		else if (d.getUTCDay() === 1) out.push({ iso: d.toISOString().slice(0, 10), kind: 'week' });
	}
	return out;
}
const MESES = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];

// Corta o rótulo para não invadir as barras (~6,6 px por caractere a 12 px).
const fit = (text, px) => { const n = Math.floor(px / 6.6); return text.length > n ? text.slice(0, n - 1) + '…' : text; };
const tone = (i, today) => (isDone(i) ? 'done' : isLate(i, today) ? 'late' : 'open');

/**
 * Gantt em SVG.
 * rows: [{ name, items }]; compact = uma linha por grupo (impressão), senão uma linha por item.
 * extra: barras sem issue (cadência do PDF) [{ label, start, end, kind }].
 */
export function Gantt({ rows = [], extra = [], from, to, today, milestones = [], compact = false, onPick, width = 1000, labelW = 220, rowH = compact ? 22 : 20 }) {
	const x = scale(from, to, labelW, width - labelW - 8);
	const dayW = (width - labelW - 8) / ((parseDay(to) - parseDay(from)) / DAY + 1);
	const lines = [];
	if (extra.length) extra.forEach(e => lines.push({ kind: 'extra', e }));
	for (const r of rows) {
		if (compact) lines.push({ kind: 'group', r });
		else { lines.push({ kind: 'head', r }); r.items.forEach(i => lines.push({ kind: 'item', i })); }
	}
	const top = 30;
	const h = top + lines.length * rowH + 8;
	const ts = ticks(from, to);
	const bar = (i, y, hh) => {
		const s = i.start || dueOf(i), e = dueOf(i) || i.start;
		if (!s) return null;
		const x1 = x(s), x2 = Math.max(x(e) + dayW, x1 + 3);
		if (i.type === 'gate') {
			const cx = x(e), cy = y + hh / 2, r = hh / 2;
			return <polygon key={i.number} className={`g-gate g-${tone(i, today)}`} points={`${cx},${cy - r} ${cx + r},${cy} ${cx},${cy + r} ${cx - r},${cy}`} onClick={() => onPick?.(i)}><title>{`${i.alias || '#' + i.number} · ${i.title} · ${fmtDay(dueOf(i))}`}</title></polygon>;
		}
		return (
			<rect key={i.number} className={`g-bar g-${tone(i, today)}${!i.due && i.dueWindow ? ' g-window' : ''}`} x={x1} y={y} width={x2 - x1} height={hh} rx="3" onClick={() => onPick?.(i)}>
				<title>{`#${i.number} ${i.alias ? '(' + i.alias + ') ' : ''}${i.title} · ${fmtDay(s)} → ${fmtDay(i.due)}`}</title>
			</rect>
		);
	};
	return (
		<svg className={`gantt${compact ? ' is-compact' : ''}`} viewBox={`0 0 ${width} ${h}`} width="100%" role="img" aria-label="Cronograma">
			{ts.map(t => (
				<g key={t.iso}>
					<line className={t.kind === 'week' ? 'g-week' : 'g-month'} x1={x(t.iso)} x2={x(t.iso)} y1={top - 6} y2={h} />
					{t.kind !== 'week' && <text className="g-axis" x={x(t.iso) + 3} y={12}>{MESES[Number(t.iso.slice(5, 7)) - 1]}/{t.iso.slice(2, 4)}</text>}
				</g>
			))}
			{milestones.map(m => (
				<g key={m.date + m.label}>
					<line className="g-milestone" x1={x(m.date)} x2={x(m.date)} y1={top - 10} y2={h} />
					<text className="g-mlabel" x={x(m.date) > width - 50 ? x(m.date) - 3 : x(m.date) + 3} textAnchor={x(m.date) > width - 50 ? 'end' : 'start'} y={24}>{fmtDay(m.date)}</text>
				</g>
			))}
			{today >= from && today <= to && <line className="g-today" x1={x(today)} x2={x(today)} y1={top - 10} y2={h}><title>Hoje</title></line>}
			{lines.map((l, k) => {
				const y = top + k * rowH;
				if (l.kind === 'extra') {
					const e = l.e;
					return (
						<g key={'x' + k}>
							<text className="g-label" x={4} y={y + rowH * 0.7}>{fit(e.label, labelW - 10)}</text>
							<rect className={`g-cad g-cad-${e.kind}`} x={x(e.start)} y={y + 4} width={Math.max(x(e.end) - x(e.start), 3)} height={rowH - 8} rx="3"><title>{`${e.label} · ${fmtDay(e.start)}–${fmtDay(e.end)}`}</title></rect>
						</g>
					);
				}
				if (l.kind === 'head') return <text key={'h' + k} className="g-head" x={4} y={y + rowH * 0.72}>{l.r.name} · {l.r.items.filter(isDone).length}/{l.r.items.length}</text>;
				if (l.kind === 'group') {
					return (
						<g key={'g' + k}>
							<text className="g-label" x={4} y={y + rowH * 0.7}>{fit(`${l.r.name} · ${l.r.items.filter(isDone).length}/${l.r.items.length}`, labelW - 10)}</text>
							{l.r.items.map(i => bar(i, y + 5, rowH - 10))}
						</g>
					);
				}
				return (
					<g key={'i' + k} className="g-row" onClick={() => onPick?.(l.i)}>
						<text className="g-label g-item" x={14} y={y + rowH * 0.7}>{fit((l.i.alias || '#' + l.i.number) + ' · ' + l.i.title, labelW - 22)}<title>{l.i.title}</title></text>
						{bar(l.i, y + 4, rowH - 8)}
					</g>
				);
			})}
		</svg>
	);
}
