import BookCall from "../BookCall";
import PanelHeader from "../panel/PanelHeader";
import ProofStrip from "../ProofStrip";

/*
  The first screen of the dive.

  **This used to own the video and no longer does, which is the whole of
  Meg's correction.** It was a pinned track that scrubbed a clip inside
  itself: the descent started at the top of the page and was over before
  the second section, and the ocean went with it. She asked for the ocean
  *behind the page*, still moving while you read, so the video moved out of
  the hero and this went back to being what it always should have
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
      /* `night-band` gives this section a dark ground in Daylight only. In
         Harbor the page's dive is behind it and a ground would hide it;
         in Daylight there is no backdrop, and everything in here (the
         headline, the eyebrow, the proof numbers below the fold) is
         hardcoded for a dark ground because it has always sat on video.
         The poster covers the first screen; this covers the strip under
         it that ProofStrip lives in, which would otherwise have been
         white figures on cream. */
      className="night-band cp-night relative isolate"
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
        {/*
          Meg's own 6040x4320 piece, and it is the hero in **both** themes
          rather than Daylight's stand-in.

          **It needs no treatment at all, which is why it is here.** Its
          border measures luma 8.7; `#08070c`, the page ground, is 8. The
          art stops and the page carries on, with no mask, no vignette and
          no scrim doing the work. Every other picture on this site had to
          be dissolved into the page with `.ocean-bleed` or
          `.creature-bleed`; this one already is the page. Centre against
          border is 43 to 8, a ratio of 5.39, where the best thing
          previously here managed 2.82 and the poster it replaces managed
          1.17.

          That poster was Daylight-only and the hero was transparent in
          Harbor, so the first screen was whatever frame the dive happened
          to be paused on. A deliberate image is better than an accident,
          and this is the Like a King shape exactly: one lit subject on
          black with nothing competing. Theirs is a tree.

          The dive is not gone, it is what you descend into: this covers
          the first screen, and scrolling reveals the backdrop underneath
          it still running.
        */}
        {/*
          **The hero moves again, and this time it is cheap enough to mean
          it.** Meg asked for the site to feel alive the way
          likeakinginc.com does, and that reference turns out to be one
          looping hero video rather than a pile of clips: measured on their
          page, a single `hero-bg.mp4`, autoplay, loop, muted, playsInline,
          full-bleed.

          The clip is her own HUD reef, chosen on numbers rather than by
          eye. Of nine candidates it is the **darkest** (mean luma 33.2
          against 40-88 for the rest), which is what lets near-white type
          sit on it, and its first and last frames differ by **0.4** on a
          0-255 scale, where the next best was 27 — so it cycles with no
          visible seam at all. It is also the shortest, which is why the
          whole thing costs 0.22MB: the `dive.mp4` deleted in #154 was
          2.9MB for a clip the page then faded to 22%.

          It is the right clip for a second reason that is not a
          measurement. It is a reef with live readouts over it — storm
          influx, coral health, current flow — so the first screen is a
          dashboard rather than a picture near one, which is the thing
          this studio actually sells.

          **No JavaScript.** autoplay + loop + muted + playsInline is
          plain HTML, so this stays a server component and the page needs
          no hydration to move. `muted` is not decoration: no browser will
          autoplay sound, and iOS will not autoplay at all without
          `playsInline`.

          The still underneath is the video's own first frame, so the
          fallback is not a different picture: it is this picture, stopped.
          It covers three cases at once — the video still loading, a
          browser that can decode neither source, and a visitor who asked
          for no motion, for whom CSS hides the video and leaves the frame.
        */}
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/ocean/video/reef-hud-poster.webp"
          alt=""
          aria-hidden="true"
          fetchPriority="high"
          className="absolute inset-0 h-full w-full object-cover object-center"
        />

        <video
          className="hero-motion absolute inset-0 h-full w-full object-cover object-center"
          autoPlay
          loop
          muted
          playsInline
          preload="metadata"
          poster="/ocean/video/reef-hud-poster.webp"
          aria-hidden="true"
        >
          {/* WebM first: smaller, and the only one some test browsers
              decode. Safari and iOS take the H.264 and will autoplay
              nothing else. */}
          <source src="/ocean/video/reef-hud.webm" type="video/webm" />
          <source src="/ocean/video/reef-hud.mp4" type="video/mp4" />
        </video>

        {/* Much lighter than it was, because the art under it is already
            dark where the words go: measured, the left third of this image
            is luma 14.2. The old 0.72 was solved against a surface poster
            that read 76 there, and carried onto this it would crush the
            art to the page colour for no gain. */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(to_bottom,rgba(5,7,11,0.35)_0%,rgba(5,7,11,0.1)_45%,rgba(5,7,11,0.4)_100%)] md:bg-[linear-gradient(to_right,rgba(5,7,11,0.5)_0%,rgba(5,7,11,0.18)_42%,rgba(5,7,11,0)_72%)]"
        />

        {/*
          A short scrim under the nav only, and it is a measurement.

          Meg's piece puts its brightest light at the top centre, which is
          exactly where the nav sits. Measured on the built page the moment
          this became the hero, "Catalog" fell to 2.61:1 and "About" to
          4.01:1 — two failures that were not there an hour ago and are
          mine. `PanelHeader`'s own `onMedia` wash is rgba(5,7,11,0.42)
          behind a blur, which was solved against the surface poster and is
          not enough against that.

          Deepening that wash was the obvious fix and the wrong one: it
          would put a dark bar across the top of the art on every page that
          uses it. This darkens the top 7rem of the hero alone, fading to
          nothing, so the nav gets its ground and the picture keeps its
          picture four pixels below.
        */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 top-0 h-28 bg-[linear-gradient(to_bottom,rgba(5,7,11,0.78)_0%,rgba(5,7,11,0.45)_55%,rgba(5,7,11,0)_100%)]"
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
            className="m-0 mt-6 max-w-[16ch] font-display text-[clamp(2.75rem,6.2vw,5.75rem)] font-normal leading-[0.92] tracking-tight text-[#EDEBE6]"
          >
            {/* `font-normal`, which is the single biggest measured
                difference between this hero and the one Meg keeps
                pointing at. likeakinginc.com sets its h1 at 86.4px,
                weight 400, -0.025em; this was 73.6px, weight 600,
                -0.025em. The tracking already matched and the weight was
                the tell: 600 at that size reads as a product headline,
                400 reads as the thing she is asking for. StackedHeading
                has been 400 the whole time, so the hero was the one
                heading on the site arguing with the rest of them. */}
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
