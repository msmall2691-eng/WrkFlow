"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import AutomationCost from "./AutomationCost";
import SiteCheck from "./SiteCheck";
import SignatureMaker from "./SignatureMaker";
import QRMaker from "./QRCode";
import QuoteCalc from "./QuoteCalc";
import InvoiceMaker from "./InvoiceMaker";
import VCard from "./VCard";
import UTMBuilder from "./UTMBuilder";
import Reveal from "./Reveal";
import { trackTool } from "@/lib/track";
import { GROUPS, OFFSITE_TOOLS, TOOLS, type Tool } from "@/lib/tools";
import { toolsPage } from "@/lib/content";

/*
  Playground — the free tools, as a directory and one open tool.

  Only /tools renders it. The comment here used to say it lived on the
  homepage at `id="tools"`, which stopped being true when the tools got
  their own route and again when the approved homepage replaced the
  storefront; the id is kept because it is a cheap anchor and because
  `MarketCatalog` and old links still carry `/#tools`.

  ───────────────────────────────────────────────────────────────────────
  Nov 28 2026 — the eight tools are visible before they are clicked.

  **What was wrong is measurable rather than a matter of taste.** At 1440
  this page was 2.7 screens, two sections, 35 buttons, and zero `<h2>`:
  nothing on it was a heading except the page title. The eight tools were
  drawn as a row of bare pills carrying a label and nothing else, with one
  sentence underneath describing whichever pill was selected. So a visitor
  could see that eight things existed and could not see what any of the
  other seven did without clicking it, reading, and clicking the next —
  eight round trips to answer the one question they arrived with. The
  strongest free thing on the site was a filing cabinet with the drawers
  shut.

  **What it is now is a list that answers that question on sight.** Every
  tool carries its own name and its own sentence, all of them on screen at
  once, in three group panels that say what each group is for. Clicking
  one opens it below. The data is unchanged: both the label and the blurb
  were already in `lib/tools.ts` and the page simply was not showing them.

  Three things that look like decoration and are not:

  * **The group names are `<h3>`s under the band's `<h2>`**, so the page
    has a heading outline a screen reader or a search engine can read.
    A tool's own name is deliberately *not* a heading: it is the label of
    a button, and a heading inside a control reads as neither.

  * **The ninth tool is a link, not a ninth button.** `OFFSITE_TOOLS`
    carries the Turnover Planner, which has a route of its own and so has
    never been in the switcher — and so was missing from the page named
    Free tools. It sits in its group beside the rest and says on its face
    that it opens elsewhere.

  * **Selecting scrolls the open tool into view, but only when it is not
    already there.** The list is taller than the old pill row, so at some
    widths the tool opens below the fold and the click looks like it did
    nothing. Jumping every time is worse: a visitor who clicks a second
    tool while looking straight at the first gets the page yanked for no
    reason. Reduced motion gets the same jump with no animation, which is
    the end state the preference asks for rather than the effect removed.
*/

export default function Playground() {
  /*
    **The page opens on the QR code, and it used to open on the quote.**

    Not a taste call. Meg asked for prices off the site until the setup
    is settled, and `QuoteCalc` renders a rate card the moment it mounts:
    an estimated range, a line-item base, and four priced add-ons, all
    before a visitor has typed anything. As the default tool that put
    eight dollar amounts on /tools at first paint, which is the site
    quoting rather than a visitor calculating. The quote tool is not
    removed and is not changed — the numbers a visitor asks for are the
    tool working — it simply is not what the page says on arrival.

    The QR code replaces it because it needs no input, shows no money and
    hands back a file, which is the argument this page is making.
    `/tools?tool=quote` still opens it directly, as every deep link does.
  */
  const [tool, setTool] = useState<Tool>("qr");
  const activeTool = TOOLS.find((t) => t.id === tool)!;

  const bench = useRef<HTMLElement>(null);
  /* Set by a click, read by the effect below. A ref rather than state
     because it must not cause a render of its own, and because the deep
     link on mount must not be mistaken for a click: arriving at
     /tools?tool=qr should land at the top of the page, not halfway down
     it. */
  const clicked = useRef(false);

  // Track the default tool as "opened" once on mount, then again on every
  // switch — so Meg can see which free tools get looked at.
  useEffect(() => {
    // /tools?tool=sitecheck opens that tool directly — the homepage panel,
    // the catalog's chips and ⌘K link straight to a tool rather than to
    // the top of this page.
    let start: Tool = tool;
    try {
      const q = new URLSearchParams(window.location.search).get("tool");
      const hit = TOOLS.find((t) => t.id === q);
      if (hit) {
        start = hit.id;
        setTool(hit.id);
      }
    } catch {
      /* ignore */
    }
    trackTool(start, "opened");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /* After the new tool has rendered, not during the click, so the jump
     lands on the height the tool actually takes. */
  useEffect(() => {
    if (!clicked.current) return;
    clicked.current = false;
    const el = bench.current;
    if (!el) return;

    const top = el.getBoundingClientRect().top;
    /* Already where the visitor is looking: leave the page alone. */
    if (top >= 0 && top < window.innerHeight * 0.4) return;

    el.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  }, [tool]);

  function selectTool(id: Tool) {
    clicked.current = true;
    setTool(id);
    trackTool(id, "opened");
  }

  return (
    <>
      {/* ── the directory ──────────────────────────────────────────── */}
      <section id="tools" className="border-b border-[var(--cp-line)] py-10 md:py-12">
        <div className="mx-auto max-w-6xl px-6">
          <Reveal className="max-w-2xl">
            {/* No eyebrow here: see the note in lib/content.ts. */}
            <h2 className="display-serif text-2xl text-ink sm:text-3xl md:text-4xl">
              {toolsPage.index.heading}
            </h2>
            <p className="mt-4 text-[1.0625rem] leading-relaxed text-muted">
              {toolsPage.index.lede}
            </p>
          </Reveal>

          <Reveal delay={60}>
            <div className="mt-10 grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {GROUPS.map((g) => (
                <div
                  key={g}
                  className="cp-tile rounded-2xl border border-line p-2 sm:p-2.5"
                >
                  <h3 className="px-3 pb-1 pt-2.5 text-[0.6875rem] font-semibold uppercase tracking-[0.14em] text-faint">
                    {g}
                  </h3>
                  <ul className="flex flex-col">
                    {TOOLS.filter((t) => t.group === g).map((t) => {
                      const on = tool === t.id;
                      return (
                        <li key={t.id}>
                          <button
                            type="button"
                            onClick={() => selectTool(t.id)}
                            /* `aria-pressed`, because this is a control
                               that stays down rather than a link: the
                               open tool is the one still pushed in. */
                            aria-pressed={on}
                            className={`block w-full rounded-xl px-3 py-3 text-left transition-colors ${
                              on
                                ? "bg-signal/10"
                                : "hover:bg-[var(--cp-fill)]"
                            }`}
                          >
                            <span className="flex items-baseline justify-between gap-3">
                              <span
                                className={`text-[0.9375rem] font-semibold ${
                                  on ? "text-signal" : "text-ink"
                                }`}
                              >
                                {t.label}
                              </span>
                              <span
                                aria-hidden="true"
                                className={`shrink-0 text-xs ${
                                  on ? "text-signal" : "text-faint"
                                }`}
                              >
                                {on ? "Open" : "→"}
                              </span>
                            </span>
                            <span className="mt-1 block text-[0.8125rem] leading-snug text-muted">
                              {t.blurb}
                            </span>
                            {/* What they walk away with, on the card
                                rather than inside the tool. See the
                                `takeaway` note in lib/tools.ts. */}
                            <span className="mt-1.5 block text-[0.6875rem] uppercase tracking-[0.1em] text-faint">
                              {t.takeaway}
                            </span>
                          </button>
                        </li>
                      );
                    })}

                    {OFFSITE_TOOLS.filter((t) => t.group === g).map((t) => (
                      <li key={t.key}>
                        <Link
                          href={t.href}
                          className="block w-full rounded-xl px-3 py-3 transition-colors hover:bg-[var(--cp-fill)]"
                        >
                          <span className="flex items-baseline justify-between gap-3">
                            <span className="text-[0.9375rem] font-semibold text-ink">
                              {t.label}
                              {/* The arrow beside this is decorative,
                                  so the fact that this row leaves the
                                  page has to reach a screen reader some
                                  other way. */}
                              <span className="sr-only"> (opens its own page)</span>
                            </span>
                            {/* "↗", not "→": this is the one row in the
                                list that leaves the page, and the glyph
                                is a quieter way to say so than a second
                                line of text under a card that already
                                carries two. */}
                            <span aria-hidden="true" className="shrink-0 text-xs text-faint">
                              ↗
                            </span>
                          </span>
                          <span className="mt-1 block text-[0.8125rem] leading-snug text-muted">
                            {t.blurb}
                          </span>
                          <span className="mt-1.5 block text-[0.6875rem] uppercase tracking-[0.1em] text-faint">
                            {t.takeaway}
                          </span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── the open tool ──────────────────────────────────────────── */}
      <section
        ref={bench}
        id="open"
        /* Clear of nothing in particular: this page's header is in flow.
           The margin is so a jump does not land the heading hard against
           the top of the window. */
        className="scroll-mt-6 border-b border-[var(--cp-line)] py-14 md:py-16"
      >
        <div className="mx-auto max-w-6xl px-6">
          {/* The group is the eyebrow, so the band says where in the list
              above this one came from. Data, not a second label. */}
          <p className="text-xs font-medium uppercase tracking-[0.15em] text-faint">
            {activeTool.group}
          </p>
          {/*
            **The open tool's name is an `<h2>` and it changes with the
            tool**, which is the whole of "you are here" on a page whose
            body swaps under a click. Before this the page's only heading
            was its title, so a visitor who had scrolled past the list had
            nothing on screen naming what they were filling in.
          */}
          <h2 className="display-serif mt-3 text-2xl text-ink sm:text-3xl md:text-4xl">
            {activeTool.label}
          </h2>
          {/* The blurb is deliberately not repeated here. It is on the
              card the visitor just clicked, still on screen above, and
              saying it twice is the clutter the redesign was asked to
              remove. The name and the group are the "you are here". */}

          <div className="mt-8">
            {tool === "sitecheck" && <SiteCheck />}
            {tool === "quote" && <QuoteCalc />}
            {tool === "invoice" && <InvoiceMaker />}
            {tool === "sig" && <SignatureMaker />}
            {tool === "vcard" && <VCard />}
            {tool === "qr" && <QRMaker />}
            {tool === "utm" && <UTMBuilder />}
            {tool === "cost" && <AutomationCost />}
          </div>

          {/* Soft funnel — one-sentence bridge from free tool → the paid work */}
          <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-line bg-surface/60 px-4 py-3 text-sm">
            <span className="text-muted">{activeTool.nudge.line}</span>
            <a
              href={activeTool.nudge.href}
              className="font-semibold text-signal transition-opacity hover:opacity-80"
            >
              {activeTool.nudge.cta} →
            </a>
          </div>
        </div>
      </section>
    </>
  );
}
