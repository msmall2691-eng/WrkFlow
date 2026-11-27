import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { demos as DEMOS } from "@/lib/content";
import PanelHeader from "@/components/panel/PanelHeader";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";
import StackedHeading from "@/components/StackedHeading";

/*
  /demo — the showcase the three demos were built for.

  This page was deliberately parked until there were three of them: a single
  demo is a one-off, and two is a coincidence. Three different KINDS of
  build, in three different looks, is the argument.

  It is the one page in this group that is genuinely M Studio's, so unlike
  the demos themselves it wears the V2 panel palette and the site chrome.
  The demos opt out of both on purpose, because a visitor is trying to
  picture their own site rather than this one.

  Indexable, while every demo it links to is `noindex`. The showcase is real
  marketing for a real studio; the fictional businesses should not turn up
  in search for anybody looking to buy a print, book a massage or find a
  farm.

  `bookHref` because this page has no contact form of its own, which is the
  shape the dead-end-booking-CTA test exists to catch.
*/

export const metadata: Metadata = pageMeta({
  title: "Demos",
  description:
    "Three working demos built by M Studio: a storefront, a booking app with real availability, and a searchable directory. Each one is clickable, and each business in them is invented.",
  path: "/demo",
});

/*
  The three demos now come from lib/content.ts, so the homepage band and
  this page cannot disagree about what exists or what each one proves.
  They were declared here, which was fine while this was the only page
  that showed them.
*/

export default function DemoIndexPage() {
  return (
    <div className="cp">
      <div className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="cp-aurora cp-a1" />
          <span className="cp-aurora cp-a2" />
        </div>

        <div className="relative z-10">
          <PanelHeader current="/demo" bookHref="/?offer=call#contact" />
        </div>

        <main className="relative z-10">
          <section className="border-b border-[var(--cp-line)] py-14 md:py-20">
            <div className="mx-auto max-w-6xl px-6">
              {/* Fraunces, as before: the demo cards under this are Fraunces
                  too. StackedHeading's `face` note has the reasoning. */}
              <StackedHeading
                as="h1"
                face="serif"
                lead="Three demos"
                trail="you can actually use."
              />
              <p className="mt-5 max-w-[62ch] text-[1.0625rem] leading-relaxed text-[color:var(--cp-muted)]">
                The case studies on this site are real client work. These are something else:
                three kinds of build, made so you can click them rather than take anybody&apos;s
                word for it. Each
                one is a working app, not a picture of one.
              </p>
              <p className="mt-4 max-w-[62ch] text-[0.9375rem] leading-relaxed text-[color:var(--cp-soft)]">
                The businesses in them are invented, and every demo says so on its own first line.
                Nothing takes payment, books a real appointment, or sends anybody an email.
              </p>
            </div>
          </section>

          <section className="py-12 md:py-16">
            <div className="mx-auto max-w-6xl px-6">
              <ul className="grid gap-5 lg:grid-cols-3">
                {DEMOS.map((d) => (
                  <li key={d.href} className="flex">
                    <Link
                      href={d.href}
                      className="group flex w-full flex-col rounded-2xl border border-[var(--cp-line)] bg-[var(--cp-panel,transparent)] p-6 transition-colors hover:border-[color:var(--cp-ink)]/35"
                    >
                      {/* The demo's own palette, so three different looks are visible before you click. */}
                      <span
                        aria-hidden="true"
                        className="mb-5 flex h-1.5 w-20 overflow-hidden rounded-full"
                      >
                        <span className="flex-1" style={{ background: d.swatch[0] }} />
                        <span className="flex-1" style={{ background: d.swatch[1] }} />
                      </span>

                      <span className="font-mono text-[11px] uppercase tracking-[0.18em] text-[color:var(--cp-soft)]">
                        {d.kind}
                      </span>
                      <span className="display-serif mt-1 text-[1.5rem] leading-tight text-[color:var(--cp-ink)]">
                        {d.name}
                      </span>
                      <span className="mt-3 text-[0.9375rem] leading-relaxed text-[color:var(--cp-muted)]">
                        {d.what}
                      </span>
                      <span className="mt-4 border-t border-[var(--cp-line)] pt-4 text-[0.875rem] leading-relaxed text-[color:var(--cp-soft)]">
                        {d.proves}
                      </span>
                      <span className="mt-5 inline-flex items-center gap-1.5 text-[0.9375rem] text-[color:var(--cp-ink)]">
                        Open the demo
                        <svg
                          aria-hidden="true"
                          width="15"
                          height="15"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          className="transition-transform group-hover:translate-x-0.5"
                        >
                          <path d="M5 12h14M13 6l6 6-6 6" />
                        </svg>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>

              <p className="mt-10 max-w-[62ch] text-[0.9375rem] leading-relaxed text-[color:var(--cp-muted)]">
                Want something that is none of these? Most of what I build is a mix: a site with a
                booking form, a directory with a members area, a storefront wired to the tools you
                already use.{" "}
                <Link
                  href="/?offer=call#contact"
                  className="underline decoration-[color:var(--cp-ink)]/30 underline-offset-4 hover:decoration-[color:var(--cp-ink)]"
                >
                  Say what you need
                </Link>
                .
              </p>
            </div>
          </section>
        </main>
      </div>
      <Footer />
      <CommandPalette />
    </div>
  );
}
