# SPEC-02 — Views e interações
## Estrutura compartilhada
Sidebar do admin → Operações/Dados; cabeçalho com projeto/campanha; seletor Dashboard/Calendário/Gantt/Mapa/Workflow/Foco; filtros compartilhados de campanha, responsável, canal e status conforme entidade. View sem correspondência informa o filtro inaplicável em vez de ocultar dados sem explicação.

## Dashboard
REF-001 fornece hierarquia visual: cabeçalho/filtro, faixa de KPIs, gráfico principal e resumo lateral, tabela inferior. Não copiar faturamento/porcentagens fictícias do mockup. Primeiros indicadores propostos: tarefas concluídas (status completed no período por completedAt), tarefas em atraso (end anterior ao dia corrente e não finalizadas), publicações planejadas (datas exatas; janelas contadas separadamente), bloqueios (dependências abertas/erro). Toda taxa informa numerador/denominador; denominador zero → N/D. Receita/leads/conversão só após contrato da fonte. Clique abre registros que formam o agregado.

## Calendário
REF-002 guia cartões coloridos e grade; REF-014 define menu de views. Mês: 7 colunas e 4–6 linhas conforme mês; semana útil: 5; semana: 7; dia: 1; agenda: lista cronológica. Segunda-feira é início proposto, configurável. Faixa all-day separada de horários. Colisões de hora usam colunas paralelas; eventos multidiários usam segmentos com indicação de continuidade. Janela editorial aparece como janela, com data exata ainda pendente. Não transformar a janela inteira em um compromisso ocupado.

Título dentro do quadradinho e cor por categoria são obrigatórios; legenda explicita categoria/cor. Estado por rótulo/ícone, evitando conflito entre categoria e status. Na tela, excesso pode abrir “+N”; na impressão, não pode ocultar eventos selecionados. Editar via diálogo com título/data/canal/owner/status, validar intervalo e salvar por revisão. Arrastar tem alternativa por formulário.

## Gantt
REF-003: tabela fixa à esquerda (tarefa, owner, status) e escala temporal à direita. Agrupar por fase/campanha/owner; escala dia/semana/mês. Marcos têm data única; tarefas sem data ficam em “Não agendadas”. Barras refletem planejamento; progresso só usa dados reais. FS significa início do sucessor >= término do predecessor conforme granularidade. Não inventar caminho crítico sem durações/dependências completas. Arraste mostra preview/diff; conflito pede correção, sem mover cadeia silenciosamente.

## Mapa e workflow
REF-004/005: canvas com card central, ramos de entrada/saída, cards com cabeçalho expansível e ações Adicionar/Abrir. Nós mantêm títulos e IDs. Clique abre painel lateral; chevron só expande. Adicionar filho, irmão ou dependência são comandos distintos. Recolher mantém badge de contagem e conectores ao grupo, sem apagar registros. Layouts LR (esquerda→direita), TB (cima→baixo) e bilateral de mapa; orientação não altera relações. Auto-layout inicial, persistência opcional de posições manuais, botão reorganizar com confirmação se descartar posições.

Pan no fundo, zoom nos controles/gesto, fit seleção e fit mapa. Busca realça e expande caminho até resultado. Teclado navega pela lista hierárquica sincronizada. Mapas aceitam hierarquia; workflow aceita DAG e nós de gate/entregável existentes. Não prometer import/export nativo .xmind: XMind é referência de comportamento.

## Foco WIP=1
REF-006–011: cabeçalho, stepper e área de ações fixos; apenas o card da tarefa muda. Card: título, owner, insumos, dependências, instrução, evidência requerida e ação principal. Passos futuros podem ser inspecionados em modo leitura, mas só a tarefa elegível inicia. Estado executando mostra progresso real ou indicador indeterminado; erro conserva insumos e oferece retry. Clique duplo não duplica execução. Rejeição de gate volta à etapa indicada pelo contrato, com histórico. Acessibilidade: anunciar troca do card, mover foco ao título, respeitar reduced-motion.

## Responsividade proposta
>=1024 px: sidebar, canvas/tabela e painel lateral; 600–1023: sidebar recolhível e painel sobreposto; <600: navegação compacta e editor em tela cheia. Mobile prioriza agenda/foco e mantém calendário/grafo disponíveis; canvas é superfície própria para pan, sem scroll horizontal da página toda. Gantt usa scroll horizontal explícito com coluna de tarefa fixa e alternativa em lista. Validar 390×844 e 844×390, tablet e desktop. Aplicativo nativo permanece decisão separada.
