# mlinx.studio (M Studio) — rules for Claude Code

The current roadmap is `docs/NEXT-LEVEL-HANDOFF.md`. Start there.

## Shipping
- Next.js 15 App Router, TypeScript, Tailwind. Deploys to mlinx.studio via Vercel on merge to `main`.
- One task per branch and PR; squash-merge. Never push to `main` directly.
- Before a PR: `npx tsc --noEmit` and `npx next build` pass. For visual changes, run `npm run build && npm run start` and screenshot affected pages at 1440px and 390px, and look at them.
- Commit as Megan Small with the GitHub noreply address already used in history (personal emails are rejected by push protection).

## Never invent proof
- No made-up stats, testimonials, client names, logos, outcome numbers, addresses or phone numbers, anywhere, including demos and placeholders.
- `lib/content.ts` holds the real numbers; fields like `testimonial`, `metric` and case-study results render nothing until Meg fills them. Leave `TODO(Meg)` instead of writing your own.
- Screenshots in `public/shots/` must be real captures of real sites or systems.

## Voice and copy
- **Nov 14, 2026: no "I" either.** This said *write in first person ("I", "my"), not "we/our"* — the "we" half stands, because a solo founder writing as a company is the oldest small-business tell there is. Meg then asked for the "I" to go too, and the replacement is not a third pronoun: **write about the reader and the work, not the maker.** "I design and build websites" became "Websites, web apps and custom tools for small businesses." It is better copy for the same reason it was asked for: a visitor is deciding about themselves, not about Meg. Where attribution is genuinely needed, name her or M Studio. The About page is the one place a human voice may still be worth keeping; raise it rather than assume.
- Use commas or periods instead of em dashes in user-facing copy.
- US spelling. Location line: "Southern Maine · clients anywhere."
- Lead with websites, web apps and full-stack builds; integrations and automation come second.

## Design and motion
- Show the work. Every section either shows something real she built, lets the visitor use it, or asks them to start a project.
- Nov 1, 2026: Meg chose a new direction, "V2": a one-screen control-panel homepage, scoped to `.cp` in `app/globals.css` (see `components/ControlPanel.tsx`). This replaced the Oct "keep the current look" rule. Build everything in the `.cp` palette and tokens, not a third style. JetBrains Mono only for real code or data.
- **Nov 14, 2026: V2 is light. The "near-black" half of the rule above is reversed.** Meg's buyers are contractors, admin firms and service businesses, and near-black with neon reads as a developer tool to them rather than as somebody who will build their business a site. The aurora stays, as **accent rather than canvas**: cream `#f7f4ef` ground, white cards, navy ink, with violet/teal/pink at roughly a third of the old opacity.
  - **The site already defaulted to light and the panel ignored it.** Middleware sends `light` for every route and the pre-paint script in `app/layout.tsx` sets it, but `.cp` hardcoded `background:#08070c` with no light branch, so every page wearing the panel was dark whatever the theme. Daylight is now a `:root[data-theme="light"] .cp` branch at the foot of `globals.css`; Harbor survives as a real choice in ⌘K, and the two are checked together.
  - **Two tokens had their ratios measured against the old ground**, and would have shipped as the third instance of the #115 / #118 failure. `.cp .text-signal` and `.marker` were already pointed at `--cp-violet-ink` in Daylight, with a comment quoting 9.25:1 — true against `#08070c`, about 2.1:1 on cream. The tokens are re-pointed per theme rather than the selectors rewritten, so that comment's logic still holds.
  - **Colour that follows the theme is a token, and that now includes borders and fills.** Twenty-five hardcoded `border-white/…` and `bg-white/…` values were invisible-by-design on near-black and grey smears on cream; they are on a two-step scale (`--cp-hairline`, `--cp-fill`, each with a `-strong`). `--cp-on-ink` exists because a button filled with `--cp-ink` had its label hardcoded `#08070c`, which went navy-on-near-black the moment ink became navy. `--cp-well` and `--cp-scrim` are the same story for the product screenshots.
- Motion either demonstrates a system working or responds to the visitor. One orchestrated moment per page; no fade-up on every section.
- Animate only `transform` and `opacity`; 150ms toggles, 250–350ms panels, 600ms max hero; one easing curve.
- Every animation has a `prefers-reduced-motion: reduce` fallback that shows the end state. Only the proof reel and the live hero sky (V2: the aurora) loop; both pause off-screen. Keep the V2 homepage calm: Meg found the first cut too busy.
- A colour that must follow the theme is a token, never a hardcoded value, and
  a change gets looked at in both themes before it ships. This has broken in
  both directions: #115, a chip hardcoded dark that rendered white-on-white in
  Harbor, and #118, illustrations drawn in white that vanished when the site
  moved to a light default. Neither showed up in a build, a test or a
  Lighthouse run; both were only visible by looking.
