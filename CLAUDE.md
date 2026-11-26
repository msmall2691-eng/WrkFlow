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

## What the site sells — four categories, Nov 14 2026

`lib/content.ts` `services[]` is the single definition; everything else reads
it. **This was five, organised by discipline, and it is now four, organised by
what somebody arrived wanting.**

1. **Websites that bring work in** — a site somebody can hire you from.
2. **Turning visitors into booked work** — quotes, estimates, online booking.
3. **Custom software** — the app a business runs on.
4. **Getting your tools to talk** — integrations, CRM setup, data migration.

Two things changed and both are worth keeping written down. "CRM & platform
setup", "Data migration & cleanup" and "Integrations & automations" were three
services and one complaint: *my systems do not talk and I keep typing the same
thing twice.* They are one category with the detail in `kinds`. And **leads was
missing entirely** — the thing Meg names first when asked what she sells, with
real work behind it already (Instant Estimate, the booking flow, half the free
tools), and no category carrying that word.

**`WorkItem.category` is deliberately not `WorkItem.tier`.** `tier`
(`site`/`product`/`private`) answers "can a visitor go and look at it".
`category` answers "what is this proof of". Sorting the work by `tier` sorted
it by whether Meg could share a URL, which is not a thing a buyer cares about,
and filed three of her strongest builds under a word meaning *you cannot have
this*.

`components/panel/ServiceRouter.tsx` is the one place the homepage asks a
visitor what they came for. The project count under each door is computed from
`work`, never written by hand, and
`e2e/smoke.spec.ts` asserts it against the same source — a count is a claim
about evidence, which is the first rule on this page.

## Voice and copy
- **Nov 14, 2026: no "I" either.** This said *write in first person ("I", "my"), not "we/our"* — the "we" half stands, because a solo founder writing as a company is the oldest small-business tell there is. Meg then asked for the "I" to go too, and the replacement is not a third pronoun: **write about the reader and the work, not the maker.** "I design and build websites" became "Websites, web apps and custom tools for small businesses." It is better copy for the same reason it was asked for: a visitor is deciding about themselves, not about Meg. Where attribution is genuinely needed, name her or M Studio. The About page is the one place a human voice may still be worth keeping; raise it rather than assume.
- Use commas or periods instead of em dashes in user-facing copy.
- US spelling. Location line: "Southern Maine · clients anywhere."
- Lead with websites, web apps and full-stack builds; integrations and automation come second.

## Design and motion
- Show the work. Every section either shows something real she built, lets the visitor use it, or asks them to start a project.
- Nov 1, 2026: Meg chose a new direction, "V2": a one-screen control-panel homepage, scoped to `.cp` in `app/globals.css` (see `components/ControlPanel.tsx`). This replaced the Oct "keep the current look" rule. Build everything in the `.cp` palette and tokens, not a third style. JetBrains Mono only for real code or data.
- **Nov 24, 2026: Harbor is the default and this section is read in that light.** What follows was written on Nov 14 when the site served cream, and it is kept because the token discipline in it still governs — but the premise at the top of it is out of date, and reading it as current is how somebody proposes a palette change the site does not want.

  `middleware.ts` has sent `x-theme-default: dark` for every route since Nov 20, at Meg's word, "after she picked out three dark cinematic sites in a row and said so plainly", and `app/layout.tsx` reads that header before first paint. **Near-black is what a visitor gets; Daylight is the opt-in in ⌘K.** Rendered side by side on Nov 24, this site serves `rgb(8,7,12)` and likeakinginc.com, the reference Meg keeps naming, serves `oklch(0.06 0.008 260)`: the same black.

  The Nov 14 reasoning below was not wrong when it was written, and the rules it produced are still right — a colour that follows the theme is a token, and a change is looked at in both themes before it ships. Only its first sentence has expired. It cost real time on Nov 24: it nearly produced a proposal to take the site light, and it is the reason a Daylight-only hero poster sat where the default theme shows nothing.

- **Nov 14, 2026 (superseded premise, live rules): V2 was light.** Meg's buyers are contractors, admin firms and service businesses, and near-black with neon reads as a developer tool to them rather than as somebody who will build their business a site. The aurora stays, as **accent rather than canvas**: the Daylight branch is a cream `#f7f4ef` ground, white cards, navy ink, with violet/teal/pink at roughly a third of the old opacity.
  - **The panel once ignored the theme entirely.** Middleware then sent `light` for every route (it sends `dark` now) and the pre-paint script in `app/layout.tsx` set it, but `.cp` hardcoded `background:#08070c` with no light branch, so every page wearing the panel was dark whatever the theme. Daylight is now a `:root[data-theme="light"] .cp` branch at the foot of `globals.css`; Harbor survives as a real choice in ⌘K, and the two are checked together.
  - **Two tokens had their ratios measured against the old ground**, and would have shipped as the third instance of the #115 / #118 failure. `.cp .text-signal` and `.marker` were already pointed at `--cp-violet-ink` in Daylight, with a comment quoting 9.25:1 — true against `#08070c`, about 2.1:1 on cream. The tokens are re-pointed per theme rather than the selectors rewritten, so that comment's logic still holds.
  - **Colour that follows the theme is a token, and that now includes borders and fills.** Twenty-five hardcoded `border-white/…` and `bg-white/…` values were invisible-by-design on near-black and grey smears on cream; they are on a two-step scale (`--cp-hairline`, `--cp-fill`, each with a `-strong`). `--cp-on-ink` exists because a button filled with `--cp-ink` had its label hardcoded `#08070c`, which went navy-on-near-black the moment ink became navy. `--cp-well` and `--cp-scrim` are the same story for the product screenshots.
- **Nov 25, 2026: Meg reversed the calm rule, in her own words.** This said *one orchestrated moment per page; no fade-up on every section*, written when she found the first V2 cut too busy. She then asked, repeatedly and plainly, for the site to move the way likeakinginc.com does, and for her own clips and art to carry it. Measured on that reference rather than guessed at: one looping hero video, seven canvases, and an animation or transition on **352 of its 1192 elements**. A single moving hero over an otherwise static page is what this site had, and it is why it still read as a static page with a video on top.

  So the homepage now carries a hero loop, a page-wide drift canvas and a reveal on every section below the fold. What survives from the old rule is the engineering rather than the taste: transform and opacity only, one duration and one curve for all reveals, each reveal fires once, and anything that loops pauses when it cannot be seen.

- **Nov 26, 2026: the homepage is a different page, and the paragraph above
  describes the one it replaced.** It is kept because its engineering half is
  still the law here; only its inventory has expired. The drift canvas is gone
  with the page that carried it, and "a reveal on every section below the
  fold" is now the `.stage` block's business rather than `.cp`'s.

  **How it was decided is the part worth keeping.** Six rounds of editing the
  old homepage one section at a time took Meg from "jumbled and chaotic and
  redundant" to "going in circles or a maze" to "I don't like any of it." The
  method was the fault: every round asked her to judge a design from a
  description or a diff. What worked was three complete homepages, built from
  `lib/content.ts` with her real prices and her own art, published as pages
  she could open on her phone and scroll. She picked one by looking at it, in
  one message, after a day of not being able to. **Build the thing before
  asking which thing.**

  **`.stage` is the live homepage system and `.cp` is not.** The chosen design
  was ported nearly verbatim into a `.stage` block rather than re-interpreted
  into utilities, which is deliberate: re-interpreting is how a design drifts
  away from the thing that was approved. Its tokens keep their own names
  (`--ink`, `--acc`, `--ease`, `--gut`, `--maxw`). `.cp` still dresses every
  other route, so the two systems coexist on purpose until the inner pages
  follow.

  Two things a future change has to know. **Daylight does not reach the
  homepage**: there is no `[data-theme="light"] .stage` branch, because the
  design is one near-black world. That is a real exception to the
  both-themes rule below, taken with Meg's sign-off, and it does not
  generalise to anything else. And **nine components now have no caller** —
  `OceanHero`, `ReefMap`, `Drift`, `MovingChapter`, `TakeReel`, `Shelf`,
  `MoreWork`, `TryItNow`, `WhatConnects`. They were left in place rather
  than deleted inside a port; deleting them is its own change, with
  `seam-check-before-removal` applied to each.
- Motion either demonstrates a system working or responds to the visitor.
- Animate only `transform` and `opacity`; 150ms toggles, 250–350ms panels, 600ms max hero; one easing curve.
- Every animation has a `prefers-reduced-motion: reduce` fallback that shows the end state, and anything that loops stops when it cannot be seen. The hero video is removed under `reduce` rather than paused, because a paused or transparent video still costs the decode the visitor asked to avoid; the drift canvas paints one frame and never starts its loop; reveals land on their end state with no transition.
- **An animation nobody can see is worse than no animation**, and both ways of getting there have now happened here in one sitting. The drift's first version painted 2,480 pixels out of 5.2 million and was simply too faint; its second painted 25,615 and was invisible anyway, because `.cp` has an opaque background and creates no stacking context, so a fixed canvas at a negative z-index resolved against the root and painted *behind* the page. In both cases the instrumentation said it was working. **Measure, then look at it** — and for anything visual, prefer a test that asks whether the screen changed over one that asks whether the code ran.
- A colour that must follow the theme is a token, never a hardcoded value, and
  a change gets looked at in both themes before it ships. This has broken in
  both directions: #115, a chip hardcoded dark that rendered white-on-white in
  Harbor, and #118, illustrations drawn in white that vanished when the site
  moved to a light default. Neither showed up in a build, a test or a
  Lighthouse run; both were only visible by looking.
