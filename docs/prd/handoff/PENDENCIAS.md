# Pendências e premissas explícitas
| ID | Questão | Como avançar sem inventar |
|---|---|---|
| Q-01 | O que significa SMS e qual repo/rota recebe o admin? | Manter nome SMS; usar apps/workflow como baseline local, sem presumir integração ao sistema de destino. |
| Q-02 | Quais datas/conteúdos dos CSVs devem mudar? | Preservar original; preencher new_planned_start/end e revisão de conteúdo por ID quando informado. |
| Q-03 | Quais KPIs e fontes compõem o dashboard? | Implementar agregados operacionais propostos; campos comerciais N/D. |
| Q-04 | Qual arquivo representa “Triped Envelope”? | Não mapear por suposição. DOC-003/REF-019 são light mode confirmados. |
| Q-05 | WIP=1 por run, pessoa ou global? | ADR-003 propõe por run, sujeito à confirmação antes da regra produtiva. |
| Q-06 | Mobile significa navegador/PWA ou app nativo? | Especificação cobre web responsiva; empacotamento nativo não definido. |
| Q-07 | Texto completo de W1-011, W2-013, W3-012 e W4-002? | Preservar [cortado] e impedir considerar conteúdo finalizado. |
| Q-08 | Canal correto de W2-003? | Título realocado com flag, canal vazio para revisão; original íntegro em source_cells_json. |
| Q-09 | Design system/tokens de marca e licença das referências? | Usar layout como referência interna, não copiar marca; tokens finais aguardam definição. |
| Q-10 | Papel/tamanho mínimo obrigatório? | Proposta A4 paisagem/10 mm/9 pt com A3/custom; requisito de página única exige limite físico de conteúdo. |

Estas pendências não impedem a organização do pacote ou a construção de fixtures. Elas devem permanecer visíveis no handoff e só bloquear a parte da implementação que depende de sua resposta.
