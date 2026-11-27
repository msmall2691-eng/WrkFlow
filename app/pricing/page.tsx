import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { homeBands, siteNav, smallProjects } from "@/lib/content";
import StageTopBar from "@/components/stage/StageTopBar";
import Footer from "@/components/Footer";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import CommandPalette from "@/components/CommandPalette";
import StackedHeading from "@/components/StackedHeading";

/*
  Prices, on a page of their own.

  **They were a band on the homepage, and the Linx Brand Plan takes them
  off it**: "No prices, no founder photo, and no cleaning-company numbers
  on the homepage", with pricing as its own route carrying every product.
  The reasoning in the plan is a product company's rather than a studio's
  — somebody arriving at a product site is deciding whether they are in
  the right place, and a price list is an answer to a question they have
  not asked yet.

  **Nothing was rewritten to move it.** `<Pricing />` is the same
  component the homepage rendered, prices still resolved from
  `smallProjects` and `studioStats`, FAQ included. The band wrapper
  `StagePricing` is what came off the homepage; the content never
  belonged to it.

  `<Contact />` is here because a price list with no way to act on it is
  a dead end, and it is the same form every other converted page ends
  with — which is also why this page needs no `bookHref`: it renders its
  own `#contact`.
*/
export const metadata: Metadata = pageMeta({
  title: "Pricing",
  description:
    "What things cost: fixed prices for smaller pieces of work, the Care Plan, and how custom websites, web apps and integrations are quoted.",
  path: "/pricing",
});

export default function PricingPage() {
  return (
    <div className="cp cp-inner">
      <div className="relative overflow-hidden">
        <StageTopBar inFlow cta="book" nav={siteNav} here="Pricing" />

        <main className="relative z-10">
          <section className="border-b border-[var(--cp-line)] py-14 md:py-20">
            <div className="mx-auto max-w-6xl px-6">
              <StackedHeading as="h1" face="serif" lead="What it costs." />
              <p className="mt-5 max-w-[62ch] text-[1.0625rem] leading-relaxed text-[color:var(--cp-muted)]">
                The fixed prices are below. Anything bigger is quoted in
                writing first.
              </p>
            </div>
          </section>
          {/*
            **The four fixed prices, which `<Pricing />` does not carry.**
            It renders the custom build, the Care Plan, the promises and
            the FAQ; the `smallProjects` list lived in the homepage band,
            so moving the band here without them would have quietly
            dropped the only four numbers on the site somebody can act on
            today. A test caught it, which is the whole reason that test
            asserts the titles and the prices rather than that a price
            list exists.

            Read from `smallProjects`, so the prices still have one
            author. Plain markup rather than `StagePricing`, because that
            component's styles are scoped to `.stage` and this page wears
            `.cp-inner`.
          */}
          <section className="border-b border-line py-14 md:py-16">
            <div className="mx-auto max-w-6xl px-6">
              <h2 className="display text-2xl text-ink sm:text-3xl">
                {homeBands.pricing.heading}
              </h2>
              <p className="mt-3 max-w-[58ch] text-sm leading-relaxed text-muted">
                {homeBands.pricing.lede}
              </p>

              <ul className="mt-8 grid list-none gap-px border-y border-line bg-line p-0 sm:grid-cols-2">
                {smallProjects.map((project) => (
                  <li key={project.offer} className="bg-base p-5">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4">
                      <span className="text-[15px] font-semibold text-ink">
                        {project.title}
                      </span>
                      <span className="font-mono text-sm text-signal">{project.price}</span>
                    </div>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{project.scope}</p>
                  </li>
                ))}
              </ul>

              <p className="mt-6 max-w-[62ch] text-sm leading-relaxed text-muted">
                {homeBands.pricing.note}
              </p>
            </div>
          </section>

          <Pricing />
          <Contact />
        </main>
      </div>
      <Footer />
      <CommandPalette />
    </div>
  );
}
