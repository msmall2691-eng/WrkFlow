import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { siteNav } from "@/lib/content";
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
          <Pricing />
          <Contact />
        </main>
      </div>
      <Footer />
      <CommandPalette />
    </div>
  );
}
