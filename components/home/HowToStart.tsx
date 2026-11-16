import Link from "next/link";

/*
  HowToStart — the last beat, and the one the old homepage skipped.

  The V2 panel went headline → screenshots → project names → free tools →
  weather → contact form. A visitor who had decided they were interested
  arrived at a form with no idea what pressing send would set in motion, how
  long it takes, or what it costs to find out. The three most common reasons
  somebody does not fill in a form on a site like this are "I don't know
  what happens next", "I don't want a sales call" and "I can't afford to
  ask", and nothing on the page answered any of them.

  So this says it in three lines and then shows the four promises from
  `studioStats`, which are M Studio's own commitments about its own process
  rather than claims about results. They were sitting beside the pricing
  cards on /services, which is the page somebody reaches after they have
  already decided to enquire.

  The free tools are the escape hatch rather than a tile competing for
  attention up top: somebody who is not ready to talk gets one line and a
  link, which is the right weight for it.

  No price here on purpose. CLAUDE.md's Nov 2026 note on Pricing says the
  risk Meg actually has is a small local business reading a four-figure
  number and never asking, so the number lives on /services behind "let's
  scope it", and this page sells the scoping instead.
*/

const STEPS = [
  {
    n: "01",
    title: "Say what is not working",
    body: "The form below, about two minutes. A call is optional and not the first step.",
  },
  {
    n: "02",
    title: "A written scope comes back",
    body: "Within a day: what gets built, what it costs, and what it does not include.",
  },
  {
    n: "03",
    title: "You decide from there",
    body: "Scoping costs nothing and commits you to nothing. The code is yours either way.",
  },
] as const;

export default function HowToStart() {
  return (
    <section
      aria-labelledby="start-heading"
      className="border-t border-[color:var(--cp-line)] py-16 md:py-20"
    >
      <div className="mx-auto max-w-6xl px-6">
        <h2
          id="start-heading"
          className="m-0 text-[1.75rem] font-semibold tracking-tight text-[color:var(--cp-ink)] sm:text-4xl"
        >
          How a project starts.
        </h2>

        <ol className="mt-10 grid gap-8 md:grid-cols-3">
          {STEPS.map((s) => (
            <li key={s.n} className="flex flex-col">
              <span className="font-mono text-[12px] tracking-[0.1em] text-[color:var(--cp-faint)]">
                {s.n}
              </span>
              <h3 className="m-0 mt-2 text-[1.0625rem] font-semibold text-[color:var(--cp-ink)]">
                {s.title}
              </h3>
              <p className="m-0 mt-2 text-[14.5px] leading-relaxed text-[color:var(--cp-muted)]">
                {s.body}
              </p>
            </li>
          ))}
        </ol>

        {/* The 24 hrs / 3 / $0 / 100% tiles used to sit here and again in
            Pricing on /catalog; the buyer review flagged the repeat. They
            stay in one place, the pricing section. */}
        <p className="mt-8 text-[14.5px] text-[color:var(--cp-muted)]">
          Not ready to talk?{" "}
          <Link
            href="/tools"
            className="font-semibold text-[color:var(--cp-violet-ink)] no-underline hover:opacity-80"
          >
            Try the free tools on this site
          </Link>{" "}
          first. No sign-up, nothing to install.
        </p>
      </div>
    </section>
  );
}
