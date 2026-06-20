"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Reveal from "./Reveal";
import Aurora from "./Aurora";

/*
  Dashboard — a short-term-rental "Command Center".

  A believable rental operations dashboard: unified KPIs (revenue, occupancy,
  ADR, RevPAR with trends), a revenue trend chart, channel mix, a real-dated
  synced calendar, upcoming check-ins/outs, turnovers due, and connected
  sources (incl. Twilio). Interactive — property + date range recompute
  everything. Sample data, but shaped like the real thing.
*/

type Ch = "airbnb" | "vrbo" | "direct";
type Booking = { guest: string; pf: Ch; start: number; nights: number; rate: number };
const A: Ch = "airbnb";
const V: Ch = "vrbo";
const D: Ch = "direct";

type Prop = {
  name: string;
  rev: number;
  occ: number;
  adr: number;
  ch: Record<Ch, number>;
  tr: { rev: number; occ: number; adr: number; revpar: number };
  bookings: Booking[];
};

// `start` is an offset in days from "today" (negative = past). Curated so the
// calendar + upcoming lists look like a real, lived-in booking calendar.
const PROPS: Record<string, Prop> = {
  harbor: {
    name: "Harborview Cottage",
    rev: 9800, occ: 86, adr: 312,
    ch: { airbnb: 55, vrbo: 30, direct: 15 },
    tr: { rev: 12, occ: 5, adr: 3, revpar: 14 },
    bookings: [
      { guest: "The Carlsons", pf: A, start: -9, nights: 4, rate: 305 },
      { guest: "M. Alvarez", pf: V, start: -3, nights: 3, rate: 312 },
      { guest: "J. Whitman", pf: A, start: 1, nights: 5, rate: 328 },
      { guest: "Priya & Sam", pf: D, start: 7, nights: 3, rate: 300 },
      { guest: "The O'Neils", pf: A, start: 12, nights: 4, rate: 340 },
    ],
  },
  light: {
    name: "Lighthouse Loft",
    rev: 7200, occ: 78, adr: 268,
    ch: { airbnb: 62, vrbo: 22, direct: 16 },
    tr: { rev: 9, occ: 2, adr: 5, revpar: 7 },
    bookings: [
      { guest: "R. Bauer", pf: A, start: -6, nights: 3, rate: 255 },
      { guest: "Tara K.", pf: A, start: 0, nights: 2, rate: 268 },
      { guest: "The Days", pf: V, start: 4, nights: 4, rate: 272 },
      { guest: "L. Monroe", pf: D, start: 10, nights: 3, rate: 260 },
    ],
  },
  dock: {
    name: "Dockside Bungalow",
    rev: 6100, occ: 81, adr: 224,
    ch: { airbnb: 48, vrbo: 34, direct: 18 },
    tr: { rev: 15, occ: 7, adr: 2, revpar: 16 },
    bookings: [
      { guest: "Chris P.", pf: V, start: -4, nights: 5, rate: 220 },
      { guest: "The Hales", pf: A, start: 2, nights: 3, rate: 230 },
      { guest: "N. Brooks", pf: A, start: 6, nights: 2, rate: 224 },
      { guest: "Emily R.", pf: D, start: 11, nights: 4, rate: 235 },
    ],
  },
};
const ORDER = ["harbor", "light", "dock"];
const RANGE_FACTOR: Record<string, number> = { "30d": 1, "90d": 2.85, ytd: 8.4 };

const CH_COLOR: Record<Ch, string> = { airbnb: "#ff5a5f", vrbo: "#3b82f6", direct: "#10b981" };
const CH_LABEL: Record<Ch, string> = { airbnb: "Airbnb", vrbo: "VRBO", direct: "Direct" };

const SHAPE = [0.72, 0.85, 0.92, 0.81, 0.95, 1.06];
const SHAPE_SUM = SHAPE.reduce((a, b) => a + b, 0);
const MONTHS = ["Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const money = (n: number) => `$${Math.round(n).toLocaleString()}`;

function aggregate(ids: string[]) {
  const ps = ids.map((k) => PROPS[k]);
  const revSum = ps.reduce((s, p) => s + p.rev, 0);
  const ch = {
    airbnb: Math.round(ps.reduce((s, p) => s + p.ch.airbnb * p.rev, 0) / revSum),
    vrbo: Math.round(ps.reduce((s, p) => s + p.ch.vrbo * p.rev, 0) / revSum),
    direct: 0,
  };
  ch.direct = 100 - ch.airbnb - ch.vrbo;
  return {
    rev: revSum,
    occ: Math.round(ps.reduce((s, p) => s + p.occ, 0) / ps.length),
    adr: Math.round(ps.reduce((s, p) => s + p.adr * p.rev, 0) / revSum),
    ch,
    tr: {
      rev: Math.round(ps.reduce((s, p) => s + p.tr.rev, 0) / ps.length),
      occ: Math.round(ps.reduce((s, p) => s + p.tr.occ, 0) / ps.length),
      adr: Math.round(ps.reduce((s, p) => s + p.tr.adr, 0) / ps.length),
      revpar: Math.round(ps.reduce((s, p) => s + p.tr.revpar, 0) / ps.length),
    },
    bookings: ps.flatMap((p) => p.bookings),
  };
}

const WEEKDAYS = ["S", "M", "T", "W", "T", "F", "S"];

export default function Dashboard() {
  const [prop, setProp] = useState("all");
  const [range, setRange] = useState("30d");

  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);

  const data = useMemo(() => {
    const base = prop === "all" ? aggregate(ORDER) : { ...PROPS[prop] };
    const f = RANGE_FACTOR[range];
    const occ = base.occ;
    const adr = base.adr;
    return {
      rev: base.rev * f,
      occ,
      adr,
      revpar: Math.round((adr * occ) / 100),
      ch: base.ch,
      tr: base.tr,
      bookings: base.bookings,
    };
  }, [prop, range]);

  // Build a day-offset → booking map for the next two weeks.
  const dayMap = useMemo(() => {
    const map = new Map<number, Booking>();
    for (const b of data.bookings) {
      for (let n = 0; n < b.nights; n++) map.set(b.start + n, b);
    }
    return map;
  }, [data]);

  const bars = SHAPE.map((s) => (data.rev * s) / SHAPE_SUM);
  const maxBar = Math.max(...bars);

  const dateFor = (offset: number) => {
    const d = new Date(today);
    d.setDate(d.getDate() + offset);
    return d;
  };
  const fmt = (d: Date) =>
    d.toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" });

  const startPad = today.getDay(); // align first cell to weekday

  return (
    <section id="dash" className="relative overflow-hidden bg-[#08131d] py-16 md:py-24">
      <Aurora intensity={0.7} />
      <div aria-hidden="true" className="pointer-events-none absolute inset-0 bg-[#08131d]/70" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-[var(--color-base)] to-transparent" />
      <div aria-hidden="true" className="pointer-events-none absolute inset-x-0 bottom-0 h-40 bg-gradient-to-b from-transparent to-[var(--color-base)]" />

      <div className="relative z-10 mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="marker mb-4">// Command center</p>
        </Reveal>
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <Reveal>
              <h2 className="display text-2xl text-white sm:text-3xl md:text-4xl [text-shadow:0_2px_24px_rgba(0,0,0,0.5)]">
                Every booking, every platform—one screen.
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-4">
            <Reveal delay={80}>
              <p className="text-base leading-relaxed text-white/70">
                A real operations view for short-term rentals: Airbnb, VRBO, and
                direct bookings, calendars, and payouts—pulled into one live
                dashboard. Switch a property or range and it all updates.
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
              options={[["all", "All properties"], ...ORDER.map((k) => [k, PROPS[k].name] as [string, string])]}
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
            <Kpi label="Revenue" value={data.rev} format={money} delta={data.tr.rev} />
            <Kpi label="Occupancy" value={data.occ} format={(n) => `${Math.round(n)}%`} delta={data.tr.occ} unit="pts" />
            <Kpi label="Avg nightly rate" value={data.adr} format={money} delta={data.tr.adr} />
            <Kpi label="RevPAR" value={data.revpar} format={money} delta={data.tr.revpar} hint="rev / available night" />
          </div>
        </Reveal>

        <div className="mt-4 grid gap-4 lg:grid-cols-5">
          {/* Revenue chart + channel mix */}
          <Reveal delay={200} className="lg:col-span-3">
            <div className="h-full rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-md">
              <div className="mb-5 flex items-center justify-between">
                <p className="font-mono text-[11px] uppercase tracking-widest text-white/50">Revenue trend</p>
                <p className="text-xs text-white/40">last 6 months</p>
              </div>
              <div className="flex h-40 items-end gap-2 sm:gap-3">
                {bars.map((b, i) => (
                  <div key={i} className="group flex flex-1 flex-col items-center gap-2">
                    <div className="relative flex w-full flex-1 items-end">
                      <div
                        className="w-full rounded-t-md bg-gradient-to-t from-signal/40 to-signal transition-all duration-300 group-hover:from-gold/50 group-hover:to-gold"
                        style={{ height: `${(b / maxBar) * 100}%` }}
                      />
                      <span className="pointer-events-none absolute -top-6 left-1/2 -translate-x-1/2 whitespace-nowrap rounded bg-black/80 px-1.5 py-0.5 text-[10px] text-white opacity-0 transition-opacity group-hover:opacity-100">
                        {money(b)}
                      </span>
                    </div>
                    <span className="font-mono text-[10px] text-white/40">{MONTHS[i]}</span>
                  </div>
                ))}
              </div>

              <div className="mt-6 border-t border-white/10 pt-5">
                <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-white/50">Channel mix</p>
                <div className="flex h-2.5 overflow-hidden rounded-full">
                  {(["airbnb", "vrbo", "direct"] as Ch[]).map((c) => (
                    <div key={c} style={{ width: `${data.ch[c]}%`, backgroundColor: CH_COLOR[c] }} />
                  ))}
                </div>
                <div className="mt-3 flex flex-wrap gap-x-5 gap-y-2">
                  {(["airbnb", "vrbo", "direct"] as Ch[]).map((c) => (
                    <span key={c} className="flex items-center gap-2 text-xs text-white/70">
                      <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: CH_COLOR[c] }} />
                      {CH_LABEL[c]} <span className="text-white/40">{data.ch[c]}%</span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </Reveal>

          {/* Synced calendar */}
          <Reveal delay={240} className="lg:col-span-2">
            <div className="h-full rounded-2xl border border-white/10 bg-white/[0.05] p-6 backdrop-blur-md">
              <div className="mb-4 flex items-center justify-between">
                <p className="font-mono text-[11px] uppercase tracking-widest text-white/50">
                  {today.toLocaleDateString("en-US", { month: "long" })} · next 2 weeks
                </p>
                <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/15 px-2.5 py-1 font-mono text-[10px] uppercase tracking-widest text-emerald-300">
                  ⟳ Synced
                </span>
              </div>
              <div className="grid grid-cols-7 gap-1.5">
                {WEEKDAYS.map((d, i) => (
                  <span key={i} className="text-center font-mono text-[10px] text-white/30">{d}</span>
                ))}
                {Array.from({ length: startPad }).map((_, i) => (
                  <span key={`pad-${i}`} />
                ))}
                {Array.from({ length: 14 }).map((_, i) => {
                  const b = dayMap.get(i);
                  const d = dateFor(i);
                  return (
                    <div
                      key={i}
                      title={b ? `${b.guest} · ${CH_LABEL[b.pf]}` : `${fmt(d)} · open`}
                      className="flex aspect-square items-center justify-center rounded-md border border-white/5 text-[10px] transition-transform hover:scale-110"
                      style={{
                        backgroundColor: b ? `${CH_COLOR[b.pf]}33` : "rgba(255,255,255,0.02)",
                        color: b ? CH_COLOR[b.pf] : "rgba(255,255,255,0.3)",
                      }}
                    >
                      {d.getDate()}
                    </div>
                  );
                })}
              </div>
              <p className="mt-4 text-xs leading-relaxed text-white/45">
                Bookings from every channel on one calendar—double-bookings blocked
                automatically.
              </p>
            </div>
          </Reveal>
        </div>

        {/* Compact connected-sources + CTA */}
        <Reveal delay={280}>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-md">
            <p className="text-sm text-white/65">
              Airbnb, VRBO, Stripe, Google Calendar &amp; Twilio—pulled into one live
              view, double-bookings blocked automatically.
            </p>
            <a
              href="#contact"
              className="inline-flex shrink-0 items-center gap-2 text-sm font-semibold text-[#6fd3c6] transition-colors hover:text-white"
            >
              Build my command center →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Kpi({ label, value, format, delta, unit = "%", hint }: { label: string; value: number; format: (n: number) => string; delta: number; unit?: string; hint?: string }) {
  const up = delta >= 0;
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-5 backdrop-blur-md transition-colors hover:border-white/20">
      <p className="font-mono text-[10px] uppercase tracking-widest text-white/40">{label}</p>
      <p className="mt-2 font-display text-2xl text-white sm:text-3xl">
        <CountUp value={value} format={format} />
      </p>
      <p className={`mt-1 text-xs ${up ? "text-emerald-300" : "text-rose-300"}`}>
        {up ? "▲" : "▼"} {Math.abs(delta)}{unit} <span className="text-white/35">{hint ?? "vs prior"}</span>
      </p>
    </div>
  );
}

function CountUp({ value, format }: { value: number; format: (n: number) => string }) {
  const ref = useRef<HTMLSpanElement>(null);
  // Seed with the REAL value so the card is never $0, even if the count-up
  // animation never fires. The animation is enhancement, not the source of truth.
  const [display, setDisplay] = useState(value);
  const started = useRef(false);
  const cur = useRef(value);
  const raf = useRef(0);

  const animate = (from: number, to: number) => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      cur.current = to;
      setDisplay(to);
      return;
    }
    cancelAnimationFrame(raf.current);
    const t0 = performance.now();
    const dur = 650;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - p, 3);
      const v = from + (to - from) * e;
      cur.current = v;
      setDisplay(v);
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
  };

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          animate(0, value); // one-time count-up from zero
        }
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (started.current) animate(cur.current, value);
    else {
      cur.current = value;
      setDisplay(value);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return <span ref={ref}>{format(display)}</span>;
}

function DarkSeg({ value, options, onChange }: { value: string; options: [string, string][]; onChange: (v: string) => void }) {
  return (
    <div className="inline-flex flex-wrap gap-1 rounded-full border border-white/10 bg-white/5 p-1 backdrop-blur-md">
      {options.map(([val, lbl]) => (
        <button
          key={val}
          type="button"
          onClick={() => onChange(val)}
          className={`rounded-full px-3.5 py-2 text-xs font-medium transition-colors ${
            value === val ? "bg-signal text-white" : "text-white/60 hover:text-white"
          }`}
        >
          {lbl}
        </button>
      ))}
    </div>
  );
}
