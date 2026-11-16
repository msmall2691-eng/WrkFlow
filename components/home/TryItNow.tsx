import Link from "next/link";
import { demos, forRentals, marketItems } from "@/lib/content";
import { catalog } from "@/lib/catalog";

/*
  TryItNow — the finished things a visitor can open or buy today, on the
  homepage, where until now none of them appeared.

  **This section exists because an audit measured what a visitor can
  actually reach, and the answer was embarrassing.** Three working demo
  apps, a finished free tool and the only product on the site with a price
  on it, between them:

    · /demo/shop, /demo/studio, /demo/directory — one hop behind /demo, and
      never mentioned on the homepage at all
    · /turnover — not in the header, not on the homepage, not in the footer,
      not in the command palette, and not even in the sitemap. A working
      free tool reachable only by typing its URL.
    · /welcome-book — $99, a live example, a reserve form — invisible from
      the header, the homepage, the footer and the palette. Two inbound
      links in the entire site.

  Meg's words: "those demos we made should be something people see right
  away", and "the airbnb digital welcome book is hidden".

  **Placed after the real work, not before it.** The businesses in the three
  demos are invented, and every demo page says so in its own first line. The
  homepage's whole argument rests on the difference between work that real
  businesses run and work that is illustrative, so the real case study and
  the real projects come first and this follows as "and here is what you can
  touch". Putting invented storefronts above the one confirmed outcome on
  the site would trade the argument for the novelty.

  The kind label on each demo is doing the categorising Meg asked for: a
  visitor looking for a shop, a booking system or a directory sees which is
  which before clicking.
*/

/** The two products that are finished, priced and buyable without a call. */
const BUYABLE = forRentals.market;

export default function TryItNow() {
  const products = BUYABLE.map((id) => marketItems.find((m) => m.id === id)).filter(
    (m): m is NonNullable<typeof m> => Boolean(m),
  );
  const readyCount = catalog.filter((i) => i.status !== "workbench").length;

  return (
    <section
      aria-labelledby="try-heading"
      className="border-t border-[color:var(--cp-line)] py-16 md:py-20"
    >
      <div className="mx-auto max-w-6xl px-6">
        <h2
          id="try-heading"
          className="m-0 text-[1.75rem] font-semibold tracking-tight text-[color:var(--cp-ink)] sm:text-4xl"
        >
          Click something.
        </h2>
        <p className="mt-3 max-w-2xl text-[1.0625rem] leading-relaxed text-[color:var(--cp-muted)]">
          Three working apps, a free planner and a product you can have this
          week. The businesses in the demos are invented. Everything they do is
          real.
        </p>

        <ul className="m-0 mt-10 grid list-none gap-5 p-0 md:grid-cols-3">
          {demos.map((d) => (
            <li key={d.href} className="flex">
              <Link
                href={d.href}
                className="cp-tile group flex min-w-0 flex-1 flex-col overflow-hidden no-underline"
              >
                {/*
                  Each demo's own two colours, so three cards preview three
                  different looks rather than three recolourings of this one.
                  Decorative: the card's meaning is entirely in its text.
                */}
                <span
                  aria-hidden="true"
                  className="block h-16 w-full"
                  style={{
                    background: `linear-gradient(135deg, ${d.swatch[0]} 0%, ${d.swatch[1]} 100%)`,
                  }}
                />
                <span className="flex flex-1 flex-col p-5">
                  <span className="text-[11px] uppercase tracking-wider text-[color:var(--cp-faint)]">
                    {d.kind}
                  </span>
                  <span className="mt-1 text-[15px] font-semibold text-[color:var(--cp-ink)]">
                    {d.name}
                  </span>
                  <span className="mt-2 flex-1 text-[13.5px] leading-relaxed text-[color:var(--cp-muted)]">
                    {d.what}
                  </span>
                  <span className="mt-4 text-[13px] font-semibold text-[color:var(--cp-violet-ink)]">
                    Open it{" "}
                    <span
                      aria-hidden="true"
                      className="inline-block transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none motion-reduce:group-hover:translate-x-0"
                    >
                      →
                    </span>
                  </span>
                </span>
              </Link>
            </li>
          ))}
        </ul>

        {/* The two finished short-term-rental things, which were the most
            hidden items on the whole site. */}
        <ul className="m-0 mt-5 grid list-none gap-5 p-0 md:grid-cols-2">
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
              <Link
                href="/welcome-book"
                className="mt-4 inline-flex w-fit items-center py-1.5 text-[13px] font-semibold text-[color:var(--cp-violet-ink)] no-underline hover:opacity-80"
              >
                See what is in it
              </Link>
            </li>
          ))}
        </ul>

        {/* One door to everything else. The count is computed from the
            catalog itself, never typed, for the reason CLAUDE.md gives: a
            count is a claim about evidence. */}
        <div className="mt-8 flex flex-wrap items-center gap-x-5 gap-y-3">
          <Link
            href="/catalog"
            className="inline-flex min-h-11 items-center rounded-[10px] bg-[color:var(--cp-ink)] px-5 text-[14px] font-semibold text-[color:var(--cp-on-ink)] no-underline hover:opacity-90"
          >
            Browse all {readyCount} things you can use, buy or have built
          </Link>
          <Link
            href="/catalog?c=rentals"
            className="text-[14px] font-semibold text-[color:var(--cp-violet-ink)] no-underline hover:opacity-80"
          >
            Just the rental tools
          </Link>
        </div>
      </div>
    </section>
  );
}
