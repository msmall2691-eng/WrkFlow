"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { track } from "@vercel/analytics";
import {
  catalog,
  categories,
  legacyShelf,
  statusLabels,
  kindOf,
  type CatalogCategory,
  type CatalogItem,
  type CatalogLink,
} from "@/lib/catalog";
import { requestOffer } from "@/lib/offer";

/*
  The browsable grid behind /catalog.

  One control: a row of category tabs, the way a store is browsed. The
  first version had two filter rows (audience × format) and read as a
  search form; Meg found it scattered. "All" shows every category as its
  own short section, each card once, under its first category.

  The URL is the source of truth (?c=websites), so a tab, the back button
  or a shared link all land on the same view. Legacy ?for= links from the
  homepage and earlier posts map onto a category. The page wraps this in
  <Suspense> with a plain list as the fallback, so no-JS visitors and
  search engines still get every item.

  Visual rules, on Meg's "less colours, more clean": neutral surfaces, ink
  for the one strong action, violet only for text links. Every card has a
  real screen (see lib/catalog.ts); workbench ideas are a text list.
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

  return (
    <div>
      <nav
        aria-label="Categories"
        className="cp-sticky-bar sticky top-0 z-20 -mx-6 border-b border-[color:var(--cp-line)] px-6 py-3 backdrop-blur"
      >
        <div className="flex gap-1.5 overflow-x-auto pb-0.5 sm:flex-wrap sm:overflow-visible">
          <Tab on={active === "all"} onClick={() => go("all")}>
            All
          </Tab>
          {categories.map((c) => (
            <Tab key={c.id} on={active === c.id} onClick={() => go(c.id)}>
              {c.label}
            </Tab>
          ))}
        </div>
      </nav>

      {active === "all" ? (
        categories.map((c) => {
          const items = ready.filter((i) => i.categories[0] === c.id);
          if (!items.length) return null;
          return (
            <Section
              key={c.id}
              id={c.id}
              label={c.label}
              blurb={c.blurb}
              items={items}
              total={ready.filter((i) => i.categories.includes(c.id)).length}
              onSeeAll={() => go(c.id)}
            />
          );
        })
      ) : (
        (() => {
          const c = categories.find((x) => x.id === active)!;
          return (
            <Section
              id={c.id}
              label={c.label}
              blurb={c.blurb}
              items={ready.filter((i) => i.categories.includes(c.id))}
            />
          );
        })()
      )}

      {/* "Coming next" (workbench ideas) was removed at Meg's ask on
          Nov 15: "I don't like moving things up the list." The ideas stay
          in lib/catalog.ts with status "workbench" and do not render. */}
    </div>
  );
}

function Tab({ on, onClick, children }: { on: boolean; onClick: () => void; children: React.ReactNode }) {
  return (
    <button
      type="button"
      aria-pressed={on}
      onClick={onClick}
      className={`min-h-9 shrink-0 cursor-pointer whitespace-nowrap rounded-lg px-3.5 text-[13.5px] font-medium transition-colors duration-150 ${
        on
          ? "bg-[color:var(--cp-ink)] text-[color:var(--cp-on-ink)]"
          : "text-[color:var(--cp-soft)] hover:bg-[color:var(--cp-fill)] hover:text-[color:var(--cp-ink)]"
      }`}
    >
      {children}
    </button>
  );
}

function Section({
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
  total?: number;
  onSeeAll?: () => void;
}) {
  return (
    <section aria-labelledby={`sec-${id}`} className="mt-10">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-1">
        <div>
          <h2 id={`sec-${id}`} className="m-0 text-xl font-semibold tracking-tight text-[color:var(--cp-ink)]">
            {label}
          </h2>
          <p className="m-0 mt-1 text-[14px] text-[color:var(--cp-muted)]">{blurb}</p>
        </div>
        {onSeeAll && total && total > items.length ? (
          <button
            type="button"
            onClick={onSeeAll}
            className="cursor-pointer border-0 bg-transparent p-0 text-[13.5px] font-semibold text-[color:var(--cp-violet-ink)] hover:opacity-80"
          >
            All {total} in {label}
          </button>
        ) : null}
      </div>
      <ul className="m-0 mt-5 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {items.map((item) => (
          <Card key={item.id} item={item} />
        ))}
      </ul>
    </section>
  );
}

function TextLink({ link, strong }: { link: CatalogLink; strong?: boolean }) {
  const cls = strong
    ? "inline-flex min-h-9 items-center rounded-lg bg-[color:var(--cp-ink)] px-3.5 text-[13px] font-semibold text-[color:var(--cp-on-ink)] no-underline hover:opacity-90"
    : "inline-flex min-h-9 items-center text-[13px] font-semibold text-[color:var(--cp-violet-ink)] no-underline hover:opacity-80";
  return link.external ? (
    <a href={link.href} target="_blank" rel="noopener noreferrer" className={cls}>
      {link.label} <span aria-hidden="true">&nbsp;↗</span>
    </a>
  ) : (
    <Link href={link.href} className={cls}>
      {link.label}
    </Link>
  );
}

function AskLink({ item, label, strong }: { item: CatalogItem; label: string; strong?: boolean }) {
  return (
    <Link
      /* The form is on this page now, so stay here: requestOffer prefills it
         and records ?offer= in the URL, the plain hash does the scroll. */
      href="#contact"
      data-offer={item.offer}
      onClick={() => {
        requestOffer(item.offer, `From the catalog: ${item.name}`);
        try {
          track("catalog_ask", { item: item.id, status: item.status });
        } catch {
          /* analytics is best-effort */
        }
      }}
      className={
        strong
          ? "inline-flex min-h-9 items-center rounded-lg bg-[color:var(--cp-ink)] px-3.5 text-[13px] font-semibold text-[color:var(--cp-on-ink)] no-underline hover:opacity-90"
          : "inline-flex min-h-9 items-center text-[13px] font-medium text-[color:var(--cp-soft)] no-underline hover:text-[color:var(--cp-ink)]"
      }
    >
      {label}
    </Link>
  );
}

function Card({ item }: { item: CatalogItem }) {
  const status = statusLabels[item.status];
  return (
    <li className="cp-tile flex min-w-0 flex-col overflow-hidden !rounded-xl">
      {item.image && (
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-[color:var(--cp-hairline)] bg-[color:var(--cp-well)]">
          <Image
            unoptimized
            src={item.image}
            alt={`${item.name}, a real screen`}
            fill
            sizes="(min-width: 1280px) 280px, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
            className={item.fit === "contain" ? "object-contain p-3" : "object-cover object-top"}
          />
        </div>
      )}
      <div className="flex flex-1 flex-col p-4">
        <p className="m-0 flex flex-wrap items-center gap-2">
          <span className="rounded-md bg-[color:var(--cp-ink)] px-2 py-0.5 text-[11px] font-semibold text-[color:var(--cp-on-ink)]">
            {kindOf[item.id] ?? "Service"}
          </span>
          <span className="text-[11.5px] text-[color:var(--cp-faint)]" title={status.note}>
            {status.label}
          </span>
        </p>
        <h3 className="m-0 mt-1 text-[15px] font-semibold leading-snug text-[color:var(--cp-ink)]">{item.name}</h3>
        <p className="m-0 mt-0.5 text-[13px] text-[color:var(--cp-soft)]">{item.price}</p>
        <p className="m-0 mt-2 flex-1 text-[13px] leading-relaxed text-[color:var(--cp-muted)]">{item.outcome}</p>

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
          <p className="m-0 mt-3 text-[11.5px] text-[color:var(--cp-faint)]">Works with {item.connects.join(", ")}</p>
        )}

        <div className="mt-3 flex flex-wrap items-center gap-x-3.5 gap-y-1 border-t border-[color:var(--cp-hairline)] pt-3">
          {item.primary && <TextLink link={item.primary} strong />}
          {item.proof && <TextLink link={item.proof} />}
          <AskLink item={item} label={item.primary ? "Ask" : "Ask about this"} strong={!item.primary && !item.proof} />
        </div>
      </div>
    </li>
  );
}
