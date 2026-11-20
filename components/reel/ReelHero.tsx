"use client";

import BookCall from "../BookCall";
import HarborLights from "../harbor/HarborLights";
import PanelHeader from "../panel/PanelHeader";
import ProofStrip from "../ProofStrip";

/*
  The hero: the harbour, the claim, two pill buttons.

  **One screen, not six.** The camera flight this replaces ran 600vh and
  put the first price on screen seven; measured, the whole page was 14.7
  screens on desktop with the shop at 6.9. The LINX prompt's own hero is
  one screen with the reel immediately after it, which is both the better
  shape and the one that stops burying what is for sale.

  The two-line title is the prompt's: a sans first line and a serif
  italic second, shifted right. Fraunces stands in for Instrument Serif
  because it is already loaded in exactly that role, and `app/layout.tsx`
  records what happened the last time this page carried five families.

  **Nov 20 2026: the particle wordmark is gone and `HarborLights` is
  behind the type instead**, at Meg's ask after she sent likeakinginc.com.
  The wordmark spelled "M STUDIO" out of 120k points and, measured at
  1440px, read as a blurry teal smear beside the headline rather than as
  a word: the name was already in the nav and in the logo two inches
  above it, so it was costing a great deal to say a third time, badly.

  **It took three.js with it, and that is the larger win.** `VesperStage`
  and `VesperHero` were the only things in the repository importing
  three, @react-three/fiber, drei, postprocessing and @types/three, so
  the swap removed all six dependencies. The replacement is a 2D canvas
  doing arithmetic on a few dozen points: no WebGL context to lose, no
  fallback gradient to maintain, and nothing to pause but a rAF loop.
  `lib/wordPoints.ts`, which rasterised glyphs to sample them, went too.

  **The slate pre-roll is not built.** The prompt opens with a 0.8s black
  slate, registration grid and a timecode that wipes away. On a studio's
  own site that reads as craft; in front of somebody who arrived to find
  out what a website costs it is eight tenths of a second of nothing, on
  the one page the whole storefront rebuild was about. Said out loud
  rather than quietly dropped: it is a small component if Meg wants it.
*/

export default function ReelHero() {
  return (
    <section
      className="cp-night relative isolate overflow-hidden bg-[#0E0F12]"
      aria-labelledby="hero-heading"
    >
      <HarborLights className="absolute inset-0" />

      {/* Keeps the type legible whatever the water is doing behind it. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(14,15,18,0.92)_0%,rgba(14,15,18,0.7)_38%,rgba(14,15,18,0.85)_100%)] md:bg-[linear-gradient(to_right,rgba(14,15,18,0.94)_0%,rgba(14,15,18,0.82)_38%,rgba(14,15,18,0.3)_72%,rgba(14,15,18,0.6)_100%)]"
      />

      <div className="relative">
        <PanelHeader />
      </div>

      {/* `justify-between` with the copy in its own block, so the proving
          band sits at the foot of the screen the way the reference's does
          rather than floating under the buttons. */}
      <div className="relative mx-auto flex min-h-[82svh] w-full max-w-6xl flex-col justify-between gap-12 px-6 pb-10 pt-14">
        <div className="flex flex-1 flex-col justify-center">
        <p className="m-0 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
          [ Custom software · Southern Maine · clients anywhere ]
        </p>

        <h1
          id="hero-heading"
          className="m-0 mt-6 text-[clamp(2.5rem,6vw,5rem)] font-semibold leading-[0.95] tracking-tight text-[#EDEBE6]"
        >
          <span className="block font-display">Software that</span>
          {/* Shifted right by a column, as the prompt asks, with the one
              signal colour on the stop. */}
          <span className="mt-1 block font-serif font-normal italic md:ml-[8%]">
            runs real businesses<span className="text-[#2dd4bf]">.</span>
          </span>
        </h1>

        <p className="m-0 mt-7 max-w-[40ch] text-[1rem] leading-relaxed text-white/65">
          Websites, web apps and custom tools for small businesses. Built to
          bring work in, and to cut the manual parts out.
        </p>

        <div className="mt-9 flex flex-wrap gap-3">
          <BookCall
            where="hero"
            className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#2dd4bf] px-6 text-[14px] font-semibold text-[#0E0F12] no-underline transition-transform duration-150 hover:-translate-y-0.5"
          >
            Start a take <span aria-hidden="true">→</span>
          </BookCall>
          <a
            href="#shelf"
            className="inline-flex min-h-11 items-center rounded-full border border-white/25 px-6 text-[14px] font-medium text-[#EDEBE6] no-underline transition-colors duration-150 hover:border-white/60"
          >
            See everything, with prices
          </a>
          </div>
        </div>

        <ProofStrip />
      </div>
    </section>
  );
}
