# Handoff para implementação
## Mandato
Implementar as views de EXECUTAR no admin do SMS usando este pacote como requisitos. Primeiro ler README, PRD, FRD, auditoria, specs e ADRs. O índice associa imagens originais aos comportamentos; não usar horários como único identificador. Preservar SRC-001 como baseline e trabalhar numa cópia extraída/branch de destino.

## Sequência de trabalho
1. Ler instruções do repositório de destino; comparar com SRC-001. Rodar baseline de build/tipos/testes sem deploy e registrar falhas preexistentes. Não executar bootstrap para preparar UI.
2. Criar contratos versionados e adapters de Task/ResearchNode/CalendarEvent; importar as fixtures e validar counts/IDs. Implementar preview de importação e diff de reimportação.
3. Integrar mapa/workflow ao FlowChart/NodeCard sem alterar a semântica de dependsOn. Spike de layout deve provar expansão, orientação, touch e SVG/print antes da escolha de biblioteca.
4. Adaptar Execution para foco de um card e arbitragem WIP=1; preservar eventos/gates/tentativas existentes. Demonstrar clique duplicado e duas abas.
5. Calendário + Gantt sobre a mesma fonte; diferenciar janela editorial de compromisso. Usar datas da fixture, sinalizando histórico, sem atualizar prazos automaticamente.
6. Criar render de impressão com prontidão por medição e fonts; não depender do timer de PrintSheet. Validar SPEC-03 antes de integrar exportar.
7. Adaptar dashboard a indicadores operacionais definidos; deixar KPIs comerciais N/D até haver contrato da fonte. Validar mobile, teclado, estados de erro e fontes de dados.
8. Entregar PR/diff, evidências de aceite e limitações; deploy em Cloudflare é operação separada, com configurações do destino.

## Pontos previstos de alteração
`apps/workflow/admin/components/hub/`: navegação, dashboard, calendar/gantt wrappers.
`apps/workflow/src/components/`: grafo, foco, renderer de impressão.
`apps/workflow/shared/`: modelos e validações versionadas/adapters.
`apps/workflow/worker/`: persistência e comandos idempotentes quando integrados.
`apps/workflow/test/`: fixtures de importação, sincronização e concorrência.
Caminhos novos exatos são escolha de implementação; não criar pacotes compartilhados vazios apenas para satisfazer arquitetura.

## Definition of Done
Todos os FR P0 têm teste/evidência; estados de fonte incompleta são visíveis; exportação atende às opções selecionadas; dados mantêm IDs/proveniência; não há endpoints/credenciais presumidos. Relatar build e testes efetivamente executados. Não chamar requisito de implementado só porque o componente existe. Não publicar artefatos de referência com dados de conta como material de marketing.
