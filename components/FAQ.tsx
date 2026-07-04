import Reveal from "./Reveal";

/*
  FAQ — the objections a buyer has right before Pricing. Native <details>
  for accessibility + no-JS. Copy is written in the studio voice — direct,
  no hedges, no "please don't hesitate to reach out." Edit QUESTIONS below.
*/
const QUESTIONS: { q: string; a: string }[] = [
  {
    q: "How long does a Starter site take?",
    a: "Usually 2-3 weeks from kickoff to launch. Bigger builds get scoped first, then a timeline.",
  },
  {
    q: "Do you work with clients outside Maine?",
    a: "Yes. M Studio is based in Portland but works with clients everywhere — most of it happens over video calls and shared docs.",
  },
  {
    q: "Do I own the code?",
    a: "Yes. Files, database, hosting keys, domain — all yours from day one. If you ever want to move on, everything moves with you.",
  },
  {
    q: "What if I need changes later?",
    a: "Small edits are on the Care Plan. Bigger changes get their own quote, so you know what you're paying before anything starts.",
  },
  {
    q: "How is this different from Squarespace or Wix?",
    a: "Templated builders can only do what they were shipped with. A Starter site is built from scratch — shaped to whatever you actually need.",
  },
  {
    q: "What if I outgrow the Care Plan?",
    a: "The next build gets scoped like a new project. Your current site keeps running until the new one is ready.",
  },
];

export default function FAQ() {
  return (
    <section
      id="faq"
      className="relative overflow-hidden border-t border-line py-20 md:py-24"
    >
      <div className="relative mx-auto max-w-4xl px-6">
        <div className="mb-10 max-w-3xl">
          <Reveal>
            <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
              FAQ
            </p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="display text-2xl text-ink sm:text-3xl md:text-4xl">
              Common questions.
            </h2>
          </Reveal>
        </div>

        <div className="divide-y divide-line rounded-2xl border border-line bg-surface/40">
          {QUESTIONS.map((item, i) => (
            <Reveal key={item.q} delay={i * 40}>
              <details className="group">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-5 text-left text-base font-medium text-ink transition-colors hover:text-signal md:p-6 md:text-lg [&::-webkit-details-marker]:hidden">
                  <span>{item.q}</span>
                  <span
                    aria-hidden="true"
                    className="inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-line font-mono text-[13px] leading-none text-faint transition-all duration-300 group-hover:border-signal/50 group-hover:text-signal group-open:rotate-45"
                  >
                    +
                  </span>
                </summary>
                <div className="px-5 pb-5 pt-0 text-sm leading-relaxed text-muted md:px-6 md:pb-6 md:text-base">
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
