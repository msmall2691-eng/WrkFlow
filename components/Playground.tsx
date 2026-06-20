"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import CalculatorKit from "./CalculatorKit";
import QuoteCalc from "./QuoteCalc";
import RateCalc from "./RateCalc";
import SignatureMaker from "./SignatureMaker";
import AutomationCost from "./AutomationCost";
import SiteCheck from "./SiteCheck";
import IntegrationMapper from "./IntegrationMapper";
import WorkflowSim from "./WorkflowSim";

/*
  Playground — one "try it live" hub with two clearly-separated modes:
    • Tools       — free, fully-working utilities a visitor can use right now.
    • Automations — watch the kind of automation we'd wire up behind their site.
  A single top-level toggle keeps the two from feeling redundant.
*/

type Tool = "sitecheck" | "map" | "cost" | "quote" | "rate" | "sig" | "calc";
type Group = "Website & systems" | "Business math" | "Extras";

const TOOLS: { id: Tool; label: string; blurb: string; group: Group }[] = [
  { id: "sitecheck", label: "Website health check", blurb: "Paste any URL → real Lighthouse speed, SEO & accessibility scores.", group: "Website & systems" },
  { id: "map", label: "Integration map", blurb: "Pick the tools you use → see how they link and what gets automated.", group: "Website & systems" },
  { id: "cost", label: "Cost of manual work", blurb: "Hours + people → what doing it by hand costs you every year.", group: "Business math" },
  { id: "quote", label: "Instant quote", blurb: "Service + size → a live price range, like a real estimate tool.", group: "Business math" },
  { id: "rate", label: "What to charge", blurb: "Target income → the hourly rate you actually need.", group: "Business math" },
  { id: "sig", label: "Email signature", blurb: "Fill it in, copy a styled signature to your clipboard.", group: "Extras" },
  { id: "calc", label: "Calculator kit", blurb: "A working calculator with a wall of live tweaks.", group: "Extras" },
];

const GROUPS: Group[] = ["Website & systems", "Business math", "Extras"];

export default function Playground() {
  const [mode, setMode] = useState<"tools" | "auto">("tools");
  const [tool, setTool] = useState<Tool>("sitecheck");
  const activeTool = TOOLS.find((t) => t.id === tool)!;

  return (
    <section id="kit" className="relative pb-20 pt-10 md:pb-28 md:pt-12">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="marker mb-6">// Try it live</p>
        </Reveal>
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <Reveal>
              <h2 className="display text-3xl text-ink sm:text-4xl md:text-5xl">
                See the work for yourself.
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-4">
            <Reveal delay={80}>
              <p className="text-base leading-relaxed text-muted">
                Free <span className="text-ink">tools</span> you can use right now,
                and live <span className="text-ink">automations</span> you can watch
                run—the kind we build behind your website.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Mode toggle — Tools vs Automations */}
        <Reveal delay={120}>
          <div className="mt-10 inline-flex gap-1 rounded-full border border-line bg-surface p-1">
            {([["tools", "Free tools"], ["auto", "Live automations"]] as [typeof mode, string][]).map(
              ([m, label]) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMode(m)}
                  className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-colors ${
                    mode === m ? "bg-signal text-white" : "text-muted hover:text-ink"
                  }`}
                >
                  {label}
                </button>
              ),
            )}
          </div>
        </Reveal>

        <Reveal delay={140}>
          <p className="mt-4 text-sm leading-relaxed text-muted">
            {mode === "tools"
              ? "Free, working tools you can use right now—pick one below."
              : "Watch a real automation run end to end—pick a scenario, hit go."}
          </p>
        </Reveal>

        {mode === "tools" ? (
          <>
            {/* Tool tabs — grouped so the set stays scannable as it grows */}
            <Reveal delay={160}>
              <div className="mt-6 flex flex-col gap-4">
                <div className="flex flex-col gap-4 sm:flex-row sm:flex-wrap sm:items-start sm:gap-6">
                  {GROUPS.map((g) => (
                    <div key={g} className="flex flex-col gap-1.5">
                      <span className="px-1 font-mono text-[10px] uppercase tracking-widest text-faint">
                        {g}
                      </span>
                      <div className="inline-flex flex-wrap gap-1 rounded-full border border-line bg-surface p-1">
                        {TOOLS.filter((t) => t.group === g).map((t) => (
                          <button
                            key={t.id}
                            type="button"
                            onClick={() => setTool(t.id)}
                            className={`rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                              tool === t.id ? "bg-gold/20 text-gold" : "text-muted hover:text-ink"
                            }`}
                          >
                            {t.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
                <p className="font-mono text-xs text-faint">{activeTool.blurb}</p>
              </div>
            </Reveal>

            <div className="mt-8">
              {tool === "sitecheck" && <SiteCheck />}
              {tool === "map" && <IntegrationMapper />}
              {tool === "cost" && <AutomationCost />}
              {tool === "quote" && <QuoteCalc />}
              {tool === "rate" && <RateCalc />}
              {tool === "sig" && <SignatureMaker />}
              {tool === "calc" && <CalculatorKit />}
            </div>
          </>
        ) : (
          <div className="mt-8">
            <Reveal delay={160}>
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
