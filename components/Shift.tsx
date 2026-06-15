import Reveal from "./Reveal";

export default function Shift() {
  return (
    <section id="shift" className="relative border-t border-line py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="marker mb-6">// The shift</p>
        </Reveal>

        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-7">
            <Reveal>
              <h2 className="display text-3xl text-ink sm:text-4xl md:text-5xl">
                For the first time, small companies can own software built for
                exactly how they work.
              </h2>
            </Reveal>
          </div>

          <div className="space-y-6 text-base leading-relaxed text-muted md:col-span-5 md:pt-2">
            <Reveal delay={80}>
              <p>
                For years the deal was simple and lopsided: rent your operations
                from a big platform, mold your business to its forms, and pay
                per seat forever. Building something that actually fit was a
                privilege reserved for companies with a dev team.
              </p>
            </Reveal>
            <Reveal delay={160}>
              <p>
                That math has changed. The tools to design clean databases, wire
                systems together, and put AI to work are finally within reach of
                a single sharp operator—which means custom, owned software is
                realistic for businesses your size, today.
              </p>
            </Reveal>
            <Reveal delay={240}>
              <p className="text-ink">
                The companies that move first stop paying rent on their own
                workflow—and start compounding the advantage of systems no
                competitor can buy off a shelf.
              </p>
            </Reveal>
          </div>
        </div>
      </div>
    </section>
  );
}
