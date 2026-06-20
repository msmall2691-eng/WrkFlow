import { whoIsItFor } from "@/lib/content";
import Reveal from "./Reveal";
import RentedVsBuilt from "./RentedVsBuilt";

/*
  The Shift — the "why now" intro, with the "who it's for" folded in and an
  interactive rent-vs-build flip. Studio voice ("we").
*/
export default function Shift() {
  return (
    <section id="shift" className="relative overflow-hidden pb-16 pt-20 md:pb-24 md:pt-28">
      {/* Soft landing from the dark hero — a faint shade easing into the page */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[var(--color-surface)] to-transparent"
      />
      {/* Soft accent glow — brightness + life (recolors with the accent) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-16 h-72 w-72 rounded-full bg-signal/[0.07] blur-[120px]"
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="marker mb-4">// The shift</p>
        </Reveal>

        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <Reveal>
              <h2 className="display text-2xl text-ink sm:text-3xl md:text-4xl">
                For the first time, you can <span className="text-signal">own</span>{" "}
                the website, automations, and systems built for exactly how your
                business runs.
              </h2>
            </Reveal>
          </div>

          <div className="space-y-6 text-base leading-relaxed text-muted md:col-span-5 md:pt-2">
            <Reveal delay={80}>
              <p>
                For years the deal was lopsided: rent your software from a big
                platform, bend your business to its forms, and pay per seat
                forever. Anything custom—your own site, your own automations, your
                own database—meant hiring a dev team you couldn&apos;t justify.
              </p>
            </Reveal>
            <Reveal delay={160}>
              <p>
                That math has changed. The tools to design clean websites, link
                your systems together, and put automation and AI to work are
                finally within reach of a small, sharp studio—so custom, fitted
                software is realistic for a business your size, today.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <p className="text-ink">
                We know, because we built it for our own company first. Move now
                and you stop wrestling rented tools—and start compounding an
                advantage in systems no competitor can buy off a shelf.
              </p>
            </Reveal>
          </div>
        </div>

        <RentedVsBuilt />

        {/* Who it's for — folded in so the intro is one lean beat */}
        <Reveal delay={120}>
          <div className="mt-12 border-t border-line pt-8">
            <p className="marker mb-4">// Who it&apos;s for</p>
            <p className="display-serif max-w-3xl text-xl leading-snug text-ink sm:text-2xl">
              {whoIsItFor}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
