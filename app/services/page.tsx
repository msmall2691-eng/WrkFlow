import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import Services from "@/components/Services";
import Pricing from "@/components/Pricing";
import Contact from "@/components/Contact";
import CommandPalette from "@/components/CommandPalette";

/*
  Services and pricing, on their own page.

  Both used to sit on the homepage, which made the first thing a visitor read
  about the work "custom builds from $1,500 · Care Plan $49/mo". That is the
  right opening for someone shopping for a website and the wrong one for
  anybody assessing the work itself, and the homepage cannot lead with both.

  So the homepage is the portfolio and this is the page for a client who
  wants scope and a number. Nothing was cut: the five service rows, the
  custom-build and Care Plan tiers, the smaller fixed-scope projects and the
  FAQ all moved here intact, and every pricing link on the site lands here.
*/
export const metadata: Metadata = pageMeta({
  title: "Services & pricing",
  description:
    "Websites, CRM setup, data migration, integrations and custom business tools for small businesses. Scope and price agreed before work begins.",
  path: "/services",
});

export default function ServicesPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <section className="border-b border-line bg-[var(--section-alt-bg)] py-14 md:py-20">
          <div className="mx-auto max-w-6xl px-6">
            <h1 className="display-serif max-w-3xl text-balance text-[2rem] text-ink sm:text-4xl md:text-5xl">
              What I build, and what it costs.
            </h1>
            <p className="mt-5 max-w-[62ch] text-[1.0625rem] leading-relaxed text-muted">
              Start with one useful improvement or a full custom build. I agree
              the scope and price with you before work begins.
            </p>
          </div>
        </section>
        <Services />
        <Pricing />
        <Contact />
      </main>
      <Footer />
      <CommandPalette />
    </>
  );
}
