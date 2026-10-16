// Cálculo de página (SPEC-03): área útil, escala, centralização e piso de legibilidade.
export const PAPER = { A4: [210, 297], A3: [297, 420] };
export const MM_TO_PX = 96 / 25.4;
export const mmToPx = mm => mm * MM_TO_PX;
export const MIN_PT = 9;

export const DEFAULT_OPTIONS = { view: 'calendar', scope: 'filtered', paper: 'A4', orientation: 'landscape', marginsMm: { top: 10, right: 10, bottom: 10, left: 10 }, headerMm: 12, footerMm: 10, includeLegend: true, includeHeader: true, includeDetails: false, layoutDirection: 'LR', overflowMode: 'ask', custom: null };

// Folha em mm já orientada.
export function sheetMm({ paper = 'A4', orientation = 'landscape', custom = null }) {
	const [w, h] = paper === 'custom' ? custom : PAPER[paper];
	const [short, long] = [Math.min(w, h), Math.max(w, h)];
	return orientation === 'landscape' ? [long, short] : [short, long];
}

// Área útil em mm e px: folha − margens − cabeçalho − rodapé/legenda.
export function usableArea(opts) {
	const o = { ...DEFAULT_OPTIONS, ...opts, marginsMm: { ...DEFAULT_OPTIONS.marginsMm, ...(opts.marginsMm || {}) } };
	const [w, h] = sheetMm(o);
	const m = o.marginsMm;
	const mm = [w - m.left - m.right, h - m.top - m.bottom - (o.includeHeader ? o.headerMm : 0) - (o.includeLegend ? o.footerMm : 0)];
	return { mm, px: mm.map(mmToPx), sheet: [w, h] };
}

/**
 * Encaixa bounds B = {x, y, width, height} (px CSS, podem ter origem negativa) na área U.
 * Retorna escala, deslocamento (já compensando a origem), fonte final em pt e se é legível.
 */
export function fitToPage(bounds, opts, { fontPx = 16, minPt = MIN_PT } = {}) {
	const { px: [Uw, Uh] } = usableArea(opts);
	const s = Math.min(1, Uw / bounds.width, Uh / bounds.height);
	const dx = (Uw - s * bounds.width) / 2 - s * bounds.x;
	const dy = (Uh - s * bounds.height) / 2 - s * bounds.y;
	const pt = fontPx * s * 72 / 96;
	return { scale: s, dx, dy, pt, legible: pt >= minPt, usablePx: [Uw, Uh] };
}

// Sugestões quando não cabe legível: papel maior que resolve, ou necessidade de reduzir escopo.
export function suggestions(bounds, opts, fontOpts) {
	const out = [];
	for (const paper of ['A4', 'A3']) for (const orientation of ['landscape', 'portrait']) {
		const f = fitToPage(bounds, { ...opts, paper, orientation }, fontOpts);
		if (f.legible) out.push({ paper, orientation, pt: f.pt });
	}
	return out;
}

// Calendário: altura mínima de célula = cabeçalho do dia + cartões + gaps + padding; linha = máximo da semana.
export function calendarHeight(weeks, { headerPx = 20, gapPx = 4, paddingPx = 8 } = {}) {
	const rows = weeks.map(week => Math.max(...week.map(cardHeights => headerPx + paddingPx * 2 + cardHeights.reduce((a, h) => a + h, 0) + Math.max(0, cardHeights.length - 1) * gapPx)));
	return { rows, total: rows.reduce((a, b) => a + b, 0) };
}

// CSS @page gerado a partir das opções validadas.
export function pageCss(opts) {
	const o = { ...DEFAULT_OPTIONS, ...opts, marginsMm: { ...DEFAULT_OPTIONS.marginsMm, ...(opts.marginsMm || {}) } };
	const [w, h] = sheetMm(o);
	const m = o.marginsMm;
	return `@page { size: ${w}mm ${h}mm; margin: ${m.top}mm ${m.right}mm ${m.bottom}mm ${m.left}mm; }`;
}
