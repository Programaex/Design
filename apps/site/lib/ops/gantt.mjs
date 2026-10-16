// Gantt (SPEC-02): escala dia/semana/mês, agrupamento e posição das barras. Tarefas sem data → "Não agendadas".
import { addDays, diffDays, startOfWeek } from './calendar.mjs';

export const SCALES = { dia: 1, semana: 7, mes: 30 };

export function range(tasks, padDays = 2) {
	const dated = tasks.filter(t => t.plannedStart);
	if (!dated.length) return null;
	const from = dated.map(t => t.plannedStart).sort()[0];
	const to = dated.map(t => t.plannedEnd || t.plannedStart).sort().at(-1);
	return { from: startOfWeek(addDays(from, -padDays)), to: addDays(to, padDays) };
}

// Unidades da escala (colunas do cabeçalho).
export function ticks(r, scale) {
	const out = [];
	if (scale === 'mes') {
		let d = r.from.slice(0, 8) + '01';
		while (d <= r.to) { out.push(d); const [y, m] = d.split('-').map(Number); d = m === 12 ? `${y + 1}-01-01` : `${y}-${String(m + 1).padStart(2, '0')}-01`; }
		return out;
	}
	for (let d = r.from; d <= r.to; d = addDays(d, SCALES[scale])) out.push(d);
	return out;
}

// Barra em fração do intervalo total (0–1), fim inclusivo.
export function bar(task, r) {
	const total = diffDays(r.from, r.to) + 1;
	const s = diffDays(r.from, task.plannedStart);
	const len = diffDays(task.plannedStart, task.plannedEnd || task.plannedStart) + 1;
	return { left: s / total, width: len / total, milestone: !task.plannedEnd || task.plannedEnd === task.plannedStart };
}

export function groupTasks(tasks, by = 'phase') {
	const key = t => (by === 'owner' ? t.ownerId || 'Sem responsável' : by === 'campaign' ? t.projectId : t.phase || 'Sem fase');
	const groups = new Map();
	for (const t of tasks.filter(t => t.plannedStart)) (groups.get(key(t)) || groups.set(key(t), []).get(key(t))).push(t);
	for (const list of groups.values()) list.sort((a, b) => a.plannedStart.localeCompare(b.plannedStart) || a.id.localeCompare(b.id));
	return { groups: [...groups.entries()].map(([name, list]) => ({ name, tasks: list })), unscheduled: tasks.filter(t => !t.plannedStart) };
}
