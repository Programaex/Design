# VALIDAÇÃO TÉCNICA / relatório de evidências
**Data:** 2026-10-16  ·  **Estado:** `NO-GO` para construir anatomia completa / `GO` para estruturar interface com controles bloqueados e dados de demonstração marcados.

## Metadados públicos verificados
- Z-Anatomy descreve atlas Blender com licença CC BY-SA 4.0 e origem BodyParts3D; o README também cita terceiros sob outras licenças. Pacote real não baixado.
- GitHub do brainproject lista `brain-atlas/models/brain.glb` em **4.650.816 bytes** (tamanho da API do GitHub, não leitura do arquivo) e `manifest.json` em **232.455 bytes**; manifesto lido em fonte pública, **437 registros** agrupados em 12 categorias. Foram transcritas **33 linhas verificáveis de amostra**.
- Categorias do manifesto: cortex=128, cranial_nerves=44, brainstem=30, tracts=54, diencephalon=41, arteries=48, white_matter=9, veins_sinuses=17, cerebellum=33, deep_grey=23, ventricles=7, meninges_dura=3. São contagens declaradas no manifesto; não equivalem a validação individual das geometrias.
- O repositório brainproject declara metadados glTF `bx_id`, `bx_cat`, `bx_label`, `bx_side`, `bx_region`; a persistência real no arquivo GLB deste pacote **não foi testada**.

## Inspeção binária
- Bytes de modelos recebidos: **zero**. SHA256 do GLB: `PENDENTE`. Unidades/escala: `PENDENTE`. Eixos e lateralidade geométrica: `PENDENTE`.
- Malhas, número de triângulos, texturas, draw calls, bounds, matriz global e nome efetivo de cada mesh: `PENDENTE`.
- Dimensões e posições de câmeras/labels: `null` por projeto. Cortes com cap: inexistentes. Splits explodidos: sem offsets.
- Arte conceitual está presente; ela NÃO é screenshot do material original nem derivação do modelo escolhido.

## Etapas de verificação antes de habilitar recursos
1. Obter Z-Anatomy original de origem oficial; checar licenças **por subasset**, mantendo `.blend` sem alterações.
2. Exportar apenas cabeça + crânio + encéfalo do mesmo sistema de coordenadas. Manter matriz original e nomenclatura; materializar GLB e calcular SHA-256.
3. Abrir `brain.glb` com `scripts/inspect_glb.py` e Blender; confirmar `bx_id`/nomes do manifesto, contagens e limites.
4. Comparar hierarquia + matrizes absolutas entre pele, crânio e cérebro. Avaliar corte sagital real e faces internas.
5. Preencher campos medidos e offsets revisados; produzir LOD móvel a partir do original, preservar atribuições e hashes.
6. Validar nomenclatura com FIPAT, depois executar testes funcionais, acessibilidade, responsividade e métricas.

## Resultado por requisito
- **VAL-01 · PENDENTE** — Arquivo GLB baixado, hash SHA256 e licença anexada / Não obtido no ambiente de geração
- **VAL-02 · PENDENTE** — Nomes / userData IDs batem com structures.json / Inspeção do GLB necessária
- **VAL-03 · BLOQUEADO** — Cabeça + crânio + cérebro são co-registrados / Fonte integrada não extraída
- **VAL-04 · PENDENTE** — Taxonomia / lateralidade validada FIPAT / Texto do manifesto não equivale a revisão
- **VAL-05 · BLOQUEADO** — Corte mostra fechamento interno verdadeiro / Cap / geometria de corte ausente
- **VAL-06 · BLOQUEADO** — Seek 0/2/4/5/7/8s determinístico / Offsets ausentes
- **VAL-07 · A IMPLEMENTAR** — Teclado, foco, reduced motion e descrição alternativa / Critérios no PRD
- **VAL-08 · A IMPLEMENTAR** — Visual em 1440/1024/390px sem clipping / Prancha apenas conceitual
- **VAL-09 · A MEDIR** — 60 fps desktop / 30 fps mobile (alvos propostos) / Registrar equipamento/duração
- **VAL-10 · PENDENTE** — Atribuições e share-alike publicadas / Confirmar licenças de subcomponentes
- **VAL-11 · VERIFICADO NA GERAÇÃO** — JSON e XLSX da mesma base / MASTER_SOURCE.json exportado uma só vez
- **VAL-12 · VERIFICADO NA GERAÇÃO** — Poster visual rotulado como arte conceitual / Não usar como prova de geometria
