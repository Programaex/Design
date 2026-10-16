# apps/miniapps — mini apps PWA do EXECUTAR

As funções do app Prisma (`apps/executar-web` / `apps/executar-mobile`) como seis apps pequenos, públicos, instaláveis e offline. Não têm conta nem servidor: todos leem e gravam **o mesmo plano salvo no aparelho** (`localStorage` `executar-prisma-v1`, mesmo formato do app web) e se atualizam entre abas pelo evento `storage`.

| Slug | Catálogo | O que faz |
|---|---|---|
| `prisma` | `/apps` | Questionário de 8 perguntas e plano em Agora, Próximo e Depois; dados e JSON |
| `executar` | `/apps` | Uma ação por vez, com timer |
| `mapa` | `/apps` | Mapa mental: grupos → entregáveis → tarefas |
| `rotinas` | `/apps` | Hábitos do dia que reiniciam toda manhã |
| `folhas-a4` | `/ferramentas` | Quatro modelos A4: imprimir/PDF e HTML |
| `importar-csv` | `/ferramentas` | CSV do plano operacional rastreável → plano |

`catalog.json` é a fonte única dos seis (títulos, textos, facetas, ícone e cor). Dela saem as páginas, os ícones, os manifests e os cards dos catálogos `#/apps` e `#/ferramentas` do kit `ecossistema`.

## Como funciona

- Vite multi-page com `base: '/m/'`: hub em `/m/` e um `index.html` por app em `/m/<slug>/`. Telas vêm de `@executar/ui`; a lógica, de `@executar/core`.
- `pwa.ts` gera no build um `manifest.webmanifest` por app (escopo `/m/<slug>/`) e um service worker único, `/m/sw.js`: precache das páginas e assets, rede primeiro para HTML e cache primeiro para assets.
- `src/shell/store.ts`: `useMiniApp()` usa `usePrismaApp` sem API (`remote: false`) e sincroniza só os campos compartilhados entre abas.

## Comandos

```bash
npm run dev -w apps/miniapps        # vite em http://localhost:5173/m/
npm run build -w apps/miniapps      # dist/ (o build de apps/site copia para dist/m)
npm test -w apps/miniapps           # vitest (store compartilhado)
npm run typecheck -w apps/miniapps
node apps/miniapps/scripts/generate.mjs [--png]   # regenera páginas e ícones a partir do catalog.json
```

Publicação: junto com o Worker `design` (`npm run deploy -w apps/site`), sem passo extra.
