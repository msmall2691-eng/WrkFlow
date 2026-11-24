import type { ReactNode } from "react";
import PanelHeader from "./panel/PanelHeader";
import Footer from "./Footer";
import CommandPalette from "./CommandPalette";
import StackedHeading from "./StackedHeading";

/*
  Shared shell for the legal pages (Privacy, Terms). Keeps both documents
  visually consistent with the rest of the site and gives them readable,
  narrow body type.

  V2 pass. Converting this one file converts both legal pages, which is the
  whole reason the shell exists: they are the same document in two voices and
  neither should drift from the other or from the site around them.

  The usual wrapper, not a rewrite: `.cp` redefines --color-base, --color-ink,
  --color-muted, --color-line and --section-alt-bg in its own scope, so H2, P,
  UL and Disclaimer below take the V2 palette without being touched. Two of
  them lean on accent tokens that needed the globals.css fix shipped in #128:
  UL's `marker:text-signal` and Disclaimer's gold border and tint, both of
  which rendered a Daylight-tuned colour inside the near-black panel before
  that landed.

  `bookHref` is set because neither legal page renders Contact, so the
  header's "Book a free call" would otherwise change the hash and do nothing.
  e2e/smoke.spec.ts covers both routes.
*/
export function LegalShell({
  title,
  updated,
  intro,
  children,
}: {
  /* Still accepted (both legal pages pass it) but no longer rendered —
     the mono-caps "// kicker" eyebrow retired with the rest of them. */
  kicker: string;
  title: string;
  updated: string;
  intro?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="cp">
      <div className="relative overflow-hidden">
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
          <span className="cp-aurora cp-a1" />
          <span className="cp-aurora cp-a2" />
        </div>

        <div className="relative z-10">
          <PanelHeader bookHref="/?offer=call#contact" />
        </div>

        {/* No pt-16: that cleared the fixed <Nav>, and PanelHeader is in flow. */}
        <main className="relative z-10">
        <section className="border-b border-[var(--cp-line)] py-14 md:py-20">
          <div className="mx-auto max-w-3xl px-6">
            {/*
              Still `display-serif` (Fraunces), for the same reason as the h1
              on /services: the heading face on these pages is a question
              about Meg's brand to settle once for the whole site, not page by
              page. The palette converts; the typeface does not.
            */}
            <StackedHeading as="h1" face="serif" lead={title} />
            <p className="mt-5 text-xs text-faint">
              Last updated · {updated}
            </p>
            {intro && (
              <div className="mt-6 text-[1rem] leading-relaxed text-muted">{intro}</div>
            )}
          </div>
        </section>

        {/*
          The body sits on the flat ground, not over the aurora. Same call as
          the tool grid on /tools: this is the densest small text on the site
          and --color-faint is tuned to clear 4.5:1 on #08070c specifically.
        */}
        <section className="relative bg-[var(--color-base)] py-12 md:py-16">
          <div className="mx-auto max-w-3xl px-6">{children}</div>
        </section>
        </main>
      </div>
      <Footer />
      <CommandPalette />
    </div>
  );
}

export function H2({ children }: { children: ReactNode }) {
  return (
    <h2 className="display mt-12 text-xl text-ink sm:text-2xl first:mt-0">{children}</h2>
  );
}

export function P({ children }: { children: ReactNode }) {
  return <p className="mt-4 text-[15px] leading-relaxed text-muted">{children}</p>;
}

export function UL({ children }: { children: ReactNode }) {
  return (
    <ul className="mt-4 list-disc space-y-2 pl-5 text-[15px] leading-relaxed text-muted marker:text-signal">
      {children}
    </ul>
  );
}

export function Disclaimer({ children }: { children: ReactNode }) {
  return (
    <div className="mb-10 rounded-xl border border-gold/30 bg-gold/[0.06] p-5 text-sm leading-relaxed text-muted">
      {children}
    </div>
  );
}
