import StageHome from "@/components/stage/StageHome";

/*
  Homepage — the approved design, "Cinematic" (Meg, Nov 25 2026).

  She was shown three directions and picked this one, so the job here was
  a port rather than a design: near-black, two of her own clips, one piece
  of her art, four real screenshots, and one idea per screen. The CSS it
  arrived with is the design, and it is in `app/globals.css` scoped to
  `.stage` — the same way `.cp` scoped the V2 panel — rather than
  re-expressed as utilities, because re-expressing it is how a design
  becomes something that merely resembles itself.

  **Six sections, in this order, and the order is the argument:**

    StageHero      one screen. The reef clip, the headline, two things to
                   do. `id="top"`
    StageServices  id="services" — the four things for sale, as four
                   rows, straight from `services[]`
    StageWork      id="work" — one project opened up, three beside it,
                   and the way into the rest. Every picture is a real
                   capture of a running system
    StageApproach  the breath: the statement, and one of her pieces
                   floating beside it. No claim anywhere near the art
    StagePricing   id="pricing" — four real prices, the note about what
                   is quoted instead, and the four promises
    Contact        id="contact" — the form, over the moorings clip. The
                   same component /services and /brightbase render, in
                   its stage shell
    StageFooter    the wordmark, six links, the location line

  **What this replaced, and what went with it.** The storefront page
  (#156's predecessor) was eighteen screens of shelf, reel, case study,
  free tools, a video chapter, an integration wall and a how-it-starts
  ladder. Nine components came off this page: `OceanHero`, `ReefMap`,
  `Shelf`, `TakeReel`, `MoreWork`, `OneJob`, `TryItNow`, `MovingChapter`
  and `WhatConnects`, plus `Drift` and the `Reveal` wrapper. None of them
  are deleted — `/services`, `/catalog`, `/marketplace` and the case
  studies still render most of them — and the sections that are genuinely
  gone took their tests with them, which `e2e/smoke.spec.ts` records one
  by one.

  **Three things are deliberately still here.** `CommandPalette` is
  mounted outside the stage, which is both where a fixed overlay belongs
  and what keeps the stage's own element styles off a component that was
  not designed for them — ⌘K works on this page exactly as before. The
  contact form is the real one, with its challenge nonce, its offer
  prefill and its request untouched. And every string, price and number
  below resolves to `lib/content.ts`.

  **`StageTopBar` is the site's header now, not this page's.** It shipped
  as the homepage's own, beside `PanelHeader` on every other route, which
  meant the first thing that happened when a visitor left the front page
  was that the header changed. The six routes this page leads to render
  the same component; `PanelHeader` is still the header on the seven that
  have not been converted. `spy` is what fills its page-name slot here:
  this page has no title above the hero, so the bar names the band being
  read instead and marks its link. See the component for the rest.
*/
export default function Home() {
  /* The tree lives in `StageHome` so that the hero comparison at
     /lab/hero/[variant] renders this page rather than a copy of it.
     With no `variant`, the hero is exactly the one that shipped. */
  return <StageHome />;
}
