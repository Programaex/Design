// Offline-first sync: a pure three-way merge between the last synced snapshot (base), this device (local)
// and the server copy (remote). Used by POST /api/sync; the clients keep `base` alongside their outbox.
import type { Conflict, Deliverable, Plan, RoutineItem, Task } from './types';

const taskKey = (t: Task) => JSON.stringify([t.p, t.e, t.custom ?? null, t.done]);
const sameTask = (a?: Task, b?: Task) => (!a && !b) || (!!a && !!b && taskKey(a) === taskKey(b));
const json = (x: unknown) => JSON.stringify(x ?? null);

/** Picks one side per field: changed only on one side → that side; changed on both → local (the user who is syncing). */
function pick<T>(base: T | undefined, local: T, remote: T): T {
  if (json(local) === json(remote)) return remote;
  if (json(base) === json(local)) return remote;
  return local;
}

function indexTasks(p: Plan | null): Map<string, { t: Task; entId: string }> {
  const m = new Map<string, { t: Task; entId: string }>();
  p?.ents.forEach(e => e.tarefas.forEach(t => m.set(t.id, { t, entId: e.id })));
  return m;
}

export interface MergeResult { merged: Plan; conflicts: Conflict[] }

export function mergePlans(base: Plan | null, local: Plan, remote: Plan, remoteBy = 'Outro aparelho'): MergeResult {
  const B = indexTasks(base), Lx = indexTasks(local), R = indexTasks(remote);
  const conflicts: Conflict[] = [];
  const keep = new Map<string, Task>();
  const ids = new Set([...B.keys(), ...Lx.keys(), ...R.keys()]);
  ids.forEach(id => {
    const b = B.get(id)?.t, l = Lx.get(id)?.t, r = R.get(id)?.t;
    const lc = !sameTask(b, l), rc = !sameTask(b, r);
    if (!l && !r) return;
    if (!l) { if (b && !rc) return; keep.set(id, r!); return; }          // deleted locally (kept if remote edited it)
    if (!r) { if (b && !lc) return; keep.set(id, l); return; }           // deleted remotely (kept if local edited it)
    if (lc && rc && !sameTask(l, r)) {
      conflicts.push({ taskId: id, by: remoteBy, local: { custom: l.custom ?? l.p, done: l.done }, remote: { custom: r.custom ?? r.p, done: r.done } });
      keep.set(id, r);
      return;
    }
    keep.set(id, lc ? l : r);
  });

  const bEnts = new Map(base?.ents.map(e => [e.id, e]) ?? []);
  const lEnts = new Map(local.ents.map(e => [e.id, e]));
  const rEnts = new Map(remote.ents.map(e => [e.id, e]));
  const entIds = [...remote.ents.map(e => e.id), ...local.ents.map(e => e.id).filter(id => !rEnts.has(id))];
  const ents: Deliverable[] = [];
  entIds.forEach(id => {
    const b = bEnts.get(id), l = lEnts.get(id), r = rEnts.get(id);
    if (!l && b) return;                                   // deliverable removed locally
    if (!r && b) return;                                   // removed remotely
    const src = l ?? r!;
    const head = r && l ? { ...r, titulo: pick(b?.titulo, l.titulo, r.titulo), hz: pick(b?.hz, l.hz, r.hz), grupo: pick(b?.grupo, l.grupo, r.grupo), prova: pick(b?.prova, l.prova, r.prova) } : src;
    const order = [...(r?.tarefas ?? []).map(t => t.id), ...(l?.tarefas ?? []).map(t => t.id).filter(t => !(r?.tarefas ?? []).some(x => x.id === t))];
    const tarefas = order.filter(t => keep.has(t)).map(t => keep.get(t)!);
    ents.push({ ...head, tarefas });
  });

  const bRot = new Map(base?.rotinas.map(x => [x.id, x]) ?? []);
  const rRot = new Map(remote.rotinas.map(x => [x.id, x]));
  const rotinas: RoutineItem[] = local.rotinas.map(l => { const r = rRot.get(l.id); return r ? { ...l, done: pick(bRot.get(l.id)?.done, l.done, r.done) } : l; });

  const merged: Plan = {
    ...remote,
    nome: pick(base?.nome, local.nome, remote.nome),
    lang: pick(base?.lang, local.lang, remote.lang),
    inicio: pick(base?.inicio, local.inicio, remote.inicio),
    periodo: pick(base?.periodo, local.periodo, remote.periodo),
    rotDate: local.rotDate > remote.rotDate ? local.rotDate : remote.rotDate,
    notes: { ...(remote.notes || {}), ...diffObj(base?.notes, local.notes) },
    itemStatus: { ...(remote.itemStatus || {}), ...diffObj(base?.itemStatus, local.itemStatus) },
    ents, rotinas,
    version: Math.max(remote.version, local.version) + 1
  };
  return { merged, conflicts };
}

function diffObj<T>(base: Record<string, T> | undefined, local: Record<string, T> | undefined): Record<string, T> {
  const out: Record<string, T> = {};
  Object.entries(local || {}).forEach(([k, v]) => { if (json((base || {})[k]) !== json(v)) out[k] = v; });
  return out;
}

/** Human labels for the outbox list ("Fila de envio"). */
export interface OutboxEntry { id: string; label: string; at: number }
