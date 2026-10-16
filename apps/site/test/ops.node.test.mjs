import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { test } from 'node:test';
import { diffDatasets, parseAlsoAsked } from '../lib/ops/alsoasked.mjs';
import { editorialToTasks } from '../lib/ops/editorial.mjs';
import { addDependency, addNode, cascadeDiff, convertQuestionToTask, fsViolations, importDataset, seedDoc, undoBatch, updateTask } from '../lib/ops/model.mjs';
import { addDays, agenda, eventsOn, monthGrid, viewDays, weekSegments } from '../lib/ops/calendar.mjs';
import { calendarHeight, fitToPage, minSheetFor, pageCss, suggestions, usableArea } from '../lib/ops/pagefit.mjs';
import { exportJson, importJson, neutralize, toCsv, fromCsv } from '../lib/ops/exportio.mjs';
import { bar, groupTasks, range } from '../lib/ops/gantt.mjs';
import { dagLayout, pathTo, treeLayout } from '../lib/ops/layout.mjs';

const dir = new URL('../content/ops/', import.meta.url);
const files = readdirSync(dir).filter(f => f.startsWith('DATA-')).sort();
const read = f => readFileSync(new URL(f, dir), 'utf8');
const parsedAll = () => Promise.all(files.map(f => parseAlsoAsked(read(f), f)));
const editorial = () => editorialToTasks(read('editorial_workflow.csv'));
const seed = async () => seedDoc(await parsedAll(), editorial());

test('AT-01: 3 CSVs → 37/53/20 nós e 36/52/19 relações, 3 raízes', async () => {
	const p = await parsedAll();
	assert.deepEqual(p.map(x => x.nodes.length), [37, 53, 20]);
	assert.deepEqual(p.map(x => x.edges.length), [36, 52, 19]);
	assert.ok(p.every(x => x.errors.length === 0 && x.nodes.filter(n => !n.parentId).length === 1));
	assert.deepEqual(p.map(x => x.dataset.locked), [35, 51, 18]);
	const v = JSON.parse(readFileSync(new URL('../../../docs/prd/qa/data-validation.json', import.meta.url), 'utf8'));
	assert.deepEqual(p.map(x => x.dataset.sha256), v.datasets.map(d => d.sha256));
});

test('AT-01: reimportação idêntica não duplica; arquivo alterado vira nova versão com diff', async () => {
	let doc = await seed();
	const again = importDataset(doc, await parseAlsoAsked(read(files[2]), files[2]));
	assert.equal(again.status, 'duplicate');
	const changed = read(files[2]).replace('Quais são os 10 transtornos?', 'Quais são os 10 transtornos (revisado)?');
	const p2 = await parseAlsoAsked(changed, files[2]);
	const r = importDataset(doc, p2);
	assert.equal(r.status, 'new-version');
	assert.equal(r.datasetId, 'DATA-003-V2');
	assert.equal(r.doc.nodes.length, 110 + 20);
	const prev = doc.nodes.filter(n => n.datasetId === 'DATA-003');
	const d = diffDatasets(prev, p2.nodes);
	assert.equal(d.changed.length, 1);
	const undone = undoBatch(r.doc, r.batchId).doc;
	assert.equal(undone.nodes.length, 110);
});

test('AT-01b: BOM, multilinha e aspas válidos; órfão e posição repetida não geram lote parcial', async () => {
	const head = '﻿"question","answer","url","page title","tier 1 position","tier 2 position"\n';
	const ok = await parseAlsoAsked(head + '"Raiz","","","","0","0"\n"P, com vírgula","linha 1\nlinha 2 ""citada""","","","1","0"\n', 'x.csv');
	assert.equal(ok.errors.length, 0);
	assert.equal(ok.nodes[1].answer, 'linha 1\nlinha 2 "citada"');
	const orphan = await parseAlsoAsked(head + '"Raiz","","","","0","0"\n"Órfão","","","","2","1"\n', 'x.csv');
	assert.equal(orphan.nodes.length, 0);
	assert.match(orphan.errors[0].message, /órfão/);
	assert.equal(orphan.errors[0].record, 2);
	const dup = await parseAlsoAsked(head + '"Raiz","","","","0","0"\n"A","","","","1","0"\n"B","","","","1","0"\n', 'x.csv');
	assert.match(dup.errors[0].message, /repetida/);
	assert.equal(dup.nodes.length, 0);
});

test('AT-02: bloqueado, vazio e repetido são distintos; nada é inventado', async () => {
	const [, , d3] = await parsedAll();
	const locked = d3.nodes.find(n => n.answerStatus === 'locked');
	assert.equal(locked.answer, '');
	assert.ok(locked.lockedFields.includes('answer'));
	assert.ok(d3.nodes.some(n => n.answerStatus === 'missing'));
	const rep = d3.nodes.filter(n => n.title === 'Quais são os 7 transtornos do neurodesenvolvimento?');
	assert.ok(rep.length >= 2);
	assert.equal(new Set(rep.map(n => n.id)).size, rep.length);
	assert.ok(d3.nodes.every(n => n.answer !== 'Upgrade to Lite/Pro to unlock'));
});

test('45 registros editoriais rastreáveis, flags e janelas preservadas', () => {
	const e = editorial();
	assert.equal(e.tasks.length, 45);
	assert.equal(e.events.length, 45);
	assert.equal(e.tasks.filter(t => t.dateKind === 'window').length, 32);
	assert.ok(e.tasks.find(t => t.id === 'W2-003').flags.includes('title_shifted_from_channel_review_required'));
	assert.equal(e.tasks.filter(t => t.flags.includes('truncated_source')).length, 4);
	assert.ok(e.tasks.every(t => t.ownerId === null && t.sourceCells.length === 8));
});

test('AT-04: dependência cíclica rejeitada; pergunta não vira execução sem conversão', async () => {
	let doc = await seed();
	doc = addDependency(doc, 'W1-002', 'W1-003').doc;
	assert.match(addDependency(doc, 'W1-003', 'W1-002').error, /Ciclo/);
	assert.match(addDependency(doc, 'W1-002', 'W1-002').error, /Ciclo/);
	assert.match(addDependency(doc, 'DATA-001-N001', 'W1-002').error, /convertidas/);
	const c = convertQuestionToTask(doc, 'DATA-001-N002');
	assert.equal(c.task.sourceNodeId, 'DATA-001-N002');
	assert.equal(c.doc.dependencies.length, 1);
	assert.match(convertQuestionToTask(c.doc, 'DATA-001-N002').error, /já tem tarefa/);
	const n = addNode(c.doc, { parentId: 'DATA-001-N002', title: 'Nova pergunta' });
	assert.equal(n.node.parentId, 'DATA-001-N002');
	assert.equal(n.doc.edges.at(-1).type, 'parent-child');
});

test('AT-07: replanejar sincroniza evento, guarda histórico e original; FS e cascata explícita', async () => {
	let doc = await seed();
	doc = addDependency(doc, 'W1-002', 'W1-005').doc;
	const t0 = doc.tasks.find(t => t.id === 'W1-002');
	const r = updateTask(doc, 'W1-002', { plannedStart: '2026-09-10', plannedEnd: '2026-09-12' }, { author: 'teste' });
	const t = r.doc.tasks.find(x => x.id === 'W1-002');
	assert.equal(t.originalStart, t0.plannedStart);
	assert.equal(r.doc.events.find(e => e.taskId === 'W1-002').dateStart, '2026-09-10');
	assert.ok(r.doc.history.some(h => h.taskId === 'W1-002' && h.field === 'plannedStart' && h.author === 'teste'));
	assert.equal(fsViolations(r.doc).length, 1);
	const diff = cascadeDiff(doc, 'W1-002', '2026-09-10', '2026-09-12');
	assert.deepEqual(diff.find(d => d.id === 'W1-005').after, ['2026-09-12', '2026-09-14']);
	assert.match(updateTask(doc, 'W1-002', { plannedStart: '2026-09-10', plannedEnd: '2026-09-01' }).error, /Fim antes/);
	assert.match(updateTask(r.doc, 'W1-002', { title: 'x' }, { expectedRevision: 0 }).error, /Conflito/);
});

test('Calendário: mês com 6 semanas, semana útil, dias locais e segmentos sem colisão', () => {
	assert.equal(monthGrid(2026, 8).length, 6); // agosto/2026 começa num sábado
	assert.equal(monthGrid(2021, 2).length, 4); // fevereiro/2021: 28 dias começando numa segunda
	assert.ok(monthGrid(2026, 9).every(w => w.length === 7));
	assert.deepEqual(viewDays('semana-util', '2026-09-10'), ['2026-09-07', '2026-09-08', '2026-09-09', '2026-09-10', '2026-09-11']);
	assert.equal(addDays('2026-10-31', 1), '2026-11-01');
	const evs = editorial().events;
	const days = viewDays('semana', '2026-09-08');
	const { segments, lanes } = weekSegments(evs, days);
	for (const a of segments) for (const b of segments) if (a !== b && a.lane === b.lane) assert.ok(a.col + a.span <= b.col || b.col + b.span <= a.col);
	assert.ok(lanes >= 2);
	assert.ok(eventsOn(evs, '2026-09-08').some(e => e.continuesBefore || e.continuesAfter));
	assert.equal(agenda(evs, '2026-09-01', '2026-10-31').length, 45);
});

test('SPEC-03: exemplo de calibração (A4 paisagem → s≈0,654, 7,85 pt pede ajuste)', () => {
	const u = usableArea({ paper: 'A4', orientation: 'landscape' });
	assert.deepEqual(u.mm, [277, 168]);
	assert.ok(Math.abs(u.px[0] - 1047) < 1 && Math.abs(u.px[1] - 635) < 1);
	const f = fitToPage({ x: 0, y: 0, width: 1600, height: 900 }, { paper: 'A4', orientation: 'landscape' });
	assert.ok(Math.abs(f.scale - 0.654) < 0.002);
	assert.ok(Math.abs(f.pt - 7.85) < 0.05);
	assert.equal(f.legible, false);
	assert.deepEqual(suggestions({ x: 0, y: 0, width: 1600, height: 900 }, {}).map(s => s.paper + ' ' + s.orientation), ['A3 landscape']);
	const neg = fitToPage({ x: -400, y: -200, width: 800, height: 400 }, {});
	assert.ok(neg.dx > 0 && neg.dy > 0 && neg.scale === 1);
	assert.equal(pageCss({ paper: 'A3', orientation: 'portrait' }), '@page { size: 297mm 420mm; margin: 10mm 10mm 10mm 10mm; }');
	assert.deepEqual(calendarHeight([[[20, 20], [20]], [[]]]).rows, [80, 36]);
});

test('AT-11: round-trip JSON preserva IDs; versão incompatível recusada; CSV neutraliza fórmulas', async () => {
	const doc = await seed();
	const back = importJson(exportJson(doc));
	assert.deepEqual(back.data.nodes.map(n => n.id), doc.nodes.map(n => n.id));
	assert.deepEqual(back.data.edges, doc.edges);
	assert.match(importJson(JSON.stringify({ schemaVersion: '2.0.0' })).error, /incompatível/);
	assert.equal(neutralize('=SOMA(A1)'), "'=SOMA(A1)");
	assert.equal(neutralize('-1'), "'-1");
	const csv = toCsv([{ id: 'X', title: '@cmd' }]);
	assert.deepEqual(fromCsv(csv), [{ id: 'X', title: "'@cmd" }]);
});

test('Gantt e layouts: barras, não agendadas, orientação não muda relações, caminho de busca', async () => {
	const doc = await seed();
	const r = range(doc.tasks);
	assert.ok(r.from <= '2026-09-01' && r.to >= '2026-10-04');
	const b = bar(doc.tasks[0], r);
	assert.ok(b.left >= 0 && b.left + b.width <= 1);
	const g = groupTasks([...doc.tasks, { id: 'T-x', title: 'x', plannedStart: null }]);
	assert.equal(g.unscheduled.length, 1);
	const nodes = doc.nodes.filter(n => n.datasetId === 'DATA-002');
	const all = new Set(nodes.map(n => n.id));
	const lr = treeLayout('DATA-002-N001', nodes, { direction: 'LR', expanded: all });
	const tb = treeLayout('DATA-002-N001', nodes, { direction: 'TB', expanded: all });
	const bi = treeLayout('DATA-002-N001', nodes, { direction: 'bilateral', expanded: all });
	assert.equal(lr.items.length, 53);
	assert.deepEqual(new Set(lr.links.map(l => l.source + '>' + l.target)), new Set(tb.links.map(l => l.source + '>' + l.target)));
	assert.equal(bi.items.length, 53);
	const collapsed = treeLayout('DATA-002-N001', nodes, { expanded: new Set(['DATA-002-N001']) });
	assert.ok(collapsed.items.some(i => i.collapsedCount > 0));
	const leaf = nodes.find(n => n.tier2 > 0);
	assert.equal(pathTo(nodes, leaf.id).length, 3);
	const dag = dagLayout(doc.tasks.slice(0, 3), [{ id: 'd', predecessorId: doc.tasks[0].id, successorId: doc.tasks[1].id }]);
	assert.equal(dag.items.find(i => i.task.id === doc.tasks[1].id).layer, 1);
});

test('SPEC-03: papel personalizado mínimo deixa o conteúdo no piso de 9 pt', () => {
	const opts = { paper: 'A4', orientation: 'landscape' };
	const [w, h] = minSheetFor(3000, 1200, opts, { fontPx: 12 });
	const f = fitToPage({ x: 0, y: 0, width: 3000, height: 1200 }, { ...opts, paper: 'custom', custom: [w, h], orientation: w >= h ? 'landscape' : 'portrait' }, { fontPx: 12 });
	assert.ok(f.legible, `pt=${f.pt}`);
	assert.ok(f.pt < 9.5);
	assert.match(pageCss({ paper: 'custom', custom: [w, h], orientation: 'landscape' }), new RegExp(`size: ${w}mm ${h}mm`));
});
