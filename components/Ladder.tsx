import Link from "next/link";
import OfferLink from "./OfferLink";
import {
  ladder,
  ladderRungs,
  marketItems,
  smallProjects,
  type LadderItem,
  type ServiceCategory,
} from "@/lib/content";

/*
  The three rungs under one service: try it free, buy a piece, have it built.

  See the long note above `ladder` in lib/content.ts for why this exists. The
  short version: the site described the same business three different ways on
  three different pages, so somebody comparing "CRM & platform setup,
  $300-$750" with "M Linx Dashboard, quoted to your scope" had no way to tell
  which one they wanted.

  **It renders inside a service row rather than as a section of its own, and
  that is the whole point.** The first cut was a standalone "everything you
  can get" section listing the four categories with their rungs — which put
  the four categories on the page twice, once in Services with the evidence
  and once here with the prices. That is precisely the repetition the
  homepage rebuild was about. One block per category, carrying both.

  A category with nothing on a rung leaves that rung out. `software` has no
  fixed price, and inventing one to square the grid would be inventing a
  price.
*/

type Resolved = {
  title: string;
  price: string;
  body: string;
  href?: string;
  offer?: string;
};

/*
  Resolve an item against the list that owns its price.

  Null when the id matches nothing, and the caller drops it. Deliberate: the
  alternative is a card with a blank price, which reads as a styling bug
  rather than a content one and would sit there for weeks.
  `tests`/`e2e` asserts every id in `ladder` resolves, so a typo or a retired
  product fails the suite instead of quietly thinning this page.
*/
export function resolveRungItem(item: LadderItem): Resolved | null {
  if (item.market) {
    const m = marketItems.find((x) => x.id === item.market);
    if (!m) return null;
    return { title: m.name, price: m.price, body: m.tagline, href: "/marketplace" };
  }

  if (item.project) {
    const p = smallProjects.find((x) => x.offer === item.project);
    if (!p) return null;
    return { title: p.title, price: p.price, body: p.scope, offer: p.offer };
  }

  if (!item.title || !item.price || !item.body) return null;
  return {
    title: item.title,
    price: item.price,
    body: item.body,
    href: item.href,
    offer: item.offer,
  };
}

function Card({ item }: { item: LadderItem }) {
  const r = resolveRungItem(item);
  if (!r) return null;

  return (
    <li className="cp-tile flex min-w-0 flex-col p-4">
      <span className="font-display text-[1.0625rem] font-semibold text-[color:var(--cp-ink)]">
        {r.price}
      </span>
      <h5 className="m-0 mt-1.5 text-[13.5px] font-semibold text-[color:var(--cp-ink)]">
        {r.title}
      </h5>
      <p className="m-0 mt-1.5 flex-1 text-[12.5px] leading-relaxed text-[color:var(--cp-muted)]">
        {r.body}
      </p>
      {/* py-1.5 keeps the tap target over the 24px minimum; a 13px link on
          its own measures 16. */}
      {r.href ? (
        <Link
          href={r.href}
          className="mt-3 inline-flex w-fit items-center py-1.5 text-[12.5px] font-semibold text-[color:var(--cp-violet-ink)] no-underline hover:opacity-80"
        >
          Open it <span aria-hidden="true">&nbsp;→</span>
        </Link>
      ) : r.offer ? (
        <OfferLink
          offer={r.offer as never}
          className="mt-3 inline-flex w-fit items-center py-1.5 text-[12.5px] font-semibold text-[color:var(--cp-violet-ink)]"
        >
          Ask about this <span aria-hidden="true">&nbsp;→</span>
        </OfferLink>
      ) : null}
    </li>
  );
}

export default function ServiceRungs({ service }: { service: ServiceCategory }) {
  const mine = ladder.filter((i) => i.service === service);
  if (mine.length === 0) return null;

  return (
    <div className="mt-8 border-t border-[color:var(--cp-line)] pt-6">
      <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ladderRungs.map((rung) => {
          const items = mine.filter((i) => i.rung === rung.id);
          if (items.length === 0) return null;

          return (
            <div key={rung.id} className="min-w-0">
              <h4 className="m-0 mb-1 text-[12px] font-semibold uppercase tracking-wider text-[color:var(--cp-faint)]">
                {rung.label}
              </h4>
              <p className="m-0 mb-3 text-[12px] leading-snug text-[color:var(--cp-faint)]">
                {rung.note}
              </p>
              <ul className="m-0 grid list-none gap-3 p-0">
                {items.map((i, n) => (
                  <Card key={`${i.market ?? i.project ?? i.title}-${n}`} item={i} />
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
