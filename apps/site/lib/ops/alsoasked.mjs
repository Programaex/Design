// Importador AlsoAsked (SPEC-01): CSV → árvore de perguntas por posições (tier 1, tier 2).
// Regras: (0,0) é a raiz; (a>0,0) liga à raiz; (a>0,b>0) liga a (a,0). "Upgrade to Lite/Pro to unlock" vira campo
// vazio marcado em lockedFields (nunca usado como resposta). Strings ficam como texto. Nada é inventado.
import { parseCsvRows } from '../csv.mjs';

export const LOCK_MARKER = 'Upgrade to Lite/Pro to unlock';
export const EXPECTED_HEADERS = ['question', 'answer', 'url', 'page title', 'tier 1 position', 'tier 2 position', 'region', 'language', 'is AI overview?', 'AI overview URLs', 'AI overview page titles'];
export const LIMITS = { bytes: 5 * 1024 * 1024, records: 5000 };

export async function sha256(text) {
	const buf = await crypto.subtle.digest('SHA-256', new TextEncoder().encode(text));
	return [...new Uint8Array(buf)].map(b => b.toString(16).padStart(2, '0')).join('');
}

// datasetId: "DATA-001__nome.csv" → "DATA-001"; senão usa o nome sem extensão.
export const datasetIdOf = fileName => (fileName.match(/^([A-Z]+-\d+)__/) || [])[1] || fileName.replace(/\.csv$/i, '').replace(/[^A-Za-z0-9-]+/g, '-').toUpperCase();

/**
 * Converte o texto de um CSV AlsoAsked em { dataset, nodes, edges, errors, warnings }.
 * Com erros, nodes/edges vêm vazios: a importação é transacional (nada parcial).
 */
export async function parseAlsoAsked(text, fileName, { datasetId = datasetIdOf(fileName), importedAt = new Date().toISOString() } = {}) {
	const errors = [], warnings = [];
	const bytes = new TextEncoder().encode(text).length;
	if (bytes > LIMITS.bytes) errors.push({ record: null, field: null, message: `Arquivo com ${bytes} bytes excede o limite de ${LIMITS.bytes}.` });
	let rows;
	try { rows = parseCsvRows(text); } catch (e) { return { errors: [{ record: null, field: null, message: e.message }], warnings, nodes: [], edges: [], dataset: null }; }
	const [header = [], ...records] = rows;
	const missing = ['question', 'answer', 'tier 1 position', 'tier 2 position'].filter(h => !header.includes(h));
	if (missing.length) errors.push({ record: 0, field: missing.join(', '), message: 'Cabeçalhos obrigatórios ausentes.' });
	const unknown = header.filter(h => !EXPECTED_HEADERS.includes(h));
	if (unknown.length) warnings.push({ record: 0, field: unknown.join(', '), message: 'Campos desconhecidos preservados em rawFields.' });
	if (records.length > LIMITS.records) errors.push({ record: null, field: null, message: `${records.length} registros excedem o limite de ${LIMITS.records}.` });
	if (errors.length) return { errors, warnings, nodes: [], edges: [], dataset: null };

	const objs = records.map(r => Object.fromEntries(header.map((h, k) => [h, r[k] ?? ''])));
	const positions = new Map();
	const nodes = [];
	objs.forEach((r, i) => {
		const rec = i + 1;
		const a = Number(r['tier 1 position']), b = Number(r['tier 2 position']);
		if (!Number.isInteger(a) || !Number.isInteger(b) || a < 0 || b < 0) { errors.push({ record: rec, field: 'tier position', message: `Posição inválida (${r['tier 1 position']}, ${r['tier 2 position']}).` }); return; }
		if (a === 0 && b > 0) { errors.push({ record: rec, field: 'tier position', message: `Posição (0,${b}) não existe no formato AlsoAsked.` }); return; }
		const key = `${a},${b}`;
		const id = `${datasetId}-N${String(rec).padStart(3, '0')}`;
		if (positions.has(key)) { errors.push({ record: rec, field: 'tier position', message: `Posição (${key}) repetida; já usada pelo registro ${positions.get(key).sourceRecord}.` }); return; }
		const locked = Object.entries(r).filter(([, v]) => v === LOCK_MARKER).map(([k]) => k);
		const val = k => (r[k] === LOCK_MARKER ? '' : r[k] ?? '');
		const node = {
			id, datasetId, parentId: null, title: r.question, type: a === 0 ? 'topic' : 'question', tier1: a, tier2: b,
			answer: val('answer'), answerStatus: locked.includes('answer') ? 'locked' : r.answer ? 'available' : 'missing',
			url: val('url'), pageTitle: val('page title'), lockedFields: locked, sourceRecord: rec, sourceFile: fileName,
			rawFields: r, editorialReview: 'pending',
		};
		positions.set(key, node);
		nodes.push(node);
	});
	if (!positions.has('0,0')) errors.push({ record: null, field: 'tier position', message: 'Raiz (0,0) ausente.' });
	const edges = [];
	for (const n of nodes) {
		if (n.tier1 === 0) continue;
		const parent = n.tier2 === 0 ? positions.get('0,0') : positions.get(`${n.tier1},0`);
		if (!parent) { errors.push({ record: n.sourceRecord, field: 'tier position', message: `Pai (${n.tier1},0) ausente: registro órfão.` }); continue; }
		n.parentId = parent.id;
		edges.push({ id: `${datasetId}-E${String(n.sourceRecord).padStart(3, '0')}`, source: parent.id, target: n.id, type: 'parent-child' });
	}
	if (errors.length) return { errors, warnings, nodes: [], edges: [], dataset: null };
	const dataset = { id: datasetId, name: nodes.find(n => n.tier1 === 0).title, sourceFile: fileName, sha256: await sha256(text), importedAt, schemaVersion: '1.0.0', records: nodes.length, locked: nodes.filter(n => n.lockedFields.length).length };
	return { errors, warnings, nodes, edges, dataset };
}

// Diff contra a versão anterior do mesmo dataset (por posição, que é a identidade do formato).
export function diffDatasets(prevNodes, nextNodes) {
	const key = n => `${n.tier1},${n.tier2}`;
	const before = new Map(prevNodes.map(n => [key(n), n]));
	const after = new Map(nextNodes.map(n => [key(n), n]));
	const added = [...after.keys()].filter(k => !before.has(k)).map(k => after.get(k));
	const removed = [...before.keys()].filter(k => !after.has(k)).map(k => before.get(k));
	const changed = [...after.keys()].filter(k => before.has(k)).filter(k => ['title', 'answer', 'answerStatus', 'url'].some(f => before.get(k)[f] !== after.get(k)[f])).map(k => ({ before: before.get(k), after: after.get(k) }));
	return { added, removed, changed };
}
