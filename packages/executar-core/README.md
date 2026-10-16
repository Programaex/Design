# @executar/core

Domínio do Prisma (EXECUTAR) em funções puras — sem DOM, sem storage, sem renderização de framework.
Port em TypeScript de `upstream/core/plan.js` e `upstream/core/export.js` do handoff do Claude Design.

| Módulo | Conteúdo |
|---|---|
| `plan.ts` | questionário (`STEPS`, `validate`, `autoAssign`), `buildPlan`, horizontes, status, mutações imutáveis, fila de execução (Scroll Task), timer, import JSON/CSV |
| `export.ts` | view-models dos 4 modelos A4 (Prisma, Semana, Workbook, Status): A4 retrato, margem 10 mm, 3 faces de 92,33 mm |
| `render.ts` | HTML das páginas A4 (string escapada) — o mesmo markup no web, no HTML compartilhado e no `expo-print` |
| `sync.ts` | merge de três vias (base · aparelho · nuvem) com conflitos por tarefa, usado por `POST /api/sync` |

Consumido como código-fonte TypeScript (`exports: ./src/index.ts`) por `apps/executar-web` e `apps/executar-mobile`.

```bash
npm test -w packages/executar-core
```
