import Link from "next/link";
import { demos } from "@/lib/content";

/*
  Three working demos, each one openable.

  **This section used to carry the whole free shelf** — the three demos, the
  turnover planner and the welcome book — because at the time those were
  unreachable from the homepage altogether, and a band that gathered them up
  was the fix. `Shelf` above now lists every one of them with its price, so
  keeping them here as well would be the same thing twice, which is the
  complaint the homepage rebuild started from.

  What is left is the half the shelf genuinely cannot do. The shelf has one
  row for "three working demos", pointing at /demo, because a price list
  with three nearly identical free rows reads as padding. But
  `e2e/smoke.spec.ts` asserts each demo is reachable from the homepage
  itself, and that assertion is not a technicality: those three pages were
  orphaned once already, and one hop behind an index is exactly how it
  happened. So the three links live here, in a strip that costs a fraction
  of a screen.

  **The invented-business line stays, and it is not decoration.** These are
  made-up companies. CLAUDE.md's first rule is that proof is never invented,
  and a grid of three polished sites with no such line is a portfolio
  claiming three clients it does not have. Every demo page repeats it in its
  own first line; this is the one a visitor reads before clicking.
*/
export default function TryItNow() {
  if (demos.length === 0) return null;

  return (
    <section
      aria-labelledby="demos-heading"
      className="border-t border-[color:var(--cp-line)] py-12 md:py-14"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
          <h2
            id="demos-heading"
            className="m-0 text-[1.25rem] font-semibold tracking-tight text-[color:var(--cp-ink)]"
          >
            Or go and click one.
          </h2>
          <p className="m-0 text-[13px] leading-snug text-[color:var(--cp-faint)]">
            Full working sites. The businesses in them are invented.
          </p>
        </div>

        <ul className="m-0 mt-5 grid list-none gap-3 p-0 sm:grid-cols-3">
          {demos.map((d) => (
            <li key={d.href} className="min-w-0">
              {/* The whole tile is the link, so the tap target is the card
                  rather than a 13px line inside it. */}
              <Link
                href={d.href}
                className="cp-tile flex min-w-0 flex-col gap-1 p-4 no-underline transition-transform duration-150 hover:-translate-y-0.5"
              >
                <span className="text-[10px] uppercase tracking-wider text-[color:var(--cp-faint)]">
                  {d.kind}
                </span>
                <span className="text-[13.5px] font-semibold text-[color:var(--cp-ink)]">
                  {d.name}
                </span>
                <span className="text-[12.5px] leading-relaxed text-[color:var(--cp-muted)]">
                  {d.what}
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
