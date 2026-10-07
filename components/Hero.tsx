import ReactiveAurora from "./ReactiveAurora";
import DaylightSky from "./DaylightSky";
import WeatherLayer from "./WeatherLayer";
import Magnetic from "./Magnetic";
import LiveReadout from "./LiveReadout";
import OfferLink from "./OfferLink";
import { hero } from "@/lib/content";

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
      {/* The backdrop, one per theme, each reading the same live feed.
          Harbor gets the aurora swell; Daylight gets the Portland sky —
          which used to be a fixed cream gradient that ignored the weather
          the panel in front of it was busy reporting. */}
      <ReactiveAurora />
      <DaylightSky />

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

      {/* Precipitation and fog. After every background layer — DaylightSky
          paints an opaque gradient and would bury the canvas — but before the
          z-10 content, so it never covers a word or eats a click. */}
      <WeatherLayer />

      <div className="relative z-10 mx-auto grid w-full max-w-6xl items-center gap-12 px-6 pb-20 pt-24 sm:pb-16 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <p className="marker mb-6 flex items-center gap-2.5">
            <span className="relative flex h-2 w-2" aria-hidden="true">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal/60 motion-reduce:hidden" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
            </span>
            Available for new projects
          </p>

          {/* Headline, highlight and sub all live in lib/content.ts, where the
              reasoning for this wording is written down and where the next
              iteration is a one-line edit. */}
          <h1 className="display hero-heading max-w-3xl text-balance text-[2rem] text-ink sm:text-5xl md:text-[3.4rem]">
            {hero.lead}{" "}
            {/* Second sentence on its own line — the highlight is a phrase,
                and a shimmer that starts mid-line and wraps reads as a
                rendering accident rather than emphasis. */}
            <span className="block">
              <span className="shimmer-text">{hero.highlight}</span>
              {hero.tail}
            </span>
          </h1>

          <p className="hero-sub metallic-text mt-6 max-w-xl text-[1rem] font-medium leading-relaxed">
            {hero.sub}
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

          {/* Two prices used to sit here. Pricing came off the site — every
              number now arrives in a written scope — so the line that replaces
              them carries what someone actually needs before they'll write in:
              it costs nothing to find out, and nothing here is rented. */}
          <ul className="mt-7 flex flex-wrap items-center gap-x-2 gap-y-1 text-sm text-muted">
            {hero.reassurance.map((item, i) => (
              <li key={item} className="flex items-center gap-2">
                <span>{item}</span>
                {/* Separator trails its item rather than leading the next one.
                    On a phone this list wraps, and a leading dot put a stray
                    "· " at the start of the second line. */}
                {i < hero.reassurance.length - 1 && (
                  <span className="text-faint" aria-hidden="true">
                    ·
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* The instrument panel — live Portland data. It used to carry a
            caption underneath ("This data drives the page you're looking
            at") saying what the panel's own footer line already says; one
            of the two had to go. */}
        <div className="mt-2 w-full max-w-md lg:ml-auto lg:mt-0">
          <div className="lg:shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)]">
            <LiveReadout />
          </div>
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
