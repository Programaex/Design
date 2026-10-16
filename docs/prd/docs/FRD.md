# FRD — Requisitos funcionais
Prioridade P0 = fundação/essencial; P1 = incremento da mesma entrega. “Deve” descreve comportamento alvo, não recurso já implementado.

| ID | Prioridade | Comportamento verificável | Referência/PRD | Aceite |
|---|---|---|---|---|
| FR-01 | P0 | Importar CSV com BOM, aspas, vírgulas e respostas multilinha; preview antes de confirmar | DATA-001–003 / P-04 | AT-01 |
| FR-02 | P0 | Resolver raiz (0,0), pai (a,0) e filho (a,b); reportar pai ausente/posição duplicada | P-04 | AT-01 |
| FR-03 | P0 | Preservar fonte, registro lógico, campos bloqueados e texto original | P-04 | AT-02 |
| FR-04 | P0 | Renderizar mapa/grafo; expandir/recolher; zoom/pan/fit; abrir detalhes; criar nó/ligação | REF-004–005 / P-05 | AT-03 |
| FR-05 | P0 | Alternar LR/TB e mapa bilateral; lembrar seleção/expansão por view | P-07 | AT-03 |
| FR-06 | P0 | Validar dependência operacional contra ciclos; hierarquia admite um pai por nó | P-05 | AT-04 |
| FR-07 | P0 | Foco exibe uma tarefa com entradas, saída esperada, evidência e ação; shell estável | REF-006–011 / P-06 | AT-05 |
| FR-08 | P0 | Bloquear segundo início no mesmo run; rejeitar ação duplicada com idempotência | P-06 | AT-05 |
| FR-09 | P0 | Calendário alterna agenda/dia/semana útil/semana/mês com mesmos IDs/filtros | P-02 | AT-06 |
| FR-10 | P0 | Célula mostra horário, título e rótulo/cor; abrir/editar compromisso sem perder período | P-02 | AT-06 |
| FR-11 | P0 | Distinguir data exata, janela editorial e compromisso com hora; nunca criar horário fictício | DOC-002 / P-02 | AT-06 |
| FR-12 | P0 | Gantt exibe tarefa, owner, início/fim, marcos e dependências; editar datas sincroniza views | P-03 | AT-07 |
| FR-13 | P1 | Alertar violação de dependência ao mover barra; cascata só mediante confirmação do diff | P-03 | AT-07 |
| FR-14 | P0 | PDF tem preview, seleção, papel/orientação/margens e cores; sem texto cortado | P-08 | AT-08 |
| FR-15 | P0 | Mapa cabe em uma página quando legível; caso contrário solicita papel maior ou escopo menor | P-08 | AT-08 |
| FR-16 | P0 | Dashboard mostra fonte, período, atualização e drill-down; N/D em vez de zero falso | REF-001 / P-01 | AT-09 |
| FR-17 | P0 | Mobile mantém edição e foco; lista acessível como alternativa ao canvas | P-07 | AT-10 |
| FR-18 | P0 | Importação é transacional; erros não publicam subconjunto silenciosamente; undo por lote | P-04 | AT-01 |
| FR-19 | P1 | Exportar JSON/CSV de entidades e relações com schemaVersion e IDs | P-04/P-05 | AT-11 |
| FR-20 | P0 | Replanejamento mantém datas originais, novas datas e histórico de alteração | DOC-002 / P-02/P-03 | AT-07 |

## Estados e permissões propostos
Viewer consulta/exporta; editor altera planejamento e importa; operador executa ações autorizadas. Validar permissões no servidor quando houver backend. Autorização de uma execução não decorre da navegação entre cards. Estados vazios, carregando, erro, offline e conflito devem ter ação de recuperação e preservar os dados não enviados.

## Requisitos não funcionais propostos
Português brasileiro; fuso padrão America/Sao_Paulo configurável. Operações de dia inteiro usam datas locais sem conversão UTC que altere o dia. Tab/Enter/Escape permitem operar cards e diálogos; foco visível; informação por rótulo e cor. Preferência de movimento reduzido desativa transições de card. Limites iniciais propostos: CSV até 5 MB/5.000 registros com erro explícito acima; renderização alvo 500 nós, com teste de responsividade em hardware de referência a definir. Exportar apenas dados acessíveis ao usuário. Strings importadas são texto; não executar HTML/fórmulas presentes no CSV.
