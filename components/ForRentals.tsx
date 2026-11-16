import Link from "next/link";
import { forRentals, marketItems } from "@/lib/content";

/*
  ForRentals — the short-term-rental corner, sorted by who you are rather
  than by what is broken.

  Meg names this first when asked what she wants to sell, and it is the only
  part of the business with two finished things a host can have today without
  talking to anybody: the welcome book, and the free turnover planner. Making
  them read four service categories to find the two aimed at them is the
  thing this band exists to stop.

  It is an audience band and not a fifth service, for the reason written
  above `forRentals` in lib/content.ts: both items already sit on the ladder
  above, so this is the same stock sorted a second way, on purpose, labelled
  as such. The welcome book's price is resolved from `marketItems` rather
  than retyped, like everything else on this page.
*/

/** Where each product's own page is, when it has one worth sending people to. */
const PAGES: Record<string, string> = {
  "welcome-book": "/welcome-book",
};

export default function ForRentals() {
  const products = forRentals.market
    .map((id) => marketItems.find((m) => m.id === id))
    .filter((m): m is NonNullable<typeof m> => Boolean(m));

  /* Nothing resolved and no free extra: render nothing rather than a heading
     over an empty row. */
  if (products.length === 0 && !forRentals.extra) return null;

  return (
    <section
      aria-labelledby="rentals-heading"
      className="border-t border-[color:var(--cp-line)] py-16 md:py-20"
    >
      <div className="mx-auto max-w-6xl px-6">
        <h2
          id="rentals-heading"
          className="m-0 text-[1.75rem] font-semibold tracking-tight text-[color:var(--cp-ink)] sm:text-4xl"
        >
          {forRentals.heading}
        </h2>
        <p className="mt-3 max-w-xl text-[1rem] leading-relaxed text-[color:var(--cp-muted)]">
          {forRentals.body}
        </p>

        <ul className="m-0 mt-10 grid list-none gap-5 p-0 md:grid-cols-2">
          {products.map((p) => (
            <li key={p.id} className="cp-tile flex min-w-0 flex-col p-5">
              <span className="font-display text-xl font-semibold text-[color:var(--cp-ink)]">
                {p.price}
              </span>
              <h3 className="m-0 mt-2 text-[15px] font-semibold text-[color:var(--cp-ink)]">
                {p.name}
              </h3>
              <p className="m-0 mt-2 flex-1 text-[13.5px] leading-relaxed text-[color:var(--cp-muted)]">
                {p.tagline}
              </p>
              <span className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1">
                <Link
                  href={PAGES[p.id] ?? "/marketplace"}
                  className="inline-flex items-center py-1.5 text-[13px] font-semibold text-[color:var(--cp-violet-ink)] no-underline hover:opacity-80"
                >
                  See what is in it
                </Link>
                {/* The live example, when the product has one. Meg's own
                    rental, so it is a real thing somebody can open. */}
                {p.liveUrl ? (
                  <a
                    href={p.liveUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center py-1.5 text-[13px] font-medium text-[color:var(--cp-muted)] no-underline hover:text-[color:var(--cp-ink)]"
                  >
                    Open a real one <span aria-hidden="true">&nbsp;↗</span>
                  </a>
                ) : null}
              </span>
            </li>
          ))}

          {forRentals.extra ? (
            <li className="cp-tile flex min-w-0 flex-col p-5">
              <span className="font-display text-xl font-semibold text-[color:var(--cp-ink)]">
                {forRentals.extra.price}
              </span>
              <h3 className="m-0 mt-2 text-[15px] font-semibold text-[color:var(--cp-ink)]">
                {forRentals.extra.title}
              </h3>
              <p className="m-0 mt-2 flex-1 text-[13.5px] leading-relaxed text-[color:var(--cp-muted)]">
                {forRentals.extra.body}
              </p>
              <Link
                href={forRentals.extra.href}
                className="mt-4 inline-flex w-fit items-center py-1.5 text-[13px] font-semibold text-[color:var(--cp-violet-ink)] no-underline hover:opacity-80"
              >
                Use it now
              </Link>
            </li>
          ) : null}
        </ul>
      </div>
    </section>
  );
}
