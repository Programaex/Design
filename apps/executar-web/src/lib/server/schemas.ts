import 'server-only';
import type * as C from '@executar/core';
import { z } from 'zod';

// Request validation for the plan payloads the devices send. Limits keep a single plan well under 1 MB.
const id = z.string().min(1).max(64).regex(/^[\w:.-]+$/);
const text = (max = 500) => z.string().max(max);
const iso = z.string().regex(/^\d{4}-\d{2}-\d{2}$/);
const group = z.enum(['conteudo', 'tecnico', 'comercial', 'operacao', 'estudo', 'pessoal']);
const hz = z.union([z.literal(0), z.literal(1), z.literal(2)]);

export const TaskSchema = z.object({
	id, ref: text(64).optional(), p: text(), e: text(), custom: text().optional(), done: z.boolean(), updatedAt: z.number().int().nonnegative()
});
export const DeliverableSchema = z.object({
	id, titulo: text(200), grupo: group, hz, prova: z.object({ p: text(1000), e: text(1000) }), tarefas: z.array(TaskSchema).max(200)
});
export const PlanSchema = z.object({
	id: z.string().min(8).max(64).regex(/^[\w-]+$/),
	nome: text(120), inicio: iso, periodo: z.number().int().min(1).max(366), lang: z.enum(['p', 'e']),
	ents: z.array(DeliverableSchema).max(100),
	rotinas: z.array(z.object({ id, k: z.enum(['abrir', 'foco', 'pausa', 'fechar', 'semanal']), done: z.boolean() })).max(10),
	rotDate: iso, version: z.number().int().nonnegative(),
	notes: z.record(z.string().max(80), text(2000)).optional(),
	itemStatus: z.record(z.string().max(80), z.enum(['deferred', 'ready'])).optional()
});
export const SetupSchema = z.object({
	nome: text(120), periodo: z.number().int().min(1).max(366), grupos: z.array(group).max(6),
	ents: z.array(z.object({ id, titulo: text(200), grupo: group, hz: hz.nullable() })).max(100),
	energia: z.number().int().min(2).max(4), rotinas: z.array(z.enum(['abrir', 'foco', 'pausa', 'fechar', 'semanal'])).max(5), lang: z.enum(['p', 'e'])
});
export const SyncSchema = z.object({ base: PlanSchema.nullable(), local: PlanSchema, setup: SetupSchema.optional() });
export const SettingsSchema = z.object({ reminders: z.boolean(), remTime: z.string().regex(/^\d{2}:\d{2}$/), lateAlerts: z.boolean(), ai: z.boolean() });
export const EmailSchema = z.object({ email: z.string().trim().toLowerCase().email().max(254), next: z.string().max(200).optional() });

// zod's inferred types are structurally the core types; this keeps the API honest if either side drifts.
type Same<A, B> = [A] extends [B] ? ([B] extends [A] ? true : false) : false;
const _planCheck: Same<z.infer<typeof PlanSchema>['ents'][number]['tarefas'][number], C.Task> = true;
void _planCheck;
