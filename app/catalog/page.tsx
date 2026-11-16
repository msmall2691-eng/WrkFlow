import type { Metadata } from "next";
import { Suspense } from "react";
import { pageMeta } from "@/lib/seo";
import PanelHeader from "@/components/panel/PanelHeader";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";
import CatalogBrowser from "@/components/CatalogBrowser";
import LiveStrip from "@/components/LiveStrip";
import WhatConnects from "@/components/home/WhatConnects";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import { catalog, categories } from "@/lib/catalog";

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

export default function CatalogPage() {
  const count = catalog.filter((i) => i.status !== "workbench").length;

  return (
    <div className="cp">
      <PanelHeader current="/catalog" />

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
            <div className="mt-3">
              <LiveStrip id="live" />
            </div>
          </div>
        </section>

        <section className="pb-16">
          <div className="mx-auto max-w-6xl px-6">
            <Suspense fallback={<StaticList />}>
              <CatalogBrowser />
            </Suspense>
          </div>
        </section>

        {/* Moved here from the homepage and /services when those were
            consolidated (Nov 15 2026): the integrations evidence belongs
            beside the integrations shelf, and pricing and the FAQ beside
            the things they price. */}
        <WhatConnects />
        <Pricing />

        {/* The form, so "Ask about this", the pricing CTAs and "Don't see
            it?" all land on this page rather than bouncing to the homepage. */}
        <Contact />
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
