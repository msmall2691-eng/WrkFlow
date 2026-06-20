"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import CalculatorKit from "./CalculatorKit";
import QuoteCalc from "./QuoteCalc";
import RateCalc from "./RateCalc";
import SignatureMaker from "./SignatureMaker";
import WorkflowSim from "./WorkflowSim";

/*
  Playground — one "try it live" hub with two clearly-separated modes:
    • Tools       — free, fully-working utilities a visitor can use right now.
    • Automations — watch the kind of automation we'd wire up behind their site.
  A single top-level toggle keeps the two from feeling redundant.
*/

type Tool = "quote" | "rate" | "sig" | "calc";

const TOOLS: { id: Tool; label: string; blurb: string }[] = [
  { id: "quote", label: "Instant quote", blurb: "Service + size → a live price range, like a real estimate tool." },
  { id: "rate", label: "What to charge", blurb: "Target income → the hourly rate you actually need." },
  { id: "sig", label: "Email signature", blurb: "Fill it in, copy a styled signature to your clipboard." },
  { id: "calc", label: "Calculator kit", blurb: "A working calculator with a wall of live tweaks." },
];

export default function Playground() {
  const [mode, setMode] = useState<"tools" | "auto">("tools");
  const [tool, setTool] = useState<Tool>("quote");
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
            {/* Tool tabs */}
            <Reveal delay={160}>
              <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="inline-flex flex-wrap gap-1 rounded-full border border-line bg-surface p-1">
                  {TOOLS.map((t) => (
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
                <p className="font-mono text-xs text-faint">{activeTool.blurb}</p>
              </div>
            </Reveal>

            <div className="mt-8">
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
