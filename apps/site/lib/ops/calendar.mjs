// Grades de calendário (SPEC-02): datas locais 'YYYY-MM-DD' sem conversão UTC que mude o dia.
// Segunda-feira é o início padrão (configurável). Eventos all-day; janelas são marcadas como janela.

const D = s => new Date(s + 'T12:00:00Z'); // meio-dia UTC: nenhum fuso desloca o dia
const iso = d => d.toISOString().slice(0, 10);
export const addDays = (s, n) => { const d = D(s); d.setUTCDate(d.getUTCDate() + n); return iso(d); };
export const diffDays = (a, b) => Math.round((D(b) - D(a)) / 864e5);
export const weekday = s => D(s).getUTCDay(); // 0 = domingo
export const todayIn = (tz = 'America/Sao_Paulo', at = new Date()) => new Intl.DateTimeFormat('en-CA', { timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit' }).format(at);

export function startOfWeek(s, weekStart = 1) {
	const back = (weekday(s) - weekStart + 7) % 7;
	return addDays(s, -back);
}

// Mês: 7 colunas × 4–6 linhas, só as semanas necessárias.
export function monthGrid(year, month, weekStart = 1) {
	const first = `${year}-${String(month).padStart(2, '0')}-01`;
	const last = iso(new Date(Date.UTC(year, month, 0, 12)));
	const start = startOfWeek(first, weekStart);
	const weeks = [];
	for (let w = start; w <= last; w = addDays(w, 7)) weeks.push(Array.from({ length: 7 }, (_, i) => { const d = addDays(w, i); return { date: d, inMonth: d >= first && d <= last }; }));
	return weeks;
}

// Dias exibidos em cada view.
export function viewDays(view, anchor, weekStart = 1) {
	if (view === 'dia') return [anchor];
	const s = startOfWeek(anchor, weekStart);
	if (view === 'semana') return Array.from({ length: 7 }, (_, i) => addDays(s, i));
	if (view === 'semana-util') {
		const mon = startOfWeek(anchor, 1);
		return Array.from({ length: 5 }, (_, i) => addDays(mon, i));
	}
	throw new Error('view sem grade de dias: ' + view);
}

export const overlaps = (ev, from, to) => ev.dateStart && ev.dateStart <= to && (ev.dateEnd || ev.dateStart) >= from;

// Eventos de um dia, com marcação de continuidade para multidiários.
export function eventsOn(events, day) {
	return events.filter(e => overlaps(e, day, day)).map(e => ({ ...e, continuesBefore: e.dateStart < day, continuesAfter: (e.dateEnd || e.dateStart) > day }));
}

// Segmentos de eventos multidiários numa semana (para barras na faixa all-day), em pistas sem colisão.
export function weekSegments(events, days) {
	const from = days[0], to = days[days.length - 1];
	const segs = events.filter(e => overlaps(e, from, to)).map(e => {
		const s = e.dateStart < from ? from : e.dateStart, en = (e.dateEnd || e.dateStart) > to ? to : (e.dateEnd || e.dateStart);
		return { event: e, col: days.indexOf(s), span: diffDays(s, en) + 1, continuesBefore: e.dateStart < from, continuesAfter: (e.dateEnd || e.dateStart) > to };
	}).sort((a, b) => a.col - b.col || b.span - a.span);
	const lanes = [];
	for (const seg of segs) {
		let lane = lanes.findIndex(l => l.every(o => seg.col >= o.col + o.span || seg.col + seg.span <= o.col));
		if (lane < 0) { lane = lanes.length; lanes.push([]); }
		lanes[lane].push(seg);
		seg.lane = lane;
	}
	return { segments: segs, lanes: lanes.length };
}

// Agenda: lista cronológica agrupada por data de início.
export function agenda(events, from, to) {
	return events.filter(e => overlaps(e, from, to)).sort((a, b) => a.dateStart.localeCompare(b.dateStart) || a.title.localeCompare(b.title));
}
