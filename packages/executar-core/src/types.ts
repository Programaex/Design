// Domain types for the Prisma plan. Mirrors apps/executar-web/prisma/schema.prisma.

export type Lang = 'p' | 'e';
export type GroupKey = 'conteudo' | 'tecnico' | 'comercial' | 'operacao' | 'estudo' | 'pessoal';
export type RoutineKey = 'abrir' | 'foco' | 'pausa' | 'fechar' | 'semanal';
export type Hz = 0 | 1 | 2;
export type Tone = 'success' | 'danger' | 'accent' | 'warning' | 'neutral';
export type Bilingual = { p: string; e: string };

export interface Task {
  id: string;
  /** External code from the CSV import (tarefa_id). */
  ref?: string;
  p: string;
  e: string;
  custom?: string;
  done: boolean;
  updatedAt: number;
}

export interface Deliverable {
  id: string;
  titulo: string;
  grupo: GroupKey;
  hz: Hz;
  prova: Bilingual;
  tarefas: Task[];
}

export interface RoutineItem {
  id: string;
  k: RoutineKey;
  done: boolean;
}

export type ItemStatus = 'ready' | 'deferred' | 'done';

export interface Plan {
  id: string;
  nome: string;
  /** ISO date (YYYY-MM-DD). */
  inicio: string;
  periodo: number;
  lang: Lang;
  ents: Deliverable[];
  rotinas: RoutineItem[];
  rotDate: string;
  version: number;
  notes?: Record<string, string>;
  itemStatus?: Record<string, 'deferred' | 'ready'>;
}

export interface SetupEnt {
  id: string;
  titulo: string;
  grupo: GroupKey;
  hz: Hz | null;
}

export interface Setup {
  nome: string;
  periodo: number;
  grupos: GroupKey[];
  ents: SetupEnt[];
  energia: number;
  rotinas: RoutineKey[];
  lang: Lang;
}

export type StepId = 'nome' | 'periodo' | 'grupos' | 'ents' | 'dist' | 'energia' | 'rotinas' | 'lang';

export type Granularity = 'action' | 'task' | 'phase' | 'workflow';

export interface ExecItem {
  id: string;
  type: Granularity;
  title: string;
  sub: string;
  context: string;
  taskIds: string[];
  d: number;
  n: number;
  status: ItemStatus;
  notes: string;
  hz: Hz;
}

export type TimerState = 'ready' | 'running' | 'paused' | 'time_up';
export interface Timer {
  state: TimerState;
  minutes: number;
  remainingMs: number;
  endsAt: number | null;
}

export interface Conflict {
  taskId: string;
  by: string;
  local: Partial<Pick<Task, 'custom' | 'done'>>;
  remote: Partial<Pick<Task, 'custom' | 'done'>>;
}
