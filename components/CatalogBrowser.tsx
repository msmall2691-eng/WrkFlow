"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { track } from "@vercel/analytics";
import {
  catalog,
  catalogPage,
  categories,
  availability,
  countIn,
  getAction,
  legacyShelf,
  type CatalogCategory,
  type CatalogItem,
  type CatalogLink,
} from "@/lib/catalog";
import { requestOffer } from "@/lib/offer";

/*
  The browsable half of /catalog: the map of doors, and what is behind
  them.

  ───────────────────────────────────────────────────────────────────────
  **Nov 28 2026. Two densities and one control**, which is the whole of
  this change and both halves of it are answers to the same complaint.

  Measured before it, at 1440×900: 7.6 screens, eleven sections, 34 full
  screenshots, one section 5,507px tall — and at 390px, where Meg
  actually looks at this, **19 screens**. Twenty-eight things, each drawn
  at the same size as every other thing, is not a catalog; it is the
  inventory printed out. Her words for this area of the site were "its so
  confusting".

  *One: the default view is a list, not a gallery.* Under "All", each
  category is a short list of rows — a real thumbnail, the name, the
  price, one line of what it does. A visitor sweeps twenty-eight things in
  about three screens instead of nineteen. Pick a category and the same
  items are drawn as cards at full size, because by then the question has
  changed from "what is here" to "show me". Progressive disclosure, with
  the fold between the two put exactly where the visitor's own question
  turns.

  *Two: there is one control, and it is the map.* There used to be a row
  of eight tabs, and the page's hierarchy lived in the sections below
  them. The tabs are now seven tiles with the category's own blurb and its
  counted size, at the top of the page, which is the one place a visitor
  is still asking which door is theirs. A sticky strip takes over once
  you are down among the items, carrying where you are and a way back out
  rather than a second copy of the same eight words: two controls saying
  the same thing is how a page starts reading as a maze.

  **Counts are counted.** `countIn` reads `catalog`; nothing here writes a
  number into a sentence. That is CLAUDE.md's first rule applied to the
  thing on this page most tempting to type by hand, and it is the same
  reason `ServiceRouter`'s project count is computed.
  ───────────────────────────────────────────────────────────────────────

  The URL stays the source of truth (?c=websites), so a tile, the back
  button or a shared link all land on the same view. Legacy ?for= links
  from the homepage and earlier posts map onto a category. The page wraps
  this in <Suspense> with a plain list as the fallback, so no-JS visitors
  and search engines still get every item.

  Visual rules, on Meg's "less colours, more clean": neutral surfaces, ink
  for the one strong action, the single accent for text links and for the
  counted number, which is the same mono-and-accent the homepage gives its
  service index. Every card and every row carries a real screen (see
  lib/catalog.ts); workbench ideas are a text list with no picture.

  **Nov 28 2026, same day, second pass: no prices, and one action.** Meg
  asked for pricing off the site until the shape of it is settled, and for
  this page to be "clean, concise, simple". Nothing on this page reads
  `item.price` any more — see `getAction` in lib/catalog.ts for why that is
  a display decision rather than a deletion, and for why each thing now
  carries one obtain action plus its own proof link instead of three links
  that all looked equally important.

  Nothing here animates. The hover and press states are the ones `.cp-tile`
  and the existing links already carry, so there is no new motion to give a
  `prefers-reduced-motion` fallback to.
*/

const ids = categories.map((c) => c.id);
function isCategory(v: string | null): v is CatalogCategory {
  return !!v && (ids as string[]).includes(v);
}

export default function CatalogBrowser() {
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const raw = params.get("c");
  const legacy = params.get("for");
  const active: CatalogCategory | "all" = isCategory(raw)
    ? raw
    : legacy && legacyShelf[legacy]
      ? legacyShelf[legacy]
      : "all";

  function go(c: CatalogCategory | "all") {
    const next = new URLSearchParams(params.toString());
    next.delete("for");
    next.delete("type");
    if (c === "all") next.delete("c");
    else next.set("c", c);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const ready = catalog.filter((i) => i.status !== "workbench");
  const coming = catalog.filter(
    (i) => i.status === "workbench" && (active === "all" || i.categories.includes(active)),
  );
  const open = active === "all" ? null : categories.find((c) => c.id === active)!;

  return (
    <div>
      {/*
        The map. A nav rather than a section, because seven labelled doors
        with their own sizes on them need no heading above to say what they
        are; the label is the question they answer.
      */}
      <nav aria-label={catalogPage.browse.label} className="scroll-mt-24" id="browse">
        <p className="m-0 text-[13px] font-semibold uppercase tracking-wider text-[color:var(--cp-faint)]">
          {catalogPage.browse.label}
        </p>
        <ul className="m-0 mt-3.5 grid list-none grid-cols-1 gap-2.5 p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {categories.map((c) => {
            const on = active === c.id;
            const n = countIn(c.id);
            return (
              <li key={c.id}>
                <button
                  type="button"
                  aria-pressed={on}
                  onClick={() => go(on ? "all" : c.id)}
                  className={`cp-tile !rounded-xl flex w-full cursor-pointer flex-col items-start px-4 py-3.5 text-left ${
                    on ? "!border-[color:var(--cp-violet-line)]" : ""
                  }`}
                >
                  <span className="flex w-full items-baseline gap-2.5">
                    <span className="min-w-0 flex-1 text-[15px] font-semibold leading-snug text-[color:var(--cp-ink)]">
                      {c.label}
                    </span>
                    <span className="shrink-0 font-mono text-[12px] tracking-wider text-[color:var(--cp-violet-ink)]">
                      {n}
                    </span>
                  </span>
                  <span className="mt-1 text-[12.5px] leading-snug text-[color:var(--cp-muted)]">
                    {c.blurb}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/*
        The sticky strip, and it deliberately does not repeat the map.
        Under "All" there is nothing to say and nothing sticks; once a door
        is open it carries which one, how many are behind it, and the way
        back out.
      */}
      {open && (
        /*
          Opaque, from the scope's own ground token rather than the
          translucent `.cp-sticky-bar`: card captures are light, and at 90%
          over a 16:10 screenshot the bar's own words were competing with
          the picture sliding under them. Looked at, not measured — the
          blur and the alpha both reported working.
        */
        <div className="sticky top-0 z-20 -mx-6 mt-10 flex flex-wrap items-center gap-x-4 gap-y-1 border-b border-[color:var(--cp-line)] bg-[color:var(--ink)] px-6 py-3">
          <p className="m-0 min-w-0 flex-1 text-[14px] font-semibold text-[color:var(--cp-ink)]">
            {open.label}{" "}
            <span className="font-mono text-[12px] font-normal tracking-wider text-[color:var(--cp-faint)]">
              {countIn(open.id)} {catalogPage.browse.unit(countIn(open.id))}
            </span>
          </p>
          <button
            type="button"
            onClick={() => go("all")}
            className="min-h-9 shrink-0 cursor-pointer border-0 bg-transparent p-0 text-[13.5px] font-semibold text-[color:var(--cp-violet-ink)] hover:opacity-80"
          >
            <span aria-hidden="true">←</span> {catalogPage.browse.everything}
          </button>
        </div>
      )}

      {open ? (
        <CardSection
          id={open.id}
          label={open.label}
          blurb={open.blurb}
          items={ready.filter((i) => i.categories.includes(open.id))}
        />
      ) : (
        categories.map((c) => {
          const items = ready.filter((i) => i.categories[0] === c.id);
          if (!items.length) return null;
          return (
            <ListSection
              key={c.id}
              id={c.id}
              label={c.label}
              blurb={c.blurb}
              items={items}
              total={countIn(c.id)}
              onSeeAll={() => go(c.id)}
            />
          );
        })
      )}

      {coming.length > 0 && (
        <section
          aria-labelledby="coming-heading"
          className="mt-14 border-t border-[color:var(--cp-line)] pt-10"
        >
          <h2 id="coming-heading" className="m-0 text-lg font-semibold text-[color:var(--cp-ink)]">
            {catalogPage.coming.heading}
          </h2>
          <p className="mt-1 text-[14px] text-[color:var(--cp-muted)]">{catalogPage.coming.body}</p>
          <ul className="m-0 mt-5 list-none divide-y divide-[color:var(--cp-hairline)] rounded-xl border border-[color:var(--cp-hairline-strong)] p-0">
            {coming.map((i) => (
              <li key={i.id} className="flex flex-wrap items-center gap-x-6 gap-y-2 px-5 py-4">
                <div className="min-w-0 flex-1">
                  <p className="m-0 text-[14.5px] font-semibold text-[color:var(--cp-ink)]">
                    {i.name}
                  </p>
                  <p className="m-0 mt-0.5 text-[13px] text-[color:var(--cp-muted)]">{i.outcome}</p>
                </div>
                <AskLink item={i} label={catalogPage.coming.cta} cls={QUIET} />
              </li>
            ))}
          </ul>
        </section>
      )}
    </div>
  );
}

/* ── the two densities ──────────────────────────────────────────────── */

function SectionHead({
  id,
  label,
  blurb,
  action,
}: {
  id: string;
  label: string;
  blurb: string;
  action?: React.ReactNode;
}) {
  return (
    <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
      <div>
        <h2
          id={`sec-${id}`}
          className="m-0 text-xl font-semibold tracking-tight text-[color:var(--cp-ink)]"
        >
          {label}
        </h2>
        <p className="m-0 mt-1 text-[14px] text-[color:var(--cp-muted)]">{blurb}</p>
      </div>
      {action}
    </div>
  );
}

/* The sweeping view: every item as one dense row. */
function ListSection({
  id,
  label,
  blurb,
  items,
  total,
  onSeeAll,
}: {
  id: string;
  label: string;
  blurb: string;
  items: CatalogItem[];
  total: number;
  onSeeAll: () => void;
}) {
  return (
    <section aria-labelledby={`sec-${id}`} className="mt-11 scroll-mt-20">
      <SectionHead
        id={id}
        label={label}
        blurb={blurb}
        /*
          Only where there is more behind the door. A shelf whose every
          item is already on screen was offering "All 6 in Websites" above
          six rows of exactly those six, which is a link that promises
          something and then does nothing — and seven of them was a good
          part of why this page read as a maze.
        */
        action={
          total > items.length ? (
            <button
              type="button"
              onClick={onSeeAll}
              className="min-h-9 cursor-pointer border-0 bg-transparent p-0 text-[13.5px] font-semibold text-[color:var(--cp-violet-ink)] hover:opacity-80"
            >
              {catalogPage.seeAll(total, label)} <span aria-hidden="true">→</span>
            </button>
          ) : undefined
        }
      />
      <ul className="m-0 mt-4 grid list-none gap-x-8 p-0 lg:grid-cols-2">
        {items.map((item) => (
          <Row key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}

/* The looking view: the same items, drawn at the size of the work. */
function CardSection({
  id,
  label,
  blurb,
  items,
}: {
  id: string;
  label: string;
  blurb: string;
  items: CatalogItem[];
}) {
  return (
    <section aria-labelledby={`sec-${id}`} className="mt-10">
      <SectionHead id={id} label={label} blurb={blurb} />
      <ul className="m-0 mt-5 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}

/* Styles, once: the one action, and the quieter link beside it. */
const ACTION =
  "inline-flex min-h-9 items-center text-[13px] font-semibold text-[color:var(--cp-violet-ink)] no-underline hover:opacity-80";
const ACTION_STRONG =
  "inline-flex min-h-9 items-center rounded-lg bg-[color:var(--cp-ink)] px-3.5 text-[13px] font-semibold text-[color:var(--cp-on-ink)] no-underline hover:opacity-90";
const QUIET =
  "inline-flex min-h-9 items-center text-[13px] font-medium text-[color:var(--cp-soft)] no-underline hover:text-[color:var(--cp-ink)]";

function TextLink({
  link,
  label,
  cls,
}: {
  link: CatalogLink;
  label?: string;
  cls: string;
}) {
  const text = label ?? link.label;
  return link.external ? (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={cls}>
      {text} <span aria-hidden="true">&nbsp;↗</span>
    </a>
  ) : (
    <Link href={link.href} className={cls}>
      {text}
    </Link>
  );
}

function AskLink({ item, label, cls }: { item: CatalogItem; label: string; cls: string }) {
  return (
    <Link
      href={`/?offer=${item.offer}#contact`}
      onClick={() => {
        requestOffer(item.offer, `From the catalog: ${item.name}`);
        try {
          track("catalog_ask", { item: item.id, status: item.status });
        } catch {
          /* analytics is best-effort */
        }
      }}
      className={cls}
    >
      {label}
    </Link>
  );
}

/*
  At most two links per thing, and which is which is decided here rather
  than per renderer, so a row and a card cannot offer different next steps
  for the same item.

  A free thing's own action is opening it. Everything else is obtained by
  asking, so that is the action, and whatever can be looked at — the demo
  on this site, or the one running for somebody else — becomes the quiet
  link beside it.
*/
function Actions({ item, strong }: { item: CatalogItem; strong?: boolean }) {
  const verb = getAction[item.status];
  const free = item.status === "try";
  const action = free ? (item.primary ?? item.proof) : undefined;
  const beside = free ? item.proof : (item.primary ?? item.proof);

  return (
    <>
      {action ? (
        <TextLink link={action} label={verb} cls={strong ? ACTION_STRONG : ACTION} />
      ) : (
        <AskLink item={item} label={verb} cls={strong ? ACTION_STRONG : ACTION} />
      )}
      {beside && beside !== action && <TextLink link={beside} cls={QUIET} />}
    </>
  );
}

/*
  One row. The thumbnail is small and it is still the real capture the
  card uses — the picture earns its place by saying "this is a running
  screen" at a glance, which it does at 96px; what it stops doing is
  costing a third of a phone screen each.

  `chips` and `connects` are deliberately not drawn here. They are the
  detail of one item rather than a reason to choose it, and they are two
  taps away on the card.
*/
function Row({ item }: { item: CatalogItem }) {
  return (
    <li className="flex items-start gap-3.5 border-b border-[color:var(--cp-hairline)] py-3.5">
      {item.image && (
        <span className="relative block aspect-[16/10] w-[88px] shrink-0 overflow-hidden rounded-md border border-[color:var(--cp-hairline)] bg-[color:var(--cp-well)] sm:w-[104px]">
          <Image
            src={item.image}
            alt={`${item.name}, a real screen`}
            fill
            sizes="104px"
            className={item.fit === "contain" ? "object-contain p-1" : "object-cover object-top"}
          />
        </span>
      )}
      <div className="min-w-0 flex-1">
        <p className="m-0 flex flex-wrap items-baseline gap-x-2.5 gap-y-0.5">
          <span className="text-[14.5px] font-semibold leading-snug text-[color:var(--cp-ink)]">
            {item.name}
          </span>
          <span className="text-[12px] text-[color:var(--cp-faint)]">
            {availability[item.status]}
          </span>
        </p>
        <p className="m-0 mt-1 line-clamp-2 text-[13px] leading-snug text-[color:var(--cp-muted)]">
          {item.outcome}
        </p>
        <p className="m-0 mt-1 flex flex-wrap items-center gap-x-4">
          <Actions item={item} />
        </p>
      </div>
    </li>
  );
}

function Card({ item }: { item: CatalogItem }) {
  return (
    <li className="cp-tile flex min-w-0 flex-col overflow-hidden !rounded-xl">
      {item.image && (
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-[color:var(--cp-hairline)] bg-[color:var(--cp-well)]">
          <Image
            src={item.image}
            alt={`${item.name}, a real screen`}
            fill
            sizes="(min-width: 1280px) 280px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className={item.fit === "contain" ? "object-contain p-3" : "object-cover object-top"}
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        <p className="m-0 text-[11.5px] font-medium text-[color:var(--cp-faint)]">
          {availability[item.status]}
        </p>
        <h3 className="m-0 mt-1 text-[15px] font-semibold leading-snug text-[color:var(--cp-ink)]">
          {item.name}
        </h3>
        <p className="m-0 mt-1.5 flex-1 text-[13px] leading-relaxed text-[color:var(--cp-muted)]">
          {item.outcome}
        </p>

        {item.chips && (
          <ul className="m-0 mt-3 flex list-none flex-wrap gap-1.5 p-0">
            {item.chips.map((c) => (
              <li key={c.href}>
                <Link
                  href={c.href}
                  className="inline-flex min-h-7 items-center rounded-md border border-[color:var(--cp-hairline-strong)] px-2 text-[11.5px] text-[color:var(--cp-soft)] no-underline hover:text-[color:var(--cp-ink)]"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {item.connects && (
          <p className="m-0 mt-3 text-[11.5px] text-[color:var(--cp-faint)]">
            Works with {item.connects.join(", ")}
          </p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-x-3.5 gap-y-1 border-t border-[color:var(--cp-hairline)] pt-3">
          <Actions item={item} strong />
        </div>
      </div>
    </li>
  );
}
