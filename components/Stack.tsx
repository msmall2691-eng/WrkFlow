import Reveal from "./Reveal";
import { stackColumns } from "@/lib/content";

/*
  Stack — the section the site never had.

  It sits directly after Work on purpose: you have just seen the systems, so
  the obvious next question is what they are made of and what you would be
  inheriting. Four columns, no logos, no version numbers — a buyer wants to
  know the shape of the thing, and logos age badly.
*/
export default function Stack() {
  return (
    <section id="stack" className="relative overflow-hidden border-t border-line py-20 md:py-24">
      <div className="relative mx-auto max-w-5xl px-6">
        <div className="mb-10 max-w-3xl">
          <Reveal>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
              Stack
            </p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="display text-2xl text-ink sm:text-3xl md:text-4xl">
              What it&apos;s actually built with.
            </h2>
          </Reveal>
          <Reveal delay={120}>
            <p className="mt-5 text-[1rem] leading-relaxed text-muted">
              You&apos;re hiring someone to write code you&apos;ll own. You should know
              what you&apos;re inheriting before you start.
            </p>
          </Reveal>
        </div>

        <div className="grid gap-px overflow-hidden rounded-2xl border border-line bg-line sm:grid-cols-2 lg:grid-cols-4">
          {stackColumns.map((col, i) => (
            <Reveal key={col.heading} delay={i * 60}>
              <div className="h-full bg-surface p-6">
                <h3 className="font-mono text-[10px] font-semibold uppercase tracking-widest text-faint">
                  {col.heading}
                </h3>
                <ul className="mt-4 space-y-2">
                  {col.items.map((item) => (
                    <li key={item} className="text-sm leading-relaxed text-muted">
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
