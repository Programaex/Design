import { describe, expect, it } from 'vitest';
import * as C from '../src';

const TODAY = '2026-10-16';

describe('wizard + buildPlan', () => {
  it('validates required steps', () => {
    const s = C.defaultSetup();
    expect(C.validate('nome', s)).toMatch(/nome/);
    expect(C.validate('grupos', s)).toMatch(/tipo/);
    expect(C.validate('ents', s)).toMatch(/entregável/);
    expect(C.validate('periodo', s)).toBe('');
  });

  it('autoAssign spreads deliverables over the 3 horizons without overriding manual choices', () => {
    const ents = [0, 1, 2, 3, 4, 5].map(i => ({ id: 'e' + i, titulo: 'E' + i, grupo: 'conteudo' as const, hz: i === 5 ? (0 as const) : null }));
    expect(C.autoAssign(ents, false).map(e => e.hz)).toEqual([0, 0, 1, 1, 2, 0]);
    expect(C.autoAssign(ents, true).map(e => e.hz)).toEqual([0, 0, 1, 1, 2, 2]);
  });

  it('builds tasks per energy level, including the proof check at 4', () => {
    const setup = { ...C.defaultSetup(), nome: ' Blog ', grupos: ['conteudo' as const], ents: [{ id: 'a', titulo: 'Artigo', grupo: 'conteudo' as const, hz: 1 as const }], energia: 4 };
    const p = C.buildPlan(setup, TODAY);
    expect(p.nome).toBe('Blog');
    expect(p.ents[0].tarefas).toHaveLength(4);
    expect(p.ents[0].tarefas[3].p).toBe('Conferir se “Artigo” existe e abre sem erro');
    expect(C.buildPlan({ ...setup, energia: 2 }, TODAY).ents[0].tarefas.map(t => t.p)).toEqual(['Escrever o primeiro rascunho de “Artigo”', 'Publicar ou enviar “Artigo”']);
  });
});

describe('dates and status', () => {
  const plan = C.buildPlan({ ...C.defaultSetup(), nome: 'X', periodo: 7, ents: [{ id: 'a', titulo: 'A', grupo: 'tecnico', hz: 0 }, { id: 'b', titulo: 'B', grupo: 'tecnico', hz: 1 }] }, '2026-10-10');
  it('computes horizon dates (0, 40%, end)', () => {
    expect([0, 1, 2].map(h => C.hzDate(plan, h))).toEqual(['2026-10-10', '2026-10-13', '2026-10-17']);
    expect(C.endDate(plan)).toBe('2026-10-17');
  });
  it('labels late, today and future tasks', () => {
    const t = plan.ents[0].tarefas[0];
    expect(C.statusOf(plan, t, 0, TODAY)).toEqual({ tone: 'danger', label: 'Atraso · 10/10' });
    expect(C.statusOf(plan, t, 1, '2026-10-13')).toEqual({ tone: 'accent', label: 'Hoje' });
    expect(C.statusOf(plan, t, 1, '2026-10-11')).toEqual({ tone: 'warning', label: '13/10' });
    expect(C.statusOf(C.toggleTask(plan, t.id), { ...t, done: true }, 0, TODAY).label).toBe('Feito');
    expect(C.lateCount(plan, TODAY)).toBe(6);
  });
});

describe('mutations', () => {
  const { plan } = C.demoPlan(TODAY);
  it('adds, renames and removes tasks immutably', () => {
    const e = plan.ents[0];
    const p1 = C.addTask(plan, e.id, 'Nova');
    expect(p1.ents[0].tarefas).toHaveLength(e.tarefas.length + 1);
    expect(plan.ents[0].tarefas).toHaveLength(e.tarefas.length);
    const nt = p1.ents[0].tarefas.at(-1)!;
    expect(C.taskText(C.renameTask(p1, nt.id, 'Outra').ents[0].tarefas.at(-1)!, 'p')).toBe('Outra');
    expect(C.removeTask(p1, nt.id).ents[0].tarefas).toHaveLength(e.tarefas.length);
  });
  it('resets routines on a new day only', () => {
    expect(C.resetRoutinesIfNewDay(plan, TODAY)).toBe(plan);
    expect(C.resetRoutinesIfNewDay(plan, '2026-10-17').rotinas.every(r => !r.done)).toBe(true);
  });
});

describe('execution queue (Scroll Task)', () => {
  const { plan } = C.demoPlan(TODAY);
  it('builds the four granularities', () => {
    expect(C.executionQueue(plan, 'action')).toHaveLength(15);
    expect(C.executionQueue(plan, 'task')).toHaveLength(5);
    expect(C.executionQueue(plan, 'phase').map(x => x.id)).toEqual(['hz:0', 'hz:1', 'hz:2']);
    expect(C.executionQueue(plan, 'workflow')[0].n).toBe(15);
  });
  it('never completes by timer; completion and defer are explicit', () => {
    const item = C.executionQueue(plan, 'task')[1];
    const p = C.setItemDone(plan, item, true);
    expect(C.executionQueue(p, 'task')[1].status).toBe('done');
    const d = C.deferItem(plan, item.id);
    expect(C.executionQueue(d, 'task')[1].status).toBe('deferred');
    expect(C.itemState(C.deferItem(d, item.id), item.id)).toBe('ready');
    expect(C.executionQueue(C.setNote(plan, item.id, 'bloqueado'), 'task')[1].notes).toBe('bloqueado');
  });
  it('timer uses timestamps', () => {
    const t = C.timerStart(C.timerReady(15), 1000);
    expect(C.timerLeft(t, 1000 + 60000)).toBe(14 * 60000);
    const pz = C.timerPause(t, 1000 + 60000);
    expect(pz.state).toBe('paused');
    expect(C.timerLeft(pz, 9e9)).toBe(14 * 60000);
    expect(C.fmtClock(14 * 60000 + 1)).toBe('14:01');
    expect(C.timerTimeUp(t).state).toBe('time_up');
  });
});

describe('import', () => {
  it('parses JSON export and rejects garbage', () => {
    const { plan, setup } = C.demoPlan(TODAY);
    const r = C.parseImport(JSON.stringify(C.exportPayload(plan, setup)));
    expect(r.plan.id).toBe(plan.id);
    expect(() => C.parseImport('{"x":1}')).toThrow('Arquivo inválido');
  });
  it('maps CSV #3 clusters to deliverables and priority to horizons', () => {
    const csv = '﻿tarefa_id;cluster_id;cluster_nome;titulo;prioridade;prazo;evidencia_conclusao\n' +
      'T1;C1;Site;"Publicar ""home""";Alta;2026-10-30;URL no ar\nT2;C1;Site;Testar;Média;;\nT3;C2;Vendas;Ligar;Baixa;2026-11-15;';
    const { plan } = C.planFromCsv(csv, 'Ops', TODAY);
    expect(plan.ents.map(e => [e.titulo, e.hz, e.prova.p])).toEqual([['Site', 0, 'URL no ar'], ['Vendas', 2, 'TBD']]);
    expect(plan.ents[0].tarefas[0].custom).toBe('Publicar "home"');
    expect(plan.periodo).toBe(30);
    expect(() => C.planFromCsv('a,b\n1,2')).toThrow(/Colunas ausentes/);
  });
});
