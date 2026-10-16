# Plano de aceite das futuras views
Estes testes são especificados, não executados neste pacote. A validação de dados executada está em qa/data-validation.json.

| ID | Cenário | Resultado esperado |
|---|---|---|
| AT-01 | Importar os 3 CSVs; depois repetir o mesmo lote | 37/53/20 nós e 36/52/19 relações; repetição reconhecida sem duplicação |
| AT-01b | CSV com BOM, resposta multiline, aspas; órfão/posição repetida | Válido preservado; inválido explica registro/campo sem commit parcial |
| AT-02 | Campo bloqueado, resposta vazia e pergunta repetida | Estados distintos; nenhuma resposta inventada; nós repetidos mantêm identidade |
| AT-03 | Expandir grupo, adicionar filho, alternar LR/TB, buscar nó | Relações e IDs intactos; seleção restaurada; nenhum nó perdido |
| AT-04 | Criar A depende B, depois B depende A | Segunda relação rejeitada; árvore de pesquisa não vira execução |
| AT-05 | Iniciar tarefa; clicar duas vezes; iniciar outra em segunda aba | Só uma execução ativa no run e um efeito por chave; retry preserva histórico |
| AT-05b | Erro/gate/rejeição e retomada | Evidência e evento corretos; futuro apenas inspecionado, não executado |
| AT-06 | Trocar 5 views de calendário, editar título/data/cor | Mesmo registro; título na célula; janela não vira horário inventado |
| AT-07 | Mover tarefa Gantt e replanejar CSV por ID | Calendário/foco atualizam; histórico mantém original; conflito explícito |
| AT-08 | A4/A3, 6 semanas, títulos longos, 53 nós | PDF legível, sem cortes; se não cabe, preview pede ajuste; nenhuma omissão silenciosa |
| AT-08b | Exportar todo mapa recolhido na tela | Todos os nós do escopo incluídos; contagem coincide; sem páginas extras inesperadas |
| AT-09 | Sem fonte comercial; filtro de período; zero denominador | N/D/estado vazio correto; drill-down concilia agregados e período |
| AT-10 | 390×844, 844×390, 768×1024, 1440×900; teclado | Editar/inspecionar/exportar disponíveis; foco visível e alternativa ao canvas |
| AT-11 | Exportar/reimportar JSON/CSV normalizado | IDs e relações preservados; versões incompatíveis recusadas com explicação |

Registrar screenshots e PDFs de fixtures sem dados de conta, versão do renderer, dimensões e resultado por cenário. Validar aparência do PDF renderizado e texto extraído. Não confundir teste estrutural do fixture com aceite de UI.
