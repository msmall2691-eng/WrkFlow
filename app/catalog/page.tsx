import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { pageMeta } from "@/lib/seo";
import PanelHeader from "@/components/panel/PanelHeader";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";
import CatalogBrowser from "@/components/CatalogBrowser";
import { catalog, categories, liveDemoIds } from "@/lib/catalog";

/*
  /catalog — everything in one place, browsed by what you need. Data and
  the honesty rules live in lib/catalog.ts.

  Second pass on Meg's notes ("more professional and clean", "less
  colours", "feels scattered"): no aurora behind the page, a smaller
  heading, one row of live demos, then the category tabs and the grid.
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
  const count = catalog.filter((i) => i.status !== "workbench").length;

  return (
    <div className="cp">
      <PanelHeader current="/catalog" bookHref="/?offer=call#contact" />

      <main>
        <section className="border-b border-[var(--cp-line)] pb-10 pt-8 md:pb-12 md:pt-12">
          <div className="mx-auto max-w-6xl px-6">
            <p className="m-0 text-[13px] font-medium text-[color:var(--cp-faint)]">
              Catalog · {count} things to use, buy or have built
            </p>
            <h1 className="display m-0 mt-2 max-w-3xl text-[1.85rem] text-balance text-[color:var(--cp-ink)] sm:text-4xl">
              Websites, apps and tools for small businesses.
            </h1>
            <p className="mt-3 max-w-2xl text-[15.5px] leading-relaxed text-[color:var(--cp-muted)]">
              Try a live demo, buy something ready-made, or have it built around
              how you work. Every picture here is a real screen.
            </p>

            <h2 className="m-0 mt-9 text-[13px] font-semibold uppercase tracking-wider text-[color:var(--cp-faint)]">
              Try it live
            </h2>
            <ul className="m-0 mt-3 grid list-none grid-cols-2 gap-3 p-0 md:grid-cols-3 lg:grid-cols-6">
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
                          sizes="(min-width: 1024px) 180px, (min-width: 768px) 33vw, 50vw"
                          className="object-cover object-top"
                        />
                      )}
                    </span>
                    <span className="block px-3 py-2.5">
                      <span className="block text-[13px] font-semibold leading-snug text-[color:var(--cp-ink)]">
                        {d.name}
                      </span>
                      <span className="mt-0.5 block text-[12px] font-medium text-[color:var(--cp-violet-ink)]">
                        Open it {link.external ? "↗" : "→"}
                      </span>
                    </span>
                  </>
                );
                const cls = "cp-tile !rounded-xl block h-full overflow-hidden no-underline";
                return (
                  <li key={d.id}>
                    {link.external ? (
                      <a href={link.href} target="_blank" rel="noopener noreferrer" className={cls}>
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

        <section className="pb-16">
          <div className="mx-auto max-w-6xl px-6">
            <Suspense fallback={<StaticList />}>
              <CatalogBrowser />
            </Suspense>
          </div>
        </section>

        <section className="border-t border-[var(--cp-line)] py-12">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-6">
            <div>
              <h2 className="m-0 text-xl font-semibold text-[color:var(--cp-ink)]">Don&apos;t see it?</h2>
              <p className="m-0 mt-1.5 max-w-xl text-[14.5px] leading-relaxed text-[color:var(--cp-muted)]">
                Most of this started as one business asking for one thing. Describe
                yours and get a written scope within a day. Scoping is free.
              </p>
            </div>
            <Link
              href="/?offer=custom#contact"
              className="inline-flex min-h-11 items-center rounded-lg bg-[color:var(--cp-ink)] px-5 text-[14px] font-semibold text-[color:var(--cp-on-ink)] no-underline hover:opacity-90"
            >
              Describe what you need
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <CommandPalette />
    </div>
  );
}

/* Before the tabs hydrate: every item by category, as plain text, so the
   page is complete without JavaScript. */
function StaticList() {
  return (
    <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
      {categories.map((c) => (
        <div key={c.id}>
          <h2 className="m-0 text-lg font-semibold text-[color:var(--cp-ink)]">{c.label}</h2>
          <ul className="m-0 mt-2 list-none p-0 text-[14px] text-[color:var(--cp-muted)]">
            {catalog
              .filter((i) => i.status !== "workbench" && i.categories[0] === c.id)
              .map((i) => (
                <li key={i.id} className="py-0.5">
                  {i.name} · {i.price}
                </li>
              ))}
          </ul>
        </div>
      ))}
    </div>
  );
}
