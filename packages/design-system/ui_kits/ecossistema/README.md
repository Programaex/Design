# Ecossistema — EXECUTAR · Risco Cognitivo

Interactive structure for the two institutional sites. **All copy is Lorem ipsum and all imagery is a droppable `<image-slot>` placeholder** — fill them per route as copy/images arrive.

## Sources
- `uploads/EXECUTAR_rotas.csv` → `routes.js` (78 entries, generated; regenerate, don't hand-edit)
- Apple product-page screenshots (`uploads/IMG_38xx.png`, `IMG_40xx.jpeg`) → layout patterns, tokenised in `tokens/patterns.css`
- Header/hamburger spec from the brief (main nav order, 8 expandable groups, base row, mobile header)

## Four page architectures (CSV `template` → architecture, see `config.js` ARCH)
- **Home** — landing, institucional, serviços. Hero + CTA band → centered display + lead → highlights carousel → gallery → explore pills → newsletter / CTA card.
- **Produto** — produto_app, produto, recurso, serviço, case. Floating sub-nav (title · Explorar · CTA) → hero + price band → `#funcionalidades` carousel → `#como-funciona` column + tabs + icon stat → explore pills → stats → `#acesse` CTA card (disabled until the real URL/checkout is set).
- **Artigo** — conteúdo, risco, tópico, formulário, conta, autenticação. Narrow column, lead, prose, `#referencias`, `#comentarios` (public read, account + moderation to post), related cards. Forms validate + confirm.
- **Showroom** — catálogos, mapa interativo, comunidade, busca. Header + search + filter chip rows (query strings) + card grid + pager; map variant = legend + explore pills.
- Admin routes render a restricted gate and never appear in public navigation.

## Routing rules (from the CSV)
- `filtro` entries render the parent catalog with the query string applied (canonical = parent).
- `ancora` entries render the parent page and scroll to the section id.
- `dinamica` routes resolve `[slug]`; explicit routes (`/apps/executar`, `/mapas/neurodivergencia`, `/mapas/projetos-e-processos`) win over the pattern.
- No external destinations invented: app URL, checkout, affiliate links and social profiles show "a configurar no CMS".

## Review tools (Tweaks)
Site switch · Desktop/Celular · "Em construção" tags · section id labels · route inspector · full route map (click any of the 78 entries).

Image-slot ids are `<site>-<routeId>-<section>` so each site/route keeps its own images.
