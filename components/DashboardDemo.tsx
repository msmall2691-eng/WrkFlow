"use client";

import { useMemo, useState } from "react";

/*
  DashboardDemo — a drivable STR operations dashboard, the kind M Studio builds
  as internal software. Everything here is deterministic MOCK data generated
  client-side (clearly labelled). It does NOT touch the real, login-gated app.
  Change the property or range and every number recomputes, consistently.
*/

type PropId = "all" | "harborview" | "lighthouse" | "dockside";
type RangeId = "30" | "90" | "year";
type UnitId = Exclude<PropId, "all">;

const PROPERTIES: { id: PropId; name: string }[] = [
  { id: "all", name: "All properties" },
  { id: "harborview", name: "Harborview Cottage" },
  { id: "lighthouse", name: "Lighthouse Loft" },
  { id: "dockside", name: "Dockside Bungalow" },
];

const RANGES: { id: RangeId; label: string; days: number; points: number }[] = [
  { id: "30", label: "30 days", days: 30, points: 10 },
  { id: "90", label: "90 days", days: 90, points: 12 },
  { id: "year", label: "Year", days: 365, points: 12 },
];

// Per-unit baselines, hand-tuned to read like a real coastal-Maine STR book.
const UNITS: Record<UnitId, { rate: number; occ: number; mix: [number, number, number] }> = {
  harborview: { rate: 285, occ: 0.78, mix: [55, 25, 20] },
  lighthouse: { rate: 210, occ: 0.83, mix: [48, 22, 30] },
  dockside: { rate: 340, occ: 0.71, mix: [60, 28, 12] },
};

// Range tilts the book a little (recent months run hotter than the annual avg).
const RANGE_FACTOR: Record<RangeId, { rate: number; occ: number }> = {
  "30": { rate: 1.05, occ: 1.06 },
  "90": { rate: 1.0, occ: 1.0 },
  year: { rate: 0.97, occ: 0.93 },
};

const CHANNELS = ["Airbnb", "VRBO", "Direct"] as const;

// Tiny deterministic PRNG so the trend looks organic but never flickers/changes
// between renders for the same selection.
function mulberry32(seed: number) {
  return function () {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
function seeded(str: string) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return mulberry32(h >>> 0);
}

const usdCompact = (n: number) =>
  n >= 1000 ? `$${(n / 1000).toFixed(n >= 100000 ? 0 : 1)}k` : `$${Math.round(n)}`;
const usd = (n: number) => `$${Math.round(n).toLocaleString()}`;

export default function DashboardDemo() {
  const [prop, setProp] = useState<PropId>("all");
  const [range, setRange] = useState<RangeId>("90");

  const data = useMemo(() => {
    const r = RANGES.find((x) => x.id === range)!;
    const f = RANGE_FACTOR[range];
    const units: UnitId[] = prop === "all" ? (["harborview", "lighthouse", "dockside"] as UnitId[]) : [prop];

    let revenue = 0;
    let rateSum = 0;
    let occSum = 0;
    const mix: [number, number, number] = [0, 0, 0];

    for (const u of units) {
      const base = UNITS[u];
      const rate = base.rate * f.rate;
      const occ = Math.min(0.96, base.occ * f.occ);
      revenue += rate * occ * r.days;
      rateSum += rate;
      occSum += occ;
      base.mix.forEach((m, i) => (mix[i] += m));
    }

    const n = units.length;
    const avgRate = rateSum / n;
    const occupancy = occSum / n;
    const revpar = avgRate * occupancy;
    const mixPct = mix.map((m) => Math.round(m / n)) as [number, number, number];

    // Deterministic revenue trend + KPI deltas, keyed off the selection.
    const rng = seeded(`${prop}-${range}`);
    const per = revenue / r.points;
    const trend = Array.from({ length: r.points }, () => per * (0.82 + rng() * 0.36));
    const deltas = [revenue, occupancy, avgRate, revpar].map(() => Math.round((rng() * 16 - 4) * 10) / 10);

    return { revenue, occupancy, avgRate, revpar, mixPct, trend, deltas, units: n };
  }, [prop, range]);

  const kpis = [
    { label: "Revenue", value: usd(data.revenue), delta: data.deltas[0] },
    { label: "Occupancy", value: `${Math.round(data.occupancy * 100)}%`, delta: data.deltas[1] },
    { label: "Avg nightly rate", value: usd(data.avgRate), delta: data.deltas[2] },
    { label: "RevPAR", value: usd(data.revpar), delta: data.deltas[3] },
  ];

  const max = Math.max(...data.trend);
  const min = Math.min(...data.trend);
  const span = max - min || 1;
  const W = 300;
  const H = 80;
  const pts = data.trend.map((v, i) => {
    const x = (i / (data.trend.length - 1)) * W;
    const y = H - 6 - ((v - min) / span) * (H - 14);
    return [x, y] as const;
  });
  const line = pts.map(([x, y], i) => `${i === 0 ? "M" : "L"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  const area = `${line} L${W},${H} L0,${H} Z`;

  const mixColors = ["var(--color-signal)", "color-mix(in srgb, var(--color-signal) 45%, transparent)", "var(--color-gold)"];

  return (
    <div className="overflow-hidden rounded-2xl border border-line bg-elevated">
      {/* Header + controls */}
      <div className="flex flex-col gap-4 border-b border-line p-5 md:flex-row md:items-center md:justify-between md:p-6">
        <div className="flex items-center gap-2.5">
          <span className="inline-flex h-2 w-2 rounded-full bg-signal" />
          <span className="font-mono text-[10px] uppercase tracking-widest text-faint">
            Interactive demo · sample data
          </span>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <label className="sr-only" htmlFor="demo-prop">Property</label>
          <select
            id="demo-prop"
            value={prop}
            onChange={(e) => setProp(e.target.value as PropId)}
            className="rounded-lg border border-line bg-base px-3 py-2 text-sm text-ink focus:border-signal/60 focus:outline-none"
          >
            {PROPERTIES.map((p) => (
              <option key={p.id} value={p.id}>{p.name}</option>
            ))}
          </select>
          <div className="inline-flex rounded-lg border border-line bg-base p-0.5">
            {RANGES.map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => setRange(r.id)}
                aria-pressed={range === r.id}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  range === r.id ? "bg-signal/15 text-signal" : "text-muted hover:text-ink"
                }`}
              >
                {r.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 gap-px bg-line lg:grid-cols-4">
        {kpis.map((k) => (
          <div key={k.label} className="bg-elevated p-5">
            <p className="font-mono text-[10px] uppercase tracking-widest text-faint">{k.label}</p>
            <p className="mt-2 text-xl text-ink md:text-2xl">{k.value}</p>
            <p className={`mt-1 font-mono text-[11px] ${k.delta >= 0 ? "text-signal" : "text-[#e5645a]"}`}>
              {k.delta >= 0 ? "▲" : "▼"} {Math.abs(k.delta)}% vs prior
            </p>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="grid gap-6 border-t border-line p-5 md:grid-cols-5 md:p-6">
        {/* Revenue trend */}
        <div className="md:col-span-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-faint">Revenue trend</p>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            preserveAspectRatio="none"
            className="mt-3 h-20 w-full"
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="demo-fill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="var(--color-signal)" stopOpacity="0.28" />
                <stop offset="100%" stopColor="var(--color-signal)" stopOpacity="0" />
              </linearGradient>
            </defs>
            <path d={area} fill="url(#demo-fill)" />
            <path d={line} fill="none" stroke="var(--color-signal)" strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" />
          </svg>
        </div>

        {/* Channel mix */}
        <div className="md:col-span-2">
          <p className="font-mono text-[10px] uppercase tracking-widest text-faint">Channel mix</p>
          <div className="mt-3 flex h-3 overflow-hidden rounded-full">
            {data.mixPct.map((p, i) => (
              <span
                key={CHANNELS[i]}
                className="h-full transition-[width] duration-500 motion-reduce:transition-none"
                style={{ width: `${p}%`, backgroundColor: mixColors[i] }}
              />
            ))}
          </div>
          <ul className="mt-3 space-y-1.5">
            {CHANNELS.map((c, i) => (
              <li key={c} className="flex items-center gap-2 text-xs text-muted">
                <span className="h-2 w-2 rounded-full" style={{ backgroundColor: mixColors[i] }} />
                {c}
                <span className="ml-auto font-mono text-faint">{data.mixPct[i]}%</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* CTA */}
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 border-t border-line bg-surface/60 px-5 py-4 text-sm md:px-6">
        <span className="text-muted">Want this for your business?</span>
        <a href="#contact" className="font-semibold text-signal transition-opacity hover:opacity-80">
          Start a conversation →
        </a>
      </div>
    </div>
  );
}
