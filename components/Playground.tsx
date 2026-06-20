"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import QuoteCalc from "./QuoteCalc";
import AutomationCost from "./AutomationCost";
import InvoiceMaker from "./InvoiceMaker";
import SiteCheck from "./SiteCheck";
import IntegrationMapper from "./IntegrationMapper";
import BookingDemo from "./BookingDemo";
import WorkflowSim from "./WorkflowSim";

/*
  Playground — one tidy "try it live" hub. A curated set of working tools, plus
  a separate mode to watch a real automation run. Kept deliberately small.
*/

type Tool = "sitecheck" | "map" | "booking" | "cost" | "quote" | "invoice";

const TOOLS: { id: Tool; label: string; blurb: string }[] = [
  { id: "sitecheck", label: "Website check", blurb: "Paste any URL → real Lighthouse speed, SEO & accessibility scores." },
  { id: "map", label: "Integration map", blurb: "Pick the tools you use → see how they link and what gets automated." },
  { id: "booking", label: "Booking demo", blurb: "A real scheduling flow → pick a slot, get a calendar invite." },
  { id: "cost", label: "Cost of manual work", blurb: "Hours + people → the yearly cost, and how fast automation pays for itself." },
  { id: "quote", label: "Instant quote", blurb: "Service + size → a live price range, like a real estimate tool." },
  { id: "invoice", label: "Invoice maker", blurb: "Build an invoice or proposal → print to a clean PDF in one click." },
];

export default function Playground() {
  const [mode, setMode] = useState<"tools" | "auto">("tools");
  const [tool, setTool] = useState<Tool>("sitecheck");
  const activeTool = TOOLS.find((t) => t.id === tool)!;

  return (
    <section id="kit" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="marker mb-4">// Try it live</p>
        </Reveal>
        <Reveal>
          <h2 className="display text-2xl text-ink sm:text-3xl md:text-4xl">
            See the work for yourself.
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
            A handful of real, working tools—and a live automation you can watch
            run, the kind we wire up behind your website.
          </p>
        </Reveal>

        {/* Mode toggle */}
        <Reveal delay={120}>
          <div className="mt-8 inline-flex gap-1 rounded-full border border-line bg-surface p-1">
            {([["tools", "Free tools"], ["auto", "Live automation"]] as [typeof mode, string][]).map(
              ([m, label]) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`rounded-full px-5 py-2 text-sm font-semibold transition-colors ${
                    mode === m ? "bg-signal text-white" : "text-muted hover:text-ink"
                  }`}
                >
                  {label}
                </button>
              ),
            )}
          </div>
        </Reveal>

        {mode === "tools" ? (
          <>
            {/* Single clean tab row */}
            <Reveal delay={140}>
              <div className="mt-6">
                <div className="inline-flex flex-wrap gap-1 rounded-full border border-line bg-surface p-1">
                  {TOOLS.map((t) => (
                    <button
                      key={t.id}
                      type="button"
                      onClick={() => setTool(t.id)}
                      className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                        tool === t.id ? "bg-gold/20 text-gold" : "text-muted hover:text-ink"
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
                <p className="mt-3 font-mono text-xs text-faint">{activeTool.blurb}</p>
              </div>
            </Reveal>

            <div className="mt-8">
              {tool === "sitecheck" && <SiteCheck />}
              {tool === "map" && <IntegrationMapper />}
              {tool === "booking" && <BookingDemo />}
              {tool === "cost" && <AutomationCost />}
              {tool === "quote" && <QuoteCalc />}
              {tool === "invoice" && <InvoiceMaker />}
            </div>
          </>
        ) : (
          <div className="mt-8">
            <Reveal delay={140}>
              <p className="mb-6 max-w-2xl text-sm leading-relaxed text-muted">
                Pick a scenario, hit go, and watch a real automation handle it—live.
                Same engine we wire up behind your forms and inbox.
              </p>
            </Reveal>
            <WorkflowSim />
          </div>
        )}
      </div>
    </section>
  );
}
