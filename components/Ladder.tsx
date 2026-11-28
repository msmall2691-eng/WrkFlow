import Link from "next/link";
import OfferLink from "./OfferLink";
import {
  ladder,
  ladderRungs,
  marketItems,
  servicesPage,
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

  ───────────────────────────────────────────────────────────────────────────
  Nov 28 2026 — same items, a quarter of the height.

  **A card was the wrong container for one line of information.** Each rung
  item rendered as a bordered tile with its own padding, a price, a title, a
  body and, below the body, a separate "Ask about this →" link: five stacked
  elements and 32px of chrome for a price and a sentence. Multiplied by
  fourteen items across four categories it was the single largest thing on a
  page that measured 10.7 screens.

  Nothing was dropped to shrink it. Every item still shows its price, its
  name and what it is, and still goes where it went. What changed is that
  the whole item is now the link — so the separate call to action is gone,
  the tap target is bigger rather than smaller, and the border a card needed
  to say "this is one thing" is done by the gap between items.

  `line-clamp-2` on the body is the one real trade and it is bounded: the
  longest body in `ladder` is 128 characters and clamps at the column widths
  this renders at, so nothing is cut today. It is there so that a future
  entry three sentences long costs this strip one line rather than ten.

  The per-rung `note` moved to the head of the page. It explains what a rung
  *is*, which is one fact about the page rather than four, and repeating it
  under every category was three sentences of furniture per service.
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
    /* An explicit `href` wins, so a product with its own page sends people
       there rather than to the marketplace index. Most market items have no
       page of their own, and /marketplace is the honest fallback. */
    return { title: m.name, price: m.price, body: m.tagline, href: item.href ?? "/catalog" };
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

/* The three lines every item renders, whichever kind of link wraps it. */
function Body({ r }: { r: Resolved }) {
  return (
    <>
      <span className="font-mono text-[11.5px] uppercase tracking-wider text-[color:var(--cp-violet-ink)]">
        {r.price}
      </span>
      <span className="mt-1 block text-[14px] font-semibold text-[color:var(--cp-ink)]">
        {r.title}
        <span aria-hidden="true" className="text-[color:var(--cp-faint)]">
          &nbsp;→
        </span>
      </span>
      <span className="mt-1 line-clamp-2 block text-[12.5px] leading-snug text-[color:var(--cp-muted)]">
        {r.body}
      </span>
    </>
  );
}

/* `py-1` keeps the whole three-line block comfortably over the 24px tap
   minimum without adding a visible box back. */
const ITEM =
  "group block py-1 no-underline transition-opacity hover:opacity-80 focus-visible:opacity-80";

function Item({ item }: { item: LadderItem }) {
  const r = resolveRungItem(item);
  if (!r) return null;

  if (r.href)
    return (
      <li>
        <Link href={r.href} className={ITEM}>
          <Body r={r} />
        </Link>
      </li>
    );

  if (r.offer)
    return (
      <li>
        <OfferLink offer={r.offer as never} className={ITEM}>
          <Body r={r} />
        </OfferLink>
      </li>
    );

  /* Neither a page nor an offer: still worth showing, just not clickable. */
  return (
    <li className="py-1">
      <Body r={r} />
    </li>
  );
}

export default function ServiceRungs({ service }: { service: ServiceCategory }) {
  const mine = ladder.filter((i) => i.service === service);
  if (mine.length === 0) return null;

  return (
    <div className="mt-8 border-t border-[color:var(--cp-line)] pt-6">
      <h3 className="m-0 text-[11px] font-semibold uppercase tracking-[0.15em] text-[color:var(--cp-faint)]">
        {servicesPage.waysIn}
      </h3>
      <div className="mt-4 grid gap-x-8 gap-y-6 sm:grid-cols-2 lg:grid-cols-3">
        {ladderRungs.map((rung) => {
          const items = mine.filter((i) => i.rung === rung.id);
          if (items.length === 0) return null;

          return (
            <div key={rung.id} className="min-w-0">
              <h4 className="m-0 text-[12px] font-semibold text-[color:var(--cp-soft)]">
                {rung.label}
              </h4>
              <ul className="m-0 mt-2 grid list-none gap-3 p-0">
                {items.map((i, n) => (
                  <Item key={`${i.market ?? i.project ?? i.title}-${n}`} item={i} />
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}
