# NEUROATLAS — app `neuroatlas` (rota `/neuroatlas/`)

Atlas 3D interativo do encéfalo, identidade EXECUTAR. Esta pasta é o **root directory do app** e o **pacote de entrada do Claude Design**: documentação, dados, schemas, contratos e modelos 3D recebidos. **Ainda não há código de aplicação** (`src/` será criado pelo Claude Design).

**Estado (2026-10-16):** `GO` para construir o viewer com os modelos MDL-005/006/007 · `NO-GO` para cabeça + crânio + pele, corte fechado, explodido de 8 s e as 33 estruturas `NEU-XXXX` (dependem de MDL-001/MDL-002, não obtidos).

## Comece aqui
1. [`docs/COMANDO_CLAUDE_DESIGN_v2.md`](docs/COMANDO_CLAUDE_DESIGN_v2.md) — **prompt de execução vigente** (substitui o v1).
2. [`docs/INVENTARIO_ATIVOS.md`](docs/INVENTARIO_ATIVOS.md) — o que cada modelo recebido é, hashes, licenças, lacunas.
3. [`docs/ROTA_E_ESTRUTURA.md`](docs/ROTA_E_ESTRUTURA.md) — rota, layout alvo de `src/`, módulos, gates.
4. [`docs/pacote-original/`](docs/pacote-original) — PRD, Especificação Técnica, XLSX, validação e fontes/licenças (pacote de pesquisa de 2026-10-16, preservado sem edição).
5. [`docs/brain-network/`](docs/brain-network) — pacote **Brain Network** (grafo de pessoas). Produto **separado**; relação com o NEUROATLAS é a decisão aberta DEC-06 (partida: módulo futuro, não integrar agora).

## Estrutura
```
apps/neuroatlas/
├── README.md
├── docs/            # comando v2, inventário, rota; pacote-original/; brain-network/
├── data/            # MASTER_SOURCE.json (fonte única) + exports JSON  (não editar à mão)
├── schemas/         # JSON Schemas dos exports
├── scripts/         # inspect_glb.py, check_package.py, regenerate_json.py, acquire_brain.sh
├── research/        # decisões, plano de 8 etapas, inventários GLB
└── assets/
    ├── models/      # brain-surface.glb, brain-point-cloud.ply, brain-sketchfab-mwtb33.glb, MODELS.json
    ├── posters/     # arte CONCEITUAL (não é anatomia)
    └── textures/
```

## Regras que não mudam
- `data/MASTER_SOURCE.json` é a fonte única; regenerar com `python3 scripts/regenerate_json.py` e validar com `python3 scripts/check_package.py`.
- Campos geométricos `null` ficam `null` até medição; não inventar posições, câmeras, offsets ou nomes de objeto.
- `assets/models/brain.glb` é **reservado** ao MDL-002 (brainproject) citado em `data/structures.json`; não renomear nenhum modelo recebido para esse nome.
- Atribuição obrigatória no rodapé do app (ver `docs/INVENTARIO_ATIVOS.md`). Poster e referência visual são ilustração conceitual.
- Nenhuma validação anatômica é alegada; revisão humana especializada (FIPAT) é pendência.
