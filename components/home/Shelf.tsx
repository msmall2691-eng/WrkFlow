import Link from "next/link";
import { catalog, statusLabels, type CatalogItem, type CatalogStatus } from "@/lib/catalog";

/*
  Shelf — what can be had today, with the price, on the page everybody sees.

  **The measurement this exists to fix (Meg, Nov 16).** Her words were "hard
  to see what is for sale that's tangible". Measured at phone width with
  every lazy image forced to load, she was being generous: the homepage ran
  20.4 screens, the first price for anything purchasable was on screen 14.6,
  and three product prices existed on the whole page. One of the other two
  was "$1M+", a statistic about her old cleaning company.

  **It is a window onto /catalog, deliberately not a second catalog.** The
  first version of this file built its own shelf out of `ladder`, which was
  a reasonable answer to the question and the wrong answer for this
  codebase: #141 landed a real catalog while it was being written, with its
  own buyer-facing categories, a real screen on every card, and prices
  already sourced from `marketItems` and `smallProjects`. Shipping a second
  one would have recreated the exact failure this repo keeps writing down,
  where the same business is described three ways in three places and a
  visitor has to work out which page to believe. So this reads `catalog`
  and nothing else, and every card is one click from the full entry.

  **It shows what somebody can act on today and says plainly what it is
  leaving out.** `try` and `buy` are the items with a price a visitor can
  decide on without a conversation, which is precisely what the complaint
  was about. `built` is the larger half, and it is a quote rather than a
  price, so it gets an honest line and a link instead of twenty more cards
  on a page that is already long. `workbench` items are excluded outright:
  they are not built, and the first rule in CLAUDE.md is that proof is
  never invented.

  Every count here is computed. A number typed by hand is a claim nobody
  re-checks, which is the same reason the old service doors computed theirs.
*/

/**
 * Does this carry a number somebody can act on without a conversation?
 *
 * **Selected on the price, not on the status, and the difference is a bug
 * this caught.** `status` in the catalog says how real a thing is, not
 * whether it has been priced: the two interactive demos are `try`, because
 * you really can go and use them today, while building one is quoted. Banded
 * by status, the shelf put two cards reading "Quoted to your scope" directly
 * under a heading saying FREE, under an intro promising "a price that is
 * already decided". Three ways of saying something untrue, from one wrong
 * predicate.
 */
function pricedForToday(item: CatalogItem): boolean {
  return /\d/.test(item.price) || /^free$/i.test(item.price.trim());
}

/** The bands, in the order somebody spends money in. */
const SHOWN: CatalogStatus[] = ["try", "buy"];

function destination(i: CatalogItem) {
  return i.primary ?? i.proof ?? { label: "See it in the catalog", href: "/catalog" };
}

function Card({ item }: { item: CatalogItem }) {
  const to = destination(item);

  return (
    <li className="cp-tile flex min-w-0 flex-col p-3">
      <span className="font-display text-[14px] font-semibold leading-tight text-[color:var(--cp-ink)]">
        {item.price}
      </span>
      <h4 className="m-0 mt-1.5 text-[13.5px] font-semibold leading-snug text-[color:var(--cp-ink)]">
        {item.name}
      </h4>
      <p className="m-0 mt-1 flex-1 text-[12.5px] leading-snug text-[color:var(--cp-muted)]">
        {item.outcome}
      </p>
      {/* `py-1.5` makes a 12.5px link a 28px tap target, over the 24px
          minimum the homepage sweep enforces at 390px. */}
      <Link
        href={to.href}
        {...(to.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
        className="mt-2 inline-flex w-fit items-center py-1.5 text-[12.5px] font-semibold text-[color:var(--cp-violet-ink)] no-underline hover:opacity-80"
      >
        {to.label} <span aria-hidden="true">&nbsp;→</span>
      </Link>
    </li>
  );
}

export default function Shelf() {
  const bands = SHOWN.map((status) => ({
    status,
    label: statusLabels[status],
    items: catalog.filter((i) => i.status === status && pricedForToday(i)),
  })).filter((b) => b.items.length > 0);

  if (bands.length === 0) return null;

  const browsable = catalog.filter((i) => i.status !== "workbench").length;
  const quoted = catalog.filter(
    (i) => i.status !== "workbench" && !pricedForToday(i),
  ).length;
  const priced = bands.reduce((n, b) => n + b.items.length, 0);

  return (
    <section
      id="shelf"
      aria-labelledby="shelf-heading"
      className="border-t border-[color:var(--cp-line)] py-12 md:py-16"
    >
      <div className="mx-auto max-w-6xl px-6">
        <h2
          id="shelf-heading"
          className="m-0 text-[1.75rem] font-semibold tracking-tight text-[color:var(--cp-ink)] sm:text-4xl"
        >
          Everything, with prices.
        </h2>
        <p className="mt-3 max-w-xl text-[1rem] leading-relaxed text-[color:var(--cp-muted)]">
          {priced} things with a price already on them. No call first.
        </p>

        <div className="mt-8 grid gap-8">
          {bands.map(({ status, label, items }) => (
            <div key={status} className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-[color:var(--cp-line)] pb-2">
                <h3 className="m-0 text-[13px] font-semibold uppercase tracking-wider text-[color:var(--cp-ink)]">
                  {label.label}
                </h3>
                <p className="m-0 text-[12.5px] leading-snug text-[color:var(--cp-faint)]">
                  {label.note}
                </p>
              </div>
              {/*
                Two columns at phone width, not one. A price list is only
                worth having if it can be scanned, and a column of
                full-width cards is a scroll rather than a shelf.
              */}
              <ul className="m-0 mt-4 grid list-none grid-cols-2 gap-2.5 p-0 lg:grid-cols-4">
                {items.map((i) => (
                  <Card key={i.id} item={i} />
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/*
          The larger half, said plainly rather than padded out into cards.
          These are quoted rather than priced, so listing them here would
          put twenty rows reading "Quoted to your scope" above the one real
          story on the page.
        */}
        <p className="mt-7 text-[14px] leading-relaxed text-[color:var(--cp-muted)]">
          {quoted} more are built and running for real businesses, and are
          adapted and quoted to your scope.{" "}
          <Link
            href="/catalog"
            className="font-semibold text-[color:var(--cp-violet-ink)] no-underline hover:opacity-80"
          >
            Browse all {browsable}, with real screens →
          </Link>
        </p>
      </div>
    </section>
  );
}
