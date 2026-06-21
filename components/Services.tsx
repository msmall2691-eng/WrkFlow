import Reveal from "./Reveal";

/*
  Services — a tight "what we do" menu. Five short items with line icons;
  detail and proof live in Work below. Custom (M Studio) here; premade (MLinx) a tap away.
*/
type Item = { title: string; line: string; icon: React.ReactNode };

const I = "h-5 w-5 text-signal";

const MENU: Item[] = [
  {
    title: "Websites & web apps",
    line: "Custom marketing sites, client portals, booking & scheduling apps.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={I} aria-hidden="true">
        <rect x="3" y="4" width="18" height="16" rx="2" />
        <path d="M3 9h18" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Custom tools & plugins",
    line: "Purpose-built tools dropped right into how you already work.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={I} aria-hidden="true">
        <rect x="3" y="3" width="8" height="8" rx="1.5" />
        <rect x="13" y="3" width="8" height="8" rx="1.5" />
        <rect x="3" y="13" width="8" height="8" rx="1.5" />
        <rect x="13" y="13" width="8" height="8" rx="1.5" />
      </svg>
    ),
  },
  {
    title: "Workflow automation",
    line: "Connect the systems you use so the data moves itself.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={I} aria-hidden="true">
        <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" strokeLinejoin="round" />
      </svg>
    ),
  },
  {
    title: "Dashboards",
    line: "One live view of the numbers that actually run your day.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={I} aria-hidden="true">
        <path d="M4 20V11M10 20V4M16 20v-6M22 20H2" strokeLinecap="round" />
      </svg>
    ),
  },
  {
    title: "Systems & data",
    line: "CRMs, databases, migrations, and cleanups that hold up.",
    icon: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" className={I} aria-hidden="true">
        <ellipse cx="12" cy="5" rx="8" ry="3" />
        <path d="M4 5v14c0 1.7 3.6 3 8 3s8-1.3 8-3V5" />
        <path d="M4 12c0 1.7 3.6 3 8 3s8-1.3 8-3" />
      </svg>
    ),
  },
];

export default function Services() {
  return (
    <section id="services" className="relative overflow-hidden border-t border-line py-14 md:py-20">
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
            <p className="marker mb-4">// What we do</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="display-serif text-[1.6rem] text-ink sm:text-3xl md:text-4xl">
              Five things we build, connect, and optimize.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-4 text-base leading-relaxed text-muted">
              Custom-built around how you work—or grab a head start from{" "}
              <a href="/marketplace" className="text-signal transition-opacity hover:opacity-80">
                MLinx, our premade line →
              </a>
            </p>
          </Reveal>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MENU.map((m, i) => (
            <Reveal key={m.title} delay={i * 60}>
              <div className="group h-full rounded-xl border border-line bg-surface/60 p-6 transition-colors hover:border-signal/50">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-line bg-base transition-colors group-hover:border-signal/50">
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
      </div>
    </section>
  );
}
