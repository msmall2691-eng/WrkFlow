import BookCall from "../BookCall";
import WeatherLayer from "../WeatherLayer";
import BlueprintRise from "./BlueprintRise";
import PanelStage from "../panel/PanelStage";
import PanelHeader from "../panel/PanelHeader";
import { provingGround } from "@/lib/content";

/*
  Opening — the first screen, and now only the first screen.

  **This replaced a dashboard, and the reason is worth keeping written
  down.** The V2 panel put six things on one screen: the headline, a
  rotating window of four shipped screens, a tile listing four projects by
  name, a tile of three free tools, and the live readout. Below it came
  three case-study cards, which were the same four projects again. Meg's
  own words on the result: "it's very redundant and I cannot see anything
  that would make me want to have someone build something for me and it all
  just looks like it's all over the place."

  Measured, she was right. Four projects appeared three times each before a
  visitor reached anything new, and The Remote Admin and linx appeared with
  the same sentence copied between two of those blocks. Adding a service
  router between them stretched the repetition rather than fixing it.

  So the page is one argument now, in the order somebody actually asks it:
  what do you do (the four doors), show me one (the worked example), what
  else (four more), how do I start. This section is the first beat only: a
  headline, a sentence, one way in, and the operating history that answers
  "has this person done this before".

  **The numbers moved up here from the bottom of the old work section.**
  They are The Maine Cleaning Co's own, labelled as such in lib/content.ts,
  and they are the only hard evidence on the site that is confirmed. Buried
  under three cards they were the last thing a visitor read; the question
  they answer is the first one asked.

  Deliberately NOT a full 100svh: the old panel filled the screen exactly,
  so nothing below it was ever hinted at. 82svh leaves the top of the next
  section showing, which is what invites the scroll the rest of the page
  depends on.
*/
export default function Opening() {
  /*
    Tall on large screens, so the scene has scroll to play across, with
    everything inside pinned to the top while it does. That is the whole of
    "scroll-driven stages": the headline holds still and the building
    assembles behind it, then the section releases and the shop comes up.

    It costs about two thirds of a screen of page length, which is a real
    cost on a page Meg has already called too long, and it is the thing she
    asked for by name.

    Pinned on `lg` only. Below that the inner wrapper is an ordinary block,
    so a phone scrolls through the same stages without a sticky element it
    has no room for.
  */
  /*
    No `overflow-hidden` on PanelStage, and that is load-bearing rather than
    tidy: a clipped ancestor becomes the scroll container for anything
    `sticky` inside it, so the pin does nothing and the hero just scrolls
    away. It shipped that way once in this very change, and CLAUDE.md
    already records the same failure from the case-study page. The clipping
    lives on the pinned wrapper instead, which is where it is wanted anyway.
  */
  return (
      <PanelStage className="bp-track relative flex flex-col">
        {/*
          The pin lives in CSS (`.bp-track` / `.bp-pin`) rather than in `lg:`
          utilities, because it has to be gated on viewport HEIGHT as well as
          width and Tailwind's `lg:` is width only.

          Two things it must not do, both found by Codex on this PR. It must
          not carry `flex-1`, which stretches this child to the full height of
          the track and leaves `sticky` nothing to stick across. And it must
          not be a fixed height with `overflow-hidden` on a short window: at
          1280x620 the content measured 671px against a 620px wrapper, so 51px
          of it, including the end of the operating-history row, was clipped
          and unreachable, because scrolling moves the track rather than the
          pinned box. Anyone on a short laptop window or with larger text hit
          it. Below the height threshold there is simply no pin.
        */}
        <div className="bp-pin relative flex flex-col">
      {/*
        The scene: a floor plan that inks itself onto paper, tips back into
        perspective, stands its walls up and lights its windows, driven by
        scroll.

        **This replaced the aurora, at Meg's direct ask**: "3D scenes,
        particles, moving fog, a blueprint rising into a building,
        scroll-driven stages." The aurora was a mood; this is an argument.
        Her buyers are contractors, rental owners and service businesses,
        and a drawing that becomes the thing it describes is what she sells
        them, in an image they already live in.

        It keeps the aurora's colour family, because its fog is built from
        `--cp-violet-wash` and `--cp-fill-strong` rather than a palette of
        its own, so the hero still belongs to the V2 look rather than
        arriving as a third style.
      */}
      <BlueprintRise />
      <WeatherLayer />

      <PanelHeader />

      {/*
        Same `mx-auto max-w-6xl px-6` container as every section below.

        The first cut used the old panel's full-bleed `px-6 lg:px-10`, so at
        1440 the headline started at 56px and "What are you trying to fix?"
        started at 168px: one visible step in the left edge, at the exact
        point a visitor's eye drops from the hero to the page. Contained, the
        whole page has one left edge, and the space to the right of the
        headline reads as a margin rather than as something missing.
      */}
      <main className="relative z-10 mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center gap-10 px-6 pb-14 pt-10 lg:pb-16" id="top">
        <div className="flex max-w-3xl flex-col gap-5">
          <span className="text-[14px] text-[color:var(--cp-soft)]">
            Southern Maine · clients anywhere
          </span>
          <h1 className="m-0 font-display text-[clamp(2.6rem,5.2vw,4.4rem)] font-semibold leading-[0.96] tracking-[-0.045em] text-balance text-[color:var(--cp-ink)]">
            Software that runs <span className="cp-grad">real businesses.</span>
          </h1>
          <p className="m-0 max-w-[32em] text-[1.0625rem] leading-relaxed text-[color:var(--cp-muted)]">
            Websites, web apps and custom tools for small businesses. Built to
            bring work in, and to cut the manual parts out.
          </p>
          <div className="mt-1 flex flex-wrap gap-3">
            <BookCall
              where="hero"
              className="cp-cta inline-flex items-center gap-2.5 rounded-xl px-5 py-3.5 text-[15px] font-semibold text-white no-underline transition-transform duration-150 hover:-translate-y-0.5"
            >
              Book a free 15-min call <span aria-hidden="true">→</span>
            </BookCall>
            {/*
              Points at the shop, not at the portfolio, and that is the
              storefront rebuild in one line.

              It read "See one job, start to finish" and landed on the case
              study. Fine for a portfolio, wrong here: measured on the live
              site, a visitor met their first purchasable price on screen 12
              of 18, and the one button offering an alternative to booking a
              call sent them further into the proof rather than to the
              goods. The case study is still the next thing after the shelf;
              it just stops being the only thing the hero offers.
            */}
            <a
              href="#shelf"
              className="inline-flex items-center rounded-xl border border-[color:var(--cp-hairline-strong)] px-5 py-3.5 text-[15px] font-medium text-[color:var(--cp-ink)] no-underline transition-colors duration-150 hover:border-[color:var(--cp-hairline-strong)]"
            >
              See everything, with prices
            </a>
          </div>
        </div>

        {/* The proving ground, attributed. See the header note. */}
        <div className="border-t border-[color:var(--cp-line)] pt-7">
          <p className="m-0 text-[12px] uppercase tracking-wider text-[color:var(--cp-faint)]">
            {provingGround.label}
          </p>
          <dl className="mt-5 grid grid-cols-2 gap-x-8 gap-y-6 sm:grid-cols-4">
            {provingGround.stats.map((s) => (
              <div key={s.label}>
                <dt className="sr-only">{s.label}</dt>
                <dd className="m-0">
                  <span className="block font-display text-2xl font-semibold text-[color:var(--cp-ink)] md:text-3xl">
                    {s.value}
                  </span>
                  <span className="mt-1 block text-[13.5px] leading-snug text-[color:var(--cp-muted)]">
                    {s.label}
                  </span>
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </main>
    </div>
    </PanelStage>
  );
}
