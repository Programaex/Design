# apps/site — CMS EXECUTAR (Worker `design`)

Publica em `https://design.bus-programa.workers.dev`. Todo o site exige login: o CMS fica na raiz e o site real (os kits do Claude Design) em `/ui_kits/...`.

O CMS segue o ADR em `docs/adr/ADR-CENTRAL-CONTROLE-CMS.md`: entrada única, ID primeiro, fluxo guiado por estado e automação observável. Os dados ficam em documentos JSON, no formato das Collections do ADR, para migrar para Payload depois.

## O que tem

| Área | Onde | Fonte dos dados |
|---|---|---|
| Login | `/login` | secrets `CMS_USER` / `CMS_PASS` do Worker |
| Painel, Completude, Kanban | `#/painel`, `#/completude`, `#/kanban` | rotas do CSV × blocos do blueprint; estado no KV `progress` |
| Pastas e docs | `#/pastas`, `#/docs/<caminho>` | `docs/taxonomia/MASTER_INDEX.csv` + `cms/data/folder-map.json`; arquivos versionados do repo, com link para o GitHub |
| Rotas e QR | `#/rotas` | `EXECUTAR_Claude_Design/EXECUTAR_rotas.csv` |
| Preview do blog | `#/blog/<slug>` | o site real (`/ui_kits/ecossistema/#/blog/<slug>`) lendo `content/articles/*.mdx` |
| Storybook | `#/storybook` | `packages/design-system/components` |
| Automação | `#/automacao` | botões visíveis, sem backend; log no KV `automation-log` |
| Analytics | `#/analytics` | GraphQL Analytics da Cloudflare via `/api/analytics` |
| Módulos editoriais | `#/m/<módulo>` | arquitetura e seed do Hub Editorial; dados no KV `hub` |
| Operações e Dados | `#/ops/<view>` | documento `ops` no KV (seed: `content/ops/*.csv`); WIP=1 no Durable Object `FocusLock` |

Um único design system: o CMS, o storybook e o site real usam o mesmo `packages/design-system` (tokens, `styles.css` e componentes). Nenhum token do Hub Editorial original foi trazido.

## Operações e Dados (PRD em `docs/prd`)

As views são projeções de um mesmo documento (`/api/ops`, KV `ops`, com `revision` e 409 em conflito). Editar uma tarefa em qualquer view atualiza todas.

| View | Rota | O que faz |
|---|---|---|
| Dashboard | `#/ops/dashboard` | KPIs com regra, período, fonte e drill-down. Receita, leads e conversão ficam N/D até existir fonte (Q-03) |
| Calendário | `#/ops/calendario` | agenda, dia, semana útil, semana e mês. Janela editorial ≠ data exata, sem hora inventada |
| Gantt | `#/ops/gantt` | mover datas com alerta finish-to-start e cascata só depois do diff confirmado |
| Mapa mental | `#/ops/mapa` | árvores AlsoAsked em LR, TB ou bilateral; busca, zoom, filho/irmão, converter pergunta em tarefa |
| Workflow | `#/ops/workflow` | DAG de tarefas por fase; dependência nova é rejeitada se criar ciclo |
| Foco | `#/ops/foco` | uma tarefa por vez em todo o CMS (WIP=1 global no Durable Object, com chave idempotente) |
| Importar | `#/ops/importar` | CSV AlsoAsked com preview, erros, lote transacional, reimportação por hash e desfazer |
| Exportar | `#/ops/exportar` | JSON/CSV (round-trip com IDs) e PDF (A4, A3 ou papel personalizado) |

O PDF segue a SPEC-03. A escala é calculada pela área útil, e a página que ficaria abaixo de 9 pt é bloqueada. Nesse caso, o CMS sugere o papel personalizado mínimo, outro formato ou um escopo menor.

Lógica pura em `lib/ops/`, testada com `node --test`. Campos bloqueados, títulos `[cortado]` e datas sem confirmação continuam sinalizados, sem preenchimento inventado.

## Comandos

```bash
npm run build -w apps/site         # gera dist/
npm test -w apps/site              # Worker (vitest/miniflare) + geradores (node --test)
npm run routes:check -w apps/site  # falha se o CSV e o site real divergirem
npm run dev -w apps/site           # local; crie apps/site/.dev.vars com CMS_USER, CMS_PASS e SESSION_SECRET
npm run deploy -w apps/site        # build + wrangler deploy
```

## Secrets do Worker

```bash
cd apps/site
npx wrangler secret put CMS_USER          # 000
npx wrangler secret put CMS_PASS          # 003
npx wrangler secret put SESSION_SECRET    # string aleatória longa
npx wrangler secret put CF_ANALYTICS_TOKEN  # token com Account Analytics: Read (opcional)
npx wrangler secret put CF_ACCOUNT_ID       # opcional, para analytics
```

Enquanto `CMS_USER`/`CMS_PASS` não estiverem definidos no Worker, vale o padrão **000 / 003**. Ao gravar os secrets, o padrão deixa de funcionar. A senha `003` é trivial. O login é verificado no servidor, com cookie HttpOnly assinado, mas qualquer pessoa que conheça as credenciais entra. Troque-as antes de expor dados sensíveis.

## Artigos

Cada artigo é um arquivo `content/articles/<slug>.mdx`, com frontmatter e os componentes `<PlainTextPanel>` e `<AsciiDiagram>`. As imagens de cada artigo (capa e figura no meio do texto) ficam em `content/articles/attachments.json` e apontam para `packages/design-system/assets/` (cenas EV-xxx e símbolos BRAND_MONO).

As cenas EV-xxx não têm licença comercial informada. Veja `packages/design-system/assets/elementos/README.md`.
