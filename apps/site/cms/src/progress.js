// Completude: um micro está concluído quando seu estado no Kanban chega a PUBLICADO (ou depois).
import { score } from '../../lib/score.mjs';
import { DONE_STATES } from './store.js';

export const doneMap = progress => Object.fromEntries(Object.entries(progress?.state || {}).filter(([, s]) => DONE_STATES.has(s)).map(([k]) => [k, true]));
export const progressOf = (data, progress) => score(data.completeness, doneMap(progress));
export const stateOf = (progress, microId) => progress?.state?.[microId] || 'CAPTURADO';
