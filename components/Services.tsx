import Reveal from "./Reveal";

/*
  Services — the three things we build, in plain terms a non-technical
  owner gets at a glance. Custom studio work leads; the premade M Linx line is
  a quiet tap away at the end.
*/
type Item = { title: string; line: string; icon: React.ReactNode };

const I = "h-5 w-5 text-signal";

const AUDIENCES = [
  "Service companies",
  "Trades",
  "Property managers",
  "STR operators",
  "Founders",
  "Organizations",
  "Personal projects",
];

const MENU: Item[] = [
  {
    title: "Websites & web apps",
    line: "More than a marketing site — booking, client portals, member areas, dashboards. Real web apps, not templates (and not bloated native apps). Fast, custom, and yours.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={I} aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Custom tools & dashboards",
    line: "The software behind the scenes — booking apps, CRMs, dashboards, quoting tools — built around how you run.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={I} aria-hidden="true">
        <path d="M4 20V11M10 20V4M16 20v-6M22 20H2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Automation & AI agents",
    line: "Automations and AI agents that handle the busywork — intake, follow-ups, drafting, and triage — with you in control.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={I} aria-hidden="true">
        <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Integrations",
    line: "Make the tools you already use talk to each other, so the data moves itself and nothing gets double-entered.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={I} aria-hidden="true">
        <circle cx="6" cy="6" r="2.5" />
        <circle cx="18" cy="18" r="2.5" />
        <path d="M8 8l8 8" strokeLinecap="round" />
      </svg>
    ),
  },
];

export default function Services() {
  return (
    <section id="services" className="relative overflow-hidden border-t border-line py-20 md:py-24">
      <div
        aria-hidden="true"
        className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-96"
      />
      <div
        aria-hidden="true"
        className="floaty-slow pointer-events-none absolute -right-24 top-28 h-72 w-72 rounded-full bg-signal/[0.05] blur-[130px]"
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-12 max-w-3xl">
          <Reveal>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
              Services
            </p>
          </Reveal>
          <Reveal>
            <h2 className="display-serif text-[1.6rem] text-ink sm:text-3xl md:text-4xl">
              What we can build.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-4 text-base leading-relaxed text-muted">
              If you can picture it, we can build it — shaped around how you
              actually work.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          {MENU.map((m, i) => (
            <Reveal key={m.title} delay={i * 60}>
              <div className="group h-full rounded-2xl border border-line bg-surface/60 p-6 transition-all duration-300 hover:-translate-y-1 hover:border-signal/50 hover:bg-surface/80 hover:shadow-[0_24px_60px_-32px_rgba(22,163,148,0.55)] active:scale-[0.98]">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl border border-line bg-base transition-all duration-300 group-hover:scale-110 group-hover:border-signal/60 group-hover:bg-signal/10 group-hover:shadow-[0_0_24px_-4px_rgba(22,163,148,0.5)]">
                  {m.icon}
                </span>
                <h3 className="display-serif mt-4 text-lg text-ink transition-colors group-hover:text-signal md:text-xl">
                  {m.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{m.line}</p>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Who it's for — compact chip row */}
        <Reveal delay={200}>
          <div className="mt-10 border-t border-line pt-8">
            <p className="font-mono text-[10px] uppercase tracking-widest text-faint">
              Who it&apos;s for
            </p>
            <div className="mt-3 flex flex-wrap gap-2">
              {AUDIENCES.map((a) => (
                <span
                  key={a}
                  className="rounded-full border border-line bg-base px-3 py-1.5 text-sm text-muted"
                >
                  {a}
                </span>
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={240}>
          <p className="mt-8 text-sm text-muted">
            Or start from{" "}
            <a href="/marketplace" className="text-signal transition-opacity hover:opacity-80">
              M Linx, the premade line →
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}
