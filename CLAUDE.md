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
- Show the work. Every section either shows something real she built, lets the visitor use it, or asks them to start a project.
- Keep the site's current visual identity (colors, typefaces, live Maine daylight/weather theming). Changes are structural, built in existing tokens and components; do not restyle. JetBrains Mono only for real code or data.
- Motion either demonstrates a system working or responds to the visitor. One orchestrated moment per page; no fade-up on every section.
- Animate only `transform` and `opacity`; 150ms toggles, 250–350ms panels, 600ms max hero; one easing curve.
- Every animation has a `prefers-reduced-motion: reduce` fallback that shows the end state. Loops pause off-screen and on hover/focus.
