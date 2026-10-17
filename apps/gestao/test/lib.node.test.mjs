import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { test } from 'node:test';
import { computeKpis, groupRows, isBlocked, lacunas, upcoming } from '../lib/kpis.mjs';
import { itemFromGithub, itemFromWorkbook, mergeEpic } from '../lib/merge.mjs';
import { frontMatter, parseBody, parseCsv } from '../lib/parse.mjs';
import { VIEWS } from '../lib/views.mjs';

const snapshot = JSON.parse(readFileSync(new URL('../data/snapshot.json', import.meta.url), 'utf8'));
const solo = JSON.parse(readFileSync(new URL('../data/solo-campaign.json', import.meta.url), 'utf8'));

const CLONE = `---
id: IS-OP.OPS-0085
type: issue
parent: EP-OP.OPS-0005
co_owners: [GV.PES]
title: "Fazer o simulado \\"final\\" e a prova"
status: backlog
assignees: [Programaex]
start_date: 2027-01-16
due_date: null
labels: [tipo:issue, owner:OP.OPS, co:GV.PES, macro:A09]
aliases: [TSK-0066]
github_url: https://github.com/Programaex/workbook/issues/85
github_number: 0085
---
# Fazer o simulado final e a prova

## Descrição
**Frente:** Carreira na Europa · **Prioridade:** Alta · **Tempo estimado:** 10h
**Bloqueada por:** #80 (TSK-0061)

## Passos
- [ ] Fazer o simulado final
- [x] Inscrever-se na prova
- [ ] Fazer a prova

**Concluído quando:** A prova estiver realizada.

## Lacunas
- Data da prova (GAP-10)

## Critérios de aceite
- [ ] Concluído quando: A prova estiver realizada.
`;

const GH_BODY = `**ID:** IS-OP.OPS-0085 · **Início:** 2027-01-20 · **Prazo:** a definir (janela 2027-01-16 a 2027-01-31) · **Pai:** EP-OP.OPS-0005 · **Alias:** TSK-0066
**Frente:** Carreira na Europa · **Prioridade:** Alta · **Tempo estimado:** 10h
**Bloqueada por:** #80 (TSK-0061)

## Passos
- [x] Fazer o simulado final
- [x] Inscrever-se na prova
- [ ] Fazer a prova
`;

test('front matter: escalares, aspas escapadas, listas e null', () => {
	const { data, body } = frontMatter(CLONE);
	assert.equal(data.title, 'Fazer o simulado "final" e a prova');
	assert.deepEqual(data.aliases, ['TSK-0066']);
	assert.equal(data.due_date, null);
	assert.equal(data.github_number, '0085');
	assert.match(body, /^# Fazer/);
});

test('corpo: checklist só da seção Passos, lacunas, bloqueio e horas', () => {
	const b = parseBody(frontMatter(CLONE).body);
	assert.deepEqual(b.checks, { done: 1, total: 3 });
	assert.deepEqual(b.lacunas, ['Data da prova (GAP-10)']);
	assert.equal(b.blockedBy, 80);
	assert.equal(b.horas, 10);
	assert.equal(b.frente, 'Carreira na Europa');
});

test('corpo do GitHub: prazo "a definir" vira janela, sem data fixa', () => {
	const b = parseBody(GH_BODY);
	assert.equal(b.start, '2027-01-20');
	assert.equal(b.due, null);
	assert.deepEqual(b.dueWindow, ['2027-01-16', '2027-01-31']);
});

test('CSV RFC 4180 com vírgula, aspas e quebra de linha na célula', () => {
	const rows = parseCsv('a,b\n"x, ""y""","linha 1\nlinha 2"\n');
	assert.deepEqual(rows, [{ a: 'x, "y"', b: 'linha 1\nlinha 2' }]);
});

test('item do workbook e item do GitHub', () => {
	const w = itemFromWorkbook(frontMatter(CLONE), { cluster_nome: 'Carreira na Europa', prioridade: 'Alta' });
	assert.equal(w.number, 85);
	assert.equal(w.parent, 5);
	assert.equal(w.alias, 'TSK-0066');
	assert.equal(w.state, 'open');
	const g = itemFromGithub({ number: 7, title: '[GATE-00] Confirmar horas', state: 'closed', labels: [{ name: 'tipo:gate' }, { name: 'owner:OP.OPS' }], body: '**Início:** 2026-10-17 · **Prazo:** 2026-10-17' }, 3);
	assert.equal(g.type, 'gate');
	assert.equal(g.alias, 'GATE-00');
	assert.equal(g.title, 'Confirmar horas');
	assert.equal(g.state, 'closed');
});

test('mesclagem: GitHub sobrepõe estado/datas; extra e ausente sinalizados; sem GitHub usa snapshot', () => {
	const base = { epic: { number: 5, title: 'E', co: [] }, items: [itemFromWorkbook(frontMatter(CLONE)), { ...itemFromWorkbook(frontMatter(CLONE)), number: 86 }] };
	const live = {
		epic: { number: 5, title: '[EPIC] Emprego', state: 'open', labels: [], body: '**Início:** 2026-11-19 · **Prazo:** 2027-03-30' },
		subs: [{ number: 85, title: 'Prova', state: 'closed', labels: [{ name: 'tipo:issue' }], body: GH_BODY }, { number: 99, title: 'Nova', state: 'open', labels: [], body: '' }],
	};
	const m = mergeEpic(base, live);
	assert.equal(m.source, 'github');
	const i85 = m.items.find(i => i.number === 85);
	assert.equal(i85.state, 'closed');
	assert.equal(i85.start, '2027-01-20');
	assert.equal(i85.alias, 'TSK-0066');
	assert.equal(i85.checks.done, 2);
	assert.ok(m.items.find(i => i.number === 99).outsideSnapshot);
	assert.ok(m.items.find(i => i.number === 86).missingOnGithub);
	assert.equal(m.epic.title, 'Emprego');
	const off = mergeEpic(base, null, { error: 'GitHub 403' });
	assert.equal(off.source, 'snapshot');
	assert.match(off.warnings[0], /GitHub 403/);
});

test('snapshot: 52 itens no EPIC 01 (47 + 5 gates), 24 no Emprego (21 + 3), todos com início', () => {
	const e3 = snapshot.epics[3].items, e5 = snapshot.epics[5].items;
	assert.equal(e3.length, 52);
	assert.equal(e3.filter(i => i.type === 'gate').length, 5);
	assert.equal(e5.length, 24);
	assert.equal(e5.filter(i => i.type === 'gate').length, 3);
	for (const i of [...e3, ...e5]) assert.ok(i.start, `#${i.number} sem início`);
	assert.equal(new Set([...e3, ...e5].map(i => i.number)).size, 76);
});

test('KPIs: atrasada, vence em 7 dias, bloqueada, provas e N/D sem fonte', () => {
	const items = [
		{ number: 1, type: 'issue', state: 'open', start: '2026-10-01', due: '2026-10-10', horas: 2 },
		{ number: 2, type: 'issue', state: 'open', start: '2026-10-15', due: '2026-10-20', horas: 1.5, blockedBy: 1 },
		{ number: 3, type: 'issue', state: 'closed', start: '2026-10-01', due: '2026-10-05', alias: 'TSK-0066' },
		{ number: 4, type: 'gate', state: 'open', start: '2026-10-25', due: '2026-10-25', alias: 'GATE-01', title: 'G' },
	];
	const k = Object.fromEntries(computeKpis(items, VIEWS.emprego, '2026-10-17').map(x => [x.id, x]));
	assert.equal(k.progresso.value, '1/3');
	assert.deepEqual(k.atrasadas.numbers, [1]);
	assert.deepEqual(k.vencendo.numbers, [2]);
	assert.deepEqual(k.bloqueadas.numbers, [2]);
	assert.equal(k.horas.value, '3,5 h');
	assert.equal(k.gate.value, 'GATE-01');
	assert.equal(k.provas.value, '1/3');
	assert.equal(k.candidaturas.value, 'N/D');
	assert.ok(isBlocked(items[1], new Map(items.map(i => [i.number, i]))));
	assert.deepEqual(upcoming(items, '2026-10-17', 14).map(i => i.number), [1, 2, 4]);
});

test('agrupamento: ordem da view, gates por último; lacunas abertas listadas', () => {
	const rows = groupRows(snapshot.epics[5].items, VIEWS.emprego);
	assert.equal(rows.at(-1).name, 'Pontos de decisão');
	assert.ok(!rows.some(r => r.name === 'Outras'), 'toda issue do emprego tem trilha');
	assert.ok(lacunas(snapshot.epics[5].items).some(l => /GAP-10/.test(l.text)));
	const rows3 = groupRows(snapshot.epics[3].items, VIEWS.epic01);
	assert.equal(rows3[0].name, 'Planejamento e controle');
});

test('modelo do PDF: 12 tarefas, sprint D1–D10 com 26 blocos, matriz soma 27 peças sem os CTAs', () => {
	assert.equal(solo.tasks.length, 12);
	assert.equal(solo.sprint.length, 10);
	assert.equal(solo.sprint.reduce((a, d) => a + d.blocks, 0), 26);
	assert.equal(solo.matrix.filter(m => m.fragment !== 'CTAs').reduce((a, m) => a + m.qty, 0), 27);
	assert.deepEqual(solo.checkpoints.map(c => c.day), ['D6', 'D10']);
});
