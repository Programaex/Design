# Auditoria estática da base recebida
Fonte: SRC-001, extraído apenas para inspeção. Não houve instalação, build, teste do app ou deploy.

| Caminho dentro de workflow-turborepo | Evidência e aproveitamento |
|---|---|
| package.json, turbo.json | Workspace npm, Node >=22 e scripts Turbo. Não é a base Next.js de outras conversas. |
| apps/workflow/package.json | React 19.2.1, Vite, TypeScript, Tailwind e dependências Cloudflare declaradas. Versões observadas no snapshot, sem pesquisa de atualidade. |
| apps/workflow/shared/schema.ts | WorkflowNode/WorkflowDefinition, dependsOn, taxonomia e estados pending/ready/running/waiting/completed/error. |
| apps/workflow/src/components/FlowChart.tsx, NodeCard.tsx | Pontos de integração do grafo; existência não comprova atendimento ao novo visual. |
| apps/workflow/src/components/Execution.tsx | Base a avaliar para foco. O schema já descreve WIP=1 e eventos por tentativa. |
| apps/workflow/src/components/PrintSheet.tsx | Anexo tabular de casas; usa break-before-page e sinal ready após timer. Não comprova PDF de mapa em página única. |
| apps/workflow/scripts/print-pdf.mjs | Pipeline de impressão com Playwright a adaptar e validar; não executado. |
| apps/workflow/admin/components/hub/dashboard.tsx | Dashboard existente a adaptar ao novo módulo e métricas. |
| apps/workflow/admin/lib/hub/types.ts | Modelo genérico HubRecord; precisa adapter para entidades tipadas das novas views. |
| apps/workflow/worker/ | Código de Workflows, Durable Objects, APIs, CMS, artefatos e MCP. |
| apps/workflow/wrangler.jsonc | Bindings de Workflows, Durable Objects, R2 e KV; nomes e IDs são da origem. |

## Diferenças a resolver
Criar importador AlsoAsked e relações de pesquisa sem substituir dependsOn. Adicionar agendamento ao modelo de tarefa por extensão/adapter versionado. Separar exportação de mapa em uma página do anexo tabular existente. Trocar sinalização por timer por prontidão real de fontes/layout no fluxo de exportação novo. O HTML light mode é uma referência SVG fixa com impressão básica, não um calendário com dados integrado.

## Integração segura
Preservar contratos existentes de WorkflowDefinition, executor, gates e evidências. Não substituir npm por bun nem migrar framework por inferência. Ler as instruções do repositório de destino antes de alterar código. O ZIP preserva agentes/plugins originais, mas eles não foram ativados neste trabalho. Antes de qualquer deploy, conferir os recursos e bindings do destino; bootstrap contém ações de criação/deploy conforme README da origem.
