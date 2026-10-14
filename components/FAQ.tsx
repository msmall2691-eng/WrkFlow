import Reveal from "./Reveal";

/*
  Renders inside the Pricing section rather than as a section of its own: the
  questions here are all price objections ("how long", "do I own the code",
  "what if I outgrow it"), and they do more work sitting under the numbers
  than they did as a tenth stop on the homepage.

  FAQ — the objections a buyer has right before Pricing. Native <details>
  for accessibility + no-JS. Copy is written in the studio voice — direct,
  no hedges, no "please don't hesitate to reach out." Edit QUESTIONS below.
*/
const QUESTIONS: { q: string; a: string }[] = [
  {
    q: "Can you help me switch platforms or move my data?",
    a: "Yes. We start by looking at the export from your current platform and the import options in the new one. I agree with you on which records will move, how the fields match, and what needs cleaning up, then check a sample before the full import and handover.",
  },
  {
    q: "Do you only work with cleaning companies?",
    a: "No. My own cleaning business is where this started, but I work with businesses in different industries. What matters is the website, system, or workflow you need help with.",
  },
  {
    q: "Can I hire you for a small project?",
    a: "Yes. It can be a form, a page update, a CRM setup, a data import, or one connection between tools. The smaller-project ranges above are estimates; you get a written scope and quote before anything starts.",
  },
  {
    q: "Can you connect the systems I already use?",
    a: "Yes — that is a big part of what I do. Tell me which tools you use and what you want to happen between them. I will check their APIs, calendar feeds, and other connection options before we agree on a scope.",
  },
  {
    q: "Do I need a whole new website or app?",
    a: "Not always. Your project might be one integration, a booking form, a client portal, or an improvement to an existing workflow. We start with what is working and what you need help with.",
  },
  {
    q: "How long does a website take?",
    a: "Usually 2-3 weeks from kickoff to launch. Bigger builds get scoped first, then a timeline.",
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
    a: "Small edits are on the Care Plan. Bigger changes get their own quote, so you know what you're paying before anything starts.",
  },
  {
    q: "How is this different from Squarespace or Wix?",
    a: "Squarespace and Wix can be a good fit for a simple site. A custom build gives us more control over your design, features, and connections to other systems. We will talk through what your business needs before choosing the approach.",
  },
  {
    q: "What if I outgrow the Care Plan?",
    a: "The next build gets scoped like a new project. Your current site keeps running until the new one is ready.",
  },
];

export default function FAQ() {
  return (
    <div id="faq" className="mt-14 scroll-mt-24">
        <Reveal>
          <h3 className="mb-5 font-mono text-[10px] uppercase tracking-[0.2em] text-faint">
            Common questions
          </h3>
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
  );
}

