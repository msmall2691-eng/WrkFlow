import type { Metadata } from "next";
import Nav from "@/components/Nav";
import Footer from "@/components/Footer";
import AccentSwitcher from "@/components/AccentSwitcher";
import Reveal from "@/components/Reveal";
import Playground from "@/components/Playground";
import MaineReadout from "@/components/MaineReadout";
import HeroWordmark from "@/components/HeroWordmark";

export const metadata: Metadata = {
  title: "Playground — Experiments & Free Tools | M Studio",
  description:
    "A little sandbox of experiments and free tools from M Studio — a quote and invoice maker, a real site-speed check, QR codes, a live Maine readout, and a shader lab.",
};

export default function PlaygroundPage() {
  return (
    <>
      <Nav />
      <main className="pt-16">
        <section className="relative overflow-hidden border-b border-line py-16 md:py-24">
          <div aria-hidden="true" className="grid-bg pointer-events-none absolute inset-x-0 top-0 h-96" />
          <HeroWordmark text="PLAYGROUND" />
          <div className="relative z-10 mx-auto max-w-6xl px-6">
            <Reveal>
              <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">The sandbox</p>
            </Reveal>
            <Reveal delay={60}>
              <h1 className="mt-3 display-serif max-w-3xl text-3xl text-ink sm:text-4xl md:text-5xl">
                A little sandbox.
              </h1>
            </Reveal>
            <Reveal delay={120}>
              <p className="mt-5 max-w-2xl text-base leading-relaxed text-muted">
                Experiments and free tools in one place — try them, take what&apos;s
                useful. Proof that whatever you dream up, we can build it.
              </p>
            </Reveal>
            <Reveal delay={160}>
              <div className="mt-8 inline-flex items-center gap-3 rounded-xl border border-line bg-surface/60 px-4 py-3">
                <span className="font-mono text-[10px] uppercase tracking-widest text-faint">Live · now</span>
                <MaineReadout />
              </div>
            </Reveal>
          </div>
        </section>

        {/* The free tools */}
        <Playground />

        {/* Experiments */}
        <section className="relative overflow-hidden border-t border-line py-14 md:py-20">
          <div className="relative mx-auto max-w-6xl px-6">
            <Reveal>
              <h2 className="display text-2xl text-ink sm:text-3xl">Experiments</h2>
            </Reveal>
            <Reveal delay={80}>
              <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
                Odds and ends — built for the fun of it.
              </p>
            </Reveal>
            <Reveal delay={120}>
              <a
                href="/lab"
                className="group mt-8 flex max-w-md items-center justify-between gap-6 rounded-2xl border border-line bg-surface/60 p-6 transition-colors hover:border-signal/50"
              >
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-widest text-faint">Shader</p>
                  <h3 className="display-serif mt-2 text-lg text-ink md:text-xl">Liquid Chrome</h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    An interactive metal shader — move, click, fidget.
                  </p>
                </div>
                <span aria-hidden="true" className="shrink-0 text-signal transition-transform group-hover:translate-x-0.5">→</span>
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
