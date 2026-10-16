// Parser CSV RFC 4180 (aspas, vírgulas, quebras de linha dentro de campos, BOM). Sem dependências.
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

// Registros crus (arrays), sem cabeçalho — útil para validar contagem de colunas.
export function parseCsvRows(text) {
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
	if (q) throw new Error('CSV inválido: aspas não fechadas');
	return rows;
}
