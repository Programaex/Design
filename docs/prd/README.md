# EXECUTAR — Operações, Dados e Conteúdo
Pacote de requisitos e handoff v1.0 · 16/10/2026 · idioma pt-BR.

## Objetivo
Unificar no admin do SMS as visões de dashboard, calendário editorial, Gantt de lançamento/GTM, mapa mental e workflow em grafo, além da execução focada WIP=1. As views devem compartilhar registros e permitir exportação legível com cálculo de página. “SMS” é o nome informado; seu significado e sistema de destino não foram presumidos.

## Comece aqui
1. Abra `REFERENCIAS.html` para consultar as 19 imagens renomeadas.
2. Leia `docs/PRD.md` e `docs/FRD.md`.
3. Consulte `docs/specs/` e as decisões em `docs/adr/`.
4. Entregue `handoff/IMPLEMENTACAO.md` ao agente desenvolvedor.
5. Use `MASTER_INDEX.csv` para localizar os 26 arquivos originais úteis e seus hashes.

## Conteúdo
| Pasta/arquivo | Uso |
|---|---|
| assets/references | 19 imagens com IDs e nomes descritivos |
| assets/html | 3 HTMLs originais renomeados |
| data/raw | 3 exports AlsoAsked intactos |
| data/normalized | 110 nós, 107 relações, JSON de mapas e 45 registros editoriais |
| docs | PRD, FRD, auditoria da base, specs e ADRs |
| handoff | Backlog ordenado, testes de aceite e instrução para implementação |
| source | ZIP Turborepo original, intacto |
| scripts | Conversão reproduzível dos dados |
| qa | Validação estrutural e checksums |

## O que está pronto
Organização de arquivos, rastreabilidade, requisitos, decisões propostas, normalização dos CSVs e extração do cronograma HTML. Este pacote não implementa as novas views nem certifica o build/deploy da aplicação. O código existente foi inspecionado estaticamente e preservado em ZIP.

## Dados que exigem decisão
As datas editoriais originais de setembro/outubro de 2026 foram preservadas. Preencha `new_planned_start`/`new_planned_end` em uma cópia de trabalho para propor a revisão; o conversor regenera os derivados e sobrescreve esses campos. Não foram inventados novos prazos, responsáveis, dependências ou respostas bloqueadas.

Quatro títulos estão truncados. W2-003 contém um título na coluna de canal do HTML: ele foi realocado na cópia derivada, com flag de revisão e células originais preservadas. “Triped Envelope” permanece sem correspondência inequívoca. Métricas de negócio, integrações reais e extensão nativa mobile dependem das decisões em `handoff/PENDENCIAS.md`.

## Reproduzir
Na raiz deste diretório: `python3 scripts/normalize_data.py`. Usa somente a biblioteca padrão. Dados derivados têm UTF-8; CSVs usam BOM para abertura em ferramentas locais. `source/EXECUTAR_Workflow_Turborepo.zip` não é executado por esse comando. Metadados __MACOSX e diretório GITHUB vazio não foram reproduzidos.
