import Link from "next/link";
import Image from "next/image";
import { catalog, kindOf } from "@/lib/catalog";

/*
  ProductShelf: the ready-made things somebody can open right now, in the
  blueprint look. Same six rows, prices and demos as the old ProductsRow
  (each card is one pain, the product that fixes it, and a working demo),
  resolved from lib/catalog.ts so nothing drifts.
*/

const ROWS: { id: string; pain: string; tryHref: string; tryLabel: string }[] = [
  { id: "quote-widget", pain: "Leads want a price before they will call.", tryHref: "/plugins", tryLabel: "Try the plug-in" },
  { id: "brightbase", pain: "Quotes, schedule and invoices live in five different apps.", tryHref: "/demo/brightbase", tryLabel: "Try the demo" },
  { id: "turnover-sync", pain: "A booking changes and your cleaner is the last to know.", tryHref: "/demo/turnover-sync", tryLabel: "Try the demo" },
  { id: "parent-portal", pain: "Parents text all day asking how their child is doing.", tryHref: "/demo/family-portal", tryLabel: "Try the demo" },
  { id: "welcome-book", pain: "Guests keep asking for the WiFi password.", tryHref: "/welcome-book", tryLabel: "See one" },
  { id: "storefront", pain: "People find you online, then can't buy or book from your site.", tryHref: "/demo/shop", tryLabel: "Try the demo" },
];

export default function ProductShelf() {
  const rows = ROWS.map((r) => ({ ...r, item: catalog.find((c) => c.id === r.id)! })).filter((r) => r.item);
  const pad = (v: number) => String(v).padStart(2, "0");

  return (
    <section aria-labelledby="products-heading" className="bp-band relative">
      <div className="mx-auto max-w-[1400px] px-6 py-24 lg:px-10">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <p className="bp-eyebrow"><span className="text-[color:var(--bp-print)]">[ 04 ]</span> Ready to try · sample data</p>
            <h2 id="products-heading" className="bp-h2 mt-4">
              Sound familiar?
              <span className="bp-serif block normal-case text-[color:var(--bp-print)]">There&apos;s a fix you can open now.</span>
            </h2>
          </div>
          <Link href="/catalog" className="bp-btn bp-btn-ghost">
            Everything and every price
          </Link>
        </div>

        <ul className="m-0 mt-12 grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
          {rows.map(({ id, pain, tryHref, tryLabel, item }, i) => (
            <li key={id} className="bp-sheet flex min-w-0 flex-col">
              <Link href={tryHref} tabIndex={-1} aria-hidden="true" className="relative block aspect-[16/10] overflow-hidden border-b border-[color:var(--bp-line2)] bg-[color:var(--bp-ink)]">
                {item.image && (
                  <Image unoptimized src={item.image} alt="" fill sizes="(min-width: 1024px) 420px, (min-width: 640px) 50vw, 100vw" className="bp-sheet-img object-cover object-top" />
                )}
              </Link>
              <div className="flex flex-1 flex-col p-5">
                <p className="m-0 font-mono text-[11px] uppercase tracking-[0.08em] text-[color:var(--bp-mute)]">
                  N° {pad(i + 1)} · <span className="text-[color:var(--bp-hi)]">{kindOf[item.id] ?? "Service"}</span>
                </p>
                <p className="m-0 mt-3 font-display text-[19px] font-semibold leading-snug text-[color:var(--bp-paper)]">{pain}</p>
                <p className="m-0 mt-2 flex-1 text-[14px] text-[color:var(--bp-mute)]">
                  {item.name} · <span className="text-[color:var(--bp-print)]">{item.price}</span>
                </p>
                <Link href={tryHref} className="bp-btn bp-btn-ghost mt-5 w-fit">
                  {tryLabel}
                </Link>
              </div>
            </li>
          ))}
        </ul>

        <p className="mt-10 text-[15px] text-[color:var(--bp-mute)]">
          Rent out a place?{" "}
          <Link href="/turnover" className="bp-link">
            The Turnover Planner is free
          </Link>
          .
        </p>
      </div>
    </section>
  );
}
