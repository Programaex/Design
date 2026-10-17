# Plano Operacional Rastreável — Programa EXECUTAR — EPIC 01 riscocognitivo.org, Campanha 02 e EPIC Emprego — 17/10/2026 a 30/04/2027

```
Titular: titular do Programa EXECUTAR (nome completo não informado nas fontes — GAP-01)
Período coberto: 17/10/2026 a 30/04/2027 (detalhamento diário até 05/01/2027; semanal até 30/04/2027)
Data de emissão: 17/10/2026
Fuso horário: America/Sao_Paulo (BRT/GMT-3) — suposição ASM-07
Versão: 1.0 — emissão inicial
Metodologia de produção: motor de evidência com hierarquia de fontes e classificação rastreável
Natureza deste documento: planejamento operacional executável. Não é auditoria, certificação,
opinião legal, aprovação regulatória, nem declaração formal de conformidade normativa.
```

## 1. Resumo Executivo

| Item | Conteúdo |
|---|---|
| Objetivo operacional central | Lançar o riscocognitivo.org em 05/11/2026 com o pacote do EPIC 01, sustentar um ciclo de 30 dias de publicações multiplataforma até 05/12/2026, produzir a Campanha 02 (15/11–30/11) a partir dos dados da Campanha 01 e lançar o Executar App e o ecossistema em 05/01/2027; em paralelo, executar o EPIC Emprego e realocação (19/11/2026–30/03/2027) até a viagem de 30/04/2027 (DEC-03). |
| Resultado mais importante | KR-01: riscocognitivo.org público em 05/11/2026 com as rotas do lançamento respondendo (fonte: DEC-03, FACT-01). |
| Capacidade realista total | 926,6h de execução planejada + 139,0h de reserva, sobre 1232,0h nominais no período (ver §7; base em suposições ASM-01 a ASM-03 até confirmação no GATE-00). |
| Frentes ativas e WIP | 10 frentes de trabalho no período; no máximo 4 frentes simultâneas por semana e 1 tarefa em execução por vez (WIP = 1, FACT-06 — decisão de desenho operacional própria, não requisito ISO). |
| Restrição principal | Capacidade da janela 17/10–04/11: 84,5h de execução para um pacote cuja produção integral foi estimada em 146,0h (RSK-01). |
| Risco principal | RSK-01 — sobrecarga da janela de lançamento; sem a decisão do GATE-00 o lançamento de 05/11 fica comprometido. |
| Próxima ação imediata | TSK-0001 — confirmar capacidade real e escopo de 05/11 (§17). |

## 2. Inventário de Fontes e Evidências

| ID | Fonte | Tipo | Data/versão | Papel na análise | Confiabilidade/limitação |
|---|---|---|---|---|---|
| SRC-01 | Mensagem do titular nesta conversa (datas, escopo do EPIC 01, Campanha 02, EPIC Emprego, ordem de lançamento) | Instrução explícita (nível 1) | 17/10/2026 | Fonte primária de escopo, datas e decisões | Alta autoridade; texto digitado rapidamente, com ambiguidades registradas como CONF/GAP |
| SRC-02 | EXECUTAR_rotas.csv (78 rotas, 14 colunas) | Registro operacional do projeto (nível 3) | Anexo de 17/10/2026 | Arquitetura de rotas, filtros e instruções de agente do site | Alta; descreve o site-alvo, não prova implementação |
| SRC-03 | AIKB-0001 — Process Doc Creator-Led Growth multiplataforma (PD-CLB-20260906-F01-DOC-V01) | Documento de processo do projeto (nível 3/5) | 06/09/2026, rascunho de pré-produção V01 | Padrão de ciclo (15 dias), peça-mãe → derivados, matriz de canais, tarefas 01–22, nomenclatura | Média; o próprio documento se declara rascunho sujeito a revisão |
| SRC-04 | Pacote da skill plano-operacional-rastreavel (zip anexado) | Metodologia da empresa | Conferido em 17/10/2026 | Método deste documento | Idêntico, arquivo a arquivo, à cópia em Design/.claude/skills/ (verificado por diff) |
| SRC-05 | Repositório Design (apps/site, apps/workflow, apps/scroll-task, content/articles, agentes e skills) | Registro operacional (nível 5) | Branch de trabalho em 17/10/2026 | Ativos já existentes (CMS, Manifesto, 3 artigos, protótipo Scroll Task, workflow) | Existência observada; não prova prontidão para uso público (GAP-17) |
| SRC-06 | Repositório workbook — CLAUDE.md, OWNERS.csv, MACROAREAS.csv | Regras do projeto (nível 3) | Branch de trabalho em 17/10/2026 | Regra de tripla clonagem de épicos e owners | Alta |
| SRC-07 | Conjunto normativo fixo da metodologia (ISO 9001:2015/Amd 1:2024, ISO 10005, ISO 10006, ISO 21502, ISO 31000, ISO 10075-2) | Normativo (nível 4) | Texto fixo da skill | Limite normativo (§4–§5) | Metadados não confirmados em iso.org nesta sessão (CONF-08) |
| SRC-08 | LRQA — "ISO 9001 revision update: publication date confirmed" (lrqa.com/en-us/latest-news/iso-9001-revision-update-publication-date-confirmed/) | EXTERNAL CURRENT SOURCE, secundária | Acesso em 17/10/2026 | Indica publicação prevista da nova ISO 9001 em 16/09/2026 | Secundária; iso.org não foi acessado; não confirma publicação efetiva |

**Fontes NÃO consultadas (por escolha justificada):** pesquisa de mercado nova sobre canais e tendências (o SRC-03 já traz o Anexo A de 06/09/2026; nova pesquisa é a TSK-0006, executada pelo agente de pesquisa — DEC-12); páginas oficiais de preço e calendário das certificações (dependem da escolha do titular — TSK-0051, GAP-10); conectores de calendário, Linear e ferramentas de agendamento (não autenticados nesta sessão).

## 3. Fatos, Decisões, Suposições, Lacunas e Conflitos

### 3.1 Fatos observáveis (FACT)

| ID | Fato | Fonte | Citação literal/localização |
|---|---|---|---|
| FACT-01 | O pacote do EPIC 01 inclui: home premium com Manifesto; blog com Peça 01 (artigo fundador) e pilares; mapa simplificado; apps (Prisma standalone, Meu processo de trabalho, Plano Operacional Rastreável, workflow visual/mapa builder/task operator); família de templates por déficit executivo + ferramenta de metacognição; plugins e agentes; photo prompt de rotina, Obsidian dislexia e infográficos de IDs; 4 e-books; 3 vídeos de 5 min; produtos e afiliados na loja; CMS para desmembrar o pacote. | SRC-01 | "Ordem de lançamento : EPIC 01 — 1. Risco cogntivo.org | Landign page | Blog | Mapa | Apps | Ferramentas | Cms" |
| FACT-02 | O arquivo de rotas define 78 rotas; /apps/executar exige "configurar URL real do aplicativo antes de ativar acesso"; /loja/[slug] exige "não inventar integração de pagamento"; /riscos-cognitivos: "Não apresentar classificação como diagnóstico"; comentários exigem conta e moderação. | SRC-02 | Linhas inicio…admin_parceiros; colunas instrucao_agente |
| FACT-03 | O padrão editorial usa ciclo de 15 dias ancorado em uma peça-mãe, com derivados por plataforma (carrosséis, imagens, verticais, stories, newsletters, e-books) e as Fases 1–5 (produção → imagens/vídeos → revisão → agendamento → análise). | SRC-03 | Tópico 5, Tabela 5.1; Tópico 8, Tabela 8.1 |
| FACT-04 | De 17/10/2026 a 05/01/2027 há 80 dias (11 semanas e 3 dias); o titular declarou "11 semanas até 05/01". | SRC-01 + calendário | "Temos 11 semas ate 05/01" |
| FACT-05 | Já existem no repositório Design: CMS em Worker Cloudflare (apps/site), rascunho do Manifesto e 3 artigos (content/articles), protótipo Scroll Task do Executar App, app de workflow e analytics da Cloudflare no CMS. | SRC-05 | apps/site/README.md; apps/site/content/articles/; apps/scroll-task/README.md |
| FACT-06 | O CMS aplica WIP = 1 global (uma tarefa por vez) e os agentes do fluxo trabalham com WIP = 1. | SRC-05 | apps/site/README.md — view Foco; .claude/agents/plano-ops-agent.md |
| FACT-07 | Épico, projeto ou issue citado exige tripla clonagem: GitHub, pasta de tarefas do owner, registro de tarefas do workbook. | SRC-06 | CLAUDE.md — "Regra de operações (tarefas)" |
| FACT-08 | O EPIC Emprego vai de 19/11/2026 a 30/03/2027; candidaturas de 01/02/2027 a 30/03/2027; viagem em 30/04/2027. | SRC-01 | "esse epic incia em 19/11 e encerra em 30/03"; "as apliccoes … iniciam se em 01/02 e vao ate 30/03"; "a vigem sera em 30/04" |

### 3.2 Decisões aprovadas (DECISION)

| ID | Decisão | Fonte | Nota |
|---|---|---|---|
| DEC-01 | Reserva de contingência em 15% da capacidade de execução planejada. | SRC-04 (padrão fixo da metodologia) | Nenhum pedido de outro percentual. |
| DEC-02 | Ordem e conteúdo do EPIC 01 conforme a lista do titular; épicos posteriores: CMS e automação, completude de rotas/news, Executar App e Expo, consultoria/studio/portfólio, cursos, loja e marketplace, comunidade/ONG. | SRC-01 | A lista termina com "......" — itens adicionais são GAP-19. |
| DEC-03 | Datas-marco: produção do EPIC 01 17/10–01/11; lançamento 05/11; ciclo de 30 dias até 05/12; produção da Campanha 02 15/11–30/11; lançamento do app, épicos posteriores e Campanha 02 em 05/01; EPIC Emprego 19/11–30/03; candidaturas 01/02–30/03; viagem 30/04. | SRC-01 | Interpretação de 01/11 × 05/11 em CONF-01. |
| DEC-04 | Campanha 02: objetivo estratégico de lançar todo o ecossistema com foco no app e nos produtos à venda, aproveitando a demanda de início de ano (janeiro). | SRC-01 |  |
| DEC-05 | A Campanha 02 é planejada a partir da coleta de dados da Campanha 01. | SRC-01 | Relatório parcial em 14/11 (TSK-0039) e final em 05/12 (TSK-0053). |
| DEC-06 | Acompanhamento da produção por objetivos macro semanais divididos por dias. | SRC-01 | Implementado em §9 e §11. |
| DEC-07 | EPIC Emprego inclui: 0) planejamento estratégico; 1) capacitação em gestão de projetos, processos e governança de IA; 2) provas e certificados pagos de referência (padrão-ouro) para o mercado europeu; 3) portfólio; 3) redes sociais e landing page; 4) currículo e candidaturas; 5) LinkedIn e linha editorial. Plano de estudos com autoestudo, cursos, simulados e provas. | SRC-01 | Numeração "3" repetida na fonte, preservada. |
| DEC-08 | Portfólio com as soluções e produtos do titular + apps para a empresa real Clean Sea e outra a definir. | SRC-01 | Segunda empresa = "tbd" na fonte (GAP-11). |
| DEC-09 | Toda tarefa carrega prompt self-contained completo, no registro interno e no entregável de importação. | SRC-04 | Decisão fixa da metodologia. |
| DEC-10 | Linha editorial estratégica para a Frankwatching sobre riscos cognitivos, LinkedIn editorial e contato estratégico com profissional na Holanda para soluções personalizadas. | SRC-01 | "frankswaching" interpretado como Frankwatching (ASM-08). |
| DEC-11 | O arquivo de rotas é a fonte da arquitetura do site. | SRC-02 |  |
| DEC-12 | Pesquisa, distribuição, agendamento e analytics podem ser executados pelos agentes do fluxo EXECUTAR (research, clp, analytics), com revisão do titular; marcação por tags no-<nó>. | SRC-05 | Agentes existentes; execução depende de token do fluxo (DEP-04). |

### 3.3 Suposições (ASSUMPTION)

| ID | Suposição | Por que foi necessária | Risco se errada |
|---|---|---|---|
| ASM-01 | Jornada nominal de 8h por dia útil (segunda a sexta) e 4h aos sábados; domingo sem trabalho. | Nenhuma fonte informa horas (GAP-02); a metodologia exige modelo de capacidade. | Todas as janelas e a viabilidade do lançamento mudam. |
| ASM-02 | Feriados nacionais (02/11, 20/11, 25/12, 01/01, 26/03, 21/04) indisponíveis. | Titular aparenta estar no Brasil (fuso BRT). | Pequena variação de capacidade. |
| ASM-03 | Overhead operacional (mensagens, administração, contas) de 10% das horas disponíveis. | Sem dado de agenda fixa. | Capacidade de execução superestimada se o overhead for maior. |
| ASM-04 | As horas estimadas das tarefas consideram rascunho assistido por agentes de IA e revisão humana do titular. | Sem histórico de produtividade. | Carga real maior; acionar RSK-01. |
| ASM-05 | De 19/11 a 05/01 o EPIC Emprego usa até 30% da execução; de 06/01 a 30/03, até 50%. | Distribuição entre frentes não informada. | Atraso de estudos ou do ecossistema. |
| ASM-06 | Os pilares do blog são 4 artigos (gestão de riscos/projetos/processos; funções executivas; dark partners; riscos no estudo, trabalho, rotina e ambientes), além do artigo fundador. | A lista da fonte mistura tema do fundador e pilares. | Número de artigos diferente. |
| ASM-07 | Fuso America/Sao_Paulo. | Fuso não informado. | Horários de agendamento deslocados. |
| ASM-08 | "frankswaching" = Frankwatching (portal holandês de marketing digital); "CSM" nos épicos posteriores = CMS. | Grafia da fonte. | Pauta enviada ao veículo errado. |
| ASM-09 | As "3 principais neurodivergências" dos templates são TDAH, dislexia e autismo (filtros de perfil do SRC-02). | Fonte não nomeia as três. | Templates para perfis errados. |
| ASM-10 | As 4 janelas de lançamento do EPIC 01 (onda 1 até 04/11, onda 2 até 05/12) são a opção B recomendada, sujeita ao GATE-00. | Carga da opção A excede a capacidade (RSK-01). | Se o titular escolher a opção A, o plano semanal precisa ser refeito. |

### 3.4 Lacunas (GAP)

| ID | Lacuna | Fonte que deveria cobrir | Impacto | Ação recomendada |
|---|---|---|---|---|
| GAP-01 | Nome completo do titular. | Intake | Baixo | Informar no próximo intake. |
| GAP-02 | Capacidade semanal real, melhor janela de energia, dias de descanso. | Intake | Alto | TSK-0001 / GATE-00. |
| GAP-03 | Situação do domínio riscocognitivo.org (registro, DNS). | Titular / Cloudflare | Alto | TSK-0004. |
| GAP-04 | Checkout, preços e links de afiliado dos 6 produtos. | Titular | Alto para receita | TSK-0017. |
| GAP-05 | Linha de base das métricas (tráfego, seguidores, lista de e-mail). | Analytics / plataformas | Médio | Medir antes de fixar metas (TSK-0025). |
| GAP-06 | Metas numéricas da Campanha 01 (inscritos, cliques, vendas). | Titular | Médio | Definir após a linha de base, até GATE-04. |
| GAP-07 | Lista final de plataformas, contas ativas e ferramenta de agendamento. | Titular | Alto | TSK-0022/0023. |
| GAP-08 | Definição de "dark partners" adotada pelo EXECUTAR. | Titular | Médio | TSK-0043. |
| GAP-09 | Escopo funcional do Executar App e do Expo para 05/01 e canal de publicação (lojas/Expo). | Titular | Alto | TSK-0054 / GATE-08. |
| GAP-10 | Certificações escolhidas, preços, datas de prova e orçamento. | Sites oficiais dos certificadores | Alto | TSK-0051 / GATE-05. |
| GAP-11 | Autorização da Clean Sea para uso no portfólio e identidade da segunda empresa. | Titular / Clean Sea | Médio | TSK-0067. |
| GAP-12 | Identidade e contato do profissional estratégico na Holanda. | Titular | Médio | TSK-0063. |
| GAP-13 | Requisitos editoriais e idioma aceito pela Frankwatching. | Diretrizes do veículo | Médio | TSK-0070. |
| GAP-14 | Destino, visto e documentação da viagem de 30/04. | Titular / órgãos oficiais | Alto | TSK-0050 e TSK-0078. |
| GAP-15 | Meta de candidaturas por semana. | Titular | Médio | Definir no GATE-10. |
| GAP-16 | Responsáveis além do titular (revisores, equipe) e owner de cada épico no workbook. | Titular / OWNERS.csv | Médio | TSK-0002. |
| GAP-17 | Status real dos apps (Prisma standalone, Meu processo de trabalho, Plano Operacional Rastreável, workflow). | Repositórios / titular | Alto | TSK-0003. |
| GAP-18 | Uso do nome Barkley no título do e-book e nos produtos de afiliado. | Titular / editoras | Médio | TSK-0046. |
| GAP-19 | Itens adicionais dos épicos posteriores (lista termina com "......"). | Titular | Baixo | Registrar no GATE-08. |
| GAP-6.2-01 | Objetivos com medição definida (ver §5). | Intake | Médio | Ver §5. |
| GAP-9.1-01 | Método de monitoramento e frequência formalizados (ver §5). | Intake | Médio | Ver §5 e §13. |

### 3.5 Conflitos (CONFLICT)

| ID | Fonte A | Fonte B | Fonte priorizada | Regra de precedência usada |
|---|---|---|---|---|
| CONF-01 | SRC-01: "Entre 17/10 e 01/11 é necessário … lançar riscocognitivo.org" | SRC-01: "no dia 05/11 o lançamento inclui todo conteúdo listado" | Ambas preservadas: 01/11 = fim da produção e dos agendamentos; 05/11 = lançamento público | Mesmo nível; leitura que preserva as duas instruções; a mais específica (05/11) define a data pública. Confirmar no GATE-02. |
| CONF-02 | SRC-03: 3 e-books por ciclo | SRC-01: 4 e-books | SRC-01 (4 e-books) | Instrução explícita do titular (nível 1) prevalece sobre documento de processo. |
| CONF-03 | SRC-03: vídeo-mãe de 8–12 min | SRC-01: 3 vídeos de 5 min | SRC-01 | Nível 1 prevalece. |
| CONF-04 | SRC-03: ciclo de 15 dias | SRC-01: ciclo de 30 dias até 05/12 | SRC-01, conciliado como 2 subciclos de 15 dias | Nível 1 define o horizonte; o padrão de 15 dias organiza os subciclos. |
| CONF-05 | SRC-01: "Produtos a venda e afiliados na loja" no EPIC 01 | SRC-01: "Loja e mkt place" nos épicos posteriores | Ambas: vitrine mínima no EPIC 01; marketplace completo depois | Mesmo nível; separação por escopo. Confirmar no GATE-00. |
| CONF-06 | SRC-01: "Cms: desmembrar esse pack" no EPIC 01 | SRC-01: "CSM e automação" nos posteriores | Ambas: desmembramento e agendamento com o CMS atual; automação depois | Mesmo nível; separação por escopo. |
| CONF-07 | SRC-02: rota /apps/executar com CTA de acesso | SRC-01: "Executar app e expo" posterior (05/01) | SRC-01 quanto à data; SRC-02 quanto à regra de não inventar destino | Página publicada como 'em breve' até 05/01. |
| CONF-08 | SRC-07: ISO 9001:2015/Amd 1:2024 | SRC-08: nova edição da ISO 9001 com publicação prevista para 16/09/2026 | SRC-07 (mantido) | SRC-08 é secundária e não confirma publicação; atualizar a skill se iso.org confirmar. |
| CONF-09 | SRC-02: comentários com conta e moderação | SRC-01: comunidade/ONG é posterior | SRC-01 | Comentários desativados no EPIC 01. |
| CONF-10 | SRC-03: "nenhum ativo pago deve ser lançado sem que o problema … tenha sido validado … em pelo menos um ciclo de conteúdo gratuito" | SRC-01: produtos à venda no lançamento de 05/11 | SRC-01 | Nível 1 prevalece; risco registrado (RSK-03) e recomendação de priorizar afiliados e ferramentas gratuitas. |

## 4. Limite Normativo e Disclaimer

- Frameworks operacionais próprios (WIP = 1, ondas de lançamento, distribuição percentual de capacidade, uma entrega dominante por dia, ciclo de 15/30 dias) foram excluídos da seção normativa: são decisões de desenho operacional próprio.
- Afirmações normativas são rastreáveis às normas do conjunto fixo (SRC-07). Apenas a ISO 9001 contém requisitos; ISO 10005, 10006, 21502, 31000 e 10075-2 orientam.
- Evidência observável é exigida; ausência de cláusula ou de registro impede conclusão.
- A Estrutura Harmonizada é usada apenas para organizar evidência.
- O status de edição da ISO 9001 está em CONF-08; o texto das normas não foi reproduzido.
- Este documento não é auditoria, certificação, opinião legal, aprovação regulatória nem declaração formal de conformidade.

## 5. Evidência Organizada pela Estrutura Harmonizada

| Cabeçalho | Norma aplicável | Cláusula | Requisito | Evidência observável | Status | Lacuna/ação |
|---|---|---|---|---|---|---|
| Contexto | ISO 9001:2015/Amd 1:2024 | 4.1 / 4.2 | Determinar questões internas/externas e partes interessadas | SRC-01 (nicho, demanda de janeiro, mercado europeu); §12 | PARCIALMENTE EVIDENCIADO | Partes interessadas externas sem identificação (GAP-12, GAP-13). |
| Liderança | ISO 9001:2015/Amd 1:2024 | 5.3 | Atribuir papéis, responsabilidades e autoridades | Titular como responsável único; owners do workbook reservados | PARCIALMENTE EVIDENCIADO | GAP-16. |
| Planejamento | ISO 9001:2015/Amd 1:2024 | 6.1 | Ações para abordar riscos e oportunidades | §14 (orientado por ISO 31000) | PARCIALMENTE EVIDENCIADO | Riscos com probabilidade qualitativa; revisar no GATE-04. |
| Planejamento | ISO 9001:2015/Amd 1:2024 | 6.2 | Objetivos mensuráveis e planejamento para alcançá-los | §6 com KR; metas numéricas ausentes | PARCIALMENTE EVIDENCIADO | GAP-6.2-01: objetivos sem meta numérica e linha de base (GAP-05, GAP-06); definir até GATE-04. |
| Suporte | ISO 9001:2015/Amd 1:2024 | 7.1.6 / 7.5 | Conhecimento organizacional e informação documentada | SRC-03 (process doc), SRC-05 (repositórios), registro de tarefas §10 | EVIDENCIADO | Manter versão e nomenclatura (SRC-03 Tópico 9). |
| Operação | ISO 9001:2015/Amd 1:2024 | 8.1 | Planejar e controlar a operação | §9, §10, §11; gates §16 (orientação ISO 10005/10006/21502) | PARCIALMENTE EVIDENCIADO | Capacidade sustentada por suposições (ASM-01); confirmar no GATE-00. |
| Operação | ISO 9001:2015/Amd 1:2024 | 8.3 | Projeto e desenvolvimento de produtos (apps, site) | SRC-05 (código existente); TSK-0054/0055/0056 | NÃO EVIDENCIADO | Escopo e critérios de validação do app ausentes (GAP-09). |
| Operação | ISO 9001:2015/Amd 1:2024 | 8.6 | Liberação de produtos e serviços | GATE-03 e GATE-09 com critérios | PARCIALMENTE EVIDENCIADO | Executar os gates com registro. |
| Avaliação de Desempenho | ISO 9001:2015/Amd 1:2024 | 9.1 | Monitoramento, medição, análise e avaliação | §13; TSK-0025, TSK-0039, TSK-0053 | PARCIALMENTE EVIDENCIADO | GAP-9.1-01: frequência e método definidos neste plano, ainda não em uso. |
| Melhoria | ISO 9001:2015/Amd 1:2024 | 10.3 | Melhoria contínua | Campanha 02 planejada com dados da Campanha 01 (DEC-05) | NÃO AVALIADO | Avaliar em 05/12 (GATE-07). |

> **ID:** GAP-6.2-01 · **Estrutura transversal:** Planejamento · **Subcláusula primária:** ISO 9001:2015/Amd 1:2024 — 6.2 · **Subcláusula complementar:** ISO 9001:2015/Amd 1:2024 — 9.1 · **Lacuna:** objetivos do período têm resultado verificável, mas não meta numérica nem linha de base. · **Evidência localizada:** datas e entregas declaradas em SRC-01. · **Status:** PARCIALMENTE EVIDENCIADO. · **Ação:** medir a linha de base (TSK-0025) e fixar metas numéricas no GATE-04.

> **ID:** GAP-9.1-01 · **Estrutura transversal:** Avaliação de Desempenho · **Subcláusula primária:** ISO 9001:2015/Amd 1:2024 — 9.1 · **Subcláusula complementar:** ISO 9001:2015/Amd 1:2024 — 6.2 · **Lacuna:** não havia método nem frequência de monitoramento antes deste plano. · **Evidência localizada:** §13 propõe métricas e cadência. · **Status:** NÃO EVIDENCIADO até o primeiro registro semanal (TSK-0040). · **Ação:** executar o primeiro registro em 13/11/2026.

A carga de trabalho mental (ISO 10075-2, orientação) foi considerada no desenho da visão diária (§11): no máximo 3 passos por dia, uma frente dominante e WIP = 1 — decisão de desenho operacional próprio, informada pela orientação, não requisito.

## 6. Objetivos do Mês e Resultados Mensuráveis

Período de vários meses; os objetivos abaixo cobrem 17/10/2026 a 30/04/2027.

| ID Objetivo | Objetivo do período | Fonte | Resultado mensurável | Baseline | Meta do período | Método de validação |
|---|---|---|---|---|---|---|
| OBJ-01 | Lançar o riscocognitivo.org com o pacote do EPIC 01 | DEC-02, DEC-03 | KR-01: site público em 05/11 com as rotas do lançamento respondendo; KR-02: 100% dos itens listados do EPIC 01 publicados até 05/12 | Baseline não evidenciado — medir antes de confirmar meta. | KR-01 em 05/11/2026; KR-02 em 05/12/2026 | Lista de testes (TSK-0026) e checklist de itens publicados |
| OBJ-02 | Sustentar o ciclo de 30 dias de publicações multiplataforma | DEC-03 | KR-03: 100% dos derivados dos ciclos 1 e 2 agendados (ciclo 1 até 01/11; ciclo 2 até 14/11) | Baseline não evidenciado — medir antes de confirmar meta. | 100% | Export da ferramenta de agendamento |
| OBJ-03 | Planejar e produzir a Campanha 02 a partir dos dados da Campanha 01 | DEC-04, DEC-05 | KR-04: relatório de aprendizado em 14/11 e 05/12; KR-05: pacote da Campanha 02 aprovado em 30/11 | Baseline não evidenciado — medir antes de confirmar meta. | Binário (entregue/não entregue) | Relatórios e aprovação no GATE-06 |
| OBJ-04 | Lançar o Executar App e o ecossistema em 05/01 | DEC-03, DEC-04 | KR-06: versão do app publicada e link real ativo em 05/01/2027 no escopo do GATE-08 | Baseline não evidenciado — medir antes de confirmar meta. | Binário | GATE-09 |
| OBJ-05 | Preparar a realocação profissional na Europa | DEC-07, DEC-08, DEC-10 | KR-07: 3 provas de certificação realizadas até 30/03/2027; KR-08: portfólio, currículo e landing publicados até 31/01/2027; KR-09: candidaturas semanais de 01/02 a 30/03 (meta numérica GAP-15) | Baseline não evidenciado — medir antes de confirmar meta. | KR-07: 3; KR-08: binário; KR-09: a definir | Comprovantes de prova, links, planilha de candidaturas |

## 7. Capacidade e Alocação do Mês

Tabela principal — período inteiro (17/10/2026 a 30/04/2027):

| Categoria de capacidade | Horas | Evidência ou suposição | Notas |
|---|---|---|---|
| Capacidade nominal | 1232,0h | ASM-01 | Dias úteis × 8 + sábados × 4 |
| Compromissos fixos (feriados) | 48,0h | ASM-02 | Indisponível |
| Overhead operacional | 118,4h | ASM-03 | 10% das horas disponíveis |
| Execução focada e revisão/validação | 926,6h | Cálculo | Inclui revisão humana dos rascunhos de agentes e os gates |
| Reserva de contingência | 139,0h (15%) | Padrão fixo da metodologia (DEC-01) | 15% da execução planejada |
| Total alocado | 1065,6h | Cálculo | Menor que a nominal |
| Carga estimada das 78 tarefas | 499,0h | ASM-04 | Folga de 427,6h concentrada após 06/01, reservada à operação do ecossistema pós-lançamento (a planejar no próximo intake) |

Por janela (mesma regra de cálculo):

| Janela | Período | Nominal da janela | Execução da janela | Reserva da janela (15%) | Carga estimada | Folga |
|---|---|---|---|---|---|---|
| J1 — Produção e agendamento do EPIC 01 | 17/10/2026 a 04/11/2026 | 116,0h | 84,5h | 12,7h | 82,0h | 2,5h |
| J2 — Lançamento e ciclo 1 | 05/11/2026 a 14/11/2026 | 64,0h | 50,1h | 7,5h | 48,2h | 1,9h |
| J3 — Produção da campanha 02 e início do épico de emprego | 15/11/2026 a 30/11/2026 | 96,0h | 68,9h | 10,3h | 63,1h | 5,8h |
| J4 — App, épicos posteriores e lançamento de 05/01 | 01/12/2026 a 05/01/2027 | 228,0h | 165,9h | 24,9h | 125,4h | 40,5h |
| J5 — Certificações, portfólio e candidaturas | 06/01/2027 a 30/03/2027 | 528,0h | 407,0h | 61,0h | 174,3h | 232,7h |
| J6 — Preparação da viagem | 31/03/2027 a 30/04/2027 | 200,0h | 150,3h | 22,5h | 6,0h | 144,3h |

**Teste de viabilidade da J1 (GATE-00):** opção A — todo o pacote do EPIC 01 pronto até 04/11 — exige cerca de 146,0h na J1, contra 84,5h de execução (1,7 vez a capacidade). Opção B (plano-base, ASM-10) — núcleo em 05/11 e liberações semanais até 05/12 — exige 82,0h na J1 e cabe nas janelas J1–J3. A opção A só seria viável com cerca de 12h por dia útil, carga incompatível com a orientação da ISO 10075-2 sobre carga mental.

## 8. Plano de Frentes de Trabalho (Workstreams)

| Frente | Resultado do período | Prioridade | Responsável | Stakeholders | Dependências | Capacidade alocada | Evidência de conclusão |
|---|---|---|---|---|---|---|---|
| CLU-01 Planejamento e controle | Escopo, capacidade e gates decididos e registrados; épicos clonados | Alta | Titular | STK-01 | — | 6,0h | Tarefas TSK-0001–TSK-0059 com evidência registrada |
| CLU-02 Site riscocognitivo.org | riscocognitivo.org público em 05/11 com home, blog, mapa, apps, ferramentas, loja, institucionais e CMS | Alta | Titular | STK-01, STK-02, STK-09 | DEP-01 | 30,5h | Tarefas TSK-0004–TSK-0028 com evidência registrada |
| CLU-03 Conteúdo do blog | Artigo fundador + 4 pilares publicados até 21/11 | Alta | Titular | STK-02 | TSK-0006 | 27,0h | Tarefas TSK-0006–TSK-0044 com evidência registrada |
| CLU-04 Apps e ferramentas | Prisma, 3 outros apps, família de templates, metacognição, plugins/agentes e recursos publicados até 28/11 | Alta | Titular | STK-02 | TSK-0003 | 39,0h | Tarefas TSK-0012–TSK-0049 com evidência registrada |
| CLU-05 E-books | 4 e-books publicados até 27/11 | Alta | Titular | STK-02 | CLU-03 | 22,0h | Tarefas TSK-0016–TSK-0046 com evidência registrada |
| CLU-06 Vídeos | 3 vídeos de 5 min publicados até 13/11 | Alta | Titular | STK-02, STK-08 | CLU-03, CLU-04 | 12,0h | Tarefas TSK-0021–TSK-0034 com evidência registrada |
| CLU-07 Loja e afiliados | Vitrine com 6 produtos e destinos reais | Alta | Titular | STK-02, STK-10 | DEP-02 | 3,0h | Tarefas TSK-0017–TSK-0019 com evidência registrada |
| CLU-08 Distribuição multiplataforma | Ciclos 1 e 2 agendados; métricas e relatórios até 05/12 | Alta | Titular | STK-02, STK-08 | DEP-03, CLU-03 | 24,0h | Tarefas TSK-0022–TSK-0053 com evidência registrada |
| CLU-09 Campanha 02 e lançamento do app | Campanha 02 produzida e agendada; app e épicos escolhidos lançados em 05/01 | Alta | Titular | STK-02, STK-08 | TSK-0039, DEP-05 | 99,0h | Tarefas TSK-0039–TSK-0060 com evidência registrada |
| CLU-10 Carreira na Europa | 3 provas, portfólio, currículo, landing, LinkedIn, Frankwatching, candidaturas e viagem preparada | Alta | Titular | STK-03, STK-04, STK-05, STK-06, STK-07 | TSK-0051, DEP-06 | 236,5h | Tarefas TSK-0050–TSK-0078 com evidência registrada |

## 9. Plano Operacional Semanal

| Semana | Resultado principal | Tarefas | Responsável | Dependência | Métrica | Evidência de conclusão | Gate |
|---|---|---|---|---|---|---|---|
| S01 (17/10–25/10) | Fundar o lançamento: escopo, rotas, pesquisa, artigo fundador e base do site | TSK-0001, TSK-0002, TSK-0003, TSK-0004, TSK-0005, TSK-0006, TSK-0007, TSK-0009, TSK-0010, TSK-0017, TSK-0018 (em andamento: TSK-0008, TSK-0012) | Titular | — | Tarefas com prazo na semana concluídas: 11 | Evidências das tarefas listadas | GATE-00, GATE-01 |
| S02 (26/10–01/11) | Construir o site completo, produzir o núcleo do pacote e agendar o ciclo 1 até 01/11 | TSK-0008, TSK-0011, TSK-0012, TSK-0013, TSK-0014, TSK-0015, TSK-0016, TSK-0019, TSK-0020, TSK-0021, TSK-0022, TSK-0023, TSK-0024 | Titular | TSK-0003, TSK-0005, TSK-0007, TSK-0009, TSK-0017 | Tarefas com prazo na semana concluídas: 13 | Evidências das tarefas listadas | GATE-02 |
| S03 (02/11–08/11) | Testar e lançar o riscocognitivo.org em 05/11; iniciar liberações da onda 2 | TSK-0025, TSK-0026, TSK-0027, TSK-0028, TSK-0029 (em andamento: TSK-0031, TSK-0033, TSK-0040) | Titular | TSK-0006, TSK-0008 | Tarefas com prazo na semana concluídas: 5 | Evidências das tarefas listadas | GATE-03 |
| S04 (09/11–15/11) | Operar o ciclo 1, liberar peças da onda 2, agendar o ciclo 2 e consolidar os dados | TSK-0030, TSK-0031, TSK-0032, TSK-0033, TSK-0034, TSK-0035, TSK-0036, TSK-0037, TSK-0038, TSK-0039 (em andamento: TSK-0040) | Titular | TSK-0006, TSK-0009, TSK-0013, TSK-0014, TSK-0023, TSK-0025, TSK-0029 | Tarefas com prazo na semana concluídas: 10 | Evidências das tarefas listadas | GATE-04 |
| S05 (16/11–22/11) | Planejar a campanha 02 com os dados, abrir o épico de emprego (19/11) e liberar pilares | TSK-0041, TSK-0043, TSK-0044, TSK-0045, TSK-0050 (em andamento: TSK-0040, TSK-0042) | Titular | TSK-0006, TSK-0039 | Tarefas com prazo na semana concluídas: 5 | Evidências das tarefas listadas | GATE-05 |
| S06 (23/11–29/11) | Produzir a campanha 02 e concluir e-books, apps e recursos do pacote | TSK-0046, TSK-0047, TSK-0048, TSK-0049, TSK-0051, TSK-0052 (em andamento: TSK-0040, TSK-0042) | Titular | TSK-0050 | Tarefas com prazo na semana concluídas: 6 | Evidências das tarefas listadas | — |
| S07 (30/11–06/12) | Fechar o pacote da campanha 02 (30/11), o ciclo de 30 dias (05/12) e definir o escopo do app | TSK-0040, TSK-0042, TSK-0053, TSK-0054 (em andamento: TSK-0055, TSK-0061, TSK-0062) | Titular | TSK-0041 | Tarefas com prazo na semana concluídas: 4 | Evidências das tarefas listadas | GATE-06, GATE-07 |
| S08 (07/12–13/12) | Desenvolver o Executar App; iniciar épicos posteriores escolhidos; otimizar o LinkedIn | TSK-0062 (em andamento: TSK-0055, TSK-0057, TSK-0061, TSK-0063) | Titular | TSK-0050 | Tarefas com prazo na semana concluídas: 1 | Evidências das tarefas listadas | — |
| S09 (14/12–20/12) | Desenvolver o app, preparar épicos posteriores e agendar a campanha 02 | TSK-0058, TSK-0063 (em andamento: TSK-0055, TSK-0057, TSK-0061, TSK-0064, TSK-0065) | Titular | TSK-0042 | Tarefas com prazo na semana concluídas: 2 | Evidências das tarefas listadas | GATE-08 |
| S10 (21/12–27/12) | Concluir o desenvolvimento do app e dos épicos posteriores (semana de Natal) | TSK-0055, TSK-0057 (em andamento: TSK-0061, TSK-0064, TSK-0065) | Titular | TSK-0054 | Tarefas com prazo na semana concluídas: 2 | Evidências das tarefas listadas | — |
| S11 (28/12–03/01) | Testar e publicar a versão do app; reserva para imprevistos | TSK-0056 (em andamento: TSK-0061, TSK-0064, TSK-0065) | Titular | TSK-0055 | Tarefas com prazo na semana concluídas: 1 | Evidências das tarefas listadas | — |
| S12 (04/01–10/01) | Lançar o app e o ecossistema em 05/01; iniciar portfólio, currículo e landing profissional | TSK-0059, TSK-0060 (em andamento: TSK-0061, TSK-0064, TSK-0065, TSK-0067) | Titular | TSK-0056 | Tarefas com prazo na semana concluídas: 2 | Evidências das tarefas listadas | GATE-09 |
| S13 (11/01–17/01) | Concluir portfólio, currículo e landing; estudar e fazer a prova de projetos | TSK-0061 (em andamento: TSK-0064, TSK-0065, TSK-0066, TSK-0067, TSK-0068, TSK-0069, TSK-0070, TSK-0071) | Titular | TSK-0052 | Tarefas com prazo na semana concluídas: 1 | Evidências das tarefas listadas | — |
| S14 (18/01–24/01) | Concluir portfólio, currículo e landing; estudar e fazer a prova de projetos | — (em andamento: TSK-0064, TSK-0065, TSK-0066, TSK-0067, TSK-0068, TSK-0069, TSK-0070, TSK-0071) | Titular | — | Tarefas com prazo na semana concluídas: 0 | Evidências das tarefas listadas | — |
| S15 (25/01–31/01) | Concluir portfólio, currículo e landing; estudar e fazer a prova de projetos | TSK-0066, TSK-0067, TSK-0068, TSK-0069, TSK-0070, TSK-0072 (em andamento: TSK-0064, TSK-0065, TSK-0071) | Titular | TSK-0061, TSK-0062 | Tarefas com prazo na semana concluídas: 6 | Evidências das tarefas listadas | GATE-10 |
| S16 (01/02–07/02) | Enviar candidaturas semanais; estudar e fazer as provas de processos e governança de IA; publicar no LinkedIn | — (em andamento: TSK-0064, TSK-0065, TSK-0071, TSK-0073, TSK-0074) | Titular | — | Tarefas com prazo na semana concluídas: 0 | Evidências das tarefas listadas | — |
| S17 (08/02–14/02) | Enviar candidaturas semanais; estudar e fazer as provas de processos e governança de IA; publicar no LinkedIn | — (em andamento: TSK-0064, TSK-0065, TSK-0071, TSK-0073, TSK-0074) | Titular | — | Tarefas com prazo na semana concluídas: 0 | Evidências das tarefas listadas | — |
| S18 (15/02–21/02) | Enviar candidaturas semanais; estudar e fazer as provas de processos e governança de IA; publicar no LinkedIn | TSK-0064 (em andamento: TSK-0065, TSK-0071, TSK-0073, TSK-0074, TSK-0075) | Titular | TSK-0052 | Tarefas com prazo na semana concluídas: 1 | Evidências das tarefas listadas | — |
| S19 (22/02–28/02) | Enviar candidaturas semanais; estudar e fazer as provas de processos e governança de IA; publicar no LinkedIn | TSK-0074, TSK-0075 (em andamento: TSK-0065, TSK-0071, TSK-0073) | Titular | TSK-0064, TSK-0070 | Tarefas com prazo na semana concluídas: 2 | Evidências das tarefas listadas | — |
| S20 (01/03–07/03) | Enviar candidaturas semanais; estudar e fazer as provas de processos e governança de IA; publicar no LinkedIn | — (em andamento: TSK-0065, TSK-0071, TSK-0073) | Titular | — | Tarefas com prazo na semana concluídas: 0 | Evidências das tarefas listadas | — |
| S21 (08/03–14/03) | Enviar candidaturas semanais; estudar e fazer as provas de processos e governança de IA; publicar no LinkedIn | TSK-0071 (em andamento: TSK-0065, TSK-0073, TSK-0076) | Titular | TSK-0052 | Tarefas com prazo na semana concluídas: 1 | Evidências das tarefas listadas | — |
| S22 (15/03–21/03) | Enviar candidaturas semanais; estudar e fazer as provas de processos e governança de IA; publicar no LinkedIn | — (em andamento: TSK-0065, TSK-0073, TSK-0076) | Titular | — | Tarefas com prazo na semana concluídas: 0 | Evidências das tarefas listadas | — |
| S23 (22/03–28/03) | Enviar candidaturas semanais; estudar e fazer as provas de processos e governança de IA; publicar no LinkedIn | TSK-0076 (em andamento: TSK-0065, TSK-0073) | Titular | TSK-0071 | Tarefas com prazo na semana concluídas: 1 | Evidências das tarefas listadas | — |
| S24 (29/03–04/04) | Enviar candidaturas semanais; estudar e fazer as provas de processos e governança de IA; publicar no LinkedIn | TSK-0065, TSK-0073, TSK-0077 (em andamento: TSK-0078) | Titular | TSK-0062, TSK-0072 | Tarefas com prazo na semana concluídas: 3 | Evidências das tarefas listadas | GATE-11 |
| S25 (05/04–11/04) | Preparar a documentação e a logística da viagem de 30/04 | — (em andamento: TSK-0078) | Titular | — | Tarefas com prazo na semana concluídas: 0 | Evidências das tarefas listadas | — |
| S26 (12/04–18/04) | Preparar a documentação e a logística da viagem de 30/04 | — (em andamento: TSK-0078) | Titular | — | Tarefas com prazo na semana concluídas: 0 | Evidências das tarefas listadas | — |
| S27 (19/04–25/04) | Preparar a documentação e a logística da viagem de 30/04 | TSK-0078 | Titular | TSK-0077 | Tarefas com prazo na semana concluídas: 1 | Evidências das tarefas listadas | — |
| S28 (26/04–30/04) | Preparar a documentação e a logística da viagem de 30/04 | — | Titular | — | Tarefas com prazo na semana concluídas: 0 | Evidências das tarefas listadas | — |

## 10. Registro Executável de Tarefas

Registro completo com as 25 colunas do schema canônico, sincronizado com o arquivo `registro-tarefas-executar-epic01-2026-10-a-2027-04.csv`. Tabela resumida para leitura e, em seguida, o bloco CSV integral (inclui `prompt_ia_self_contained` e `fonte_id`).

| tarefa_id | cluster | titulo | responsavel | prioridade | prazo | tempo_estimado | dependencia_bloqueante | status | fonte_id |
|---|---|---|---|---|---|---|---|---|---|
| TSK-0001 | Planejamento e controle | Confirmar a capacidade semanal real e o escopo do lançamento de 05/11 | Titular | Alta | 17/10/2026 | 1,0 horas | — | Não iniciada | DEC-03 |
| TSK-0002 | Planejamento e controle | Registrar o EPIC 01, a Campanha 02 e o EPIC Emprego no GitHub e no workbook | Titular | Alta | 19/10/2026 | 2,0 horas | TSK-0001 | Não iniciada | FACT-07 |
| TSK-0003 | Planejamento e controle | Inventariar os ativos já existentes do ecossistema com o status real de cada um | Titular | Alta | 19/10/2026 | 2,0 horas | — | Não iniciada | FACT-05 |
| TSK-0004 | Site riscocognitivo.org | Confirmar o domínio riscocognitivo.org, o DNS e a hospedagem na Cloudflare | Titular | Alta | 20/10/2026 | 1,5 horas | — | Não iniciada | FACT-01 |
| TSK-0005 | Site riscocognitivo.org | Definir as rotas que entram no lançamento a partir do mapa de rotas do EXECUTAR | Titular | Alta | 20/10/2026 | 1,0 horas | TSK-0003 | Não iniciada | FACT-02 |
| TSK-0006 | Conteúdo do blog | Pesquisar evidências citáveis para o artigo fundador e os quatro artigos pilares | Titular | Alta | 21/10/2026 | 3,0 horas | — | Não iniciada | FACT-03 |
| TSK-0007 | Site riscocognitivo.org | Revisar o Manifesto e escrever as metaexplicações da home | Titular | Alta | 22/10/2026 | 2,0 horas | — | Não iniciada | FACT-01 |
| TSK-0008 | Site riscocognitivo.org | Construir a home premium de conversão com o Manifesto e as principais funcionalidades | Titular | Alta | 26/10/2026 | 6,0 horas | TSK-0007 | Não iniciada | FACT-02 |
| TSK-0009 | Conteúdo do blog | Escrever o artigo fundador (Peça 01): neurodivergência, demandas cognitivas e soluções | Titular | Alta | 24/10/2026 | 6,0 horas | TSK-0006 | Não iniciada | FACT-01 |
| TSK-0010 | Site riscocognitivo.org | Adaptar o catálogo do blog e a página de artigo com CTA para as ferramentas | Titular | Alta | 24/10/2026 | 3,0 horas | TSK-0005 | Não iniciada | FACT-02 |
| TSK-0011 | Site riscocognitivo.org | Construir o mapa cognitivo simplificado com home e landing próprias | Titular | Alta | 29/10/2026 | 6,0 horas | TSK-0005 | Não iniciada | FACT-01 |
| TSK-0012 | Apps e ferramentas | Empacotar o Prisma standalone para acesso público | Titular | Alta | 27/10/2026 | 3,0 horas | TSK-0003 | Não iniciada | FACT-01 |
| TSK-0013 | Apps e ferramentas | Publicar o catálogo de apps com o Prisma e a página de cada app disponível | Titular | Alta | 28/10/2026 | 3,0 horas | TSK-0012 | Não iniciada | FACT-02 |
| TSK-0014 | Apps e ferramentas | Criar o primeiro template da família por déficit executivo para TDAH, dislexia e autismo | Titular | Alta | 29/10/2026 | 5,0 horas | — | Não iniciada | FACT-01 |
| TSK-0015 | Apps e ferramentas | Publicar o catálogo de ferramentas com filtros e download dos templates | Titular | Alta | 30/10/2026 | 4,0 horas | TSK-0014 | Não iniciada | FACT-02 |
| TSK-0016 | E-books | Escrever o e-book 1: Operações e Neurodivergência | Titular | Alta | 31/10/2026 | 6,0 horas | TSK-0009 | Não iniciada | FACT-01 |
| TSK-0017 | Loja e afiliados | Definir o checkout e os links de afiliado reais da loja | Titular | Alta | 23/10/2026 | 1,0 horas | — | Não iniciada | FACT-02 |
| TSK-0018 | Site riscocognitivo.org | Configurar o CMS para conteúdos, recursos, produtos e agendamento | Titular | Alta | 23/10/2026 | 3,0 horas | — | Não iniciada | FACT-05 |
| TSK-0019 | Loja e afiliados | Montar a vitrine da loja com os produtos e os links de afiliado reais | Titular | Alta | 30/10/2026 | 2,0 horas | TSK-0017 | Não iniciada | FACT-01 |
| TSK-0020 | Site riscocognitivo.org | Publicar as páginas institucionais, a newsletter e o contato | Titular | Alta | 30/10/2026 | 2,0 horas | — | Não iniciada | FACT-02 |
| TSK-0021 | Vídeos | Roteirizar e gravar o vídeo comercial de 5 minutos da landing com o Prisma | Titular | Alta | 31/10/2026 | 4,0 horas | TSK-0012 | Não iniciada | FACT-01 |
| TSK-0022 | Distribuição multiplataforma | Desmembrar o pacote do lançamento em derivados por plataforma para o ciclo 1 | Titular | Alta | 01/11/2026 | 5,0 horas | TSK-0009 | Não iniciada | FACT-03 |
| TSK-0023 | Distribuição multiplataforma | Agendar as publicações do ciclo 1 em todas as plataformas | Titular | Alta | 01/11/2026 | 3,0 horas | TSK-0022 | Não iniciada | DEC-03 |
| TSK-0024 | Conteúdo do blog | Revisar estilo, otimização para buscadores e CTAs do artigo fundador e do e-book 1 | Titular | Alta | 31/10/2026 | 2,0 horas | TSK-0009 | Não iniciada | FACT-03 |
| TSK-0025 | Distribuição multiplataforma | Configurar a medição do site, dos links e da newsletter | Titular | Alta | 03/11/2026 | 2,0 horas | — | Não iniciada | FACT-05 |
| TSK-0026 | Site riscocognitivo.org | Testar o site completo antes do lançamento | Titular | Alta | 04/11/2026 | 3,0 horas | TSK-0008 | Não iniciada | FACT-02 |
| TSK-0027 | Planejamento e controle | Decidir a liberação do lançamento de 05/11 | Titular | Alta | 04/11/2026 | 0,5 horas | TSK-0026 | Não iniciada | DEC-03 |
| TSK-0028 | Site riscocognitivo.org | Publicar o riscocognitivo.org e acompanhar o dia do lançamento | Titular | Alta | 05/11/2026 | 3,0 horas | TSK-0027 | Não iniciada | DEC-03 |
| TSK-0029 | Conteúdo do blog | Escrever o artigo pilar sobre gestão de riscos, projetos e processos neuroadaptados | Titular | Média | 07/11/2026 | 4,0 horas | TSK-0006 | Não iniciada | FACT-01 |
| TSK-0030 | Conteúdo do blog | Escrever o artigo pilar sobre funções executivas | Titular | Média | 11/11/2026 | 4,0 horas | TSK-0006 | Não iniciada | FACT-01 |
| TSK-0031 | Apps e ferramentas | Criar a ferramenta de metacognição | Titular | Média | 10/11/2026 | 3,0 horas | — | Não iniciada | FACT-01 |
| TSK-0032 | Apps e ferramentas | Completar a família de templates por déficit executivo | Titular | Média | 13/11/2026 | 4,0 horas | TSK-0014 | Não iniciada | FACT-01 |
| TSK-0033 | Vídeos | Gravar o vídeo da Peça 01 para o YouTube | Titular | Média | 10/11/2026 | 4,0 horas | TSK-0009 | Não iniciada | FACT-01 |
| TSK-0034 | Vídeos | Gravar o vídeo sobre gestão de riscos cognitivos | Titular | Média | 13/11/2026 | 4,0 horas | TSK-0029 | Não iniciada | FACT-01 |
| TSK-0035 | Apps e ferramentas | Empacotar o Meu processo de trabalho e o Plano Operacional Rastreável como apps públicos | Titular | Média | 13/11/2026 | 5,0 horas | TSK-0013 | Não iniciada | FACT-01 |
| TSK-0036 | E-books | Escrever o e-book 2: Funções executivas | Titular | Média | 14/11/2026 | 6,0 horas | TSK-0030 | Não iniciada | FACT-01 |
| TSK-0037 | Distribuição multiplataforma | Desmembrar e agendar as publicações do ciclo 2 | Titular | Média | 14/11/2026 | 5,0 horas | TSK-0023 | Não iniciada | DEC-03 |
| TSK-0038 | Distribuição multiplataforma | Escrever as 3 newsletters do ciclo 2 | Titular | Média | 14/11/2026 | 2,0 horas | — | Não iniciada | FACT-03 |
| TSK-0039 | Campanha 02 e lançamento do app | Consolidar os dados da campanha 01 em um relatório de aprendizado | Titular | Alta | 14/11/2026 | 3,0 horas | TSK-0025 | Não iniciada | DEC-05 |
| TSK-0040 | Distribuição multiplataforma | Acompanhar as métricas e os comentários semanalmente durante o ciclo de 30 dias | Titular | Média | 05/12/2026 | 4,0 horas | — | Não iniciada | DEC-05 |
| TSK-0041 | Campanha 02 e lançamento do app | Planejar a campanha 02 a partir dos dados da campanha 01 | Titular | Alta | 17/11/2026 | 3,0 horas | TSK-0039 | Não iniciada | DEC-04 |
| TSK-0042 | Campanha 02 e lançamento do app | Produzir o pacote de conteúdo da campanha 02 | Titular | Alta | 30/11/2026 | 20,0 horas | TSK-0041 | Não iniciada | DEC-03 |
| TSK-0043 | Conteúdo do blog | Escrever o artigo pilar sobre dark partners | Titular | Média | 18/11/2026 | 4,0 horas | — | Não iniciada | FACT-01 |
| TSK-0044 | Conteúdo do blog | Escrever o artigo pilar sobre riscos cognitivos no estudo, no trabalho, na rotina e nos ambientes físicos e digitais | Titular | Média | 21/11/2026 | 4,0 horas | TSK-0006 | Não iniciada | FACT-01 |
| TSK-0045 | E-books | Escrever o e-book 3: Ambientes físicos e digitais | Titular | Média | 21/11/2026 | 5,0 horas | — | Não iniciada | FACT-01 |
| TSK-0046 | E-books | Escrever o e-book 4: Gerenciando o TDAH adulto com base em Barkley | Titular | Média | 27/11/2026 | 5,0 horas | — | Não iniciada | FACT-01 |
| TSK-0047 | Apps e ferramentas | Empacotar o workflow visual, o construtor de mapas e o operador de tarefas | Titular | Média | 26/11/2026 | 4,0 horas | — | Não iniciada | FACT-01 |
| TSK-0048 | Apps e ferramentas | Empacotar os plugins e agentes para download | Titular | Média | 27/11/2026 | 4,0 horas | — | Não iniciada | FACT-01 |
| TSK-0049 | Apps e ferramentas | Produzir o photo prompt de rotina, o guia de Obsidian para dislexia e os infográficos de IDs | Titular | Média | 28/11/2026 | 4,0 horas | — | Não iniciada | FACT-01 |
| TSK-0050 | Carreira na Europa | Planejar a estratégia de realocação profissional na Europa | Titular | Alta | 21/11/2026 | 3,0 horas | — | Não iniciada | DEC-07 |
| TSK-0051 | Carreira na Europa | Escolher as certificações e verificar preços e datas de prova | Titular | Alta | 25/11/2026 | 2,0 horas | TSK-0050 | Não iniciada | DEC-07 |
| TSK-0052 | Carreira na Europa | Montar o plano de estudos com autoestudo, cursos e simulados | Titular | Alta | 27/11/2026 | 2,0 horas | TSK-0051 | Não iniciada | DEC-07 |
| TSK-0053 | Distribuição multiplataforma | Fechar o relatório do ciclo de 30 dias da campanha 01 | Titular | Alta | 05/12/2026 | 3,0 horas | TSK-0040 | Não iniciada | DEC-05 |
| TSK-0054 | Campanha 02 e lançamento do app | Definir o escopo do Executar App e do Expo para o lançamento de 05/01 | Titular | Alta | 02/12/2026 | 2,0 horas | — | Não iniciada | DEC-04 |
| TSK-0055 | Campanha 02 e lançamento do app | Desenvolver o Executar App e o Expo dentro do escopo aprovado | Titular | Alta | 22/12/2026 | 40,0 horas | TSK-0054 | Não iniciada | DEC-04 |
| TSK-0056 | Campanha 02 e lançamento do app | Testar o Executar App e publicar a versão de lançamento | Titular | Alta | 02/01/2027 | 8,0 horas | TSK-0055 | Não iniciada | DEC-04 |
| TSK-0057 | Campanha 02 e lançamento do app | Preparar os épicos posteriores escolhidos para o lançamento de 05/01 | Titular | Média | 22/12/2026 | 16,0 horas | TSK-0054 | Não iniciada | DEC-04 |
| TSK-0058 | Campanha 02 e lançamento do app | Agendar as publicações da campanha 02 | Titular | Alta | 18/12/2026 | 4,0 horas | TSK-0042 | Não iniciada | DEC-03 |
| TSK-0059 | Planejamento e controle | Decidir a liberação do lançamento de 05/01 | Titular | Alta | 04/01/2027 | 0,5 horas | TSK-0056 | Não iniciada | DEC-03 |
| TSK-0060 | Campanha 02 e lançamento do app | Executar o lançamento do app e do ecossistema em 05/01 | Titular | Alta | 05/01/2027 | 3,0 horas | TSK-0059 | Não iniciada | DEC-03 |
| TSK-0061 | Carreira na Europa | Estudar gestão de projetos conforme o plano de estudos | Titular | Alta | 15/01/2027 | 40,0 horas | TSK-0052 | Não iniciada | DEC-07 |
| TSK-0062 | Carreira na Europa | Otimizar o perfil do LinkedIn e iniciar a linha editorial | Titular | Média | 11/12/2026 | 4,0 horas | TSK-0050 | Não iniciada | DEC-10 |
| TSK-0063 | Carreira na Europa | Fazer o contato estratégico com o profissional na Holanda | Titular | Média | 15/12/2026 | 2,0 horas | — | Não iniciada | DEC-10 |
| TSK-0064 | Carreira na Europa | Estudar gestão de processos conforme o plano de estudos | Titular | Alta | 15/02/2027 | 30,0 horas | TSK-0052 | Não iniciada | DEC-07 |
| TSK-0065 | Carreira na Europa | Publicar um post semanal da linha editorial sobre riscos cognitivos no LinkedIn | Titular | Média | 30/03/2027 | 15,0 horas | TSK-0062 | Não iniciada | DEC-10 |
| TSK-0066 | Carreira na Europa | Fazer o simulado final e a prova de gestão de projetos | Titular | Alta | TBD | 10,0 horas | TSK-0061 | Não iniciada | DEC-07 |
| TSK-0067 | Carreira na Europa | Montar o portfólio profissional com as soluções, os produtos e os apps da Clean Sea | Titular | Alta | 31/01/2027 | 12,0 horas | — | Não iniciada | DEC-08 |
| TSK-0068 | Carreira na Europa | Criar a landing page profissional e atualizar as redes sociais | Titular | Alta | 31/01/2027 | 6,0 horas | TSK-0067 | Não iniciada | DEC-07 |
| TSK-0069 | Carreira na Europa | Escrever o currículo no padrão europeu e a carta-modelo | Titular | Alta | 25/01/2027 | 4,0 horas | — | Não iniciada | DEC-07 |
| TSK-0070 | Carreira na Europa | Propor uma pauta sobre riscos cognitivos ao editor da Frankwatching | Titular | Média | 31/01/2027 | 4,0 horas | TSK-0062 | Não iniciada | DEC-10 |
| TSK-0071 | Carreira na Europa | Estudar governança de IA conforme o plano de estudos | Titular | Alta | 10/03/2027 | 35,0 horas | TSK-0052 | Não iniciada | DEC-07 |
| TSK-0072 | Carreira na Europa | Decidir se portfólio, currículo e LinkedIn estão prontos para as candidaturas | Titular | Alta | 31/01/2027 | 0,5 horas | TSK-0068 | Não iniciada | DEC-03 |
| TSK-0073 | Carreira na Europa | Enviar candidaturas a vagas na Europa de 01/02 a 30/03 | Titular | Alta | 30/03/2027 | 34,0 horas | TSK-0072 | Não iniciada | DEC-03 |
| TSK-0074 | Carreira na Europa | Submeter o primeiro artigo à Frankwatching | Titular | Média | 28/02/2027 | 6,0 horas | TSK-0070 | Não iniciada | DEC-10 |
| TSK-0075 | Carreira na Europa | Fazer o simulado final e a prova de gestão de processos | Titular | Alta | TBD | 10,0 horas | TSK-0064 | Não iniciada | DEC-07 |
| TSK-0076 | Carreira na Europa | Fazer o simulado final e a prova de governança de IA | Titular | Alta | TBD | 10,0 horas | TSK-0071 | Não iniciada | DEC-07 |
| TSK-0077 | Carreira na Europa | Encerrar o épico de emprego e decidir os próximos passos da viagem | Titular | Alta | 30/03/2027 | 1,0 horas | TSK-0073 | Não iniciada | DEC-03 |
| TSK-0078 | Carreira na Europa | Preparar a documentação e a logística da viagem de 30/04 | Titular | Alta | 25/04/2027 | 6,0 horas | TSK-0077 | Não iniciada | DEC-03 |

```csv
tarefa_id,cluster_id,cluster_nome,titulo,verbo_acao,camada_operacional,resultado_esperado,criterio_smart_especifico,criterio_smart_mensuravel,criterio_smart_atingivel,criterio_smart_relevante,criterio_smart_temporal,prompt_ia_self_contained,passos,concluido_quando,evidencia_conclusao,tags,tarefas_relacionadas,dependencia_bloqueante,responsavel,prioridade,prazo,tempo_estimado,status,fonte_id
TSK-0001,CLU-01,Planejamento e controle,Confirmar a capacidade semanal real e o escopo do lançamento de 05/11,confirmar,Abrir a tabela de capacidade deste plano e anotar quantas horas por dia estão realmente disponíveis até 04/11.,Decisão registrada: horas por semana confirmadas e escolha entre lançar tudo em 05/11 ou lançar o núcleo em 05/11 com liberações semanais até 05/12.,Cobre só a confirmação de horas e a escolha do escopo de 05/11; não altera tarefas.,Duas respostas registradas por escrito: horas/semana e opção de escopo (A ou B).,"Estimativa de 1,0h dentro da janela 17/10/2026 a 04/11/2026, cuja capacidade de execução é 84,5h.",Sem essa decisão a carga do lançamento fica perto do dobro da capacidade estimada até 04/11.,Em 17/10/2026.,"<tarefa id=""TSK-0001"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Planejamento e controle. Mantém o plano rastreável, com escopo e capacidade confirmados antes da execução.</contexto>
  <objetivo>Decisão registrada: horas por semana confirmadas e escolha entre lançar tudo em 05/11 ou lançar o núcleo em 05/11 com liberações semanais até 05/12.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre só a confirmação de horas e a escolha do escopo de 05/11; não altera tarefas.</restricoes>
  <passos>
    Conferir as horas disponíveis por dia até 04/11.
    Comparar com a carga estimada das opções A e B.
    Registrar a decisão e a data.
  </passos>
  <criterio_de_conclusao>A decisão (horas/semana e opção A ou B) estiver registrada por escrito.</criterio_de_conclusao>
  <formato_de_saida>Nota de decisão datada no registro de tarefas. Prazo: 17/10/2026. Tempo previsto: 1,0h.</formato_de_saida>
  <evidencia_esperada>Nota de decisão datada no registro de tarefas.</evidencia_esperada>
  <lacunas_conhecidas>Capacidade semanal real. Não preencher com valor inventado.</lacunas_conhecidas>
</tarefa>",Conferir as horas disponíveis por dia até 04/11|Comparar com a carga estimada das opções A e B|Registrar a decisão e a data,A decisão (horas/semana e opção A ou B) estiver registrada por escrito.,Nota de decisão datada no registro de tarefas.,planejamento|capacidade|decisao,,,Titular,Alta,17/10/2026,"1,0 horas",Não iniciada,DEC-03
TSK-0002,CLU-01,Planejamento e controle,"Registrar o EPIC 01, a Campanha 02 e o EPIC Emprego no GitHub e no workbook",registrar,Abrir o repositório workbook e ler a regra de tripla clonagem em 500_Copiloto_templates/regras/OPERACOES.md.,Três épicos criados no GitHub e clonados nas pastas de tarefas do owner e no registro de tarefas do workbook.,Cobre só o registro dos três épicos; sub-issues ficam para depois.,3 issues no GitHub + 3 arquivos de tarefa do owner + 3 arquivos no registro de tarefas.,"Estimativa de 2,0h dentro da janela 17/10/2026 a 04/11/2026, cuja capacidade de execução é 84,5h.",O acompanhamento semanal precisa de IDs estáveis para cada épico.,De 18/10/2026 até 19/10/2026.,"<tarefa id=""TSK-0002"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Planejamento e controle. Mantém o plano rastreável, com escopo e capacidade confirmados antes da execução.</contexto>
  <objetivo>Três épicos criados no GitHub e clonados nas pastas de tarefas do owner e no registro de tarefas do workbook.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0001 (Confirmar a capacidade semanal real e o escopo do lançamento de 05/11). Sem acesso ao GitHub: parar e avisar. Owner de cada épico a confirmar com o titular. Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre só o registro dos três épicos; sub-issues ficam para depois.</restricoes>
  <passos>
    Criar os três épicos no GitHub.
    Clonar cada épico na pasta de tarefas do owner.
    Clonar no registro de tarefas do workbook.
  </passos>
  <criterio_de_conclusao>Os três épicos existirem nos três lugares com o mesmo ID.</criterio_de_conclusao>
  <formato_de_saida>Links das 3 issues e caminhos dos 6 arquivos. Prazo: 19/10/2026. Tempo previsto: 2,0h.</formato_de_saida>
  <evidencia_esperada>Links das 3 issues e caminhos dos 6 arquivos.</evidencia_esperada>
  <lacunas_conhecidas>Owner (área) de cada épico no workbook. Não preencher com valor inventado.</lacunas_conhecidas>
</tarefa>",Criar os três épicos no GitHub|Clonar cada épico na pasta de tarefas do owner|Clonar no registro de tarefas do workbook,Os três épicos existirem nos três lugares com o mesmo ID.,Links das 3 issues e caminhos dos 6 arquivos.,governanca|github|workbook,,TSK-0001,Titular,Alta,19/10/2026,"2,0 horas",Não iniciada,FACT-07
TSK-0003,CLU-01,Planejamento e controle,Inventariar os ativos já existentes do ecossistema com o status real de cada um,inventariar,"Abrir o repositório Design e listar as pastas apps/, apps/site/content/articles e plugins/.","Lista única de ativos (apps, artigos, skills, templates, rascunhos de e-book) com status: pronto, rascunho ou inexistente.",Cobre só o levantamento; não corrige nem publica nada.,Cada item do pacote do EPIC 01 aparece na lista com um dos três status.,"Estimativa de 2,0h dentro da janela 17/10/2026 a 04/11/2026, cuja capacidade de execução é 84,5h.",Evita produzir do zero o que já existe e corrige as estimativas de horas.,De 17/10/2026 até 19/10/2026.,"<tarefa id=""TSK-0003"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Planejamento e controle. Mantém o plano rastreável, com escopo e capacidade confirmados antes da execução.</contexto>
  <objetivo>Lista única de ativos (apps, artigos, skills, templates, rascunhos de e-book) com status: pronto, rascunho ou inexistente.</objetivo>
  <entrada>Repositórios Design e workbook do Programa EXECUTAR.</entrada>
  <restricoes>Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre só o levantamento; não corrige nem publica nada.</restricoes>
  <passos>
    Listar os ativos dos repositórios.
    Marcar o status real de cada um.
    Apontar o que falta para cada item do pacote.
  </passos>
  <criterio_de_conclusao>Todos os itens do pacote do EPIC 01 tiverem status marcado.</criterio_de_conclusao>
  <formato_de_saida>Arquivo de inventário salvo no repositório. Prazo: 19/10/2026. Tempo previsto: 2,0h.</formato_de_saida>
  <evidencia_esperada>Arquivo de inventário salvo no repositório.</evidencia_esperada>
  <lacunas_conhecidas>Status real dos apps Prisma, Meu processo de trabalho, Plano Operacional Rastreável e workflow. Não preencher com valor inventado.</lacunas_conhecidas>
</tarefa>",Listar os ativos dos repositórios|Marcar o status real de cada um|Apontar o que falta para cada item do pacote,Todos os itens do pacote do EPIC 01 tiverem status marcado.,Arquivo de inventário salvo no repositório.,inventario|ativos|planejamento,,,Titular,Alta,19/10/2026,"2,0 horas",Não iniciada,FACT-05
TSK-0004,CLU-02,Site riscocognitivo.org,"Confirmar o domínio riscocognitivo.org, o DNS e a hospedagem na Cloudflare",confirmar,Entrar no painel da Cloudflare e procurar o domínio riscocognitivo.org na lista de sites.,"Domínio ativo apontando para o Worker do site, com HTTPS funcionando.","Cobre domínio, DNS e certificado; não cobre o conteúdo do site.",https://riscocognitivo.org responde com o site (ou página provisória) e certificado válido.,"Estimativa de 1,5h dentro da janela 17/10/2026 a 04/11/2026, cuja capacidade de execução é 84,5h.",Sem domínio não há lançamento em 05/11.,De 19/10/2026 até 20/10/2026.,"<tarefa id=""TSK-0004"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Site riscocognitivo.org. O site riscocognitivo.org é o ponto de chegada de todo o conteúdo e de todas as ofertas do lançamento.</contexto>
  <objetivo>Domínio ativo apontando para o Worker do site, com HTTPS funcionando.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre domínio, DNS e certificado; não cobre o conteúdo do site.</restricoes>
  <passos>
    Verificar o registro do domínio.
    Apontar o DNS para o Worker do site.
    Testar o acesso por HTTPS.
  </passos>
  <criterio_de_conclusao>O endereço https://riscocognitivo.org abrir com certificado válido.</criterio_de_conclusao>
  <formato_de_saida>Print do navegador e da configuração de DNS. Prazo: 20/10/2026. Tempo previsto: 1,5h.</formato_de_saida>
  <evidencia_esperada>Print do navegador e da configuração de DNS.</evidencia_esperada>
  <lacunas_conhecidas>Situação do registro do domínio. Não preencher com valor inventado.</lacunas_conhecidas>
</tarefa>",Verificar o registro do domínio|Apontar o DNS para o Worker do site|Testar o acesso por HTTPS,O endereço https://riscocognitivo.org abrir com certificado válido.,Print do navegador e da configuração de DNS.,dominio|cloudflare|site,,,Titular,Alta,20/10/2026,"1,5 horas",Não iniciada,FACT-01
TSK-0005,CLU-02,Site riscocognitivo.org,Definir as rotas que entram no lançamento a partir do mapa de rotas do EXECUTAR,definir,Abrir o arquivo EXECUTAR_rotas.csv e filtrar as rotas públicas.,"Lista de rotas marcadas como lançamento 05/11, liberação até 05/12 ou depois.",Cobre a seleção de rotas; não constrói páginas.,Cada uma das 78 rotas do arquivo recebe uma das três marcações.,"Estimativa de 1,0h dentro da janela 17/10/2026 a 04/11/2026, cuja capacidade de execução é 84,5h.","Evita construir agora páginas de frentes previstas para depois (comunidade, studio, conta).",Em 20/10/2026.,"<tarefa id=""TSK-0005"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Site riscocognitivo.org. O site riscocognitivo.org é o ponto de chegada de todo o conteúdo e de todas as ofertas do lançamento.</contexto>
  <objetivo>Lista de rotas marcadas como lançamento 05/11, liberação até 05/12 ou depois.</objetivo>
  <entrada>Arquivo EXECUTAR_rotas.csv (78 rotas).</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0003 (Inventariar os ativos já existentes do ecossistema com o status real de cada um). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre a seleção de rotas; não constrói páginas.</restricoes>
  <passos>
    Marcar as rotas do lançamento.
    Marcar as rotas com liberação até 05/12.
    Marcar as rotas para depois.
  </passos>
  <criterio_de_conclusao>As 78 rotas tiverem marcação.</criterio_de_conclusao>
  <formato_de_saida>CSV de rotas com a coluna de marcação. Prazo: 20/10/2026. Tempo previsto: 1,0h.</formato_de_saida>
  <evidencia_esperada>CSV de rotas com a coluna de marcação.</evidencia_esperada>
</tarefa>",Marcar as rotas do lançamento|Marcar as rotas com liberação até 05/12|Marcar as rotas para depois,As 78 rotas tiverem marcação.,CSV de rotas com a coluna de marcação.,rotas|site|escopo,,TSK-0003,Titular,Alta,20/10/2026,"1,0 horas",Não iniciada,FACT-02
TSK-0006,CLU-03,Conteúdo do blog,Pesquisar evidências citáveis para o artigo fundador e os quatro artigos pilares,pesquisar,Abrir um documento novo e escrever as cinco perguntas centrais dos artigos.,"Mapa de evidências com fontes verificáveis por artigo (dados, estudos e exemplos).",Cobre a pesquisa; não redige os artigos.,"Pelo menos 2 fontes verificáveis por artigo, com link e data de acesso.","Estimativa de 3,0h dentro da janela 17/10/2026 a 04/11/2026, cuja capacidade de execução é 84,5h.",O padrão editorial exige evidência por afirmação e citabilidade em buscadores de IA.,De 19/10/2026 até 21/10/2026.,"<tarefa id=""TSK-0006"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Conteúdo do blog. Os artigos são as peças-mãe que geram os derivados multiplataforma e levam às ferramentas.</contexto>
  <objetivo>Mapa de evidências com fontes verificáveis por artigo (dados, estudos e exemplos).</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Não usar fonte sem autor ou data identificável. Conteúdo educativo, sem diagnóstico. Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre a pesquisa; não redige os artigos.</restricoes>
  <passos>
    Listar as perguntas de cada artigo.
    Reunir fontes verificáveis por pergunta.
    Registrar o mapa de evidências.
  </passos>
  <criterio_de_conclusao>Os cinco artigos tiverem pelo menos 2 fontes verificáveis cada.</criterio_de_conclusao>
  <formato_de_saida>Mapa de evidências salvo com links. Prazo: 21/10/2026. Tempo previsto: 3,0h.</formato_de_saida>
  <evidencia_esperada>Mapa de evidências salvo com links.</evidencia_esperada>
</tarefa>",Listar as perguntas de cada artigo|Reunir fontes verificáveis por pergunta|Registrar o mapa de evidências,Os cinco artigos tiverem pelo menos 2 fontes verificáveis cada.,Mapa de evidências salvo com links.,pesquisa|evidencias|blog|no-n4,TSK-0009,,Titular,Alta,21/10/2026,"3,0 horas",Não iniciada,FACT-03
TSK-0007,CLU-02,Site riscocognitivo.org,Revisar o Manifesto e escrever as metaexplicações da home,revisar,Abrir o arquivo manifesto.mdx do site e ler do início ao fim.,Manifesto final e textos curtos que explicam o método e as principais funcionalidades na home.,Cobre os textos da home; não cobre o layout.,Manifesto aprovado + 1 texto curto por funcionalidade principal.,"Estimativa de 2,0h dentro da janela 17/10/2026 a 04/11/2026, cuja capacidade de execução é 84,5h.",A home premium apresenta o Manifesto e converte o visitante.,De 21/10/2026 até 22/10/2026.,"<tarefa id=""TSK-0007"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Site riscocognitivo.org. O site riscocognitivo.org é o ponto de chegada de todo o conteúdo e de todas as ofertas do lançamento.</contexto>
  <objetivo>Manifesto final e textos curtos que explicam o método e as principais funcionalidades na home.</objetivo>
  <entrada>Arquivo apps/site/content/articles/manifesto.mdx (rascunho existente).</entrada>
  <restricoes>Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre os textos da home; não cobre o layout.</restricoes>
  <passos>
    Revisar o Manifesto.
    Escrever as metaexplicações.
    Aprovar os textos.
  </passos>
  <criterio_de_conclusao>Manifesto e metaexplicações estiverem aprovados pelo titular.</criterio_de_conclusao>
  <formato_de_saida>Arquivo do Manifesto atualizado no repositório. Prazo: 22/10/2026. Tempo previsto: 2,0h.</formato_de_saida>
  <evidencia_esperada>Arquivo do Manifesto atualizado no repositório.</evidencia_esperada>
</tarefa>",Revisar o Manifesto|Escrever as metaexplicações|Aprovar os textos,Manifesto e metaexplicações estiverem aprovados pelo titular.,Arquivo do Manifesto atualizado no repositório.,manifesto|home|texto,TSK-0008,,Titular,Alta,22/10/2026,"2,0 horas",Não iniciada,FACT-01
TSK-0008,CLU-02,Site riscocognitivo.org,Construir a home premium de conversão com o Manifesto e as principais funcionalidades,construir,Abrir o kit de interface do site no design system e copiar a seção de apresentação.,"Home publicada em ambiente de teste com apresentação, Manifesto, funcionalidades, CTAs e newsletter.",Cobre a home; não cobre as páginas de catálogo.,"Os 6 componentes da rota início (apresentação, metodologia, conteúdos, ferramentas, CTA do app, newsletter) visíveis no celular e no computador.","Estimativa de 6,0h dentro da janela 17/10/2026 a 04/11/2026, cuja capacidade de execução é 84,5h.",É a página de entrada e de conversão do lançamento.,De 22/10/2026 até 26/10/2026.,"<tarefa id=""TSK-0008"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Site riscocognitivo.org. O site riscocognitivo.org é o ponto de chegada de todo o conteúdo e de todas as ofertas do lançamento.</contexto>
  <objetivo>Home publicada em ambiente de teste com apresentação, Manifesto, funcionalidades, CTAs e newsletter.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0007 (Revisar o Manifesto e escrever as metaexplicações da home). O CTA do Executar App não leva a destino inventado: fica como 'em breve' até 05/01. Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre a home; não cobre as páginas de catálogo.</restricoes>
  <passos>
    Montar as seções da home.
    Inserir Manifesto e CTAs.
    Testar no celular.
  </passos>
  <criterio_de_conclusao>A home abrir no ambiente de teste com as 6 seções e os CTAs funcionando.</criterio_de_conclusao>
  <formato_de_saida>Link do ambiente de teste e prints celular/computador. Prazo: 26/10/2026. Tempo previsto: 6,0h.</formato_de_saida>
  <evidencia_esperada>Link do ambiente de teste e prints celular/computador.</evidencia_esperada>
</tarefa>",Montar as seções da home|Inserir Manifesto e CTAs|Testar no celular,A home abrir no ambiente de teste com as 6 seções e os CTAs funcionando.,Link do ambiente de teste e prints celular/computador.,home|site|conversao,TSK-0010,TSK-0007,Titular,Alta,26/10/2026,"6,0 horas",Não iniciada,FACT-02
TSK-0009,CLU-03,Conteúdo do blog,"Escrever o artigo fundador (Peça 01): neurodivergência, demandas cognitivas e soluções",escrever,Abrir o mapa de evidências e escrever o gancho de abertura com um dado.,"Artigo fundador de 1.800 a 2.400 palavras, com evidências, exemplos, tutorial e CTA para ferramenta.",Cobre o artigo fundador; os quatro pilares são tarefas separadas.,"Texto entre 1.800 e 2.400 palavras, 11 blocos, pelo menos 2 evidências citadas e 1 CTA.","Estimativa de 6,0h dentro da janela 17/10/2026 a 04/11/2026, cuja capacidade de execução é 84,5h.",É a peça-mãe do lançamento e do ciclo de 30 dias.,De 21/10/2026 até 24/10/2026.,"<tarefa id=""TSK-0009"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Conteúdo do blog. Os artigos são as peças-mãe que geram os derivados multiplataforma e levam às ferramentas.</contexto>
  <objetivo>Artigo fundador de 1.800 a 2.400 palavras, com evidências, exemplos, tutorial e CTA para ferramenta.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0006 (Pesquisar evidências citáveis para o artigo fundador e os quatro artigos pilares). Tom jornalístico, sem tom de coach, sem promessa de cura ou diagnóstico. Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre o artigo fundador; os quatro pilares são tarefas separadas.</restricoes>
  <passos>
    Estruturar os 11 blocos.
    Redigir com evidências e exemplos.
    Inserir o CTA da ferramenta.
  </passos>
  <criterio_de_conclusao>O artigo tiver entre 1.800 e 2.400 palavras, 2 evidências citadas e 1 CTA.</criterio_de_conclusao>
  <formato_de_saida>Arquivo do artigo no CMS em rascunho. Prazo: 24/10/2026. Tempo previsto: 6,0h.</formato_de_saida>
  <evidencia_esperada>Arquivo do artigo no CMS em rascunho.</evidencia_esperada>
</tarefa>",Estruturar os 11 blocos|Redigir com evidências e exemplos|Inserir o CTA da ferramenta,"O artigo tiver entre 1.800 e 2.400 palavras, 2 evidências citadas e 1 CTA.",Arquivo do artigo no CMS em rascunho.,artigo-fundador|blog|peca-01,TSK-0024,TSK-0006,Titular,Alta,24/10/2026,"6,0 horas",Não iniciada,FACT-01
TSK-0010,CLU-02,Site riscocognitivo.org,Adaptar o catálogo do blog e a página de artigo com CTA para as ferramentas,adaptar,Abrir a rota /blog no ambiente de teste e listar o que falta em relação ao mapa de rotas.,"Catálogo /blog com busca, filtros e cards, e página /blog/[slug] com referências e CTA.",Cobre catálogo e página de artigo; comentários ficam desativados.,"Os 5 filtros (perfil, objetivo, formato, tecnologia, disponibilidade) funcionando e slug inexistente retornando 404.","Estimativa de 3,0h dentro da janela 17/10/2026 a 04/11/2026, cuja capacidade de execução é 84,5h.",Os artigos precisam levar o leitor às ferramentas e soluções.,De 23/10/2026 até 24/10/2026.,"<tarefa id=""TSK-0010"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Site riscocognitivo.org. O site riscocognitivo.org é o ponto de chegada de todo o conteúdo e de todas as ofertas do lançamento.</contexto>
  <objetivo>Catálogo /blog com busca, filtros e cards, e página /blog/[slug] com referências e CTA.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0005 (Definir as rotas que entram no lançamento a partir do mapa de rotas do EXECUTAR). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre catálogo e página de artigo; comentários ficam desativados.</restricoes>
  <passos>
    Ajustar busca e filtros do catálogo.
    Ajustar a página do artigo com CTA.
    Testar o 404.
  </passos>
  <criterio_de_conclusao>Filtros funcionarem e o slug inexistente retornar 404.</criterio_de_conclusao>
  <formato_de_saida>Prints e lista de testes. Prazo: 24/10/2026. Tempo previsto: 3,0h.</formato_de_saida>
  <evidencia_esperada>Prints e lista de testes.</evidencia_esperada>
</tarefa>",Ajustar busca e filtros do catálogo|Ajustar a página do artigo com CTA|Testar o 404,Filtros funcionarem e o slug inexistente retornar 404.,Prints e lista de testes.,blog|site|catalogo,,TSK-0005,Titular,Alta,24/10/2026,"3,0 horas",Não iniciada,FACT-02
TSK-0011,CLU-02,Site riscocognitivo.org,Construir o mapa cognitivo simplificado com home e landing próprias,construir,"Desenhar no papel os quatro blocos do mapa: funções executivas, cognição, neurodivergência e matriz de riscos.","Mapa interativo simplificado em /mapa-cognitivo com legenda, busca e detalhes.",Cobre o mapa simplificado; mapas adicionais ficam para depois.,"Os 4 blocos navegáveis, com legenda e detalhe por item.","Estimativa de 6,0h dentro da janela 17/10/2026 a 04/11/2026, cuja capacidade de execução é 84,5h.",O mapa é uma porta de entrada própria do ecossistema.,De 26/10/2026 até 29/10/2026.,"<tarefa id=""TSK-0011"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Site riscocognitivo.org. O site riscocognitivo.org é o ponto de chegada de todo o conteúdo e de todas as ofertas do lançamento.</contexto>
  <objetivo>Mapa interativo simplificado em /mapa-cognitivo com legenda, busca e detalhes.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0005 (Definir as rotas que entram no lançamento a partir do mapa de rotas do EXECUTAR). Conteúdo educativo com fontes; não apresentar classificação como diagnóstico. Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre o mapa simplificado; mapas adicionais ficam para depois.</restricoes>
  <passos>
    Definir os itens de cada bloco.
    Montar o mapa interativo.
    Publicar a landing do mapa.
  </passos>
  <criterio_de_conclusao>Os 4 blocos estiverem navegáveis com legenda e detalhe.</criterio_de_conclusao>
  <formato_de_saida>Link do mapa no ambiente de teste. Prazo: 29/10/2026. Tempo previsto: 6,0h.</formato_de_saida>
  <evidencia_esperada>Link do mapa no ambiente de teste.</evidencia_esperada>
</tarefa>",Definir os itens de cada bloco|Montar o mapa interativo|Publicar a landing do mapa,Os 4 blocos estiverem navegáveis com legenda e detalhe.,Link do mapa no ambiente de teste.,mapa|site|funcoes-executivas,,TSK-0005,Titular,Alta,29/10/2026,"6,0 horas",Não iniciada,FACT-01
TSK-0012,CLU-04,Apps e ferramentas,Empacotar o Prisma standalone para acesso público,empacotar,Abrir a versão atual do Prisma e anotar o que impede o uso por um visitante sem login.,"Prisma standalone acessível por link público, com instruções de uso.",Cobre só o Prisma; os demais apps são tarefas separadas.,Um visitante sem conta consegue abrir e usar o Prisma pelo link.,"Estimativa de 3,0h dentro da janela 17/10/2026 a 04/11/2026, cuja capacidade de execução é 84,5h.",É o app principal do vídeo comercial e da loja.,De 23/10/2026 até 27/10/2026.,"<tarefa id=""TSK-0012"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Apps e ferramentas. Apps e ferramentas são a prova prática do método e o destino dos CTAs dos artigos.</contexto>
  <objetivo>Prisma standalone acessível por link público, com instruções de uso.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0003 (Inventariar os ativos já existentes do ecossistema com o status real de cada um). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre só o Prisma; os demais apps são tarefas separadas.</restricoes>
  <passos>
    Remover bloqueios de acesso público.
    Escrever as instruções de uso.
    Testar com um usuário de fora.
  </passos>
  <criterio_de_conclusao>Um teste de uso por pessoa de fora for concluído sem ajuda.</criterio_de_conclusao>
  <formato_de_saida>Link público e nota do teste. Prazo: 27/10/2026. Tempo previsto: 3,0h.</formato_de_saida>
  <evidencia_esperada>Link público e nota do teste.</evidencia_esperada>
  <lacunas_conhecidas>Status real do Prisma. Não preencher com valor inventado.</lacunas_conhecidas>
</tarefa>",Remover bloqueios de acesso público|Escrever as instruções de uso|Testar com um usuário de fora,Um teste de uso por pessoa de fora for concluído sem ajuda.,Link público e nota do teste.,prisma|app|lancamento,TSK-0013,TSK-0003,Titular,Alta,27/10/2026,"3,0 horas",Não iniciada,FACT-01
TSK-0013,CLU-04,Apps e ferramentas,Publicar o catálogo de apps com o Prisma e a página de cada app disponível,publicar,Abrir a rota /apps no ambiente de teste.,Catálogo /apps com cards dos apps disponíveis e página do Executar App marcada como 'em breve'.,Cobre o catálogo; o Executar App só é ativado em 05/01.,Cards de todos os apps prontos + filtros funcionando.,"Estimativa de 3,0h dentro da janela 17/10/2026 a 04/11/2026, cuja capacidade de execução é 84,5h.",Os apps são o destino dos CTAs dos artigos.,De 27/10/2026 até 28/10/2026.,"<tarefa id=""TSK-0013"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Apps e ferramentas. Apps e ferramentas são a prova prática do método e o destino dos CTAs dos artigos.</contexto>
  <objetivo>Catálogo /apps com cards dos apps disponíveis e página do Executar App marcada como 'em breve'.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0012 (Empacotar o Prisma standalone para acesso público). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre o catálogo; o Executar App só é ativado em 05/01.</restricoes>
  <passos>
    Cadastrar os apps prontos no CMS.
    Marcar o Executar App como em breve.
    Testar filtros.
  </passos>
  <criterio_de_conclusao>Todos os apps prontos aparecerem no catálogo com página própria.</criterio_de_conclusao>
  <formato_de_saida>Print do catálogo. Prazo: 28/10/2026. Tempo previsto: 3,0h.</formato_de_saida>
  <evidencia_esperada>Print do catálogo.</evidencia_esperada>
</tarefa>",Cadastrar os apps prontos no CMS|Marcar o Executar App como em breve|Testar filtros,Todos os apps prontos aparecerem no catálogo com página própria.,Print do catálogo.,apps|catalogo|site,,TSK-0012,Titular,Alta,28/10/2026,"3,0 horas",Não iniciada,FACT-02
TSK-0014,CLU-04,Apps e ferramentas,"Criar o primeiro template da família por déficit executivo para TDAH, dislexia e autismo",criar,Listar os três déficits executivos mais citados no mapa de evidências.,"Um template por perfil (TDAH, dislexia, autismo) pronto para download.",Cobre o primeiro template de cada perfil; o restante da família vem depois.,3 templates exportados e testados.,"Estimativa de 5,0h dentro da janela 17/10/2026 a 04/11/2026, cuja capacidade de execução é 84,5h.",Ferramentas gratuitas são o CTA natural dos artigos.,De 26/10/2026 até 29/10/2026.,"<tarefa id=""TSK-0014"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Apps e ferramentas. Apps e ferramentas são a prova prática do método e o destino dos CTAs dos artigos.</contexto>
  <objetivo>Um template por perfil (TDAH, dislexia, autismo) pronto para download.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre o primeiro template de cada perfil; o restante da família vem depois.</restricoes>
  <passos>
    Escolher o déficit de cada template.
    Montar os três templates.
    Exportar para download.
  </passos>
  <criterio_de_conclusao>Os 3 templates estiverem exportados e abertos sem erro.</criterio_de_conclusao>
  <formato_de_saida>Arquivos dos 3 templates. Prazo: 29/10/2026. Tempo previsto: 5,0h.</formato_de_saida>
  <evidencia_esperada>Arquivos dos 3 templates.</evidencia_esperada>
</tarefa>",Escolher o déficit de cada template|Montar os três templates|Exportar para download,Os 3 templates estiverem exportados e abertos sem erro.,Arquivos dos 3 templates.,templates|ferramentas|neurodivergencia,TSK-0015,,Titular,Alta,29/10/2026,"5,0 horas",Não iniciada,FACT-01
TSK-0015,CLU-04,Apps e ferramentas,Publicar o catálogo de ferramentas com filtros e download dos templates,publicar,Abrir a rota /ferramentas no ambiente de teste.,"Catálogo /ferramentas com filtros por perfil, objetivo, tecnologia e disponibilidade, e download dos templates.",Cobre o catálogo e os downloads gratuitos.,Os filtros funcionam e os 3 templates baixam.,"Estimativa de 4,0h dentro da janela 17/10/2026 a 04/11/2026, cuja capacidade de execução é 84,5h.",Fecha o caminho artigo → ferramenta.,De 28/10/2026 até 30/10/2026.,"<tarefa id=""TSK-0015"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Apps e ferramentas. Apps e ferramentas são a prova prática do método e o destino dos CTAs dos artigos.</contexto>
  <objetivo>Catálogo /ferramentas com filtros por perfil, objetivo, tecnologia e disponibilidade, e download dos templates.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0014 (Criar o primeiro template da família por déficit executivo para TDAH, dislexia e autismo). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre o catálogo e os downloads gratuitos.</restricoes>
  <passos>
    Cadastrar os templates no CMS.
    Configurar os filtros.
    Testar os downloads.
  </passos>
  <criterio_de_conclusao>Os 3 downloads funcionarem a partir do catálogo.</criterio_de_conclusao>
  <formato_de_saida>Prints do catálogo e dos downloads. Prazo: 30/10/2026. Tempo previsto: 4,0h.</formato_de_saida>
  <evidencia_esperada>Prints do catálogo e dos downloads.</evidencia_esperada>
</tarefa>",Cadastrar os templates no CMS|Configurar os filtros|Testar os downloads,Os 3 downloads funcionarem a partir do catálogo.,Prints do catálogo e dos downloads.,ferramentas|catalogo|site,,TSK-0014,Titular,Alta,30/10/2026,"4,0 horas",Não iniciada,FACT-02
TSK-0016,CLU-05,E-books,Escrever o e-book 1: Operações e Neurodivergência,escrever,Abrir o artigo fundador e listar os tópicos que o e-book vai aprofundar.,"E-book 1 diagramado em PDF, ligado ao CTA do artigo fundador.",Cobre o e-book 1; os outros três são tarefas separadas.,"PDF exportado com sumário, fontes e CTA.","Estimativa de 6,0h dentro da janela 17/10/2026 a 04/11/2026, cuja capacidade de execução é 84,5h.",Aprofunda o tema da peça-mãe e captura contatos.,De 26/10/2026 até 31/10/2026.,"<tarefa id=""TSK-0016"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: E-books. Os e-books aprofundam os temas e capturam contatos para a newsletter.</contexto>
  <objetivo>E-book 1 diagramado em PDF, ligado ao CTA do artigo fundador.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0009 (Escrever o artigo fundador (Peça 01): neurodivergência, demandas cognitivas e soluções). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre o e-book 1; os outros três são tarefas separadas.</restricoes>
  <passos>
    Montar o sumário.
    Redigir e revisar.
    Diagramar e exportar o PDF.
  </passos>
  <criterio_de_conclusao>O PDF estiver exportado e revisado.</criterio_de_conclusao>
  <formato_de_saida>Arquivo PDF. Prazo: 31/10/2026. Tempo previsto: 6,0h.</formato_de_saida>
  <evidencia_esperada>Arquivo PDF.</evidencia_esperada>
</tarefa>",Montar o sumário|Redigir e revisar|Diagramar e exportar o PDF,O PDF estiver exportado e revisado.,Arquivo PDF.,ebook|operacoes|neurodivergencia,,TSK-0009,Titular,Alta,31/10/2026,"6,0 horas",Não iniciada,FACT-01
TSK-0017,CLU-07,Loja e afiliados,Definir o checkout e os links de afiliado reais da loja,definir,"Listar os 6 produtos da loja e anotar, ao lado de cada um, onde ele é vendido hoje.",Destino real de compra (checkout próprio ou link de afiliado) definido para cada produto.,Cobre a definição dos destinos; não constrói a vitrine.,6 produtos com destino de compra real ou marcados como 'a definir'.,"Estimativa de 1,0h dentro da janela 17/10/2026 a 04/11/2026, cuja capacidade de execução é 84,5h.",A rota de produto exige destino real; integração de pagamento não pode ser inventada.,De 20/10/2026 até 23/10/2026.,"<tarefa id=""TSK-0017"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Loja e afiliados. A loja transforma interesse em receita com produtos próprios e de afiliados.</contexto>
  <objetivo>Destino real de compra (checkout próprio ou link de afiliado) definido para cada produto.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre a definição dos destinos; não constrói a vitrine.</restricoes>
  <passos>
    Listar os produtos.
    Definir o destino real de cada um.
    Registrar preços conhecidos.
  </passos>
  <criterio_de_conclusao>Cada produto tiver destino real ou marcação 'a definir'.</criterio_de_conclusao>
  <formato_de_saida>Tabela de produtos com destinos. Prazo: 23/10/2026. Tempo previsto: 1,0h.</formato_de_saida>
  <evidencia_esperada>Tabela de produtos com destinos.</evidencia_esperada>
  <lacunas_conhecidas>Plataforma de checkout, preços e links de afiliado. Não preencher com valor inventado.</lacunas_conhecidas>
</tarefa>",Listar os produtos|Definir o destino real de cada um|Registrar preços conhecidos,Cada produto tiver destino real ou marcação 'a definir'.,Tabela de produtos com destinos.,loja|afiliados|checkout,,,Titular,Alta,23/10/2026,"1,0 horas",Não iniciada,FACT-02
TSK-0018,CLU-02,Site riscocognitivo.org,"Configurar o CMS para conteúdos, recursos, produtos e agendamento",configurar,Entrar no CMS do site e abrir a área de administração de conteúdos.,"CMS com coleções de conteúdos, recursos, produtos e calendário prontos para o lançamento.",Cobre a configuração; a automação completa do CMS fica para depois.,As 4 coleções criadas e um item de teste em cada.,"Estimativa de 3,0h dentro da janela 17/10/2026 a 04/11/2026, cuja capacidade de execução é 84,5h.",O CMS é onde o pacote é desmembrado para as plataformas.,De 21/10/2026 até 23/10/2026.,"<tarefa id=""TSK-0018"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Site riscocognitivo.org. O site riscocognitivo.org é o ponto de chegada de todo o conteúdo e de todas as ofertas do lançamento.</contexto>
  <objetivo>CMS com coleções de conteúdos, recursos, produtos e calendário prontos para o lançamento.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre a configuração; a automação completa do CMS fica para depois.</restricoes>
  <passos>
    Criar as coleções.
    Cadastrar um item de teste em cada.
    Verificar as permissões de administrador.
  </passos>
  <criterio_de_conclusao>As 4 coleções tiverem item de teste e acesso restrito ao administrador.</criterio_de_conclusao>
  <formato_de_saida>Prints do CMS. Prazo: 23/10/2026. Tempo previsto: 3,0h.</formato_de_saida>
  <evidencia_esperada>Prints do CMS.</evidencia_esperada>
</tarefa>",Criar as coleções|Cadastrar um item de teste em cada|Verificar as permissões de administrador,As 4 coleções tiverem item de teste e acesso restrito ao administrador.,Prints do CMS.,cms|site|admin,,,Titular,Alta,23/10/2026,"3,0 horas",Não iniciada,FACT-05
TSK-0019,CLU-07,Loja e afiliados,Montar a vitrine da loja com os produtos e os links de afiliado reais,montar,Abrir a rota /loja no ambiente de teste.,"Vitrine /loja com Prisma, Timer 45, Sprint book, Rainbow book, infográfico 3D neuro e livros Barkley, com links de afiliado identificados.",Cobre a vitrine mínima; o marketplace completo fica para depois.,"6 produtos visíveis, cada um com destino real ou 'em breve'.","Estimativa de 2,0h dentro da janela 17/10/2026 a 04/11/2026, cuja capacidade de execução é 84,5h.",Gera a primeira receita do ecossistema.,De 29/10/2026 até 30/10/2026.,"<tarefa id=""TSK-0019"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Loja e afiliados. A loja transforma interesse em receita com produtos próprios e de afiliados.</contexto>
  <objetivo>Vitrine /loja com Prisma, Timer 45, Sprint book, Rainbow book, infográfico 3D neuro e livros Barkley, com links de afiliado identificados.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0017 (Definir o checkout e os links de afiliado reais da loja). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre a vitrine mínima; o marketplace completo fica para depois.</restricoes>
  <passos>
    Cadastrar os produtos no CMS.
    Identificar os links de afiliado.
    Testar os destinos.
  </passos>
  <criterio_de_conclusao>Os 6 produtos estiverem visíveis com destino testado ou 'em breve'.</criterio_de_conclusao>
  <formato_de_saida>Print da vitrine. Prazo: 30/10/2026. Tempo previsto: 2,0h.</formato_de_saida>
  <evidencia_esperada>Print da vitrine.</evidencia_esperada>
  <lacunas_conhecidas>Destinos de compra. Não preencher com valor inventado.</lacunas_conhecidas>
</tarefa>",Cadastrar os produtos no CMS|Identificar os links de afiliado|Testar os destinos,Os 6 produtos estiverem visíveis com destino testado ou 'em breve'.,Print da vitrine.,loja|afiliados|site,,TSK-0017,Titular,Alta,30/10/2026,"2,0 horas",Não iniciada,FACT-01
TSK-0020,CLU-02,Site riscocognitivo.org,"Publicar as páginas institucionais, a newsletter e o contato",publicar,Abrir a rota /sobre no ambiente de teste.,"Páginas Sobre, Autor, Metodologia, Editorial, Newsletter e Contato publicadas.",Cobre as 6 páginas; Parceiros fica para depois.,6 páginas abrindo e formulário de newsletter gravando inscrição de teste.,"Estimativa de 2,0h dentro da janela 17/10/2026 a 04/11/2026, cuja capacidade de execução é 84,5h.",Dão credibilidade (E-E-A-T) e captam contatos.,De 29/10/2026 até 30/10/2026.,"<tarefa id=""TSK-0020"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Site riscocognitivo.org. O site riscocognitivo.org é o ponto de chegada de todo o conteúdo e de todas as ofertas do lançamento.</contexto>
  <objetivo>Páginas Sobre, Autor, Metodologia, Editorial, Newsletter e Contato publicadas.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre as 6 páginas; Parceiros fica para depois.</restricoes>
  <passos>
    Escrever os textos curtos.
    Publicar as 6 páginas.
    Testar a inscrição na newsletter.
  </passos>
  <criterio_de_conclusao>As 6 páginas abrirem e a inscrição de teste aparecer no CMS.</criterio_de_conclusao>
  <formato_de_saida>Prints e registro da inscrição de teste. Prazo: 30/10/2026. Tempo previsto: 2,0h.</formato_de_saida>
  <evidencia_esperada>Prints e registro da inscrição de teste.</evidencia_esperada>
</tarefa>",Escrever os textos curtos|Publicar as 6 páginas|Testar a inscrição na newsletter,As 6 páginas abrirem e a inscrição de teste aparecer no CMS.,Prints e registro da inscrição de teste.,institucional|newsletter|site,,,Titular,Alta,30/10/2026,"2,0 horas",Não iniciada,FACT-02
TSK-0021,CLU-06,Vídeos,Roteirizar e gravar o vídeo comercial de 5 minutos da landing com o Prisma,gravar,Abrir o Prisma e anotar as 3 telas que melhor mostram o produto.,"Vídeo de 5 minutos editado, com o Prisma e o SaaS em uso, pronto para a home.",Cobre o vídeo comercial; os outros dois vídeos são tarefas separadas.,Vídeo de até 5 minutos exportado e inserido na home.,"Estimativa de 4,0h dentro da janela 17/10/2026 a 04/11/2026, cuja capacidade de execução é 84,5h.",É a peça principal de conversão da landing.,De 27/10/2026 até 31/10/2026.,"<tarefa id=""TSK-0021"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Vídeos. Os vídeos apresentam o ecossistema e alimentam YouTube, Reels, TikTok e Shorts.</contexto>
  <objetivo>Vídeo de 5 minutos editado, com o Prisma e o SaaS em uso, pronto para a home.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0012 (Empacotar o Prisma standalone para acesso público). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre o vídeo comercial; os outros dois vídeos são tarefas separadas.</restricoes>
  <passos>
    Escrever o roteiro.
    Gravar as telas e a narração.
    Editar e exportar.
  </passos>
  <criterio_de_conclusao>O vídeo estiver exportado e tocando na home de teste.</criterio_de_conclusao>
  <formato_de_saida>Arquivo do vídeo e print da home. Prazo: 31/10/2026. Tempo previsto: 4,0h.</formato_de_saida>
  <evidencia_esperada>Arquivo do vídeo e print da home.</evidencia_esperada>
</tarefa>",Escrever o roteiro|Gravar as telas e a narração|Editar e exportar,O vídeo estiver exportado e tocando na home de teste.,Arquivo do vídeo e print da home.,video|comercial|prisma,,TSK-0012,Titular,Alta,31/10/2026,"4,0 horas",Não iniciada,FACT-01
TSK-0022,CLU-08,Distribuição multiplataforma,Desmembrar o pacote do lançamento em derivados por plataforma para o ciclo 1,desmembrar,Abrir o artigo fundador e marcar os trechos que viram posts.,"Banco de derivados do ciclo 1 (05/11 a 19/11): carrosséis, imagens, verticais, stories e 3 newsletters.",Cobre o ciclo 1; o ciclo 2 é tarefa separada.,Derivados do ciclo 1 com quantidade por plataforma registrada no CMS.,"Estimativa de 5,0h dentro da janela 17/10/2026 a 04/11/2026, cuja capacidade de execução é 84,5h.",Sustenta a primeira metade do ciclo de 30 dias.,De 29/10/2026 até 01/11/2026.,"<tarefa id=""TSK-0022"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Distribuição multiplataforma. A distribuição sustenta o ciclo de 30 dias (05/11 a 05/12) e gera os dados da campanha 02.</contexto>
  <objetivo>Banco de derivados do ciclo 1 (05/11 a 19/11): carrosséis, imagens, verticais, stories e 3 newsletters.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0009 (Escrever o artigo fundador (Peça 01): neurodivergência, demandas cognitivas e soluções). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre o ciclo 1; o ciclo 2 é tarefa separada.</restricoes>
  <passos>
    Marcar os trechos-fonte.
    Produzir os derivados por plataforma.
    Cadastrar no CMS.
  </passos>
  <criterio_de_conclusao>Todos os derivados do ciclo 1 estiverem no CMS com plataforma e data.</criterio_de_conclusao>
  <formato_de_saida>Lista do CMS com os derivados. Prazo: 01/11/2026. Tempo previsto: 5,0h.</formato_de_saida>
  <evidencia_esperada>Lista do CMS com os derivados.</evidencia_esperada>
  <lacunas_conhecidas>Lista final de plataformas e contas ativas. Não preencher com valor inventado.</lacunas_conhecidas>
</tarefa>",Marcar os trechos-fonte|Produzir os derivados por plataforma|Cadastrar no CMS,Todos os derivados do ciclo 1 estiverem no CMS com plataforma e data.,Lista do CMS com os derivados.,derivados|multiplataforma|cms|no-n16,TSK-0023,TSK-0009,Titular,Alta,01/11/2026,"5,0 horas",Não iniciada,FACT-03
TSK-0023,CLU-08,Distribuição multiplataforma,Agendar as publicações do ciclo 1 em todas as plataformas,agendar,Abrir a ferramenta de agendamento e conferir as contas conectadas.,Publicações de 05/11 a 19/11 agendadas em todas as plataformas ativas.,Cobre o ciclo 1; o ciclo 2 é agendado até 14/11.,100% dos derivados do ciclo 1 com data e hora agendadas.,"Estimativa de 3,0h dentro da janela 17/10/2026 a 04/11/2026, cuja capacidade de execução é 84,5h.",A instrução do titular é ter os agendamentos feitos até 01/11.,De 31/10/2026 até 01/11/2026.,"<tarefa id=""TSK-0023"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Distribuição multiplataforma. A distribuição sustenta o ciclo de 30 dias (05/11 a 05/12) e gera os dados da campanha 02.</contexto>
  <objetivo>Publicações de 05/11 a 19/11 agendadas em todas as plataformas ativas.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0022 (Desmembrar o pacote do lançamento em derivados por plataforma para o ciclo 1). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre o ciclo 1; o ciclo 2 é agendado até 14/11.</restricoes>
  <passos>
    Conferir as contas conectadas.
    Agendar cada derivado.
    Conferir o calendário final.
  </passos>
  <criterio_de_conclusao>Todos os derivados do ciclo 1 estiverem agendados.</criterio_de_conclusao>
  <formato_de_saida>Export ou print do calendário de agendamento. Prazo: 01/11/2026. Tempo previsto: 3,0h.</formato_de_saida>
  <evidencia_esperada>Export ou print do calendário de agendamento.</evidencia_esperada>
  <lacunas_conhecidas>Ferramenta de agendamento. Não preencher com valor inventado.</lacunas_conhecidas>
</tarefa>",Conferir as contas conectadas|Agendar cada derivado|Conferir o calendário final,Todos os derivados do ciclo 1 estiverem agendados.,Export ou print do calendário de agendamento.,agendamento|multiplataforma|no-n17,,TSK-0022,Titular,Alta,01/11/2026,"3,0 horas",Não iniciada,DEC-03
TSK-0024,CLU-03,Conteúdo do blog,"Revisar estilo, otimização para buscadores e CTAs do artigo fundador e do e-book 1",revisar,Abrir o checklist de estilo editorial e o artigo fundador lado a lado.,"Artigo e e-book revisados: estilo, perguntas e respostas diretas, fontes citadas e CTAs.",Cobre artigo fundador e e-book 1.,Checklist de estilo e de otimização 100% marcado.,"Estimativa de 2,0h dentro da janela 17/10/2026 a 04/11/2026, cuja capacidade de execução é 84,5h.",A citabilidade em buscadores de IA depende dessa revisão.,De 30/10/2026 até 31/10/2026.,"<tarefa id=""TSK-0024"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Conteúdo do blog. Os artigos são as peças-mãe que geram os derivados multiplataforma e levam às ferramentas.</contexto>
  <objetivo>Artigo e e-book revisados: estilo, perguntas e respostas diretas, fontes citadas e CTAs.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0009 (Escrever o artigo fundador (Peça 01): neurodivergência, demandas cognitivas e soluções). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre artigo fundador e e-book 1.</restricoes>
  <passos>
    Aplicar o checklist de estilo.
    Aplicar o checklist de otimização.
    Conferir os CTAs.
  </passos>
  <criterio_de_conclusao>Os dois checklists estiverem 100% marcados.</criterio_de_conclusao>
  <formato_de_saida>Checklists preenchidos. Prazo: 31/10/2026. Tempo previsto: 2,0h.</formato_de_saida>
  <evidencia_esperada>Checklists preenchidos.</evidencia_esperada>
</tarefa>",Aplicar o checklist de estilo|Aplicar o checklist de otimização|Conferir os CTAs,Os dois checklists estiverem 100% marcados.,Checklists preenchidos.,revisao|geo|blog,,TSK-0009,Titular,Alta,31/10/2026,"2,0 horas",Não iniciada,FACT-03
TSK-0025,CLU-08,Distribuição multiplataforma,"Configurar a medição do site, dos links e da newsletter",configurar,Abrir o painel de Analytics da Cloudflare do site.,"Medição ativa: visitas por página, cliques em CTA, downloads, cliques de afiliado e inscrições.",Cobre a configuração; a leitura dos dados é outra tarefa.,5 métricas aparecendo com dado de teste.,"Estimativa de 2,0h dentro da janela 17/10/2026 a 04/11/2026, cuja capacidade de execução é 84,5h.",A campanha 02 será planejada a partir desses dados.,Em 03/11/2026.,"<tarefa id=""TSK-0025"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Distribuição multiplataforma. A distribuição sustenta o ciclo de 30 dias (05/11 a 05/12) e gera os dados da campanha 02.</contexto>
  <objetivo>Medição ativa: visitas por página, cliques em CTA, downloads, cliques de afiliado e inscrições.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre a configuração; a leitura dos dados é outra tarefa.</restricoes>
  <passos>
    Ativar o analytics do site.
    Padronizar parâmetros nos links.
    Testar cada métrica.
  </passos>
  <criterio_de_conclusao>As 5 métricas registrarem um evento de teste.</criterio_de_conclusao>
  <formato_de_saida>Prints do painel. Prazo: 03/11/2026. Tempo previsto: 2,0h.</formato_de_saida>
  <evidencia_esperada>Prints do painel.</evidencia_esperada>
</tarefa>",Ativar o analytics do site|Padronizar parâmetros nos links|Testar cada métrica,As 5 métricas registrarem um evento de teste.,Prints do painel.,metricas|analytics|utm|no-n19,,,Titular,Alta,03/11/2026,"2,0 horas",Não iniciada,FACT-05
TSK-0026,CLU-02,Site riscocognitivo.org,Testar o site completo antes do lançamento,testar,Abrir o site de teste no celular e seguir a lista de rotas do lançamento.,"Lista de testes concluída: links, celular, páginas 404, formulários, metadados e velocidade.",Cobre as rotas do lançamento.,"Todas as rotas do lançamento testadas, sem erro crítico aberto.","Estimativa de 3,0h dentro da janela 17/10/2026 a 04/11/2026, cuja capacidade de execução é 84,5h.",Reduz o risco de falha pública em 05/11.,De 03/11/2026 até 04/11/2026.,"<tarefa id=""TSK-0026"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Site riscocognitivo.org. O site riscocognitivo.org é o ponto de chegada de todo o conteúdo e de todas as ofertas do lançamento.</contexto>
  <objetivo>Lista de testes concluída: links, celular, páginas 404, formulários, metadados e velocidade.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0008 (Construir a home premium de conversão com o Manifesto e as principais funcionalidades). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre as rotas do lançamento.</restricoes>
  <passos>
    Testar todas as rotas.
    Corrigir os erros críticos.
    Registrar o resultado.
  </passos>
  <criterio_de_conclusao>Não houver erro crítico aberto.</criterio_de_conclusao>
  <formato_de_saida>Lista de testes preenchida. Prazo: 04/11/2026. Tempo previsto: 3,0h.</formato_de_saida>
  <evidencia_esperada>Lista de testes preenchida.</evidencia_esperada>
</tarefa>",Testar todas as rotas|Corrigir os erros críticos|Registrar o resultado,Não houver erro crítico aberto.,Lista de testes preenchida.,testes|site|qualidade,,TSK-0008,Titular,Alta,04/11/2026,"3,0 horas",Não iniciada,FACT-02
TSK-0027,CLU-01,Planejamento e controle,Decidir a liberação do lançamento de 05/11,decidir,Abrir a lista de testes do site e o calendário de agendamento.,Decisão registrada: lançar em 05/11 ou adiar itens específicos.,Cobre só a decisão.,Decisão escrita com os itens liberados e os adiados.,"Estimativa de 0,5h dentro da janela 17/10/2026 a 04/11/2026, cuja capacidade de execução é 84,5h.",Ponto de decisão antes da publicação pública.,Em 04/11/2026.,"<tarefa id=""TSK-0027"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Planejamento e controle. Mantém o plano rastreável, com escopo e capacidade confirmados antes da execução.</contexto>
  <objetivo>Decisão registrada: lançar em 05/11 ou adiar itens específicos.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0026 (Testar o site completo antes do lançamento). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre só a decisão.</restricoes>
  <passos>
    Conferir os testes e os agendamentos.
    Decidir item a item.
    Registrar a decisão.
  </passos>
  <criterio_de_conclusao>A decisão estiver registrada.</criterio_de_conclusao>
  <formato_de_saida>Nota de decisão datada. Prazo: 04/11/2026. Tempo previsto: 0,5h.</formato_de_saida>
  <evidencia_esperada>Nota de decisão datada.</evidencia_esperada>
</tarefa>",Conferir os testes e os agendamentos|Decidir item a item|Registrar a decisão,A decisão estiver registrada.,Nota de decisão datada.,decisao|lancamento,,TSK-0026,Titular,Alta,04/11/2026,"0,5 horas",Não iniciada,DEC-03
TSK-0028,CLU-02,Site riscocognitivo.org,Publicar o riscocognitivo.org e acompanhar o dia do lançamento,publicar,Abrir o painel da Cloudflare e conferir a versão que vai para produção.,Site público em riscocognitivo.org e primeiras publicações no ar.,Cobre a publicação e o acompanhamento do dia 05/11.,Site público + primeiras publicações conferidas no ar.,"Estimativa de 3,0h dentro da janela 05/11/2026 a 14/11/2026, cuja capacidade de execução é 50,1h.",É o marco do lançamento.,Em 05/11/2026.,"<tarefa id=""TSK-0028"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Site riscocognitivo.org. O site riscocognitivo.org é o ponto de chegada de todo o conteúdo e de todas as ofertas do lançamento.</contexto>
  <objetivo>Site público em riscocognitivo.org e primeiras publicações no ar.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0027 (Decidir a liberação do lançamento de 05/11). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre a publicação e o acompanhamento do dia 05/11.</restricoes>
  <passos>
    Publicar a versão aprovada.
    Conferir as publicações do dia.
    Registrar problemas do dia.
  </passos>
  <criterio_de_conclusao>O site estiver público e as publicações do dia estiverem conferidas.</criterio_de_conclusao>
  <formato_de_saida>Prints do site e das publicações. Prazo: 05/11/2026. Tempo previsto: 3,0h.</formato_de_saida>
  <evidencia_esperada>Prints do site e das publicações.</evidencia_esperada>
</tarefa>",Publicar a versão aprovada|Conferir as publicações do dia|Registrar problemas do dia,O site estiver público e as publicações do dia estiverem conferidas.,Prints do site e das publicações.,lancamento|site|publicacao,,TSK-0027,Titular,Alta,05/11/2026,"3,0 horas",Não iniciada,DEC-03
TSK-0029,CLU-03,Conteúdo do blog,"Escrever o artigo pilar sobre gestão de riscos, projetos e processos neuroadaptados",escrever,Abrir o mapa de evidências na seção deste pilar.,Artigo pilar publicado com CTA para a ferramenta relacionada.,Cobre o pilar 1.,Artigo publicado com 2 evidências e 1 CTA.,"Estimativa de 4,0h dentro da janela 05/11/2026 a 14/11/2026, cuja capacidade de execução é 50,1h.",Conteúdo novo para o ciclo de 30 dias.,De 05/11/2026 até 07/11/2026.,"<tarefa id=""TSK-0029"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Conteúdo do blog. Os artigos são as peças-mãe que geram os derivados multiplataforma e levam às ferramentas.</contexto>
  <objetivo>Artigo pilar publicado com CTA para a ferramenta relacionada.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0006 (Pesquisar evidências citáveis para o artigo fundador e os quatro artigos pilares). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre o pilar 1.</restricoes>
  <passos>
    Estruturar os blocos.
    Redigir com evidências.
    Publicar com CTA.
  </passos>
  <criterio_de_conclusao>O artigo estiver publicado com 2 evidências e 1 CTA.</criterio_de_conclusao>
  <formato_de_saida>Link do artigo. Prazo: 07/11/2026. Tempo previsto: 4,0h.</formato_de_saida>
  <evidencia_esperada>Link do artigo.</evidencia_esperada>
</tarefa>",Estruturar os blocos|Redigir com evidências|Publicar com CTA,O artigo estiver publicado com 2 evidências e 1 CTA.,Link do artigo.,artigo-pilar|riscos|blog,,TSK-0006,Titular,Média,07/11/2026,"4,0 horas",Não iniciada,FACT-01
TSK-0030,CLU-03,Conteúdo do blog,Escrever o artigo pilar sobre funções executivas,escrever,Abrir o mapa de evidências na seção de funções executivas.,Artigo pilar publicado com CTA para os templates.,Cobre o pilar 2.,Artigo publicado com 2 evidências e 1 CTA.,"Estimativa de 4,0h dentro da janela 05/11/2026 a 14/11/2026, cuja capacidade de execução é 50,1h.",Conteúdo novo para o ciclo de 30 dias.,De 09/11/2026 até 11/11/2026.,"<tarefa id=""TSK-0030"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Conteúdo do blog. Os artigos são as peças-mãe que geram os derivados multiplataforma e levam às ferramentas.</contexto>
  <objetivo>Artigo pilar publicado com CTA para os templates.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0006 (Pesquisar evidências citáveis para o artigo fundador e os quatro artigos pilares). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre o pilar 2.</restricoes>
  <passos>
    Estruturar os blocos.
    Redigir com evidências.
    Publicar com CTA.
  </passos>
  <criterio_de_conclusao>O artigo estiver publicado com 2 evidências e 1 CTA.</criterio_de_conclusao>
  <formato_de_saida>Link do artigo. Prazo: 11/11/2026. Tempo previsto: 4,0h.</formato_de_saida>
  <evidencia_esperada>Link do artigo.</evidencia_esperada>
</tarefa>",Estruturar os blocos|Redigir com evidências|Publicar com CTA,O artigo estiver publicado com 2 evidências e 1 CTA.,Link do artigo.,artigo-pilar|funcoes-executivas|blog,,TSK-0006,Titular,Média,11/11/2026,"4,0 horas",Não iniciada,FACT-01
TSK-0031,CLU-04,Apps e ferramentas,Criar a ferramenta de metacognição,criar,Escrever as 5 perguntas de autoavaliação que a ferramenta vai fazer.,Ferramenta de metacognição publicada no catálogo de ferramentas.,Cobre uma ferramenta.,Ferramenta publicada e testada por 1 pessoa.,"Estimativa de 3,0h dentro da janela 05/11/2026 a 14/11/2026, cuja capacidade de execução é 50,1h.",Completa a família de ferramentas prometida no lançamento.,De 06/11/2026 até 10/11/2026.,"<tarefa id=""TSK-0031"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Apps e ferramentas. Apps e ferramentas são a prova prática do método e o destino dos CTAs dos artigos.</contexto>
  <objetivo>Ferramenta de metacognição publicada no catálogo de ferramentas.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Ferramenta de autoconhecimento, sem diagnóstico. Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre uma ferramenta.</restricoes>
  <passos>
    Definir as perguntas.
    Montar a ferramenta.
    Publicar no catálogo.
  </passos>
  <criterio_de_conclusao>A ferramenta estiver publicada e testada.</criterio_de_conclusao>
  <formato_de_saida>Link da ferramenta. Prazo: 10/11/2026. Tempo previsto: 3,0h.</formato_de_saida>
  <evidencia_esperada>Link da ferramenta.</evidencia_esperada>
</tarefa>",Definir as perguntas|Montar a ferramenta|Publicar no catálogo,A ferramenta estiver publicada e testada.,Link da ferramenta.,metacognicao|ferramentas,,,Titular,Média,10/11/2026,"3,0 horas",Não iniciada,FACT-01
TSK-0032,CLU-04,Apps e ferramentas,Completar a família de templates por déficit executivo,completar,Abrir os 3 templates já publicados e listar os déficits ainda sem template.,Família de templates completa publicada no catálogo.,Cobre os templates restantes da família.,Todos os déficits listados com template publicado.,"Estimativa de 4,0h dentro da janela 05/11/2026 a 14/11/2026, cuja capacidade de execução é 50,1h.",Cumpre o item 'família de templates' do pacote.,De 09/11/2026 até 13/11/2026.,"<tarefa id=""TSK-0032"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Apps e ferramentas. Apps e ferramentas são a prova prática do método e o destino dos CTAs dos artigos.</contexto>
  <objetivo>Família de templates completa publicada no catálogo.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0014 (Criar o primeiro template da família por déficit executivo para TDAH, dislexia e autismo). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre os templates restantes da família.</restricoes>
  <passos>
    Listar os déficits restantes.
    Criar os templates.
    Publicar no catálogo.
  </passos>
  <criterio_de_conclusao>Todos os déficits listados tiverem template publicado.</criterio_de_conclusao>
  <formato_de_saida>Prints do catálogo. Prazo: 13/11/2026. Tempo previsto: 4,0h.</formato_de_saida>
  <evidencia_esperada>Prints do catálogo.</evidencia_esperada>
</tarefa>",Listar os déficits restantes|Criar os templates|Publicar no catálogo,Todos os déficits listados tiverem template publicado.,Prints do catálogo.,templates|ferramentas,,TSK-0014,Titular,Média,13/11/2026,"4,0 horas",Não iniciada,FACT-01
TSK-0033,CLU-06,Vídeos,Gravar o vídeo da Peça 01 para o YouTube,gravar,Abrir o artigo fundador e marcar os 5 pontos do roteiro.,Vídeo de 5 minutos da Peça 01 publicado no YouTube.,Cobre o vídeo da Peça 01.,Vídeo publicado com link para o artigo.,"Estimativa de 4,0h dentro da janela 05/11/2026 a 14/11/2026, cuja capacidade de execução é 50,1h.",Leva o artigo fundador ao YouTube e gera cortes verticais.,De 06/11/2026 até 10/11/2026.,"<tarefa id=""TSK-0033"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Vídeos. Os vídeos apresentam o ecossistema e alimentam YouTube, Reels, TikTok e Shorts.</contexto>
  <objetivo>Vídeo de 5 minutos da Peça 01 publicado no YouTube.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0009 (Escrever o artigo fundador (Peça 01): neurodivergência, demandas cognitivas e soluções). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre o vídeo da Peça 01.</restricoes>
  <passos>
    Roteirizar.
    Gravar e editar.
    Publicar com link para o artigo.
  </passos>
  <criterio_de_conclusao>O vídeo estiver publicado com link para o artigo.</criterio_de_conclusao>
  <formato_de_saida>Link do vídeo. Prazo: 10/11/2026. Tempo previsto: 4,0h.</formato_de_saida>
  <evidencia_esperada>Link do vídeo.</evidencia_esperada>
</tarefa>",Roteirizar|Gravar e editar|Publicar com link para o artigo,O vídeo estiver publicado com link para o artigo.,Link do vídeo.,video|youtube|peca-01,,TSK-0009,Titular,Média,10/11/2026,"4,0 horas",Não iniciada,FACT-01
TSK-0034,CLU-06,Vídeos,Gravar o vídeo sobre gestão de riscos cognitivos,gravar,Abrir o artigo pilar de gestão de riscos e marcar os pontos do roteiro.,Vídeo de 5 minutos publicado.,Cobre o terceiro vídeo.,Vídeo publicado com link para o site.,"Estimativa de 4,0h dentro da janela 05/11/2026 a 14/11/2026, cuja capacidade de execução é 50,1h.",Completa os 3 vídeos do pacote.,De 10/11/2026 até 13/11/2026.,"<tarefa id=""TSK-0034"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Vídeos. Os vídeos apresentam o ecossistema e alimentam YouTube, Reels, TikTok e Shorts.</contexto>
  <objetivo>Vídeo de 5 minutos publicado.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0029 (Escrever o artigo pilar sobre gestão de riscos, projetos e processos neuroadaptados). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre o terceiro vídeo.</restricoes>
  <passos>
    Roteirizar.
    Gravar e editar.
    Publicar com link.
  </passos>
  <criterio_de_conclusao>O vídeo estiver publicado.</criterio_de_conclusao>
  <formato_de_saida>Link do vídeo. Prazo: 13/11/2026. Tempo previsto: 4,0h.</formato_de_saida>
  <evidencia_esperada>Link do vídeo.</evidencia_esperada>
</tarefa>",Roteirizar|Gravar e editar|Publicar com link,O vídeo estiver publicado.,Link do vídeo.,video|riscos,,TSK-0029,Titular,Média,13/11/2026,"4,0 horas",Não iniciada,FACT-01
TSK-0035,CLU-04,Apps e ferramentas,Empacotar o Meu processo de trabalho e o Plano Operacional Rastreável como apps públicos,empacotar,Abrir cada um dos dois apps e anotar o que impede o uso público.,Dois apps com página no catálogo e acesso público ou lista de espera.,Cobre os dois apps.,2 páginas de app publicadas.,"Estimativa de 5,0h dentro da janela 05/11/2026 a 14/11/2026, cuja capacidade de execução é 50,1h.",Cumpre o item 'Apps' do pacote.,De 09/11/2026 até 13/11/2026.,"<tarefa id=""TSK-0035"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Apps e ferramentas. Apps e ferramentas são a prova prática do método e o destino dos CTAs dos artigos.</contexto>
  <objetivo>Dois apps com página no catálogo e acesso público ou lista de espera.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0013 (Publicar o catálogo de apps com o Prisma e a página de cada app disponível). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre os dois apps.</restricoes>
  <passos>
    Ajustar o acesso de cada app.
    Escrever a página de cada app.
    Publicar no catálogo.
  </passos>
  <criterio_de_conclusao>As 2 páginas estiverem publicadas.</criterio_de_conclusao>
  <formato_de_saida>Links das páginas. Prazo: 13/11/2026. Tempo previsto: 5,0h.</formato_de_saida>
  <evidencia_esperada>Links das páginas.</evidencia_esperada>
  <lacunas_conhecidas>Status real dos apps. Não preencher com valor inventado.</lacunas_conhecidas>
</tarefa>",Ajustar o acesso de cada app|Escrever a página de cada app|Publicar no catálogo,As 2 páginas estiverem publicadas.,Links das páginas.,apps|plano-operacional,,TSK-0013,Titular,Média,13/11/2026,"5,0 horas",Não iniciada,FACT-01
TSK-0036,CLU-05,E-books,Escrever o e-book 2: Funções executivas,escrever,Abrir o artigo pilar de funções executivas e listar os tópicos do e-book.,E-book 2 em PDF publicado no catálogo.,Cobre o e-book 2.,PDF publicado com sumário e fontes.,"Estimativa de 6,0h dentro da janela 05/11/2026 a 14/11/2026, cuja capacidade de execução é 50,1h.",Aprofunda o pilar e capta contatos.,De 09/11/2026 até 14/11/2026.,"<tarefa id=""TSK-0036"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: E-books. Os e-books aprofundam os temas e capturam contatos para a newsletter.</contexto>
  <objetivo>E-book 2 em PDF publicado no catálogo.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0030 (Escrever o artigo pilar sobre funções executivas). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre o e-book 2.</restricoes>
  <passos>
    Montar o sumário.
    Redigir e revisar.
    Diagramar e publicar.
  </passos>
  <criterio_de_conclusao>O PDF estiver publicado.</criterio_de_conclusao>
  <formato_de_saida>Link do e-book. Prazo: 14/11/2026. Tempo previsto: 6,0h.</formato_de_saida>
  <evidencia_esperada>Link do e-book.</evidencia_esperada>
</tarefa>",Montar o sumário|Redigir e revisar|Diagramar e publicar,O PDF estiver publicado.,Link do e-book.,ebook|funcoes-executivas,,TSK-0030,Titular,Média,14/11/2026,"6,0 horas",Não iniciada,FACT-01
TSK-0037,CLU-08,Distribuição multiplataforma,Desmembrar e agendar as publicações do ciclo 2,agendar,Abrir o CMS e listar as peças novas publicadas desde 05/11.,Publicações de 20/11 a 05/12 produzidas e agendadas.,Cobre o ciclo 2.,100% dos derivados do ciclo 2 agendados.,"Estimativa de 5,0h dentro da janela 05/11/2026 a 14/11/2026, cuja capacidade de execução é 50,1h.",Fecha o ciclo de 30 dias até 05/12.,De 11/11/2026 até 14/11/2026.,"<tarefa id=""TSK-0037"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Distribuição multiplataforma. A distribuição sustenta o ciclo de 30 dias (05/11 a 05/12) e gera os dados da campanha 02.</contexto>
  <objetivo>Publicações de 20/11 a 05/12 produzidas e agendadas.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0023 (Agendar as publicações do ciclo 1 em todas as plataformas). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre o ciclo 2.</restricoes>
  <passos>
    Marcar os trechos das peças novas.
    Produzir os derivados.
    Agendar.
  </passos>
  <criterio_de_conclusao>Todos os derivados do ciclo 2 estiverem agendados.</criterio_de_conclusao>
  <formato_de_saida>Calendário de agendamento. Prazo: 14/11/2026. Tempo previsto: 5,0h.</formato_de_saida>
  <evidencia_esperada>Calendário de agendamento.</evidencia_esperada>
</tarefa>",Marcar os trechos das peças novas|Produzir os derivados|Agendar,Todos os derivados do ciclo 2 estiverem agendados.,Calendário de agendamento.,agendamento|multiplataforma|no-n17,,TSK-0023,Titular,Média,14/11/2026,"5,0 horas",Não iniciada,DEC-03
TSK-0038,CLU-08,Distribuição multiplataforma,Escrever as 3 newsletters do ciclo 2,escrever,Abrir as peças do ciclo 2 e escolher o tema de cada e-mail.,3 newsletters do ciclo 2 agendadas.,Cobre as newsletters do ciclo 2.,3 e-mails agendados.,"Estimativa de 2,0h dentro da janela 05/11/2026 a 14/11/2026, cuja capacidade de execução é 50,1h.",A newsletter é canal de aprofundamento e venda.,De 12/11/2026 até 14/11/2026.,"<tarefa id=""TSK-0038"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Distribuição multiplataforma. A distribuição sustenta o ciclo de 30 dias (05/11 a 05/12) e gera os dados da campanha 02.</contexto>
  <objetivo>3 newsletters do ciclo 2 agendadas.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre as newsletters do ciclo 2.</restricoes>
  <passos>
    Escolher os temas.
    Redigir os e-mails.
    Agendar o envio.
  </passos>
  <criterio_de_conclusao>Os 3 e-mails estiverem agendados.</criterio_de_conclusao>
  <formato_de_saida>Print da ferramenta de e-mail. Prazo: 14/11/2026. Tempo previsto: 2,0h.</formato_de_saida>
  <evidencia_esperada>Print da ferramenta de e-mail.</evidencia_esperada>
</tarefa>",Escolher os temas|Redigir os e-mails|Agendar o envio,Os 3 e-mails estiverem agendados.,Print da ferramenta de e-mail.,newsletter|email,TSK-0037,,Titular,Média,14/11/2026,"2,0 horas",Não iniciada,FACT-03
TSK-0039,CLU-09,Campanha 02 e lançamento do app,Consolidar os dados da campanha 01 em um relatório de aprendizado,consolidar,Abrir o painel de Analytics e exportar os dados de 05/11 até hoje.,"Relatório com o desempenho por canal, peça e CTA, e as lições para a campanha 02.",Cobre o relatório parcial de 14/11.,Relatório com as 5 métricas por canal.,"Estimativa de 3,0h dentro da janela 05/11/2026 a 14/11/2026, cuja capacidade de execução é 50,1h.",A campanha 02 será planejada a partir desses dados.,De 13/11/2026 até 14/11/2026.,"<tarefa id=""TSK-0039"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Campanha 02 e lançamento do app. A campanha 02 lança o ecossistema com foco no app e nos produtos para a demanda de janeiro.</contexto>
  <objetivo>Relatório com o desempenho por canal, peça e CTA, e as lições para a campanha 02.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0025 (Configurar a medição do site, dos links e da newsletter). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre o relatório parcial de 14/11.</restricoes>
  <passos>
    Exportar os dados.
    Comparar canais, peças e CTAs.
    Registrar as lições.
  </passos>
  <criterio_de_conclusao>O relatório estiver salvo com as 5 métricas e as lições.</criterio_de_conclusao>
  <formato_de_saida>Arquivo do relatório. Prazo: 14/11/2026. Tempo previsto: 3,0h.</formato_de_saida>
  <evidencia_esperada>Arquivo do relatório.</evidencia_esperada>
  <lacunas_conhecidas>Linha de base das métricas. Não preencher com valor inventado.</lacunas_conhecidas>
</tarefa>","Exportar os dados|Comparar canais, peças e CTAs|Registrar as lições",O relatório estiver salvo com as 5 métricas e as lições.,Arquivo do relatório.,analytics|aprendizado|no-n19|no-n20,,TSK-0025,Titular,Alta,14/11/2026,"3,0 horas",Não iniciada,DEC-05
TSK-0040,CLU-08,Distribuição multiplataforma,Acompanhar as métricas e os comentários semanalmente durante o ciclo de 30 dias,acompanhar,Abrir o painel de métricas toda sexta-feira.,Registro semanal de métricas e respostas aos comentários.,Cobre o acompanhamento de 06/11 a 05/12.,4 registros semanais.,"Estimativa de 4,0h dentro da janela 05/11/2026 a 14/11/2026, cuja capacidade de execução é 50,1h.",Gera os dados do relatório final do ciclo.,De 06/11/2026 até 05/12/2026.,"<tarefa id=""TSK-0040"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Distribuição multiplataforma. A distribuição sustenta o ciclo de 30 dias (05/11 a 05/12) e gera os dados da campanha 02.</contexto>
  <objetivo>Registro semanal de métricas e respostas aos comentários.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre o acompanhamento de 06/11 a 05/12.</restricoes>
  <passos>
    Registrar as métricas da semana.
    Responder aos comentários.
    Anotar ajustes.
  </passos>
  <criterio_de_conclusao>Houver 4 registros semanais.</criterio_de_conclusao>
  <formato_de_saida>Registros semanais. Prazo: 05/12/2026. Tempo previsto: 4,0h.</formato_de_saida>
  <evidencia_esperada>Registros semanais.</evidencia_esperada>
</tarefa>",Registrar as métricas da semana|Responder aos comentários|Anotar ajustes,Houver 4 registros semanais.,Registros semanais.,metricas|comunidade,,,Titular,Média,05/12/2026,"4,0 horas",Não iniciada,DEC-05
TSK-0041,CLU-09,Campanha 02 e lançamento do app,Planejar a campanha 02 a partir dos dados da campanha 01,planejar,Abrir o relatório de aprendizado da campanha 01.,Plano da campanha 02 (lançamento do ecossistema com foco no app e nos produtos) aprovado.,Cobre o plano; a produção é outra tarefa.,"Plano com meta, peças, canais e datas.","Estimativa de 3,0h dentro da janela 15/11/2026 a 30/11/2026, cuja capacidade de execução é 68,9h.",A campanha 02 aproveita a demanda de início de ano.,De 16/11/2026 até 17/11/2026.,"<tarefa id=""TSK-0041"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Campanha 02 e lançamento do app. A campanha 02 lança o ecossistema com foco no app e nos produtos para a demanda de janeiro.</contexto>
  <objetivo>Plano da campanha 02 (lançamento do ecossistema com foco no app e nos produtos) aprovado.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0039 (Consolidar os dados da campanha 01 em um relatório de aprendizado). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre o plano; a produção é outra tarefa.</restricoes>
  <passos>
    Ler as lições da campanha 01.
    Definir meta, peças e canais.
    Aprovar o plano.
  </passos>
  <criterio_de_conclusao>O plano estiver aprovado pelo titular.</criterio_de_conclusao>
  <formato_de_saida>Plano salvo. Prazo: 17/11/2026. Tempo previsto: 3,0h.</formato_de_saida>
  <evidencia_esperada>Plano salvo.</evidencia_esperada>
</tarefa>","Ler as lições da campanha 01|Definir meta, peças e canais|Aprovar o plano",O plano estiver aprovado pelo titular.,Plano salvo.,campanha-02|planejamento,,TSK-0039,Titular,Alta,17/11/2026,"3,0 horas",Não iniciada,DEC-04
TSK-0042,CLU-09,Campanha 02 e lançamento do app,Produzir o pacote de conteúdo da campanha 02,produzir,Abrir o plano da campanha 02 e escrever o título da peça-mãe.,"Pacote da campanha 02 pronto: peça-mãe, vídeos, derivados e e-mails sobre o app e os produtos.",Cobre a produção de 18/11 a 30/11.,Todas as peças do plano da campanha 02 prontas.,"Estimativa de 20,0h dentro da janela 15/11/2026 a 30/11/2026, cuja capacidade de execução é 68,9h.",É o conteúdo do lançamento de 05/01.,De 18/11/2026 até 30/11/2026.,"<tarefa id=""TSK-0042"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Campanha 02 e lançamento do app. A campanha 02 lança o ecossistema com foco no app e nos produtos para a demanda de janeiro.</contexto>
  <objetivo>Pacote da campanha 02 pronto: peça-mãe, vídeos, derivados e e-mails sobre o app e os produtos.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0041 (Planejar a campanha 02 a partir dos dados da campanha 01). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre a produção de 18/11 a 30/11.</restricoes>
  <passos>
    Produzir a peça-mãe.
    Produzir os derivados.
    Revisar o pacote.
  </passos>
  <criterio_de_conclusao>Todas as peças previstas estiverem prontas e revisadas.</criterio_de_conclusao>
  <formato_de_saida>Lista de peças no CMS. Prazo: 30/11/2026. Tempo previsto: 20,0h.</formato_de_saida>
  <evidencia_esperada>Lista de peças no CMS.</evidencia_esperada>
</tarefa>",Produzir a peça-mãe|Produzir os derivados|Revisar o pacote,Todas as peças previstas estiverem prontas e revisadas.,Lista de peças no CMS.,campanha-02|producao,,TSK-0041,Titular,Alta,30/11/2026,"20,0 horas",Não iniciada,DEC-03
TSK-0043,CLU-03,Conteúdo do blog,Escrever o artigo pilar sobre dark partners,escrever,Escrever em uma frase a definição de dark partners usada pelo EXECUTAR.,Artigo pilar publicado com CTA.,Cobre o pilar 3.,Artigo publicado com 2 evidências e 1 CTA.,"Estimativa de 4,0h dentro da janela 15/11/2026 a 30/11/2026, cuja capacidade de execução é 68,9h.",Completa os pilares do pacote.,De 16/11/2026 até 18/11/2026.,"<tarefa id=""TSK-0043"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Conteúdo do blog. Os artigos são as peças-mãe que geram os derivados multiplataforma e levam às ferramentas.</contexto>
  <objetivo>Artigo pilar publicado com CTA.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre o pilar 3.</restricoes>
  <passos>
    Definir o conceito.
    Redigir com evidências.
    Publicar com CTA.
  </passos>
  <criterio_de_conclusao>O artigo estiver publicado.</criterio_de_conclusao>
  <formato_de_saida>Link do artigo. Prazo: 18/11/2026. Tempo previsto: 4,0h.</formato_de_saida>
  <evidencia_esperada>Link do artigo.</evidencia_esperada>
  <lacunas_conhecidas>Definição de dark partners. Não preencher com valor inventado.</lacunas_conhecidas>
</tarefa>",Definir o conceito|Redigir com evidências|Publicar com CTA,O artigo estiver publicado.,Link do artigo.,artigo-pilar|dark-partners|blog,,,Titular,Média,18/11/2026,"4,0 horas",Não iniciada,FACT-01
TSK-0044,CLU-03,Conteúdo do blog,"Escrever o artigo pilar sobre riscos cognitivos no estudo, no trabalho, na rotina e nos ambientes físicos e digitais",escrever,Abrir o mapa de evidências na seção de ambientes.,Artigo pilar publicado com CTA.,Cobre o pilar 4.,Artigo publicado com 2 evidências e 1 CTA.,"Estimativa de 4,0h dentro da janela 15/11/2026 a 30/11/2026, cuja capacidade de execução é 68,9h.",Completa os pilares do pacote.,De 19/11/2026 até 21/11/2026.,"<tarefa id=""TSK-0044"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Conteúdo do blog. Os artigos são as peças-mãe que geram os derivados multiplataforma e levam às ferramentas.</contexto>
  <objetivo>Artigo pilar publicado com CTA.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0006 (Pesquisar evidências citáveis para o artigo fundador e os quatro artigos pilares). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre o pilar 4.</restricoes>
  <passos>
    Estruturar os blocos.
    Redigir com evidências.
    Publicar com CTA.
  </passos>
  <criterio_de_conclusao>O artigo estiver publicado.</criterio_de_conclusao>
  <formato_de_saida>Link do artigo. Prazo: 21/11/2026. Tempo previsto: 4,0h.</formato_de_saida>
  <evidencia_esperada>Link do artigo.</evidencia_esperada>
</tarefa>",Estruturar os blocos|Redigir com evidências|Publicar com CTA,O artigo estiver publicado.,Link do artigo.,artigo-pilar|ambientes|blog,,TSK-0006,Titular,Média,21/11/2026,"4,0 horas",Não iniciada,FACT-01
TSK-0045,CLU-05,E-books,Escrever o e-book 3: Ambientes físicos e digitais,escrever,Abrir o artigo pilar de ambientes e listar os tópicos do e-book.,E-book 3 em PDF publicado.,Cobre o e-book 3.,PDF publicado com sumário e fontes.,"Estimativa de 5,0h dentro da janela 15/11/2026 a 30/11/2026, cuja capacidade de execução é 68,9h.",Completa os e-books do pacote.,De 16/11/2026 até 21/11/2026.,"<tarefa id=""TSK-0045"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: E-books. Os e-books aprofundam os temas e capturam contatos para a newsletter.</contexto>
  <objetivo>E-book 3 em PDF publicado.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre o e-book 3.</restricoes>
  <passos>
    Montar o sumário.
    Redigir e revisar.
    Diagramar e publicar.
  </passos>
  <criterio_de_conclusao>O PDF estiver publicado.</criterio_de_conclusao>
  <formato_de_saida>Link do e-book. Prazo: 21/11/2026. Tempo previsto: 5,0h.</formato_de_saida>
  <evidencia_esperada>Link do e-book.</evidencia_esperada>
</tarefa>",Montar o sumário|Redigir e revisar|Diagramar e publicar,O PDF estiver publicado.,Link do e-book.,ebook|ambientes,,,Titular,Média,21/11/2026,"5,0 horas",Não iniciada,FACT-01
TSK-0046,CLU-05,E-books,Escrever o e-book 4: Gerenciando o TDAH adulto com base em Barkley,escrever,Listar as obras de Barkley que serão citadas e as páginas de referência.,"E-book 4 em PDF publicado, com citações e referências a Barkley, sem reproduzir a obra.",Cobre o e-book 4.,PDF publicado com referências completas.,"Estimativa de 5,0h dentro da janela 15/11/2026 a 30/11/2026, cuja capacidade de execução é 68,9h.",Completa os e-books do pacote e liga aos livros de afiliado.,De 23/11/2026 até 27/11/2026.,"<tarefa id=""TSK-0046"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: E-books. Os e-books aprofundam os temas e capturam contatos para a newsletter.</contexto>
  <objetivo>E-book 4 em PDF publicado, com citações e referências a Barkley, sem reproduzir a obra.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Não reproduzir trechos longos de obras protegidas; não usar o nome do autor como endosso. Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre o e-book 4.</restricoes>
  <passos>
    Listar as referências.
    Redigir com citações curtas.
    Diagramar e publicar.
  </passos>
  <criterio_de_conclusao>O PDF estiver publicado com referências completas.</criterio_de_conclusao>
  <formato_de_saida>Link do e-book. Prazo: 27/11/2026. Tempo previsto: 5,0h.</formato_de_saida>
  <evidencia_esperada>Link do e-book.</evidencia_esperada>
  <lacunas_conhecidas>Uso do nome Barkley no título. Não preencher com valor inventado.</lacunas_conhecidas>
</tarefa>",Listar as referências|Redigir com citações curtas|Diagramar e publicar,O PDF estiver publicado com referências completas.,Link do e-book.,ebook|tdah|barkley,,,Titular,Média,27/11/2026,"5,0 horas",Não iniciada,FACT-01
TSK-0047,CLU-04,Apps e ferramentas,"Empacotar o workflow visual, o construtor de mapas e o operador de tarefas",empacotar,Abrir o app de workflow e anotar o que impede o uso público.,Página do app no catálogo com acesso público ou lista de espera.,Cobre o app de workflow.,Página publicada.,"Estimativa de 4,0h dentro da janela 15/11/2026 a 30/11/2026, cuja capacidade de execução é 68,9h.",Cumpre o último item de 'Apps' do pacote.,De 23/11/2026 até 26/11/2026.,"<tarefa id=""TSK-0047"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Apps e ferramentas. Apps e ferramentas são a prova prática do método e o destino dos CTAs dos artigos.</contexto>
  <objetivo>Página do app no catálogo com acesso público ou lista de espera.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre o app de workflow.</restricoes>
  <passos>
    Ajustar o acesso.
    Escrever a página.
    Publicar no catálogo.
  </passos>
  <criterio_de_conclusao>A página estiver publicada.</criterio_de_conclusao>
  <formato_de_saida>Link da página. Prazo: 26/11/2026. Tempo previsto: 4,0h.</formato_de_saida>
  <evidencia_esperada>Link da página.</evidencia_esperada>
  <lacunas_conhecidas>Status real do app. Não preencher com valor inventado.</lacunas_conhecidas>
</tarefa>",Ajustar o acesso|Escrever a página|Publicar no catálogo,A página estiver publicada.,Link da página.,apps|workflow,,,Titular,Média,26/11/2026,"4,0 horas",Não iniciada,FACT-01
TSK-0048,CLU-04,Apps e ferramentas,Empacotar os plugins e agentes para download,empacotar,"Listar os arquivos do Copiloto EXECUTAR, do Plano Operacional Rastreável, das skills, do Safe Protocol e do Academic Flow.",Pacotes de plugins e agentes publicados no catálogo com instruções de instalação.,Cobre os 5 pacotes.,5 pacotes baixáveis com instruções.,"Estimativa de 4,0h dentro da janela 15/11/2026 a 30/11/2026, cuja capacidade de execução é 68,9h.",Cumpre o item 'Plugins e agentes' do pacote.,De 24/11/2026 até 27/11/2026.,"<tarefa id=""TSK-0048"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Apps e ferramentas. Apps e ferramentas são a prova prática do método e o destino dos CTAs dos artigos.</contexto>
  <objetivo>Pacotes de plugins e agentes publicados no catálogo com instruções de instalação.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre os 5 pacotes.</restricoes>
  <passos>
    Reunir os arquivos.
    Escrever as instruções.
    Publicar no catálogo.
  </passos>
  <criterio_de_conclusao>Os 5 pacotes estiverem publicados.</criterio_de_conclusao>
  <formato_de_saida>Prints do catálogo. Prazo: 27/11/2026. Tempo previsto: 4,0h.</formato_de_saida>
  <evidencia_esperada>Prints do catálogo.</evidencia_esperada>
</tarefa>",Reunir os arquivos|Escrever as instruções|Publicar no catálogo,Os 5 pacotes estiverem publicados.,Prints do catálogo.,plugins|agentes|skills,,,Titular,Média,27/11/2026,"4,0 horas",Não iniciada,FACT-01
TSK-0049,CLU-04,Apps e ferramentas,"Produzir o photo prompt de rotina, o guia de Obsidian para dislexia e os infográficos de IDs",produzir,Abrir o Obsidian e criar a nota-modelo para dislexia.,Três recursos publicados no catálogo de ferramentas.,Cobre os 3 recursos.,3 recursos publicados.,"Estimativa de 4,0h dentro da janela 15/11/2026 a 30/11/2026, cuja capacidade de execução é 68,9h.","Cumpre o item de photo prompt, Obsidian e infográficos do pacote.",De 23/11/2026 até 28/11/2026.,"<tarefa id=""TSK-0049"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Apps e ferramentas. Apps e ferramentas são a prova prática do método e o destino dos CTAs dos artigos.</contexto>
  <objetivo>Três recursos publicados no catálogo de ferramentas.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre os 3 recursos.</restricoes>
  <passos>
    Produzir o photo prompt.
    Produzir o guia de Obsidian.
    Produzir os infográficos.
  </passos>
  <criterio_de_conclusao>Os 3 recursos estiverem publicados.</criterio_de_conclusao>
  <formato_de_saida>Links dos recursos. Prazo: 28/11/2026. Tempo previsto: 4,0h.</formato_de_saida>
  <evidencia_esperada>Links dos recursos.</evidencia_esperada>
</tarefa>",Produzir o photo prompt|Produzir o guia de Obsidian|Produzir os infográficos,Os 3 recursos estiverem publicados.,Links dos recursos.,photoprompt|obsidian|infografico,,,Titular,Média,28/11/2026,"4,0 horas",Não iniciada,FACT-01
TSK-0050,CLU-10,Carreira na Europa,Planejar a estratégia de realocação profissional na Europa,planejar,"Escrever em uma página: país-alvo, cargos-alvo e data da viagem.","Plano estratégico com países, cargos, certificações candidatas, orçamento e marcos até 30/04.",Cobre o planejamento estratégico (item 0 do épico).,Plano com os 5 elementos.,"Estimativa de 3,0h dentro da janela 15/11/2026 a 30/11/2026, cuja capacidade de execução é 68,9h.",Abre o EPIC Emprego e realocação (19/11 a 30/03).,De 19/11/2026 até 21/11/2026.,"<tarefa id=""TSK-0050"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Carreira na Europa. Prepara a realocação profissional na Europa: certificações, portfólio, presença e candidaturas.</contexto>
  <objetivo>Plano estratégico com países, cargos, certificações candidatas, orçamento e marcos até 30/04.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre o planejamento estratégico (item 0 do épico).</restricoes>
  <passos>
    Definir país e cargos-alvo.
    Listar certificações candidatas e orçamento.
    Fixar os marcos.
  </passos>
  <criterio_de_conclusao>O plano tiver os 5 elementos.</criterio_de_conclusao>
  <formato_de_saida>Plano salvo. Prazo: 21/11/2026. Tempo previsto: 3,0h.</formato_de_saida>
  <evidencia_esperada>Plano salvo.</evidencia_esperada>
  <lacunas_conhecidas>Destino da viagem e documentação. Não preencher com valor inventado.</lacunas_conhecidas>
</tarefa>",Definir país e cargos-alvo|Listar certificações candidatas e orçamento|Fixar os marcos,O plano tiver os 5 elementos.,Plano salvo.,carreira|planejamento|europa,,,Titular,Alta,21/11/2026,"3,0 horas",Não iniciada,DEC-07
TSK-0051,CLU-10,Carreira na Europa,Escolher as certificações e verificar preços e datas de prova,escolher,Abrir o site oficial de cada certificação candidata.,"Uma certificação escolhida para cada área (projetos, processos, governança de IA), com preço e datas oficiais.",Cobre a escolha; não cobre a inscrição.,3 certificações com preço e data oficial.,"Estimativa de 2,0h dentro da janela 15/11/2026 a 30/11/2026, cuja capacidade de execução é 68,9h.",As provas pagas são as referências de mercado na Europa.,De 23/11/2026 até 25/11/2026.,"<tarefa id=""TSK-0051"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Carreira na Europa. Prepara a realocação profissional na Europa: certificações, portfólio, presença e candidaturas.</contexto>
  <objetivo>Uma certificação escolhida para cada área (projetos, processos, governança de IA), com preço e datas oficiais.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0050 (Planejar a estratégia de realocação profissional na Europa). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre a escolha; não cobre a inscrição.</restricoes>
  <passos>
    Comparar as candidatas por área.
    Verificar preço e datas oficiais.
    Registrar a escolha.
  </passos>
  <criterio_de_conclusao>As 3 escolhas tiverem preço e datas de fonte oficial.</criterio_de_conclusao>
  <formato_de_saida>Tabela com links oficiais. Prazo: 25/11/2026. Tempo previsto: 2,0h.</formato_de_saida>
  <evidencia_esperada>Tabela com links oficiais.</evidencia_esperada>
  <lacunas_conhecidas>Certificações, preços e datas. Não preencher com valor inventado.</lacunas_conhecidas>
</tarefa>",Comparar as candidatas por área|Verificar preço e datas oficiais|Registrar a escolha,As 3 escolhas tiverem preço e datas de fonte oficial.,Tabela com links oficiais.,certificacao|carreira|decisao,,TSK-0050,Titular,Alta,25/11/2026,"2,0 horas",Não iniciada,DEC-07
TSK-0052,CLU-10,Carreira na Europa,"Montar o plano de estudos com autoestudo, cursos e simulados",montar,Abrir o edital oficial da primeira certificação escolhida.,"Plano de estudos semanal por certificação, com simulados e data-alvo de prova.",Cobre o plano de estudos.,Plano com horas semanais e 1 simulado por certificação.,"Estimativa de 2,0h dentro da janela 15/11/2026 a 30/11/2026, cuja capacidade de execução é 68,9h.",Organiza a capacitação do épico.,De 25/11/2026 até 27/11/2026.,"<tarefa id=""TSK-0052"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Carreira na Europa. Prepara a realocação profissional na Europa: certificações, portfólio, presença e candidaturas.</contexto>
  <objetivo>Plano de estudos semanal por certificação, com simulados e data-alvo de prova.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0051 (Escolher as certificações e verificar preços e datas de prova). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre o plano de estudos.</restricoes>
  <passos>
    Listar os conteúdos de cada edital.
    Distribuir por semana.
    Marcar simulados e provas.
  </passos>
  <criterio_de_conclusao>O plano tiver horas semanais e simulados por certificação.</criterio_de_conclusao>
  <formato_de_saida>Plano salvo. Prazo: 27/11/2026. Tempo previsto: 2,0h.</formato_de_saida>
  <evidencia_esperada>Plano salvo.</evidencia_esperada>
</tarefa>",Listar os conteúdos de cada edital|Distribuir por semana|Marcar simulados e provas,O plano tiver horas semanais e simulados por certificação.,Plano salvo.,estudos|certificacao,,TSK-0051,Titular,Alta,27/11/2026,"2,0 horas",Não iniciada,DEC-07
TSK-0053,CLU-08,Distribuição multiplataforma,Fechar o relatório do ciclo de 30 dias da campanha 01,fechar,Exportar os dados de 05/11 a 05/12 do painel de métricas.,"Relatório final do ciclo com resultados, lições e recomendações.",Cobre o ciclo completo.,Relatório com as 5 métricas e as lições.,"Estimativa de 3,0h dentro da janela 01/12/2026 a 05/01/2027, cuja capacidade de execução é 165,9h.",Fecha a campanha 01 e ajusta a campanha 02.,De 03/12/2026 até 05/12/2026.,"<tarefa id=""TSK-0053"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Distribuição multiplataforma. A distribuição sustenta o ciclo de 30 dias (05/11 a 05/12) e gera os dados da campanha 02.</contexto>
  <objetivo>Relatório final do ciclo com resultados, lições e recomendações.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0040 (Acompanhar as métricas e os comentários semanalmente durante o ciclo de 30 dias). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre o ciclo completo.</restricoes>
  <passos>
    Exportar os dados.
    Comparar com o relatório parcial.
    Registrar as lições.
  </passos>
  <criterio_de_conclusao>O relatório final estiver salvo.</criterio_de_conclusao>
  <formato_de_saida>Arquivo do relatório. Prazo: 05/12/2026. Tempo previsto: 3,0h.</formato_de_saida>
  <evidencia_esperada>Arquivo do relatório.</evidencia_esperada>
</tarefa>",Exportar os dados|Comparar com o relatório parcial|Registrar as lições,O relatório final estiver salvo.,Arquivo do relatório.,relatorio|aprendizado|no-n20,,TSK-0040,Titular,Alta,05/12/2026,"3,0 horas",Não iniciada,DEC-05
TSK-0054,CLU-09,Campanha 02 e lançamento do app,Definir o escopo do Executar App e do Expo para o lançamento de 05/01,definir,Abrir o protótipo Scroll Task e listar as funções que já existem.,"Escopo mínimo do app para 05/01 aprovado, com o que fica para depois.",Cobre a definição de escopo.,Lista de funções 'entra'/'depois' aprovada.,"Estimativa de 2,0h dentro da janela 01/12/2026 a 05/01/2027, cuja capacidade de execução é 165,9h.",O app é o foco da campanha 02.,De 01/12/2026 até 02/12/2026.,"<tarefa id=""TSK-0054"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Campanha 02 e lançamento do app. A campanha 02 lança o ecossistema com foco no app e nos produtos para a demanda de janeiro.</contexto>
  <objetivo>Escopo mínimo do app para 05/01 aprovado, com o que fica para depois.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre a definição de escopo.</restricoes>
  <passos>
    Listar as funções existentes.
    Escolher o mínimo para 05/01.
    Aprovar o escopo.
  </passos>
  <criterio_de_conclusao>O escopo estiver aprovado.</criterio_de_conclusao>
  <formato_de_saida>Documento de escopo. Prazo: 02/12/2026. Tempo previsto: 2,0h.</formato_de_saida>
  <evidencia_esperada>Documento de escopo.</evidencia_esperada>
  <lacunas_conhecidas>Escopo funcional do app. Não preencher com valor inventado.</lacunas_conhecidas>
</tarefa>",Listar as funções existentes|Escolher o mínimo para 05/01|Aprovar o escopo,O escopo estiver aprovado.,Documento de escopo.,app|escopo|decisao,,,Titular,Alta,02/12/2026,"2,0 horas",Não iniciada,DEC-04
TSK-0055,CLU-09,Campanha 02 e lançamento do app,Desenvolver o Executar App e o Expo dentro do escopo aprovado,desenvolver,Abrir o documento de escopo e criar a lista de telas.,"App funcionando no escopo aprovado, pronto para testes.",Cobre o desenvolvimento do escopo mínimo.,Todas as funções do escopo funcionando em teste.,"Estimativa de 40,0h dentro da janela 01/12/2026 a 05/01/2027, cuja capacidade de execução é 165,9h.",É o produto central do lançamento de 05/01.,De 03/12/2026 até 22/12/2026.,"<tarefa id=""TSK-0055"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Campanha 02 e lançamento do app. A campanha 02 lança o ecossistema com foco no app e nos produtos para a demanda de janeiro.</contexto>
  <objetivo>App funcionando no escopo aprovado, pronto para testes.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0054 (Definir o escopo do Executar App e do Expo para o lançamento de 05/01). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre o desenvolvimento do escopo mínimo.</restricoes>
  <passos>
    Implementar as telas.
    Integrar os dados.
    Preparar a versão de teste.
  </passos>
  <criterio_de_conclusao>Todas as funções do escopo funcionarem na versão de teste.</criterio_de_conclusao>
  <formato_de_saida>Versão de teste e lista de funções. Prazo: 22/12/2026. Tempo previsto: 40,0h.</formato_de_saida>
  <evidencia_esperada>Versão de teste e lista de funções.</evidencia_esperada>
  <lacunas_conhecidas>Escopo funcional do app. Não preencher com valor inventado.</lacunas_conhecidas>
</tarefa>",Implementar as telas|Integrar os dados|Preparar a versão de teste,Todas as funções do escopo funcionarem na versão de teste.,Versão de teste e lista de funções.,app|expo|desenvolvimento,,TSK-0054,Titular,Alta,22/12/2026,"40,0 horas",Não iniciada,DEC-04
TSK-0056,CLU-09,Campanha 02 e lançamento do app,Testar o Executar App e publicar a versão de lançamento,testar,Instalar a versão de teste em um celular.,Versão de lançamento publicada e página /apps/executar ativada com destino real.,Cobre testes e publicação.,Lista de testes sem erro crítico + link real ativo.,"Estimativa de 8,0h dentro da janela 01/12/2026 a 05/01/2027, cuja capacidade de execução é 165,9h.",Sem isso não há lançamento do app em 05/01.,De 28/12/2026 até 02/01/2027.,"<tarefa id=""TSK-0056"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Campanha 02 e lançamento do app. A campanha 02 lança o ecossistema com foco no app e nos produtos para a demanda de janeiro.</contexto>
  <objetivo>Versão de lançamento publicada e página /apps/executar ativada com destino real.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0055 (Desenvolver o Executar App e o Expo dentro do escopo aprovado). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre testes e publicação.</restricoes>
  <passos>
    Testar as funções.
    Corrigir erros críticos.
    Publicar e ativar o link.
  </passos>
  <criterio_de_conclusao>A versão estiver publicada e o link real ativo.</criterio_de_conclusao>
  <formato_de_saida>Link da versão publicada. Prazo: 02/01/2027. Tempo previsto: 8,0h.</formato_de_saida>
  <evidencia_esperada>Link da versão publicada.</evidencia_esperada>
</tarefa>",Testar as funções|Corrigir erros críticos|Publicar e ativar o link,A versão estiver publicada e o link real ativo.,Link da versão publicada.,app|testes|publicacao,,TSK-0055,Titular,Alta,02/01/2027,"8,0 horas",Não iniciada,DEC-04
TSK-0057,CLU-09,Campanha 02 e lançamento do app,Preparar os épicos posteriores escolhidos para o lançamento de 05/01,preparar,Abrir a lista de épicos posteriores e marcar os que entram em 05/01.,"Épicos escolhidos (por exemplo consultoria e studio, cursos, loja) prontos para 05/01.",Cobre só os épicos aprovados no ponto de decisão de 20/12.,Cada épico escolhido com página publicada.,"Estimativa de 16,0h dentro da janela 01/12/2026 a 05/01/2027, cuja capacidade de execução é 165,9h.",A campanha 02 lança o ecossistema inteiro.,De 07/12/2026 até 22/12/2026.,"<tarefa id=""TSK-0057"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Campanha 02 e lançamento do app. A campanha 02 lança o ecossistema com foco no app e nos produtos para a demanda de janeiro.</contexto>
  <objetivo>Épicos escolhidos (por exemplo consultoria e studio, cursos, loja) prontos para 05/01.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0054 (Definir o escopo do Executar App e do Expo para o lançamento de 05/01). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre só os épicos aprovados no ponto de decisão de 20/12.</restricoes>
  <passos>
    Confirmar os épicos escolhidos.
    Produzir as páginas.
    Revisar.
  </passos>
  <criterio_de_conclusao>Cada épico escolhido tiver página pronta.</criterio_de_conclusao>
  <formato_de_saida>Links das páginas. Prazo: 22/12/2026. Tempo previsto: 16,0h.</formato_de_saida>
  <evidencia_esperada>Links das páginas.</evidencia_esperada>
</tarefa>",Confirmar os épicos escolhidos|Produzir as páginas|Revisar,Cada épico escolhido tiver página pronta.,Links das páginas.,ecossistema|epicos,,TSK-0054,Titular,Média,22/12/2026,"16,0 horas",Não iniciada,DEC-04
TSK-0058,CLU-09,Campanha 02 e lançamento do app,Agendar as publicações da campanha 02,agendar,Abrir o pacote da campanha 02 no CMS.,Publicações da campanha 02 agendadas de dezembro a janeiro.,Cobre o agendamento da campanha 02.,100% das peças agendadas.,"Estimativa de 4,0h dentro da janela 01/12/2026 a 05/01/2027, cuja capacidade de execução é 165,9h.",Garante a cadência do lançamento de 05/01.,De 14/12/2026 até 18/12/2026.,"<tarefa id=""TSK-0058"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Campanha 02 e lançamento do app. A campanha 02 lança o ecossistema com foco no app e nos produtos para a demanda de janeiro.</contexto>
  <objetivo>Publicações da campanha 02 agendadas de dezembro a janeiro.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0042 (Produzir o pacote de conteúdo da campanha 02). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre o agendamento da campanha 02.</restricoes>
  <passos>
    Conferir as peças.
    Agendar por plataforma.
    Conferir o calendário.
  </passos>
  <criterio_de_conclusao>Todas as peças estiverem agendadas.</criterio_de_conclusao>
  <formato_de_saida>Calendário de agendamento. Prazo: 18/12/2026. Tempo previsto: 4,0h.</formato_de_saida>
  <evidencia_esperada>Calendário de agendamento.</evidencia_esperada>
</tarefa>",Conferir as peças|Agendar por plataforma|Conferir o calendário,Todas as peças estiverem agendadas.,Calendário de agendamento.,agendamento|campanha-02|no-n17,,TSK-0042,Titular,Alta,18/12/2026,"4,0 horas",Não iniciada,DEC-03
TSK-0059,CLU-01,Planejamento e controle,Decidir a liberação do lançamento de 05/01,decidir,Abrir a lista de testes do app e o calendário da campanha 02.,Decisão registrada: lançar em 05/01 ou adiar itens específicos.,Cobre só a decisão.,Decisão escrita.,"Estimativa de 0,5h dentro da janela 01/12/2026 a 05/01/2027, cuja capacidade de execução é 165,9h.",Ponto de decisão antes do lançamento.,Em 04/01/2027.,"<tarefa id=""TSK-0059"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Planejamento e controle. Mantém o plano rastreável, com escopo e capacidade confirmados antes da execução.</contexto>
  <objetivo>Decisão registrada: lançar em 05/01 ou adiar itens específicos.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0056 (Testar o Executar App e publicar a versão de lançamento). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre só a decisão.</restricoes>
  <passos>
    Conferir testes e agendamentos.
    Decidir item a item.
    Registrar.
  </passos>
  <criterio_de_conclusao>A decisão estiver registrada.</criterio_de_conclusao>
  <formato_de_saida>Nota de decisão. Prazo: 04/01/2027. Tempo previsto: 0,5h.</formato_de_saida>
  <evidencia_esperada>Nota de decisão.</evidencia_esperada>
</tarefa>",Conferir testes e agendamentos|Decidir item a item|Registrar,A decisão estiver registrada.,Nota de decisão.,decisao|lancamento,,TSK-0056,Titular,Alta,04/01/2027,"0,5 horas",Não iniciada,DEC-03
TSK-0060,CLU-09,Campanha 02 e lançamento do app,Executar o lançamento do app e do ecossistema em 05/01,executar,Abrir o painel do site e conferir a versão que vai ao ar.,"App, épicos escolhidos e campanha 02 no ar em 05/01.",Cobre o dia do lançamento.,Itens aprovados no ar e conferidos.,"Estimativa de 3,0h dentro da janela 01/12/2026 a 05/01/2027, cuja capacidade de execução é 165,9h.",Marco final do período de produção.,Em 05/01/2027.,"<tarefa id=""TSK-0060"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Campanha 02 e lançamento do app. A campanha 02 lança o ecossistema com foco no app e nos produtos para a demanda de janeiro.</contexto>
  <objetivo>App, épicos escolhidos e campanha 02 no ar em 05/01.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0059 (Decidir a liberação do lançamento de 05/01). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre o dia do lançamento.</restricoes>
  <passos>
    Publicar.
    Conferir as publicações.
    Registrar problemas.
  </passos>
  <criterio_de_conclusao>Todos os itens aprovados estiverem no ar.</criterio_de_conclusao>
  <formato_de_saida>Prints. Prazo: 05/01/2027. Tempo previsto: 3,0h.</formato_de_saida>
  <evidencia_esperada>Prints.</evidencia_esperada>
</tarefa>",Publicar|Conferir as publicações|Registrar problemas,Todos os itens aprovados estiverem no ar.,Prints.,lancamento|app,,TSK-0059,Titular,Alta,05/01/2027,"3,0 horas",Não iniciada,DEC-03
TSK-0061,CLU-10,Carreira na Europa,Estudar gestão de projetos conforme o plano de estudos,estudar,Abrir o plano de estudos na semana atual.,"Conteúdo do edital de gestão de projetos estudado, com simulados feitos.",Cobre o estudo de gestão de projetos.,Horas semanais cumpridas e simulados registrados.,"Estimativa de 40,0h dentro da janela 15/11/2026 a 30/11/2026, cuja capacidade de execução é 68,9h.",Prepara a primeira certificação.,De 30/11/2026 até 15/01/2027.,"<tarefa id=""TSK-0061"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Carreira na Europa. Prepara a realocação profissional na Europa: certificações, portfólio, presença e candidaturas.</contexto>
  <objetivo>Conteúdo do edital de gestão de projetos estudado, com simulados feitos.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0052 (Montar o plano de estudos com autoestudo, cursos e simulados). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre o estudo de gestão de projetos.</restricoes>
  <passos>
    Estudar o bloco da semana.
    Fazer os exercícios.
    Registrar as horas.
  </passos>
  <criterio_de_conclusao>Todo o edital estiver estudado e 1 simulado completo feito.</criterio_de_conclusao>
  <formato_de_saida>Registro de horas e notas de simulado. Prazo: 15/01/2027. Tempo previsto: 40,0h.</formato_de_saida>
  <evidencia_esperada>Registro de horas e notas de simulado.</evidencia_esperada>
</tarefa>",Estudar o bloco da semana|Fazer os exercícios|Registrar as horas,Todo o edital estiver estudado e 1 simulado completo feito.,Registro de horas e notas de simulado.,estudos|projetos,,TSK-0052,Titular,Alta,15/01/2027,"40,0 horas",Não iniciada,DEC-07
TSK-0062,CLU-10,Carreira na Europa,Otimizar o perfil do LinkedIn e iniciar a linha editorial,otimizar,Abrir o perfil do LinkedIn e copiar o título atual.,Perfil em inglês alinhado aos cargos-alvo e primeiro post da linha editorial publicado.,Cobre o perfil e o primeiro post.,Perfil atualizado + 1 post.,"Estimativa de 4,0h dentro da janela 01/12/2026 a 05/01/2027, cuja capacidade de execução é 165,9h.",Os recrutadores na Europa consultam o LinkedIn.,De 01/12/2026 até 11/12/2026.,"<tarefa id=""TSK-0062"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Carreira na Europa. Prepara a realocação profissional na Europa: certificações, portfólio, presença e candidaturas.</contexto>
  <objetivo>Perfil em inglês alinhado aos cargos-alvo e primeiro post da linha editorial publicado.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0050 (Planejar a estratégia de realocação profissional na Europa). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre o perfil e o primeiro post.</restricoes>
  <passos>
    Reescrever título e resumo.
    Atualizar experiências.
    Publicar o primeiro post.
  </passos>
  <criterio_de_conclusao>O perfil estiver atualizado e o primeiro post publicado.</criterio_de_conclusao>
  <formato_de_saida>Link do perfil e do post. Prazo: 11/12/2026. Tempo previsto: 4,0h.</formato_de_saida>
  <evidencia_esperada>Link do perfil e do post.</evidencia_esperada>
</tarefa>",Reescrever título e resumo|Atualizar experiências|Publicar o primeiro post,O perfil estiver atualizado e o primeiro post publicado.,Link do perfil e do post.,linkedin|editorial|carreira,,TSK-0050,Titular,Média,11/12/2026,"4,0 horas",Não iniciada,DEC-10
TSK-0063,CLU-10,Carreira na Europa,Fazer o contato estratégico com o profissional na Holanda,contatar,Escrever em três linhas o que propor ao profissional.,Contato feito e próximo passo combinado para soluções personalizadas.,Cobre o primeiro contato.,Mensagem enviada e resposta registrada.,"Estimativa de 2,0h dentro da janela 01/12/2026 a 05/01/2027, cuja capacidade de execução é 165,9h.",Abre uma frente de soluções personalizadas na Holanda.,De 07/12/2026 até 15/12/2026.,"<tarefa id=""TSK-0063"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Carreira na Europa. Prepara a realocação profissional na Europa: certificações, portfólio, presença e candidaturas.</contexto>
  <objetivo>Contato feito e próximo passo combinado para soluções personalizadas.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre o primeiro contato.</restricoes>
  <passos>
    Preparar a proposta curta.
    Enviar a mensagem.
    Registrar a resposta.
  </passos>
  <criterio_de_conclusao>A mensagem estiver enviada e a resposta registrada.</criterio_de_conclusao>
  <formato_de_saida>Registro do contato. Prazo: 15/12/2026. Tempo previsto: 2,0h.</formato_de_saida>
  <evidencia_esperada>Registro do contato.</evidencia_esperada>
  <lacunas_conhecidas>Identidade do profissional. Não preencher com valor inventado.</lacunas_conhecidas>
</tarefa>",Preparar a proposta curta|Enviar a mensagem|Registrar a resposta,A mensagem estiver enviada e a resposta registrada.,Registro do contato.,networking|holanda,,,Titular,Média,15/12/2026,"2,0 horas",Não iniciada,DEC-10
TSK-0064,CLU-10,Carreira na Europa,Estudar gestão de processos conforme o plano de estudos,estudar,Abrir o plano de estudos na semana atual.,"Conteúdo do edital de processos estudado, com simulados feitos.",Cobre o estudo de processos.,Horas cumpridas e simulados registrados.,"Estimativa de 30,0h dentro da janela 01/12/2026 a 05/01/2027, cuja capacidade de execução é 165,9h.",Prepara a segunda certificação.,De 15/12/2026 até 15/02/2027.,"<tarefa id=""TSK-0064"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Carreira na Europa. Prepara a realocação profissional na Europa: certificações, portfólio, presença e candidaturas.</contexto>
  <objetivo>Conteúdo do edital de processos estudado, com simulados feitos.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0052 (Montar o plano de estudos com autoestudo, cursos e simulados). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre o estudo de processos.</restricoes>
  <passos>
    Estudar o bloco da semana.
    Fazer os exercícios.
    Registrar as horas.
  </passos>
  <criterio_de_conclusao>Todo o edital estiver estudado e 1 simulado completo feito.</criterio_de_conclusao>
  <formato_de_saida>Registro de horas e notas. Prazo: 15/02/2027. Tempo previsto: 30,0h.</formato_de_saida>
  <evidencia_esperada>Registro de horas e notas.</evidencia_esperada>
</tarefa>",Estudar o bloco da semana|Fazer os exercícios|Registrar as horas,Todo o edital estiver estudado e 1 simulado completo feito.,Registro de horas e notas.,estudos|processos,,TSK-0052,Titular,Alta,15/02/2027,"30,0 horas",Não iniciada,DEC-07
TSK-0065,CLU-10,Carreira na Europa,Publicar um post semanal da linha editorial sobre riscos cognitivos no LinkedIn,publicar,Abrir a lista de temas da linha editorial.,Um post por semana publicado de 15/12 a 30/03.,Cobre a cadência semanal.,1 post por semana.,"Estimativa de 15,0h dentro da janela 01/12/2026 a 05/01/2027, cuja capacidade de execução é 165,9h.",Constrói autoridade para as candidaturas.,De 15/12/2026 até 30/03/2027.,"<tarefa id=""TSK-0065"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Carreira na Europa. Prepara a realocação profissional na Europa: certificações, portfólio, presença e candidaturas.</contexto>
  <objetivo>Um post por semana publicado de 15/12 a 30/03.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0062 (Otimizar o perfil do LinkedIn e iniciar a linha editorial). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre a cadência semanal.</restricoes>
  <passos>
    Escolher o tema da semana.
    Escrever o post.
    Publicar.
  </passos>
  <criterio_de_conclusao>Houver um post por semana no período.</criterio_de_conclusao>
  <formato_de_saida>Links dos posts. Prazo: 30/03/2027. Tempo previsto: 15,0h.</formato_de_saida>
  <evidencia_esperada>Links dos posts.</evidencia_esperada>
</tarefa>",Escolher o tema da semana|Escrever o post|Publicar,Houver um post por semana no período.,Links dos posts.,linkedin|editorial,,TSK-0062,Titular,Média,30/03/2027,"15,0 horas",Não iniciada,DEC-10
TSK-0066,CLU-10,Carreira na Europa,Fazer o simulado final e a prova de gestão de projetos,fazer,Abrir o portal oficial da certificação e conferir as datas de prova.,Prova de gestão de projetos realizada.,"Cobre simulado final, inscrição e prova.",Prova realizada e resultado registrado.,"Estimativa de 10,0h dentro da janela 06/01/2027 a 30/03/2027, cuja capacidade de execução é 407,0h.",Primeira certificação do épico.,TBD — janela recomendada 16/01/2027 a 31/01/2027; data exata depende do calendário oficial.,"<tarefa id=""TSK-0066"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Carreira na Europa. Prepara a realocação profissional na Europa: certificações, portfólio, presença e candidaturas.</contexto>
  <objetivo>Prova de gestão de projetos realizada.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0061 (Estudar gestão de projetos conforme o plano de estudos). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre simulado final, inscrição e prova.</restricoes>
  <passos>
    Fazer o simulado final.
    Inscrever-se na prova.
    Fazer a prova.
  </passos>
  <criterio_de_conclusao>A prova estiver realizada e o resultado registrado.</criterio_de_conclusao>
  <formato_de_saida>Comprovante de inscrição e resultado. Prazo: TBD. Tempo previsto: 10,0h.</formato_de_saida>
  <evidencia_esperada>Comprovante de inscrição e resultado.</evidencia_esperada>
  <lacunas_conhecidas>Data da prova; Prazo exato TBD. Não preencher com valor inventado.</lacunas_conhecidas>
</tarefa>",Fazer o simulado final|Inscrever-se na prova|Fazer a prova,A prova estiver realizada e o resultado registrado.,Comprovante de inscrição e resultado.,certificacao|projetos|prova,,TSK-0061,Titular,Alta,TBD,"10,0 horas",Não iniciada,DEC-07
TSK-0067,CLU-10,Carreira na Europa,"Montar o portfólio profissional com as soluções, os produtos e os apps da Clean Sea",montar,Listar os produtos do EXECUTAR e os apps feitos para a Clean Sea.,"Portfólio publicado com casos, produtos e apps (Clean Sea e outra empresa a definir).",Cobre o portfólio.,Portfólio com pelo menos 1 caso por produto ou app listado.,"Estimativa de 12,0h dentro da janela 06/01/2027 a 30/03/2027, cuja capacidade de execução é 407,0h.",É a prova prática para as candidaturas.,De 06/01/2027 até 31/01/2027.,"<tarefa id=""TSK-0067"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Carreira na Europa. Prepara a realocação profissional na Europa: certificações, portfólio, presença e candidaturas.</contexto>
  <objetivo>Portfólio publicado com casos, produtos e apps (Clean Sea e outra empresa a definir).</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre o portfólio.</restricoes>
  <passos>
    Selecionar os casos.
    Escrever cada caso.
    Publicar o portfólio.
  </passos>
  <criterio_de_conclusao>O portfólio estiver publicado.</criterio_de_conclusao>
  <formato_de_saida>Link do portfólio. Prazo: 31/01/2027. Tempo previsto: 12,0h.</formato_de_saida>
  <evidencia_esperada>Link do portfólio.</evidencia_esperada>
  <lacunas_conhecidas>Autorização da Clean Sea e segunda empresa. Não preencher com valor inventado.</lacunas_conhecidas>
</tarefa>",Selecionar os casos|Escrever cada caso|Publicar o portfólio,O portfólio estiver publicado.,Link do portfólio.,portfolio|carreira|clean-sea,,,Titular,Alta,31/01/2027,"12,0 horas",Não iniciada,DEC-08
TSK-0068,CLU-10,Carreira na Europa,Criar a landing page profissional e atualizar as redes sociais,criar,Abrir o portfólio e escolher a frase de apresentação.,Landing page profissional publicada e redes atualizadas com o mesmo posicionamento.,Cobre landing e redes.,Landing publicada + redes atualizadas.,"Estimativa de 6,0h dentro da janela 06/01/2027 a 30/03/2027, cuja capacidade de execução é 407,0h.",Dá um endereço único para recrutadores.,De 12/01/2027 até 31/01/2027.,"<tarefa id=""TSK-0068"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Carreira na Europa. Prepara a realocação profissional na Europa: certificações, portfólio, presença e candidaturas.</contexto>
  <objetivo>Landing page profissional publicada e redes atualizadas com o mesmo posicionamento.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0067 (Montar o portfólio profissional com as soluções, os produtos e os apps da Clean Sea). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre landing e redes.</restricoes>
  <passos>
    Escrever a landing.
    Publicar.
    Atualizar as redes.
  </passos>
  <criterio_de_conclusao>A landing estiver publicada e as redes atualizadas.</criterio_de_conclusao>
  <formato_de_saida>Links. Prazo: 31/01/2027. Tempo previsto: 6,0h.</formato_de_saida>
  <evidencia_esperada>Links.</evidencia_esperada>
</tarefa>",Escrever a landing|Publicar|Atualizar as redes,A landing estiver publicada e as redes atualizadas.,Links.,landing-page|carreira|redes,,TSK-0067,Titular,Alta,31/01/2027,"6,0 horas",Não iniciada,DEC-07
TSK-0069,CLU-10,Carreira na Europa,Escrever o currículo no padrão europeu e a carta-modelo,escrever,Abrir o modelo de currículo europeu e copiar as experiências atuais.,Currículo em inglês no padrão europeu e carta-modelo prontos.,Cobre currículo e carta-modelo.,2 documentos revisados.,"Estimativa de 4,0h dentro da janela 06/01/2027 a 30/03/2027, cuja capacidade de execução é 407,0h.",Necessários para as candidaturas a partir de 01/02.,De 12/01/2027 até 25/01/2027.,"<tarefa id=""TSK-0069"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Carreira na Europa. Prepara a realocação profissional na Europa: certificações, portfólio, presença e candidaturas.</contexto>
  <objetivo>Currículo em inglês no padrão europeu e carta-modelo prontos.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre currículo e carta-modelo.</restricoes>
  <passos>
    Montar o currículo.
    Escrever a carta-modelo.
    Revisar.
  </passos>
  <criterio_de_conclusao>Os 2 documentos estiverem revisados.</criterio_de_conclusao>
  <formato_de_saida>Arquivos PDF. Prazo: 25/01/2027. Tempo previsto: 4,0h.</formato_de_saida>
  <evidencia_esperada>Arquivos PDF.</evidencia_esperada>
</tarefa>",Montar o currículo|Escrever a carta-modelo|Revisar,Os 2 documentos estiverem revisados.,Arquivos PDF.,curriculo|carreira,,,Titular,Alta,25/01/2027,"4,0 horas",Não iniciada,DEC-07
TSK-0070,CLU-10,Carreira na Europa,Propor uma pauta sobre riscos cognitivos ao editor da Frankwatching,propor,Abrir as diretrizes para autores convidados da Frankwatching.,Proposta de pauta enviada ao editor.,Cobre a proposta.,Proposta enviada e registrada.,"Estimativa de 4,0h dentro da janela 06/01/2027 a 30/03/2027, cuja capacidade de execução é 407,0h.",A linha editorial estratégica dá visibilidade no mercado holandês.,De 15/01/2027 até 31/01/2027.,"<tarefa id=""TSK-0070"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Carreira na Europa. Prepara a realocação profissional na Europa: certificações, portfólio, presença e candidaturas.</contexto>
  <objetivo>Proposta de pauta enviada ao editor.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0062 (Otimizar o perfil do LinkedIn e iniciar a linha editorial). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre a proposta.</restricoes>
  <passos>
    Ler as diretrizes.
    Escrever a proposta.
    Enviar.
  </passos>
  <criterio_de_conclusao>A proposta estiver enviada.</criterio_de_conclusao>
  <formato_de_saida>Registro do envio. Prazo: 31/01/2027. Tempo previsto: 4,0h.</formato_de_saida>
  <evidencia_esperada>Registro do envio.</evidencia_esperada>
  <lacunas_conhecidas>Requisitos editoriais e idioma da Frankwatching. Não preencher com valor inventado.</lacunas_conhecidas>
</tarefa>",Ler as diretrizes|Escrever a proposta|Enviar,A proposta estiver enviada.,Registro do envio.,frankwatching|editorial|holanda,,TSK-0062,Titular,Média,31/01/2027,"4,0 horas",Não iniciada,DEC-10
TSK-0071,CLU-10,Carreira na Europa,Estudar governança de IA conforme o plano de estudos,estudar,Abrir o plano de estudos na semana atual.,"Conteúdo do edital de governança de IA estudado, com simulados feitos.",Cobre o estudo de governança de IA.,Horas cumpridas e simulados registrados.,"Estimativa de 35,0h dentro da janela 06/01/2027 a 30/03/2027, cuja capacidade de execução é 407,0h.",Prepara a terceira certificação.,De 15/01/2027 até 10/03/2027.,"<tarefa id=""TSK-0071"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Carreira na Europa. Prepara a realocação profissional na Europa: certificações, portfólio, presença e candidaturas.</contexto>
  <objetivo>Conteúdo do edital de governança de IA estudado, com simulados feitos.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0052 (Montar o plano de estudos com autoestudo, cursos e simulados). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre o estudo de governança de IA.</restricoes>
  <passos>
    Estudar o bloco da semana.
    Fazer os exercícios.
    Registrar as horas.
  </passos>
  <criterio_de_conclusao>Todo o edital estiver estudado e 1 simulado completo feito.</criterio_de_conclusao>
  <formato_de_saida>Registro de horas e notas. Prazo: 10/03/2027. Tempo previsto: 35,0h.</formato_de_saida>
  <evidencia_esperada>Registro de horas e notas.</evidencia_esperada>
</tarefa>",Estudar o bloco da semana|Fazer os exercícios|Registrar as horas,Todo o edital estiver estudado e 1 simulado completo feito.,Registro de horas e notas.,estudos|governanca-ia,,TSK-0052,Titular,Alta,10/03/2027,"35,0 horas",Não iniciada,DEC-07
TSK-0072,CLU-10,Carreira na Europa,"Decidir se portfólio, currículo e LinkedIn estão prontos para as candidaturas",decidir,"Abrir portfólio, currículo e LinkedIn lado a lado.",Decisão registrada de iniciar as candidaturas em 01/02.,Cobre só a decisão.,Decisão escrita.,"Estimativa de 0,5h dentro da janela 06/01/2027 a 30/03/2027, cuja capacidade de execução é 407,0h.",Ponto de decisão antes das candidaturas.,Em 31/01/2027.,"<tarefa id=""TSK-0072"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Carreira na Europa. Prepara a realocação profissional na Europa: certificações, portfólio, presença e candidaturas.</contexto>
  <objetivo>Decisão registrada de iniciar as candidaturas em 01/02.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0068 (Criar a landing page profissional e atualizar as redes sociais). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre só a decisão.</restricoes>
  <passos>
    Conferir os três itens.
    Decidir.
    Registrar.
  </passos>
  <criterio_de_conclusao>A decisão estiver registrada.</criterio_de_conclusao>
  <formato_de_saida>Nota de decisão. Prazo: 31/01/2027. Tempo previsto: 0,5h.</formato_de_saida>
  <evidencia_esperada>Nota de decisão.</evidencia_esperada>
</tarefa>",Conferir os três itens|Decidir|Registrar,A decisão estiver registrada.,Nota de decisão.,decisao|carreira,,TSK-0068,Titular,Alta,31/01/2027,"0,5 horas",Não iniciada,DEC-03
TSK-0073,CLU-10,Carreira na Europa,Enviar candidaturas a vagas na Europa de 01/02 a 30/03,enviar,Abrir a lista de vagas salvas da semana.,Candidaturas enviadas e registradas toda semana.,Cobre as candidaturas do período.,Número de candidaturas por semana registrado (meta a definir).,"Estimativa de 34,0h dentro da janela 06/01/2027 a 30/03/2027, cuja capacidade de execução é 407,0h.",Objetivo final do épico de emprego.,De 01/02/2027 até 30/03/2027.,"<tarefa id=""TSK-0073"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Carreira na Europa. Prepara a realocação profissional na Europa: certificações, portfólio, presença e candidaturas.</contexto>
  <objetivo>Candidaturas enviadas e registradas toda semana.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0072 (Decidir se portfólio, currículo e LinkedIn estão prontos para as candidaturas). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre as candidaturas do período.</restricoes>
  <passos>
    Selecionar as vagas da semana.
    Adaptar currículo e carta.
    Enviar e registrar.
  </passos>
  <criterio_de_conclusao>Houver registro semanal de candidaturas de 01/02 a 30/03.</criterio_de_conclusao>
  <formato_de_saida>Planilha de candidaturas. Prazo: 30/03/2027. Tempo previsto: 34,0h.</formato_de_saida>
  <evidencia_esperada>Planilha de candidaturas.</evidencia_esperada>
  <lacunas_conhecidas>Meta de candidaturas por semana. Não preencher com valor inventado.</lacunas_conhecidas>
</tarefa>",Selecionar as vagas da semana|Adaptar currículo e carta|Enviar e registrar,Houver registro semanal de candidaturas de 01/02 a 30/03.,Planilha de candidaturas.,candidaturas|carreira|europa,,TSK-0072,Titular,Alta,30/03/2027,"34,0 horas",Não iniciada,DEC-03
TSK-0074,CLU-10,Carreira na Europa,Submeter o primeiro artigo à Frankwatching,submeter,Abrir a resposta do editor à proposta de pauta.,Artigo submetido conforme as diretrizes do editor.,Cobre o primeiro artigo.,Artigo submetido.,"Estimativa de 6,0h dentro da janela 06/01/2027 a 30/03/2027, cuja capacidade de execução é 407,0h.",Consolida a linha editorial estratégica.,De 01/02/2027 até 28/02/2027.,"<tarefa id=""TSK-0074"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Carreira na Europa. Prepara a realocação profissional na Europa: certificações, portfólio, presença e candidaturas.</contexto>
  <objetivo>Artigo submetido conforme as diretrizes do editor.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0070 (Propor uma pauta sobre riscos cognitivos ao editor da Frankwatching). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre o primeiro artigo.</restricoes>
  <passos>
    Redigir o artigo.
    Revisar conforme as diretrizes.
    Submeter.
  </passos>
  <criterio_de_conclusao>O artigo estiver submetido.</criterio_de_conclusao>
  <formato_de_saida>Registro da submissão. Prazo: 28/02/2027. Tempo previsto: 6,0h.</formato_de_saida>
  <evidencia_esperada>Registro da submissão.</evidencia_esperada>
  <lacunas_conhecidas>Aceite da pauta pelo editor. Não preencher com valor inventado.</lacunas_conhecidas>
</tarefa>",Redigir o artigo|Revisar conforme as diretrizes|Submeter,O artigo estiver submetido.,Registro da submissão.,frankwatching|artigo,,TSK-0070,Titular,Média,28/02/2027,"6,0 horas",Não iniciada,DEC-10
TSK-0075,CLU-10,Carreira na Europa,Fazer o simulado final e a prova de gestão de processos,fazer,Abrir o portal oficial da certificação e conferir as datas.,Prova de processos realizada.,"Cobre simulado final, inscrição e prova.",Prova realizada e resultado registrado.,"Estimativa de 10,0h dentro da janela 06/01/2027 a 30/03/2027, cuja capacidade de execução é 407,0h.",Segunda certificação do épico.,TBD — janela recomendada 16/02/2027 a 28/02/2027; data exata depende do calendário oficial.,"<tarefa id=""TSK-0075"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Carreira na Europa. Prepara a realocação profissional na Europa: certificações, portfólio, presença e candidaturas.</contexto>
  <objetivo>Prova de processos realizada.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0064 (Estudar gestão de processos conforme o plano de estudos). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre simulado final, inscrição e prova.</restricoes>
  <passos>
    Fazer o simulado final.
    Inscrever-se.
    Fazer a prova.
  </passos>
  <criterio_de_conclusao>A prova estiver realizada.</criterio_de_conclusao>
  <formato_de_saida>Comprovante e resultado. Prazo: TBD. Tempo previsto: 10,0h.</formato_de_saida>
  <evidencia_esperada>Comprovante e resultado.</evidencia_esperada>
  <lacunas_conhecidas>Data da prova; Prazo exato TBD. Não preencher com valor inventado.</lacunas_conhecidas>
</tarefa>",Fazer o simulado final|Inscrever-se|Fazer a prova,A prova estiver realizada.,Comprovante e resultado.,certificacao|processos|prova,,TSK-0064,Titular,Alta,TBD,"10,0 horas",Não iniciada,DEC-07
TSK-0076,CLU-10,Carreira na Europa,Fazer o simulado final e a prova de governança de IA,fazer,Abrir o portal oficial da certificação e conferir as datas.,Prova de governança de IA realizada.,"Cobre simulado final, inscrição e prova.",Prova realizada e resultado registrado.,"Estimativa de 10,0h dentro da janela 06/01/2027 a 30/03/2027, cuja capacidade de execução é 407,0h.",Terceira certificação do épico.,TBD — janela recomendada 11/03/2027 a 25/03/2027; data exata depende do calendário oficial.,"<tarefa id=""TSK-0076"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Carreira na Europa. Prepara a realocação profissional na Europa: certificações, portfólio, presença e candidaturas.</contexto>
  <objetivo>Prova de governança de IA realizada.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0071 (Estudar governança de IA conforme o plano de estudos). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre simulado final, inscrição e prova.</restricoes>
  <passos>
    Fazer o simulado final.
    Inscrever-se.
    Fazer a prova.
  </passos>
  <criterio_de_conclusao>A prova estiver realizada.</criterio_de_conclusao>
  <formato_de_saida>Comprovante e resultado. Prazo: TBD. Tempo previsto: 10,0h.</formato_de_saida>
  <evidencia_esperada>Comprovante e resultado.</evidencia_esperada>
  <lacunas_conhecidas>Data da prova; Prazo exato TBD. Não preencher com valor inventado.</lacunas_conhecidas>
</tarefa>",Fazer o simulado final|Inscrever-se|Fazer a prova,A prova estiver realizada.,Comprovante e resultado.,certificacao|governanca-ia|prova,,TSK-0071,Titular,Alta,TBD,"10,0 horas",Não iniciada,DEC-07
TSK-0077,CLU-10,Carreira na Europa,Encerrar o épico de emprego e decidir os próximos passos da viagem,encerrar,Abrir a planilha de candidaturas e os resultados das provas.,Balanço do épico e decisão registrada sobre a viagem de 30/04.,Cobre o encerramento.,Balanço + decisão escrita.,"Estimativa de 1,0h dentro da janela 06/01/2027 a 30/03/2027, cuja capacidade de execução é 407,0h.",Fecha o épico em 30/03.,Em 30/03/2027.,"<tarefa id=""TSK-0077"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Carreira na Europa. Prepara a realocação profissional na Europa: certificações, portfólio, presença e candidaturas.</contexto>
  <objetivo>Balanço do épico e decisão registrada sobre a viagem de 30/04.</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0073 (Enviar candidaturas a vagas na Europa de 01/02 a 30/03). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre o encerramento.</restricoes>
  <passos>
    Consolidar resultados.
    Decidir os próximos passos.
    Registrar.
  </passos>
  <criterio_de_conclusao>O balanço e a decisão estiverem registrados.</criterio_de_conclusao>
  <formato_de_saida>Documento de encerramento. Prazo: 30/03/2027. Tempo previsto: 1,0h.</formato_de_saida>
  <evidencia_esperada>Documento de encerramento.</evidencia_esperada>
</tarefa>",Consolidar resultados|Decidir os próximos passos|Registrar,O balanço e a decisão estiverem registrados.,Documento de encerramento.,encerramento|carreira|decisao,,TSK-0073,Titular,Alta,30/03/2027,"1,0 horas",Não iniciada,DEC-03
TSK-0078,CLU-10,Carreira na Europa,Preparar a documentação e a logística da viagem de 30/04,preparar,Listar os documentos exigidos pelo país de destino.,"Checklist de viagem concluído (documentos, passagens, hospedagem).",Cobre a preparação da viagem.,Checklist 100% marcado.,"Estimativa de 6,0h dentro da janela 31/03/2027 a 30/04/2027, cuja capacidade de execução é 150,3h.",A viagem é o marco final do período.,De 31/03/2027 até 25/04/2027.,"<tarefa id=""TSK-0078"">
  <contexto>Programa EXECUTAR — lançamento do ecossistema riscocognitivo.org (gestão de riscos cognitivos para pessoas neurodivergentes) e realocação profissional do titular na Europa. Frente: Carreira na Europa. Prepara a realocação profissional na Europa: certificações, portfólio, presença e candidaturas.</contexto>
  <objetivo>Checklist de viagem concluído (documentos, passagens, hospedagem).</objetivo>
  <entrada>Nenhuma entrada externa requerida além deste prompt.</entrada>
  <restricoes>Bloqueio: só começar depois de concluída a tarefa TSK-0077 (Encerrar o épico de emprego e decidir os próximos passos da viagem). Não inventar dados: o que não existir fica TBD. Conteúdo educativo: sem diagnóstico, sem promessa de cura, sem tom de coach. Português do Brasil. Escopo: Cobre a preparação da viagem.</restricoes>
  <passos>
    Listar os documentos exigidos.
    Providenciar os documentos.
    Reservar passagem e hospedagem.
  </passos>
  <criterio_de_conclusao>O checklist estiver 100% marcado.</criterio_de_conclusao>
  <formato_de_saida>Checklist e comprovantes. Prazo: 25/04/2027. Tempo previsto: 6,0h.</formato_de_saida>
  <evidencia_esperada>Checklist e comprovantes.</evidencia_esperada>
  <lacunas_conhecidas>Destino e exigências de visto. Não preencher com valor inventado.</lacunas_conhecidas>
</tarefa>",Listar os documentos exigidos|Providenciar os documentos|Reservar passagem e hospedagem,O checklist estiver 100% marcado.,Checklist e comprovantes.,viagem|documentacao,,TSK-0077,Titular,Alta,25/04/2027,"6,0 horas",Não iniciada,DEC-03
```

## 11. Visão Diária de Baixa Carga Cognitiva

Dias ativos de 17/10/2026 a 05/01/2027 (domingos e feriados fora). Após 05/01, a visão semanal (§9) é a adequada: as tarefas do épico de emprego são blocos recorrentes de estudo e candidatura. Bloco de tempo: a janela de maior energia não foi informada (GAP-02).

| Data | Fluxo principal | Passo 1 | Passo 2 | Passo 3 | Entregável esperado | Bloco de tempo | Validação de fim de dia |
|---|---|---|---|---|---|---|---|
| 17/10/2026 (sáb) | TSK-0001 — Confirmar a capacidade semanal real e o escopo do lançamento de 05/11 | Abrir a tabela de capacidade deste plano e anotar quantas horas por dia estão realmente disponíveis até 04/11. | TSK-0003: Abrir o repositório Design e listar as pastas apps/, apps/site/content/articles e plugins/. | Registrar a decisão e a data | TSK-0001 concluída | 1 bloco de 90 min (sábado leve) | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 19/10/2026 (seg) | TSK-0002 — Registrar o EPIC 01, a Campanha 02 e o EPIC Emprego no GitHub e no workbook | Abrir o repositório workbook e ler a regra de tripla clonagem em 500_Copiloto_templates/regras/OPERACOES.md. | TSK-0003: Abrir o repositório Design e listar as pastas apps/, apps/site/content/articles e plugins/. | TSK-0004: Verificar o registro do domínio | TSK-0002 concluída; TSK-0003 concluída | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 20/10/2026 (ter) | TSK-0004 — Confirmar o domínio riscocognitivo.org, o DNS e a hospedagem na Cloudflare | Entrar no painel da Cloudflare e procurar o domínio riscocognitivo.org na lista de sites. | TSK-0005: Abrir o arquivo EXECUTAR_rotas.csv e filtrar as rotas públicas. | TSK-0006: Listar as perguntas de cada artigo | TSK-0004 concluída; TSK-0005 concluída | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 21/10/2026 (qua) | TSK-0006 — Pesquisar evidências citáveis para o artigo fundador e os quatro artigos pilares | Abrir um documento novo e escrever as cinco perguntas centrais dos artigos. | TSK-0007: Abrir o arquivo manifesto.mdx do site e ler do início ao fim. | TSK-0017: Listar os produtos | TSK-0006 concluída | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 22/10/2026 (qui) | TSK-0007 — Revisar o Manifesto e escrever as metaexplicações da home | Abrir o arquivo manifesto.mdx do site e ler do início ao fim. | TSK-0017: Listar os 6 produtos da loja e anotar, ao lado de cada um, onde ele é vendido hoje. | TSK-0018: Criar as coleções | TSK-0007 concluída | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 23/10/2026 (sex) | TSK-0017 — Definir o checkout e os links de afiliado reais da loja | Listar os 6 produtos da loja e anotar, ao lado de cada um, onde ele é vendido hoje. | TSK-0018: Entrar no CMS do site e abrir a área de administração de conteúdos. | TSK-0009: Estruturar os 11 blocos | TSK-0017 concluída; TSK-0018 concluída | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 24/10/2026 (sáb) | TSK-0009 — Escrever o artigo fundador (Peça 01): neurodivergência, demandas cognitivas e soluções | Abrir o mapa de evidências e escrever o gancho de abertura com um dado. | TSK-0010: Abrir a rota /blog no ambiente de teste e listar o que falta em relação ao mapa de rotas. | TSK-0008: Montar as seções da home | TSK-0009 concluída; TSK-0010 concluída | 1 bloco de 90 min (sábado leve) | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 26/10/2026 (seg) | TSK-0008 — Construir a home premium de conversão com o Manifesto e as principais funcionalidades | Abrir o kit de interface do site no design system e copiar a seção de apresentação. | TSK-0012: Abrir a versão atual do Prisma e anotar o que impede o uso por um visitante sem login. | TSK-0011: Definir os itens de cada bloco | TSK-0008 concluída | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 27/10/2026 (ter) | TSK-0012 — Empacotar o Prisma standalone para acesso público | Abrir a versão atual do Prisma e anotar o que impede o uso por um visitante sem login. | TSK-0013: Abrir a rota /apps no ambiente de teste. | TSK-0011: Definir os itens de cada bloco | TSK-0012 concluída | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 28/10/2026 (qua) | TSK-0013 — Publicar o catálogo de apps com o Prisma e a página de cada app disponível | Abrir a rota /apps no ambiente de teste. | TSK-0011: Desenhar no papel os quatro blocos do mapa: funções executivas, cognição, neurodivergência e matriz de riscos. | TSK-0014: Escolher o déficit de cada template | TSK-0013 concluída | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 29/10/2026 (qui) | TSK-0011 — Construir o mapa cognitivo simplificado com home e landing próprias | Desenhar no papel os quatro blocos do mapa: funções executivas, cognição, neurodivergência e matriz de riscos. | TSK-0014: Listar os três déficits executivos mais citados no mapa de evidências. | TSK-0015: Cadastrar os templates no CMS | TSK-0011 concluída; TSK-0014 concluída | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 30/10/2026 (sex) | TSK-0015 — Publicar o catálogo de ferramentas com filtros e download dos templates | Abrir a rota /ferramentas no ambiente de teste. | TSK-0019: Abrir a rota /loja no ambiente de teste. | TSK-0020: Escrever os textos curtos | TSK-0015 concluída; TSK-0019 concluída; TSK-0020 concluída | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 31/10/2026 (sáb) | TSK-0016 — Escrever o e-book 1: Operações e Neurodivergência | Abrir o artigo fundador e listar os tópicos que o e-book vai aprofundar. | TSK-0021: Abrir o Prisma e anotar as 3 telas que melhor mostram o produto. | TSK-0024: Aplicar o checklist de estilo | TSK-0016 concluída; TSK-0021 concluída; TSK-0024 concluída | 1 bloco de 90 min (sábado leve) | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 03/11/2026 (ter) | TSK-0025 — Configurar a medição do site, dos links e da newsletter | Abrir o painel de Analytics da Cloudflare do site. | TSK-0026: Abrir o site de teste no celular e seguir a lista de rotas do lançamento. | Testar cada métrica | TSK-0025 concluída | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 04/11/2026 (qua) | TSK-0026 — Testar o site completo antes do lançamento | Abrir o site de teste no celular e seguir a lista de rotas do lançamento. | TSK-0027: Abrir a lista de testes do site e o calendário de agendamento. | Registrar o resultado | TSK-0026 concluída; TSK-0027 concluída | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 05/11/2026 (qui) | TSK-0028 — Publicar o riscocognitivo.org e acompanhar o dia do lançamento | Abrir o painel da Cloudflare e conferir a versão que vai para produção. | TSK-0029: Abrir o mapa de evidências na seção deste pilar. | Registrar problemas do dia | TSK-0028 concluída | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 06/11/2026 (sex) | TSK-0029 — Escrever o artigo pilar sobre gestão de riscos, projetos e processos neuroadaptados | Abrir o mapa de evidências na seção deste pilar. | TSK-0031: Escrever as 5 perguntas de autoavaliação que a ferramenta vai fazer. | TSK-0033: Roteirizar | Avanço registrado em TSK-0029 | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 07/11/2026 (sáb) | TSK-0029 — Escrever o artigo pilar sobre gestão de riscos, projetos e processos neuroadaptados | Abrir o mapa de evidências na seção deste pilar. | TSK-0031: Escrever as 5 perguntas de autoavaliação que a ferramenta vai fazer. | TSK-0033: Roteirizar | TSK-0029 concluída | 1 bloco de 90 min (sábado leve) | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 09/11/2026 (seg) | TSK-0031 — Criar a ferramenta de metacognição | Escrever as 5 perguntas de autoavaliação que a ferramenta vai fazer. | TSK-0033: Abrir o artigo fundador e marcar os 5 pontos do roteiro. | TSK-0030: Estruturar os blocos | Avanço registrado em TSK-0031 | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 10/11/2026 (ter) | TSK-0031 — Criar a ferramenta de metacognição | Escrever as 5 perguntas de autoavaliação que a ferramenta vai fazer. | TSK-0033: Abrir o artigo fundador e marcar os 5 pontos do roteiro. | TSK-0030: Estruturar os blocos | TSK-0031 concluída; TSK-0033 concluída | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 11/11/2026 (qua) | TSK-0030 — Escrever o artigo pilar sobre funções executivas | Abrir o mapa de evidências na seção de funções executivas. | TSK-0032: Abrir os 3 templates já publicados e listar os déficits ainda sem template. | TSK-0034: Roteirizar | TSK-0030 concluída | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 12/11/2026 (qui) | TSK-0032 — Completar a família de templates por déficit executivo | Abrir os 3 templates já publicados e listar os déficits ainda sem template. | TSK-0034: Abrir o artigo pilar de gestão de riscos e marcar os pontos do roteiro. | TSK-0035: Ajustar o acesso de cada app | Avanço registrado em TSK-0032 | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 13/11/2026 (sex) | TSK-0032 — Completar a família de templates por déficit executivo | Abrir os 3 templates já publicados e listar os déficits ainda sem template. | TSK-0034: Abrir o artigo pilar de gestão de riscos e marcar os pontos do roteiro. | TSK-0035: Ajustar o acesso de cada app | TSK-0032 concluída; TSK-0034 concluída; TSK-0035 concluída | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 14/11/2026 (sáb) | TSK-0039 — Consolidar os dados da campanha 01 em um relatório de aprendizado | Abrir o painel de Analytics e exportar os dados de 05/11 até hoje. | TSK-0036: Abrir o artigo pilar de funções executivas e listar os tópicos do e-book. | TSK-0037: Marcar os trechos das peças novas | TSK-0039 concluída; TSK-0036 concluída; TSK-0037 concluída; TSK-0038 concluída | 1 bloco de 90 min (sábado leve) | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 16/11/2026 (seg) | TSK-0041 — Planejar a campanha 02 a partir dos dados da campanha 01 | Abrir o relatório de aprendizado da campanha 01. | TSK-0043: Escrever em uma frase a definição de dark partners usada pelo EXECUTAR. | TSK-0045: Montar o sumário | Avanço registrado em TSK-0041 | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 17/11/2026 (ter) | TSK-0041 — Planejar a campanha 02 a partir dos dados da campanha 01 | Abrir o relatório de aprendizado da campanha 01. | TSK-0043: Escrever em uma frase a definição de dark partners usada pelo EXECUTAR. | TSK-0045: Montar o sumário | TSK-0041 concluída | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 18/11/2026 (qua) | TSK-0043 — Escrever o artigo pilar sobre dark partners | Escrever em uma frase a definição de dark partners usada pelo EXECUTAR. | TSK-0045: Abrir o artigo pilar de ambientes e listar os tópicos do e-book. | TSK-0042: Produzir a peça-mãe | TSK-0043 concluída | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 19/11/2026 (qui) | TSK-0050 — Planejar a estratégia de realocação profissional na Europa | Escrever em uma página: país-alvo, cargos-alvo e data da viagem. | TSK-0044: Abrir o mapa de evidências na seção de ambientes. | TSK-0045: Montar o sumário | Avanço registrado em TSK-0050 | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 21/11/2026 (sáb) | TSK-0050 — Planejar a estratégia de realocação profissional na Europa | Escrever em uma página: país-alvo, cargos-alvo e data da viagem. | TSK-0044: Abrir o mapa de evidências na seção de ambientes. | TSK-0045: Montar o sumário | TSK-0050 concluída; TSK-0044 concluída; TSK-0045 concluída | 1 bloco de 90 min (sábado leve) | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 23/11/2026 (seg) | TSK-0051 — Escolher as certificações e verificar preços e datas de prova | Abrir o site oficial de cada certificação candidata. | TSK-0047: Abrir o app de workflow e anotar o que impede o uso público. | TSK-0046: Listar as referências | Avanço registrado em TSK-0051 | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 24/11/2026 (ter) | TSK-0051 — Escolher as certificações e verificar preços e datas de prova | Abrir o site oficial de cada certificação candidata. | TSK-0047: Abrir o app de workflow e anotar o que impede o uso público. | TSK-0046: Listar as referências | Avanço registrado em TSK-0051 | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 25/11/2026 (qua) | TSK-0051 — Escolher as certificações e verificar preços e datas de prova | Abrir o site oficial de cada certificação candidata. | TSK-0047: Abrir o app de workflow e anotar o que impede o uso público. | TSK-0052: Listar os conteúdos de cada edital | TSK-0051 concluída | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 26/11/2026 (qui) | TSK-0047 — Empacotar o workflow visual, o construtor de mapas e o operador de tarefas | Abrir o app de workflow e anotar o que impede o uso público. | TSK-0052: Abrir o edital oficial da primeira certificação escolhida. | TSK-0046: Listar as referências | TSK-0047 concluída | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 27/11/2026 (sex) | TSK-0052 — Montar o plano de estudos com autoestudo, cursos e simulados | Abrir o edital oficial da primeira certificação escolhida. | TSK-0046: Listar as obras de Barkley que serão citadas e as páginas de referência. | TSK-0048: Reunir os arquivos | TSK-0052 concluída; TSK-0046 concluída; TSK-0048 concluída | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 28/11/2026 (sáb) | TSK-0049 — Produzir o photo prompt de rotina, o guia de Obsidian para dislexia e os infográficos de IDs | Abrir o Obsidian e criar a nota-modelo para dislexia. | TSK-0042: Abrir o plano da campanha 02 e escrever o título da peça-mãe. | TSK-0040: Registrar as métricas da semana | TSK-0049 concluída | 1 bloco de 90 min (sábado leve) | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 30/11/2026 (seg) | TSK-0042 — Produzir o pacote de conteúdo da campanha 02 | Abrir o plano da campanha 02 e escrever o título da peça-mãe. | TSK-0040: Abrir o painel de métricas toda sexta-feira. | TSK-0061: Estudar o bloco da semana | TSK-0042 concluída | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 01/12/2026 (ter) | TSK-0054 — Definir o escopo do Executar App e do Expo para o lançamento de 05/01 | Abrir o protótipo Scroll Task e listar as funções que já existem. | TSK-0040: Abrir o painel de métricas toda sexta-feira. | TSK-0062: Reescrever título e resumo | Avanço registrado em TSK-0054 | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 02/12/2026 (qua) | TSK-0054 — Definir o escopo do Executar App e do Expo para o lançamento de 05/01 | Abrir o protótipo Scroll Task e listar as funções que já existem. | TSK-0040: Abrir o painel de métricas toda sexta-feira. | TSK-0062: Reescrever título e resumo | TSK-0054 concluída | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 03/12/2026 (qui) | TSK-0053 — Fechar o relatório do ciclo de 30 dias da campanha 01 | Exportar os dados de 05/11 a 05/12 do painel de métricas. | TSK-0040: Abrir o painel de métricas toda sexta-feira. | TSK-0062: Reescrever título e resumo | Avanço registrado em TSK-0053 | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 04/12/2026 (sex) | TSK-0053 — Fechar o relatório do ciclo de 30 dias da campanha 01 | Exportar os dados de 05/11 a 05/12 do painel de métricas. | TSK-0040: Abrir o painel de métricas toda sexta-feira. | TSK-0062: Reescrever título e resumo | Avanço registrado em TSK-0053 | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 05/12/2026 (sáb) | TSK-0053 — Fechar o relatório do ciclo de 30 dias da campanha 01 | Exportar os dados de 05/11 a 05/12 do painel de métricas. | TSK-0040: Abrir o painel de métricas toda sexta-feira. | TSK-0062: Reescrever título e resumo | TSK-0053 concluída; TSK-0040 concluída | 1 bloco de 90 min (sábado leve) | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 07/12/2026 (seg) | TSK-0062 — Otimizar o perfil do LinkedIn e iniciar a linha editorial | Abrir o perfil do LinkedIn e copiar o título atual. | TSK-0063: Escrever em três linhas o que propor ao profissional. | TSK-0055: Implementar as telas | Avanço registrado em TSK-0062 | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 08/12/2026 (ter) | TSK-0062 — Otimizar o perfil do LinkedIn e iniciar a linha editorial | Abrir o perfil do LinkedIn e copiar o título atual. | TSK-0063: Escrever em três linhas o que propor ao profissional. | TSK-0055: Implementar as telas | Avanço registrado em TSK-0062 | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 09/12/2026 (qua) | TSK-0062 — Otimizar o perfil do LinkedIn e iniciar a linha editorial | Abrir o perfil do LinkedIn e copiar o título atual. | TSK-0063: Escrever em três linhas o que propor ao profissional. | TSK-0055: Implementar as telas | Avanço registrado em TSK-0062 | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 10/12/2026 (qui) | TSK-0062 — Otimizar o perfil do LinkedIn e iniciar a linha editorial | Abrir o perfil do LinkedIn e copiar o título atual. | TSK-0063: Escrever em três linhas o que propor ao profissional. | TSK-0055: Implementar as telas | Avanço registrado em TSK-0062 | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 11/12/2026 (sex) | TSK-0062 — Otimizar o perfil do LinkedIn e iniciar a linha editorial | Abrir o perfil do LinkedIn e copiar o título atual. | TSK-0063: Escrever em três linhas o que propor ao profissional. | TSK-0055: Implementar as telas | TSK-0062 concluída | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 12/12/2026 (sáb) | TSK-0063 — Fazer o contato estratégico com o profissional na Holanda | Escrever em três linhas o que propor ao profissional. | TSK-0055: Abrir o documento de escopo e criar a lista de telas. | TSK-0057: Confirmar os épicos escolhidos | Avanço registrado em TSK-0063 | 1 bloco de 90 min (sábado leve) | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 14/12/2026 (seg) | TSK-0063 — Fazer o contato estratégico com o profissional na Holanda | Escrever em três linhas o que propor ao profissional. | TSK-0058: Abrir o pacote da campanha 02 no CMS. | TSK-0055: Implementar as telas | Avanço registrado em TSK-0063 | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 15/12/2026 (ter) | TSK-0063 — Fazer o contato estratégico com o profissional na Holanda | Escrever em três linhas o que propor ao profissional. | TSK-0058: Abrir o pacote da campanha 02 no CMS. | TSK-0055: Implementar as telas | TSK-0063 concluída | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 16/12/2026 (qua) | TSK-0058 — Agendar as publicações da campanha 02 | Abrir o pacote da campanha 02 no CMS. | TSK-0055: Abrir o documento de escopo e criar a lista de telas. | TSK-0057: Confirmar os épicos escolhidos | Avanço registrado em TSK-0058 | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 17/12/2026 (qui) | TSK-0058 — Agendar as publicações da campanha 02 | Abrir o pacote da campanha 02 no CMS. | TSK-0055: Abrir o documento de escopo e criar a lista de telas. | TSK-0057: Confirmar os épicos escolhidos | Avanço registrado em TSK-0058 | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 18/12/2026 (sex) | TSK-0058 — Agendar as publicações da campanha 02 | Abrir o pacote da campanha 02 no CMS. | TSK-0055: Abrir o documento de escopo e criar a lista de telas. | TSK-0057: Confirmar os épicos escolhidos | TSK-0058 concluída | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 19/12/2026 (sáb) | TSK-0055 — Desenvolver o Executar App e o Expo dentro do escopo aprovado | Abrir o documento de escopo e criar a lista de telas. | TSK-0057: Abrir a lista de épicos posteriores e marcar os que entram em 05/01. | TSK-0061: Estudar o bloco da semana | Avanço registrado em TSK-0055 | 1 bloco de 90 min (sábado leve) | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 21/12/2026 (seg) | TSK-0055 — Desenvolver o Executar App e o Expo dentro do escopo aprovado | Abrir o documento de escopo e criar a lista de telas. | TSK-0057: Abrir a lista de épicos posteriores e marcar os que entram em 05/01. | TSK-0061: Estudar o bloco da semana | Avanço registrado em TSK-0055 | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 22/12/2026 (ter) | TSK-0055 — Desenvolver o Executar App e o Expo dentro do escopo aprovado | Abrir o documento de escopo e criar a lista de telas. | TSK-0057: Abrir a lista de épicos posteriores e marcar os que entram em 05/01. | TSK-0061: Estudar o bloco da semana | TSK-0055 concluída; TSK-0057 concluída | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 23/12/2026 (qua) | TSK-0061 — Estudar gestão de projetos conforme o plano de estudos | Abrir o plano de estudos na semana atual. | TSK-0064: Abrir o plano de estudos na semana atual. | TSK-0065: Escolher o tema da semana | Avanço registrado em TSK-0061 | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 24/12/2026 (qui) | TSK-0061 — Estudar gestão de projetos conforme o plano de estudos | Abrir o plano de estudos na semana atual. | TSK-0064: Abrir o plano de estudos na semana atual. | TSK-0065: Escolher o tema da semana | Avanço registrado em TSK-0061 | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 26/12/2026 (sáb) | TSK-0061 — Estudar gestão de projetos conforme o plano de estudos | Abrir o plano de estudos na semana atual. | TSK-0064: Abrir o plano de estudos na semana atual. | TSK-0065: Escolher o tema da semana | Avanço registrado em TSK-0061 | 1 bloco de 90 min (sábado leve) | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 28/12/2026 (seg) | TSK-0056 — Testar o Executar App e publicar a versão de lançamento | Instalar a versão de teste em um celular. | TSK-0061: Abrir o plano de estudos na semana atual. | TSK-0064: Estudar o bloco da semana | Avanço registrado em TSK-0056 | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 29/12/2026 (ter) | TSK-0056 — Testar o Executar App e publicar a versão de lançamento | Instalar a versão de teste em um celular. | TSK-0061: Abrir o plano de estudos na semana atual. | TSK-0064: Estudar o bloco da semana | Avanço registrado em TSK-0056 | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 30/12/2026 (qua) | TSK-0056 — Testar o Executar App e publicar a versão de lançamento | Instalar a versão de teste em um celular. | TSK-0061: Abrir o plano de estudos na semana atual. | TSK-0064: Estudar o bloco da semana | Avanço registrado em TSK-0056 | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 31/12/2026 (qui) | TSK-0056 — Testar o Executar App e publicar a versão de lançamento | Instalar a versão de teste em um celular. | TSK-0061: Abrir o plano de estudos na semana atual. | TSK-0064: Estudar o bloco da semana | Avanço registrado em TSK-0056 | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 02/01/2027 (sáb) | TSK-0056 — Testar o Executar App e publicar a versão de lançamento | Instalar a versão de teste em um celular. | TSK-0061: Abrir o plano de estudos na semana atual. | TSK-0064: Estudar o bloco da semana | TSK-0056 concluída | 1 bloco de 90 min (sábado leve) | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 04/01/2027 (seg) | TSK-0059 — Decidir a liberação do lançamento de 05/01 | Abrir a lista de testes do app e o calendário da campanha 02. | TSK-0061: Abrir o plano de estudos na semana atual. | TSK-0064: Estudar o bloco da semana | TSK-0059 concluída | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |
| 05/01/2027 (ter) | TSK-0060 — Executar o lançamento do app e do ecossistema em 05/01 | Abrir o painel do site e conferir a versão que vai ao ar. | TSK-0061: Abrir o plano de estudos na semana atual. | TSK-0064: Estudar o bloco da semana | TSK-0060 concluída | 2 blocos de 90 min + 1 de 60 min | Marcar o 'concluído quando' ou registrar % e bloqueio |

## 12. Mapa de Stakeholders e Dependências

| ID | Stakeholder ou dependência | Papel | Input necessário | Data necessária | Responsável pelo acompanhamento | Impacto se falhar |
|---|---|---|---|---|---|---|
| STK-01 | Titular do Programa EXECUTAR | Decisor e executor | Decisões dos gates e horas reais | 17/10/2026 | Titular | Plano inteiro parado |
| STK-02 | Audiência neurodivergente e leitores | Público do conteúdo | Engajamento e dados | A partir de 05/11/2026 | Titular | Sem dados para a Campanha 02 |
| STK-03 | Clean Sea (empresa real) | Caso do portfólio | Autorização de uso | 15/01/2027 | Titular | Portfólio sem o caso (GAP-11) |
| STK-04 | Profissional estratégico na Holanda | Parceria de soluções personalizadas | Resposta ao contato | 15/12/2026 | Titular | Frente NL sem apoio (GAP-12) |
| STK-05 | Editor da Frankwatching | Veículo da linha editorial | Aceite de pauta | 31/01/2027 | Titular | Linha editorial sem vitrine (GAP-13) |
| STK-06 | Organismos certificadores | Provas pagas | Datas e preços oficiais | 25/11/2026 | Titular | Provas fora do prazo (GAP-10) |
| STK-07 | Recrutadores e empresas na Europa | Contratantes | Vagas abertas | 01/02/2027 | Titular | Candidaturas sem retorno |
| STK-08 | Plataformas (YouTube, Instagram, TikTok, LinkedIn, e-mail) | Canais | Contas ativas e agendamento | 31/10/2026 | Titular | Ciclo de 30 dias sem distribuição (GAP-07) |
| STK-09 | Cloudflare | Hospedagem e analytics | Domínio e Worker | 20/10/2026 | Titular | Sem site em 05/11 (GAP-03) |
| STK-10 | Programas de afiliados | Destino de compra | Links de afiliado | 23/10/2026 | Titular | Loja sem receita (GAP-04) |
| DEP-01 | Domínio riscocognitivo.org ativo | Dependência técnica | DNS e certificado | 20/10/2026 | Titular | Lançamento adiado |
| DEP-02 | Checkout e links de afiliado | Dependência comercial | Destinos reais | 23/10/2026 | Titular | Vitrine sem compra |
| DEP-03 | Ferramenta de agendamento multiplataforma | Dependência operacional | Contas conectadas | 31/10/2026 | Titular | Agendamento manual |
| DEP-04 | Token do fluxo EXECUTAR para os agentes | Dependência operacional | Variável EXECUTAR_AGENT_TOKEN na sessão | 19/10/2026 | Titular | Agentes não executam; horas humanas sobem |
| DEP-05 | Escopo aprovado do Executar App | Decisão | Lista de funções | 02/12/2026 | Titular | App sem lançamento em 05/01 |
| DEP-06 | Certificações e datas oficiais | Decisão externa | Calendário de provas | 25/11/2026 | Titular | KR-07 em risco |

## 13. Métricas e Cadência de Revisão

| ID Métrica | Métrica | Fórmula | Fonte de dado | Frequência | Meta | Decisão acionada |
|---|---|---|---|---|---|---|
| MET-01 | Visitas ao site | Soma de visitas por página | Analytics Cloudflare (CMS) | Semanal (sexta) | Baseline não evidenciado — medir antes de confirmar meta. | Ajustar canais no ciclo 2 |
| MET-02 | Inscritos na newsletter | Novas inscrições no período | Formulário do CMS | Semanal | Baseline não evidenciado — medir antes de confirmar meta. | Revisar CTA da home |
| MET-03 | Cliques em CTA de ferramentas | Cliques / visitas do artigo | Links com parâmetros | Semanal | Baseline não evidenciado — medir antes de confirmar meta. | Trocar CTA do artigo |
| MET-04 | Downloads de ferramentas e e-books | Downloads por recurso | CMS | Semanal | Baseline não evidenciado — medir antes de confirmar meta. | Priorizar temas na Campanha 02 |
| MET-05 | Cliques de afiliado e vendas | Cliques e pedidos por produto | Programas de afiliado / checkout | Semanal | Baseline não evidenciado — medir antes de confirmar meta. | Revisar mix da loja |
| MET-06 | Cumprimento do agendamento | Publicadas / agendadas | Ferramenta de agendamento | Semanal | 100% | Replanejar o ciclo |
| MET-07 | Tarefas concluídas no prazo | Concluídas no prazo / com prazo na semana | Registro de tarefas | Semanal | Baseline não evidenciado — medir antes de confirmar meta. | Acionar contingência |
| MET-08 | Horas de estudo | Horas registradas / horas planejadas | Registro de estudos | Semanal | Meta definida no plano de estudos (TSK-0052) | Reprogramar prova |
| MET-09 | Nota de simulado | Acertos / questões | Simulados | Por simulado | Nota de corte oficial de cada certificação (GAP-10) | Adiar ou manter a prova |
| MET-10 | Candidaturas enviadas | Envios por semana | Planilha de candidaturas | Semanal | A definir (GAP-15) | Ajustar foco de vagas |

## 14. Riscos e Controles

| ID Risco | Risco | Evidência | Probabilidade | Impacto | Ação preventiva | Contingência | Responsável | Gatilho |
|---|---|---|---|---|---|---|---|---|
| RSK-01 | Sobrecarga da janela de lançamento | §7: opção A ≈ 146,0h contra 84,5h | Alta | Alto | Adotar a opção B no GATE-00; usar agentes para rascunhos | Mover itens de prioridade Média para a onda 2 | Titular | Tarefa Alta atrasada mais de 1 dia em S01–S02 |
| RSK-02 | Domínio ou hospedagem indisponível | GAP-03 | Média | Alto | TSK-0004 em 19–20/10 | Lançar no endereço do Worker e redirecionar depois | Titular | DNS sem resposta em 20/10 |
| RSK-03 | Venda antes de validar o problema | CONF-10 | Média | Médio | Priorizar afiliados e ferramentas gratuitas; medir MET-05 | Retirar produto pago sem tração da vitrine | Titular | MET-05 sem cliques até 14/11 |
| RSK-04 | Conteúdo lido como diagnóstico ou promessa de saúde | FACT-02 | Média | Alto | Restrição em todos os prompts; revisão TSK-0024 | Corrigir e publicar nota editorial | Titular | Comentário ou denúncia |
| RSK-05 | Uso indevido de obra protegida (Barkley) | GAP-18 | Média | Médio | Citação curta e referência completa | Renomear o e-book | Titular | Dúvida de direitos em 23/11 |
| RSK-06 | Sobreposição da Campanha 02 com o início do épico de emprego e com a onda 2 | §7 J3 | Média | Médio | Limite de 30% para o épico (ASM-05) | Adiar estudos de 1 semana | Titular | Carga J3 acima da execução |
| RSK-07 | Dados da Campanha 01 insuficientes em 14/11 (9 dias) | DEC-05 | Alta | Médio | Relatório parcial + final em 05/12 | Ajustar a Campanha 02 em 05/12 | Titular | Menos de 1 semana de dados por canal |
| RSK-08 | App não pronto em 05/01 (festas de fim de ano) | GAP-09; J4 | Média | Alto | Escopo mínimo em 02/12; GATE-08 em 20/12 | Lançar lista de espera e versão web | Titular | Funções do escopo abertas em 20/12 |
| RSK-09 | Datas de prova indisponíveis ou custo acima do orçamento | GAP-10 | Média | Alto | Escolha em 25/11 com datas oficiais | Trocar a ordem das provas | Titular | Sem vaga na janela |
| RSK-10 | Candidaturas sem retorno por idioma, visto ou portfólio | GAP-14 | Média | Alto | GATE-10 com checklist | Rever o alvo de vagas | Titular | Zero entrevistas até 01/03 |
| RSK-11 | Fadiga e sobrecarga cognitiva do titular | ISO 10075-2 (orientação); FACT-06 | Média | Alto | WIP = 1, 3 passos por dia, domingos livres | Usar a reserva de 15% | Titular | 2 dias seguidos sem validação de fim de dia |
| RSK-12 | Mudança de edição da ISO 9001 | CONF-08 | Média | Baixo | Confirmar em iso.org | Atualizar a skill e o §4 | Titular | Confirmação da nova edição |

## 15. Itens Adiados e Excluídos

| Item | Motivo do adiamento/exclusão | Evidência | Condição de reconsideração |
|---|---|---|---|
| CMS com automação completa | Épico posterior | DEC-02, CONF-06 | Após 05/01, com dados de uso |
| Completude das rotas, notícias etc. | Épico posterior | DEC-02 | GATE-08 |
| Consultoria, studio e portfólio do studio | Épico posterior; entra em 05/01 só se escolhido | DEC-02 | GATE-08 |
| Cursos | Épico posterior | DEC-02 | GATE-08 |
| Marketplace completo | Épico posterior; vitrine mínima no EPIC 01 | CONF-05 | GATE-08 |
| Comunidade/ONG, comentários, conta e login | Épico posterior; exige moderação | CONF-09, FACT-02 | Após 05/01 |
| Mapas adicionais (/mapas/[slug]) | Excede a capacidade da J1 | §7 | Após 05/12 |
| Página Parceiros | Sem parceiros identificados | SRC-02 | Quando houver parceiro |
| Itens "......" dos épicos posteriores | Não especificados | GAP-19 | GATE-08 |
| Plano detalhado da operação do ecossistema após 05/01 | Depende dos dados da Campanha 02 | DEC-05 | Novo intake em janeiro |

## 16. Gates de Decisão

| ID Gate | Decisão | Evidência necessária | Responsável pela decisão | Prazo | Consequência de não decidir |
|---|---|---|---|---|---|
| GATE-00 | Confirmar horas reais e escolher a opção A (tudo em 05/11) ou B (núcleo + liberações até 05/12) | §7 e TSK-0001 | Titular | 17/10/2026 | J1 sem escopo viável |
| GATE-01 | Confirmar domínio, hospedagem, checkout e plataformas | TSK-0004, TSK-0017, GAP-07 | Titular | 23/10/2026 | Site e loja sem destino |
| GATE-02 | Congelar o pacote da onda 1 e confirmar os agendamentos do ciclo 1 | TSK-0022, TSK-0023 | Titular | 01/11/2026 | Ciclo de 30 dias sem base |
| GATE-03 | Liberar o lançamento de 05/11 | TSK-0026, TSK-0027 | Titular | 04/11/2026 | Lançamento com erro público |
| GATE-04 | Validar os dados da Campanha 01 e fixar metas numéricas | TSK-0039 | Titular | 14/11/2026 | Campanha 02 sem base (DEC-05) |
| GATE-05 | Escolher as certificações e confirmar a distribuição de horas do épico de emprego | TSK-0051, ASM-05 | Titular | 25/11/2026 | Estudos sem rumo |
| GATE-06 | Aprovar o pacote da Campanha 02 | TSK-0042 | Titular | 30/11/2026 | Agendamento atrasado |
| GATE-07 | Fechar o ciclo de 30 dias | TSK-0053 | Titular | 05/12/2026 | Lições perdidas |
| GATE-08 | Confirmar escopo do app e épicos posteriores que entram em 05/01 | TSK-0054, TSK-0055, TSK-0057 | Titular | 20/12/2026 | Lançamento de 05/01 sem escopo |
| GATE-09 | Liberar o lançamento de 05/01 | TSK-0056, TSK-0059 | Titular | 04/01/2027 | Lançamento com erro |
| GATE-10 | Liberar o início das candidaturas | TSK-0067, TSK-0068, TSK-0069, TSK-0072 | Titular | 31/01/2027 | Candidaturas fracas |
| GATE-11 | Encerrar o épico de emprego e decidir a viagem | TSK-0073, TSK-0077 | Titular | 30/03/2027 | Viagem sem preparo |

## 17. Próxima Ação Imediata

| Campo | Conteúdo |
|---|---|
| Responsável | Titular |
| Ação concreta | TSK-0001 — confirmar quantas horas por dia estão disponíveis até 04/11 e escolher a opção A ou B do lançamento (GATE-00) |
| Fonte | DEC-03, §7, RSK-01 |
| Resultado esperado | Decisão escrita: horas/semana + opção A ou B |
| Duração máxima | 30 minutos |
| Evidência de conclusão | Nota de decisão datada no registro de tarefas |
| Por que esta ação e não outra | Todas as tarefas da J1 dependem da capacidade real; sem ela o plano pode exigir cerca de 1,7 vez as horas disponíveis antes de 05/11 |

## Apêndice A — Tabela Mínima de Rastreabilidade

| ID | Requisito | Fonte original | Citação da fonte | Classificação | Status de evidência | Dependência | Ação |
|---|---|---|---|---|---|---|---|
| REQ-01 | Concluir a produção do EPIC 01 e os agendamentos até 01/11 | SRC-01 | "Entre 17/10 e 01/11 é necessario completar todo o packge epic 01 e agendar" | REQUIREMENT (instrução) | Planejado; capacidade em risco | GATE-00 | TSK-0001…TSK-0023 |
| REQ-02 | Lançar riscocognitivo.org em 05/11 com o conteúdo listado | SRC-01 | "no dia 05/11 o lançamento inclui todo conteúdo listado" | REQUIREMENT (instrução) | Planejado (opção B); CONF-01 | GATE-03 | TSK-0028 |
| REQ-03 | Conteúdos sustentam ciclo de 30 dias até 05/12 | SRC-01 | "os conteudos devem suportar ciclo de 30 dias ate 05/12" | REQUIREMENT | Planejado | TSK-0023, TSK-0037 | TSK-0040, TSK-0053 |
| REQ-04 | Cada artigo conecta com CTA de ferramenta/solução | SRC-01 | "Cada artigo conecta com um cta relacionado às ferramentas e soluções" | REQUIREMENT | Planejado | CLU-04 | TSK-0009, 0029, 0030, 0043, 0044 |
| REQ-05 | Produzir a Campanha 02 entre 15/11 e 30/11 a partir dos dados da Campanha 01 | SRC-01 | "A próxima campanha será produzida entre 15/11 e 30/11 … a partir de coleta de dados" | REQUIREMENT | Planejado | TSK-0039 | TSK-0041, TSK-0042 |
| REQ-06 | Lançar app, épicos posteriores e Campanha 02 em 05/01 | SRC-01 | "a previsão do lançamento do app e dos epics posteriores e campanha 2 é para 5/01" | REQUIREMENT | Planejado; escopo GAP-09 | GATE-08 | TSK-0054…TSK-0060 |
| REQ-07 | Acompanhar produção por objetivos macro semanais divididos por dias | SRC-01 | "organizaremos acompanhamento de produção a partir de objetivos macros por semana, divididos por dias" | REQUIREMENT | EVIDENCIADO neste documento | — | §9, §11 |
| REQ-08 | Executar o EPIC Emprego de 19/11 a 30/03 com itens 0–5 | SRC-01 | "esse epic inicia em 19/11 e encerra em 30/03" | REQUIREMENT | Planejado | GATE-05 | TSK-0050…TSK-0077 |
| REQ-09 | Certificações pagas de referência para o mercado europeu | SRC-01 | "provas e validações pagas das referências gold standard para mercado europeu" | REQUIREMENT | NÃO EVIDENCIADO (escolha pendente) | GAP-10 | TSK-0051 |
| REQ-10 | Candidaturas de 01/02 a 30/03; viagem em 30/04 | SRC-01 | "as aplicações … iniciam-se em 01/02 e vão até 30/03. a viagem será em 30/04" | REQUIREMENT | Planejado | GATE-10 | TSK-0073, TSK-0078 |
| REQ-11 | Não apresentar classificação como diagnóstico | SRC-02 | "Não apresentar classificação como diagnóstico." | CONSTRAINT | Aplicado nos prompts | — | Restrição em todas as tarefas |
| REQ-12 | Não inventar destino do app nem integração de pagamento | SRC-02 | "Não inventar destino externo"; "não inventar integração de pagamento" | CONSTRAINT | Aplicado | DEP-02 | TSK-0013, TSK-0017, TSK-0019 |
| REQ-13 | Tripla clonagem de épicos | SRC-06 | "Epic, project, issue ou sub-issue citado = tripla clonagem" | REQUIREMENT (projeto) | NÃO EVIDENCIADO | Acesso ao GitHub | TSK-0002 |
| REQ-14 | Planejar ações para riscos e objetivos mensuráveis | SRC-07 | ISO 9001:2015/Amd 1:2024 — 6.1 e 6.2 | NORMATIVE REQUIREMENT | PARCIALMENTE EVIDENCIADO | GAP-6.2-01 | §6, §14 |

## Apêndice B — Referências Cruzadas Rápidas

- Meta do período e resultados → §6
- Quantas horas cabem em cada janela → §7
- O que fazer nesta semana → §9
- O que fazer hoje → §11 + §17
- Prompt completo de cada tarefa → §10 (bloco CSV) e arquivo de registro
- Conflito de fontes → §3.5
- O que falta saber → §3.4
- Decisões pendentes → §16
- O que ficou para depois → §15

## Registro Final de Honestidade

Todas as lacunas foram preservadas como GAP e refletidas como TBD ou "a definir" nas tarefas. Nenhuma linha de base ou meta numérica foi inventada: onde a fonte silenciou, o documento declara "Baseline não evidenciado". A capacidade foi calculada sobre suposições explícitas (ASM-01 a ASM-05), a confirmar no GATE-00. Não se afirma conformidade normativa. Os dez conflitos entre fontes foram registrados com as duas versões, e nenhum foi resolvido em silêncio. Recomendações (opção B, priorizar afiliados, uso de agentes) foram rotuladas como tais e não como requisitos.

Fim do documento. Emitido em 17/10/2026 às 12:00 (horário de Brasília).
