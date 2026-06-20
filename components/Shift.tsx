import Reveal from "./Reveal";
import RentedVsBuilt from "./RentedVsBuilt";

export default function Shift() {
  return (
    <section id="shift" className="relative overflow-hidden pb-20 pt-24 md:pb-28 md:pt-32">
      {/* Soft landing from the dark hero — a faint shade easing into the page */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-44 bg-gradient-to-b from-[var(--color-surface)] to-transparent"
      />
      {/* Soft accent glow — brightness + life (recolors with the accent) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-24 top-16 h-80 w-80 rounded-full bg-signal/10 blur-[110px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 top-1/3 h-72 w-72 rounded-full bg-gold/10 blur-[120px]"
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="marker mb-6">// The shift</p>
        </Reveal>

        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <Reveal>
              <h2 className="display text-3xl text-ink sm:text-4xl md:text-5xl">
                For the first time, small companies can have websites and systems
                built for exactly how they work.
              </h2>
            </Reveal>
          </div>

          <div className="space-y-6 text-base leading-relaxed text-muted md:col-span-5 md:pt-2">
            <Reveal delay={80}>
              <p>
                For years the deal was lopsided: rent your tools from a big
                platform, mold your business to their forms, and pay per seat
                forever. Anything custom—your own site, your own automations—meant
                hiring a dev team you couldn&apos;t justify.
              </p>
            </Reveal>
            <Reveal delay={160}>
              <p>
                That math has changed. The tools to design clean websites, wire
                systems together, and put automation and AI to work are finally
                within reach of a single sharp operator—so custom, fitted software
                is realistic for businesses your size, today.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <p className="text-ink">
                The companies that move first stop wrestling their tools and
                start compounding an advantage in systems and processes that no
                competitor can buy off a shelf.
              </p>
            </Reveal>
          </div>
        </div>

        <RentedVsBuilt />
      </div>
    </section>
  );
}
