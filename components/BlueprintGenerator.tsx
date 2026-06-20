"use client";

import { useState } from "react";
import Reveal from "./Reveal";

/*
  BlueprintGenerator — a live AI widget.

  The visitor types the repetitive busywork they're stuck with; Claude (via
  /api/blueprint) returns a concrete, tailored automation plan — steps, stack,
  build estimate, time saved. It literally demonstrates what the studio does.
*/

type Step = { action: string; detail: string };
type Blueprint = {
  title: string;
  summary: string;
  steps: Step[];
  stack: string[];
  setup_estimate: string;
  time_saved: string;
};

const EXAMPLES = [
  "We re-type every quote into our CRM, accounting, and a spreadsheet.",
  "Leads come in by email and someone manually replies and schedules them.",
  "We chase invoices by hand and copy payment status between tools.",
];

export default function BlueprintGenerator() {
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<Blueprint | null>(null);

  const generate = async (text: string) => {
    const busywork = text.trim();
    if (!busywork || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/blueprint", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ busywork }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong. Please try again.");
      } else {
        setResult(data.blueprint as Blueprint);
      }
    } catch {
      setError("Couldn't reach the assistant. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section
      id="blueprint"
      className="relative overflow-hidden border-t border-white/10 bg-[#05070d] py-28 md:py-36"
    >
      {/* Top fade in from the light section above */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-32 bg-gradient-to-b from-[var(--color-base)] to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(70%_60%_at_50%_0%,rgba(37,99,235,0.10)_0%,transparent_70%)]"
      />

      <div className="relative z-10 mx-auto max-w-3xl px-6">
        <Reveal>
          <p className="marker mb-6 flex items-center gap-3">
            <span className="inline-block h-px w-8 bg-signal/60" />
            Live · powered by Claude
          </p>
        </Reveal>
        <Reveal delay={80}>
          <h2 className="display text-3xl text-white sm:text-4xl md:text-5xl [text-shadow:0_2px_24px_rgba(0,0,0,0.5)]">
            Describe your busywork. Watch it become an automation.
          </h2>
        </Reveal>
        <Reveal delay={140}>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-white/70">
            Tell us the repetitive thing eating your week. Our AI maps a real,
            tailored automation—steps, tools, and what it&apos;d save—on the spot.
            It&apos;s the kind of thinking we bring to every build.
          </p>
        </Reveal>

        <Reveal delay={200}>
          <div className="mt-10 rounded-2xl border border-white/15 bg-white/[0.06] p-5 backdrop-blur-md sm:p-6">
            <label htmlFor="busywork" className="sr-only">
              Describe your busywork
            </label>
            <textarea
              id="busywork"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if ((e.metaKey || e.ctrlKey) && e.key === "Enter") generate(input);
              }}
              rows={3}
              maxLength={600}
              placeholder="e.g. We re-type quotes into three different tools every day…"
              className="w-full resize-y rounded-lg border border-white/15 bg-white/5 px-4 py-3 text-sm text-white placeholder:text-white/40 focus:border-signal/70 focus:outline-none"
            />

            <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
              <button
                type="button"
                onClick={() => generate(input)}
                disabled={loading || input.trim().length < 3}
                className="inline-flex items-center justify-center gap-2 rounded-full bg-signal px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {loading ? "Designing…" : "Generate blueprint"}
                <span aria-hidden="true">{loading ? "✦" : "▸"}</span>
              </button>
              <span className="font-mono text-[11px] uppercase tracking-widest text-white/40">
                ⌘+Enter to run
              </span>
            </div>

            {/* Example prompts */}
            {!result && !loading && (
              <div className="mt-5 flex flex-wrap gap-2">
                {EXAMPLES.map((ex) => (
                  <button
                    key={ex}
                    type="button"
                    onClick={() => {
                      setInput(ex);
                      generate(ex);
                    }}
                    className="rounded-full border border-white/15 px-3 py-1.5 text-left text-xs text-white/60 transition-colors hover:border-white/35 hover:text-white/90"
                  >
                    {ex}
                  </button>
                ))}
              </div>
            )}
          </div>
        </Reveal>

        {/* Loading shimmer */}
        {loading && (
          <div className="mt-6 animate-pulse rounded-2xl border border-white/10 bg-white/[0.04] p-6">
            <div className="h-5 w-1/2 rounded bg-white/10" />
            <div className="mt-4 h-3 w-3/4 rounded bg-white/10" />
            <div className="mt-6 space-y-3">
              {[0, 1, 2, 3].map((i) => (
                <div key={i} className="h-3 w-full rounded bg-white/10" />
              ))}
            </div>
          </div>
        )}

        {error && (
          <p className="mt-6 rounded-xl border border-red-400/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            {error}
          </p>
        )}

        {/* Result */}
        {result && !loading && (
          <div className="mt-6 rounded-2xl border border-white/15 bg-white/[0.06] p-6 backdrop-blur-md sm:p-8">
            <p className="font-mono text-[11px] uppercase tracking-widest text-[#a9c2ff]">
              ✦ Suggested automation
            </p>
            <h3 className="mt-3 font-display text-2xl text-white">{result.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-white/75">{result.summary}</p>

            <ol className="mt-6 space-y-4">
              {result.steps.map((step, i) => (
                <li key={i} className="flex gap-4">
                  <span className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-signal/50 font-mono text-xs text-[#a9c2ff]">
                    {i + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-white">{step.action}</p>
                    <p className="mt-0.5 text-sm leading-relaxed text-white/65">
                      {step.detail}
                    </p>
                  </div>
                </li>
              ))}
            </ol>

            {result.stack?.length > 0 && (
              <div className="mt-6 flex flex-wrap gap-2">
                {result.stack.map((tool) => (
                  <span
                    key={tool}
                    className="rounded-full border border-white/15 bg-white/5 px-3 py-1 font-mono text-[11px] text-white/70"
                  >
                    {tool}
                  </span>
                ))}
              </div>
            )}

            <div className="mt-6 grid grid-cols-2 gap-4 border-t border-white/10 pt-5">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                  Est. build
                </p>
                <p className="mt-1 text-sm text-white">{result.setup_estimate}</p>
              </div>
              <div>
                <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">
                  Time saved
                </p>
                <p className="mt-1 text-sm text-white">{result.time_saved}</p>
              </div>
            </div>

            <div className="mt-7 flex flex-wrap items-center gap-4">
              <a
                href="#contact"
                className="inline-flex items-center gap-2 rounded-full bg-signal px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                Build this for us
                <span aria-hidden="true">→</span>
              </a>
              <button
                type="button"
                onClick={() => {
                  setResult(null);
                  setInput("");
                }}
                className="text-sm text-white/60 transition-colors hover:text-white"
              >
                Try another
              </button>
            </div>

            <p className="mt-5 font-mono text-[10px] uppercase tracking-widest text-white/30">
              AI-generated starting point · we&apos;ll refine it with you
            </p>
          </div>
        )}
      </div>
    </section>
  );
}
