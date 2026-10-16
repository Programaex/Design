# EXECUTAR Brain Network — Pacote de Especificação v1.0

**Data:** 2026-10-16 · **Status:** especificação proposta com base em 10 referências visuais fornecidas pelo solicitante. **Não é uma aplicação concluída.**

## O que foi entendido

O núcleo da proposta é um **grafo navegável de pessoas, equipes e vínculos** apresentado em um palco tridimensional de cérebro translúcido e anéis. As capturas biomédicas (sistema nervoso, DNA) contribuem apenas com padrões de interface de dashboard; **dados clínicos, genéticos ou diagnósticos não compõem o escopo**.

## Ordem recomendada de leitura
1. `01_PRODUTO/BN_PRD_v1.docx` — problema, MVP e decisões.
2. `02_FUNCIONAL/BN_FRD_v1.docx` — IDs de funcionalidades e estados.
3. `03_EXPERIENCIA/BN_UX_UI_v1.docx` — layout e design system.
4. `03_EXPERIENCIA/BN_MOTION_3D_v1.docx` — rotação, cenas, presets e timeline.
5. `04_TECNICO/BN_ARQUITETURA_DADOS_v1.docx` — arquitetura lógica e contratos.
6. `05_QUALIDADE/BN_QA_ACEITE_v1.docx` — critérios BDD e condições de teste.
7. `06_OPERACIONAL/BN_RASTREABILIDADE.xlsx` — backlog rastreável, QA, motion, câmeras, telas, tokens e decisões.
8. `08_CONTRATOS/` — JSON Schemas e CSVs para implementação.
9. `07_EXECUCAO/COMANDO_CLAUDE_DESIGN.md` — comando para construir protótipo e depois conectar backend.

## Hierarquia de verdade
- Atributos de produto (objetivos, papéis, escopo): PRD.
- Comportamento e regras: FRD + `06_OPERACIONAL/requirements.json`.
- Requisitos testáveis: FRD + planilha + QA.
- Contratos de payloads: JSON Schemas em `08_CONTRATOS`.
- Animações, câmeras e timings: motion + planilha + CSV de presets.
- Aspectos das 10 imagens: catálogo de referências, **não prova técnica de viabilidade de GLB**.

## Restrições / pendências
- Sem dados reais, infraestrutura conectada, testes em dispositivo ou inspeção de modelo GLB neste pacote.
- Presets de câmera têm **yaw/pitch propostos**, distâncias/bounds reais dependem da geometria.
- As relações demonstrativas são semanticamente fictícias e devem permanecer rotuladas **DEMO**.
- Há decisões abertas sobre finalidade exata da rede, tipos de vínculos, modelo 3D, fonte de perfis e relação com NEUROATLAS.
- Não reproduzir a marca HUAWEI, as fotos de pessoas nem conteúdo médico de terceiros.

## Checklist para começar
`[ ]` Resolver DEC-01 a DEC-06 · `[ ]` Aprovar ontologia · `[ ]` Selecionar modelo GLB com licença · `[ ]` Aprovar estados/fluxos P0 · `[ ]` Implementar fallback 2D · `[ ]` Integrar dados autorizados · `[ ]` Validar motion e responsividade.
