"use client";

import { useEffect, useState } from "react";
import Reveal from "./Reveal";
import SaveResult from "./SaveResult";
import { useLocalStorage } from "@/lib/useLocalStorage";

/*
  SiteCheck — a real website health check (Playground tool).

  Paste any public URL; we run it through Google PageSpeed Insights (Lighthouse)
  via /api/site-check and show performance, accessibility, best-practices, and
  SEO scores plus core web vitals. Showcases the "website ops" side of the work.
*/

type Result = {
  finalUrl: string;
  strategy: "mobile" | "desktop";
  scores: {
    performance: number | null;
    accessibility: number | null;
    bestPractices: number | null;
    seo: number | null;
  };
  metrics: {
    fcp: string | null;
    lcp: string | null;
    cls: string | null;
    tbt: string | null;
    speedIndex: string | null;
  };
};

const scoreColor = (s: number | null) =>
  s == null ? "#8497a8" : s >= 90 ? "#2fbf9e" : s >= 50 ? "#d9a441" : "#e5645a";

const SAMPLE: Result = {
  finalUrl: "example.com",
  strategy: "mobile",
  scores: { performance: 98, accessibility: 100, bestPractices: 100, seo: 100 },
  metrics: { fcp: "1.0 s", lcp: "1.3 s", cls: "0.00", tbt: "20 ms", speedIndex: "1.2 s" },
};

export default function SiteCheck() {
  const [url, setUrl] = useLocalStorage("tool-sitecheck-url", "");
  const [strategy, setStrategy] = useState<"mobile" | "desktop">("mobile");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Start with a sample result so visitors see the payoff before they type.
  const [result, setResult] = useState<Result | null>(SAMPLE);
  const [isSample, setIsSample] = useState(true);

  async function run(e: React.FormEvent) {
    e.preventDefault();
    if (!url.trim() || loading) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(
        `/api/site-check?url=${encodeURIComponent(url)}&strategy=${strategy}`,
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? "The check failed. Try again.");
      } else {
        setResult(data as Result);
        setIsSample(false);
      }
    } catch {
      setError("Couldn't run the check—check your connection and try again.");
    } finally {
      setLoading(false);
    }
  }

  const summary = result
    ? [
        "M Studio — Website health check",
        "",
        `URL:        ${result.finalUrl}`,
        `Tested as:  ${result.strategy}`,
        "",
        `Performance:     ${result.scores.performance ?? "—"}`,
        `Accessibility:   ${result.scores.accessibility ?? "—"}`,
        `Best practices:  ${result.scores.bestPractices ?? "—"}`,
        `SEO:             ${result.scores.seo ?? "—"}`,
        "",
        `First paint (FCP):    ${result.metrics.fcp ?? "—"}`,
        `Largest paint (LCP):  ${result.metrics.lcp ?? "—"}`,
        `Layout shift (CLS):   ${result.metrics.cls ?? "—"}`,
        `Blocking time (TBT):  ${result.metrics.tbt ?? "—"}`,
        `Speed index:          ${result.metrics.speedIndex ?? "—"}`,
        "",
        "Run via Google Lighthouse · mlinx.studio",
      ].join("\n")
    : "";

  const scores = result
    ? ([
        ["Performance", result.scores.performance],
        ["Accessibility", result.scores.accessibility],
        ["Best practices", result.scores.bestPractices],
        ["SEO", result.scores.seo],
      ] as [string, number | null][])
    : [];

  const metrics = result
    ? ([
        ["First paint", result.metrics.fcp],
        ["Largest paint", result.metrics.lcp],
        ["Layout shift", result.metrics.cls],
        ["Blocking time", result.metrics.tbt],
        ["Speed index", result.metrics.speedIndex],
      ] as [string, string | null][])
    : [];

  return (
    <div className="rounded-2xl border border-line bg-surface p-6 md:p-8">
      <Reveal>
        <form onSubmit={run} className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-2 rounded-lg border border-line bg-base px-4 py-3">
            <span aria-hidden="true" className="text-faint">⌕</span>
            <input
              type="text"
              inputMode="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="yourwebsite.com"
              className="w-full bg-transparent text-sm text-ink placeholder:text-faint focus:outline-none"
            />
          </div>
          <div className="inline-flex rounded-lg border border-line bg-base p-0.5">
            {(["mobile", "desktop"] as const).map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => setStrategy(s)}
                className={`rounded-md px-3 py-2 text-xs font-medium capitalize transition-colors ${
                  strategy === s ? "bg-signal text-white" : "text-muted hover:text-ink"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
          <button
            type="submit"
            disabled={loading || !url.trim()}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-signal px-6 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {loading ? "Checking…" : "Check site"}
          </button>
        </form>
      </Reveal>

      {loading && (
        <p className="mt-5 flex items-center gap-2 text-sm text-muted">
          <span className="inline-block h-3 w-3 animate-spin rounded-full border-2 border-line border-t-signal" />
          Running a live Lighthouse audit—this can take 20–40 seconds.
        </p>
      )}

      {error && (
        <p className="mt-5 rounded-lg border border-[#e5645a]/30 bg-[#e5645a]/10 px-4 py-3 text-sm text-[#f0a39b]">
          {error}
        </p>
      )}

      {result && (
        <div className="mt-7">
          <p className="flex flex-wrap items-center gap-2 font-mono text-[11px] uppercase tracking-widest text-faint">
            {isSample && (
              <span className="rounded-full border border-gold/40 bg-gold/10 px-2 py-0.5 text-gold">
                Example
              </span>
            )}
            {result.finalUrl} · {result.strategy}
          </p>

          {/* Scores */}
          <div className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4">
            {scores.map(([label, value]) => (
              <div key={`${label}-${result.finalUrl}-${isSample}`} className="flex flex-col items-center rounded-xl border border-line bg-base p-4 text-center">
                <ScoreRing value={value} />
                <p className="mt-2 text-xs text-muted">{label}</p>
              </div>
            ))}
          </div>

          {/* Core metrics */}
          <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-5">
            {metrics.map(([label, value]) => (
              <div key={label} className="rounded-lg border border-line bg-base px-3 py-2.5">
                <p className="font-mono text-[10px] uppercase tracking-widest text-faint">{label}</p>
                <p className="mt-1 text-sm text-ink">{value ?? "—"}</p>
              </div>
            ))}
          </div>

          {!isSample && <SaveResult summary={summary} filename="mstudio-site-check" />}

          <p className="mt-4 text-xs leading-relaxed text-faint">
            {isSample ? (
              "An example of what you get—run your own site above for a real Google Lighthouse audit."
            ) : (
              <>
                Scores from Google Lighthouse (0–100). Want these all green?
                That&apos;s exactly the kind of website ops I handle.{" "}
                <a href="#contact" className="text-signal hover:opacity-80">Let&apos;s talk</a>.
              </>
            )}
          </p>
        </div>
      )}

      {!result && !loading && !error && (
        <p className="mt-5 text-sm leading-relaxed text-muted">
          Real audit, not a mockup: enter any public website and I&apos;ll run it
          through Google Lighthouse for live speed, accessibility, best-practices,
          and SEO scores.
        </p>
      )}
    </div>
  );
}

function ScoreRing({ value }: { value: number | null }) {
  const target = value ?? 0;
  const [shown, setShown] = useState(0);
  const r = 26;
  const circ = 2 * Math.PI * r;
  const color = scoreColor(value);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(target);
      return;
    }
    let raf = 0;
    const t0 = performance.now();
    const dur = 900;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      setShown(Math.round(target * e));
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target]);

  const offset = circ * (1 - shown / 100);
  return (
    <div className="relative h-[68px] w-[68px]">
      <svg viewBox="0 0 64 64" className="h-full w-full -rotate-90">
        <circle cx="32" cy="32" r={r} fill="none" stroke="var(--color-line)" strokeWidth="5" />
        <circle
          cx="32"
          cy="32"
          r={r}
          fill="none"
          stroke={color}
          strokeWidth="5"
          strokeLinecap="round"
          strokeDasharray={circ}
          strokeDashoffset={offset}
        />
      </svg>
      <span
        className="absolute inset-0 flex items-center justify-center font-display text-xl"
        style={{ color }}
      >
        {value == null ? "—" : shown}
      </span>
    </div>
  );
}
