import ReactiveAurora from "./ReactiveAurora";
import Magnetic from "./Magnetic";
import HeroWordmark from "./HeroWordmark";
import LiveReadout from "./LiveReadout";
import InstallCard from "./InstallCard";

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

      {/* Brand wordmark — its own column on the right (desktop); lights up at the cursor */}
      <div className="absolute inset-y-0 right-0 hidden w-[50%] overflow-hidden lg:block">
        <HeroWordmark text="M STUDIO" size="text-[8.5vw]" />
      </div>

      {/* Diagonal scrim — keeps the bright swell on the text-free side.
          Uses the hero background color at partial opacity so it works in
          both themes. */}
      <div
        aria-hidden="true"
        className="hero-scrim pointer-events-none absolute inset-0"
      />
      {/* Mobile: a ghost M STUDIO fills the empty lower space (desktop has its own column) */}
      <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-[32%] overflow-hidden opacity-80 lg:hidden">
        <HeroWordmark text="M STUDIO" size="text-[16vw]" />
      </div>
      {/* Bottom fade — long, soft dissolve of the hero into the page below */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent via-[var(--hero-bg)]/80 to-[var(--color-base)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-20 pt-24 sm:pb-0">
        <p className="marker mb-6 flex items-center gap-2.5">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal/60 motion-reduce:hidden" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
          </span>
          Available for new projects
        </p>

        <h1 className="display hero-heading max-w-3xl text-balance text-[2rem] text-ink sm:text-5xl md:text-[3.4rem]">
          Websites and workflows,{" "}
          <span className="shimmer-text">custom-made for your projects.</span>
        </h1>

        <p className="hero-sub metallic-text mt-6 max-w-xl text-base font-medium leading-relaxed">
          Built by someone who ran the business first — then built the software
          it needed.
        </p>


        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Magnetic strength={0.35}>
            <a
              href="#contact"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-signal px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.97]"
            >
              Start a conversation
              <span
                aria-hidden="true"
                className="transition-transform group-hover:translate-x-0.5"
              >
                →
              </span>
            </a>
          </Magnetic>
          <a
            href="#services"
            className="hero-outline inline-flex items-center justify-center gap-2 rounded-full border px-7 py-3.5 text-sm font-medium transition-all active:scale-[0.97]"
          >
            See the work.
          </a>
        </div>

        {/*
          Two capability cards — live data on the left, "we build this for you"
          on the right. Stacked on mobile, side-by-side on md+ so the fold
          stays compact.
        */}
        <div className="mt-10 flex max-w-md flex-col gap-4 md:max-w-3xl md:grid md:grid-cols-2 md:gap-5">
          <LiveReadout />
          <InstallCard />
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
