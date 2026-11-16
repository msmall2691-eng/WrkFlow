import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { pageMeta } from "@/lib/seo";
import PanelHeader from "@/components/panel/PanelHeader";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";
import { work, type WorkItem } from "@/lib/content";

/*
  /work — every real project, once, with a real screen (Nov 15 2026).

  The homepage used to carry this as "The rest of it." under the worked
  example, which made the homepage the longest page on the site and listed
  projects the catalog already showed. The homepage now keeps the one
  worked example; everything built for a real business lives here.

  Only `work[]`, which is the list of things real businesses run. The demos
  (invented businesses) are deliberately not here; they live in the
  catalog's Try it live row, labelled as demos.

  `shots` maps a project to the freshest real capture. Fresh captures of
  the live sites (Nov 15) replace the older dark-theme files where one
  exists; anything not mapped falls back to the item's own `shot`.
*/

export const metadata: Metadata = pageMeta({
  title: "Work · websites, apps and systems running real businesses",
  description:
    "Websites, web apps and back-office systems built for real small businesses: a cleaning company, an admin firm, a contractor, a childcare program and a rental.",
  path: "/work",
});

const shots: Record<string, string> = {
  "The Maine Cleaning Co.": "/shots/catalog/live-maineclean.webp",
  "The Keystone House": "/shots/catalog/welcome-book.webp",
  "The Remote Admin": "/shots/catalog/live-remote-admin.webp",
  "Nash Construction": "/shots/catalog/live-nash.webp",
  "Arrowhead Explorers": "/shots/catalog/live-arrowhead.webp",
  linx: "/shots/catalog/live-linx.webp",
  BrightBase: "/shots/brightbase/schedule.webp",
  "Turnover scheduling": "/shots/brightbase/turnovers.webp",
  "Instant Estimate": "/shots/catalog/live-estimate.webp",
};

/* Client and outside work first, Meg's own businesses after (Nov 15: the
   site should not centre on the cleaning company). Unlisted titles keep
   their `work[]` order at the end. */
const ORDER = [
  "The Remote Admin",
  "Nash Construction",
  "Arrowhead Explorers",
  "The Keystone House",
  "linx",
  "The Maine Cleaning Co.",
  "BrightBase",
  "Turnover scheduling",
  "Instant Estimate",
];
const ordered = [...work].sort(
  (a, b) => (ORDER.indexOf(a.title) + 1 || 99) - (ORDER.indexOf(b.title) + 1 || 99),
);

function primaryLink(w: WorkItem): { href: string; label: string; external?: boolean } | null {
  if (w.caseStudy) return { href: `/work/${w.caseStudy}`, label: "Read the case study" };
  if (w.page) return { href: w.page, label: "Look inside" };
  if (w.url) return { href: w.url, label: "Visit the live site", external: true };
  return null;
}

export default function WorkPage() {
  return (
    <div className="cp">
      <PanelHeader current="/work" bookHref="/?offer=call#contact" />
      <main>
        <section className="border-b border-[var(--cp-line)] pb-10 pt-8 md:pb-12 md:pt-12">
          <div className="mx-auto max-w-6xl px-6">
            <p className="m-0 text-[13px] font-medium text-[color:var(--cp-faint)]">
              Work · {work.length} projects running real businesses
            </p>
            <h1 className="display m-0 mt-2 max-w-3xl text-[1.85rem] text-balance text-[color:var(--cp-ink)] sm:text-4xl">
              Built for real businesses, in daily use.
            </h1>
            <p className="mt-3 max-w-2xl text-[15.5px] leading-relaxed text-[color:var(--cp-muted)]">
              Websites, apps and the systems behind them. Every screen here is
              the real thing. Want one like it? Each one is in the{" "}
              <Link href="/catalog" className="font-semibold text-[color:var(--cp-violet-ink)] no-underline hover:opacity-80">
                catalog
              </Link>
              .
            </p>
          </div>
        </section>

        <section className="py-12 md:py-14">
          <div className="mx-auto max-w-6xl px-6">
            <ul className="m-0 grid list-none gap-5 p-0 sm:grid-cols-2 lg:grid-cols-3">
              {ordered.map((w) => {
                const img = shots[w.title] ?? w.shot;
                const link = primaryLink(w);
                return (
                  <li key={w.title} className="cp-tile flex min-w-0 flex-col overflow-hidden !rounded-xl">
                    {img && (
                      <div className="relative aspect-[16/10] w-full overflow-hidden border-b border-[color:var(--cp-hairline)] bg-[color:var(--cp-well)]">
                        <Image
                          unoptimized
                          src={img}
                          alt={`${w.title}, a real screen`}
                          fill
                          sizes="(min-width: 1024px) 360px, (min-width: 640px) 50vw, 100vw"
                          className="object-cover object-top"
                        />
                      </div>
                    )}
                    <div className="flex flex-1 flex-col p-5">
                      <p className="m-0 text-[11.5px] font-medium text-[color:var(--cp-faint)]">{w.tag}</p>
                      <h2 className="m-0 mt-1 text-[17px] font-semibold text-[color:var(--cp-ink)]">{w.title}</h2>
                      <p className="m-0 mt-2 flex-1 text-[13.5px] leading-relaxed text-[color:var(--cp-muted)]">
                        {w.blurb}
                      </p>
                      {w.replaced && (
                        <p className="m-0 mt-3 text-[12.5px] text-[color:var(--cp-soft)]">Replaced: {w.replaced}</p>
                      )}
                      {w.stack && (
                        <p className="m-0 mt-2 text-[11.5px] text-[color:var(--cp-faint)]">{w.stack.join(" · ")}</p>
                      )}
                      {link && (
                        <div className="mt-4 border-t border-[color:var(--cp-hairline)] pt-3">
                          {link.external ? (
                            <a
                              href={link.href}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex min-h-9 items-center text-[13px] font-semibold text-[color:var(--cp-violet-ink)] no-underline hover:opacity-80"
                            >
                              {link.label} <span aria-hidden="true">&nbsp;↗</span>
                            </a>
                          ) : (
                            <Link
                              href={link.href}
                              className="inline-flex min-h-9 items-center text-[13px] font-semibold text-[color:var(--cp-violet-ink)] no-underline hover:opacity-80"
                            >
                              {link.label} <span aria-hidden="true">→</span>
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>

        <section className="border-t border-[var(--cp-line)] py-12">
          <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-6 px-6">
            <div>
              <h2 className="m-0 text-xl font-semibold text-[color:var(--cp-ink)]">Want something like one of these?</h2>
              <p className="m-0 mt-1.5 max-w-xl text-[14.5px] text-[color:var(--cp-muted)]">
                Describe what you need and get a written scope within a day.
              </p>
            </div>
            <Link
              href="/?offer=project#contact"
              className="inline-flex min-h-11 items-center rounded-lg bg-[color:var(--cp-ink)] px-5 text-[14px] font-semibold text-[color:var(--cp-on-ink)] no-underline hover:opacity-90"
            >
              Start a project
            </Link>
          </div>
        </section>
      </main>
      <Footer />
      <CommandPalette />
    </div>
  );
}
