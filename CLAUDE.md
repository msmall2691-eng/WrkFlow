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
- Meg is a solo founder: write in first person ("I", "my"), not "we/our".
- Use commas or periods instead of em dashes in user-facing copy.
- US spelling. Location line: "Southern Maine · clients anywhere."
- Lead with websites, web apps and full-stack builds; integrations and automation come second.

## Design and motion

Meg changed this direction on Nov 1, 2026. The old rules said keep the current
identity and do not restyle, and capped the site at one orchestrated moment per
page and two looping animations. She wants the opposite now: richer, more
futuristic, far more movement, and live data visibly moving. The taste rules
below are gone. The physics rules are not, because they are what keeps motion
from being jank, and the site is at 100 on accessibility.

- Show the work. Every section either shows something real she built, lets the
  visitor use it, or asks them to start a project. This one does not change: it
  is why the site exists, and "futuristic" is not a licence to add decoration
  that proves nothing.
- Restyling is allowed, and wanted. Colors, type scale, weight, density and
  layout are all open. Keep the live Maine daylight/weather theming, which is
  Meg's signature, and keep both themes working: a colour that must follow the
  theme is a token, never a hardcoded value. That rule has bitten twice now
  (#115 and the /services illustrations in #118), in both directions.
- Motion is encouraged, including ambient motion and loops. It should still
  mean something: a system working, data arriving, or a response to the
  visitor.
- Animate `transform` and `opacity` by preference, because they are the two the
  compositor can do cheaply. Reach for anything else only when the effect needs
  it, and check the frame cost.
- Every animation still needs a `prefers-reduced-motion: reduce` fallback that
  shows the end state, and anything that loops still pauses off-screen and when
  the tab is hidden. These are not style choices.
- Watch the budget rather than a rule: keep Lighthouse accessibility at 100 and
  report mobile performance honestly in the PR, before and after. If an effect
  costs real points, say what it cost and let Meg decide.
- JetBrains Mono only for real code or data.
