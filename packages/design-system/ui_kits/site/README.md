# Website UI kit — Risco Cognitivo

Click-through recreation of the editorial marketing / learning site. No production site was supplied; layout follows the Nocturne landing template (Programaex/Design `templates/landing`) — centred hero, inverse band, promo tiles, sign-up close — rebuilt light-first with brand copy.

Screens (state persisted in localStorage `rc-page`):
- `Home.jsx` — hero over brain mark, black inverse band, 4 promo tiles, assessment CTA
- `Explore.jsx` — interactive brain map: hotspots + region cards, segmented view control
- `Topic.jsx` — editorial article (Controle inibitório) with risk table and related cards
- `Assessment.jsx` — 4-question self-check → result Dialog with risk Tag
- `App.jsx` — NavBar + router; `data.js` — copy/content

All primitives come from the compiled bundle (`window.RiscoCognitivoDesignSystem_fab0ba`).
