import Link from "next/link";

import { services, work } from "@/lib/content";

/*
  Four doors, one question: what did you come here for?

  **The homepage used to sort by what a thing is, not by who is looking.**
  The panel above offers "Built and running", "Free tools" and the live
  readout — three tiles organised around Meg's side of the relationship. A
  contractor who needs a website and a business owner drowning in manual
  entry both land on the same undifferentiated list and have to work out
  which parts are for them.

  This is the routing layer. It reads `services`, so the four categories
  have exactly one definition and this cannot drift from /services, and it
  counts the work filed under each from `work`, so a category that has
  nothing behind it says nothing rather than claiming a number.

  **The count is proof, not decoration.** "4 projects" under Websites is the
  difference between a menu and a portfolio, and it is read from the real
  list — if Meg adds a fifth site it goes up on its own, and if a category
  empties out the line disappears instead of reading "0 projects".

  **It sits directly under the hero, ahead of the worked example, and the
  order was corrected on Nov 15.** It used to land between two duplicate
  lists of the same four projects, which made it a section inside a
  repetition rather than a fix for one. More importantly, the worked example
  below it is a cleaning company: a contractor or an admin firm who meets
  that first has to work out for themselves whether any of it applies to
  them. Four doors answer that in four words each, and the example then
  shows what the work actually looks like.
*/

/** Plural only when it needs to be; silent when there is nothing to count. */
function proof(count: number): string | null {
  if (count < 1) return null;
  return count === 1 ? "1 project" : `${count} projects`;
}

export default function ServiceRouter() {
  return (
    <section
      aria-labelledby="router-heading"
      className="border-t border-[color:var(--cp-line)] py-16 md:py-20"
    >
      <div className="mx-auto max-w-6xl px-6">
        <h2
          id="router-heading"
          className="m-0 text-[1.75rem] font-semibold tracking-tight text-[color:var(--cp-ink)] sm:text-4xl"
        >
          What are you trying to fix?
        </h2>
        <p className="mt-3 max-w-xl text-[1rem] leading-relaxed text-[color:var(--cp-muted)]">
          Four kinds of work. Pick the one that sounds like your week.
        </p>

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {services.map((s) => {
            const count = proof(work.filter((w) => w.category === s.id).length);
            return (
              <li key={s.id} className="flex">
                <Link
                  href={`/services#${s.id}`}
                  className="cp-tile group flex min-w-0 flex-1 flex-col gap-2 p-5 no-underline"
                >
                  <span className="font-mono text-[11px] tracking-[0.1em] text-[color:var(--cp-faint)]">
                    {s.index}
                  </span>
                  <span className="text-[1.0625rem] font-semibold leading-snug text-[color:var(--cp-ink)]">
                    {s.title}
                  </span>
                  <span className="text-[13.5px] leading-relaxed text-[color:var(--cp-muted)]">
                    {s.tagline}
                  </span>

                  <span className="mt-3 flex flex-wrap gap-1.5">
                    {s.kinds.map((k) => (
                      <span
                        key={k}
                        className="rounded-full border border-[color:var(--cp-line)] px-2.5 py-1 text-[11.5px] text-[color:var(--cp-faint)]"
                      >
                        {k}
                      </span>
                    ))}
                  </span>

                  <span className="mt-auto flex items-center justify-between gap-3 pt-4">
                    {count ? (
                      <span className="text-[12px] text-[color:var(--cp-faint)]">
                        {count}
                      </span>
                    ) : (
                      <span aria-hidden="true" />
                    )}
                    <span className="text-[13px] font-medium text-[color:var(--cp-violet-ink)]">
                      See it
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
