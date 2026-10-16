// Geradores de dados do CMS, executados no build (Node). Sem dependência de navegador.
import { marked } from 'marked';

// ---------- CSV ----------
export function parseCsv(text) {
	text = text.replace(/^\uFEFF/, '');
	const rows = [];
	let row = [], cell = '', q = false;
	for (let i = 0; i < text.length; i++) {
		const ch = text[i];
		if (q) {
			if (ch === '"' && text[i + 1] === '"') { cell += '"'; i++; }
			else if (ch === '"') q = false;
			else cell += ch;
		} else if (ch === '"') q = true;
		else if (ch === ',') { row.push(cell); cell = ''; }
		else if (ch === '\n' || ch === '\r') {
			if (ch === '\r' && text[i + 1] === '\n') i++;
			row.push(cell); cell = '';
			if (row.some(c => c !== '')) rows.push(row);
			row = [];
		} else cell += ch;
	}
	if (cell !== '' || row.length) { row.push(cell); if (row.some(c => c !== '')) rows.push(row); }
	const [head, ...body] = rows;
	return body.map(r => Object.fromEntries(head.map((h, k) => [h, r[k] ?? ''])));
}

// ---------- Rotas ----------
const split = v => (v ? v.split('|').filter(Boolean) : []);
export function parseRoutes(csv) {
	return parseCsv(csv).map(r => ({
		id: r.id, parent: r.parent_id, title: r.titulo, url: r.url, type: r.tipo, group: r.grupo_hamburguer,
		nav: split(r.navegacao), order: Number(r.ordem), access: r.acesso, index: r.indexar === 'sim',
		template: r.template, filters: split(r.filtros_permitidos), components: split(r.componentes), note: r.instrucao_agente,
	}));
}

// ---------- MDX ----------
function parseFrontmatter(src) {
	const m = src.match(/^---\n([\s\S]*?)\n---\n?/);
	if (!m) return { data: {}, body: src };
	const data = {};
	for (const line of m[1].split('\n')) {
		const kv = line.match(/^(\w+):\s*(.*)$/);
		if (!kv) continue;
		const v = kv[2].trim();
		data[kv[1]] = v.startsWith('[') ? JSON.parse(v) : v.replace(/^"(.*)"$/, '$1');
	}
	return { data, body: src.slice(m[0].length) };
}

const COMPONENT = /<(PlainTextPanel|AsciiDiagram)\b([^>]*)>\s*\{`([\s\S]*?)`\}\s*<\/\1>/g;
const attrs = s => Object.fromEntries([...s.matchAll(/(\w+)="([^"]*)"/g)].map(m => [m[1], m[2]]));
const slugify = s => s.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

// Converte MDX em segmentos: {t:'html'} para markdown e {t:'panel'|'ascii'} para os componentes.
export function parseMdx(src) {
	const { data, body } = parseFrontmatter(src.replace(/\r\n/g, '\n'));
	const clean = body.replace(/^import .*$/gm, '').replace(/^# .*\n/m, ''); // o título vem do frontmatter
	const segments = [];
	let last = 0;
	const pushMd = md => {
		if (!md.trim()) return;
		for (const part of md.split(/^(?=## )/m)) {
			if (!part.trim()) continue;
			const h = part.match(/^## (.*)$/m);
			const html = marked.parse(part, { gfm: true })
				.replace(/<h2>/, h ? `<h2 id="${slugify(h[1])}">` : '<h2>')
				.replace(/<a href="(https?:[^"]+)"/g, '<a href="$1" target="_blank" rel="noreferrer"');
			segments.push({ t: 'html', html, heading: h ? h[1] : null });
		}
	};
	for (const m of clean.matchAll(COMPONENT)) {
		pushMd(clean.slice(last, m.index));
		const a = attrs(m[2]);
		segments.push({ t: m[1] === 'AsciiDiagram' ? 'ascii' : 'panel', id: a.id, kind: a.kind, title: a.title, text: m[3] });
		last = m.index + m[0].length;
	}
	pushMd(clean.slice(last));
	const words = clean.replace(/<[^>]+>/g, ' ').split(/\s+/).filter(Boolean).length;
	const sources = segments.filter(s => s.t === 'panel' && s.kind === 'evidence').flatMap(s => s.text.split('\n').filter(Boolean));
	return { ...data, readingMinutes: Math.max(1, Math.round(words / 200)), segments, sources };
}

// Insere os anexos (figura após a seção indicada) e devolve o artigo pronto para o renderer.
export function attachArticle(article, att = {}) {
	const segments = [...article.segments];
	if (att.figure) {
		const at = segments.findIndex(s => s.heading === att.figure.after);
		segments.splice(at < 0 ? segments.length : at + 1, 0, { t: 'figure', ...att.figure });
	}
	return { ...article, code: att.id || null, cover: att.cover || null, segments };
}

// ---------- Pastas (taxonomia D01–D16) ----------
export function parseFolders(csv) {
	return parseCsv(csv).map(r => ({ id: r.id, title: r.canonical_name, slug: r.name, status: r.status, source: r.source_ref, notes: r.notes }));
}

// Atribui cada arquivo de documentação a uma pasta pela primeira regra que casar.
export function assignFolder(path, rules) {
	for (const r of rules) if (new RegExp(r.match).test(path)) return r.folder;
	return null;
}

// ---------- Completude (macro → meso → micro) ----------
// Macro = grupo do CSV; meso = rota; micro = bloco do blueprint da rota (cada um nasce com lorem/placeholder).
export function buildCompleteness(routes, blueprints) {
	const macros = [];
	const byGroup = new Map();
	for (const r of routes) {
		if (!byGroup.has(r.group)) { const m = { id: slugify(r.group), title: r.group, mesos: [] }; byGroup.set(r.group, m); macros.push(m); }
		const bp = blueprints[r.id];
		const blocks = bp ? bp.blocks : [];
		const seen = {};
		const micros = blocks.map(type => {
			seen[type] = (seen[type] || 0) + 1;
			const key = `${r.id}:${type}${seen[type] > 1 ? '-' + seen[type] : ''}`;
			return { id: key, title: `${type}${seen[type] > 1 ? ' ' + seen[type] : ''}: substituir lorem, placeholders e imagens` };
		});
		if (!micros.length) micros.push({ id: `${r.id}:conteudo`, title: 'Definir conteúdo real da rota' });
		byGroup.get(r.group).mesos.push({ id: r.id, title: r.title, url: r.url, type: r.type, micros });
	}
	return macros;
}

// blueprints.js do ecossistema ("window.ECO_BP = {...};") → objeto { routeId: { blocks, ... } }.
export function parseEcoBlueprints(js) {
	const m = js.match(/window\.ECO_BP\s*=\s*(\{[\s\S]*\})\s*;?\s*$/);
	if (!m) throw new Error('blueprints.js: window.ECO_BP não encontrado');
	return JSON.parse(m[1]);
}
