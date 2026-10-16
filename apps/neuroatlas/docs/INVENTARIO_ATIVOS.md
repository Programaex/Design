# Inventário de ativos 3D recebidos

Data: 2026-10-16. Medições por leitura do JSON glTF / cabeçalho PLY (`scripts/inspect_glb.py` + leitura dos accessors). Fonte legível por máquina: [`../assets/models/MODELS.json`](../assets/models/MODELS.json). Inventários de nós: `../research/*.inventory.json`.

## Resumo

| ID | Arquivo | Bytes | SHA-256 | Papel |
|---|---|---:|---|---|
| MDL-005 | `brain-surface.glb` | 9 471 892 | `ce97da58a5d4cdcf55b40d47a25ef55ca677e5e12a9f71e9ad0942cee2860c93` | **Modelo principal** |
| MDL-006 | `brain-point-cloud.ply` | 504 119 | `dc1657d59398da6c9c4f05c84d6721d882cf732387adfe6d9aee45eb332f19ec` | Camada visual de partículas |
| MDL-007 | `brain-sketchfab-mwtb33.glb` | 2 672 064 | `96165b23ef4dbc335a979cdf21c8f704eb60fef64e2b50c2742bb80525297b7c` | Alternativa só visual |

(O arquivo foi recebido como `brain.glb`; renomeado para não colidir com o MDL-002 — ver abaixo.)

## MDL-005 · `brain-surface.glb` (HOME-BRAIN-001)
- Origem: OpenNeuro **ds006128** sub-01 (snapshot 1.0.11); gerador `build-brain-assets.js`. Licença declarada: **CC0-1.0** (em `asset.copyright` e `extras`).
- Hierarquia: `HOME-BRAIN-001` (raiz, com `extras`) → `cortex-left`, `cortex-right`, `cerebellum`, `brain-stem`.
- Geometria: 61 185 / 60 739 / 33 369 / 9 200 vértices; 132 887 / 132 217 / 66 736 / 18 396 triângulos (≈350 k tri no total — **pesado para mobile**; planejar LOD).
- Atributos por vértice: `POSITION`, `NORMAL`, `COLOR_0`, `_SULC` (profundidade de sulco FreeSurfer; útil como mapa de sombreamento). Sem texturas. Materiais: `brain-cortex` (rough 0.82), `brain-subcortical` (rough 0.88).
- Transform declarado em `extras.transform`: coordenadas FreeSurfer surface-RAS/TKR (mm); eixos de cena **x = A, y = S, z = R** (permutação cíclica, det +1); `mmPerUnit = 45.5786`; extensão alvo 3,8 unidades; centro em mm `[-9.407, 24.779, 0.529]`; extensão em mm `[173.20, 128.89, 131.01]`. Parâmetros de geração: `cellMm 1.35`, `seed 41005`, `smoothIters 6`, partículas `{cortex 36000, cerebellum 5000, brainstem 1000}`, `particleLift 0.012`.
- Bounds da união (unidades de cena): x ±1,9; y −1,4139…+1,4139; z ±1,4372 (recalcular no loader).
- **Cobre:** hemisférios, cerebelo, tronco → camadas e seleção em 4 objetos reais (`object_name` verificável por nome).
- **Não cobre:** lobos, giros, sulcos, estruturas profundas, nervos, vasos, crânio, pele. Logo **nenhuma das 33 amostras `NEU-XXXX` pode ser marcada `verified_object`** com este arquivo.
- A lateralidade (esquerdo/direito) vem dos nomes dos nós; checar com os bounds antes de rotular (os bounds de z dos hemisférios se tocam em ≈0).
- Observação a verificar: o bounds do `cerebellum` cobre x −1,62…−0,18 e z −1,18…+1,20 (ambos os lados); conferir visualmente que é o cerebelo completo.

## MDL-006 · `brain-point-cloud.ply`
- PLY binário little-endian, **42 000 pontos**, só `x y z` (float32), sem cor/normal/rótulo. Tamanho confere (119 B de cabeçalho + 42 000 × 12).
- 42 000 = 36 000 + 5 000 + 1 000 = `params.particles` do MDL-005; bounds (x ±1,9000, y ±1,4163, z ±1,4369) compatíveis com o mesmo espaço de cena. **Ordem por região não verificada** — não colorir/agrupar por região sem checar.
- Licença presumida CC0-1.0 por derivação do MDL-005 (confirmar com o autor).

## MDL-007 · `brain-sketchfab-mwtb33.glb`
- Sketchfab "3D Model Of Brain", autor **mwtb33**, **CC-BY-4.0** (declarado em `asset.extras`), fonte: https://sketchfab.com/3d-models/3d-model-of-brain-1429cacf7ec040cd825e2f24ceaf8183.
- O nó interno cita `3DPX-003765_3DModel_of_Brain_Nevit_Dilmen.stl` (NIH 3D Print Exchange); a licença do original **precisa ser confirmada** antes de uso comercial.
- 2 meshes genéricas (`Object_2` 65 532 v / 79 253 tri; `Object_3` 4 488 v / 3 185 tri), 1 material, sem texturas, sem lateralidade/regiões. Raiz com rotação de +90° em X (conversão Sketchfab). Unidade **desconhecida** (bounds brutos de ~167 × 133 × 208).
- Uso: visual alternativo/comparação. **Atribuição CC-BY exigida.**

## Atribuições para o rodapé (mínimo)
- "HOME-BRAIN-001, derivado de OpenNeuro ds006128 (CC0-1.0)."
- Se MDL-007 for usado: "3D Model Of Brain" por mwtb33 (Sketchfab), CC BY 4.0, com indicação de alterações.

## Conflitos com o pacote original (resolvidos aqui)
| Item do pacote | Situação nova |
|---|---|
| "Nenhum GLB acompanha o ZIP" (README, VALIDACAO, comando v1) | Existem 3 modelos; o pacote original fica preservado como histórico, a verdade vigente é este documento. |
| `structures.json` → `file: assets/models/brain.glb` (MDL-002) | Continua apontando para o MDL-002 **não obtido**. Nada foi alterado em `data/*.json`. O arquivo `brain.glb` recebido era outro modelo e foi renomeado. |
| VAL-01 (GLB + hash + licença) | Parcial: hashes registrados; licença declarada nos metadados, **não auditada**. |
| VAL-02 (nomes batem com `structures.json`) | Não aplicável a MDL-005/007; segue pendente para MDL-002. |
| VAL-03 (cabeça+crânio+cérebro co-registrados) | Segue **BLOQUEADO** (sem crânio/pele). |
| VAL-05, VAL-06 (corte fechado, animação 8 s) | Seguem **BLOQUEADOS** (sem cap, sem offsets). |

## Próximo passo de dados (para o Claude Design ou humano)
Criar entradas MDL-005/006/007 no `MASTER_SOURCE.json` (nova fonte única de modelos) e estruturas reais `NEU-` para os 4 objetos de MDL-005, depois `regenerate_json.py` + `check_package.py`. Este commit **não** altera `MASTER_SOURCE.json`.
