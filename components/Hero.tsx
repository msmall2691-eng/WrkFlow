import Link from "next/link";
import DaylightSky from "./DaylightSky";
import HeroLivePanel from "./HeroLivePanel";
import OfferLink from "./OfferLink";

/*
  Hero — headline left, the live Maine panel right.

  This slot has been argued over twice in the repo's history, so the result
  is written down. #109 replaced the live weather panel with the proof reel,
  on the reasoning that the panel proved we can read a weather API rather
  than build a business a website. #110 recorded Meg's decision the other
  way: the panel stays as her signature and as proof she wires sites to live
  data, with the proof reel directly beneath the hero as its own band. #109
  merged after #110 and took the panel out anyway. The decision wins.

  What #109 was right about is kept: the panel now carries a caption saying
  what the live data is proof of, and under 640px it collapses to a one-line
  strip, so the hero does not spend a whole phone screen on conditions. See
  HeroLivePanel.

  The viewport lock is `lg:` only. At 390px the hero ends at its natural
  height, so the proof reel below is already peeking above the fold.
*/
export default function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden bg-[var(--hero-bg)] pb-14 pt-24 lg:flex lg:min-h-[86vh] lg:items-center lg:pb-16"
    >
      {/* The page tint, read from the live Portland sky. CSS gradients only —
          no per-frame work. This is the whole backdrop now. */}
      <DaylightSky />

      {/* Diagonal scrim — keeps the text readable in both themes. */}
      <div
        aria-hidden="true"
        className="hero-scrim pointer-events-none absolute inset-0"
      />
      {/* Bottom fade. Was h-56: a 224px gradient is a quarter of a phone
          screen spent on nothing. */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-b from-transparent via-[var(--hero-bg)]/80 to-[var(--color-base)]"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-10 px-6 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        <div>
          <p className="mb-5 flex items-center gap-2.5 text-xs font-medium text-signal">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal/60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            Available for new projects
          </p>

          {/* Says what we sell, in the words the buyer already uses. The
              forever-shimmering gold sweep across "integrations" is gone — an
              infinite paint animation on the most important text on the site. */}
          <h1 className="display hero-heading max-w-3xl text-balance text-[2.1rem] leading-[1.06] text-ink sm:text-4xl md:text-5xl">
            Websites, software &amp; integrations that work together.
          </h1>

          {/* One sentence. It was four, with `.metallic-text` on top — a
              gradient the Daylight theme already neutralises, so it only ever
              showed in Harbor. Positioning is main's (CRM setup and
              migrations now lead alongside the builds); the em dash went per
              CLAUDE.md. */}
          <p className="mt-5 max-w-[52ch] text-[1.0625rem] leading-relaxed text-muted">
            Custom websites, business tools, CRM setup and integrations, built
            around how your business works.
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <OfferLink
              offer="project"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-signal px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.97]"
            >
              Talk through your project
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </OfferLink>
            <a
              href="#work"
              className="hero-outline inline-flex items-center justify-center gap-2 rounded-full border px-7 py-3.5 text-sm font-medium transition-all active:scale-[0.97]"
            >
              See the work.
            </a>
          </div>

          {/* The hero used to carry two prices. Above the fold that is the
              right opening for someone shopping for a website and the wrong
              one for anyone judging the work, and this page now leads with
              the work. The numbers did not disappear — /services carries
              both ladders in full, one quiet link away. */}
          <p className="mt-6 text-sm text-muted">
            <Link
              href="/services"
              className="text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-signal"
            >
              Services &amp; pricing
            </Link>
          </p>
        </div>

        {/* The live conditions panel and the sentence that justifies it.
            Below lg this sits under the CTAs; below sm it is a one-line
            strip until the visitor opens it. */}
        <HeroLivePanel />
      </div>
    </section>
  );
}
