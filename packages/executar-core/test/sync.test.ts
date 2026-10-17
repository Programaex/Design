import { describe, expect, it } from 'vitest';
import * as C from '../src';

const base = C.demoPlan('2026-10-16').plan;
const t0 = base.ents[0].tarefas[2].id, t1 = base.ents[1].tarefas[1].id;

describe('mergePlans', () => {
  it('applies non-overlapping edits from both sides', () => {
    const local = C.toggleTask(base, t0);
    const remote = C.renameTask(base, t1, 'Remoto');
    const { merged, conflicts } = C.mergePlans(base, local, remote);
    expect(conflicts).toEqual([]);
    expect(merged.ents[0].tarefas[2].done).toBe(true);
    expect(merged.ents[1].tarefas[1].custom).toBe('Remoto');
    expect(merged.version).toBe(base.version + 1);
  });

  it('reports a conflict when both sides change the same task differently', () => {
    const local = C.renameTask(base, t0, 'Aqui');
    const remote = C.toggleTask(base, t0);
    const { merged, conflicts } = C.mergePlans(base, local, remote, 'Ana (iPad)');
    expect(conflicts).toHaveLength(1);
    expect(conflicts[0]).toMatchObject({ taskId: t0, by: 'Ana (iPad)', local: { custom: 'Aqui', done: false }, remote: { done: true } });
    const resolved = C.resolveConflict(merged, conflicts[0], 'local');
    expect(resolved.ents[0].tarefas[2]).toMatchObject({ custom: 'Aqui', done: false });
  });

  it('keeps additions from both sides and honours deletions', () => {
    const local = C.addTask(C.removeTask(base, t0), base.ents[0].id, 'Nova local');
    const remote = C.addTask(base, base.ents[1].id, 'Nova remota');
    const { merged } = C.mergePlans(base, local, remote);
    const texts = merged.ents.flatMap(e => e.tarefas.map(t => C.taskText(t, 'p')));
    expect(texts).toContain('Nova local');
    expect(texts).toContain('Nova remota');
    expect(merged.ents[0].tarefas.some(t => t.id === t0)).toBe(false);
  });

  it('first sync without base takes local edits over an identical remote', () => {
    const local = C.setLang(base, 'e');
    const { merged } = C.mergePlans(null, local, base);
    expect(merged.lang).toBe('e');
  });
});
