import { describe, expect, it } from 'vitest';
import * as C from '../src';

const TODAY = '2026-10-16';

describe('A4 templates', () => {
  const plans = { demo: C.demoPlan(TODAY).plan, lorem: C.loremPlan(TODAY) };
  for (const [name, plan] of Object.entries(plans)) {
    for (const T of C.TEMPLATES) {
      it(`${T.id} · ${name}: whole pages of exactly 3 faces`, () => {
        const vm = C.viewModel(T.id, plan, TODAY);
        expect(vm.faceCount % 3).toBe(0);
        expect(vm.pages.length).toBe(vm.faceCount / 3);
        vm.pages.forEach((p, i) => {
          expect(p.faces).toHaveLength(3);
          expect(p.meta).toBe(`A4 · ${T.short} · ${String(i + 1).padStart(2, '0')}/${String(vm.pages.length).padStart(2, '0')}`);
          expect(p.faces[0].first).toBe(true);
        });
      });
    }
  }

  it('epic faces respect capacity (3 on the first slot, 4 otherwise) and never leave a lone continuation task', () => {
    const faces = C.prismaVM(C.loremPlan(TODAY), TODAY);
    faces.forEach((f, i) => {
      if (f.type !== 'epic') return;
      expect(f.tasks.length).toBeLessThanOrEqual(i % 3 === 0 ? 3 : 4);
      if (f.title.endsWith('continuação')) expect(f.tasks.length).toBeGreaterThan(1);
    });
  });

  it('codes follow group prefixes and CSV refs', () => {
    const { plan } = C.demoPlan(TODAY);
    const cd = C.codes(plan);
    expect(cd[plan.ents[0].id]).toBe('CNT-001');
    expect(cd[plan.ents[1].id]).toBe('TEC-001');
    expect(cd[plan.ents[0].tarefas[1].id]).toBe('CNT-001.2');
  });

  it('weekWindow returns 7 days inside the plan', () => {
    const w = C.weekWindow(C.demoPlan(TODAY).plan, TODAY);
    expect(w).toHaveLength(7);
    expect(w.flatMap(d => d.items)).not.toHaveLength(0);
  });
});

describe('HTML renderer', () => {
  it('escapes user text and renders one section per page', () => {
    const { plan } = C.demoPlan(TODAY);
    const evil = { ...plan, nome: '<img src=x onerror=alert(1)>' };
    const doc = C.documentHtml('status', evil, TODAY);
    expect(doc.html).not.toContain('<img src=x');
    expect(doc.html).toContain('&lt;img src=x');
    expect(doc.html.match(/<section class="page"/g)).toHaveLength(doc.pages);
    expect(doc.filename).toMatch(/^prisma-status-.*\.html$/);
    expect(doc.html).toContain('@page{size:A4 portrait;margin:0}');
  });
});
