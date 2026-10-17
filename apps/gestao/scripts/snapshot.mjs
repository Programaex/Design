// Gera data/snapshot.json a partir dos clones do workbook (D08_operacoes/tarefas) + registro de tarefas do plano.
// Uso: node scripts/snapshot.mjs --workbook ../../../workbook
import { execFileSync } from 'node:child_process';
import { readdir, readFile, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { itemFromWorkbook } from '../lib/merge.mjs';
import { frontMatter, parseCsv } from '../lib/parse.mjs';

const here = dirname(fileURLToPath(import.meta.url));
const root = join(here, '../../..');
const arg = process.argv.indexOf('--workbook');
const workbook = resolve(arg > 0 ? process.argv[arg + 1] : join(root, '../workbook'));
const PLAN = 'docs/planos/executar-epic01-2026-10-a-2027-04/registro-tarefas-executar-epic01-2026-10-a-2027-04.csv';

const plan = new Map(parseCsv(await readFile(join(root, PLAN), 'utf8')).map(r => [r.tarefa_id, r]));
const dir = join(workbook, 'D08_operacoes/tarefas');
const items = [];
for (const f of (await readdir(dir)).filter(f => /^(EP|GT|IS|SI)-/.test(f)).sort()) {
	const fm = frontMatter(await readFile(join(dir, f), 'utf8'));
	items.push(itemFromWorkbook(fm, plan.get((fm.data.aliases || [])[0]) || null));
}

const epics = {};
for (const e of items.filter(i => i.type === 'epic')) {
	epics[e.number] = { epic: e, items: items.filter(i => i.parent === e.number).sort((a, b) => a.number - b.number) };
}
let commit = null;
try { commit = execFileSync('git', ['rev-parse', '--short', 'HEAD'], { cwd: workbook, encoding: 'utf8' }).trim(); } catch {}

const snapshot = { generatedAt: new Date().toISOString(), source: { workbook: 'Programaex/workbook', commit, plan: PLAN }, epics };
await writeFile(join(here, '../data/snapshot.json'), JSON.stringify(snapshot, null, 2) + '\n');
console.log(`snapshot: ${items.length} itens · ${Object.entries(epics).map(([n, e]) => `#${n}: ${e.items.length}`).join(' · ')} · workbook ${commit}`);
