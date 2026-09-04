import ReactiveAurora from "./ReactiveAurora";
import Magnetic from "./Magnetic";
import LiveReadout from "./LiveReadout";
import OfferLink from "./OfferLink";
import { appOffer, foundingOffer } from "@/lib/content";

/*
  Hero — headline left, live instrument panel right (survey J-02, per Meg).
  The giant M STUDIO background wordmark used to own the right half of the
  viewport to repeat the name already in the nav; the genuinely unusual
  thing on this site is the live Maine data driving the page, so the
  readout panel takes that slot instead. On mobile the panel stacks under
  the CTAs, same as before.
*/
export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[88vh] items-center overflow-hidden bg-[var(--hero-bg)]"
    >
      {/* Aurora Swell — calm ocean backdrop, tuned to live Portland weather.
          Hidden in daylight mode via CSS; a soft warm gradient replaces it. */}
      <ReactiveAurora />
      <div aria-hidden="true" className="hero-light-bg" />

      {/* Diagonal scrim — keeps the bright swell behind the text readable.
          Uses the hero background color at partial opacity so it works in
          both themes. */}
      <div
        aria-hidden="true"
        className="hero-scrim pointer-events-none absolute inset-0"
      />
      {/* Bottom fade — long, soft dissolve of the hero into the page below */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent via-[var(--hero-bg)]/80 to-[var(--color-base)]"
      />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 px-6 pb-20 pt-24 sm:pb-16 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="marker mb-6 flex items-center gap-2.5">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal/60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            Available for new projects
          </p>

          {/* Says what we sell, in the words the buyer already uses. "Web apps"
              is the one term that has to be here; everything else is plain. */}
          <h1 className="display hero-heading max-w-3xl text-balance text-[2rem] text-ink sm:text-5xl md:text-[3.4rem]">
            We build websites and{" "}
            <span className="shimmer-text">web apps</span> for small businesses.
          </h1>

          <p className="hero-sub metallic-text mt-6 max-w-xl text-[1rem] font-medium leading-relaxed">
            Booking, quoting, scheduling, customer records — and the site in
            front of it. Built by someone who ran a service company for ten
            years first.
          </p>

          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
            <Magnetic strength={0.35}>
              <OfferLink
                offer="project"
                className="group inline-flex items-center justify-center gap-2 rounded-full bg-signal px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.97]"
              >
                Start a Project
                <span
                  aria-hidden="true"
                  className="transition-transform group-hover:translate-x-0.5"
                >
                  →
                </span>
              </OfferLink>
            </Magnetic>
            <a
              href="#work"
              className="hero-outline inline-flex items-center justify-center gap-2 rounded-full border px-7 py-3.5 text-sm font-medium transition-all active:scale-[0.97]"
            >
              See the work.
            </a>
          </div>

          {/* A price above the fold (brief A6). Pricing used to sit 73% down a
              21-screen phone page, so someone deciding whether you were even
              in their range had to travel a long way on faith. The app side
              has no published number yet, so it advertises the free scope
              rather than inventing one. */}
          <p className="mt-7 text-sm text-muted">
            <a href="#pricing" className="text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-signal">
              Websites from ${foundingOffer.price}
            </a>
            <span className="mx-2 text-faint" aria-hidden="true">·</span>
            <a href="#pricing" className="text-ink underline decoration-line underline-offset-4 transition-colors hover:decoration-signal">
              Web apps from ${appOffer.price.toLocaleString("en-US")}
            </a>
          </p>
        </div>

        {/* The instrument panel — live Portland data, promoted from a
            footnote to the hero's visual. This page reacts to the world;
            here's the proof, reading out in real time. */}
        <div className="mt-2 w-full max-w-md lg:ml-auto lg:mt-0">
          <div className="lg:shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)]">
            <LiveReadout />
          </div>
          <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
            This data drives the page you&apos;re looking at.
          </p>
        </div>
      </div>

      {/* Scroll cue — sits in the bottom fade, so it reads dark (desktop only) */}
      <div className="absolute bottom-8 left-1/2 hidden -translate-x-1/2 sm:block">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-faint">
          Scroll
        </span>
      </div>
    </section>
  );
}
