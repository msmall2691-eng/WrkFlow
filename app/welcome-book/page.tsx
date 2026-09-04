import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AccentSwitcher from "@/components/AccentSwitcher";
import Reveal from "@/components/Reveal";
import HeroWordmark from "@/components/HeroWordmark";
import LinxMark from "@/components/LinxMark";
import WelcomeBookReserve from "@/components/WelcomeBookReserve";
import { welcomeBook } from "@/lib/content";

const wb = welcomeBook;
const demoDomain = wb.demoUrl.replace(/^https?:\/\//, "").replace(/\/$/, "");

export const metadata: Metadata = {
  title: "Digital Welcome Book for Short-Term Rentals | M Studio",
  description:
    "A digital welcome book your Airbnb guests actually open — check-in, WiFi, house manual, and your local picks on one link, plus a printable QR code. Built for you, yours to keep. Founding price $99.",
  alternates: { canonical: "/welcome-book" },
  openGraph: {
    title: "Digital Welcome Book for Short-Term Rentals",
    description:
      "The printed check-in binder, reborn as one link guests actually open. Check-in, WiFi, house manual, and local picks — built for you, yours to keep.",
    url: "/welcome-book",
  },
};

export default function WelcomeBookPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        {/* Hero */}
        <section className="relative overflow-hidden border-b border-line py-16 md:py-24">
          <div
            aria-hidden="true"
            className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-96"
          />
          <HeroWordmark text="WELCOME" />
          <div className="relative z-10 mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-[1.05fr_1fr]">
            <div>
              <Reveal>
                <div className="mb-5 flex items-center gap-2.5 text-ink">
                  <LinxMark className="h-4 w-auto" />
                  <span className="font-mono text-xs uppercase tracking-widest text-signal">
                    {wb.hero.kicker}
                  </span>
                </div>
              </Reveal>
              <Reveal delay={60}>
                <h1 className="display-serif text-3xl text-ink sm:text-4xl md:text-5xl">
                  {wb.hero.headline}
                </h1>
              </Reveal>
              <Reveal delay={120}>
                <p className="mt-6 max-w-xl text-[1rem] leading-relaxed text-muted">
                  {wb.hero.sub}
                </p>
              </Reveal>
              <Reveal delay={160}>
                <div className="mt-7 flex flex-wrap items-center gap-3">
                  <span className="inline-flex items-baseline gap-2 rounded-full border border-signal/40 bg-signal/10 px-4 py-2">
                    <span className="font-display text-lg font-semibold text-ink">
                      ${wb.introPrice}
                    </span>
                    <span className="font-mono text-[11px] uppercase tracking-widest text-signal">
                      founding price
                    </span>
                    <span className="font-mono text-[11px] text-faint line-through">
                      ${wb.regularPrice}
                    </span>
                  </span>
                  <span className="font-mono text-[11px] uppercase tracking-widest text-faint">
                    one-time · yours to keep
                  </span>
                </div>
              </Reveal>
              <Reveal delay={220}>
                <div className="mt-8 flex flex-wrap gap-3">
                  <a
                    href="#reserve"
                    className="inline-flex items-center justify-center gap-2 rounded-full bg-signal px-7 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
                  >
                    Get yours →
                  </a>
                  <a
                    href={wb.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-full border border-line px-7 py-3.5 text-sm font-semibold text-ink transition-colors hover:border-signal/50 hover:text-signal"
                  >
                    Explore the live demo
                  </a>
                </div>
              </Reveal>
            </div>

            {/* Live demo preview — the real welcome book, framed in a browser */}
            <Reveal delay={120}>
              <div className="overflow-hidden rounded-2xl border border-line bg-surface shadow-[0_24px_60px_-30px_rgba(0,0,0,0.7)]">
                <div className="flex items-center gap-1.5 border-b border-line bg-base/60 px-3 py-2">
                  <span className="h-2.5 w-2.5 rounded-full bg-line" />
                  <span className="h-2.5 w-2.5 rounded-full bg-line" />
                  <span className="h-2.5 w-2.5 rounded-full bg-line" />
                  <span className="ml-2 truncate rounded bg-surface px-2 py-0.5 font-mono text-[10px] text-faint">
                    {demoDomain}
                  </span>
                  <span className="ml-auto inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-widest text-signal">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-signal motion-reduce:animate-none" />
                    Live
                  </span>
                </div>
                <div className="relative aspect-[16/11] bg-base">
                  <iframe
                    src={wb.demoUrl}
                    title={`${wb.demoName} — live welcome book`}
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
                  <a
                    href={wb.demoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="absolute inset-0"
                    aria-label={`Open ${wb.demoName} welcome book in a new tab`}
                  />
                </div>
                <p className="border-t border-line px-4 py-2.5 font-mono text-[10px] uppercase tracking-widest text-faint">
                  A real one · {wb.demoName}, Maine
                </p>
              </div>
            </Reveal>
          </div>
        </section>

        {/* What's included */}
        <section className="relative overflow-hidden border-b border-line py-16 md:py-20">
          <div className="relative mx-auto max-w-6xl px-6">
            <div className="mb-10 max-w-3xl">
              <Reveal>
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
                  What&apos;s inside
                </p>
              </Reveal>
              <Reveal delay={60}>
                <h2 className="display text-2xl text-ink sm:text-3xl md:text-4xl">
                  Everything a guest asks — before they ask.
                </h2>
              </Reveal>
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {wb.includes.map((inc, i) => (
                <Reveal key={inc} delay={i * 50}>
                  <div className="flex h-full items-start gap-3 rounded-xl border border-line bg-surface p-5">
                    <span
                      aria-hidden="true"
                      className="mt-1 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-signal/15 text-xs text-signal"
                    >
                      ✓
                    </span>
                    <p className="text-sm leading-relaxed text-muted">{inc}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* How it works */}
        <section className="relative overflow-hidden border-b border-line py-16 md:py-20">
          <div className="relative mx-auto max-w-6xl px-6">
            <div className="mb-10 max-w-3xl">
              <Reveal>
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
                  How it works
                </p>
              </Reveal>
              <Reveal delay={60}>
                <h2 className="display text-2xl text-ink sm:text-3xl md:text-4xl">
                  Three steps, mostly on me.
                </h2>
              </Reveal>
            </div>
            <div className="grid gap-6 md:grid-cols-3">
              {wb.steps.map((step, i) => (
                <Reveal key={step.n} delay={i * 70}>
                  <div className="flex h-full flex-col rounded-2xl border border-line bg-surface p-6">
                    <span className="font-mono text-sm text-signal">{step.n}</span>
                    <h3 className="display-serif mt-3 text-lg text-ink">{step.title}</h3>
                    <p className="mt-2 text-sm leading-relaxed text-muted">{step.body}</p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* FAQ */}
        <section className="relative overflow-hidden border-b border-line py-16 md:py-20">
          <div className="relative mx-auto max-w-4xl px-6">
            <div className="mb-10 max-w-3xl">
              <Reveal>
                <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
                  FAQ
                </p>
              </Reveal>
              <Reveal delay={60}>
                <h2 className="display text-2xl text-ink sm:text-3xl md:text-4xl">
                  Good questions.
                </h2>
              </Reveal>
            </div>
            <div className="divide-y divide-line rounded-2xl border border-line bg-surface/40">
              {wb.faqs.map((item, i) => (
                <Reveal key={item.q} delay={i * 40}>
                  <details className="group">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-left text-[1rem] font-medium text-ink transition-colors hover:text-signal md:p-6 md:text-lg [&::-webkit-details-marker]:hidden">
                      <span>{item.q}</span>
                      <span
                        aria-hidden="true"
                        className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line font-mono text-[13px] leading-none text-faint transition-all duration-300 group-hover:border-signal/50 group-hover:text-signal group-open:rotate-45"
                      >
                        +
                      </span>
                    </summary>
                    <div className="px-5 pb-5 pt-0 text-sm leading-relaxed text-muted md:px-6 md:pb-6 md:text-[1rem]">
                      {item.a}
                    </div>
                  </details>
                </Reveal>
              ))}
            </div>
          </div>
        </section>

        {/* Reserve */}
        <section id="reserve" className="relative overflow-hidden py-16 md:py-24">
          <div
            aria-hidden="true"
            className="floaty pointer-events-none absolute left-1/2 top-1/2 h-72 w-72 -translate-x-1/2 -translate-y-1/2 rounded-full bg-signal/[0.05] blur-[130px]"
          />
          <div className="relative mx-auto max-w-2xl px-6">
            <div className="mb-8 text-center">
              <Reveal>
                <h2 className="display text-2xl text-ink sm:text-3xl">
                  Want one for your place?
                </h2>
              </Reveal>
              <Reveal delay={60}>
                <p className="mx-auto mt-4 max-w-lg text-[1rem] leading-relaxed text-muted">
                  Founding price of ${wb.introPrice} for the first few — one-time,
                  no monthly app fee, and the book is yours to keep. Tell me about
                  your rental and I&apos;ll take it from there.
                </p>
              </Reveal>
            </div>
            <Reveal delay={120}>
              <WelcomeBookReserve price={wb.introPrice} />
            </Reveal>
          </div>
        </section>
      </main>
      <Footer />
      <AccentSwitcher />
    </>
  );
}
