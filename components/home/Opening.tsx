import BookCall from "../BookCall";
import WeatherLayer from "../WeatherLayer";
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
  return (
    <PanelStage className="relative flex flex-col overflow-hidden lg:min-h-[82svh]">
      {/* The sky: aurora, a pointer glow, and live weather on top. The
          rotating product window that used to sit beside this is gone; the
          aurora is the only moving thing up here now. */}
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
        <span className="cp-aurora cp-a1" />
        <span className="cp-aurora cp-a2" />
        <span className="cp-aurora cp-a3" />
        <span className="cp-glow" />
      </div>
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
              Names what is actually down there, rather than "See the work".
              The old button promised the work and landed on four one-line
              rows of project names; this one promises one job told all the
              way through, which is what #work now holds.
            */}
            <a
              href="#work"
              className="inline-flex items-center rounded-xl border border-[color:var(--cp-hairline-strong)] px-5 py-3.5 text-[15px] font-medium text-[color:var(--cp-ink)] no-underline transition-colors duration-150 hover:border-[color:var(--cp-hairline-strong)]"
            >
              See one job, start to finish
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
    </PanelStage>
  );
}
