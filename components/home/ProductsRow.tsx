import Link from "next/link";
import Image from "next/image";
import { catalog, kindOf } from "@/lib/catalog";

/*
  ProductsRow — the homepage's middle (Nov 15 2026, late).

  Written with the founderos landing-page-copy method: lead with the
  customer's problem in their words, then the thing that solves it as
  evidence, and let them try it. Each card is one pain, one product, what
  kind of thing it is (Meg wants that explicit), its price, and a working
  demo. Prices, images and links resolve from lib/catalog.ts so they cannot
  drift from the catalog.

  Replaces CategoryDoors, which sent visitors to catalog shelves before
  showing them anything; this shows the products themselves.
*/

const ROWS: { id: string; pain: string; tryHref: string; tryLabel: string }[] = [
  { id: "quote-widget", pain: "Leads want a price before they will call.", tryHref: "/demo/instant-quote", tryLabel: "Try the demo" },
  { id: "brightbase", pain: "Quotes, schedule and invoices live in five different apps.", tryHref: "/demo/brightbase", tryLabel: "Try the demo" },
  { id: "turnover-sync", pain: "A booking changes and your cleaner is the last to know.", tryHref: "/demo/turnover-sync", tryLabel: "Try the demo" },
  { id: "parent-portal", pain: "Parents text all day asking how their child is doing.", tryHref: "/demo/family-portal", tryLabel: "Try the demo" },
  { id: "welcome-book", pain: "Guests keep asking for the WiFi password.", tryHref: "/welcome-book", tryLabel: "See one" },
  { id: "storefront", pain: "People find you online, then can't buy or book from your site.", tryHref: "/demo/shop", tryLabel: "Try the demo" },
];

export default function ProductsRow() {
  const rows = ROWS.map((r) => ({ ...r, item: catalog.find((c) => c.id === r.id)! })).filter((r) => r.item);

  return (
    <section aria-labelledby="products-heading" className="border-t border-[color:var(--cp-line)] py-16 md:py-20">
      <div className="mx-auto max-w-6xl px-6">
        <h2 id="products-heading" className="m-0 text-[1.75rem] font-semibold tracking-tight text-[color:var(--cp-ink)] sm:text-4xl">
          Sound familiar?
        </h2>
        <p className="mt-3 max-w-2xl text-[1.0625rem] leading-relaxed text-[color:var(--cp-muted)]">
          Each of these has a fix you can try right now, with sample data.
        </p>

        <ul className="m-0 mt-8 grid list-none gap-4 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map(({ id, pain, tryHref, tryLabel, item }) => (
            <li key={id} className="cp-tile flex min-w-0 flex-col overflow-hidden !rounded-xl">
              <Link href={tryHref} className="relative block aspect-[16/10] w-full overflow-hidden border-b border-[color:var(--cp-hairline)] bg-[color:var(--cp-well)]" tabIndex={-1} aria-hidden="true">
                {item.image && (
                  <Image unoptimized src={item.image} alt="" fill sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw" className="object-cover object-top" />
                )}
              </Link>
              <div className="flex flex-1 flex-col p-5">
                <p className="m-0 text-[15px] font-semibold leading-snug text-[color:var(--cp-ink)]">{pain}</p>
                <div className="mt-3 flex flex-wrap items-center gap-2">
                  <span className="text-[14px] text-[color:var(--cp-soft)]">{item.name}</span>
                  <span className="rounded-md bg-[color:var(--cp-ink)] px-2 py-0.5 text-[11px] font-semibold text-[color:var(--cp-on-ink)]">
                    {kindOf[item.id] ?? "Service"}
                  </span>
                </div>
                <p className="m-0 mt-1 flex-1 text-[13px] text-[color:var(--cp-faint)]">{item.price}</p>
                <Link
                  href={tryHref}
                  className="mt-4 inline-flex min-h-10 w-fit items-center rounded-lg bg-[color:var(--cp-ink)] px-4 text-[13.5px] font-semibold text-[color:var(--cp-on-ink)] no-underline hover:opacity-90"
                >
                  {tryLabel}
                </Link>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-8 text-[14.5px] text-[color:var(--cp-muted)]">
          Need something else, like data moved or two tools connected?{" "}
          <Link href="/catalog" className="font-semibold text-[color:var(--cp-violet-ink)] no-underline hover:opacity-80">
            See everything and every price
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
