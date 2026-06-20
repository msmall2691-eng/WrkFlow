"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import AutomationCost from "./AutomationCost";
import SiteCheck from "./SiteCheck";
import IntegrationMapper from "./IntegrationMapper";

/*
  Playground — a small, focused "try it live" hub. Three working tools, no
  filler. Deliberately concise.
*/

type Tool = "sitecheck" | "map" | "cost";

const TOOLS: { id: Tool; label: string; blurb: string }[] = [
  { id: "sitecheck", label: "Website check", blurb: "Paste any URL → real Lighthouse speed, SEO & accessibility scores." },
  { id: "map", label: "Integration map", blurb: "Pick the tools you use → see how they link and what gets automated." },
  { id: "cost", label: "Cost of manual work", blurb: "Hours + people → the yearly cost, and how fast automation pays for itself." },
];

export default function Playground() {
  const [tool, setTool] = useState<Tool>("sitecheck");
  const activeTool = TOOLS.find((t) => t.id === tool)!;

  return (
    <section id="kit" className="relative py-16 md:py-24">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="marker mb-4">// Linx · free tools</p>
        </Reveal>
        <Reveal>
          <h2 className="display text-2xl text-ink sm:text-3xl md:text-4xl">
            Three tools you can use right now.
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
            Free, working tools by <span className="text-ink">Linx</span>—the same
            kind we build into the systems behind your website.{" "}
            <a href="/marketplace" className="text-signal transition-opacity hover:opacity-80">
              See the full lineup →
            </a>
          </p>
        </Reveal>

        {/* Tabs */}
        <Reveal delay={120}>
          <div className="mt-8">
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
          {tool === "cost" && <AutomationCost />}
        </div>
      </div>
    </section>
  );
}
