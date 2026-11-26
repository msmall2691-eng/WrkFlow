import StageTopBar from "@/components/stage/StageTopBar";
import StageHero from "@/components/stage/StageHero";
import StageServices from "@/components/stage/StageServices";
import StageWork from "@/components/stage/StageWork";
import StageApproach from "@/components/stage/StageApproach";
import StagePricing from "@/components/stage/StagePricing";
import StageFooter from "@/components/stage/StageFooter";
import StageMotion from "@/components/stage/StageMotion";
import Contact from "@/components/Contact";
import CommandPalette from "@/components/CommandPalette";

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

  `PanelHeader` is not on this page any more and is not deleted: it is
  the site's header on ten other routes. `StageTopBar` is the homepage's
  own bar, which is what the design asks for over moving video.
*/
export default function Home() {
  return (
    <div className="stage">
      <a className="skip" href="#main">
        Skip to content
      </a>

      <StageTopBar />

      <main id="main">
        <StageHero />
        <StageServices />
        <StageWork />
        <StageApproach />
        <StagePricing />
        <Contact variant="stage" />
      </main>

      <StageFooter />

      {/* ⌘K, outside the stage: a fixed overlay belongs at the end of the
          page, and keeping it out of `.stage` keeps the design's element
          styles off a component drawn in the site's own palette. */}
      <CommandPalette />

      {/*
        One controller for the whole page's motion: the reveals, the two
        clips and the two CSS loops. It reconciles intersection, the
        motion preference and tab visibility in one place, which is the
        correction `MovingChapter` and `HeroLoop` were both brought to.
      */}
      <StageMotion />
    </div>
  );
}
