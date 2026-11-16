# mlinx.studio design system

Written Nov 16 2026 from the live `.cp` tokens in `app/globals.css`. Every page
wears `.cp`; use the token names below, never raw values. CLAUDE.md has the
history behind each decision.

**Audience and feeling.** Contractors, trades and small service businesses,
mostly men. It should read like a well-run shop: plain, solid, specific. Not
a developer tool, not a lifestyle brand. No purple, pink, cream, glass,
gradient text or decorative motion.

## Color (Daylight, the default)

| Token | Value | Role |
|---|---|---|
| ground (`.cp` background) | `#f4f5f7` | page background, cool light gray |
| `--color-surface` | `#ffffff` | cards, forms, widget panels |
| `--cp-ink` | `#0b1722` | headings, primary text, dark buttons and pills |
| `--cp-soft` | `#3f4a58` | secondary text |
| `--cp-muted` | `#4a5563` | body copy |
| `--cp-faint` | `#5a6572` | labels, meta, captions (5.4:1) |
| `--cp-violet` | `#1d4ed8` | **primary action**: main CTA fill (white label 6.7:1) |
| `--cp-violet-ink` | `#1e40af` | links and inline accents (8.0:1) |
| `--cp-teal` | `#115e59` | focus ring, "live" states |
| `--cp-pink` | `#c2410c` | burnt orange: rare second accent, warnings in demos |
| `--cp-amber` | `#a16207` | demo warnings and same-day flags |
| `--cp-hairline` / `-strong` | ink at 13% / 26% | borders, dividers, the hero grid |
| `--cp-fill` / `-strong` | ink at 3.5% / 7% | sunken fills, code blocks, chips |
| `--cp-on-ink` | `#ffffff` | label on anything filled with `--cp-ink` |

The `violet` and `pink` names are historical; they hold blue and orange.
Harbor (dark) re-points the same tokens; check both themes before shipping.

**Rule of use:** one blue action per screen (the CTA), navy for everything
else that is solid, blue text for links. Orange appears at most once per
page, and never as a button.

## Typography

| Family | Role |
|---|---|
| Space Grotesk (`font-display`) | headings, prices, the logo |
| Inter (`--font-sans`) | body, UI, buttons |
| JetBrains Mono | real code and data only (snippets, readouts) |

Fraunces is loaded for older editorial pages; do not use it on new work.

Scale in use: hero `clamp(2.3rem,4.6vw,3.6rem)` semibold, tracking -0.035em ·
page h1 `1.85rem` → `2.25rem` · section h2 `1.5rem` → `1.875rem` ·
card title `17–18px` semibold · body `15.5–17px`, line-height relaxed ·
meta `12.5–13.5px`. Lines stay under ~75 characters (`max-w-2xl` / `30em`).
Sentence case everywhere. No all-caps labels except the one small
"Recent work" eyebrow in the hero.

## Spacing and layout

Tailwind's 4px scale. Content width `max-w-6xl` with `px-6`, one left edge
for the whole page. Sections `py-12 md:py-16`, divided by a
`--cp-line` border, not by background color changes. Left-aligned, never a
centered stack of sections.

## Shape and depth

Radius: `rounded-md` chips and code · `rounded-lg` small buttons ·
`rounded-xl` primary buttons, inputs and tiles · `rounded-2xl` large cards ·
`rounded-full` pills. Depth: white card + hairline border + the `.cp-tile`
shadow (barely visible). Nothing else casts a shadow except the blue CTA.

## Components

- **Primary button** (`.cp-cta`): blue fill, white label, `rounded-xl`,
  `min-h-11`. One per screen. Hover darkens to `--cp-violet-ink`.
- **Secondary button**: `--cp-ink` fill, `--cp-on-ink` label ("Try the demo",
  "Ask about this").
- **Quiet action**: text link in `--cp-violet-ink`, semibold, no arrow glyphs.
- **Kind pill**: `--cp-ink` fill, white, 12px semibold ("Plug-in", "Web app",
  "Website"). Status sits next to it as plain faint text.
- **Card** (`.cp-tile`): real screenshot on top in a `--cp-well`, then pill,
  name, price, one-line outcome, actions. Never a card without an image.
- **Focus**: 2px `--cp-teal` outline, 3px offset, on every control.
- **Tap targets**: 24px minimum, 44px for primary actions (tested).

## Imagery

Only real captures of real sites and systems (`public/shots/`, webp,
≤75KB, `unoptimized`). Demos are labelled as demos with invented data.
No stock photos, illustrations, emoji or icon decoration. Meg's own photo
is the only portrait. The hero texture is the blueprint grid (`.cp-grid`),
static.

## Motion

Only what responds to the visitor or shows a system working. 150ms
toggles, 250–350ms panels; `transform` and `opacity` only; a
`prefers-reduced-motion` fallback for everything. Daylight has no ambient
animation.
