import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import PanelHeader from "@/components/panel/PanelHeader";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";
import CatalogBrowser from "@/components/CatalogBrowser";
import { audienceLabels, type CatalogAudience } from "@/lib/catalog";

/*
  /catalog — everything in one place, filterable by who you are and what
  shape you want it in. The data and the honesty rules are in lib/catalog.ts.

  Shortcut links under the heading are the shareable shelves: each is a
  ?for= link, so a post in an Airbnb host group can land on the rental
  shelf directly.
*/

export const metadata: Metadata = pageMeta({
  title: "Catalog · tools, plugins, web apps and integrations",
  description:
    "Free tools, add-ons for your site, web apps, integrations and AI help for rental hosts, service businesses and childcare programs. Use it, buy it, or have it built.",
  path: "/catalog",
});

const shelves: CatalogAudience[] = ["rentals", "service", "family", "any"];

export default function CatalogPage() {
  return (
    <div className="cp">
      <div className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="cp-aurora cp-a1" />
          <span className="cp-aurora cp-a2" />
        </div>

        <div className="relative z-10">
          <PanelHeader current="/catalog" bookHref="/?offer=call#contact" />
        </div>

        <main className="relative z-10">
          <section className="border-b border-[var(--cp-line)] py-14 md:py-20">
            <div className="mx-auto max-w-6xl px-6">
              <h1 className="display m-0 max-w-3xl text-[2rem] text-balance text-[color:var(--cp-ink)] sm:text-4xl md:text-5xl">
                Everything you can use, buy or have built.
              </h1>
              <p className="mt-5 max-w-2xl text-[1rem] leading-relaxed text-[color:var(--cp-muted)]">
                Free tools you can use right now, add-ons for the site you
                already have, apps that run a business, and the connections that
                stop you typing the same thing twice. Every card says how real it
                is. If nothing here fits, describe what you need and get a written
                scope within a day.
              </p>
              <nav aria-label="Shelves" className="mt-6 flex flex-wrap gap-x-5 gap-y-2 text-[14px]">
                {shelves.map((s) => (
                  <Link
                    key={s}
                    href={`/catalog?for=${s}`}
                    className="font-semibold text-[color:var(--cp-violet-ink)] no-underline hover:opacity-80"
                  >
                    {audienceLabels[s]} <span aria-hidden="true">→</span>
                  </Link>
                ))}
              </nav>
            </div>
          </section>

          <section className="py-12 md:py-16">
            <div className="mx-auto max-w-6xl px-6">
              <CatalogBrowser />
            </div>
          </section>

          <section className="border-t border-[var(--cp-line)] py-14">
            <div className="mx-auto max-w-6xl px-6">
              <h2 className="m-0 text-2xl font-semibold text-[color:var(--cp-ink)]">
                Something else in mind?
              </h2>
              <p className="mt-3 max-w-2xl text-[1rem] leading-relaxed text-[color:var(--cp-muted)]">
                Most of what is above started as one business asking for one
                thing. Describe yours in a couple of sentences. Scoping is free
                and you own the code.
              </p>
              <Link
                href="/?offer=custom#contact"
                className="mt-5 inline-flex min-h-11 items-center rounded-[10px] bg-[color:var(--cp-ink)] px-5 text-[14px] font-semibold text-[color:var(--cp-on-ink)] no-underline hover:opacity-90"
              >
                Describe what you need <span aria-hidden="true">&nbsp;→</span>
              </Link>
            </div>
          </section>
        </main>
      </div>
      <Footer />
      <CommandPalette />
    </div>
  );
}
