# ADR-001 — Modelo compartilhado com projeções

Status: Proposta. Data: 2026-10-16.

## Contexto
Calendário, Gantt, foco e grafo precisam refletir a mesma operação.

## Decisão proposta
Manter Task/Event e ResearchNode separados, IDs estáveis e relações explícitas. Views são projeções. Adapter estende contratos atuais sem quebrar WorkflowDefinition.

## Alternativas
Copiar registros por view cria divergência; usar um único tipo para pergunta e tarefa mistura planejamento e pesquisa.

## Consequências
Exige migração versionada e regras de sincronização, mas mantém status/datas consistentes.

## Validação
Ver FRD e handoff/ACEITE.md. Nenhum ADR foi tratado como decisão aprovada pelo usuário além dos requisitos expressamente pedidos.
