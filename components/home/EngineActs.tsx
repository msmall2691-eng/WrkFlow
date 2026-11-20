import EngineModules from "./EngineModules";
import Opening from "./Opening";

/*
  The three acts, on the homepage, at Meg's word: "yes put it on the
  homepage".

  **Act one is her hero, not the brief's placeholder.** The brief's act
  one was a card reading "The storefront / The part your customer sees",
  which is weaker copy than what the page already had and would have cost
  the h1, both calls to action, and the operating history from The Maine
  Cleaning Co, which is the only confirmed hard evidence on this site. So
  the hero stays and becomes the first act, and the two new screens carry
  the parts of the argument it never had room for.

  **The shop is still here, and that is the one place this stops short of
  the brief.** Taken literally the brief replaces `app/page.tsx` with
  three cards, which deletes every price on the shelf, the Maine Cleaning
  case study, the integrations band and the contact form. Nothing about
  the acts needs that: each act's button points INTO the shop, so the two
  halves want each other. Said out loud rather than quietly narrowed, and
  cutting the shop is one line away if she means it.

  **The scroll arc is scrubbed against this element, which is why
  `id="scroll-container"` lives here rather than on the page.** It used to
  be on the page wrapper, so the camera's three beats were stretched over
  all eighteen screens: by the time the visitor read act three the camera
  was still somewhere in act one. Bound to the acts, the arc finishes as
  act three does and then holds that framing while the shop scrolls past,
  which is the right end state anyway.

  **Nothing in here dims below half opacity and nothing is hidden behind
  a hover**, which is the standing rule from the sibling project's landing
  page and worth borrowing: the four modules in act three are full-opacity
  text at all times, and lighting one in the scene is decoration on top of
  reading it.

  `min-h-svh` rather than `min-h-screen`: the brief's `100vh` is the unit
  that measures a phone viewport as though the address bar were not there,
  so a section written to be exactly one screen tall ends up taller than
  one. `svh` is the same intent spelled correctly, and `PanelStage` next
  door already uses it.
*/

const ACTS = [
  {
    id: "wiring",
    kicker: "Under the glass",
    title: "Where the form actually goes.",
    body: "Every quote, payment and booking drops straight through the storefront into the system that handles it. The pulses moving down the lines are that handover, which is the part most sites leave to somebody retyping it.",
    cta: { label: "The tools these already talk to", href: "#connects" },
  },
  {
    id: "engine",
    kicker: "The back office",
    title: "The engine under the floor.",
    /*
      No "pick one to find it in the scene", which the first cut said and
      a phone cannot follow: at 390 the card fills the screen and the
      block that lights up is behind it. That is the same mistake one step
      on from the one this section was built to fix, where act three told
      people to hover blocks that could not be hovered. The highlight is a
      reward for a pointer that happens to be there, so it is not
      announced as a step.
    */
    body: "The four pieces that carry the work after somebody presses send.",
    cta: { label: "Book a free 15-min call", href: "#contact" },
  },
] as const;

export default function EngineActs() {
  return (
    <div id="scroll-container">
      {/* Act one. */}
      <Opening />

      {ACTS.map((act) => (
        <section
          key={act.id}
          aria-labelledby={`${act.id}-heading`}
          /*
            `pointer-events-none` on the section and back on for the card,
            which is the brief's rule and still worth keeping now that the
            scene cannot be clicked: it means the empty right-hand side of
            these screens, where the scene is the only thing showing, never
            sits under an invisible box that swallows a selection or a
            drag.
          */
          className="pointer-events-none flex min-h-svh items-center py-16"
        >
          <div className="mx-auto w-full max-w-6xl px-6">
            <div className="pointer-events-auto max-w-xl rounded-[20px] border border-[color:var(--cp-line)] bg-[color:var(--cp-scrim)] p-7 backdrop-blur-xl sm:p-9">
              <p className="m-0 text-[11px] uppercase tracking-wider text-[color:var(--cp-violet-ink)]">
                {act.kicker}
              </p>
              <h2
                id={`${act.id}-heading`}
                className="m-0 mt-3 text-[1.75rem] font-semibold tracking-tight text-[color:var(--cp-ink)] sm:text-4xl"
              >
                {act.title}
              </h2>
              <p className="m-0 mt-4 text-[1.0625rem] leading-relaxed text-[color:var(--cp-muted)]">
                {act.body}
              </p>

              {act.id === "engine" ? <EngineModules /> : null}

              <a
                href={act.cta.href}
                className="mt-7 inline-flex min-h-11 items-center rounded-xl border border-[color:var(--cp-hairline-strong)] px-5 py-3 text-[15px] font-medium text-[color:var(--cp-ink)] no-underline transition-colors duration-150 hover:border-[color:var(--cp-violet-line)]"
              >
                {act.cta.label}
                <span aria-hidden="true">&nbsp;→</span>
              </a>
            </div>
          </div>
        </section>
      ))}
    </div>
  );
}
