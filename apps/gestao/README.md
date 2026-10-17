# apps/gestao — Painel de gestão dos épicos (Worker `gestao`)

Painel SaaS admin com duas views e uma folha de impressão de uma página por view:

| View | Rota | Épico | Conteúdo |
|---|---|---|---|
| EPIC 01 | `#/epic01` | [#3](https://github.com/Programaex/workbook/issues/3) EP-OP.OPS-0003 | KPIs, marcos, cronograma por frente, gates, próximos 14 dias, lacunas e o modelo **Solo Campaign System** (sprint D1–D10, checkpoints A/B, matriz de 27 peças, cadência de janelas) |
| Emprego | `#/emprego` | [#5](https://github.com/Programaex/workbook/issues/5) EP-OP.OPS-0005 | KPIs (provas, candidaturas), marcos até a viagem, cronograma por trilha, gates e lacunas |

Login igual ao do CMS (cookie assinado; secrets `CMS_USER`, `CMS_PASS`, `SESSION_SECRET`).

## Dados

| Fonte | Onde | Quando vale |
|---|---|---|
| Snapshot do workbook | `data/snapshot.json`, gerado por `npm run snapshot -w apps/gestao` a partir de `workbook/D08_operacoes/tarefas/*.md` + `docs/planos/.../registro-tarefas-*.csv` (frente, prioridade) | base sempre disponível |
| GitHub ao vivo | `GET /api/epicos/:n` → issue e sub-issues de `Programaex/workbook` (cache de 10 min) | sobrepõe estado, datas, checklist, rótulos e lacunas |
| Modelo do PDF | `data/solo-campaign.json` (transcrito de "Solo Campaign System", 17/10/2026) | view EPIC 01 |

Sem GitHub (limite de chamadas, rede) o painel mostra o snapshot e avisa. `GITHUB_TOKEN` (secret opcional, só leitura) sobe o limite de 60 para 5000 chamadas/hora. KPI sem fonte aparece como **N/D**; prazo indefinido como **a definir**.

## PDF de uma página

`Imprimir PDF` imprime só a folha (A4 paisagem, margens de 10 mm). O cálculo de página é o do CMS (`apps/site/lib/ops/pagefit.mjs`, SPEC-03): se a menor fonte ficar abaixo de 9 pt, a impressão é bloqueada e o painel sugere outro papel.

`npm run pdf -w apps/gestao -- --hoje AAAA-MM-DD [--offline]` gera `out/gestao-<view>-<data>.pdf` com o Chromium (`CHROME_PATH`).

## Comandos

```bash
npm run snapshot -w apps/gestao   # atualiza data/snapshot.json (precisa do repositório workbook ao lado do Design)
npm test -w apps/gestao           # node --test (funções puras) + vitest (Worker)
npm run dev -w apps/gestao        # build + wrangler dev (crie apps/gestao/.dev.vars com CMS_USER/CMS_PASS/SESSION_SECRET)
npm run deploy -w apps/gestao     # build + wrangler deploy (CI: .github/workflows/deploy-gestao.yml)
```
