# ADR-003 — Foco com WIP=1 por run

Status: Proposta; escopo a confirmar. Data: 2026-10-16.

## Contexto
Usuário pediu tarefas uma a uma; base já descreve WIP=1.

## Decisão proposta
No máximo uma tarefa em execução por run. Navegação livre não inicia tarefa. Servidor arbitra revisão e chave idempotente quando integrado.

## Alternativas
Lock só visual falha com duas abas; WIP global poderia bloquear campanhas independentes sem necessidade declarada.

## Consequências
Se WIP por pessoa/global for necessário, ampliar contrato e testes de concorrência.

## Validação
Ver FRD e handoff/ACEITE.md. Nenhum ADR foi tratado como decisão aprovada pelo usuário além dos requisitos expressamente pedidos.
