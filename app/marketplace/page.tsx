import type { Metadata } from "next";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import PanelHeader from "@/components/panel/PanelHeader";
import Footer from "@/components/Footer";
import CommandPalette from "@/components/CommandPalette";
import MarketCatalog from "@/components/MarketCatalog";
import WorkflowMap from "@/components/WorkflowMap";
import LinxMark from "@/components/LinxMark";
import StackedHeading from "@/components/StackedHeading";
import CastFrame from "@/components/ocean/CastFrame";
import { marketItems, welcomeBook } from "@/lib/content";

/*
  M Linx — the premade tools, sites and automations, on their own page.

  ───────────────────────────────────────────────────────────────────────────
  Restructured around the funnel (Nov 2026), on Meg's call.

  Before this the page was a flat grid of seven cards in the order they were
  written, led by four abstract cards explaining the three commercial models.
  So the first thing a visitor read was a taxonomy ("Buy & own", "Embed /
  hosted", "Free / open-source") rather than a thing they could have today,
  and the $99 product that needs no scope call sat in the same visual slot as
  the $1,200 one that does.

  It now reads as a ladder, which is also the order `marketItems` is stored
  in (see the note above it):

    1. The welcome book, in its own band. $99, one link, nothing to learn.
       This is the plug-and-play rung and the only product here somebody can
       decide on without talking to anybody, so it goes first and alone.
    2. The grid: free tools, then the hosted embeds, then the builds you own.
    3. BrightBase, as the destination. Deliberately with NO price and no
       buy path: Meg's call is that it stays a demo, so this band links to
       /brightbase and its "book a demo" CTA and claims nothing else. Do not
       add a price here without her number; see the `results` gate in
       lib/content.ts for why invented ones are the thing to avoid.
    4. Custom work, last, for the people none of the rungs fit.

  V2 pass, same wrapper as /services and /tools: `.cp` redefines the old
  token names in its own scope, so MarketCatalog and WorkflowMap take the V2
  palette without being touched.

  Two things the conversion dropped. The four ModelCards that explained the
  commercial models are gone: the models are legible from the cards' own
  badges and prices, and leading with a taxonomy is what this restructure is
  getting away from. The parked "M LINX" HeroWordmark is gone too, because
  no other V2 hero has one, and the wordmark's own `position` note records
  that it had already been shoved into the right-hand gutter to stop it
  running through the copy. The M Linx mark and name still head the section.

  One thing this page does NOT fix: PanelHeader has no M Linx link. The old
  <Nav> did, so converting the rest of the site to V2 quietly cut the
  marketplace's front door. PanelHeader's own comment records "Five links,
  ⌘K, one call to action ... (Meg: keep it calm)", so a sixth link is her
  call rather than something to slip in here. Today the page is reached from
  the footer, from Services, from the ⌘K palette and from the nudges in
  Playground on /tools. If the marketplace is meant to be the way in, that
  is the next thing to settle.
*/

export const metadata: Metadata = pageMeta({
  // The root layout's title template appends "· M Studio" — no brand here.
  title: "M Linx. Premade Tools, Sites and Plugins",
  description:
    "M Linx is M Studio's line of premade websites, web apps, tools and automations. Start free, buy one outright, or add a hosted tool to the site you already have. Set up for you.",
  path: "/marketplace",
});

export default function MarketplacePage() {
  const book = marketItems.find((m) => m.id === "welcome-book");

  return (
    <div className="cp">
      <div className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="cp-aurora cp-a1" />
          <span className="cp-aurora cp-a2" />
        </div>

        <div className="relative z-10">
          <PanelHeader bookHref="/?offer=call#contact" />
        </div>

        {/* No pt-16: that cleared the fixed <Nav>, and PanelHeader is in flow. */}
        <main className="relative z-10">
          {/* Header */}
          <section className="border-b border-[var(--cp-line)] py-14 md:py-20">
            <div className="mx-auto max-w-6xl px-6">
              <div className="mb-5 flex items-center gap-2.5 text-[color:var(--cp-ink)]">
                <LinxMark className="h-4 w-auto" />
                <span className="font-display text-sm font-semibold">M Linx</span>
              </div>
              {/*
                `display`, not `display-serif`. /services keeps Fraunces
                because every heading under it comes from Services, Pricing
                and Contact and is set in Fraunces too. Nothing on this page
                is: MarketCatalog's card titles are the only serif here, and
                they are 18px. So this h1 follows the panel's own face, the
                way /tools does.
              */}
              <StackedHeading as="h1" lead="Ready to use." trail="Nothing to learn." />
              <p className="mt-5 max-w-xl text-[1rem] leading-relaxed text-[color:var(--cp-muted)]">
                Start with something free, buy one thing outright, or add a
                hosted tool to the site you already have. I set it up either
                way, so there is nothing for you to wire together.
              </p>
            </div>
          </section>

          {/*
            **A band of Meg's red octopus, and the one picture on this site
            that is off-palette on purpose.**

            The rest of the ocean here is violet, teal and near-black,
            which is the `.cp` palette. This render is red and green, and
            that is why it sat unused: CLAUDE.md is clear that the accents
            are violet, teal and pink, and dropping a red-and-green picture
            next to a teal link is how a palette stops meaning anything.

            It works here because this page has no ocean art at all and no
            teal accent anywhere near the band, so the picture is its own
            moment rather than a clash with something beside it. It is
            uncaptioned, as every frame on the site now is: the caption
            printed the reef analogy, which came off the site on Nov 25
            2026, so there is nothing left for one to say.
          */}
          {/* Not `aria-hidden`: the frame carries a real description, and
              hiding the section would throw it away. Decorative here means
              it carries no *claim*, not that it is invisible to a reader
              who cannot see it. Same treatment as the /tools moorings. */}
          <section className="border-b border-[var(--cp-line)] py-10 md:py-14">
            <div className="mx-auto max-w-6xl px-6">
              <CastFrame
                art="/ocean/reef-ember.webp"
                artAlt="A red octopus on a reef of red fan coral and green growth, with jellyfish drifting above it."
                aspect="aspect-[21/9]"
                sizes="(min-width: 1024px) 1152px, 100vw"
              />
            </div>
          </section>

          {/*
            The entry point, on its own.

            A live iframe of the real thing, not a screenshot: this is Meg's
            own Maine rental, it is the demo the /welcome-book page already
            embeds, and a guest-facing page is the one product here whose
            whole argument is "open it on your phone and see".
          */}
          {book && (
            <section className="border-b border-[var(--cp-line)] bg-[var(--color-base)] py-14 md:py-20">
              <div className="mx-auto max-w-6xl px-6">
                <p className="text-xs uppercase tracking-wider text-[var(--cp-faint)]">
                  Start here
                </p>
                <div className="mt-6 grid items-center gap-10 lg:grid-cols-[1fr_1.1fr]">
                  <div>
                    <h2 className="text-[1.75rem] font-semibold tracking-tight text-[color:var(--cp-ink)] sm:text-3xl">
                      {book.name}
                    </h2>
                    <p className="mt-4 text-[1rem] leading-relaxed text-[color:var(--cp-muted)]">
                      {book.tagline}
                    </p>
                    <ul className="mt-6 space-y-2.5">
                      {book.includes.map((inc) => (
                        <li
                          key={inc}
                          className="flex items-start gap-2.5 text-sm leading-relaxed text-[color:var(--cp-muted)]"
                        >
                          <span
                            aria-hidden="true"
                            className="mt-[0.45rem] inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--cp-teal)]"
                          />
                          <span>{inc}</span>
                        </li>
                      ))}
                    </ul>
                    <div className="mt-8 flex flex-wrap items-center gap-4">
                      <Link
                        href="/welcome-book"
                        className="inline-flex items-center gap-2 rounded-full bg-[color:var(--cp-ink)] px-6 py-3 text-sm font-semibold text-[color:var(--cp-on-ink)] no-underline transition-transform duration-150 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                      >
                        See it and get one
                        <span aria-hidden="true">→</span>
                      </Link>
                      <span className="text-sm font-medium text-[color:var(--cp-ink)]">
                        {book.price}
                      </span>
                    </div>
                  </div>

                  {/*
                    aspect-[16/10] and a border, matching the case-study hero
                    frames on /work/[slug]. The iframe is inert: pointer
                    events off, and the whole frame is not a link, so the
                    buttons above stay the only targets.
                  */}
                  <div className="overflow-hidden rounded-2xl border border-[var(--cp-line)] bg-[var(--color-base)]">
                    <div className="relative aspect-[16/10]">
                      <iframe
                        src={welcomeBook.demoUrl}
                        title={`Live preview of ${welcomeBook.demoName}`}
                        loading="lazy"
                        className="absolute left-0 top-0"
                        style={{
                          border: 0,
                          width: "200%",
                          height: "200%",
                          transform: "scale(0.5)",
                          transformOrigin: "top left",
                          pointerEvents: "none",
                        }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </section>
          )}

          {/* Catalog — the welcome book is the band above, so it is excluded. */}
          <section className="border-b border-[var(--cp-line)] bg-[var(--color-base)] py-14 md:py-20">
            <div className="mx-auto max-w-6xl px-6">
              <p className="text-xs uppercase tracking-wider text-[var(--cp-faint)]">
                Everything else
              </p>
              <h2 className="mt-3 text-[1.75rem] font-semibold tracking-tight text-[color:var(--cp-ink)] sm:text-3xl">
                Free first, then the rest.
              </h2>
              <p className="mt-3 max-w-xl text-[1rem] leading-relaxed text-[color:var(--cp-muted)]">
                Cheapest and quickest at the top. Ask about anything here and
                you get a fixed quote back, with no payment up front.
              </p>
              <div className="mt-10">
                <MarketCatalog exclude={["welcome-book"]} />
              </div>
            </div>
          </section>

          {/*
            BrightBase — the destination.

            NO price and no buy button, on Meg's call: it stays a demo.
            Everything stated here is already on /brightbase or in
            lib/content.ts; nothing about availability or cost is added.
          */}
          <section className="border-b border-[var(--cp-line)] bg-[var(--color-base)] py-14 md:py-20">
            <div className="mx-auto max-w-6xl px-6">
              <p className="text-xs uppercase tracking-wider text-[var(--cp-faint)]">
                When one tool is not enough
              </p>
              <h2 className="mt-3 max-w-2xl text-[1.75rem] font-semibold tracking-tight text-[color:var(--cp-ink)] sm:text-3xl">
                The whole thing, running a real company.
              </h2>
              <p className="mt-4 max-w-[62ch] text-[1rem] leading-relaxed text-[color:var(--cp-muted)]">
                BrightBase is the operations system behind a real Maine
                cleaning company: leads, quotes, scheduling, a crew phone app,
                a customer portal, invoicing and payouts in one place. It is in
                daily use. If the tools above are pieces of a system, this is
                what the finished one looks like.
              </p>
              <div className="mt-8 flex flex-wrap items-center gap-4">
                <Link
                  href="/brightbase"
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--cp-hairline-strong)] px-6 py-3 text-sm font-semibold text-[color:var(--cp-ink)] no-underline transition-colors duration-150 hover:bg-[color:var(--cp-fill-strong)]"
                >
                  Take a look at BrightBase
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </section>

          {/*
            The integration mapper, moved below the catalog.

            It used to sit directly under the header, so "see what could
            connect to what" was the second thing on the page. That is the
            systems argument, and it only means anything once you have seen
            the pieces, which is why it now follows them and the BrightBase
            band rather than leading.
          */}
          <WorkflowMap />

          {/* Custom work, last. */}
          <section className="border-t border-[var(--cp-line)] bg-[var(--section-alt-bg)] py-16 md:py-24">
            <div className="mx-auto max-w-6xl px-6">
              <h2 className="text-[1.75rem] font-semibold tracking-tight text-[color:var(--cp-ink)] sm:text-3xl">
                None of it quite fits?
              </h2>
              <p className="mt-4 max-w-[62ch] text-[1rem] leading-relaxed text-[color:var(--cp-muted)]">
                Most of these started as a custom build for somebody. Tell me
                what you are trying to solve and I&apos;ll point you at the
                closest one, or quote the thing that actually fits. You
                don&apos;t need a technical plan to get started.
              </p>
              <div className="mt-8 flex flex-wrap gap-4">
                <Link
                  href="/?offer=custom#contact"
                  className="inline-flex items-center gap-2 rounded-full bg-[color:var(--cp-ink)] px-7 py-3.5 text-sm font-semibold text-[color:var(--cp-on-ink)] no-underline transition-transform duration-150 hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
                >
                  Start a conversation
                  <span aria-hidden="true">→</span>
                </Link>
                <Link
                  href="/services"
                  className="inline-flex items-center gap-2 rounded-full border border-[color:var(--cp-hairline-strong)] px-7 py-3.5 text-sm font-semibold text-[color:var(--cp-ink)] no-underline transition-colors duration-150 hover:bg-[color:var(--cp-fill-strong)]"
                >
                  Scope and pricing
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </div>
          </section>
        </main>
      </div>
      <Footer />
      <CommandPalette />
    </div>
  );
}
