import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AccentSwitcher from "@/components/AccentSwitcher";
import Reveal from "@/components/Reveal";
import MarketCatalog from "@/components/MarketCatalog";
import WorkflowMap from "@/components/WorkflowMap";
import HeroWordmark from "@/components/HeroWordmark";
import LinxMark from "@/components/LinxMark";
import { marketModelLabels } from "@/lib/content";

export const metadata: Metadata = {
  // The root layout's title template appends "· M Studio" — no brand here.
  title: "M Linx — Premade Tools, Sites & Plugins",
  description:
    "M Linx is M Studio's line of premade websites, web apps, tools, and automations—buy and own them outright, embed a hosted widget, or start free. Set up for you, by the studio that built them.",
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
          <HeroWordmark text="M LINX" />
          <div className="relative z-10 mx-auto max-w-6xl px-6">
            <Reveal>
              <div className="mb-5 flex items-center gap-2.5 text-ink">
                <LinxMark className="h-4 w-auto" />
                <span className="font-mono text-sm font-semibold tracking-wide">M Linx</span>
                <span className="font-mono text-xs uppercase tracking-widest text-faint">
                  · the marketplace
                </span>
              </div>
            </Reveal>
            <Reveal delay={60}>
              <h1 className="display-serif max-w-3xl text-3xl text-ink sm:text-4xl md:text-5xl">
                M Linx—premade tools and sites you can put to work today.
              </h1>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-muted">
                Ready-to-run sites, tools, and automations —{" "}
                <span className="text-ink">own one outright</span>,{" "}
                <span className="text-ink">rent a hosted tool</span>, or{" "}
                <span className="text-ink">start free</span>. Set up around your
                business either way.
              </p>
            </Reveal>

            {/* How it works — four flexible ways in */}
            <Reveal delay={160}>
              <div className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                <ModelCard
                  tag={marketModelLabels.template}
                  body="Set up for you, handed over. You own the code — no monthly."
                />
                <ModelCard
                  tag={marketModelLabels.embed}
                  body="Drops into your site in one line. A few dollars a month."
                />
                <ModelCard
                  tag={marketModelLabels.open}
                  body="Free to use right now. Try the work, no pressure."
                />
                <ModelCard
                  tag="Work together"
                  body="Tailored or hybrid — we'll build it custom."
                />
              </div>
            </Reveal>
          </div>
        </section>

        {/* Workflow / integration mapper — moved here from the homepage: "see
            what could connect to what" is the M Linx pitch in miniature. */}
        <WorkflowMap />

        {/* Catalog */}
        <section className="relative overflow-hidden py-14 md:py-20">
          <div
            aria-hidden="true"
            className="floaty-slow pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-signal/[0.05] blur-[130px]"
          />
          <div className="relative mx-auto max-w-6xl px-6">
            <MarketCatalog />
          </div>
        </section>

        {/* CTA */}
        <section className="relative overflow-hidden border-t border-line py-16">
          <div
            aria-hidden="true"
            className="floaty pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/[0.05] blur-[130px]"
          />
          <div className="relative mx-auto max-w-3xl px-6 text-center">
            <Reveal>
              <h2 className="display text-xl text-ink sm:text-2xl">
                Don&apos;t see your exact fit?
              </h2>
            </Reveal>
            <Reveal delay={60}>
              <p className="mx-auto mt-4 max-w-xl text-base leading-relaxed text-muted">
                Most of these started as a custom build. Share what you need, and
                you&apos;ll get pointed to the closest starter—or the right thing
                built from scratch.
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
