import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { pageMeta } from "@/lib/seo";
import StageTopBar from "@/components/stage/StageTopBar";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";
import CatalogBrowser from "@/components/CatalogBrowser";
import StackedHeading from "@/components/StackedHeading";
import { catalog, catalogPage, categories, liveDemoIds, readyCount } from "@/lib/catalog";
import { siteNav } from "@/lib/content";

/*
  /catalog — everything in one place, browsed by what you need. Data and
  the honesty rules live in lib/catalog.ts.

  Nov 26 2026: converted to the approved homepage's clothes with
  `.cp-inner` — its bar, its two faces, its one accent.

  ───────────────────────────────────────────────────────────────────────
  **Nov 28 2026: three bands, where there were eleven sections.**

  Meg retired /marketplace because she preferred this page, so everything
  a visitor can buy or use now arrives here, and that made scannability
  the whole job. Measured first, because this repo's rule is to measure
  and then look: 7.6 screens at 1440×900, eleven sections, ten h2s, 34
  full-size screenshots, 70 links, one section 5,507px tall — and **19.1
  screens at 390px**, which is the width she judges on. Her own words
  about this area were "its so confusting".

  Nothing was cut. The page is re-ordered around the question somebody
  arrives with:

    1. **Where am I and what can I open.** The title, one line, and the
       six things that work this second. The strip was six large tiles
       and is now a compact row, because its job is "you can touch
       something here", not "look at this screenshot".
    2. **What do you need.** Seven doors with their own blurbs and their
       counted sizes. This is the map, and it is also the only filter:
       the eight tabs that used to sit lower down said the same seven
       words a second time, 700px away, which is most of what read as a
       maze. See `components/CatalogBrowser.tsx` for the two densities
       behind the doors.
    3. **Don't see it.** Unchanged, and still the one strong action.

  **Nov 28 2026, later the same day: no prices, and the grouping is the
  point.** Meg's words: "leave pricing off for now till we figure out the
  set up of the site", and then "organise the products" and "plan how they
  will easily obtain products or sites or tools". Nothing on this page
  reads `item.price` any more — the data stays, with its one author in
  `marketItems` / `smallProjects`, and this page simply stops being one of
  its readers.

  That changed what a card owes the reader. With a number on it a card was
  a thing to decide about; without one it is a thing to recognise and then
  act on, so what is left is **what it is, who it is for, and one obvious
  way to get it**. `getAction` in lib/catalog.ts holds that last part.

  **The grouping is by what somebody arrived wanting, not by how finished
  it is.** Seven shelves, each with its own blurb and its counted size, in
  one grid above the fold: that is the sweep, and it is the same axis the
  homepage's service router uses, so this page reads as the same site
  rather than a second taxonomy. Sorting by `status` was considered again
  and rejected again for the reason written in lib/catalog.ts: how real a
  thing is is the maker's view of it. Status is still on every row, as a
  quiet label, because honesty about that is non-negotiable; it is just not
  the shape of the shop.

  **Every string here resolves to `lib/catalog.ts`.** The headings and
  the closing pitch used to be typed into this file while everything
  around them was read from data, which is the split that lets a page and
  its source drift. The counts are computed from `catalog`, never
  written: a count is a claim about evidence, which is the first rule in
  CLAUDE.md.
  ───────────────────────────────────────────────────────────────────────
*/

export const metadata: Metadata = pageMeta({
  title: "Catalog · websites, apps, integrations and AI for small businesses",
  description:
    "Websites, booking and quotes, apps and portals, rental host tools, integrations, data migration and AI help. Try live demos, buy something ready-made, or have it built.",
  path: "/catalog",
});

const liveDemos = liveDemoIds
  .map((id) => catalog.find((i) => i.id === id))
  .filter((i): i is NonNullable<typeof i> => Boolean(i));

const liveHref = (i: (typeof liveDemos)[number]) =>
  i.primary ?? i.proof ?? { label: "Open", href: "/catalog" };

export default function CatalogPage() {
  return (
    <div className="cp cp-inner">
      <StageTopBar
        inFlow
        cta="book"
        nav={siteNav}
        here="Catalog"
        bookHref="/?offer=call#contact"
      />

      <main>
        {/* 1 — where you are, and the six you can open now. */}
        <section className="border-b border-[var(--cp-line)] pb-9 pt-8 md:pb-11 md:pt-12">
          <div className="mx-auto max-w-6xl px-6">
            <p className="m-0 text-[13px] font-medium text-[color:var(--cp-faint)]">
              Catalog · {readyCount} things to use, buy or have built
            </p>
            <StackedHeading
              as="h1"
              className="mt-2"
              lead={catalogPage.title.lead}
              trail={catalogPage.title.trail}
            />
            <p className="mt-3 max-w-2xl text-[15.5px] leading-relaxed text-[color:var(--cp-muted)]">
              {catalogPage.intro}
            </p>

            <div className="mt-8 flex flex-wrap items-baseline gap-x-3 gap-y-0.5">
              <h2 className="m-0 text-[13px] font-semibold uppercase tracking-wider text-[color:var(--cp-faint)]">
                {catalogPage.live.heading}
              </h2>
              <p className="m-0 text-[13px] text-[color:var(--cp-muted)]">
                {catalogPage.live.note}
              </p>
            </div>
            {/*
              Six across at every width above a phone, three across on one.
              The tile is deliberately small: at this size the capture reads
              as "a working screen" rather than as something to study, which
              is the whole of what this strip claims.
            */}
            <ul className="m-0 mt-3 grid list-none grid-cols-3 gap-2.5 p-0 sm:grid-cols-6">
              {liveDemos.map((d) => {
                const link = liveHref(d);
                const inner = (
                  <>
                    <span className="relative block aspect-[16/10] w-full overflow-hidden border-b border-[color:var(--cp-hairline)] bg-[color:var(--cp-well)]">
                      {d.image && (
                        <Image
                          src={d.image}
                          alt={`${d.name}, a real screen`}
                          fill
                          sizes="(min-width: 640px) 180px, 33vw"
                          className="object-cover object-top"
                        />
                      )}
                    </span>
                    <span className="block px-2.5 py-2">
                      <span className="block text-[12.5px] font-semibold leading-snug text-[color:var(--cp-ink)]">
                        {d.name}
                      </span>
                      <span className="mt-0.5 block text-[11.5px] font-medium text-[color:var(--cp-violet-ink)]">
                        Open it {link.external ? "↗" : "→"}
                      </span>
                    </span>
                  </>
                );
                const cls = "cp-tile !rounded-xl block h-full overflow-hidden no-underline";
                return (
                  <li key={d.id}>
                    {link.external ? (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={cls}
                      >
                        {inner}
                      </a>
                    ) : (
                      <Link href={link.href} className={cls}>
                        {inner}
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        {/* 2 — the map, and what is behind the door. */}
        <section className="pb-16 pt-9">
          <div className="mx-auto max-w-6xl px-6">
            <Suspense fallback={<StaticList />}>
              <CatalogBrowser />
            </Suspense>
          </div>
        </section>

        {/* 3 — the one strong action. */}
        <section className="border-t border-[var(--cp-line)] py-12">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-6">
            <div>
              <h2 className="m-0 text-xl font-semibold text-[color:var(--cp-ink)]">
                {catalogPage.ask.heading}
              </h2>
              <p className="m-0 mt-1.5 max-w-xl text-[14.5px] leading-relaxed text-[color:var(--cp-muted)]">
                {catalogPage.ask.body}
              </p>
            </div>
            <Link
              href={catalogPage.ask.href}
              className="inline-flex min-h-11 items-center rounded-lg bg-[color:var(--cp-ink)] px-5 text-[14px] font-semibold text-[color:var(--cp-on-ink)] no-underline hover:opacity-90"
            >
              {catalogPage.ask.cta}
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <CommandPalette />
    </div>
  );
}

/* Before the map hydrates: every item by category, as plain text, so the
   page is complete without JavaScript. */
function StaticList() {
  return (
    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((c) => (
        <div key={c.id}>
          <h2 className="m-0 text-lg font-semibold text-[color:var(--cp-ink)]">{c.label}</h2>
          <ul className="m-0 mt-2 list-none p-0 text-[14px] text-[color:var(--cp-muted)]">
            {catalog
              .filter((i) => i.status !== "workbench" && i.categories[0] === c.id)
              .map((i) => (
                <li key={i.id} className="py-0.5">
                  {i.name}
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
