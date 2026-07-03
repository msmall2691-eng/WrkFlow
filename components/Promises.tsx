import Reveal from "./Reveal";

/*
  Promises — four short "how we work with you" tiles. Signals the studio's
  professionalism through what it DOESN'T do: no lock-in, no scope creep,
  no drip sequences, no dependency by design.
*/
const PROMISES: { title: string; body: string }[] = [
  {
    title: "You own it.",
    body: "Every file, database, hosting key, and login is yours. No lock-in by design.",
  },
  {
    title: "One-day replies.",
    body: "A real answer within 24 hours — never a drip campaign, never a sales sequence.",
  },
  {
    title: "Fixed price, no creep.",
    body: "Scope is quoted upfront. Change orders get their own honest quote — no surprise bills.",
  },
  {
    title: "Built to leave.",
    body: "Even the Care Plan is month-to-month. Walk away with the whole build any time.",
  },
];

export default function Promises() {
  return (
    <section
      id="promises"
      className="relative overflow-hidden border-t border-line bg-[var(--section-alt-bg)] py-16 md:py-20"
    >
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-10 max-w-3xl">
          <Reveal>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
              The promise
            </p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="display text-2xl text-ink sm:text-3xl md:text-4xl">
              How we work with you.
            </h2>
          </Reveal>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {PROMISES.map((p, i) => (
            <Reveal key={p.title} delay={i * 60}>
              <div className="group corner-accents h-full rounded-2xl border border-line bg-surface/40 p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-signal/40 hover:bg-surface/70 hover:shadow-[0_20px_50px_-30px_rgba(22,163,148,0.5)] active:scale-[0.99]">
                <p className="display-serif text-lg text-ink transition-colors group-hover:text-signal md:text-xl">
                  {p.title}
                </p>
                <p className="mt-2 text-sm leading-relaxed text-muted">
                  {p.body}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
