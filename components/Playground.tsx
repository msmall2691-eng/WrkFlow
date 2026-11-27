"use client";

import { useEffect, useState } from "react";
import AutomationCost from "./AutomationCost";
import SiteCheck from "./SiteCheck";
import SignatureMaker from "./SignatureMaker";
import QRMaker from "./QRCode";
import QuoteCalc from "./QuoteCalc";
import InvoiceMaker from "./InvoiceMaker";
import VCard from "./VCard";
import UTMBuilder from "./UTMBuilder";
import { trackTool } from "@/lib/track";
import { TOOLS, type Tool, type Group } from "@/lib/tools";

/*
  Playground — a small set of genuinely useful, free tools. Each one gives the
  visitor something to take with them (a report, a signature, a QR, a quote, an invoice).

  Lives on the homepage (id="tools" — CommandPalette's "Free tools" command and
  WorkflowSpine's rail scroll here). MarketCatalog's "Use it free" links point
  at /#tools too.
*/

const GROUPS: Group[] = ["Win & bill", "Brand & share", "Site & ops"];

export default function Playground() {
  const [tool, setTool] = useState<Tool>("quote");
  const activeTool = TOOLS.find((t) => t.id === tool)!;

  // Track the default tool as "opened" once on mount, then again on every
  // tab switch — so Meg can see which free tools get looked at.
  useEffect(() => {
    // /tools?tool=sitecheck opens that tool directly — the homepage panel and
    // ⌘K link straight to a tool rather than to the top of this page.
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

  function selectTool(id: Tool) {
    setTool(id);
    trackTool(id, "opened");
  }

  return (
    <section id="tools" className="relative overflow-hidden py-10 md:py-14">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-signal/[0.05] blur-[130px]"
      />
      <div className="relative mx-auto max-w-6xl px-6">

        {/* Tabs — grouped; each tool is its own clean pill */}
                  <div className="mt-8 flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-3">
              {GROUPS.map((g) => (
                <div key={g} className="flex flex-col gap-2.5">
                  <span className="text-xs font-medium text-faint">{g}</span>
                  <div className="flex flex-wrap gap-2">
                    {TOOLS.filter((t) => t.group === g).map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => selectTool(t.id)}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                          tool === t.id
                            ? "border-gold/40 bg-gold/15 text-gold"
                            : "border-line bg-surface text-muted hover:border-signal/40 hover:text-ink"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-sm text-muted">{activeTool.blurb}</p>
          </div>

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
  );
}
