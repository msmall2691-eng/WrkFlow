import { homeHero } from "@/lib/content";

/** Which hero to draw. `a` is the live one; the others exist to be looked at. */
export type HeroVariant = "a" | "b" | "c";

/*
  01 — the hero. One screen, Meg's own reef footage behind it, the
  headline sitting on the floor of it.

  The clip is `shot-one`, which the design names: of the nine she sent it
  is the darkest, which is what lets near-white type sit on it. WebM
  first and H.264 second, as everywhere else here — some Linux builds
  (including the browser the suite drives) ship without H.264, and Safari
  will autoplay nothing else.

  **The poster is on the wrapper as well as on the video**, which is the
  design's own trick and does real work: it is the frame a visitor sees
  while the clip loads, if it never loads, and under
  `prefers-reduced-motion`, where CSS hides the video and leaves the
  picture. Nothing about the hero's composition depends on the video
  playing.

  `autoPlay` stays on the element so a visitor with no JavaScript still
  gets the loop; `StageMotion` only ever takes playback away and gives it
  back. This stays a server component for that reason.

  No reveal on anything in here, which is the design's own call: the hero
  is the first thing on screen, so it is simply there. The mockup marks
  its lines `.rv.in`, which resolves to the end state at first paint.

  ───────────────────────────────────────────────────────────────────────
  Nov 27 2026 — three variants, because Meg asked to look at them.

  The question she raised was "idk if im even in the right place": on a
  390px phone the top half of the first screen is an octopus and a sea
  turtle before a single word appears. That is a real question about what
  the first screen is *for*, and it is hers to answer by looking rather
  than mine to answer in a diff — the three-complete-homepages method in
  CLAUDE.md, which is the only one that has worked on this page.

    a  the live hero, unchanged. Art-led.
    b  the same art, text raised on a phone so the words are not below
       the midpoint. Art-led but readable. Desktop is untouched.
    c  the work is the hero: the words beside a real capture of
       BrightBase, on flat near-black, no clip. Work-led.

  **`a` is the default and every caller that does not ask for a variant
  gets exactly the markup that shipped**, so the live homepage cannot
  drift while the other two are being looked at. The variants are
  reachable only at /lab/hero/[variant], which is noindex.
*/
export default function StageHero({ variant = "a" }: { variant?: HeroVariant }) {
  /* The three share their words. Only the frame around them differs, which
     is the whole point of the comparison: nothing here is a copy test. */
  const words = (
    <div className="hero-inner">
      <p className="eyebrow">
        <span className="tick">●</span> {homeHero.eyebrow}
      </p>
      <h1>{homeHero.headline}</h1>
      <p className="hero-sub">{homeHero.sub}</p>
      <p className="hero-meta">{homeHero.location}</p>
      <div className="hero-cta">
        <a href="#contact" className="btn btn-solid">
          {homeHero.primary} <span className="arw">→</span>
        </a>
        <a href="#work" className="btn btn-ghost">
          {homeHero.secondary}
        </a>
      </div>
    </div>
  );

  /*
    c — no clip at all. A real capture of BrightBase's week schedule sits
    in the same `.frame`/`.chrome` the work section already uses for every
    screenshot on this site, so this borrows the page's own vocabulary
    rather than inventing a second one. The capture is of demo data (a
    fictional company), which is what makes it safe to show unredacted;
    see lib/brightbase.ts.
  */
  if (variant === "c") {
    return (
      <section className="hero hero-split" id="top">
        <div className="wrap">
          <div className="hero-grid">
            {words}
            <figure className="frame hero-frame">
              <div className="chrome" aria-hidden="true">
                <span className="dot" />
                <span className="dot" />
                <span className="dot" />
                <span className="host">app.maineclean.co</span>
              </div>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/shots/brightbase/schedule.webp"
                alt="The week schedule in BrightBase, with jobs, turnovers and the crew assigned to each."
                loading="eager"
                decoding="async"
              />
            </figure>
          </div>
        </div>
      </section>
    );
  }

  /* a and b are the same markup. `hero-raise` is a phone-only rule. */
  return (
    <section
      className={variant === "b" ? "hero hero-raise" : "hero"}
      id="top"
    >
      <div
        className="media"
        data-vid=""
        style={{ backgroundImage: "url('/ocean/video/shot-one-poster.webp')" }}
      >
        <video
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          poster="/ocean/video/shot-one-poster.webp"
          aria-hidden="true"
          tabIndex={-1}
        >
          <source src="/ocean/video/shot-one.webm" type="video/webm" />
          <source src="/ocean/video/shot-one.mp4" type="video/mp4" />
        </video>
        <div className="scrim scrim-h" />
        <div className="scrim scrim-v" />
      </div>

      <div className="wrap">{words}</div>
      <div className="scrollcue" aria-hidden="true" />
    </section>
  );
}
