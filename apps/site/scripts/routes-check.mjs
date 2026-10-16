// Falha se alguma rota do EXECUTAR_rotas.csv não estiver no site real (routes.js / blueprints.js do ecossistema).
import { readFile } from 'node:fs/promises';
import { parseEcoBlueprints, parseRoutes } from '../lib/content.mjs';

const root = new URL('../../../', import.meta.url);
const read = p => readFile(new URL(p, root), 'utf8');
const csv = parseRoutes(await read('EXECUTAR_Claude_Design/EXECUTAR_rotas.csv'));
const eco = JSON.parse((await read('packages/design-system/ui_kits/ecossistema/routes.js')).match(/window\.ECO_ROUTES\s*=\s*(\[[\s\S]*\])\s*;?\s*$/)[1]);
const bp = parseEcoBlueprints(await read('packages/design-system/ui_kits/ecossistema/blueprints.js'));
const ecoIds = new Set(eco.map(r => r.id));
const problems = [
	...csv.filter(r => !ecoIds.has(r.id)).map(r => `rota ${r.id} (${r.url}) ausente em routes.js`),
	...csv.filter(r => !bp[r.id]).map(r => `rota ${r.id} sem blueprint`),
	...eco.filter(r => !csv.some(c => c.id === r.id)).map(r => `routes.js tem ${r.id}, que não está no CSV`),
];
if (problems.length) { console.error(problems.join('\n')); process.exit(1); }
console.log(`routes:check ok · ${csv.length} rotas`);
