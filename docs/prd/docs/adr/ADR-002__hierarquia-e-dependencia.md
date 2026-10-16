# ADR-002 — Separar hierarquia de dependência

Status: Proposta. Data: 2026-10-16.

## Contexto
AlsoAsked descreve perguntas relacionadas; o workflow usa dependsOn executável.

## Decisão proposta
parent-child pertence ao mapa; finish-to-start pertence ao planejamento; conversão pergunta→tarefa é explícita.

## Alternativas
Converter toda árvore em sequência de execução inventa precedência operacional.

## Consequências
Validadores distintos; DAG para dependências, árvore por dataset para pesquisa.

## Validação
Ver FRD e handoff/ACEITE.md. Nenhum ADR foi tratado como decisão aprovada pelo usuário além dos requisitos expressamente pedidos.
