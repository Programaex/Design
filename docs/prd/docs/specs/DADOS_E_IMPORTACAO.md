# SPEC-01 — Modelo e importação
Versão proposta 1.0.0. Artefatos normalizados são fixtures, não migração aplicada ao backend.

## Entidades canônicas
| Entidade | Campos necessários |
|---|---|
| ResearchDataset | id, name, sourceFile, sha256, importedAt, schemaVersion |
| ResearchNode | id, datasetId, parentId nullable, title, answer nullable, answerStatus, sourceRecord, rawFields |
| ResearchEdge | id, source, target, type=parent-child |
| Task | id, projectId, title, ownerId nullable, status, plannedStart/End nullable, dateKind, timezone, sourceNodeId nullable, workflowNodeId nullable, revision |
| TaskDependency | id, predecessorId, successorId, type=finish-to-start |
| CalendarEvent | id, taskId nullable, title, start/end ou dateStart/dateEnd, allDay, categoryId, channel, revision |
| ViewState | id, userId, viewType, selectedId, filters, orientation, expandedIds, viewport |
| Run | id, workflowDefinitionId, activeTaskId nullable, status, revision |
| Evidence | id, taskId, runId, uri, label, createdAt, createdBy |

Task planejada e CalendarEvent são vinculados, não duplicações soltas; projeções de tarefa usam ID derivado estável e alterações passam pelo mesmo serviço. Evento independente não vira dependência operacional. Datas de janela são intervalos de disponibilidade, não atividade contínua obrigatória.

## CSV AlsoAsked observado
Headers: question, answer, url, page title, tier 1 position, tier 2 position, region, language, is AI overview?, AI overview URLs, AI overview page titles. A linha raiz tem só seis valores: completar campos opcionais com vazio. Ler registros CSV lógicos, pois respostas contêm quebras de linha.

Mapeamento observado: (0,0) é raiz; (a>0,0) liga à raiz; (a>0,b>0) liga a (a,0). Ordem numérica mantém a apresentação. Repetição de pergunta em posições distintas é preservada, sem deduplicação textual. ID desta fixture = datasetId + ordinal do registro. Em reimportação idêntica, hash igual impede lote duplicado; arquivo alterado cria nova versão com diff e não sobrescreve pelo ordinal. Editores preservam IDs após a criação.

“Upgrade to Lite/Pro to unlock” gera campo normalizado vazio e marca em locked_fields. Não preencher com IA nem usar o marcador como resposta. answerStatus distingue available/missing/locked. Todos os conteúdos mantêm editorial_review=pending. Esta conversão não valida alegações médicas.

## Pipeline de produto
Upload → detectar encoding/delimitador → parse → validar headers/posições → construir árvore → mostrar preview/erros → confirmar lote → salvar transacionalmente → abrir mapa. Aceitar UTF-8/BOM; demais encodings exigem seleção explícita. Campo desconhecido é preservado em rawFields. Rejeitar órfãos, múltiplas raízes inesperadas, posições inválidas e tamanho excessivo, mostrando registro/campo. Rascunho recuperável; falha não salva lote parcial.

## Dados entregues
DATA-001: 37 nós/36 relações; DATA-002: 53/52; DATA-003: 20/19. Total 110/107, três raízes. Há 104 registros com ao menos um campo bloqueado.

editorial_workflow.csv deriva de DOC-002 e contém 45 linhas. source_cells_json guarda as oito células originais; planned_date_raw conserva a expressão de data. proposed dates ficam em new_planned_start/new_planned_end. Status unconfirmed não significa tarefa ainda não concluída: a fonte não permite determinar execução atual. W2-003 teve realocação de título com flag; 4 títulos truncados não foram completados. Campos de owner/dependência não têm valores inferidos.

## Atualização
Editar uma cópia de trabalho do editorial_workflow.csv. Validar novos intervalos; exibir diff de datas por ID; aplicar só os valores informados, guardar revisão anterior e autor. Não regenerar sobre alterações manuais. Pergunta → tarefa é conversão explícita, sem converter arestas de hierarquia em precedência. Download CSV para uso em planilhas deve neutralizar fórmulas em células que iniciem =,+,-,@; manter export JSON e raw intactos para round-trip fiel.
