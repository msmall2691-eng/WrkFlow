import { integrations, provenIn } from "@/lib/integrations";
import StackedHeading from "@/components/StackedHeading";

/*
  WhatConnects — the integrations evidence, cut by tool rather than by
  project.

  **The gap it fills, measured rather than felt.** ServiceRouter counts the
  work filed under each of the four services, straight from `work`. Those
  counts came to websites 4, software 3, integrations 1, leads 1 — so the
  door Meg names first when asked what she sells opened onto the thinnest
  evidence on the page. Not because the work is thin: eight integrations
  were already recorded in `brightbase.integrations`, and a visitor could
  only reach them by clicking into a case study the page had not yet given
  them a reason to click into.

  A buyer asking "will it work with the thing I already pay for" is not
  asking about a project, which is why filing the evidence by project hid
  it from them. This is the same evidence, indexed the way the question
  gets asked.

  **It is not a wall of logos and it must never become one**, which is what
  `lib/integrations.ts` and its test are for: every tile cites the exact
  record elsewhere in the repo that backs it, and the test fails naming any
  that does not resolve. A familiar logo is the cheapest fake proof on a
  portfolio site, and the first rule in CLAUDE.md is that proof is not
  invented.

  **It names projects that are argued elsewhere on the page, and that does
  not break the no-repetition rule.** That rule is asserted over exactly
  two sections, `#work` and MoreWork, because those are the two that argue
  a project: a tag, a blurb, a screenshot, a way in. Naming BrightBase as
  the place Stripe is running is attribution, not a second argument for
  BrightBase, and a visitor reading "Stripe, running in BrightBase" is
  being told something new rather than the same thing twice. The scoping
  was already right when this arrived; it is written down here so the next
  reader can see the distinction was considered rather than dodged.

  **No links on the project names, deliberately.** Eight tiles naming two
  projects each would add sixteen small links to a page whose 390px tap
  targets are swept by a test, and the last time this page grew a crop of
  13px links eight of them rendered under the 24px minimum. Every project
  named here is already a link somewhere above: BrightBase and the Maine
  Cleaning work in OneJob, linx and the rest in MoreWork. The job of this
  section is to answer a yes-or-no question with evidence attached, not to
  be another way into the same four pages.
*/
export default function WhatConnects() {
  if (integrations.length === 0) return null;

  return (
    <section
      id="connects"
      aria-labelledby="connects-heading"
      className="border-t border-[color:var(--cp-line)] py-12 md:py-16"
    >
      <div className="mx-auto max-w-6xl px-6">
        <StackedHeading id="connects-heading" lead="The tools these" trail="already talk to." />
        <p className="mt-3 max-w-xl text-[1rem] leading-relaxed text-[color:var(--cp-muted)]">
          Every one is running in a system named beside it. Nothing on this
          list is a plan.
        </p>

        <ul className="mt-8 grid grid-cols-2 gap-2.5 lg:grid-cols-4">
          {integrations.map((i) => {
            const running = provenIn(i);
            return (
              <li key={i.name} className="cp-tile flex min-w-0 flex-col p-3.5">
                <h3 className="m-0 text-[15px] font-semibold text-[color:var(--cp-ink)]">
                  {i.name}
                </h3>
                <p className="m-0 mt-1.5 text-[13.5px] leading-relaxed text-[color:var(--cp-muted)]">
                  {i.what}
                </p>
                {/*
                  `mt-auto` so the attribution sits on the baseline of every
                  tile in a row, whatever the length of the line above it.
                  Without it a four-up row of uneven copy puts this line at
                  four different heights, which reads as four unrelated
                  cards rather than one list.
                */}
                {running.length > 0 ? (
                  <p className="m-0 mt-auto pt-3 text-[11px] uppercase tracking-wider text-[color:var(--cp-faint)]">
                    Running in {running.map((w) => w.title).join(" · ")}
                  </p>
                ) : null}
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
