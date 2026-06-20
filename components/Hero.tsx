import AuroraSwell from "./AuroraSwell";
import Magnetic from "./Magnetic";

export default function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-[88vh] items-center overflow-hidden bg-[#08131d]"
    >
      {/* Aurora Swell — undulating wave-band shader; warps + brightens at cursor */}
      <AuroraSwell intensity={1} speed={0.9} />

      {/* Diagonal scrim — keeps the bright swell on the text-free side */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(105deg,rgba(6,12,22,0.86)_0%,rgba(6,12,22,0.55)_40%,rgba(6,12,22,0)_72%)]"
      />
      {/* Bottom fade — long, soft dissolve of the dark hero into the page below */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-56 bg-gradient-to-b from-transparent via-[#08131d]/80 to-[var(--color-base)]"
      />

      <div className="relative mx-auto w-full max-w-6xl px-6 pt-24">
        <p className="marker mb-6 flex items-center gap-3">
          <span className="inline-block h-px w-8 bg-signal/60" />
          Maine-built · linked anywhere
        </p>

        <h1 className="display max-w-4xl text-4xl text-white sm:text-6xl md:text-7xl [text-shadow:0_2px_24px_rgba(0,0,0,0.5)]">
          Websites, automations, and systems <br className="hidden sm:block" />
          that make your business{" "}
          <span className="text-[#e6b964]">run better.</span>
        </h1>

        <p className="mt-8 max-w-xl text-lg leading-relaxed text-white/85 [text-shadow:0_1px_12px_rgba(0,0,0,0.5)]">
          M Studio designs and builds custom websites, links up the automations and
          integrations behind them, and tightens the workflows you already run—so
          everything&apos;s linked and the whole operation moves faster, with
          less manual work.
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

        {/* What we build — websites lead, the rest support */}
        <div className="mt-14 max-w-2xl border-t border-white/10 pt-6">
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.3em] text-white/40">
            What we build
          </p>
          <p className="flex flex-wrap items-baseline gap-x-2.5 gap-y-1 leading-relaxed">
            <span className="text-lg font-semibold text-white">Websites &amp; web apps</span>
            <span className="text-base text-white/65">
              —plus the automations, dashboards, and systems behind them.
            </span>
          </p>
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
