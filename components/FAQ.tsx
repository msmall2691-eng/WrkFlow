
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
    a: "Yes. Each migration starts with the export from your current platform and the import options in the new one. The scope covers which records will move, how the fields match, and what needs cleaning up, with a sample checked before the full import and handover.",
  },
  {
    q: "Do you only work with cleaning companies?",
    a: "No. It grew out of running one, which is why the examples here are cleaning and rentals. A quote form and a CRM behave the same whichever trade is using them.",
  },
  {
    q: "Can I hire you for a small project?",
    a: "Yes. It can be a form, a page update, a CRM setup, a data import, or one connection between tools. The smaller-project ranges above are estimates; you get a written scope and quote before anything starts.",
  },
  {
    q: "Can you connect the systems I already use?",
    a: "Yes. Name the tools and what should happen between them. Whether they can actually do it gets checked before you are quoted, because some platforms will not open up at all.",
  },
  {
    q: "Do I need a whole new website or app?",
    a: "Often not. It might be one form, one integration, or one page. The cheapest version that solves it is the one to start with.",
  },
  {
    q: "How long does a website take?",
    a: "Usually 2-3 weeks from kickoff to launch. Bigger builds get scoped first, then a timeline.",
  },
  {
    q: "Do you work with clients outside Maine?",
    a: "Yes. Most of it happens over video calls and shared docs, so location doesn't matter.",
  },
  {
    q: "Do I own the code?",
    a: "Yes. Files, database, hosting keys, domain. All yours from day one. If you ever want to move on, everything moves with you.",
  },
  {
    q: "What if I need changes later?",
    a: "Small edits are on the Care Plan. Bigger changes get their own quote, so you know what you're paying before anything starts.",
  },
  {
    q: "How is this different from Squarespace or Wix?",
    /* "gives us more control" was both a voice violation and factually
       backwards: the control a custom build buys belongs to the client. */
    a: "Squarespace and Wix are a good fit for a simple site. They stop being one when you need a quote form wired into your CRM, or a booking step that knows what is actually open.",
  },
  {
    q: "What if I outgrow the Care Plan?",
    a: "The next build gets scoped like a new project. Your current site keeps running until the new one is ready.",
  },
];

export default function FAQ() {
  return (
    <div id="faq" className="mt-14 scroll-mt-24">
        {/* This was a 10px mono-caps eyebrow, but it is the section's actual
            heading — nothing else names this block. Promoted to read as one. */}
        <h3 className="display mb-5 text-xl text-ink">Common questions</h3>

        <div className="divide-y divide-line rounded-2xl border border-line bg-surface/40">
          {QUESTIONS.map((item) => (
            <details key={item.q} className="group">
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
          ))}
        </div>
    </div>
  );
}

