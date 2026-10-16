// editorial_workflow.csv (derivado do DOC-002) → Task + CalendarEvent vinculados (SPEC-01).
// Preserva planned_date_raw, source_cells_json e quality_flags. new_planned_* entra como replanejamento com
// histórico; as datas originais continuam guardadas. Nada de owner/dependência é inferido.
import { parseCsv } from '../csv.mjs';

export const CATEGORIES = [
	{ id: 'blog', label: 'Blog', match: /^blog$/i },
	{ id: 'shorts', label: 'YouTube Shorts', match: /shorts|youtube/i },
	{ id: 'instagram', label: 'Instagram', match: /^instagram$/i },
	{ id: 'linkedin', label: 'LinkedIn', match: /linkedin/i },
	{ id: 'threads', label: 'Threads / X', match: /threads|(^|\W)x$/i },
	{ id: 'newsletter', label: 'Newsletter', match: /newsletter/i },
	{ id: 'multi', label: 'Multicanal', match: /multi|,/i },
	{ id: 'owned', label: 'Owned', match: /owned/i },
	{ id: 'outros', label: 'Sem canal', match: /.*/ },
];
export const categoryOf = channel => {
	const c = (channel || '').trim();
	if (!c || c === '—') return 'outros';
	if (c.includes(',')) return 'multi';
	return CATEGORIES.find(x => x.match.test(c)).id;
};

const parseJson = (s, fallback) => { try { return JSON.parse(s); } catch { return fallback; } };

export function editorialToTasks(csvText, { projectId = 'executar-lancamento' } = {}) {
	const rows = parseCsv(csvText);
	const tasks = [], events = [], history = [];
	for (const r of rows) {
		const flags = r.quality_flags ? r.quality_flags.split(';').filter(Boolean) : [];
		const dateKind = r.date_kind === 'window' ? 'window' : 'exact';
		const task = {
			id: r.id, projectId, title: r.title, status: r.status || 'unconfirmed', ownerId: r.owner || null,
			plannedStart: r.planned_start || null, plannedEnd: r.planned_end || null,
			originalStart: r.planned_start || null, originalEnd: r.planned_end || null, plannedDateRaw: r.planned_date_raw,
			dateKind, timezone: r.timezone || 'America/Sao_Paulo', phase: r.week, pillar: r.pillar, pieceType: r.piece_type,
			format: r.format, channel: r.channel, categoryId: categoryOf(r.channel), flags,
			sourceRecord: Number(r.source_record), sourceCells: parseJson(r.source_cells_json, []), sourceNodeId: null, workflowNodeId: null,
			instruction: '', expectedOutput: '', requiredEvidence: '', completedAt: null, revision: 0,
		};
		if (r.new_planned_start || r.new_planned_end) {
			const start = r.new_planned_start || task.plannedStart, end = r.new_planned_end || task.plannedEnd;
			history.push({ at: null, author: 'editorial_workflow.csv', taskId: task.id, field: 'planned', before: [task.plannedStart, task.plannedEnd], after: [start, end] });
			task.plannedStart = start; task.plannedEnd = end;
		}
		tasks.push(task);
		events.push(eventForTask(task));
	}
	return { tasks, events, history };
}

// Projeção estável Task → CalendarEvent (mesmo ID derivado, all-day, sem horário inventado).
export const eventForTask = t => ({
	id: 'EV-' + t.id, taskId: t.id, title: t.title, dateStart: t.plannedStart, dateEnd: t.plannedEnd, allDay: true,
	kind: t.dateKind, categoryId: t.categoryId, channel: t.channel, revision: t.revision,
});
