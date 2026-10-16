# Rota e estrutura do app

## Rota
- **Caminho proposto:** `/neuroatlas/` (página pública, estática). Sem backend obrigatório.
- **Registro de rotas:** o catálogo do projeto (`/admin/rotas/`, `src/data/routes.ts`, teste `npm run routes:check`) vive no app do blog, que **não está neste repositório**. Ao publicar, registrar `/neuroatlas/` lá, no mesmo PR (grupo: Ferramentas públicas).
- **Deploy sugerido:** frontend estático (Cloudflare Pages/Workers Assets). Servir `assets/models/*` com `Cache-Control` longo e CORS. Total ≈12,6 MB de modelos: usar compressão (Brotli) e carregamento progressivo (pontos → superfície).

## Stack recomendada
React + TypeScript + Vite, Three.js + React Three Fiber/Drei. `GLTFLoader` (+ `PLYLoader`), JSON Schema (ajv) para validar `data/*.json`. Tokens visuais do design system do repositório (`packages/design-system`) e da identidade EXECUTAR do pacote original (fundo `#1455CC`; acentos `#86B9F2`, `#FFD52A`, `#F04D36`, `#F3F0E8`, `#B9C0C8`).

## Layout alvo de `src/`
```
src/
├── main.tsx · App.tsx
├── modules/
│   ├── AssetLoader/       # GLB/PLY, progresso, erro, hash esperado de MODELS.json
│   ├── StructureRegistry/ # data/structures.json + objetos reais; habilita só verificados
│   ├── LayerStore/        # layers.json; camadas indisponíveis ficam desabilitadas com motivo
│   ├── SelectionController/ # raycast → object_name real
│   ├── CameraRig/         # presets só com bounds medidos (cameras.json)
│   ├── ExplodeController/ # só com offsets validados (bloqueado hoje)
│   ├── LabelOverlay/      # legendas HTML, anticolisão, teclado
│   ├── Timeline/          # poseAt(t) pura; ANIM-8S bloqueada hoje
│   ├── ResponsivePreview/ # 1440 / 1024 / 390 px reais
│   └── ValidationPanel/   # estado dos VAL-01…12 a partir dos dados
├── data/                  # importa/valida ../data (fonte única, sem duplicar)
└── ui/                    # coluna editorial 25% · canvas ~50% · controles 25%
```

## Matriz do que pode ser habilitado agora
| Recurso | Estado | Motivo |
|---|---|---|
| Viewer orbital MDL-005 (4 objetos) | **habilitar** | modelo real, nomes verificados |
| Camadas: hemisfério esq./dir., cerebelo, tronco | **habilitar** | 4 meshes nomeadas |
| Seleção/picking dos 4 objetos | **habilitar** | `object_name` real |
| Partículas (MDL-006) | **habilitar**, sem agrupar por região | ordem não verificada |
| Cores via `_SULC`/`COLOR_0` | habilitar | atributos presentes |
| Alternativa MDL-007 | opcional, com crédito CC-BY | licença do original a confirmar |
| 33 estruturas `NEU-XXXX` | **bloqueado** | MDL-002 não obtido |
| Crânio / pele / cabeça | **bloqueado** | MDL-001 não obtido |
| Corte anatômico fechado | **bloqueado** | sem cap/geometria de corte |
| Explodido e ANIM-8S (8 s) | **bloqueado** | sem offsets validados |
| LOD móvel | **a fazer** | ≈350 k triângulos no MDL-005 |

## Gates de aceite
Herdados do pacote original (`docs/pacote-original/`, VAL-01…12) e do comando v2. Nada é marcado "completo" enquanto houver item bloqueado; botões sem dado real ficam desabilitados com motivo.
