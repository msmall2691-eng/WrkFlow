import Link from "next/link";
import Image from "next/image";
import { categories, categoryCount } from "@/lib/catalog";

/*
  CategoryDoors — the homepage's "what do you need?" (Nov 15 2026).

  Replaces ServiceRouter, whose four text-only doors pointed at /services,
  a page that described the same offers a third way. These six doors point
  at the matching shelf of /catalog, each with a real screen from work that
  shelf contains, so a visitor sees the kind of thing before they click.

  The count under each door is computed from the catalog (categoryCount),
  never typed: a count is a claim about evidence (CLAUDE.md, first rule).
  Free tools are left off: they are a lead-in, linked from the strip above
  and the catalog, not a thing somebody arrives needing.
*/

/* Four doors, the four things buyers ask for most (Meg's call, and the
   buyer review agreed): websites, quotes and booking, rental hosts, and
   integrations/data. Apps, AI and tools live in the catalog. */
const doors = (["websites", "booking", "rentals", "connect"] as const).map(
  (id) => categories.find((c) => c.id === id)!,
);

export default function CategoryDoors() {
  return (
    <section
      aria-labelledby="needs-heading"
      className="border-t border-[color:var(--cp-line)] py-16 md:py-20"
    >
      <div className="mx-auto max-w-6xl px-6">
        <h2
          id="needs-heading"
          className="m-0 text-[1.75rem] font-semibold tracking-tight text-[color:var(--cp-ink)] sm:text-4xl"
        >
          What do you need?
        </h2>
        <p className="mt-3 max-w-2xl text-[1.0625rem] leading-relaxed text-[color:var(--cp-muted)]">
          Prices and real examples for each are in the catalog.
        </p>

        <ul className="m-0 mt-8 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-4">
          {doors.map((c) => {
            const n = categoryCount(c.id);
            return (
              <li key={c.id} className="flex">
                <Link
                  href={`/catalog?c=${c.id}`}
                  className="cp-tile group flex min-w-0 flex-1 flex-col overflow-hidden !rounded-xl no-underline"
                >
                  <span className="relative block aspect-[16/9] w-full overflow-hidden border-b border-[color:var(--cp-hairline)] bg-[color:var(--cp-well)]">
                    <Image
                      unoptimized
                      src={c.image}
                      alt=""
                      fill
                      sizes="(min-width: 1024px) 270px, (min-width: 640px) 50vw, 100vw"
                      className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.02] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                    />
                  </span>
                  <span className="flex flex-1 flex-col p-5">
                    <span className="flex items-baseline justify-between gap-3">
                      <span className="text-[16px] font-semibold text-[color:var(--cp-ink)]">{c.label}</span>
                      <span className="shrink-0 text-[12.5px] text-[color:var(--cp-faint)]">
                        {n} {n === 1 ? "option" : "options"}
                      </span>
                    </span>
                    <span className="mt-1.5 flex-1 text-[13.5px] leading-relaxed text-[color:var(--cp-muted)]">
                      {c.blurb}
                    </span>
                    <span className="mt-4 text-[13px] font-semibold text-[color:var(--cp-violet-ink)]">
                      See {c.label.toLowerCase()} <span aria-hidden="true">→</span>
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
