import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AccentSwitcher from "@/components/AccentSwitcher";
import Reveal from "@/components/Reveal";
import MarketCatalog from "@/components/MarketCatalog";
import HeroWordmark from "@/components/HeroWordmark";
import { marketModelLabels } from "@/lib/content";

export const metadata: Metadata = {
  title: "Linx — premade tools & sites",
  description:
    "Linx is M Studio's line of premade websites, web apps, tools, and automations—buy and own them outright, embed a hosted widget, or start free. Set up for you, by the studio that built them.",
};

export default function MarketplacePage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        {/* Header */}
        <section className="relative overflow-hidden border-b border-line py-16 md:py-24">
          <div
            aria-hidden="true"
            className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-96"
          />
          <HeroWordmark text="LINX" />
          <div className="relative z-10 mx-auto max-w-6xl px-6">
            <Reveal>
              <p className="marker mb-6">// Linx · the marketplace</p>
            </Reveal>
            <Reveal delay={60}>
              <h1 className="display-serif max-w-3xl text-3xl text-ink sm:text-4xl md:text-5xl">
                Linx—premade tools and sites you can put to work today.
              </h1>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">
                Linx is our line of ready-to-run builds—the things we make most
                often, packaged so you can{" "}
                <span className="text-ink">buy and own</span> them outright,{" "}
                <span className="text-ink">embed</span> a hosted widget in minutes,
                or <span className="text-ink">start free</span>. Either way, the
                studio that built them sets them up around your business.
              </p>
            </Reveal>

            {/* How it works — three models */}
            <Reveal delay={160}>
              <div className="mt-12 grid gap-4 sm:grid-cols-3">
                <ModelCard
                  tag={marketModelLabels.template}
                  body="A starter site or app, configured for you and handed over. You own the code—no monthly lock-in."
                />
                <ModelCard
                  tag={marketModelLabels.embed}
                  body="A hosted widget you drop into your existing site with one line. We run and update it; small monthly."
                />
                <ModelCard
                  tag={marketModelLabels.open}
                  body="Free to use right now, with open-source starters on request. A no-pressure way to try the work."
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* Catalog */}
        <section className="py-16 md:py-24">
          <div className="mx-auto max-w-6xl px-6">
            <MarketCatalog />
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-line py-16">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <Reveal>
              <h2 className="display text-xl text-ink sm:text-2xl">
                Don&apos;t see your exact fit?
              </h2>
            </Reveal>
            <Reveal delay={60}>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted">
                Most of these started as a custom build. Tell us what you need and
                we&apos;ll point you to the closest starter—or build the right thing
                from scratch.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <a
                href="/#contact"
                className="mt-8 inline-flex items-center justify-center gap-2 rounded-full bg-signal px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                Start a conversation →
              </a>
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
      <AccentSwitcher />
    </>
  );
}

function ModelCard({ tag, body }: { tag: string; body: string }) {
  return (
    <div className="rounded-xl border border-line bg-surface p-5">
      <p className="font-mono text-[10px] uppercase tracking-widest text-signal">
        {tag}
      </p>
      <p className="mt-3 text-sm leading-relaxed text-muted">{body}</p>
    </div>
  );
}
