import Link from "next/link";
import OfferLink from "../OfferLink";
import { resolveRungItem } from "../Ladder";
import {
  ladder,
  ladderRungs,
  services,
  type LadderItem,
  type ServiceCategory,
} from "@/lib/content";

/*
  Shelf — the catalog. Everything that can be had, with what it costs,
  high on the homepage instead of three pages deep.

  **The measurement this exists to fix (Meg, Nov 16).** Her words were "hard
  to see what is for sale that's tangible". Measured on the live site at
  phone width, she was being generous:

    · the homepage ran 17.9 screens
    · the first price for anything purchasable was on screen 12
    · there were two prices on the whole page, and one of them, "$1M+", is
      a statistic about her old cleaning company rather than something on
      sale
    · directly under that one priced product sat the sentence "There are
      eight more free tools on this site, and the rest of the products are
      priced and ready", which is a page pointing at a shop instead of
      being one

  Meanwhile /services ran 20.6 screens with its prices at screens 3, 5 and
  10, and /marketplace, which holds most of the actual goods, ran 12.8 and
  is reached by nobody. The stock was real and it was filed where a buyer
  could not see it.

  **Grouped by what it costs, not by what it is.** The four services answer
  "what is broken for me", which is a good question and is not the one being
  asked here. "What can I actually get, and for how much" is answered by the
  rungs, so those are the bands and the service rides along as a tag on each
  item. Both axes stay readable; the one in the heading is the one the
  complaint was about.

  **It renders the whole ladder, so it cannot quietly go stale.** No
  hand-written list, no curated subset: `ladder` is the single source that
  /services already reads, and `resolveRungItem` is the single author of
  what an entry resolves to. Adding a product to the ladder puts it on the
  shelf; retiring one takes it off. The counts in the intro are computed for
  the same reason ServiceRouter computes its project counts, which is that a
  number typed by hand is a claim nobody re-checks.
*/

const SERVICE_LABEL: Record<ServiceCategory, string> = Object.fromEntries(
  services.map((s) => [s.id, s.short]),
) as Record<ServiceCategory, string>;

function Item({ item }: { item: LadderItem }) {
  const r = resolveRungItem(item);
  if (!r) return null;

  return (
    /*
      Deliberately tight. The first cut used the roomier card this site
      uses elsewhere and the shelf came out 5.6 phone screens on its own,
      which traded one complaint for another: the prices were finally near
      the top and the page had grown from 17.9 screens to 22.3. A catalog
      earns its keep by being scannable, so the body is clamped to two
      lines and the tag shares a row with the link rather than taking one
      of its own.
    */
    <li className="cp-tile flex min-w-0 flex-col p-3">
      <span className="font-display text-[14px] font-semibold leading-tight text-[color:var(--cp-ink)]">
        {r.price}
      </span>
      <h4 className="m-0 mt-1.5 text-[13.5px] font-semibold leading-snug text-[color:var(--cp-ink)]">
        {r.title}
      </h4>
      {/* No line clamp. It was tried and it cut mid-word ("a real speed,
            SEO an..."), which reads as a rendering fault rather than as
            brevity, and these lines are the only description a buyer gets
            before clicking. Two columns already bought the density the
            clamp was for. */}
        <p className="m-0 mt-1 flex-1 text-[12.5px] leading-snug text-[color:var(--cp-muted)]">
        {r.body}
      </p>
      <div className="mt-2 flex flex-wrap items-center justify-between gap-x-2">
        <span className="shrink-0 text-[10px] uppercase tracking-wider text-[color:var(--cp-faint)]">
          {SERVICE_LABEL[item.service]}
        </span>
      {/* `py-1.5` on a 12.5px link is a 28px tap target. These are the whole
          point of the section, so they are also the last thing that may be
          allowed under the 24px minimum the homepage sweep enforces. */}
        {r.href ? (
          <Link
            href={r.href}
            className="inline-flex shrink-0 items-center py-1.5 text-[12.5px] font-semibold text-[color:var(--cp-violet-ink)] no-underline hover:opacity-80"
          >
            Open it <span aria-hidden="true">&nbsp;→</span>
          </Link>
        ) : r.offer ? (
          <OfferLink
            offer={r.offer as never}
            className="inline-flex shrink-0 items-center py-1.5 text-[12.5px] font-semibold text-[color:var(--cp-violet-ink)]"
          >
            Start this <span aria-hidden="true">&nbsp;→</span>
          </OfferLink>
        ) : null}
      </div>
    </li>
  );
}

export default function Shelf() {
  const bands = ladderRungs
    .map((rung) => ({ rung, items: ladder.filter((i) => i.rung === rung.id) }))
    .filter((b) => b.items.length > 0);

  if (bands.length === 0) return null;

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
          {/* Counted, never typed. See the header note. */}
          {bands.map((b) => `${b.items.length} ${b.rung.label.toLowerCase()}`).join(", ")}.
          Every one is a real thing, not a brochure page.
        </p>

        <div className="mt-8 grid gap-8">
          {bands.map(({ rung, items }) => (
            <div key={rung.id} className="min-w-0">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1 border-b border-[color:var(--cp-line)] pb-2">
                <h3 className="m-0 text-[13px] font-semibold uppercase tracking-wider text-[color:var(--cp-ink)]">
                  {rung.label}
                </h3>
                <p className="m-0 text-[12.5px] leading-snug text-[color:var(--cp-faint)]">
                  {rung.note}
                </p>
              </div>
              {/*
                Two columns at phone width, not one. A price list is only
                worth having if it can be scanned, and seventeen full-width
                cards is a scroll rather than a shelf: single column it ran
                4.8 phone screens on its own, which is most of what the old
                page spent reaching its first price in the first place.
              */}
              <ul className="m-0 mt-4 grid list-none grid-cols-2 gap-2.5 p-0 lg:grid-cols-3">
                {items.map((i, n) => (
                  <Item key={`${i.market ?? i.project ?? i.title}-${n}`} item={i} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
