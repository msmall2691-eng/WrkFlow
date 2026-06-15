import HeroBackground from "./HeroBackground";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden"
    >
      <HeroBackground />

      {/* Depth gradient over the line field */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_70%_60%_at_50%_40%,transparent_0%,var(--color-base)_78%)]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-6 pt-24">
        <p className="marker mb-6 flex items-center gap-3">
          <span className="inline-block h-px w-8 bg-signal/60" />
          Systems &amp; Automation Studio
        </p>

        <h1 className="display max-w-4xl text-5xl text-ink sm:text-6xl md:text-7xl">
          Own the systems <br className="hidden sm:block" />
          your business{" "}
          <span className="text-signal">runs on.</span>
        </h1>

        <p className="mt-8 max-w-xl text-lg leading-relaxed text-muted">
          We build the custom software your business actually runs on—CRMs,
          databases, dashboards, automations, and AI agents—so you own your
          operations instead of renting them from someone else.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
          <a
            href="#contact"
            className="group inline-flex items-center justify-center gap-2 rounded-full bg-signal px-7 py-3.5 text-sm font-semibold text-base transition-transform hover:-translate-y-0.5"
          >
            Start a conversation
            <span
              aria-hidden="true"
              className="transition-transform group-hover:translate-x-0.5"
            >
              →
            </span>
          </a>
          <a
            href="#services"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-7 py-3.5 text-sm font-medium text-ink transition-colors hover:border-signal/50 hover:text-signal"
          >
            See what&apos;s possible
          </a>
        </div>
      </div>

      {/* Scroll cue */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-faint">
          Scroll
        </span>
      </div>
    </section>
  );
}
