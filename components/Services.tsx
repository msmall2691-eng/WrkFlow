import Reveal from "./Reveal";

/*
  Services — a tight "what we do" menu. Five short items, scannable; the detail
  and proof live in Work below. Custom (M Studio) up here; premade (Linx) one tap away.
*/
const MENU: { title: string; line: string }[] = [
  { title: "Websites & web apps", line: "Custom marketing sites, client portals, booking & scheduling apps." },
  { title: "Custom tools & plugins", line: "Purpose-built tools dropped right into how you already work." },
  { title: "Workflow automation", line: "Connect the systems you use so the data moves itself." },
  { title: "Dashboards", line: "One live view of the numbers that actually run your day." },
  { title: "Systems & data", line: "CRMs, databases, migrations, and cleanups that hold up." },
];

export default function Services() {
  return (
    <section id="services" className="relative border-t border-line py-16 md:py-24">
      <div
        aria-hidden="true"
        className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-96"
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
                Linx, our premade line →
              </a>
            </p>
          </Reveal>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {MENU.map((m, i) => (
            <Reveal key={m.title} delay={i * 60}>
              <div className="group h-full rounded-xl border border-line bg-surface/60 p-6 transition-colors hover:border-signal/50">
                <span className="font-mono text-xs text-faint transition-colors group-hover:text-signal">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="display-serif mt-3 text-lg text-ink transition-colors group-hover:text-signal md:text-xl">
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
