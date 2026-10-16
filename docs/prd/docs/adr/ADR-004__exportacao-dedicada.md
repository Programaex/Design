# ADR-004 — Render de impressão independente do viewport

Status: Proposta. Data: 2026-10-16.

## Contexto
Mapa e calendário devem caber em página sem cortar texto.

## Decisão proposta
Gerar snapshot, medir conteúdo e aplicar política de legibilidade de SPEC-03; saída vetorial e opções explícitas de overflow.

## Alternativas
Captura de tela perde texto e corta conteúdo; scale arbitrário não garante legibilidade.

## Consequências
Exige render e teste do PDF; não é resolvido apenas por CSS @page.

## Validação
Ver FRD e handoff/ACEITE.md. Nenhum ADR foi tratado como decisão aprovada pelo usuário além dos requisitos expressamente pedidos.
