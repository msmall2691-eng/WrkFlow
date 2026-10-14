import DaylightSky from "./DaylightSky";
import ProofReel from "./ProofReel";
import OfferLink from "./OfferLink";
import { appOffer } from "@/lib/content";

/*
  Hero — headline left, real shipped screens right.

  The right column used to hold a live Portland weather panel, and the
  backdrop carried a WebGL aurora plus a precipitation canvas. Clever, but it
  proved we can read a weather API rather than build a business a website —
  and on a phone `min-h-[88vh]` plus that panel meant the first screen was
  entirely decoration and the Work section didn't start until roughly the
  third. So: the proof reel takes the slot, and the live Maine data survives
  as the signature it should always have been — DaylightSky still tints the
  page from the real Portland sky, the fog veil still rolls in from the feed
  (app/layout.tsx `data-fog`), and the readout itself now sits in the footer.

  The viewport lock is `lg:` only. At 390px the hero ends at its natural
  height, so the proof strip below is already peeking above the fold.
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

          {/* A price above the fold (brief A6). Pricing used to sit 73% down a
              21-screen phone page, so someone deciding whether you were even
              in their range had to travel a long way on faith. Two numbers
              now: the custom-build ladder, and the smaller fixed-scope work
              main added alongside it. */}
          <p className="mt-6 text-sm text-muted">
            <a
              href="#pricing"
              className="text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-signal"
            >
              Custom builds from ${appOffer.price.toLocaleString("en-US")}
            </a>
            <span className="mx-2 text-faint" aria-hidden="true">·</span>
            <a
              href="#pricing"
              className="text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-signal"
            >
              Smaller projects from $250
            </a>
          </p>
        </div>

        {/* Real shipped screens, cycling. Below lg this sits under the CTAs,
            so the first phone screen still carries actual work. */}
        <div className="w-full lg:ml-auto">
          <ProofReel />
        </div>
      </div>
    </section>
  );
}
