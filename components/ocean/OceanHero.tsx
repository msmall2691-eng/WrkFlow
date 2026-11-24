import BookCall from "../BookCall";
import PanelHeader from "../panel/PanelHeader";
import ProofStrip from "../ProofStrip";

/*
  The first screen of the dive.

  **This used to own the video and no longer does, which is the whole of
  Meg's correction.** It was a pinned track that scrubbed a clip inside
  itself: the descent started at the top of the page and was over before
  the second section, and the ocean went with it. She asked for the ocean
  *behind the page*, still moving while you read, so the video moved out to
  `OceanBackdrop` and this went back to being what it always should have
  been — a screen of copy sitting on the surface of it.

  Three things fell out of that, and all three are improvements rather than
  consolations:

  **It is a server component again.** There is no `useState`, no
  `matchMedia`, no `requestAnimationFrame` and no ref: the three modes, the
  priming, the seek throttling and the Save-Data branch all belong to the
  thing that actually plays, and there is one of those on the page instead
  of one per section.

  **It costs one screen instead of 3.2.** The pinned track was 320vh, so
  everything below it started three and a bit screens down. The shop moves
  up by that much, which matters more here than anywhere: CLAUDE.md records
  that this page was rebuilt because Meg said it was "hard to see what is
  for sale that's tangible", and `the shop is on the homepage, near the
  top` is the guard on exactly that.

  **The fallbacks stopped being this component's problem.** There is no
  `<video>` here to fail, so the copy, both calls to action and the proof
  numbers are plain server-rendered markup that works with no JavaScript,
  no WebGL and no network beyond the HTML. The backdrop degrades to a
  still, and under that to nothing, and this screen reads the same either
  way.

  **The gradient that is left is doing a different job from the one it
  replaced.** The old one had to darken a video playing directly behind
  this text. The backdrop now carries the page-wide wash, so this is only
  the extra contrast the headline needs over the brightest part of the
  surface, which is the top left. Keeping the old three-stop version on top
  of the new wash would have made the first screen the darkest thing on a
  page that is supposed to open at the surface.
*/
export default function OceanHero() {
  return (
    <section
      /* `hero-band` gives this section a dark ground in Daylight only. In
         Harbor the page's dive is behind it and a ground would hide it;
         in Daylight there is no backdrop, and everything in here (the
         headline, the eyebrow, the proof numbers below the fold) is
         hardcoded for a dark ground because it has always sat on video.
         The poster covers the first screen; this covers the strip under
         it that ProofStrip lives in, which would otherwise have been
         white figures on cream. */
      className="hero-band cp-night relative isolate"
      aria-labelledby="hero-heading"
    >
      <div className="flex h-svh min-h-[34rem] flex-col overflow-hidden">
        {/*
          **Daylight's copy of the ocean, and the bug it exists to fix.**

          This hero's type is hardcoded near-white and it paints a dark
          gradient, because for its whole life it has sat on video. Moving
          the video out to a page backdrop that Harbor alone renders left
          both of those stranded in Daylight: measured, the headline came
          out near-white on cream and the nav links were barely visible.
          It is #115 and #118 a fourth time — a thing styled for one ground
          and then shown on the other — and this one was mine.

          Two ways out, and the cheap one is wrong. Showing the whole
          page-wide dive in Daylight would put a dark ocean behind cream
          content, which is the exact reason CLAUDE.md gives for the site
          going light in the first place. So instead the *hero* keeps its
          ocean in both themes and only the page behind it changes: Harbor
          gets the dive running the full height of the document, Daylight
          gets a cream page that opens on one band of still water. The
          hero's own styling is then true in both, unchanged.

          It is the poster rather than the video on purpose. In Daylight
          this is a single band rather than the page's ground, nothing
          scrubs it, and a still is 131KB against 2.7MB.
        */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/ocean/surface-poster.webp"
          alt=""
          aria-hidden="true"
          className="hero-daylight-sea absolute inset-0 h-full w-full object-cover"
        />

        {/* Only as much as the headline needs, and only where it sits. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,7,11,0.55)_0%,rgba(5,7,11,0.2)_45%,rgba(5,7,11,0.45)_100%)] md:bg-[linear-gradient(to_right,rgba(5,7,11,0.72)_0%,rgba(5,7,11,0.45)_38%,rgba(5,7,11,0)_72%)]"
        />

        {/* `onMedia`: this is the one header that sits on video. See the
            prop's own note for the measurement that earned it. */}
        <div className="relative">
          <PanelHeader onMedia />
        </div>

        <div className="relative mx-auto flex w-full max-w-6xl flex-1 flex-col justify-center px-6 pb-12 pt-4">
          <p className="m-0 font-mono text-[11px] uppercase tracking-[0.2em] text-white/50">
            [ Custom software · Southern Maine · clients anywhere ]
          </p>

          {/*
            **`font-display` is on the h1 itself, not only on the spans.**
            The two child spans set `font-display` and `font-serif`, so the
            h1 had no face of its own and inherited Inter from the body:
            measured, this heading reported `Inter` as its computed family
            while looking correct, because every glyph on screen belongs to
            a span.

            This hero stays bespoke rather than moving to StackedHeading:
            it is the one heading on the site set over moving video, in its
            own fixed near-white rather than a theme token, with a two-face
            composition and the teal full stop. That is a designed
            exception, and the scale it is an exception to is written down
            in one place.
          */}
          <h1
            id="hero-heading"
            className="m-0 mt-6 max-w-[16ch] font-display text-[clamp(2.5rem,5.4vw,4.6rem)] font-semibold leading-[0.95] tracking-tight text-[#EDEBE6]"
          >
            <span className="block font-display">Software that</span>
            <span className="mt-1 block font-serif font-normal italic">
              runs real businesses<span className="text-[#2dd4bf]">.</span>
            </span>
          </h1>

          <p className="m-0 mt-7 max-w-[40ch] text-[1rem] leading-relaxed text-white/70">
            Websites, web apps and custom tools for small businesses. Built to
            bring work in, and to cut the manual parts out.
          </p>

          <div className="mt-9 flex flex-wrap gap-3">
            <BookCall
              where="hero"
              className="inline-flex min-h-11 items-center gap-2 rounded-full bg-[#2dd4bf] px-6 text-[14px] font-semibold text-[#05070b] no-underline transition-transform duration-150 hover:-translate-y-0.5"
            >
              Start a project <span aria-hidden="true">→</span>
            </BookCall>
            {/* Stays pointed at the shop, and a test enforces it: this page
                exists because it was hard to see what was for sale. */}
            <a
              href="#shelf"
              className="inline-flex min-h-11 items-center rounded-full border border-white/25 px-6 text-[14px] font-medium text-[#EDEBE6] no-underline transition-colors duration-150 hover:border-white/60"
            >
              See everything, with prices
            </a>
          </div>
        </div>
      </div>

      <div className="relative mx-auto w-full max-w-6xl px-6 pb-10">
        <ProofStrip />
      </div>
    </section>
  );
}
