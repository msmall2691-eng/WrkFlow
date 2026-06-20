import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AccentSwitcher from "@/components/AccentSwitcher";
import Reveal from "@/components/Reveal";
import {
  marketItems,
  marketModelLabels,
  type MarketItem,
} from "@/lib/content";

export const metadata: Metadata = {
  title: "Marketplace — premade tools & sites",
  description:
    "Premade websites, web apps, tools, and automations from M Studio—buy and own them outright, embed a hosted widget, or start free. Set up for you, by the studio that built them.",
};

const modelBadge: Record<MarketItem["model"], string> = {
  template: "text-signal border-signal/40 bg-signal/10",
  embed: "text-gold border-gold/40 bg-gold/10",
  open: "text-muted border-line bg-white/[0.04]",
};

export default function MarketplacePage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        {/* Header */}
        <section className="relative overflow-hidden border-b border-line py-20 md:py-28">
          <div
            aria-hidden="true"
            className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-96"
          />
          <div className="relative mx-auto max-w-6xl px-6">
            <Reveal>
              <p className="marker mb-6">// Marketplace</p>
            </Reveal>
            <Reveal delay={60}>
              <h1 className="display-serif max-w-4xl text-[2.25rem] text-ink sm:text-5xl md:text-6xl">
                Premade tools and sites you can put to work today.
              </h1>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-muted">
                Not everything needs a from-scratch build. These are the things we
                make most often—packaged so you can{" "}
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
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {marketItems.map((item, i) => (
                <Reveal key={item.id} delay={i * 50}>
                  <ProductCard item={item} />
                </Reveal>
              ))}
            </div>

            <Reveal>
              <p className="mt-10 text-sm leading-relaxed text-faint">
                Pricing is indicative—every setup is tuned to your business, so the
                final number depends on scope. Tell us what you run and we&apos;ll
                send a fixed quote.
              </p>
            </Reveal>
          </div>
        </section>

        {/* CTA */}
        <section className="border-t border-line py-20">
          <div className="mx-auto max-w-3xl px-6 text-center">
            <Reveal>
              <h2 className="display text-2xl text-ink sm:text-3xl">
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

function ProductCard({ item }: { item: MarketItem }) {
  const href = `/#contact`;
  return (
    <article
      className={`elevate group flex h-full flex-col rounded-2xl border bg-elevated p-6 transition-colors hover:border-signal/50 ${
        item.featured ? "border-signal/40" : "border-line"
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <span className="font-mono text-[10px] uppercase tracking-widest text-faint">
          {item.category}
        </span>
        <span
          className={`rounded-full border px-2.5 py-1 font-mono text-[9px] uppercase tracking-widest ${modelBadge[item.model]}`}
        >
          {marketModelLabels[item.model]}
        </span>
      </div>

      <h3 className="display-serif mt-4 text-xl text-ink">{item.name}</h3>
      <p className="mt-2 text-sm leading-relaxed text-muted">{item.tagline}</p>

      <ul className="mt-5 space-y-2 border-t border-line pt-5">
        {item.includes.map((inc) => (
          <li key={inc} className="flex items-start gap-2.5 text-sm text-muted">
            <span
              aria-hidden="true"
              className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-signal"
            />
            <span>{inc}</span>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex items-center justify-between gap-3 border-t border-line pt-5">
        <span className="font-display text-sm font-medium text-ink">
          {item.price}
        </span>
        <a
          href={href}
          className="inline-flex items-center gap-1.5 rounded-full border border-signal/40 bg-signal/10 px-4 py-2 text-xs font-semibold text-signal transition-colors hover:bg-signal/20"
        >
          {item.model === "open" ? "Get it" : "Get started"}
          <span aria-hidden="true" className="transition-transform group-hover:translate-x-0.5">→</span>
        </a>
      </div>
    </article>
  );
}
