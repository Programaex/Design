# apps/executar-web — EXECUTAR · landing, app Prisma e API

Implementação do handoff do Claude Design (*Mobile app upstream stack design*): **EXECUTAR Landing**, **Prisma Mobile** (PWA), **Prisma Export** (modelos A4) e **Prisma Galeria**, sobre Next.js 16 (App Router) + Tailwind 4 + Prisma ORM 7 (Postgres). A lógica de domínio vem de [`@executar/core`](../../packages/executar-core), a mesma usada pelo app nativo ([`apps/executar-mobile`](../executar-mobile)).

| Rota | O que é | Origem no design |
|---|---|---|
| `/` | Landing do produto: hero com workflow animado (API/MCP), destaques, método, 3 comparadores antes/depois, estratégias, app ao vivo, storyboard | `EXECUTAR Landing.dc.html` |
| `/app` | App Prisma (PWA, offline): login, questionário de 8 passos, Prisma, Executar (Scroll Task), Mapa, Rotinas, Conta, Sincronização, Dados, Ajustes. No celular ocupa a tela; no desktop aparece no aparelho com o painel "upstream" | `Prisma Mobile.dc.html` |
| `/app/exportar?template=prisma\|semana\|workbook\|status` | Modelos A4 (retrato, margem 10 mm, 3 faces de 92,33 mm) com auditoria de overflow, Imprimir/PDF e HTML autônomo | `Prisma Export.dc.html` |
| `/galeria` | 12 telas em aparelhos isolados + miniaturas dos 4 modelos | `Prisma Galeria.dc.html` |
| `/storyboard/render?t=…` | Palco 1920 × 1080 do vídeo promocional | Storyboard da landing |

## API (Next.js route handlers + Prisma)

| Endpoint | Função |
|---|---|
| `POST /api/auth/email` · `GET /api/auth/verify` · `POST /api/auth/logout` | Login por link mágico (token de uso único, só o hash fica no banco). Sessão assinada (HMAC) em cookie HttpOnly no web e `Authorization: Bearer` no app nativo (`?format=json`). |
| `GET /api/me` · `PATCH /api/me/settings` | Conta e ajustes (lembretes, horário, alertas, assistente). |
| `POST /api/sync` | Sync offline-first: merge de três vias (base do aparelho · aparelho · nuvem) em transação serializável; devolve plano, membros e conflitos por tarefa. |
| `GET /api/plans` · `GET/DELETE /api/plans/[id]` | Planos do usuário (dono, editor ou leitura). |
| `GET/POST /api/plans/[id]/members` | Compartilhar com outra pessoa (editor). |
| `GET /api/plans/[id]/export?template=…` | Modelo A4 preenchido como HTML autônomo. |
| `POST /api/plans/import` · `POST /api/plans/import-csv?nome=…` | Importa o JSON do app ou o CSV #3 do `plano-operacional-rastreavel`. |

## Rodar

```bash
cp apps/executar-web/.env.example apps/executar-web/.env    # DATABASE_URL, AUTH_SECRET
npm ci                                                       # na raiz
npm run db:migrate -w apps/executar-web                      # cria as tabelas
npm run dev -w apps/executar-web                             # http://localhost:3000
```

Em desenvolvimento o link de acesso volta na resposta e o app entra direto. **Produção:** o envio do link por e-mail ainda não está ligado a um provedor — sem `AUTH_DEV_LINKS=1`, `/api/auth/email` responde 501.

## Verificação

```bash
npm test -w apps/executar-web            # unitários (sessão)
npm run typecheck -w apps/executar-web
npm run lint -w apps/executar-web
npm run build -w apps/executar-web
# ponta a ponta contra um servidor com banco (AUTH_DEV_LINKS=1):
E2E_BASE_URL=http://localhost:3000 npm test -w apps/executar-web
```

## Vídeo promocional

`public/storyboard/executar-1920x1080.mp4` (1920 × 1080, 30 fps, 10,5 s) foi gerado por `scripts/render-video.mjs`, que congela o mesmo `<Diagram>` do hero quadro a quadro e codifica com ffmpeg:

```bash
npm run build -w apps/executar-web && npm start -w apps/executar-web
npx -p playwright node apps/executar-web/scripts/render-video.mjs --url http://localhost:3000
```

## Limites conhecidos

- Apple e Google aparecem no login, mas ainda não estão configurados (mostram aviso).
- Lembretes no web não usam push (sem VAPID); no app nativo são notificações locais.
- "Sugestões de tarefas" é só a preferência salva; não há endpoint de IA.
