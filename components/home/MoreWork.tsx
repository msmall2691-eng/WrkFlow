import Link from "next/link";
import LiveTile from "../panel/LiveTile";
import { work, type WorkItem } from "@/lib/content";
import StackedHeading from "./StackedHeading";

/*
  MoreWork — everything the worked example above does not already cover,
  once each, in one list.

  **The one rule this section exists to keep: nothing on this page appears
  twice.** The old homepage showed four projects in three separate blocks,
  with sentences copied verbatim between two of them. The fix is not a
  tidier card — it is that OneJob argues one project and this lists the
  rest, and the two sets do not overlap.

  `ALREADY_SHOWN` is that boundary, and it is four titles rather than one
  because the worked example covers four rows of `work`:

    · The Maine Cleaning Co. — the case study it is built from
    · BrightBase            — the system behind that site, linked from it
    · Turnover scheduling   — one of its four build steps, with its capture
    · Instant Estimate      — another of them, with its capture

  Listing any of those here would put the same screenshot on the page twice,
  which is precisely the complaint. `e2e/smoke.spec.ts` asserts every project
  title appears exactly once on the homepage, because this is an editorial
  list and an editorial list is the kind of thing that quietly regrows.

  **The live readout sits beside it: five independent public feeds merged
  into one screen, with the sources named so the claim is checkable. It is
  the only other moving thing on the page.**

  It used to be justified here as the page's integrations evidence, on the
  grounds that excluding Turnover scheduling left "getting your tools to
  talk" with nothing behind it. That was true and it was thin, and it is no
  longer either: `WhatConnects` below carries eight integrations that are
  running in named systems. The readout earns its place as a live thing
  built from public feeds, which is what it actually is, rather than as a
  stand-in for proof that was missing.
*/

const ALREADY_SHOWN = [
  "The Maine Cleaning Co.",
  "BrightBase",
  "Turnover scheduling",
  "Instant Estimate",
];

const REST: WorkItem[] = work.filter((w) => !ALREADY_SHOWN.includes(w.title));

/** Where a card goes: its own case study when it has one, else the live site. */
function destination(w: WorkItem): { href: string; label: string; external: boolean } | null {
  if (w.caseStudy) return { href: `/work/${w.caseStudy}`, label: "How it was built", external: false };
  if (w.page) return { href: w.page, label: "Take a look", external: false };
  if (w.url) return { href: w.url, label: "Open it", external: true };
  return null;
}

export default function MoreWork() {
  if (REST.length === 0) return null;

  return (
    <section
      aria-labelledby="more-work-heading"
      className="border-t border-[color:var(--cp-line)] py-16 md:py-20"
    >
      <div className="mx-auto max-w-6xl px-6">
        <StackedHeading id="more-work-heading" lead="The rest" trail="of it." />
        {/*
          No count and no "for clients" here. Two of these four are Meg's own
          (the rental's welcome book, and linx), so "for other people" would
          be untrue of half the list — and each card's own tag already says
          whose it is, in the vocabulary lib/content.ts already uses. A count
          would drift the moment she ships the next one.
        */}
        <p className="mt-3 max-w-xl text-[1rem] leading-relaxed text-[color:var(--cp-muted)]">
          Each one is open, so you can go and look rather than take a word for
          it.
        </p>

        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {/*
            No thumbnails on these rows, and that is a decision rather than
            an omission.

            The first cut put an 80px capture beside each one. Two problems,
            both visible the moment it rendered: at that size The Remote
            Admin and linx were unreadable smudges, so they were decoration
            pretending to be evidence; and The Keystone House has no `shot`
            at all (it is `live`, previewed by iframe elsewhere), so one row
            in four had a ragged left edge. Inventing a capture for it is out
            of the question, and growing them all back to card-top heroes
            rebuilds the card grid this section was created to replace.

            The page spends its evidence in one place by design: four large,
            real screens in OneJob directly above. This is the list of
            everything else, and a list is allowed to be a list.
          */}
          <ul className="grid gap-4 sm:grid-cols-2 lg:col-span-2 lg:content-start">
            {REST.map((w) => {
              const to = destination(w);
              return (
                <li key={w.title} className="cp-tile flex min-w-0 gap-4 p-5">
                  <div className="flex min-w-0 flex-col">
                    <span className="text-[11px] uppercase tracking-wider text-[color:var(--cp-faint)]">
                      {w.tag}
                    </span>
                    <h3 className="m-0 mt-1 text-[15px] font-semibold text-[color:var(--cp-ink)]">
                      {w.title}
                    </h3>
                    <p className="m-0 mt-1.5 text-[13.5px] leading-relaxed text-[color:var(--cp-muted)]">
                      {w.blurb}
                    </p>
                    {/* `inline-flex` + `py-1.5`, so a 13px link is a 28px
                        tap target rather than a 16px one. These are the
                        only way into three of these four projects on a
                        phone. */}
                    {to ? (
                      <span className="mt-2">
                        {to.external ? (
                          <a
                            href={to.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="inline-flex items-center py-1.5 text-[13px] font-semibold text-[color:var(--cp-violet-ink)] no-underline hover:opacity-80"
                          >
                            {to.label} ↗
                          </a>
                        ) : (
                          <Link
                            href={to.href}
                            className="inline-flex items-center py-1.5 text-[13px] font-semibold text-[color:var(--cp-violet-ink)] no-underline hover:opacity-80"
                          >
                            {to.label} →
                          </Link>
                        )}
                      </span>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>

          {/*
            The integrations evidence. See the header note.

            `self-start`, not stretched to the list's height. Stretched, the
            tile's `mt-auto` on the tide row pushed it to the bottom of a
            445px box and opened a 150px void in the middle of it, which
            read as a loading state rather than as a calm one.
          */}
          <div className="flex min-w-0 self-start lg:col-span-1 [&>*]:flex-1">
            <LiveTile />
          </div>
        </div>
      </div>
    </section>
  );
}
