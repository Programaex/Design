// Leitura dos registros de tarefa: front matter dos clones do workbook e corpo Markdown das issues do GitHub.
// O mesmo corpo existe nos dois lugares, então as funções de corpo servem às duas fontes.

const list = v => v.replace(/^\[|\]$/g, '').split(',').map(s => s.trim()).filter(Boolean);

// Subconjunto de YAML usado pelo template tarefa.md: escalares, strings entre aspas e listas [a, b].
export function frontMatter(md) {
	const m = md.match(/^---\n([\s\S]*?)\n---\n?([\s\S]*)$/);
	if (!m) return { data: {}, body: md };
	const data = {};
	for (const line of m[1].split('\n')) {
		const kv = line.match(/^([a-z_]+):\s?(.*)$/);
		if (!kv) continue;
		let v = kv[2].trim();
		if (v.startsWith('[')) v = list(v);
		else if (/^".*"$/.test(v)) v = v.slice(1, -1).replace(/\\"/g, '"');
		else if (v === '' || v === 'null') v = null;
		data[kv[1]] = v;
	}
	return { data, body: m[2] };
}

const ISO = /\d{4}-\d{2}-\d{2}/;
const field = (body, name) => (body.match(new RegExp(`\\*\\*${name}:\\*\\*\\s*([^·\\n]+)`)) || [])[1]?.trim() ?? null;

// Campos do corpo: datas, frente, prioridade, horas, bloqueio, checklist e lacunas.
export function parseBody(body = '') {
	const ini = field(body, 'Início');
	const prazo = field(body, 'Prazo');
	const horas = field(body, 'Tempo estimado');
	const bloq = body.match(/\*\*Bloqueada por:\*\*\s*#(\d+)/);
	const passos = body.match(/## Passos\n([\s\S]*?)(?:\n## |\n\*\*|$)/);
	const checks = [...(passos ? passos[1] : body).matchAll(/^- \[( |x|X)\] /gm)];
	const lac = body.match(/## Lacunas\n([\s\S]*?)(?:\n\n|\n## |$)/);
	return {
		start: ini && ISO.test(ini) ? ini.match(ISO)[0] : null,
		due: prazo && ISO.test(prazo) && !/a definir/i.test(prazo) ? prazo.match(ISO)[0] : null,
		dueWindow: prazo && /a definir/i.test(prazo) ? [...prazo.matchAll(/\d{4}-\d{2}-\d{2}/g)].map(x => x[0]) : null,
		frente: field(body, 'Frente'),
		prioridade: field(body, 'Prioridade'),
		horas: horas ? Number(horas.replace(',', '.').replace(/h.*$/, '')) || null : null,
		blockedBy: bloq ? Number(bloq[1]) : null,
		checks: { done: checks.filter(c => c[1] !== ' ').length, total: checks.length },
		lacunas: lac ? lac[1].split('\n').map(l => l.replace(/^- /, '').trim()).filter(Boolean) : [],
	};
}

const TYPE_BY_LABEL = { 'tipo:epic': 'epic', 'tipo:gate': 'gate', 'tipo:issue': 'issue', 'tipo:sub-issue': 'subissue' };

export const typeFromLabels = labels => labels.map(l => TYPE_BY_LABEL[l]).find(Boolean) || 'issue';
export const coFromLabels = labels => labels.filter(l => l.startsWith('co:')).map(l => l.slice(3));
export const ownerFromLabels = labels => (labels.find(l => l.startsWith('owner:')) || '').slice(6) || null;

// Título sem prefixo "[GATE-NN]"/"[EPIC]" e o alias que ele traz.
export function cleanTitle(title = '') {
	const m = title.match(/^\[([^\]]+)\]\s*(.*)$/);
	if (!m) return { title, alias: null };
	return { title: m[2], alias: /^GATE-\d+$/.test(m[1]) ? m[1] : null };
}

// CSV RFC 4180 (aspas, vírgulas e quebras de linha dentro de células).
export function parseCsv(text) {
	const rows = [];
	let row = [], cell = '', q = false;
	for (let i = 0; i < text.length; i++) {
		const c = text[i];
		if (q) {
			if (c === '"' && text[i + 1] === '"') { cell += '"'; i++; }
			else if (c === '"') q = false;
			else cell += c;
		} else if (c === '"') q = true;
		else if (c === ',') { row.push(cell); cell = ''; }
		else if (c === '\n') { row.push(cell); rows.push(row); row = []; cell = ''; }
		else if (c !== '\r') cell += c;
	}
	if (cell || row.length) { row.push(cell); rows.push(row); }
	const [head, ...rest] = rows;
	return rest.filter(r => r.length > 1).map(r => Object.fromEntries(head.map((h, i) => [h, r[i] ?? ''])));
}
