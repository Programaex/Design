# Risco Cognitivo — Design System

**Risco Cognitivo** é uma plataforma de educação e exploração sobre funções executivas, neurobiologia, habilidades cognitivas e estratégias de gestão de riscos associados aos processos cognitivos. O objetivo visual é transformar conceitos científicos complexos em uma experiência digital clara, sofisticada, interativa e orientada à descoberta.

Aesthetic: Apple-style editorial minimalism adapted to science communication — white ground, high-contrast type, generous space, anatomical illustration, and **blue as the interaction colour**.

## Sources
- GitHub: **https://github.com/Programaex/Design/tree/main/EXECUTAR_Claude_Design** — routes CSV, ADR, block registry, blueprints, placeholders and reference captures (mirrored in `sources/executar/`).
- GitHub: **https://github.com/Programaex/Design** — branch `main` (formerly `claude/beautiful-bardeen-vwp996`), subtree `DESIGN_SYSTEM-NOTURNO/` ("Nocturne — Apple edition"). Tokens, ramps, radii, shadows and every component class were copied verbatim from its `styles.css`; the website kit follows its `templates/landing`. Explore that repo (also `templates/deck`, `foundations/`) for deeper reference.
- Aesthetic reference: https://www.apple.com/br/store
- Uploads: `02_brain_01_original.png` (colour brain mark), `02_brain.svg` (monochrome brain), `01_stack_check.svg` (monochrome stacked cards + check).

Products: one surface — the **public learning website** (landing + explorer + articles + self-assessment). No app or production code was supplied.

## Index
- `styles.css` — entry point (imports only) → `tokens/fonts.css`, `colors.css`, `typography.css`, `spacing.css`, `base.css`, `components/components.css`
- `guidelines/` — 19 foundation specimen cards (Colors, Type, Spacing, Brand)
- `components/` — React primitives, one card per folder:
  - `actions/` — **Button**, **Tag**
  - `forms/` — **TextField**, **RadioGroup**, **SegmentedControl**
  - `surfaces/` — **Card**, **PromoTile**, **Dialog**
  - `navigation/` — **NavBar**
  - `data/` — **Table**
- `ui_kits/site/` — website click-through (Home, Explore, Topic, Assessment)
- `ui_kits/ecossistema/` — EXECUTAR + Risco Cognitivo institutional sites: all 78 CSV routes, 4 architectures (Home/Produto/Artigo/Showroom), hamburger ecosystem menu, Lorem ipsum + image-slot placeholders, "Em construção" tags
- `tokens/patterns.css` — editorial page-pattern tokens (eyebrow, lead, stat, sub-nav, pill controls, carousel/gallery widths) measured from the Apple references
- `assets/logo/brain-mark.png`, `assets/illustrations/brain-mono.svg`, `assets/illustrations/stack-check-mono.svg`
- `thumbnail.html`, `SKILL.md`, `github.md`

Components map 1:1 to the Nocturne class families (`.btn`, `.tag`, `.field/.input`, `.radio`, `.seg`, `.card`, `.card-tile`, `.dialog`, `.nav`, `.table`). Plain-HTML consumers can use the classes directly.

**Intentional additions:** `.card-interactive` (hover scale for clickable topic cards — the explorer needs it); brain palette tokens (from the supplied mark); `--text-display`, layout and motion tokens (lifted from the landing template's local vars so consumers share them).

---

## CONTENT FUNDAMENTALS
- **Language:** Brazilian Portuguese (pt-BR). Scientific terms in Portuguese (`córtex pré-frontal`, `memória de trabalho`); abbreviations only after first use (CPF).
- **Voice:** calm, precise, curious — a science editor, not a coach. Explain, then name the risk, then offer a strategy.
- **Address:** second person, informal-respectful **"você"**. The brand speaks as an implicit "we" only for actions ("Enviamos um resumo…").
- **Headlines:** short declarative sentences ending in a period — Apple cadence. Two-beat parallels: *"Pense antes. Decida melhor."*, *"Quatro caminhos. Um mesmo cérebro."* Each sentence breaks to its own line in display heads.
- **Casing:** sentence case everywhere (titles, buttons, nav). Never ALL CAPS; kickers are sentence case, 12px semibold muted.
- **Buttons:** verb-first, 1–3 words: *Explorar o cérebro*, *Começar avaliação*, *Saiba mais*, *Avaliar*.
- **Subheads:** one line, ≤ 20 words, muted.
- **Numbers & claims:** only when sourced and meaningful; no decorative stats.
- **Emoji:** never. Unicode used only for typographic marks (·, —, ›).
- **Disclaimer:** health-adjacent content carries *"Conteúdo educativo. Não substitui avaliação clínica."*

## VISUAL FOUNDATIONS
- **Colour:** light by default — `#ffffff` page, `#f5f5f7` tiles, `#1d1d1f` ink, `#6e6e73` muted. One action blue: `#0071e3` fills/focus, `#0066cc` link text (`#2997ff` on dark). The **brain palette** (blue `#429fe8`, pink `#f08de7`, yellow `#f8d800` and their overlaps violet/green/orange) is for anatomy/illustration coding only — never buttons, text or decoration. Status colours = risk levels only.
- **Type:** SF Pro Display/Text via `-apple-system`, Inter as web fallback. Weight 600 for all headings (never bolder), 400 body. Display 80/1.05/−0.015em, hero 56, title 40, subtitle 28, card 21, body 17/1.47/−0.022em, caption 14, micro 12. Steps down below 734px.
- **Spacing:** 4px base (4/8/12/16/24/32/48/64). Air between sections `clamp(64px,10vw,112px)`; tight inside clusters (headline → 12–16px → sub → 24px → buttons). 1068px content column; article measure 680px.
- **Layout:** centred heroes and tiles. Scenes alternate white page → black inverse band (`--color-section`) → `#f5f5f7` tile sections. Only fixed element: the 44px sticky nav.
- **Backgrounds:** flat solid scenes. No gradients, textures or patterns. Imagery is the subject itself (brain renders/illustrations) floating on the ground via `.blend` (multiply on light, lighten on dark) — shoot/export on white.
- **Imagery vibe:** clean, saturated anatomical colour on white or monochrome grey families (`#1d1d1f/#86868b/#d2d2d7`); no grain, no photography filters. 3D anatomical renders are intended (none supplied yet).
- **Corner radii:** 8 sm · 12 fields/segmented · 18 content cards · 28 promo tiles & dialogs · 980 pill buttons/tags.
- **Cards:** flat `--color-surface` fill, 18px radius, 24px padding, no border, no shadow. Never coloured left borders.
- **Borders:** 1px hairline `--color-divider` (text at 16%) for tables, nav bottom, inputs. Space first, rules second.
- **Shadows:** nearly flat. sm = 1px edge; md = soft 14px ambient (popovers); lg = 30px (dialogs). Never stacked.
- **Transparency & blur:** only two places — nav (`bg 80%` + `saturate(180%) blur(20px)`) and dialog scrim (40% black + 8px blur).
- **Hover:** primary fill darkens one ramp step (`#0066cc`); outlined/ghost tint 10% link-blue or underline; nav links go 80%→100% ink; interactive cards scale 1.01.
- **Press:** primary two steps darker (`#003a77`); outlined 18% tint. No shrink.
- **Focus:** 2px `--color-accent` outline, 2px offset. Disabled 45% opacity.
- **Animation:** quiet — 160–240ms, `cubic-bezier(.25,.1,.25,1)`, fades/colour/1% scale. No bounces, no parallax gimmicks. Respect `prefers-reduced-motion`.

## ICONOGRAPHY
- No icon set was supplied. Following the Nocturne source, use **Phosphor Icons, Regular weight** (closest free match to SF Symbols) via CDN `https://unpkg.com/@phosphor-icons/web@2.1.1` → `<i class="ph ph-brain"></i>`. ⚠️ Substitution — SF Symbols are Apple-licensed.
- Icons are on `currentColor`, 13–16px inline in buttons/meta, never coloured blue unless inside an action.
- Common: `brain`, `caret-right` (trailing on ghost links), `clock`, `warning`, `magnifying-glass`, `play`, `shield-check`.
- Illustrations: `brain-mono.svg`, `stack-check-mono.svg` — grey-family vector spot art for empty/system states.
- No emoji. No icon font other than Phosphor. No PNG icons.

## Brand mark
`assets/logo/brain-mark.png` — the tri-lobe colour brain is the mark. No wordmark file was supplied; the name is set in the heading font (600) beside the mark. Do not redraw or recolour it.

## Fonts
SF Pro is named first in the stack but **not bundled** (Apple license). Inter loads from Google Fonts as fallback. Supply licensed brand fonts to replace.
