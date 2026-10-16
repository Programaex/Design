// Modelo operacional compartilhado (ADR-001/002): pesquisa (árvore) e planejamento (DAG) separados,
// views como projeções. Funções puras: recebem o documento e devolvem um novo documento (ou um erro).
import { eventForTask } from './editorial.mjs';

export const SCHEMA_VERSION = '1.0.0';
export const TASK_STATUSES = ['unconfirmed', 'pending', 'ready', 'running', 'completed', 'error', 'blocked'];
export const DONE = new Set(['completed']);

export function emptyDoc() {
	return { schemaVersion: SCHEMA_VERSION, revision: 0, datasets: [], nodes: [], edges: [], tasks: [], dependencies: [], events: [], evidence: [], history: [], batches: [], runs: [] };
}

const clone = doc => structuredClone(doc);
const now = () => new Date().toISOString();
const fail = message => ({ error: message });

// ---------- Pesquisa ----------
// Importa um resultado de parseAlsoAsked como um lote. Mesmo hash = reimportação reconhecida (sem duplicar).
// Mesmo dataset com arquivo alterado = nova versão (novo datasetId), nunca sobrescreve pelo ordinal.
export function importDataset(doc, parsed, { author = 'cms' } = {}) {
	if (parsed.errors?.length) return fail('Importação com erros não é aplicada.');
	if (doc.datasets.some(d => d.sha256 === parsed.dataset.sha256)) return { doc, status: 'duplicate', datasetId: doc.datasets.find(d => d.sha256 === parsed.dataset.sha256).id };
	const next = clone(doc);
	let { dataset, nodes, edges } = parsed;
	const versions = next.datasets.filter(d => d.baseId === dataset.id || d.id === dataset.id).length;
	if (versions) {
		const vid = `${dataset.id}-V${versions + 1}`;
		const re = id => id.replace(dataset.id + '-', vid + '-');
		nodes = nodes.map(n => ({ ...n, id: re(n.id), parentId: n.parentId && re(n.parentId), datasetId: vid }));
		edges = edges.map(e => ({ ...e, id: re(e.id), source: re(e.source), target: re(e.target) }));
		dataset = { ...dataset, baseId: dataset.id, id: vid, previousId: next.datasets.filter(d => d.baseId === dataset.id || d.id === dataset.id).at(-1).id };
	}
	const batch = { id: `B-${String(next.batches.length + 1).padStart(3, '0')}`, kind: 'import', datasetId: dataset.id, createdAt: now(), author, nodeIds: nodes.map(n => n.id), edgeIds: edges.map(e => e.id) };
	next.datasets.push({ ...dataset, batchId: batch.id });
	next.nodes.push(...nodes);
	next.edges.push(...edges);
	next.batches.push(batch);
	next.revision++;
	return { doc: next, status: versions ? 'new-version' : 'imported', datasetId: dataset.id, batchId: batch.id };
}

// Desfaz um lote inteiro (dataset, nós e relações). Tarefas convertidas perdem só o vínculo de origem.
export function undoBatch(doc, batchId) {
	const b = doc.batches.find(x => x.id === batchId && !x.undoneAt);
	if (!b) return fail('Lote inexistente ou já desfeito.');
	const next = clone(doc);
	const nodes = new Set(b.nodeIds), edges = new Set(b.edgeIds);
	next.nodes = next.nodes.filter(n => !nodes.has(n.id));
	next.edges = next.edges.filter(e => !edges.has(e.id));
	next.datasets = next.datasets.filter(d => d.batchId !== batchId);
	for (const t of next.tasks) if (nodes.has(t.sourceNodeId)) t.sourceNodeId = null;
	next.batches.find(x => x.id === batchId).undoneAt = now();
	next.revision++;
	return { doc: next };
}

// Novo nó criado no editor do mapa (filho ou irmão). Hierarquia: um pai por nó, mesmo dataset.
export function addNode(doc, { parentId, title, datasetId }) {
	const parent = parentId && doc.nodes.find(n => n.id === parentId);
	if (parentId && !parent) return fail('Pai inexistente.');
	const ds = parent ? parent.datasetId : datasetId;
	if (!ds) return fail('Informe o dataset.');
	if (!title?.trim()) return fail('Título obrigatório.');
	const next = clone(doc);
	const n = next.nodes.filter(x => x.id.startsWith(ds + '-X')).length + 1;
	const node = { id: `${ds}-X${String(n).padStart(3, '0')}`, datasetId: ds, parentId: parent?.id || null, title: title.trim(), type: parent ? 'question' : 'topic', answer: '', answerStatus: 'missing', lockedFields: [], sourceRecord: null, sourceFile: null, editorialReview: 'pending', createdInCms: true };
	next.nodes.push(node);
	if (parent) next.edges.push({ id: `${ds}-XE${String(n).padStart(3, '0')}`, source: parent.id, target: node.id, type: 'parent-child' });
	next.revision++;
	return { doc: next, node };
}

// Pergunta → tarefa: ação explícita, mantém sourceNodeId; não cria dependências a partir da hierarquia.
export function convertQuestionToTask(doc, nodeId, { projectId = 'executar-lancamento', author = 'cms' } = {}) {
	const node = doc.nodes.find(n => n.id === nodeId);
	if (!node) return fail('Nó inexistente.');
	if (doc.tasks.some(t => t.sourceNodeId === nodeId)) return fail('Esta pergunta já tem tarefa.');
	const next = clone(doc);
	const task = { id: 'T-' + nodeId, projectId, title: node.title, status: 'pending', ownerId: null, plannedStart: null, plannedEnd: null, originalStart: null, originalEnd: null, dateKind: 'exact', timezone: 'America/Sao_Paulo', phase: 'Pesquisa', categoryId: 'outros', channel: '', flags: [], sourceNodeId: nodeId, workflowNodeId: null, instruction: '', expectedOutput: '', requiredEvidence: '', completedAt: null, revision: 0 };
	next.tasks.push(task);
	next.history.push({ at: now(), author, taskId: task.id, field: 'created', before: null, after: 'from ' + nodeId });
	next.revision++;
	return { doc: next, task };
}

// ---------- Planejamento ----------
export function wouldCycle(deps, predecessorId, successorId) {
	if (predecessorId === successorId) return true;
	const out = new Map();
	for (const d of deps) (out.get(d.predecessorId) || out.set(d.predecessorId, []).get(d.predecessorId)).push(d.successorId);
	// existe caminho successor → … → predecessor?
	const stack = [successorId], seen = new Set();
	while (stack.length) {
		const id = stack.pop();
		if (id === predecessorId) return true;
		if (seen.has(id)) continue;
		seen.add(id);
		stack.push(...(out.get(id) || []));
	}
	return false;
}

export function addDependency(doc, predecessorId, successorId) {
	if (!doc.tasks.some(t => t.id === predecessorId) || !doc.tasks.some(t => t.id === successorId)) return fail('Dependência só liga tarefas (perguntas precisam ser convertidas antes).');
	if (doc.dependencies.some(d => d.predecessorId === predecessorId && d.successorId === successorId)) return fail('Dependência já existe.');
	if (wouldCycle(doc.dependencies, predecessorId, successorId)) return fail(`Ciclo: ${successorId} já leva a ${predecessorId}.`);
	const next = clone(doc);
	next.dependencies.push({ id: `D-${predecessorId}-${successorId}`, predecessorId, successorId, type: 'finish-to-start' });
	next.revision++;
	return { doc: next };
}

export function removeDependency(doc, id) {
	const next = clone(doc);
	next.dependencies = next.dependencies.filter(d => d.id !== id);
	next.revision++;
	return { doc: next };
}

const FIELDS = ['title', 'status', 'ownerId', 'plannedStart', 'plannedEnd', 'dateKind', 'channel', 'categoryId', 'instruction', 'expectedOutput', 'requiredEvidence', 'phase'];

// Atualiza a tarefa (qualquer view) + projeção do evento + histórico. Datas originais nunca são apagadas.
export function updateTask(doc, taskId, patch, { author = 'cms', expectedRevision } = {}) {
	const t = doc.tasks.find(x => x.id === taskId);
	if (!t) return fail('Tarefa inexistente.');
	if (expectedRevision != null && expectedRevision !== t.revision) return fail(`Conflito: a tarefa mudou (revisão ${t.revision}).`);
	const p = Object.fromEntries(Object.entries(patch).filter(([k]) => FIELDS.includes(k)));
	const start = p.plannedStart !== undefined ? p.plannedStart : t.plannedStart;
	const end = p.plannedEnd !== undefined ? p.plannedEnd : t.plannedEnd;
	if (start && end && end < start) return fail('Fim antes do início.');
	if (!(p.title ?? t.title)?.trim()) return fail('Título obrigatório.');
	const next = clone(doc);
	const task = next.tasks.find(x => x.id === taskId);
	for (const [k, v] of Object.entries(p)) {
		if (task[k] === v) continue;
		next.history.push({ at: now(), author, taskId, field: k, before: task[k], after: v });
		task[k] = v;
	}
	if (p.status === 'completed' && !task.completedAt) task.completedAt = now();
	if (p.status && p.status !== 'completed') task.completedAt = null;
	task.revision++;
	const ev = eventForTask(task);
	const i = next.events.findIndex(e => e.taskId === taskId);
	if (task.plannedStart) { if (i >= 0) next.events[i] = ev; else next.events.push(ev); }
	else if (i >= 0) next.events.splice(i, 1);
	next.revision++;
	return { doc: next, task };
}

// Dependências FS violadas: FS exige início do sucessor >= término do predecessor (granularidade de dia).
export function fsViolations(doc, overrides = {}) {
	const get = id => ({ ...doc.tasks.find(t => t.id === id), ...(overrides[id] || {}) });
	return doc.dependencies.filter(d => {
		const a = get(d.predecessorId), b = get(d.successorId);
		return a.plannedEnd && b.plannedStart && b.plannedStart < a.plannedEnd;
	});
}

// Diff de cascata proposto ao mover uma tarefa: empurra sucessores o mínimo necessário (não aplica sozinho).
export function cascadeDiff(doc, taskId, start, end) {
	const addDays = (d, n) => { const x = new Date(d + 'T12:00:00Z'); x.setUTCDate(x.getUTCDate() + n); return x.toISOString().slice(0, 10); };
	const span = (s, e) => Math.round((new Date(e + 'T12:00:00Z') - new Date(s + 'T12:00:00Z')) / 864e5);
	const planned = { [taskId]: { plannedStart: start, plannedEnd: end } };
	const queue = [taskId];
	while (queue.length) {
		const id = queue.shift();
		const endOf = planned[id]?.plannedEnd ?? doc.tasks.find(t => t.id === id).plannedEnd;
		for (const d of doc.dependencies.filter(x => x.predecessorId === id)) {
			const s = doc.tasks.find(t => t.id === d.successorId);
			const curStart = planned[s.id]?.plannedStart ?? s.plannedStart;
			if (!curStart || !endOf || curStart >= endOf) continue;
			const ns = endOf;
			planned[s.id] = { plannedStart: ns, plannedEnd: addDays(ns, s.plannedEnd ? span(curStart, s.plannedEnd) : 0) };
			queue.push(s.id);
		}
	}
	return Object.entries(planned).map(([id, v]) => { const t = doc.tasks.find(x => x.id === id); return { id, title: t.title, before: [t.plannedStart, t.plannedEnd], after: [v.plannedStart, v.plannedEnd] }; });
}

// Seed inicial: datasets importados + tarefas editoriais.
export function seedDoc(parsedDatasets, editorial) {
	let doc = emptyDoc();
	for (const p of parsedDatasets) doc = importDataset(doc, p, { author: 'seed' }).doc;
	doc.tasks = editorial.tasks;
	doc.events = editorial.events;
	doc.history = editorial.history;
	doc.revision = 1;
	return doc;
}
