// Export view-models — every template follows the Risco Cognitivo A4 pack standard:
// A4 portrait, 10 mm margin, 190 × 277 mm content box split into 3 equal faces (92.33 mm each).
// Builders paginate by face capacity, so nothing relies on flow. Literal hex values (pack palette)
// so the saved standalone HTML renders without the app's CSS.
import * as C from './plan';
import type { Deliverable, Plan, Task, Tone } from './types';

export type TemplateId = 'prisma' | 'semana' | 'workbook' | 'status';
export interface TemplateDef { id: TemplateId; t: string; short: string; s: string; icon: string; src: string }
export const TEMPLATES: TemplateDef[] = [
  { id: 'prisma', t: 'Prisma operacional', short: 'PRISMA', s: 'Horizontes, entregas, rotinas e mapa mental.', icon: 'squares-four', src: 'EXECUTAR_PRISMA_MAPA_OS_AGORA_PROXIMO_DEPOIS.html' },
  { id: 'semana', t: 'Plano da semana', short: 'SEMANA', s: 'Rotina padrão e foco de cada um dos 7 dias.', icon: 'calendar-blank', src: 'plano-semana-a4.html' },
  { id: 'workbook', t: 'Workbook 7 dias', short: 'WORKBOOK', s: 'Uma página por dia com dependências, prova e evidência.', icon: 'notebook', src: 'workbook_operacional_v2_7_dias_offline.html' },
  { id: 'status', t: 'Status report', short: 'STATUS', s: 'KPIs e progresso por entregável para quem acompanha.', icon: 'chart-bar', src: 'risco-cognitivo-a4-pack-unificado.html' }
];
export const isTemplateId = (x: unknown): x is TemplateId => TEMPLATES.some(t => t.id === x);
export const SHEET = { page: '210mm × 297mm', margin: '10mm', content: '190mm × 277mm', face: '92.33mm', faces: 3 } as const;

// pack status tones: [bg, fg]
const TONE: Record<Tone, [string, string]> = { success: ['#EFF6FF', '#2563EB'], danger: ['#F5F5F4', '#A33A32'], accent: ['#EFF6FF', '#304E83'], warning: ['#F5F5F4', '#8A5A00'], neutral: ['#F5F5F4', '#5F6670'] };
const tone = (k: Tone) => TONE[k] || TONE.neutral;
const PREFIX: Record<string, string> = { conteudo: 'CNT', tecnico: 'TEC', comercial: 'COM', operacao: 'OPS', estudo: 'EST', pessoal: 'PES' };
const WD = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado'];
const MES = ['JAN', 'FEV', 'MAR', 'ABR', 'MAI', 'JUN', 'JUL', 'AGO', 'SET', 'OUT', 'NOV', 'DEZ'];
const pad = (n: number) => String(n).padStart(2, '0');
const utc = (s: string) => { const [y, m, d] = s.split('-').map(Number); return Date.UTC(y, m - 1, d); };
const dayDiff = (a: string, b: string) => Math.round((utc(b) - utc(a)) / 864e5);
const wd = (iso: string) => WD[new Date(utc(iso)).getUTCDay()];
const longDate = (iso: string) => iso.slice(8, 10) + ' ' + MES[+iso.slice(5, 7) - 1] + ' ' + iso.slice(0, 4);
const L = (plan: Plan, a: string, b: string) => plan.lang === 'e' ? b : a;
const prova = (plan: Plan, e: Deliverable) => C.provaText(e, plan.lang);

/* ---------- view-model types ---------- */
export interface Kpi { label: string; value: string | number; caption: string; color: string }
export interface TaskRowVM { code: string; text: string; dot: string; fill: string; color: string; deco: string; label: string; bg: string; fg: string; note: string; hasNote: boolean; done: boolean }
export interface RoutineStepVM { num: string; name: string; time: string; bg: string; bl: string; nc: string; arrow: boolean }
export interface EpicLeft { tag: string; id: string; title: string; desc: string; hasMicro: boolean; microLabel?: string; micro?: string }
export interface MapItem { kind: 'group' | 'ent'; h: number; nome?: string; sub?: string; code?: string; titulo?: string; hz?: string; bg?: string; fg?: string; d?: number; n?: number; line?: string }
export interface DayRow { num: string; date: string; bg: string; action: string; count: string; marco: string; hasMarco: boolean; tracks: { t: string; bg: string; fg: string; fw: number }[] }
export interface CardVM extends TaskRowVM { n: string; grupo: string; ent: string; dep: string; unlocks: string; dod: string; feito: string }
export type Face =
  | { type: 'cover'; eyebrow: string; h1: string; lede: string; kpis: Kpi[] }
  | { type: 'epic'; num: string; eyebrow: string; title: string; pct: string; left: EpicLeft | null; tasks: TaskRowVM[]; countLabel: string; empty: boolean; cols: string; unit?: string }
  | { type: 'routine'; label: string; steps: RoutineStepVM[]; controle: string; regras: string }
  | { type: 'days'; rows: DayRow[] }
  | { type: 'map'; root: { nome: string; range: string; d: number; n: number; pct: string } | null; items: MapItem[] }
  | { type: 'day'; eyebrow: string; title: string; date: string; strip: { t: string; s: string; bg: string; fg: string; bc: string }[]; boxes: { label: string; text: string; bg: string; fg: string; lc: string }[]; kpis: Kpi[] }
  | { type: 'cards'; cards: CardVM[] }
  | { type: 'notes'; label: string; trace: string };
export type PlacedFace = Face & { first: boolean; idx: string; pt: string; pb: string; bt: string };
export interface Page { n: string; meta: string; faces: PlacedFace[] }

/* ---------- lorem ipsum plan (audit fixture: varied lengths stress every clamp and continuation) ---------- */
const LW = 'lorem ipsum dolor sit amet consectetur adipiscing elit sed do eiusmod tempor incididunt ut labore et dolore magna aliqua enim ad minim veniam quis nostrud exercitation ullamco laboris nisi aliquip ex ea commodo consequat duis aute irure reprehenderit voluptate velit esse cillum fugiat nulla pariatur excepteur sint occaecat cupidatat non proident sunt culpa qui officia deserunt mollit anim id est laborum'.split(' ');
export function lorem(n: number, seed = 0, end = ''): string {
  const w = Array.from({ length: n }, (_, i) => LW[(seed * 7 + i * 3) % LW.length]);
  w[0] = w[0][0].toUpperCase() + w[0].slice(1);
  return w.join(' ') + end;
}
export function loremPlan(today: string = C.todayISO()): Plan {
  const spec: [Deliverable['grupo'], 0 | 1 | 2, number, number[]][] = [['conteudo', 0, 3, [6, 9, 14, 7]], ['tecnico', 0, 8, [11, 5, 16, 8, 12]], ['comercial', 1, 4, [7, 13, 9]],
    ['conteudo', 1, 5, [10, 6, 15, 8]], ['operacao', 2, 3, [9, 12, 6, 14, 7, 11]], ['estudo', 2, 6, [8, 16, 10]]];
  let s = 1; const now = Date.now(), notes: Record<string, string> = {};
  const ents: Deliverable[] = spec.map(([g, hz, tw, tasks], k) => ({
    id: 'lx' + k, titulo: lorem(tw, s++), grupo: g, hz,
    prova: { p: lorem(14 + k * 3, s++, '.'), e: lorem(14 + k * 3, s++, '.') },
    tarefas: tasks.map((n, j) => {
      const txt = lorem(n, s++); if ((k + j) % 5 === 2) notes['lx' + k + 't' + j] = lorem(9 + j, s++, '.');
      return { id: 'lx' + k + 't' + j, p: txt, e: txt, custom: txt, done: hz === 0 && j < 2, updatedAt: now };
    })
  }));
  const inicio = C.addDays(today, -2);
  return { id: 'lorem', nome: lorem(4, 0), inicio, periodo: 7, lang: 'p', ents, notes, version: 1, rotDate: today,
    rotinas: (['abrir', 'foco', 'pausa', 'fechar'] as const).map((k, i) => ({ id: 'lr' + i, k, done: i === 0 })) };
}

/* ---------- shared helpers ---------- */
export function codes(plan: Plan): Record<string, string> {
  const n: Record<string, number> = {}, map: Record<string, string> = {};
  plan.ents.forEach(e => {
    const p = PREFIX[e.grupo] || 'ENT'; n[p] = (n[p] || 0) + 1;
    const c = p + '-' + String(n[p]).padStart(3, '0'); map[e.id] = c;
    e.tarefas.forEach((t, k) => { map[t.id] = t.ref || (c + '.' + (k + 1)); });
  });
  return map;
}
export interface ScheduleDay { i: number; iso: string; items: { t: Task; e: Deliverable }[] }
export function schedule(plan: Plan): ScheduleDay[] {
  const off = [0, 1, 2].map(h => dayDiff(plan.inicio, C.hzDate(plan, h)));
  const win = [[0, off[0]], [off[0] + 1, off[1]], [off[1] + 1, off[2]]];
  const days: ScheduleDay[] = Array.from({ length: plan.periodo + 1 }, (_, i) => ({ i, iso: C.addDays(plan.inicio, i), items: [] }));
  plan.ents.forEach(e => {
    let [a, b] = win[e.hz] || win[0]; if (a > b) a = b;
    const len = b - a + 1, n = e.tarefas.length;
    e.tarefas.forEach((t, k) => { days[Math.min(days.length - 1, a + Math.floor(k * len / n))].items.push({ t, e }); });
  });
  return days;
}
export function weekWindow(plan: Plan, today: string = C.todayISO()): ScheduleDay[] {
  const days = schedule(plan), last = days.length - 1;
  const s = Math.max(0, Math.min(dayDiff(plan.inicio, today), last - 6));
  return days.slice(s, s + 7);
}
export function meta(plan: Plan, user: { email: string } | null, at: Date = new Date()) {
  return {
    nome: plan.nome, range: C.fmt(plan.inicio) + ' → ' + C.fmt(C.endDate(plan)),
    sync: user ? 'Sincronizado · ' + user.email : L(plan, 'Salvo neste aparelho', 'Armazenado localmente'),
    gerado: pad(at.getDate()) + '/' + pad(at.getMonth() + 1) + '/' + at.getFullYear() + ' ' + pad(at.getHours()) + ':' + pad(at.getMinutes())
  };
}
function taskRow(plan: Plan, t: Task, e: Deliverable, code: string, today: string): TaskRowVM {
  const st = C.statusOf(plan, t, e.hz, today), def = !t.done && (plan.itemStatus || {})[t.id] === 'deferred', [bg, fg] = tone(def ? 'warning' : st.tone);
  const note = (plan.notes || {})[t.id] || '';
  return { code, text: C.taskText(t, plan.lang), dot: t.done ? '#2563EB' : '#6B7280', fill: t.done ? '#2563EB' : '#FFFFFF',
    color: t.done ? '#6B7280' : '#202124', deco: t.done ? 'line-through' : 'none', label: def ? 'Adiada' : st.label, bg, fg, note, hasNote: !!note, done: t.done };
}
const rotSteps = (plan: Plan): RoutineStepVM[] => plan.rotinas.filter(r => C.ROT[r.k]).map((r, i, a) => {
  const R = C.ROT[r.k];
  return { num: pad(i + 1), name: R.n[plan.lang], time: R.w + (R.at !== '—' ? ' · ' + R.at : ''), bg: r.done ? '#EFF6FF' : '#F5F5F4', bl: r.done ? '#2563EB' : '#D6D6D3', nc: r.done ? '#2563EB' : '#6B7280', arrow: i < a.length - 1 };
});

/* ---------- pager: 3 equal faces per page ---------- */
interface Pager { slot(): number; add(f: Face): Pager; pad(label?: string, trace?: string): Pager; faces: Face[] }
const notesFace = (label = 'Notas', trace = ''): Face => ({ type: 'notes', label, trace });
function pager(): Pager {
  const faces: Face[] = [];
  const api: Pager = {
    slot: () => faces.length % 3,
    add: f => { faces.push(f); return api; },
    pad: (label = 'Notas', trace = '') => { if (!faces.length) return api; while (faces.length % 3) faces.push(notesFace(label, faces.length % 3 === 2 ? trace : '')); return api; },
    faces
  };
  return api;
}
const coverFace = (eyebrow: string, h1: string, lede: string, kpis: Kpi[]): Face => ({ type: 'cover', eyebrow, h1, lede, kpis });
interface EpicBase { num: string; eyebrow: string; title: string; pct: string; left: EpicLeft | null; unit?: string }
function addEpics(p: Pager, base: EpicBase, tasks: TaskRowVM[]) {
  // greedy face count first, then spread evenly so no continuation face holds a lone task
  let nf = 0, sim = p.slot(), left = tasks.length;
  do { left -= sim === 0 ? 3 : 4; sim = (sim + 1) % 3; nf++; } while (left > 0);
  let i = 0, first = true;
  do {
    const cap = p.slot() === 0 ? 3 : 4, take = Math.min(cap, Math.ceil((tasks.length - i) / nf--) || cap), chunk = tasks.slice(i, i + take);
    p.add({ type: 'epic', ...base, title: first ? base.title : base.title + ' · continuação', left: first ? base.left : null,
      cols: first && base.left ? 'minmax(0,1fr) minmax(0,1.3fr)' : 'minmax(0,1fr)', tasks: chunk,
      countLabel: tasks.length ? (i + 1) + '–' + (i + chunk.length) + ' de ' + tasks.length + ' ' + (base.unit || 'tarefas') : 'Sem tarefas', empty: !tasks.length });
    i += take; first = false;
  } while (i < tasks.length);
}
function addDayRows(p: Pager, rows: DayRow[]) {
  let i = 0;
  while (i < rows.length) { const cap = p.slot() === 0 ? 3 : 4; p.add({ type: 'days', rows: rows.slice(i, i + cap) }); i += cap; }
}
function addMap(p: Pager, plan: Plan, cd: Record<string, string>, all: { d: number; n: number }) {
  const units: (MapItem | { kind: 'root'; h: number })[] = [{ kind: 'root', h: 70 }];
  C.groupsUsed(plan).forEach(g => {
    const es = plan.ents.filter(e => e.grupo === g), pr = C.prog(es);
    units.push({ kind: 'group', h: 38, nome: C.GROUPS[g].nome, sub: es.length + ' entregáveis · ' + C.pct(pr) + '%' });
    es.forEach(e => {
      const ep = C.prog([e]), [bg, fg] = tone((['accent', 'warning', 'neutral'] as Tone[])[e.hz]);
      units.push({ kind: 'ent', h: 50, code: cd[e.id], titulo: e.titulo, hz: C.HZ[e.hz].nome + ' · ' + C.fmt(C.hzDate(plan, e.hz)), bg, fg, d: ep.d, n: ep.n,
        line: e.tarefas.map(t => (t.done ? '✓ ' : '○ ') + C.taskText(t, plan.lang)).join('   ') });
    });
  });
  let cur: Extract<Face, { type: 'map' }> | null = null, used = 0;
  units.forEach(u => {
    const cap = p.slot() === 0 ? 236 : 290;
    if (!cur || used + u.h > cap) { cur = { type: 'map', root: null, items: [] }; p.add(cur); used = 0; }
    if (u.kind === 'root') cur.root = { nome: plan.nome, range: C.fmt(plan.inicio) + ' → ' + C.fmt(C.endDate(plan)), d: all.d, n: all.n, pct: C.pct(all) + '%' };
    else cur.items.push(u);
    used += u.h;
  });
}
const kpi = (label: string, value: string | number, caption: string, color = '#202124'): Kpi => ({ label, value, caption, color });

/* ---------- 1 · Prisma operacional ---------- */
export function prismaVM(plan: Plan, today: string = C.todayISO()): Face[] {
  const cd = codes(plan), all = C.prog(plan.ents), late = C.lateCount(plan, today), p = pager();
  const active = plan.ents.filter(e => e.tarefas.some(t => !t.done)).length;
  p.add(coverFace('Prisma operacional · ' + plan.nome, 'Agora, próximo e depois.',
    L(plan, 'A folha organiza o período por horizonte: o que fechar agora, o que vem na sequência e o que entra depois.', 'O ciclo organizado por horizonte: caminho crítico agora, consolidação na sequência, fechamento depois.'),
    [kpi('Entregas ativas', active, 'de ' + plan.ents.length + ' entregáveis'), kpi(L(plan, 'Tarefas feitas', 'Ações concluídas'), all.d + '/' + all.n, C.pct(all) + '% do plano'),
      kpi('Em atraso', late, late ? L(plan, 'pedem nova data', 'pedem nova previsão') : 'tudo no prazo', late ? '#A33A32' : '#202124'), kpi('Fechamento', C.fmt(C.endDate(plan)), plan.periodo + ' dias desde ' + C.fmt(plan.inicio))]));
  C.HZ.forEach((h, i) => {
    const es = plan.ents.filter(e => e.hz === i), pr = C.prog(es);
    const lateHere = es.flatMap(e => e.tarefas.filter(t => !t.done && C.hzDate(plan, i) < today).map(t => cd[t.id]));
    addEpics(p, { num: pad(i + 1), eyebrow: 'Horizonte · ' + h.nome + ' · até ' + C.fmt(C.hzDate(plan, i)), title: h.tit[plan.lang], pct: C.pct(pr) + '%',
      left: { tag: 'Resultado', id: ['AGORA', 'PROX', 'DEPOIS'][i] + '-01', title: es.map(e => e.titulo).join(' · ') || 'Nenhum entregável neste horizonte',
        desc: es.map(e => cd[e.id] + ' — ' + prova(plan, e)).join(' '), hasMicro: true, microLabel: lateHere.length ? 'Atenção' : 'Regra',
        micro: lateHere.length ? lateHere.join(', ') + ' vencida' + (lateHere.length > 1 ? 's' : '') + ' no caminho crítico.' : L(plan, 'Cada item só avança quando a prova existir.', 'Cada item avança apenas com evidência verificável.') } },
    es.flatMap(e => e.tarefas.map(t => taskRow(plan, t, e, cd[t.id], today))));
  });
  if (p.slot() === 0 && plan.rotinas.length) p.pad();
  p.add({ type: 'routine', label: 'Rotina padrão diária', steps: rotSteps(plan),
    controle: L(plan, 'Se a prova de conclusão descrita para o item não existe, ele ainda não terminou.', 'Sem evidência verificável, o entregável segue em aberto.'),
    regras: L(plan, 'Comece por “Agora”. Avance para “Próximo” só quando o prazo de hoje estiver resolvido. “Depois” orienta a sequência, não o foco.', 'Execute “Agora” primeiro. Avance para “Próximo” com o caminho crítico resolvido. “Depois” orienta, não concentra esforço.') });
  p.pad();
  addMap(p, plan, cd, all);
  p.pad('Notas', 'Rastreabilidade · plano ' + plan.id + ' · versão ' + (plan.version || 1) + ' · códigos CNT, TEC, COM, OPS, EST, PES');
  return p.faces;
}

/* ---------- 2 · Plano da semana ---------- */
export function semanaVM(plan: Plan, today: string = C.todayISO()): Face[] {
  const week = weekWindow(plan, today), items = week.flatMap(d => d.items), done = items.filter(x => x.t.done).length;
  const gs = C.groupsUsed(plan), steps = rotSteps(plan), p = pager();
  p.add(coverFace('Centro de comando · semana', 'Plano dos ' + week.length + ' dias.',
    (steps.length ? 'Rotina fixa diária — ' + steps.map(r => r.name).join(', ') + ' — ' : '') + 'com foco nos entregáveis de “' + plan.nome + '” e no calendário do período.',
    [kpi('Dias', week.length, week.length ? C.fmt(week[0].iso) + ' a ' + C.fmt(week[week.length - 1].iso) : '—'), kpi('Trilhas', gs.length, gs.map(g => C.GROUPS[g].nome.toLowerCase()).join(' · ')),
      kpi('Tarefas', items.length, done + ' concluídas'), kpi('Progresso', (items.length ? Math.round(done / items.length * 100) : 0) + '%', done + ' de ' + items.length + ' tarefas')]));
  p.add({ type: 'routine', label: 'Rotina padrão diária', steps,
    controle: 'Cada dia fecha com o foco marcado como feito ou com uma nova data registrada.', regras: 'A trilha em destaque é a principal do dia. As demais seguem a rotina padrão, sem disputar o bloco de foco.' });
  addDayRows(p, week.map((d, k) => {
    const ents = [...new Map(d.items.map(x => [x.e.id, x.e])).values()], closes = plan.ents.filter(e => C.hzDate(plan, e.hz) === d.iso);
    const lead = ents[0] && ents[0].grupo;
    return { num: pad(k + 1), date: C.fmt(d.iso) + ' · ' + wd(d.iso).slice(0, 3), bg: d.iso === today ? '#EFF6FF' : '#FFFFFF',
      action: ents.length ? ents.map(e => e.titulo).join(' · ') : 'Revisão e recuperação de pendências',
      count: d.items.length + (d.items.length === 1 ? ' tarefa' : ' tarefas'), marco: closes.length ? 'Fecha ' + closes.map(e => e.titulo).join(', ') : '', hasMarco: closes.length > 0,
      tracks: [...new Set(ents.map(e => e.grupo))].slice(0, 3).map(g => ({ t: C.GROUPS[g].nome, bg: g === lead ? '#EFF6FF' : '#F5F5F4', fg: g === lead ? '#2563EB' : '#5F6670', fw: g === lead ? 700 : 400 })) };
  }));
  p.pad('Notas da semana', (steps.length ? 'Rotina padrão: ' + steps.map(r => r.name).join(' → ') + ' · ' : '') + 'fonte: Prisma “' + plan.nome + '” · conferir dados antes de distribuir');
  return p.faces;
}

/* ---------- 3 · Workbook 7 dias ---------- */
export function workbookVM(plan: Plan, today: string = C.todayISO()): Face[] {
  const cd = codes(plan), week = weekWindow(plan, today), late = C.lateCount(plan, today), p = pager();
  week.forEach((d, k) => {
    p.pad('Notas do dia');
    const ents = [...new Map(d.items.map(x => [x.e.id, x.e])).values()], closes = plan.ents.filter(e => C.hzDate(plan, e.hz) === d.iso), main = closes[0] || ents[0];
    const dn = d.items.filter(x => x.t.done).length;
    p.add({ type: 'day', eyebrow: 'Executar workbook · ' + plan.nome, title: 'Dia ' + pad(k + 1) + ' · ' + wd(d.iso), date: longDate(d.iso),
      strip: week.map((w, j) => ({ t: 'D' + pad(j + 1), s: wd(w.iso).slice(0, 3).toUpperCase(), bg: j === k ? '#202124' : '#FFFFFF', fg: j === k ? '#FFFFFF' : '#5F6670', bc: j === k ? '#202124' : '#D1D5DB' })),
      boxes: [
        { label: 'Objetivo do dia', text: ents.length ? 'Avançar ' + ents.map(e => '“' + e.titulo + '”').join(', ') + ' com evidência registrada.' : 'Revisar o painel, recuperar atrasos e preparar o próximo dia.', bg: '#FFFFFF', fg: '#202124', lc: '#6B7280' },
        { label: 'Entrega principal', text: main ? main.titulo + ' — ' + prova(plan, main) : 'Painel revisado e próximas tarefas confirmadas.', bg: '#FFFFFF', fg: '#202124', lc: '#6B7280' },
        { label: 'Gate / marco', text: 'G-D' + pad(k + 1) + ' · ' + (closes.length ? 'Fecha ' + closes.map(e => cd[e.id]).join(', ') : 'Progresso registrado'), bg: '#202124', fg: '#FFFFFF', lc: '#D6D6D3' }],
      kpis: [kpi('Readiness', (d.items.length ? Math.round(dn / d.items.length * 100) : 0) + '%', 'tarefas do dia'), kpi('Tarefas', d.items.length, 'programadas'), kpi('Entregáveis', ents.length, 'em movimento'), kpi('Em atraso', late, 'no plano todo', late ? '#A33A32' : '#202124')] });
    if (!d.items.length) p.add(notesFace('Sem tarefas programadas · revisão e recuperação'));
    for (let i = 0; i < d.items.length; i += 2) p.add({ type: 'cards', cards: d.items.slice(i, i + 2).map(({ t, e }, j) => {
      const ix = e.tarefas.indexOf(t), prev = e.tarefas[ix - 1], next = e.tarefas[ix + 1];
      return { ...taskRow(plan, t, e, cd[t.id], today), n: pad(i + j + 1), grupo: C.GROUPS[e.grupo].nome, ent: cd[e.id] + ' · ' + e.titulo,
        dep: prev ? cd[prev.id] : '—', unlocks: next ? cd[next.id] : 'Prova ' + cd[e.id], dod: prova(plan, e), feito: t.done ? '[✓] Feito' : '[  ] Feito' };
    }) });
  });
  p.pad('Notas do dia', 'Workbook gerado do Prisma “' + plan.nome + '” · tarefas distribuídas pela janela de cada horizonte');
  return p.faces;
}

/* ---------- 4 · Status report ---------- */
export function statusVM(plan: Plan, today: string = C.todayISO()): Face[] {
  const cd = codes(plan), all = C.prog(plan.ents), late = C.lateCount(plan, today), p = pager();
  const next = C.HZ.map((_, i) => C.hzDate(plan, i)).find(d => d >= today);
  p.add(coverFace('Status report · ' + C.fmt(today), plan.nome,
    all.d + ' de ' + all.n + ' tarefas concluídas (' + C.pct(all) + '%). ' + (late ? late + ' em atraso pedem nova previsão.' : 'Nenhuma tarefa em atraso.') + (next ? ' Próximo marco em ' + C.fmt(next) + '.' : ''),
    [kpi('Concluído', C.pct(all) + '%', all.d + ' de ' + all.n + ' tarefas'), kpi('Entregáveis', plan.ents.filter(e => e.tarefas.length && e.tarefas.every(t => t.done)).length + '/' + plan.ents.length, 'com prova pronta'),
      kpi('Em atraso', late, late ? 'pedem nova previsão' : 'tudo no prazo', late ? '#A33A32' : '#202124'), kpi('Próximo marco', next ? C.fmt(next) : '—', 'fechamento ' + C.fmt(C.endDate(plan)))]));
  [...plan.ents].sort((a, b) => a.hz - b.hz).forEach((e, k) => {
    const ep = C.prog([e]);
    addEpics(p, { num: pad(k + 1), eyebrow: C.HZ[e.hz].nome + ' · até ' + C.fmt(C.hzDate(plan, e.hz)) + ' · ' + C.GROUPS[e.grupo].nome, title: e.titulo, pct: C.pct(ep) + '%',
      left: { tag: C.GROUPS[e.grupo].nome, id: cd[e.id], title: L(plan, 'Prova de conclusão', 'Evidência de conclusão'), desc: prova(plan, e), hasMicro: false } },
    e.tarefas.map(t => taskRow(plan, t, e, cd[t.id], today)));
  });
  p.pad('Próximos passos', 'Rastreabilidade · plano ' + plan.id + ' · versão ' + (plan.version || 1) + ' · gerado em ' + C.fmt(today));
  return p.faces;
}

const BUILDERS: Record<TemplateId, (plan: Plan, today?: string) => Face[]> = { prisma: prismaVM, semana: semanaVM, workbook: workbookVM, status: statusVM };
export function viewModel(id: TemplateId, plan: Plan, today: string = C.todayISO()): { pages: Page[]; faceCount: number } {
  const faces = (BUILDERS[id] || prismaVM)(plan, today), T = TEMPLATES.find(t => t.id === id) || TEMPLATES[0];
  const total = Math.ceil(faces.length / 3), pages: Page[] = [];
  for (let i = 0; i < total; i++) pages.push({ n: pad(i + 1), meta: 'A4 · ' + T.short + ' · ' + pad(i + 1) + '/' + pad(total),
    faces: faces.slice(i * 3, i * 3 + 3).map((f, j) => ({ ...f, first: j === 0, idx: 'P' + pad(i + 1) + '·F' + (j + 1),
      pt: j === 0 ? '0' : '5mm', pb: j === 2 ? '0' : '5mm', bt: j === 0 ? '0' : '1px dashed #D6D6D3' })) });
  return { pages, faceCount: faces.length };
}

const esc = (s: string) => s.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
/** Self-contained HTML: same A4 pages; zoomed to the viewport on phones, true size at print. */
export function standaloneHtml(title: string, pagesHtml: string): string {
  return '<!doctype html><html lang="pt-BR"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>' + esc(title) + '</title>' +
    '<link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700&family=IBM+Plex+Mono:wght@400;700&display=swap"><style>' +
    '*{box-sizing:border-box;-webkit-print-color-adjust:exact;print-color-adjust:exact}html,body{margin:0;background:#F5F5F4}#pk{padding:16px 0;display:flex;flex-direction:column;align-items:center;gap:16px}' +
    '.page{width:210mm;height:297mm;overflow:hidden;background:#fff;box-shadow:0 8px 28px rgb(0 0 0/.10);flex:none}' +
    '@page{size:A4 portrait;margin:0}@media print{html,body{background:#fff}#pk{padding:0;gap:0;display:block;zoom:1!important}.page{box-shadow:none;break-after:page}.page:last-child{break-after:auto}}' +
    '</style></head><body><div id="pk">' + pagesHtml + '</div><script>(function(){var f=function(){var w=innerWidth,z=w<830?w/830:1;document.getElementById("pk").style.zoom=z};f();addEventListener("resize",f);addEventListener("beforeprint",function(){document.getElementById("pk").style.zoom=1});addEventListener("afterprint",f)})()</' + 'script></body></html>';
}
