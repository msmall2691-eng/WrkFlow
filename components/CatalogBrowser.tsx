"use client";

import { useMemo } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  catalog,
  audienceLabels,
  formatLabels,
  statusLabels,
  statusOrder,
  sectionHeadings,
  type CatalogAudience,
  type CatalogFormat,
  type CatalogItem,
  type CatalogLink,
} from "@/lib/catalog";
import { requestOffer } from "@/lib/offer";
import { track } from "@vercel/analytics";

/*
  The filterable grid behind /catalog.

  Two filters, because a stranger asks two questions: "is this for me" and
  "what shape is it". Both are mirrored into the URL (?for=rentals&type=ai)
  so Meg can post a link straight to the rental shelf in a host group, and
  so a filtered view survives a refresh or a share.

  The page wraps this in <Suspense> with the unfiltered list as the
  fallback, so search engines and no-JS visitors still get every card.
*/

type AudienceFilter = CatalogAudience | "all";
type FormatFilter = CatalogFormat | "all";

const audiences = Object.keys(audienceLabels) as CatalogAudience[];
const formats = Object.keys(formatLabels) as CatalogFormat[];

const statusTone: Record<CatalogItem["status"], string> = {
  try: "border-[color:var(--cp-violet-line)] bg-[color:var(--cp-violet-wash)] text-[color:var(--cp-violet-ink)]",
  buy: "border-[color:var(--cp-violet-line)] bg-[color:var(--cp-violet-wash)] text-[color:var(--cp-violet-ink)]",
  built: "border-[color:var(--cp-hairline-strong)] bg-[color:var(--cp-fill)] text-[color:var(--cp-ink)]",
  workbench: "border-[color:var(--cp-amber-line)] bg-transparent text-[color:var(--cp-muted)]",
};

function isAudience(v: string | null): v is CatalogAudience {
  return !!v && (audiences as string[]).includes(v);
}
function isFormat(v: string | null): v is CatalogFormat {
  return !!v && (formats as string[]).includes(v);
}

export default function CatalogBrowser() {
  /*
    The URL is the only source of truth for the filters. Reading it once on
    mount (the first version) broke the shelf links above the grid: a <Link>
    to /catalog?for=rentals while already on /catalog changes the query
    without remounting this component, so the URL moved and the cards did
    not. Deriving from useSearchParams means any navigation, a shelf link,
    the back button or a pasted URL, re-filters, and a parameter that is
    absent reads as "all".
  */
  const params = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();
  const f = params.get("for");
  const t = params.get("type");
  const aud: AudienceFilter = isAudience(f) ? f : "all";
  const fmt: FormatFilter = isFormat(t) ? t : "all";

  function update(nextAud: AudienceFilter, nextFmt: FormatFilter) {
    const next = new URLSearchParams(params.toString());
    if (nextAud === "all") next.delete("for");
    else next.set("for", nextAud);
    if (nextFmt === "all") next.delete("type");
    else next.set("type", nextFmt);
    const qs = next.toString();
    router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
  }

  const shown = useMemo(
    () =>
      catalog
        .filter((i) => aud === "all" || i.audience.includes(aud))
        .filter((i) => fmt === "all" || i.format === fmt),
    [aud, fmt],
  );

  const ready = shown.filter((i) => i.status !== "workbench");
  const bench = shown.filter((i) => i.status === "workbench");

  return (
    <div>
      <div className="flex flex-col gap-4">
        <FilterRow
          label="Who it's for"
          value={aud}
          options={[["all", "Everyone"], ...audiences.map((a) => [a, audienceLabels[a]] as [string, string])]}
          onChange={(v) => update(v as AudienceFilter, fmt)}
        />
        <FilterRow
          label="What it is"
          value={fmt}
          options={[["all", "Anything"], ...formats.map((f) => [f, formatLabels[f]] as [string, string])]}
          onChange={(v) => update(aud, v as FormatFilter)}
        />
      </div>

      <p className="mt-6 text-[13.5px] text-[color:var(--cp-muted)]" aria-live="polite">
        {ready.length} {ready.length === 1 ? "thing" : "things"} you can use, buy or have built
        {bench.length ? `, plus ${bench.length} on the workbench` : ""}.
        {shown.length === 0 && (
          <>
            {" "}Nothing matches both filters.{" "}
            <button
              type="button"
              onClick={() => update(aud, "all")}
              className="cursor-pointer border-0 bg-transparent p-0 font-semibold text-[color:var(--cp-violet-ink)] underline"
            >
              Show every type
            </button>
          </>
        )}
      </p>

      {statusOrder.map((st) => {
        const items = shown.filter((i) => i.status === st);
        if (!items.length) return null;
        return (
          <section key={st} aria-labelledby={`sec-${st}`} className="mt-12 first-of-type:mt-8">
            <h2 id={`sec-${st}`} className="m-0 text-xl font-semibold text-[color:var(--cp-ink)]">
              {sectionHeadings[st]}{" "}
              <span className="text-[15px] font-normal text-[color:var(--cp-faint)]">{items.length}</span>
            </h2>
            <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-[color:var(--cp-muted)]">
              {statusLabels[st].note}
              {st === "workbench" && " These are ideas, and nothing here is for sale until it works."}
            </p>
            <ul className="m-0 mt-5 grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {items.map((item) => (
                <Card key={item.id} item={item} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function FilterRow({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: [string, string][];
  onChange: (v: string) => void;
}) {
  return (
    <div role="group" aria-label={label}>
      <span className="mb-2 block text-[11px] uppercase tracking-wider text-[color:var(--cp-faint)]">
        {label}
      </span>
      {/* One scrolling row on a phone instead of four wrapped ones; wraps
          normally from sm up. */}
      <div className="-mx-6 flex gap-2 overflow-x-auto px-6 pb-1 sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
      {options.map(([v, l]) => {
        const on = v === value;
        return (
          <button
            key={v}
            type="button"
            aria-pressed={on}
            onClick={() => onChange(v)}
            className={`min-h-9 shrink-0 cursor-pointer whitespace-nowrap rounded-full border px-3.5 text-[13px] transition-colors duration-150 ${
              on
                ? "border-[color:var(--cp-ink)] bg-[color:var(--cp-ink)] text-[color:var(--cp-on-ink)]"
                : "border-[color:var(--cp-hairline-strong)] bg-[color:var(--cp-fill)] text-[color:var(--cp-soft)] hover:text-[color:var(--cp-ink)]"
            }`}
          >
            {l}
          </button>
        );
      })}
      </div>
    </div>
  );
}

function ActionLink({ link, strong }: { link: CatalogLink; strong?: boolean }) {
  const cls = strong
    ? "inline-flex min-h-10 items-center rounded-[10px] bg-[color:var(--cp-ink)] px-4 text-[13px] font-semibold text-[color:var(--cp-on-ink)] no-underline hover:opacity-90"
    : "inline-flex min-h-10 items-center text-[13px] font-semibold text-[color:var(--cp-violet-ink)] no-underline hover:opacity-80";
  if (link.external) {
    return (
      <a href={link.href} target="_blank" rel="noopener noreferrer" className={cls}>
        {link.label} <span aria-hidden="true">&nbsp;↗</span>
      </a>
    );
  }
  return (
    <Link href={link.href} className={cls}>
      {link.label} <span aria-hidden="true">&nbsp;→</span>
    </Link>
  );
}

function Card({ item }: { item: CatalogItem }) {
  const s = statusLabels[item.status];
  const bench = item.status === "workbench";
  const ask = bench ? "I want this" : "Ask about this";
  const askStrong = !item.primary;

  return (
    <li
      className={`flex min-w-0 flex-col overflow-hidden ${
        bench
          ? "rounded-[14px] border border-dashed border-[color:var(--cp-hairline-strong)]"
          : "cp-tile"
      }`}
    >
      {/*
        No real screen to show (a service, a one-off integration): a plain
        aurora band naming the format, so the row stays even. Deliberately
        a coloured label and nothing that resembles a product screen, per
        the never-invent-proof rule. Workbench cards get neither.
      */}
      {!item.image && !bench && (
        <div
          aria-hidden="true"
          className="relative flex aspect-[16/10] w-full items-end overflow-hidden border-b border-[color:var(--cp-hairline)] p-5"
          style={{
            background:
              "radial-gradient(120% 90% at 0% 0%, color-mix(in srgb, var(--cp-violet) 22%, transparent), transparent 60%), radial-gradient(100% 80% at 100% 100%, color-mix(in srgb, var(--cp-teal) 18%, transparent), transparent 60%), var(--cp-well)",
          }}
        >
          <span className="font-display text-[1.6rem] font-semibold leading-tight text-[color:var(--cp-ink)] opacity-80">
            {formatLabels[item.format]}
          </span>
        </div>
      )}

      {item.image && (
        <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-[color:var(--cp-hairline)] bg-[color:var(--cp-well)]">
          <Image
            src={item.image}
            alt={`${item.name}: a real screen`}
            fill
            sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
            className="object-cover object-top"
          />
        </div>
      )}

      <div className="flex flex-1 flex-col p-5">
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full border px-2.5 py-0.5 text-[11px] font-semibold uppercase tracking-wider ${statusTone[item.status]}`}
            title={s.note}
          >
            {s.label}
          </span>
          <span className="text-[11px] uppercase tracking-wider text-[color:var(--cp-faint)]">
            {formatLabels[item.format]}
          </span>
        </div>

        <div className="mt-3 flex items-baseline justify-between gap-3">
          <h3 className="m-0 text-[16px] font-semibold text-[color:var(--cp-ink)]">{item.name}</h3>
          <span className="shrink-0 text-right text-[13px] font-semibold text-[color:var(--cp-ink)]">
            {item.price}
          </span>
        </div>
        <p className="m-0 mt-2 flex-1 text-[13.5px] leading-relaxed text-[color:var(--cp-muted)]">
          {item.outcome}
        </p>

        {item.chips && (
          <ul className="m-0 mt-3 flex list-none flex-wrap gap-1.5 p-0">
            {item.chips.map((c) => (
              <li key={c.href}>
                <Link
                  href={c.href}
                  className="inline-flex min-h-8 items-center rounded-full border border-[color:var(--cp-hairline-strong)] bg-[color:var(--cp-fill)] px-2.5 text-[12px] text-[color:var(--cp-soft)] no-underline hover:text-[color:var(--cp-ink)]"
                >
                  {c.label}
                </Link>
              </li>
            ))}
          </ul>
        )}

        {item.connects && item.connects.length > 0 && (
          <p className="m-0 mt-3 text-[12px] text-[color:var(--cp-faint)]">
            Connects with {item.connects.join(", ")}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-1">
          {item.primary && <ActionLink link={item.primary} strong />}
          {item.proof && <ActionLink link={item.proof} />}
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
            className={
              askStrong
                ? "inline-flex min-h-10 items-center rounded-[10px] bg-[color:var(--cp-ink)] px-4 text-[13px] font-semibold text-[color:var(--cp-on-ink)] no-underline hover:opacity-90"
                : "inline-flex min-h-10 items-center text-[13px] font-semibold text-[color:var(--cp-soft)] no-underline hover:text-[color:var(--cp-ink)]"
            }
          >
            {ask}
          </Link>
        </div>
      </div>
    </li>
  );
}
