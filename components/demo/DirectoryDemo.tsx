"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  CATEGORIES,
  DAYS,
  GROWERS,
  NO_FILTERS,
  TOWNS,
  activeCount,
  directory,
  filterGrowers,
  loosenable,
  type Category,
  type Day,
  type Filters,
  type Grower,
} from "@/lib/demo-directory";

/*
  The directory screen for /demo/directory.

  Third demo, third look. The shop is warm and boutique, the studio is cool
  and calm, and this one is deliberately a utility: dense, blue, mono
  labels, a count that moves. A directory is a tool somebody uses, not a
  page they admire, and it should look like one.

  All of the narrowing lives in lib/demo-directory.ts. This renders what it
  returns, and renders `loosenable` when nothing matches, which is the part
  of a filtered list that usually gets skipped.
*/

export default function DirectoryDemo() {
  const [f, setF] = useState<Filters>(NO_FILTERS);

  const results = useMemo(() => filterGrowers(GROWERS, f), [f]);
  const ways = useMemo(() => loosenable(GROWERS, f), [f]);
  const active = activeCount(f);

  const toggle = <T,>(list: T[], v: T): T[] =>
    list.includes(v) ? list.filter((x) => x !== v) : [...list, v];

  return (
    <div className="min-h-screen bg-[#f6f7fa] text-[#14161c]">
      {/* First in the DOM. These read like real small farms, so the page says plainly that they are not. */}
      <p className="bg-[#14161c] px-5 py-2.5 text-center text-[13px] leading-snug text-[#c3cbe0]">
        {directory.demoNote}
      </p>

      <header className="border-b border-[#14161c]/10 bg-white px-5 py-5">
        <div className="mx-auto max-w-6xl">
          <p className="font-mono text-[11px] uppercase tracking-[0.18em] text-[#2d4ed8]">Midcoast</p>
          <h1 className="mt-0.5 font-serif text-[1.6rem] leading-none">{directory.name}</h1>
          <p className="mt-1.5 text-[14px] text-[#14161c]/60">{directory.tagline}</p>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 py-6">
        {/* Search */}
        <label className="block">
          <span className="sr-only">Search growers, towns and what they sell</span>
          <input
            value={f.text}
            onChange={(e) => setF({ ...f, text: e.target.value })}
            placeholder="Search oysters, sourdough, Belfast…"
            data-testid="dir-search"
            className="w-full rounded-xl border border-[#14161c]/15 bg-white px-4 py-3 text-[15px] outline-none placeholder:text-[#14161c]/35 focus:border-[#2d4ed8] focus:ring-2 focus:ring-[#2d4ed8]/20"
          />
        </label>

        {/* Facets */}
        <div className="mt-4 space-y-3">
          <Facet label="What">
            {CATEGORIES.map((c) => (
              <Pill
                key={c}
                on={f.categories.includes(c)}
                onClick={() => setF({ ...f, categories: toggle<Category>(f.categories, c) })}
                testid={`cat-${c}`}
              >
                {c}
              </Pill>
            ))}
          </Facet>

          <Facet label="Out on">
            {DAYS.map((d) => (
              <Pill
                key={d}
                on={f.days.includes(d)}
                onClick={() => setF({ ...f, days: toggle<Day>(f.days, d) })}
                testid={`day-${d}`}
              >
                {d}
              </Pill>
            ))}
          </Facet>

          <Facet label="Where">
            {TOWNS.map((t) => (
              <Pill
                key={t}
                on={f.towns.includes(t)}
                onClick={() => setF({ ...f, towns: toggle<string>(f.towns, t) })}
                testid={`town-${t}`}
              >
                {t}
              </Pill>
            ))}
          </Facet>

          <Facet label="Only">
            <Pill on={f.csaOnly} onClick={() => setF({ ...f, csaOnly: !f.csaOnly })} testid="csa-only">
              Subscription box
            </Pill>
          </Facet>
        </div>

        {/* Count */}
        <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#14161c]/10 pt-4">
          <p className="font-mono text-[13px] tabular-nums text-[#14161c]/70" data-testid="dir-count">
            {results.length} of {GROWERS.length} growers
            {active > 0 && <span className="text-[#14161c]/45">{` · ${active} filter${active === 1 ? "" : "s"}`}</span>}
          </p>
          {active > 0 && (
            <button
              onClick={() => setF(NO_FILTERS)}
              data-testid="dir-clear"
              className="rounded-lg border border-[#14161c]/15 bg-white px-3 py-1.5 text-[13px] hover:border-[#2d4ed8] hover:text-[#2d4ed8]"
            >
              Clear all
            </button>
          )}
        </div>

        {/* Results, or a useful empty state */}
        {results.length === 0 ? (
          <div
            data-testid="dir-empty"
            className="mt-5 rounded-xl border border-dashed border-[#14161c]/20 bg-white p-6"
          >
            <p className="text-[15px] font-medium">No growers match all of that.</p>
            {ways.length > 0 ? (
              <>
                <p className="mt-1.5 text-[14px] text-[#14161c]/65">
                  Dropping one of these would find some:
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {ways.map((w) => (
                    <button
                      key={w.key}
                      data-testid={`loosen-${w.key}`}
                      onClick={() =>
                        setF({
                          ...f,
                          ...(w.key === "text" ? { text: "" } : {}),
                          ...(w.key === "categories" ? { categories: [] } : {}),
                          ...(w.key === "days" ? { days: [] } : {}),
                          ...(w.key === "towns" ? { towns: [] } : {}),
                          ...(w.key === "csaOnly" ? { csaOnly: false } : {}),
                        })
                      }
                      className="rounded-lg border border-[#2d4ed8]/40 bg-[#2d4ed8]/5 px-3 py-2 text-[13px] text-[#2d4ed8] hover:bg-[#2d4ed8]/10"
                    >
                      Drop {w.label}
                      <span className="ml-1.5 font-mono tabular-nums opacity-60">+{w.found}</span>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <p className="mt-1.5 text-[14px] text-[#14161c]/65">
                Loosening any single filter still finds nothing, so this one needs a couple of
                changes.
              </p>
            )}
          </div>
        ) : (
          <ul className="mt-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-3" data-testid="dir-results">
            {results.map((g) => (
              <GrowerCard key={g.id} g={g} />
            ))}
          </ul>
        )}
      </main>

      <footer className="border-t border-[#14161c]/10 px-5 py-10 text-center text-[13px] text-[#14161c]/55">
        <p className="mx-auto max-w-2xl">{directory.demoNote}</p>
        <p className="mt-2">
          Built by{" "}
          <Link href="/" className="underline decoration-[#2d4ed8]/40 underline-offset-2 hover:text-[#2d4ed8]">
            M Studio
          </Link>
          .
        </p>
      </footer>
    </div>
  );
}

function Facet({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="w-16 shrink-0 font-mono text-[11px] uppercase tracking-[0.14em] text-[#14161c]/45">
        {label}
      </span>
      {children}
    </div>
  );
}

function Pill({
  on,
  onClick,
  children,
  testid,
}: {
  on: boolean;
  onClick: () => void;
  children: React.ReactNode;
  testid: string;
}) {
  return (
    <button
      onClick={onClick}
      aria-pressed={on}
      data-testid={testid}
      className={`rounded-full border px-3 py-1.5 text-[13px] transition-colors ${
        on
          ? "border-[#2d4ed8] bg-[#2d4ed8] text-white"
          : "border-[#14161c]/15 bg-white hover:border-[#14161c]/35"
      }`}
    >
      {children}
    </button>
  );
}

function GrowerCard({ g }: { g: Grower }) {
  return (
    <li className="flex gap-3 rounded-xl border border-[#14161c]/10 bg-white p-4">
      <PlotMark g={g} />
      <div className="min-w-0">
        <p className="font-medium leading-tight">{g.name}</p>
        <p className="mt-0.5 text-[13px] text-[#14161c]/55">
          {g.town} · {g.days.join(", ")}
          {g.csa && <span className="ml-1.5 text-[#2d4ed8]">· box</span>}
        </p>
        {/* Shown, not just filtered on: a directory that hides the thing you
            narrowed by makes the visitor take the filter on trust. */}
        <p className="mt-1 flex flex-wrap gap-1" data-testid="card-cats">
          {g.categories.map((c) => (
            <span
              key={c}
              data-cat={c}
              className="rounded-full bg-[#2d4ed8]/8 px-2 py-0.5 text-[11px] font-medium text-[#2d4ed8]"
            >
              {c}
            </span>
          ))}
        </p>
        <p className="mt-2 text-[13px] leading-relaxed text-[#14161c]/70">{g.blurb}</p>
        <ul className="mt-2.5 flex flex-wrap gap-1">
          {g.sells.map((s) => (
            <li
              key={s}
              className="rounded border border-[#14161c]/10 bg-[#f6f7fa] px-1.5 py-0.5 text-[11px] text-[#14161c]/60"
            >
              {s}
            </li>
          ))}
        </ul>
      </div>
    </li>
  );
}

/*
  A drawn plot instead of a photograph: rows of crops in the grower's own
  two colours. Same reasoning as the print shop's artwork, one step further
  along. Nothing here pretends to be a picture of a farm.

  `id` scopes nothing because there are no gradient defs, which is why this
  can stay a handful of rects.
*/
function PlotMark({ g }: { g: Grower }) {
  const [dark, light] = g.palette;
  /* Row lengths derived from the id, so a grower's plot always looks the same. */
  const rows = [0, 1, 2, 3].map((i) => 12 + ((g.id.charCodeAt(i % g.id.length) * (i + 3)) % 18));
  return (
    <svg viewBox="0 0 40 40" className="h-11 w-11 shrink-0 rounded-lg" role="img" aria-label="">
      <rect width="40" height="40" rx="8" fill={light} />
      {rows.map((w, i) => (
        <rect key={i} x="6" y={8 + i * 7} width={w} height="3.5" rx="1.75" fill={dark} opacity={0.5 + i * 0.16} />
      ))}
    </svg>
  );
}
