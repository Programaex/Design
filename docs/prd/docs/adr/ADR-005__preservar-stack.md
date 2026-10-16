# ADR-005 — Preservar a base React/Vite/Turbo recebida

Status: Proposta. Data: 2026-10-16.

## Contexto
SRC-001 já contém app, admin, Worker e contratos.

## Decisão proposta
Implementar incrementalmente em apps/workflow; preservar npm e lockfile. Escolher biblioteca de grafo apenas após spike de layout/print/touch.

## Alternativas
Reescrever em Next.js ou migrar runtime sem motivo amplia escopo e invalida contratos.

## Consequências
Deploy Cloudflare permanece etapa própria; nomes/bindings de origem precisam revisão no destino.

## Validação
Ver FRD e handoff/ACEITE.md. Nenhum ADR foi tratado como decisão aprovada pelo usuário além dos requisitos expressamente pedidos.
