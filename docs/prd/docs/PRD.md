# PRD — EXECUTAR Views
Status: requisitos consolidados para implementação; escolhas técnicas propostas precisam ser avaliadas no repositório de destino.

## Problema e resultado esperado
Referências e dados estão dispersos entre imagens, HTMLs, CSVs e uma aplicação de workflow. O operador precisa planejar conteúdo, organizar lançamentos, compreender dependências e executar a próxima entrega sem reconstruir dados em cada view. O admin do SMS será o ponto de acesso às áreas Operações e Dados.

## Usuários e jornadas
- Operador: importa CSV → revisa hierarquia → abre mapa → cria tarefa vinculada a uma pergunta → agenda entrega → acompanha Gantt → executa em foco → registra evidência.
- Editor: seleciona campanha/período/canal → organiza calendário → edita compromisso → imprime a seleção com títulos nas células.
- Gestor: filtra período/campanha → lê indicadores e fonte/atualização → abre a lista que compõe o indicador.

## Escopo solicitado
| ID | Capacidade | Referências |
|---|---|---|
| P-01 | Dashboard integrado no admin: KPIs, gráficos, tabela e filtros | REF-001 |
| P-02 | Calendário de conteúdo: agenda, dia, semana útil, semana e mês | REF-002, REF-013–017, REF-019, DOC-003 |
| P-03 | Gantt de operações de produto/lançamento/GTM | REF-003 |
| P-04 | Mapa mental a partir dos três CSVs AlsoAsked | DATA-001–003 |
| P-05 | Grafo expansível de workflow, abrir/adicionar nós e relações | REF-004–005 |
| P-06 | Foco sequencial: um card ativo, shell e progresso persistentes | REF-006–012 |
| P-07 | Web/mobile responsivo, orientação horizontal/vertical do grafo | Todas conforme contexto |
| P-08 | PDF com cores, textos e cálculo @page para calendário e mapa | REF-002, REF-019, DOC-003 |

## Regras de produto
A mudança de view não duplica entidades. Perguntas importadas não se tornam tarefas executáveis automaticamente. Converter em tarefa é ação explícita, mantendo sourceNodeId. Hierarquia de mapa e dependência operacional são relações diferentes. A orientação do grafo é independente da orientação física do dispositivo e do papel. WIP=1 limita execução no escopo proposto de uma execução/run; visualizar outra tarefa não a inicia.

## Entrega por fases proposta
F0: contratos de dados, importação e validação com fixtures reais. F1: grafo/mapa e foco sobre a base atual. F2: calendário e Gantt usando o mesmo modelo operacional. F3: renderização de impressão, responsividade e dashboard integrado. Integração a serviços externos e empacotamento mobile nativo são fases posteriores condicionadas a necessidades confirmadas; a fase inicial cobre web responsiva.

## Critério de sucesso
Todos os 110 registros de pesquisa aparecem em três árvores com 107 relações sem perda de proveniência. Os 45 registros editoriais são rastreáveis ao HTML. A mesma tarefa tem status/data consistentes entre calendário, Gantt, grafo e foco. Exportações não omitem conteúdo selecionado silenciosamente. Os testes em handoff/ACEITE.md devem passar antes de considerar as novas views entregues.

## Fora deste handoff
Não há deploy, criação de recursos Cloudflare, autenticação nova, implementação nativa, integração real com Outlook, reprodução de marcas, atualização factual das respostas AlsoAsked ou definição final de KPIs comerciais. Outlook e Cloudflare são referências de interação, não requisitos de integração com esses produtos.
