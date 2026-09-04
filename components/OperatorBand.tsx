import Reveal from "./Reveal";
import { founderNote, provingGround } from "@/lib/content";

/*
  OperatorBand — the homepage's compact replacement for the full founder
  story (which now lives on /about). Per Meg: boxes and actions, not prose.
  One belief card + a 2×2 stat-tile grid, then a row of four action cards
  that each point somewhere concrete. Total copy on screen: ~40 words.
*/

const ACTIONS: { label: string; line: string; href: string }[] = [
  { label: "Start your project", line: "The 10-minute questionnaire.", href: "/intake" },
  { label: "Get an instant quote", line: "Price a job in 60 seconds.", href: "/#tools" },
  { label: "Browse M Linx", line: "Premade sites & tools, ready to run.", href: "/marketplace" },
  { label: "See pricing", line: "Flat and published. No surprises.", href: "/#pricing" },
];

export default function OperatorBand() {
  return (
    <section id="founder" className="relative overflow-hidden border-t border-line bg-[var(--section-alt-bg)] py-16 md:py-20">
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="grid gap-5 lg:grid-cols-[1.2fr_1fr]">
          {/* Belief card — the whole "why", one line of it */}
          <Reveal>
            <div className="flex h-full flex-col justify-between gap-8 rounded-2xl border border-line bg-surface/40 p-7 backdrop-blur-sm">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
                  {founderNote.headline}
                </p>
                <h2 className="display mt-3 text-2xl text-ink sm:text-3xl">
                  {founderNote.headlineFollow}
                </h2>
                <p className="mt-4 max-w-md text-[1rem] leading-relaxed text-muted">
                  {founderNote.paragraphs[0]}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <a
                  href="/#contact"
                  className="inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                >
                  Start a Project →
                </a>
                <a
                  href="/about"
                  className="inline-flex items-center gap-1.5 py-2.5 text-sm font-semibold text-signal transition-colors hover:text-ink"
                >
                  Meet the operator →
                </a>
              </div>
            </div>
          </Reveal>

          {/* Proving-ground tiles — TMCC's history, named as such. The
              attribution line is load-bearing: without it these read as
              M Studio client KPIs, which they are not. */}
          <Reveal delay={80}>
            <div className="flex h-full flex-col gap-3">
              <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-faint">
                {provingGround.label}
              </p>
              <div className="grid flex-1 grid-cols-2 gap-3">
                {provingGround.stats.map((s) => (
                  <div
                    key={s.label}
                    className="flex flex-col justify-center rounded-2xl border border-line bg-surface/40 p-5 backdrop-blur-sm"
                  >
                    <span className="display text-2xl text-ink sm:text-3xl">{s.value}</span>
                    <span className="mt-1 font-mono text-[10px] uppercase tracking-widest text-faint">
                      {s.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </Reveal>
        </div>

        {/* Action row — four doors, each one sentence */}
        <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ACTIONS.map((a, i) => (
            <Reveal key={a.label} delay={120 + i * 60}>
              <a
                href={a.href}
                className="group flex h-full flex-col justify-between gap-5 rounded-2xl border border-line bg-surface/40 p-5 backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:border-signal/40 hover:bg-surface/70"
              >
                <div>
                  <p className="text-[15px] font-semibold text-ink transition-colors group-hover:text-signal">
                    {a.label}
                  </p>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">{a.line}</p>
                </div>
                <span aria-hidden="true" className="text-signal transition-transform group-hover:translate-x-0.5">
                  →
                </span>
              </a>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
