# EXECUTAR NEUROATLAS — comando operacional para Claude Design (v2)

Substitui `docs/pacote-original/COMANDO_CLAUDE_DESIGN_v1_original.md` (que assumia **nenhum GLB**; isso mudou). Raiz do app: `apps/neuroatlas/`. Rota: `/neuroatlas/`.

## Leia primeiro (nesta ordem)
1. `README.md` e `docs/INVENTARIO_ATIVOS.md` · `assets/models/MODELS.json`
2. `docs/ROTA_E_ESTRUTURA.md`
3. `docs/pacote-original/`: `VALIDACAO_TECNICA.md`, `FONTES_E_LICENCAS.md`, `NEUROATLAS_PRD.docx`, `NEUROATLAS_ESPECIFICACAO_TECNICA.docx`, as 9 abas operacionais de `NEUROATLAS_DADOS.xlsx`
4. `data/MASTER_SOURCE.json` e `data/*.json`; `schemas/*.schema.json`
5. `assets/posters/neuroatlas_concept_poster.png` — **só referência conceitual de UI**, nunca anatomia.
6. `docs/brain-network/` — **somente contexto**; é outro produto (DEC-06). Não integrar nem importar dados dele.

## Contrato de execução e primeira resposta
1. **Inventário:** liste o que foi realmente lido, caminhos e SHA-256 dos 3 modelos (conferir com `MODELS.json`). Declare: há 3 modelos reais; **não há** crânio, pele, MDL-001 nem MDL-002.
2. Inspecione os GLB no ambiente (árvore, bounds, atributos) e **reporte divergências** em relação ao inventário antes de construir.
3. Construa o viewer sobre **MDL-005 `brain-surface.glb`** (4 objetos: `cortex-left`, `cortex-right`, `cerebellum`, `brain-stem`). `brain-point-cloud.ply` como camada de partículas sem agrupamento por região. MDL-007 só como alternativa com crédito CC-BY.
4. **Não invente** geometria, nomes de objeto, posições, câmeras absolutas, offsets, lobos/giros ou crânio. Câmeras derivam de bounds medidos no loader.
5. Atualize a fonte única: acrescente MDL-005/006/007 e estruturas reais dos 4 objetos ao `MASTER_SOURCE.json`; regenere os exports (`python3 scripts/regenerate_json.py`) e rode `python3 scripts/check_package.py`. As 33 amostras `NEU-XXXX` permanecem `verified_object:false`. Reporte diffs; interrompa só o módulo afetado.

## Visão editorial
Identidade EXECUTAR: fundo `#1455CC` com variações sutis; acentos `#86B9F2`, `#FFD52A`, `#F04D36`, `#F3F0E8`, `#B9C0C8`. Desktop: coluna editorial à esquerda (25%), canvas central dominante (~50%), controles à direita (~25%). Modelo suspenso, luz difusa, sombra discreta, poster 16:10 como fallback rotulado "ilustração conceitual". Testar largura real em 1440 / 1024 / 390 px (no mobile: drawer + bottom-sheet).

## Stack e módulos
React + TypeScript + Vite + Three.js/R3F/Drei. Módulos: `AssetLoader`, `StructureRegistry`, `LayerStore`, `SelectionController`, `CameraRig`, `ExplodeController`, `LabelOverlay`, `Timeline`, `ResponsivePreview`, `ValidationPanel`. Sem backend obrigatório. Dados importados de `data/` (sem duplicar em componentes).

## Regras das interações
- Picking só para objetos verificados (hoje: os 4 de MDL-005), resolvendo o `object_name` real.
- Camadas: hemisfério esquerdo/direito, cerebelo, tronco habilitadas; crânio, pele, estruturas finas **desabilitadas com o motivo vindo dos dados**.
- Corte anatômico: sem cap real, **desabilitado** (não usar transparência/clipping aberto como substituto).
- Explodido/`ANIM-8S`: desabilitados enquanto `exploded_offsets` for `null`. Se vierem a existir: `poseAt(t, baseTransforms, offsets)` pura e determinística (0–2 separado; 2–4 monta; 4–5 mantém; 5–7 separa; 7–8 estabiliza); sem acumulação por frame.
- Acessibilidade: legendas HTML, foco/teclado, `aria-live` para status, modo texto, `prefers-reduced-motion`.
- Desempenho: MDL-005 ≈350 k triângulos → LOD/decimação para mobile **preservando nomes dos 4 objetos e atributos**; guardar originais e hashes; carregar progressivo (pontos → superfície).
- Estados de UI: `loading`, `ready-partial`, `ready-complete`, `asset-error`, `webgl-unsupported`, `reduced-motion`, `missing-license`. Hoje o máximo alcançável é `ready-partial`.

## Critérios de aceite / entrega
1. App fonte, scripts de build, README de instalação, screenshot por breakpoint (1440/1024/390).
2. Matriz de requisitos por status: implementado / testado / bloqueado (usar VAL-01…12).
3. Créditos no rodapé: HOME-BRAIN-001 (OpenNeuro ds006128, CC0-1.0) e, se usado, mwtb33 (CC BY 4.0, com alterações indicadas).
4. Medir bytes, tempo de carga e fps (dispositivo/navegador registrados); 60 fps desktop / 30 fps mobile são **metas**, não fatos.
5. Vídeo de 8 s só se a animação existir de verdade; caso contrário, não gerar.
6. Não alegar validação anatômica; solicitar revisão humana (FIPAT).
7. Registrar a rota `/neuroatlas/` no catálogo de rotas do projeto (fora deste repo) ao publicar.

## Pendências obrigatórias a reportar na saída
Auditoria de licença (MDL-005/006/007; origem NIH 3DPX-003765 do MDL-007); lateralidade e escala validadas; ordem dos pontos do PLY por região; MDL-001 (crânio/pele) e MDL-002 (33 estruturas); caps de corte; offsets da animação; revisão FIPAT.
