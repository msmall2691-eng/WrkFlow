import Aurora from "./Aurora";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[100svh] items-center overflow-hidden bg-[#08131d]"
    >
      {/* Unified chromatic aurora — calm sunset-over-the-harbor backdrop */}
      <Aurora />

      {/* Soft radial lift behind the headline so the copy sits forward */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(65%_75%_at_28%_45%,rgba(4,6,12,0.78)_0%,rgba(4,6,12,0.25)_55%,transparent_78%)]"
      />
      {/* Left scrim for extra headline contrast */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/55 via-black/10 to-transparent"
      />
      {/* Bottom fade — long, soft dissolve of the dark hero into the page below */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-64 bg-gradient-to-b from-transparent via-[#08131d]/80 to-[var(--color-base)]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-6 pt-24">
        <p className="marker mb-6 flex items-center gap-3">
          <span className="inline-block h-px w-8 bg-signal/60" />
          New England · Web · Automation · Systems
        </p>

        <h1 className="display max-w-4xl text-5xl text-white sm:text-6xl md:text-7xl [text-shadow:0_2px_24px_rgba(0,0,0,0.5)]">
          Websites, automations, and systems <br className="hidden sm:block" />
          that make your business{" "}
          <span className="text-[#e6b964]">run better.</span>
        </h1>

        <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/85 [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">
          mLinx Studio designs and builds custom websites, wires up the
          automations and integrations behind them, and tightens the workflows you
          already run—so the whole operation moves faster, with less manual work.
        </p>

        <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center">
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
          <a
            href="#services"
            className="inline-flex items-center justify-center gap-2 rounded-full border border-white/25 px-7 py-3.5 text-sm font-medium text-white transition-colors hover:border-white/60 hover:bg-white/5"
          >
            See what&apos;s possible
          </a>
        </div>

        {/* What we build — small strip that fills the space and says it plainly */}
        <div className="mt-14 max-w-2xl border-t border-white/10 pt-6">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            What we build
          </p>
          <div className="flex flex-wrap gap-x-6 gap-y-2.5">
            {["Websites", "Automations", "Dashboards", "AI & integrations"].map(
              (item) => (
                <span
                  key={item}
                  className="flex items-center gap-2 text-sm text-white/75"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-signal" />
                  {item}
                </span>
              ),
            )}
          </div>
        </div>
      </div>

      {/* Scroll cue — sits in the bottom fade, so it reads dark */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2">
        <span className="font-mono text-[10px] uppercase tracking-[0.3em] text-faint">
          Scroll
        </span>
      </div>
    </section>
  );
}
