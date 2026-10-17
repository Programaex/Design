// Itens normalizados de duas fontes — clone do workbook (snapshot) e issue do GitHub (ao vivo) —
// e a mesclagem em que o GitHub, fonte de verdade, sobrepõe o snapshot campo a campo.
import { cleanTitle, coFromLabels, ownerFromLabels, parseBody, typeFromLabels } from './parse.mjs';

const num = id => (id ? Number(String(id).match(/(\d+)$/)?.[1]) || null : null);
const REPO_URL = 'https://github.com/Programaex/workbook/issues/';

// Clone do workbook (front matter + corpo) + linha do plano (frente, prioridade, horas) ligada pelo alias TSK.
export function itemFromWorkbook({ data, body }, planRow = null) {
	const b = parseBody(body);
	const labels = data.labels || [];
	const number = Number(data.github_number);
	return {
		number,
		id: data.id,
		type: data.type === 'subissue' ? 'subissue' : data.type,
		parent: num(data.parent),
		title: cleanTitle(data.title || '').title,
		alias: (data.aliases || [])[0] || null,
		start: data.start_date || b.start,
		due: data.due_date || b.due,
		dueWindow: b.dueWindow,
		state: ['done', 'cancelled'].includes(data.status) ? 'closed' : 'open',
		frente: planRow?.cluster_nome || b.frente || (data.type === 'gate' ? 'Pontos de decisão' : null),
		prioridade: planRow?.prioridade || b.prioridade,
		horas: b.horas,
		blockedBy: b.blockedBy,
		checks: b.checks,
		lacunas: b.lacunas,
		owner: data.owner || ownerFromLabels(labels),
		co: data.co_owners || coFromLabels(labels),
		url: data.github_url || REPO_URL + number,
		origin: 'snapshot',
	};
}

// Issue da API REST do GitHub.
export function itemFromGithub(gh, parent = null) {
	const labels = (gh.labels || []).map(l => (typeof l === 'string' ? l : l.name));
	const b = parseBody(gh.body || '');
	const t = cleanTitle(gh.title || '');
	const idLine = (gh.body || '').match(/\*\*ID:\*\*\s*([A-Z]{2}-[A-Z]{2}\.[A-Z]{3}-\d{4})/);
	const alias = (gh.body || '').match(/\*\*Alias:\*\*\s*([A-Z]+-\d+)/);
	return {
		number: gh.number,
		id: idLine ? idLine[1] : null,
		type: typeFromLabels(labels),
		parent,
		title: t.title,
		alias: t.alias || (alias ? alias[1] : null),
		start: b.start,
		due: b.due,
		dueWindow: b.dueWindow,
		state: gh.state === 'closed' ? 'closed' : 'open',
		frente: b.frente || (typeFromLabels(labels) === 'gate' ? 'Pontos de decisão' : null),
		prioridade: b.prioridade,
		horas: b.horas,
		blockedBy: b.blockedBy,
		checks: b.checks,
		lacunas: b.lacunas,
		owner: ownerFromLabels(labels),
		co: coFromLabels(labels),
		url: gh.html_url || REPO_URL + gh.number,
		origin: 'github',
	};
}

// Campos que o GitHub decide quando a issue traz o valor; o resto vem do snapshot.
const LIVE_FIELDS = ['title', 'state', 'start', 'due', 'dueWindow', 'blockedBy', 'checks', 'lacunas', 'owner', 'co', 'url', 'prioridade', 'horas'];
const present = v => v !== null && v !== undefined;

/**
 * snapshot: { epic, items } do snapshot.json para um épico.
 * live: { epic: issueGitHub, subs: [issueGitHub] } ou null quando a consulta falhou.
 * Retorna { epic, items, source, warnings }. Itens só do GitHub entram com outsideSnapshot = true.
 */
export function mergeEpic(snapshot, live, { error = null } = {}) {
	if (!live) {
		return { epic: snapshot.epic, items: snapshot.items.map(i => ({ ...i })), source: 'snapshot', warnings: [error ? `GitHub indisponível (${error}); exibindo o snapshot.` : 'Exibindo o snapshot.'] };
	}
	const byNumber = new Map(snapshot.items.map(i => [i.number, i]));
	const items = [];
	const seen = new Set();
	for (const gh of live.subs) {
		const g = itemFromGithub(gh, snapshot.epic.number);
		const s = byNumber.get(g.number);
		seen.add(g.number);
		if (!s) { items.push({ ...g, outsideSnapshot: true }); continue; }
		const merged = { ...s, origin: 'github' };
		for (const k of LIVE_FIELDS) if (present(g[k])) merged[k] = g[k];
		if (!g.frente && s.frente) merged.frente = s.frente;
		items.push(merged);
	}
	const warnings = [];
	for (const s of snapshot.items) if (!seen.has(s.number)) { items.push({ ...s, missingOnGithub: true }); warnings.push(`#${s.number} está no snapshot e não aparece como sub-issue no GitHub.`); }
	const ge = itemFromGithub(live.epic);
	const epic = { ...snapshot.epic, title: ge.title || snapshot.epic.title, state: ge.state, start: ge.start || snapshot.epic.start, due: ge.due || snapshot.epic.due, co: ge.co.length ? ge.co : snapshot.epic.co, origin: 'github' };
	items.sort((a, b) => a.number - b.number);
	return { epic, items, source: 'github', warnings };
}
