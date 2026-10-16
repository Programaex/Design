# ADR-007 — Implementar as views no CMS (apps/site)

Status: Decidida pelo usuário. Data: 2026-10-16. Substitui o destino proposto no ADR-005.

## Contexto
O handoff chama o destino de "admin do SMS" e propõe `apps/workflow`. O CMS já publicado em design.bus-programa.workers.dev (`apps/site`) concentra o login, o KV, o design system e a central de controle.

## Decisão
As áreas Operações e Dados entram no CMS em `apps/site`, com o mesmo design system. A lógica pura fica em `apps/site/lib/ops/` e é testada com `node --test`. A persistência usa o KV (documento `ops` com revisão). WIP=1 é **global** (Q-05 respondida) e arbitrado por um Durable Object.

## Consequências
`apps/workflow` permanece intacto; integrar seus Workflows/Durable Objects é etapa futura. Os contratos de SPEC-01 são seguidos com nomes em camelCase.
