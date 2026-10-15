# EXECUTAR Workflow — Turborepo

Extração de `apps/workflow` do repositório https://github.com/hubexecutar-lgtm/react-router-starter-template no commit `176c2947baa3d9c12123d33ee726725d5c315207`.

## Uso

Node.js 22+ e npm 11.9.0. Na raiz:

```sh
npm ci
npm run dev
npm run build
npm run typecheck
npm run lint
npm test
```

`apps/workflow` mantém React, Vite, Cloudflare Worker, Workflows, Durable Objects, R2, CMS e MCP. `turbo.json` orquestra build, desenvolvimento, tipos, lint e testes. Deploy e bootstrap são explícitos, fora do cache Turbo.

## Escopo e design system

Não inclui `apps/blog`, seu design system, tokens de marca ou assets de `plugins/executar-cop/assets/design-tokens`. Preserva CSS e componentes locais do workflow para manter sua interface funcional. Nenhum pacote de UI ou design system compartilhado foi criado. Referências textuais dos agentes aos tokens excluídos permanecem como referências de origem; entregas desses agentes que usem esse material precisam de um design system fornecido pelo destino.

Agentes, skills e plugins de suporte foram copiados sem alterações para preservar geração do registro de IA e dos prompts. O blog continua sendo integração externa, não parte deste workspace.

## Publicação

Nenhum fork remoto, push ou deploy foi realizado. Este pacote é uma extração de código, sem histórico Git. Para publicá-lo, crie um repositório de destino e envie os arquivos. Para um fork nativo, crie primeiro o fork no GitHub e aplique a extração em uma branch.

Revise `apps/workflow/wrangler.jsonc` e `wrangler.inline.jsonc` antes de publicar: nomes do Worker, Workflows, bucket R2, ID do KV e `BLOG_REPO`/`BLOG_URL` ainda são os da origem. Configure suas credenciais e secrets pelo ambiente. `npm run bootstrap` cria recursos e faz deploy; não é necessário para compilar localmente.
