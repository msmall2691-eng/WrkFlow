"use client";

import { useMemo, useState } from "react";
import Reveal from "./Reveal";
import Aurora from "./Aurora";

/*
  Dashboard — a short-term-rental "Command Center".

  Brings Airbnb + VRBO + direct bookings into one place: unified revenue,
  occupancy, ADR, a synced two-week calendar, channel mix, and the connected
  data sources (incl. Twilio). Interactive (property + date range), with
  realistic sample data. Dark + systems-network background to match the hero.
*/

type Ch = "airbnb" | "vrbo" | "direct";
type Base = {
  name: string;
  rev: number;
  occ: number;
  adr: number;
  bk: number;
  ch: Record<Ch, number>;
  tr: { rev: number; occ: number; adr: number; bk: number };
  cal: (Ch | null)[];
};

const A: Ch = "airbnb";
const V: Ch = "vrbo";
const D: Ch = "direct";

const BASE: Record<string, Base> = {
  harbor: {
    name: "Harborview Cottage",
    rev: 9800, occ: 86, adr: 312, bk: 14,
    ch: { airbnb: 55, vrbo: 30, direct: 15 },
    tr: { rev: 12, occ: 5, adr: 3, bk: 8 },
    cal: [A, A, A, null, V, V, V, null, D, A, A, null, V, V],
  },
  light: {
    name: "Lighthouse Loft",
    rev: 7200, occ: 78, adr: 268, bk: 11,
    ch: { airbnb: 62, vrbo: 22, direct: 16 },
    tr: { rev: 9, occ: 2, adr: 5, bk: 6 },
    cal: [V, V, null, A, A, A, A, null, null, D, D, A, A, null],
  },
  dock: {
    name: "Dockside Bungalow",
    rev: 6100, occ: 81, adr: 224, bk: 13,
    ch: { airbnb: 48, vrbo: 34, direct: 18 },
    tr: { rev: 15, occ: 7, adr: 2, bk: 11 },
    cal: [A, A, null, D, D, V, V, V, null, A, A, A, null, V],
  },
};
const ORDER = ["harbor", "light", "dock"];
const RANGE_FACTOR: Record<string, number> = { "30d": 1, "90d": 2.85, ytd: 8.4 };

const CH_COLOR: Record<Ch, string> = { airbnb: "#ff5a5f", vrbo: "#3b82f6", direct: "#10b981" };
const CH_LABEL: Record<Ch, string> = { airbnb: "Airbnb", vrbo: "VRBO", direct: "Direct" };

const SHAPE = [0.72, 0.88, 0.95, 0.8, 0.93, 1.06];
const SHAPE_SUM = SHAPE.reduce((a, b) => a + b, 0);
const MONTHS = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

function compute(prop: string, range: string) {
  const f = RANGE_FACTOR[range];
  if (prop === "all") {
    const bs = ORDER.map((k) => BASE[k]);
    const revSum = bs.reduce((s, b) => s + b.rev, 0);
    const ch = {
      airbnb: Math.round(bs.reduce((s, b) => s + b.ch.airbnb * b.rev, 0) / revSum),
      vrbo: Math.round(bs.reduce((s, b) => s + b.ch.vrbo * b.rev, 0) / revSum),
      direct: 0,
    };
    ch.direct = 100 - ch.airbnb - ch.vrbo;
    const cal = Array.from({ length: 14 }, (_, i) =>
      BASE.harbor.cal[i] ?? BASE.light.cal[i] ?? BASE.dock.cal[i],
    );
    return {
      rev: revSum * f,
      bk: Math.round(bs.reduce((s, b) => s + b.bk, 0) * f),
      occ: Math.round(bs.reduce((s, b) => s + b.occ, 0) / bs.length),
      adr: Math.round(bs.reduce((s, b) => s + b.adr * b.rev, 0) / revSum),
      ch,
      tr: { rev: 12, occ: 5, adr: 3, bk: 8 },
      cal,
    };
  }
  const b = BASE[prop];
  return { rev: b.rev * f, bk: Math.round(b.bk * f), occ: b.occ, adr: b.adr, ch: b.ch, tr: b.tr, cal: b.cal };
}

const SOURCES = ["Airbnb", "VRBO", "Google Calendar", "Stripe", "Twilio SMS"];

export default function Dashboard() {
  const [prop, setProp] = useState("all");
  const [range, setRange] = useState("30d");
  const m = useMemo(() => compute(prop, range), [prop, range]);

  const bars = SHAPE.map((s) => (m.rev * s) / SHAPE_SUM);
  const maxBar = Math.max(...bars);

  return (
    <section id="dash" className="relative overflow-hidden bg-[#08131d] py-28 md:py-36">
      {/* Unified chromatic aurora (matches the hero), with a veil so cards pop */}
      <Aurora intensity={0.85} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-black/55" />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[var(--color-base)] to-transparent"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[var(--color-base)]"
      />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="marker mb-6">// Command center</p>
        </Reveal>
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <Reveal>
              <h2 className="display text-3xl text-white sm:text-4xl md:text-5xl [text-shadow:0_2px_24px_rgba(0,0,0,0.5)]">
                Every booking, every platform—one screen.
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-4">
            <Reveal delay={80}>
              <p className="text-base leading-relaxed text-white/70">
                We pull Airbnb, VRBO, and direct bookings—plus calendars and
                payments—into one live dashboard. No more tab-hopping to see how
                the season&apos;s really going.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Controls */}
        <Reveal delay={120}>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <DarkSeg
              value={prop}
              onChange={setProp}
              options={[["all", "All properties"], ...ORDER.map((k) => [k, BASE[k].name] as [string, string])]}
            />
            <div className="flex items-center gap-3">
              <DarkSeg
                value={range}
                onChange={setRange}
                options={[["30d", "30 days"], ["90d", "90 days"], ["ytd", "Year"]]}
              />
              <span className="hidden items-center gap-1.5 font-mono text-[10px] uppercase tracking-widest text-emerald-300 sm:inline-flex">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-emerald-400" /> Live
              </span>
            </div>
          </div>
        </Reveal>

        {/* KPIs */}
        <Reveal delay={160}>
          <div className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
            <Kpi label="Revenue" value={money(m.rev)} delta={m.tr.rev} />
            <Kpi label="Occupancy" value={`${m.occ}%`} delta={m.tr.occ} unit="pts" />
            <Kpi label="Avg nightly rate" value={money(m.adr)} delta={m.tr.adr} />
            <Kpi label="Bookings" value={`${m.bk}`} delta={m.tr.bk} />
          </div>
        </Reveal>

        <div className="mt-4 grid gap-4 lg:grid-cols-5">
          {/* Revenue chart + channel mix */}
          <Reveal delay={200} className="lg:col-span-3">
            <div className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md">
              <div className="mb-5 flex items-center justify-between">
                <p className="font-mono text-[11px] uppercase tracking-widest text-white/45">Revenue trend</p>
                <p className="text-xs text-white/40">illustrative</p>
              </div>
              <div className="flex h-40 items-end gap-2 sm:gap-3">
                {bars.map((b, i) => (
                  <div key={i} className="group flex flex-1 flex-col items-center gap-2">
                    <div className="relative flex w-full flex-1 items-end">
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-signal/40 to-signal transition-all"
                        style={{ height: `${(b / maxBar) * 100}%` }}
                      />
                      <span className="pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/70 px-1.5 py-0.5 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                        {money(b)}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-white/40">{MONTHS[i]}</span>
                  </div>
                ))}
              </div>

              {/* Channel mix */}
              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-white/45">Channel mix</p>
                <div className="flex h-2.5 overflow-hidden rounded-full">
                  {(["airbnb", "vrbo", "direct"] as Ch[]).map((c) => (
                    <div key={c} style={{ width: `${m.ch[c]}%`, backgroundColor: CH_COLOR[c] }} />
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                  {(["airbnb", "vrbo", "direct"] as Ch[]).map((c) => (
                    <span key={c} className="flex items-center gap-2 text-xs text-white/70">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CH_COLOR[c] }} />
                      {CH_LABEL[c]} <span className="text-white/40">{m.ch[c]}%</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Synced calendar */}
          <Reveal delay={240} className="lg:col-span-2">
            <div className="h-full rounded-2xl border border-white/10 bg-white/[0.04] p-6 backdrop-blur-md">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-mono text-[11px] uppercase tracking-widest text-white/45">Next 2 weeks</p>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-emerald-300">
                  ⟳ Synced
                </span>
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {["S", "M", "T", "W", "T", "F", "S"].map((d, i) => (
                  <span key={i} className="text-center font-mono text-[10px] text-white/30">{d}</span>
                ))}
                {m.cal.map((c, i) => (
                  <div
                    key={i}
                    title={c ? `${CH_LABEL[c]} booking` : "Open"}
                    className="flex aspect-square items-center justify-center rounded-md border border-white/5 text-[10px]"
                    style={{
                      backgroundColor: c ? `${CH_COLOR[c]}33` : "rgba(255,255,255,0.02)",
                      color: c ? CH_COLOR[c] : "rgba(255,255,255,0.25)",
                    }}
                  >
                    {i + 1}
                  </div>
                ))}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-white/45">
                Bookings from every channel land on one calendar—double-bookings
                blocked automatically.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Connected sources */}
        <Reveal delay={280}>
          <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-3">
              <span className="font-mono text-[11px] uppercase tracking-widest text-white/45">
                Connected
              </span>
              {SOURCES.map((s) => (
                <span
                  key={s}
                  className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-white/75"
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
                  {s}
                </span>
              ))}
              <span className="ml-auto text-xs text-white/40">+ any API we can reach</span>
            </div>
          </div>
        </Reveal>

        <Reveal delay={320}>
          <p className="mt-6 text-center text-sm text-white/55">
            This is the kind of system we build for short-term-rental hosts.{" "}
            <a href="#contact" className="text-[#6fd3c6] hover:underline">
              Want one for your properties?
            </a>
          </p>
        </Reveal>
      </div>
    </section>
  );
}

function Kpi({ label, value, delta, unit = "%" }: { label: string; value: string; delta: number; unit?: string }) {
  const up = delta >= 0;
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.04] p-5 backdrop-blur-md">
      <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">{label}</p>
      <p className="mt-2 font-display text-2xl text-white sm:text-3xl">{value}</p>
      <p className={`mt-1 text-xs ${up ? "text-emerald-300" : "text-rose-300"}`}>
        {up ? "▲" : "▼"} {Math.abs(delta)}
        {unit} <span className="text-white/35">vs prior</span>
      </p>
    </div>
  );
}

function DarkSeg({
  value, options, onChange,
}: {
  value: string;
  options: [string, string][];
  onChange: (v: string) => void;
}) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-md">
      {options.map(([val, lbl]) => (
        <button
          key={val}
          type="button"
          onClick={() => onChange(val)}
          className={`rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
            value === val ? "bg-signal text-white" : "text-white/60 hover:text-white"
          }`}
        >
          {lbl}
        </button>
      ))}
    </div>
  );
}
