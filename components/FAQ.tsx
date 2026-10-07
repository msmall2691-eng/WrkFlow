import Reveal from "./Reveal";
import { studioStats } from "@/lib/content";

/*
  FAQ — the questions someone asks right before they write in.

  This used to render inside the Pricing section, on the argument that every
  question here is a price objection answered best directly under the numbers.
  Pricing came off the site, so the FAQ is now a section in its own right —
  and it inherited two jobs from the section it outlived:

    · "What does it cost?" is answered here, honestly and without a number.
      Taking pricing down is not the same as refusing to say how it works,
      and the one thing a visitor will not forgive is being made to guess
      whether they can afford to even ask.
    · The four studioStats tiles moved here with it. They are the
      risk-reversal — free to scope, nothing binding, you own the code —
      which is exactly what has to be loud once there is no price on the page.

  Native <details> for accessibility + no-JS. Copy is written in the studio
  voice — direct, no hedges, no "please don't hesitate to reach out." Edit
  QUESTIONS below.
*/
const QUESTIONS: { q: string; a: string }[] = [
  {
    q: "What does it cost?",
    a: "It depends on what you're building — a marketing site and a dispatch system are not the same job, and quoting either one off a web page would be guessing. You get a written scope with a real number in it before anything starts, and the scoping itself is free and non-binding.",
  },
  {
    q: "How long does it take?",
    a: "A site is usually 2-3 weeks from kickoff to launch. Apps and internal tools get scoped first, then a timeline you can hold me to — and they land in working pieces, so you're using parts of it before the whole thing is done.",
  },
  {
    q: "Do you work with clients outside Maine?",
    a: "Yes. Most of it happens over video calls and shared docs — location doesn't matter.",
  },
  {
    q: "Do I own the code?",
    a: "Yes. Files, database, hosting keys, domain — all yours from day one. If you ever want to move on, everything moves with you.",
  },
  {
    q: "What if I need changes later?",
    a: "Small edits are quick, and can be handled on an ongoing basis so they're not your problem. Anything bigger gets scoped and quoted first, so you know the number before work starts.",
  },
  {
    q: "How is this different from Squarespace or Wix?",
    a: "Templated builders can only do what they were shipped with. This is built from scratch — shaped to whatever you actually need, including the parts that run after someone books.",
  },
  {
    q: "I already have a site. Can you just build the system behind it?",
    a: "Yes. Plenty of this work is the back half only — booking, scheduling, quoting, records — connected to a site that already exists and stays where it is.",
  },
];

export default function FAQ() {
  return (
    <section
      id="faq"
      className="relative overflow-hidden border-t border-line bg-[var(--section-alt2-bg)] py-20 scroll-mt-24 md:py-24"
    >
      <div
        aria-hidden="true"
        className="floaty-slow pointer-events-none absolute -left-24 top-24 h-72 w-72 rounded-full bg-signal/[0.05] blur-[130px]"
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <div className="mb-8 max-w-3xl">
          <Reveal>
            <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
              Common questions
            </p>
          </Reveal>
          <Reveal delay={80}>
            <h2 className="mt-3 display text-2xl text-ink sm:text-3xl md:text-4xl">
              The things worth knowing first.
            </h2>
          </Reveal>
        </div>

        {/* The promises. These have to be true of what the studio actually
            delivers — check lib/content.ts before changing one. */}
        <Reveal delay={120}>
          <div className="mb-8 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {studioStats.map((s) => (
              <div
                key={s.label}
                className="rounded-xl border border-line bg-surface/40 px-4 py-3.5"
              >
                <span className="display text-xl text-ink">{s.value}</span>
                <span className="mt-0.5 block font-mono text-[10px] uppercase tracking-widest text-faint">
                  {s.label}
                </span>
              </div>
            ))}
          </div>
        </Reveal>

        <div className="divide-y divide-line rounded-2xl border border-line bg-surface/40">
          {QUESTIONS.map((item, i) => (
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
  );
}
