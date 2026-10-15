# Nocturne design system — Apple edition

Nocturne is a clean, high-contrast interface in the language of apple.com/br: a black scene with near-white ink, one action blue, pill-shaped buttons, large rounded tiles, SF Pro type with tight negative tracking, and hairlines instead of boxes. Dark is the default — the system's Noturno identity — and a light theme (white canvas, `#f5f5f7` tiles) ships in the same stylesheet. Contrast comes from the neutral ramp and from alternating dark and light bands; blue is reserved for action.

## How to use this

- Link the one stylesheet from every page — `<link rel="stylesheet" href="styles.css">` (adjust the relative path) — and take every color, font, spacing, radius and shadow from its variables (`var(--color-*)`, `var(--font-*)`, `var(--space-*)`, `var(--radius-*)`, `var(--shadow-*)`, `var(--text-*)`). Never hard-code a hex, a font name or a px value the tokens already carry.
- Build with the classes below rather than inventing parallel ones; the component pages are plain HTML, so view source and copy the markup.
- `templates/` holds starting points a consuming project can copy whole.
- The whole system was derived from `theme.json`. To change the look, edit the tokens at the top of `styles.css` — every page, the thumbnail and this guide read from them — and keep `theme.json` and the written guidance in step so they don't drift from what the CSS actually does.

## Themes

Dark is the default (`:root`). Light is `data-theme="light"`, on `<html>` for a whole page or on any `<section>` to flip just that band; `data-theme="dark"` does the reverse inside a light page. The tonal ramps are identical in both themes — what flips are the **roles**: `--color-bg`, `--color-surface`, `--color-surface-raised`, `--color-text`, `--color-text-muted`, `--color-link`, `--color-divider`, the semantic colors, the shadows, and the photograph blend mode. Always style with roles, never with ramp steps picked for one theme only, and the page follows the flip for free.

## Direction

Centred heroes and tiles; generous air *between* sections (64–112px) and tight clusters *inside* them — a headline, one line of subhead and the buttons read as one unit. Pages alternate scenes: the page ground, then an inverse band (`--color-section`: light grey on the dark theme, black on the light one, with its own ink `--color-on-section`), the way apple.com alternates black and `#f5f5f7`. Buttons are pills — a filled blue primary, an outlined secondary, a text-link ghost. Content cards are 18px, promo tiles and dialogs 28px. Wrap every photograph in `.blend`: on the dark theme `mix-blend-mode: lighten` drops a black photo ground into the page, on the light theme `multiply` drops a white one — so shoot on black for dark and on white for light.

## Color

Dark roles: `--color-bg` #000000, `--color-surface` #1d1d1f, `--color-text` #f5f5f7, `--color-text-muted` #a1a1a6. Light roles: #ffffff, #f5f5f7, #1d1d1f, #6e6e73. One accent — `--color-accent` #0071e3, Apple's action blue — used for **fills and the focus ring**. Blue as *text* is `--color-link` (#2997ff on dark, 6.96:1 on black; #0066cc on light, 5.57:1 on white), because the fill blue is too dim for small text on black. Accent-2 mirrors accent (mono scheme: one action voice).

The neutral ramp (`--color-neutral-100` … `900`) is Apple's grey scale (#f5f5f7, #e8e8ed, #d2d2d7, #a1a1a6, #86868b, #6e6e73, #424245, #333336, #1d1d1f). The accent ramp is pinned to apple.com's blues — 400 `#2997ff`, 600 `#0071e3`, 700 `#0066cc` — with tints above and deep steps below. Status colors (`--color-success`, `--color-warning`, `--color-danger`) are for state only, never decoration. `#000000` and `#ffffff` exist as `--color-black` / `--color-white` constants for the two ends of the scale; elsewhere take values from the roles and ramps.

Measured contrast: text on the dark ground 19.3:1; accent fill with white label 4.7:1; link on black 7.0:1; muted text on black 8.2:1. The fill blue on black is 4.5:1 — fine for the focus ring and for large elements, not for small text (use `--color-link`).

## Type

`--font-heading` opens with `-apple-system, BlinkMacSystemFont, "SF Pro Display"`, `--font-body` with `… "SF Pro Text"`; both fall back to **Inter** (loaded from Google Fonts) and then Helvetica Neue / Arial. On every Apple device `-apple-system` resolves to SF Pro with automatic optical sizing (Display at large sizes, Text at small); everywhere else Inter, the closest free match. SF Pro is licensed by Apple for Apple-platform work, so it is **named in the stack but not bundled** — don't self-host it.

Scale (`--text-*`): hero 56 / title 40 / subtitle 28 / card 21 / body 17 / caption 14 / micro 12 px, stepping down to 40 / 32 / 24 / 19 below 734px. Headings are semibold 600 with tight leading (1.07–1.19); body is 17px / 1.47 at −0.022em tracking. Density is 1.0 — the spacing scale is 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64.

## Icons

Use Phosphor icons (https://phosphoricons.com), regular weight, throughout — the closest free match to Apple's SF Symbols, which are licensed for Apple platforms only. Inline the SVG on `currentColor`.

## Interaction states

Interactive states are themed, never browser defaults. The primary pill darkens one ramp step on hover (`--color-accent-700`) and two on press (`--color-accent-800`); outlined and ghost variants tint from `--color-link`; ghost links underline on hover. Keyboard focus is `:focus-visible { outline: 2px solid var(--color-accent); outline-offset: 2px; }` — never leave the default ring.

## Components

| Class | What it is | Shown in |
| --- | --- | --- |
| `.btn` with `.btn-primary`, `.btn-secondary`, `.btn-ghost`, `.btn-sm`, `.btn-icon`, `.btn-block` | Pill actions — the primary is the one blue fill per view | components/buttons.html |
| `.tag` with `.tag-accent`, `.tag-accent-2`, `.tag-neutral`, `.tag-outline`, `.tag-success`, `.tag-warning`, `.tag-danger` | Small pill labels; the three status tags use the semantic colors | components/buttons.html |
| `.field` + `label`, `.input`, `.radio` + `.dot`, `.seg` + `.seg-opt` | 44px fields, radios, and a recessed segmented control on native elements — no script | components/forms.html |
| `.card` with `.card-kicker`, `.card-title`, `.card-body`, `.card-meta`; `.card-tile`; `.elev-sm/md/lg` | Flat surface tiles (18px); the centred 28px promo tile; elevation utilities | components/cards.html |
| `.nav` + `.nav-brand` | The 44px sticky translucent bar with backdrop blur | components/navigation.html |
| `.table` | Data table with hairline rows and a quiet header | components/table.html |
| `.dialog-backdrop` + `.dialog` (+ `.dialog-title/-body/-actions`) | A 28px modal over a blurred scrim, at the top elevation | components/dialog.html |
| `.hr` | A plain 1px hairline — present, but space comes first | — |
| `.blend` (alias `.lighten`) | The photograph wrapper — every content photograph goes through it | foundations/image.html |

States are built in: hovers and pressed states come from the ramps, keyboard focus is the 2px accent ring, `::selection` is an accent tint, and disabled controls drop to 45% opacity. Don't restyle them per page.

## Do

- Reserve blue for action; keep one filled pill per view.
- Separate sections with space and alternating bands before reaching for a rule.
- Use `--color-text-muted` for secondary copy; it is tuned per theme.
- Put photographs through `.blend` and match the photograph's ground to the page's (black on dark, white on light).
- Use `data-theme` on a `<section>` to flip a band.

## Don't

- Don't use blue as decoration or for headings, kickers or icons that aren't actions.
- Don't bolden headings past 600 — hierarchy here is size and space.
- Don't stack shadows; elevation is an edge, then ambient shadow, and cards are flat by default.
- Don't hard-code a font, hex or px value the tokens carry, and don't self-host SF Pro.
- Don't use the fill blue (`--color-accent`) for small text on the dark theme — use `--color-link`.

## Files

- `styles.css` — the only stylesheet: the token sheet (`:root` and `[data-theme="light"]` variables, ramps, base type) plus the component layer. Link it from every page.
- `readme.md` — this guide.
- `theme.json` — the parameters these files were derived from (a machine-readable record of the theme).
- `thumbnail.html` — the project cover (brand mark + ramp strip).
- `foundations/type.html` — the type scale and the SF Pro / Inter stack at real sizes.
- `foundations/color.html` — roles, status colors, the 100–900 ramps, and the dark / light pair.
- `foundations/layout.html` — the spacing scale, radii (8 / 12 / 18 / 28 / pill) and elevation.
- `foundations/icons.html` — the icon set at interface sizes, inline and in buttons.
- `foundations/image.html` — how photographs are treated.
- `components/buttons.html`, `forms.html`, `cards.html`, `navigation.html`, `table.html`, `dialog.html` — each component in every variant and state.
- `theme.html` — the theme's parameters rendered as a reference sheet.
- `templates/landing/` — a starter page consuming the system the intended way: centred hero over a blended photograph, an inverse-ground stat band, a tile grid, a dark / light pair and a sign-up close (`index.html`, its `ds-base.js` loader, and the vendored `image-slot.js`).
- `templates/deck/` — a twenty-one-slide presentation starter on black scenes with light-grey divider bands.
- `assets/photo.jpg` — the reference photograph the imagery page treats.
