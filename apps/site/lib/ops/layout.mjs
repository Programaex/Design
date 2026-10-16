// Layouts determinísticos em SVG: árvore (mapa mental LR/TB/bilateral) e camadas (DAG de workflow).
// A orientação só muda posições; relações e IDs ficam intactos.
export const NODE = { w: 220, h: 56, gapX: 64, gapY: 16 };

export function childrenMap(nodes) {
	const map = new Map(nodes.map(n => [n.id, []]));
	for (const n of nodes) if (n.parentId && map.has(n.parentId)) map.get(n.parentId).push(n);
	for (const list of map.values()) list.sort((a, b) => (a.tier1 ?? 0) - (b.tier1 ?? 0) || (a.tier2 ?? 0) - (b.tier2 ?? 0) || String(a.id).localeCompare(String(b.id)));
	return map;
}

// Contagem de descendentes (badge de grupo recolhido).
export function descendants(kids, id) {
	let n = 0;
	const stack = [...(kids.get(id) || [])];
	while (stack.length) { const c = stack.pop(); n++; stack.push(...(kids.get(c.id) || [])); }
	return n;
}

// Caminho raiz → nó (para a busca expandir até o resultado).
export function pathTo(nodes, id) {
	const byId = new Map(nodes.map(n => [n.id, n]));
	const out = [];
	for (let n = byId.get(id); n; n = n.parentId ? byId.get(n.parentId) : null) out.unshift(n.id);
	return out;
}

/**
 * Árvore "tidy" simples: folhas recebem posições sequenciais no eixo cruzado; pais ficam centrados.
 * direction: 'LR' | 'TB' | 'bilateral' (filhos de 1º nível alternam lados).
 * expanded: Set de IDs cujos filhos aparecem. Retorna { items: [{node,x,y,side,collapsedCount}], links, bounds }.
 */
export function treeLayout(rootId, nodes, { direction = 'LR', expanded = new Set(), node = NODE } = {}) {
	const kids = childrenMap(nodes);
	const byId = new Map(nodes.map(n => [n.id, n]));
	const visibleKids = id => (expanded.has(id) ? kids.get(id) || [] : []);
	const items = [], links = [];
	const along = direction === 'TB' ? node.h + node.gapX : node.w + node.gapX; // distância entre níveis
	const across = direction === 'TB' ? node.w + node.gapY : node.h + node.gapY; // distância entre irmãos

	function place(id, depth, side, cursor) {
		const ch = visibleKids(id);
		let pos;
		if (!ch.length) { pos = cursor.v; cursor.v += across; }
		else {
			const ps = ch.map(c => place(c.id, depth + 1, side, cursor));
			pos = (ps[0] + ps[ps.length - 1]) / 2;
			for (const c of ch) links.push({ source: id, target: c.id });
		}
		const d = depth * along * side;
		const [x, y] = direction === 'TB' ? [pos, d] : [d, pos];
		items.push({ node: byId.get(id), x, y, side, depth, collapsedCount: expanded.has(id) ? 0 : descendants(kids, id), hasChildren: (kids.get(id) || []).length > 0 });
		return pos;
	}

	if (direction === 'bilateral') {
		const first = visibleKids(rootId);
		const right = first.filter((_, i) => i % 2 === 0), left = first.filter((_, i) => i % 2 === 1);
		const side = (list, s) => { const cur = { v: 0 }; list.forEach(c => place(c.id, 1, s, cur)); return { height: cur.v }; };
		const R = side(right, 1), L = side(left, -1);
		// centraliza os dois lados verticalmente em torno da raiz
		const off = h => -Math.max(0, h - across) / 2;
		for (const it of items) it.y += it.side === 1 ? off(R.height) : off(L.height);
		const root = byId.get(rootId);
		items.push({ node: root, x: 0, y: 0, side: 0, depth: 0, collapsedCount: expanded.has(rootId) ? 0 : descendants(kids, rootId), hasChildren: (kids.get(rootId) || []).length > 0 });
		for (const c of first) links.push({ source: rootId, target: c.id });
	} else place(rootId, 0, 1, { v: 0 });

	const xs = items.map(i => i.x), ys = items.map(i => i.y);
	const bounds = items.length ? { x: Math.min(...xs), y: Math.min(...ys), width: Math.max(...xs) - Math.min(...xs) + node.w, height: Math.max(...ys) - Math.min(...ys) + node.h } : { x: 0, y: 0, width: 0, height: 0 };
	return { items, links, bounds };
}

// DAG em camadas pelo caminho mais longo (para workflow de tarefas com dependências FS).
export function dagLayout(tasks, deps, { direction = 'LR', node = NODE } = {}) {
	const ids = new Set(tasks.map(t => t.id));
	const preds = new Map(tasks.map(t => [t.id, []]));
	for (const d of deps) if (ids.has(d.predecessorId) && ids.has(d.successorId)) preds.get(d.successorId).push(d.predecessorId);
	const layer = new Map();
	const depth = (id, seen = new Set()) => {
		if (layer.has(id)) return layer.get(id);
		if (seen.has(id)) return 0; // proteção; ciclos são rejeitados antes
		seen.add(id);
		const v = preds.get(id).length ? 1 + Math.max(...preds.get(id).map(p => depth(p, seen))) : 0;
		layer.set(id, v);
		return v;
	};
	tasks.forEach(t => depth(t.id));
	const cols = new Map();
	for (const t of [...tasks].sort((a, b) => (a.plannedStart || '9999').localeCompare(b.plannedStart || '9999') || a.id.localeCompare(b.id))) {
		const l = layer.get(t.id);
		(cols.get(l) || cols.set(l, []).get(l)).push(t);
	}
	const items = [];
	for (const [l, list] of cols) list.forEach((t, i) => {
		const a = l * (direction === 'TB' ? node.h + node.gapX : node.w + node.gapX);
		const c = i * (direction === 'TB' ? node.w + node.gapY : node.h + node.gapY);
		items.push({ task: t, x: direction === 'TB' ? c : a, y: direction === 'TB' ? a : c, layer: l });
	});
	const links = deps.filter(d => ids.has(d.predecessorId) && ids.has(d.successorId)).map(d => ({ id: d.id, source: d.predecessorId, target: d.successorId }));
	const xs = items.map(i => i.x), ys = items.map(i => i.y);
	const bounds = items.length ? { x: Math.min(...xs), y: Math.min(...ys), width: Math.max(...xs) - Math.min(...xs) + node.w, height: Math.max(...ys) - Math.min(...ys) + node.h } : { x: 0, y: 0, width: 0, height: 0 };
	return { items, links, bounds };
}
