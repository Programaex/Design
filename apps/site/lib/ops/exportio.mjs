// Round-trip de entidades e relações (FR-19): JSON fiel (schemaVersion + IDs) e CSV para planilhas
// com neutralização de fórmulas (células iniciadas por = + - @ recebem apóstrofo).
import { parseCsv } from '../csv.mjs';
import { SCHEMA_VERSION } from './model.mjs';

export const ENTITIES = ['datasets', 'nodes', 'edges', 'tasks', 'dependencies', 'events', 'evidence', 'history'];

export function exportJson(doc) {
	return JSON.stringify({ schemaVersion: SCHEMA_VERSION, exportedAt: new Date().toISOString(), ...Object.fromEntries(ENTITIES.map(k => [k, doc[k] || []])) }, null, 2);
}

export function importJson(text) {
	let data;
	try { data = JSON.parse(text); } catch { return { error: 'JSON inválido.' }; }
	const [major] = String(data.schemaVersion || '').split('.');
	if (major !== SCHEMA_VERSION.split('.')[0]) return { error: `schemaVersion ${data.schemaVersion || 'ausente'} incompatível com ${SCHEMA_VERSION}.` };
	const missing = ENTITIES.filter(k => !Array.isArray(data[k]));
	if (missing.length) return { error: 'Coleções ausentes: ' + missing.join(', ') };
	const ids = new Set();
	for (const k of ENTITIES) for (const r of data[k]) {
		if (r.id == null) continue;
		const key = k + ':' + r.id;
		if (ids.has(key)) return { error: `ID repetido em ${k}: ${r.id}` };
		ids.add(key);
	}
	return { data };
}

export const neutralize = v => {
	const s = v == null ? '' : typeof v === 'object' ? JSON.stringify(v) : String(v);
	return /^[=+\-@]/.test(s) ? "'" + s : s;
};

export function toCsv(rows, columns = rows.length ? Object.keys(rows[0]) : []) {
	const esc = v => (/[",\n\r]/.test(v) ? '"' + v.replace(/"/g, '""') + '"' : v);
	return '﻿' + [columns.join(','), ...rows.map(r => columns.map(c => esc(neutralize(r[c]))).join(','))].join('\n') + '\n';
}

export const fromCsv = text => parseCsv(text);
