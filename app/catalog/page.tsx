import type { Metadata } from "next";
import { Suspense } from "react";
import Link from "next/link";
import Image from "next/image";
import { pageMeta } from "@/lib/seo";
import PanelHeader from "@/components/panel/PanelHeader";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";
import CatalogBrowser from "@/components/CatalogBrowser";
import { audienceLabels, catalog, formatLabels, liveDemoIds, type CatalogAudience } from "@/lib/catalog";

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

const liveDemos = liveDemoIds
  .map((id) => catalog.find((i) => i.id === id))
  .filter((i): i is NonNullable<typeof i> => Boolean(i));

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
                Websites, apps, add-ons and connections for small businesses.
                Try the live demos, buy something ready-made, or have it built
                around how you work. Every card says exactly how real it is.
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

          {/* Try it live: the five things that open and work right now. */}
          <section aria-labelledby="live-heading" className="border-b border-[var(--cp-line)] py-12 md:py-14">
            <div className="mx-auto max-w-6xl px-6">
              <h2 id="live-heading" className="m-0 text-xl font-semibold text-[color:var(--cp-ink)]">
                Try it live
              </h2>
              <p className="mt-1.5 max-w-2xl text-[14px] leading-relaxed text-[color:var(--cp-muted)]">
                Working versions you can click through right now. The businesses
                in the demos are invented. What they do is real, and yours gets
                built around your own business.
              </p>
              <ul className="-mx-6 m-0 mt-6 flex list-none snap-x gap-4 overflow-x-auto px-6 pb-2 md:mx-0 md:grid md:grid-cols-5 md:overflow-visible md:px-0">
                {liveDemos.map((d) => (
                  <li key={d.id} className="w-[72%] shrink-0 snap-start sm:w-[44%] md:w-auto">
                    <Link
                      href={d.primary?.href ?? "/catalog"}
                      className="cp-tile group flex h-full flex-col overflow-hidden no-underline"
                    >
                      <span className="relative block aspect-[16/10] w-full overflow-hidden border-b border-[color:var(--cp-hairline)] bg-[color:var(--cp-well)]">
                        {d.image && (
                          <Image
                            src={d.image}
                            alt={`${d.name}: a real screen`}
                            fill
                            sizes="(min-width: 768px) 220px, 72vw"
                            className="object-cover object-top transition-transform duration-300 group-hover:scale-[1.03] motion-reduce:transition-none motion-reduce:group-hover:scale-100"
                          />
                        )}
                      </span>
                      <span className="flex flex-1 flex-col p-4">
                        <span className="text-[14px] font-semibold text-[color:var(--cp-ink)]">{d.name}</span>
                        <span className="mt-auto pt-2 text-[12.5px] font-semibold text-[color:var(--cp-violet-ink)]">
                          Open it <span aria-hidden="true">→</span>
                        </span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>

          <section className="py-12 md:py-16">
            <div className="mx-auto max-w-6xl px-6">
              <Suspense fallback={<StaticList />}>
                <CatalogBrowser />
              </Suspense>
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

/* What renders before the filters hydrate: every card's name, type and
   price as a plain list, so the page is complete without JavaScript. */
function StaticList() {
  return (
    <ul className="m-0 grid list-none gap-3 p-0 sm:grid-cols-2 lg:grid-cols-3">
      {catalog.map((i) => (
        <li key={i.id} className="cp-tile p-4 text-[14px] text-[color:var(--cp-ink)]">
          <span className="font-semibold">{i.name}</span>
          <span className="block text-[12.5px] text-[color:var(--cp-muted)]">
            {formatLabels[i.format]} · {i.price}
          </span>
        </li>
      ))}
    </ul>
  );
}
