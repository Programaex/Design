// Prisma core — pure, framework-free domain logic (port of the Claude Design upstream/core/plan.js).
// Shared by the web app, the Next.js API routes and the Expo app. No DOM, no storage, no rendering.
import type {
  Bilingual, Conflict, Deliverable, ExecItem, Granularity, GroupKey, Hz, ItemStatus, Lang, Plan, RoutineKey,
  Setup, SetupEnt, StepId, Task, Timer, Tone
} from './types';

export const uid = (): string => Math.random().toString(36).slice(2, 9);
/** Plan ids travel to the server, so they are longer than the per-plan task ids. */
export const planUid = (): string => uid() + uid() + uid();
const pad = (n: number) => String(n).padStart(2, '0');
export const isoOf = (d: Date): string => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
export const todayISO = (): string => isoOf(new Date());
export const addDays = (iso: string, n: number): string => {
  const [y, m, d] = iso.split('-').map(Number);
  return isoOf(new Date(y, m - 1, d + n));
};
export const fmt = (iso: string): string => `${iso.slice(8, 10)}/${iso.slice(5, 7)}`;

/* ---------- content ---------- */
export interface GroupDef { nome: string; ic: string; desc: string; color: string; hex: string }
export const GROUPS: Record<GroupKey, GroupDef> = {
  conteudo: { nome: 'Conteúdo', ic: 'pen-nib', desc: 'Textos, vídeos, posts', color: 'var(--brain-pink)', hex: '#f08de7' },
  tecnico: { nome: 'Técnico', ic: 'code', desc: 'Produto, código, integração', color: 'var(--brain-blue)', hex: '#429fe8' },
  comercial: { nome: 'Comercial', ic: 'handshake', desc: 'Propostas, vendas, contatos', color: 'var(--brain-green)', hex: '#488600' },
  operacao: { nome: 'Operação', ic: 'gear-six', desc: 'Fluxos, processos, reuniões', color: 'var(--brain-orange)', hex: '#f58200' },
  estudo: { nome: 'Estudo', ic: 'book-open', desc: 'Cursos, leitura, prática', color: 'var(--brain-violet)', hex: '#4054e9' },
  pessoal: { nome: 'Pessoal', ic: 'house', desc: 'Saúde, casa, documentos', color: 'var(--brain-yellow)', hex: '#f8d800' }
};
export const GKEYS = Object.keys(GROUPS) as GroupKey[];
export const SUG: Record<GroupKey, string[]> = {
  conteudo: ['Artigo principal', 'Roteiro de vídeo', 'Newsletter', 'Post de lançamento'],
  tecnico: ['Protótipo funcionando', 'Integração validada', 'Página publicada', 'Rotina de backup'],
  comercial: ['Proposta comercial', 'Lista de contatos', 'Apresentação de venda', 'Campanha de e-mail'],
  operacao: ['Fluxo de trabalho documentado', 'Painel de acompanhamento', 'Checklist de entrega', 'Reunião de alinhamento'],
  estudo: ['Resumo do curso', 'Plano de leitura', 'Fichas de revisão', 'Exercício prático'],
  pessoal: ['Consulta ou compromisso', 'Organização da casa', 'Rotina de exercício', 'Documento pendente']
};
type Tpl = (x: string) => Bilingual;
const T = (p: string, e: string): Tpl => x => ({ p: p.replace('§', x), e: e.replace('§', x) });
export const TPL: Record<GroupKey, Tpl[]> = {
  conteudo: [T('Escrever o primeiro rascunho de “§”', 'Produzir a versão 1 de “§”'), T('Revisar e cortar o que sobra em “§”', 'Revisar e consolidar a mensagem de “§”'), T('Publicar ou enviar “§”', 'Publicar “§” e registrar a evidência')],
  tecnico: [T('Definir o que precisa funcionar em “§”', 'Especificar os critérios de aceite de “§”'), T('Construir a parte principal de “§”', 'Implementar o escopo central de “§”'), T('Testar e corrigir “§”', 'Validar “§” e tratar defeitos críticos')],
  comercial: [T('Listar quem vai receber “§”', 'Segmentar público e oferta de “§”'), T('Montar o material de “§”', 'Estruturar proposta e materiais de “§”'), T('Enviar “§” e anotar as respostas', 'Executar o contato e registrar o retorno de “§”')],
  operacao: [T('Descrever o passo a passo de “§”', 'Mapear o fluxo de “§”'), T('Combinar quem faz o quê em “§”', 'Alocar responsáveis e datas de “§”'), T('Rodar “§” uma vez e ajustar', 'Executar piloto de “§” e corrigir desvios')],
  estudo: [T('Separar o material de “§”', 'Curar as fontes de “§”'), T('Estudar “§” em blocos curtos', 'Executar blocos de estudo focado em “§”'), T('Resumir “§” com minhas palavras', 'Sintetizar os aprendizados de “§”')],
  pessoal: [T('Escolher o próximo passo de “§”', 'Definir a próxima ação de “§”'), T('Reservar um horário para “§”', 'Bloquear janela na agenda para “§”'), T('Fazer “§” e marcar como feito', 'Executar “§” e registrar a conclusão')]
};
export const TPL_FINAL = T('Conferir se “§” existe e abre sem erro', 'Verificar a prova de conclusão de “§”');
export interface RoutineDef { n: Bilingual; d: Bilingual; w: string; at: string }
export const ROT: Record<RoutineKey, RoutineDef> = {
  abrir: { n: { p: 'Abrir o dia', e: 'Abertura do dia' }, d: { p: 'Ler o painel e escolher 1 prioridade.', e: 'Revisar o painel e definir a prioridade única.' }, w: 'Manhã', at: '08:30' },
  foco: { n: { p: 'Bloco de foco', e: 'Bloco de trabalho profundo' }, d: { p: 'Trabalhar 90 minutos em uma entrega, sem notificações.', e: 'Executar 90 min em uma única entrega, sem interrupções.' }, w: 'Manhã', at: '09:00' },
  pausa: { n: { p: 'Pausas', e: 'Ciclos de recuperação' }, d: { p: 'A cada 50 minutos, descansar 10.', e: 'Ciclos 50/10 com recuperação programada.' }, w: 'Ao longo do dia', at: '—' },
  fechar: { n: { p: 'Fechar o dia', e: 'Encerramento do dia' }, d: { p: 'Marcar o que terminou e anotar o que sobrou.', e: 'Atualizar status e registrar pendências.' }, w: 'Fim do dia', at: '18:00' },
  semanal: { n: { p: 'Revisão semanal', e: 'Revisão semanal de carteira' }, d: { p: 'Olhar o que atrasou e mudar as datas.', e: 'Revisar atrasos e refazer a previsão de datas.' }, w: 'Sexta', at: '16:00' }
};
export const ROT_KEYS = Object.keys(ROT) as RoutineKey[];
export interface Choice<T> { id: T; t: string; s: string }
export const PERIODOS: Choice<number>[] = [{ id: 3, t: '3 dias', s: 'Sprint curta' }, { id: 7, t: '1 semana', s: '7 dias corridos' }, { id: 14, t: '2 semanas', s: 'Sprint padrão' }, { id: 30, t: '1 mês', s: '30 dias corridos' }];
export const ENERGIA: Choice<number>[] = [{ id: 2, t: 'Enxuto', s: '2 tarefas por entregável' }, { id: 3, t: 'Padrão', s: '3 tarefas por entregável' }, { id: 4, t: 'Detalhado', s: '4 tarefas, incluindo a conferência da prova' }];
export const LANGS: Choice<Lang>[] = [{ id: 'p', t: 'Linguagem simples', s: '“Escrever o primeiro rascunho.”' }, { id: 'e', t: 'Linguagem executiva', s: '“Produzir a versão 1.”' }];
export const HZ: { nome: string; tit: Bilingual }[] = [
  { nome: 'Agora', tit: { p: 'Fechar o que vence primeiro', e: 'Executar o caminho crítico' } },
  { nome: 'Próximo', tit: { p: 'Preparar o que vem na sequência', e: 'Consolidar a sequência de entregas' } },
  { nome: 'Depois', tit: { p: 'Encaminhar o que fecha o período', e: 'Garantir o fechamento do ciclo' } }
];
export const STEPS: { id: StepId; q: string; h: string }[] = [
  { id: 'nome', q: 'Como se chama este plano?', h: 'Um nome curto que você reconheça de relance.' },
  { id: 'periodo', q: 'Em quanto tempo você quer entregar?', h: 'O período define as datas de Agora, Próximo e Depois.' },
  { id: 'grupos', q: 'Que tipos de trabalho entram no plano?', h: 'Cada tipo vira um grupo no mapa mental.' },
  { id: 'ents', q: 'Quais entregáveis você precisa fechar?', h: 'Algo que existe no fim e pode ser aberto, enviado ou usado.' },
  { id: 'dist', q: 'Quando cada um deve estar pronto?', h: 'Agora vence primeiro. Depois fecha o período.' },
  { id: 'energia', q: 'Quanto detalhe nas tarefas?', h: 'Você pode editar, incluir e remover depois.' },
  { id: 'rotinas', q: 'Quais rotinas sustentam o plano?', h: 'Hábitos que reiniciam toda manhã. Opcional.' },
  { id: 'lang', q: 'Como prefere o texto das tarefas?', h: 'Dá para trocar a qualquer momento em Ajustes.' }
];

export const defaultSetup = (): Setup => ({ nome: '', periodo: 7, grupos: [], ents: [], energia: 3, rotinas: ['abrir', 'foco', 'fechar'], lang: 'p' });

/* ---------- wizard ---------- */
export function validate(stepId: StepId, s: Setup): string {
  if (stepId === 'nome' && !s.nome.trim()) return 'Dê um nome ao plano para continuar.';
  if (stepId === 'grupos' && !s.grupos.length) return 'Escolha pelo menos um tipo de trabalho.';
  if (stepId === 'ents' && !s.ents.length) return 'Escolha ou adicione pelo menos um entregável.';
  return '';
}
export function autoAssign(ents: SetupEnt[], force: boolean): SetupEnt[] {
  const n = ents.length;
  return ents.map((e, i) => (force || e.hz == null) ? { ...e, hz: Math.min(2, Math.floor(i * 3 / n)) as Hz } : e);
}

/* ---------- plan ---------- */
export function buildPlan(s: Setup, inicio: string = todayISO()): Plan {
  const idx = ({ 2: [0, 2], 3: [0, 1, 2], 4: [0, 1, 2, 3] } as Record<number, number[]>)[s.energia] || [0, 1, 2];
  const now = Date.now();
  const ents: Deliverable[] = s.ents.map(e => {
    const steps = TPL[e.grupo].map(f => f(e.titulo)).concat([TPL_FINAL(e.titulo)]);
    return {
      id: e.id, titulo: e.titulo, grupo: e.grupo, hz: e.hz ?? 0,
      prova: { p: `Existe “${e.titulo}” pronto, que alguém consegue abrir, ler ou usar.`, e: `Há evidência verificável de que “${e.titulo}” foi concluído e está disponível.` },
      tarefas: idx.map(i => ({ id: uid(), p: steps[i].p, e: steps[i].e, done: false, updatedAt: now }))
    };
  });
  return { id: planUid(), nome: s.nome.trim(), inicio, periodo: s.periodo, lang: s.lang, ents,
    rotinas: s.rotinas.map(k => ({ id: uid(), k, done: false })), rotDate: inicio, version: 1 };
}
const offset = (hz: number, total: number) => [0, Math.max(1, Math.round(total * 0.4)), total][hz];
export const hzDate = (plan: Pick<Plan, 'inicio' | 'periodo'>, hz: number): string => addDays(plan.inicio, offset(hz, plan.periodo));
export const endDate = (plan: Pick<Plan, 'inicio' | 'periodo'>): string => addDays(plan.inicio, plan.periodo);
export const taskText = (t: Task, lang: Lang): string => t.custom ?? (lang === 'e' ? t.e : t.p);
export const provaText = (e: Deliverable, lang: Lang): string => lang === 'e' ? e.prova.e : e.prova.p;
export const prog = (ents: Deliverable[]): { d: number; n: number } => {
  const ts = ents.flatMap(e => e.tarefas);
  return { d: ts.filter(t => t.done).length, n: ts.length };
};
export const pct = (p: { d: number; n: number }): number => p.n ? Math.round(p.d / p.n * 100) : 0;

export function statusOf(plan: Plan, t: Task, hz: number, today: string = todayISO()): { tone: Tone; label: string } {
  if (t.done) return { tone: 'success', label: 'Feito' };
  const d = hzDate(plan, hz);
  if (d < today) return { tone: 'danger', label: 'Atraso · ' + fmt(d) };
  if (d === today) return { tone: 'accent', label: 'Hoje' };
  return { tone: hz === 1 ? 'warning' : 'neutral', label: fmt(d) };
}
export const lateCount = (plan: Plan, today: string = todayISO()): number =>
  plan.ents.reduce((n, e) => n + e.tarefas.filter(t => !t.done && hzDate(plan, e.hz) < today).length, 0);
export const groupsUsed = (plan: Plan): GroupKey[] => GKEYS.filter(g => plan.ents.some(e => e.grupo === g));

/* ---------- mutations (immutable) ---------- */
const mapTask = (plan: Plan, id: string, fn: (t: Task) => Task): Plan =>
  ({ ...plan, ents: plan.ents.map(e => ({ ...e, tarefas: e.tarefas.map(t => t.id === id ? { ...fn(t), updatedAt: Date.now() } : t) })) });
export const toggleTask = (plan: Plan, id: string): Plan => mapTask(plan, id, t => ({ ...t, done: !t.done }));
export const renameTask = (plan: Plan, id: string, text: string): Plan => mapTask(plan, id, t => ({ ...t, custom: text }));
export const addTask = (plan: Plan, entId: string, text: string): Plan => ({ ...plan, ents: plan.ents.map(e => e.id === entId
  ? { ...e, tarefas: [...e.tarefas, { id: uid(), p: text, e: text, custom: text, done: false, updatedAt: Date.now() }] } : e) });
export const removeTask = (plan: Plan, id: string): Plan => ({ ...plan, ents: plan.ents.map(e => ({ ...e, tarefas: e.tarefas.filter(t => t.id !== id) })) });
export const toggleRoutine = (plan: Plan, id: string): Plan => ({ ...plan, rotinas: plan.rotinas.map(r => r.id === id ? { ...r, done: !r.done } : r) });
export const resetRoutines = (plan: Plan, today: string = todayISO()): Plan => ({ ...plan, rotDate: today, rotinas: plan.rotinas.map(r => ({ ...r, done: false })) });
export const resetRoutinesIfNewDay = (plan: Plan, today: string = todayISO()): Plan => plan.rotDate === today ? plan : resetRoutines(plan, today);
export const setLang = (plan: Plan, lang: Lang): Plan => ({ ...plan, lang });

/* ---------- sync / portability ---------- */
export const exportPayload = (plan: Plan, setup: Setup) => ({ versao: 1, plan, setup });
export function parseImport(text: string): { plan: Plan; setup: Setup } {
  const j = JSON.parse(text);
  if (!j || !j.plan || !Array.isArray(j.plan.ents)) throw new Error('Arquivo inválido');
  return { plan: j.plan as Plan, setup: { ...defaultSetup(), ...(j.setup || {}) } };
}
/** Field-level conflict: both sides changed the same task since the last sync cursor. */
export function resolveConflict(plan: Plan, conflict: Conflict, choice: 'local' | 'remote'): Plan {
  const pick = choice === 'local' ? conflict.local : conflict.remote;
  return mapTask(plan, conflict.taskId, t => ({ ...t, ...pick }));
}
export const slug = (s: string): string =>
  s.toLowerCase().normalize('NFD').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/* ---------- demo ---------- */
export function demoPlan(today: string = todayISO()): { setup: Setup; plan: Plan } {
  const id = uid;
  const setup: Setup = { nome: 'Lançamento do blog', periodo: 7, grupos: ['conteudo', 'tecnico', 'comercial'], energia: 3, rotinas: ['abrir', 'foco', 'pausa', 'fechar'], lang: 'p',
    ents: [{ id: id(), titulo: 'Artigo principal', grupo: 'conteudo', hz: 0 }, { id: id(), titulo: 'Página publicada', grupo: 'tecnico', hz: 0 }, { id: id(), titulo: 'Newsletter', grupo: 'conteudo', hz: 1 }, { id: id(), titulo: 'Proposta comercial', grupo: 'comercial', hz: 1 }, { id: id(), titulo: 'Rotina de backup', grupo: 'tecnico', hz: 2 }] };
  let plan = buildPlan(setup, addDays(today, -3));
  plan = toggleTask(plan, plan.ents[0].tarefas[0].id); plan = toggleTask(plan, plan.ents[0].tarefas[1].id); plan = toggleTask(plan, plan.ents[1].tarefas[0].id);
  plan = toggleRoutine(plan, plan.rotinas[0].id);
  return { setup, plan: { ...plan, rotDate: today } };
}

/* ---------- execução sequencial (apps/scroll-task · INSTRUCOES_DESENVOLVIMENTO.md) ---------- */
export const GRANULARITY: { id: Granularity; t: string }[] = [{ id: 'action', t: 'Ação' }, { id: 'task', t: 'Tarefa' }, { id: 'phase', t: 'Fase' }, { id: 'workflow', t: 'Workflow' }];
export const PRESETS = [15, 30, 45];
/** Rebuilds the sequence for a granularity without changing the active plan.
 *  action = tarefa · task = entregável · phase = horizonte · workflow = plano inteiro. */
export function executionQueue(plan: Plan, gran: Granularity = 'action'): ExecItem[] {
  const lang = plan.lang, notes = plan.notes || {}, st = plan.itemStatus || {};
  const mk = (id: string, type: Granularity, title: string, sub: string, context: string, tasks: Task[], hz: Hz): ExecItem => {
    const done = tasks.length > 0 && tasks.every(t => t.done);
    return { id, type, title, sub, context, taskIds: tasks.map(t => t.id), d: tasks.filter(t => t.done).length, n: tasks.length,
      status: (done ? 'done' : (st[id] || 'ready')) as ItemStatus, notes: notes[id] || '', hz };
  };
  const ents = [...plan.ents].sort((a, b) => a.hz - b.hz);
  if (gran === 'workflow') return [mk('wf:' + plan.id, 'workflow', plan.nome, fmt(plan.inicio) + ' → ' + fmt(endDate(plan)),
    ents.map(e => e.titulo).join(' · '), ents.flatMap(e => e.tarefas), 0)];
  if (gran === 'phase') return HZ.map((h, i) => ({ h, i: i as Hz, es: ents.filter(e => e.hz === i) })).filter(x => x.es.length)
    .map(({ h, i, es }) => mk('hz:' + i, 'phase', h.tit[lang], h.nome + ' · até ' + fmt(hzDate(plan, i)), es.map(e => e.titulo).join(' · '), es.flatMap(e => e.tarefas), i));
  if (gran === 'task') return ents.map(e => mk('ent:' + e.id, 'task', e.titulo, GROUPS[e.grupo].nome + ' · até ' + fmt(hzDate(plan, e.hz)), provaText(e, lang), e.tarefas, e.hz));
  return ents.flatMap(e => e.tarefas.map(t => mk(t.id, 'action', taskText(t, lang), e.titulo + ' · ' + GROUPS[e.grupo].nome, provaText(e, lang), [t], e.hz)));
}
export const pendingCount = (q: ExecItem[]): number => q.filter(x => x.status !== 'done').length;
/** Completion is always explicit — never called by the timer. */
export function setItemDone(plan: Plan, item: Pick<ExecItem, 'id' | 'taskIds'>, done: boolean): Plan {
  const ids = new Set(item.taskIds), now = Date.now(), s = { ...(plan.itemStatus || {}) }; delete s[item.id];
  return { ...plan, itemStatus: s, ents: plan.ents.map(e => ({ ...e, tarefas: e.tarefas.map(t => ids.has(t.id) ? { ...t, done, updatedAt: now } : t) })) };
}
export const deferItem = (plan: Plan, id: string): Plan => {
  const s = { ...(plan.itemStatus || {}) }; s[id] = s[id] === 'deferred' ? 'ready' : 'deferred';
  return { ...plan, itemStatus: s };
};
export const setNote = (plan: Plan, id: string, text: string): Plan => ({ ...plan, notes: { ...(plan.notes || {}), [id]: text } });
export const itemState = (plan: Plan, id: string): 'ready' | 'deferred' => (plan.itemStatus || {})[id] || 'ready';

/* timer: start/end timestamps are the source of truth (survives background/reload) */
export const timerReady = (min: number): Timer => ({ state: 'ready', minutes: min, remainingMs: Math.round(min * 60000), endsAt: null });
export const timerStart = (t: Timer, now: number = Date.now()): Timer => ({ ...t, state: 'running', endsAt: now + t.remainingMs });
export const timerPause = (t: Timer, now: number = Date.now()): Timer => ({ ...t, state: 'paused', remainingMs: Math.max(0, (t.endsAt ?? now) - now), endsAt: null });
export const timerLeft = (t: Timer, now: number = Date.now()): number => t.state === 'running' ? Math.max(0, (t.endsAt ?? now) - now) : t.remainingMs;
export const timerTimeUp = (t: Timer): Timer => ({ ...t, state: 'time_up', remainingMs: 0, endsAt: null });
export const fmtClock = (ms: number): string => { const s = Math.ceil(ms / 1000); return pad(Math.floor(s / 60)) + ':' + pad(s % 60); };

/* ---------- CSV #3 do plano-operacional-rastreavel (apps/workflow/shared/plan.ts) ---------- */
export function parseCsv(text: string): { header: string[]; rows: Record<string, string>[] } {
  const src = text.replace(/^﻿/, ''), first = src.split('\n')[0];
  const sep = (first.match(/;/g) || []).length > (first.match(/,/g) || []).length ? ';' : ',';
  const rows: string[][] = []; let row: string[] = [], cell = '', q = false;
  for (let i = 0; i < src.length; i++) {
    const c = src[i];
    if (q) { if (c === '"') { if (src[i + 1] === '"') { cell += '"'; i++; } else q = false; } else cell += c; }
    else if (c === '"') q = true;
    else if (c === sep) { row.push(cell); cell = ''; }
    else if (c === '\n' || c === '\r') { if (c === '\r' && src[i + 1] === '\n') i++; row.push(cell); rows.push(row); row = []; cell = ''; }
    else cell += c;
  }
  if (cell || row.length) { row.push(cell); rows.push(row); }
  const [h = [], ...body] = rows.filter(r => r.some(x => x.trim()));
  const header = h.map(x => x.trim());
  return { header, rows: body.map(r => Object.fromEntries(header.map((k, i) => [k, (r[i] ?? '').trim()]))) };
}
export const PLAN_CSV_REQUIRED = ['tarefa_id', 'cluster_id', 'cluster_nome', 'titulo'];
/** cluster → entregável · prioridade Alta/Média/Baixa → Agora/Próximo/Depois · evidencia_conclusao → prova. */
export function planFromCsv(text: string, nome = 'Plano operacional', inicio: string = todayISO()): { plan: Plan; setup: Setup } {
  const { header, rows } = parseCsv(text);
  const miss = PLAN_CSV_REQUIRED.filter(c => !header.includes(c));
  if (miss.length) throw new Error('Colunas ausentes: ' + miss.join(', '));
  if (!rows.length) throw new Error('CSV sem tarefas');
  const PRI: Record<string, Hz> = { Alta: 0, 'Média': 1, Media: 1, Baixa: 2 };
  const by = new Map<string, Record<string, string>[]>(); let maxPrazo = '';
  rows.forEach(r => {
    const k = r.cluster_id || r.cluster_nome; if (!by.has(k)) by.set(k, []); by.get(k)!.push(r);
    if (/^\d{4}-\d{2}-\d{2}$/.test(r.prazo || '') && r.prazo > maxPrazo) maxPrazo = r.prazo;
  });
  const day = (iso: string) => { const [y, m, d] = iso.split('-').map(Number); return new Date(y, m - 1, d).getTime(); };
  const periodo = maxPrazo ? Math.max(3, Math.round((day(maxPrazo) - day(inicio)) / 864e5)) : 30;
  const now = Date.now();
  const ents: Deliverable[] = [...by.values()].map(rs => {
    const pv = rs.map(r => r.evidencia_conclusao || r.concluido_quando).find(Boolean) || 'TBD';
    return { id: uid(), titulo: rs[0].cluster_nome || rs[0].cluster_id, grupo: 'operacao' as GroupKey,
      hz: Math.min(...rs.map(r => PRI[r.prioridade] ?? 1)) as Hz, prova: { p: pv, e: pv },
      tarefas: rs.map(r => ({ id: uid(), ref: r.tarefa_id, p: r.titulo, e: r.titulo, custom: r.titulo, done: false, updatedAt: now })) };
  });
  return { plan: { id: planUid(), nome, inicio, periodo, lang: 'p', ents, rotinas: [], rotDate: inicio, version: 1 },
    setup: { ...defaultSetup(), nome, periodo, grupos: ['operacao'] } };
}
