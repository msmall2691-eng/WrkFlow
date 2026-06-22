import AuroraSwell from "./AuroraSwell";
import Magnetic from "./Magnetic";
import HeroCapabilities from "./HeroCapabilities";
import HeroWordmark from "./HeroWordmark";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[88vh] items-center overflow-hidden bg-[#08131d]"
    >
      {/* Aurora Swell — calm ocean backdrop (dialed back so the wordmark leads) */}
      <AuroraSwell intensity={0.6} speed={0.7} />

      {/* Brand wordmark — its own column on the right (desktop); lights up at the cursor */}
      <div className="absolute inset-y-0 right-0 hidden w-[50%] overflow-hidden lg:block">
        <HeroWordmark text="M STUDIO" size="text-[8.5vw]" />
      </div>

      {/* Diagonal scrim — keeps the bright swell on the text-free side */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,rgba(6,12,22,0.82)_0%,rgba(6,12,22,0.45)_42%,rgba(6,12,22,0)_78%)]"
      />
      {/* Bottom fade — long, soft dissolve of the dark hero into the page below */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent via-[#08131d]/80 to-[var(--color-base)]"
      />

      <div className="relative z-10 mx-auto w-full max-w-6xl px-6 pb-20 pt-24 sm:pb-0">
        <p className="marker mb-6 flex items-center gap-2.5">
          <span className="relative flex h-2 w-2" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal/60 motion-reduce:hidden" />
            <span className="relative inline-flex h-2 w-2 rounded-full bg-signal" />
          </span>
          Originated in Maine
        </p>

        <h1 className="display max-w-2xl text-balance text-[1.7rem] text-white sm:text-4xl md:text-5xl [text-shadow:0_2px_24px_rgba(0,0,0,0.5)]">
          Custom websites, tools, and plugins, built for{" "}
          <span className="shimmer-text">the way you work.</span>
        </h1>

        <p className="mt-6 max-w-xl text-base leading-relaxed text-white/85 [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">
          Websites, apps, and custom tools for small businesses. New England,
          working anywhere.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <Magnetic strength={0.35}>
            <a
              href="#contact"
              className="group inline-flex items-center justify-center gap-2 rounded-full bg-signal px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
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
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-medium text-white transition-colors hover:border-white/60 hover:bg-white/5"
          >
            See what&apos;s possible
          </a>
        </div>

        {/* What we build — a quiet, interactive capability line (websites lead) */}
        <div className="mt-12 max-w-xl">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-white/40">
            What we build
          </p>
          <HeroCapabilities />
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
