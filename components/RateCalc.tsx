"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { Label, Slider } from "./KitUI";

/*
  RateCalc — a "what should I charge?" calculator (Playground tool).

  Target take-home + expenses + realistic billable hours + a tax/buffer →
  the hourly and day rate you actually need, and what to bill each week.
*/

const money = (n: number) =>
  isFinite(n) ? `$${Math.round(n).toLocaleString()}` : "—";

export default function RateCalc() {
  const [takeHome, setTakeHome] = useState(75000);
  const [expenses, setExpenses] = useState(12000);
  const [hoursPerWeek, setHoursPerWeek] = useState(25);
  const [weeksOff, setWeeksOff] = useState(4);
  const [buffer, setBuffer] = useState(25);

  const weeksWorked = Math.max(1, 52 - weeksOff);
  const billableHours = hoursPerWeek * weeksWorked;
  const gross = (takeHome + expenses) / (1 - buffer / 100);
  const hourly = gross / billableHours;
  const day = hourly * 8;
  const weekly = gross / weeksWorked;

  return (
    <div className="grid gap-8 md:grid-cols-2 md:items-start">
      {/* Result card */}
      <Reveal>
        <div className="order-1 rounded-2xl border border-line bg-[radial-gradient(120%_120%_at_50%_0%,var(--color-surface)_0%,var(--color-base)_70%)] p-8 md:order-2 md:sticky md:top-24">
          <div className="rounded-2xl bg-[#0e1c28] p-7 text-white shadow-[0_18px_50px_-16px_rgba(0,0,0,0.35)]">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/40">
              You should charge
            </p>
            <p className="mt-2 font-display text-5xl tracking-tight">
              {money(hourly)}<span className="text-2xl text-white/40">/hr</span>
            </p>
            <p className="mt-1 text-sm text-white/55">≈ {money(day)} / day (8h)</p>

            <div className="mt-6 space-y-2 border-t border-white/10 pt-5 text-sm">
              <Line k="Bill per week" v={money(weekly)} />
              <Line k="Billable hours / yr" v={Math.round(billableHours).toLocaleString()} />
              <Line k="Revenue target / yr" v={money(gross)} />
            </div>
            <p className="mt-5 text-xs leading-relaxed text-white/45">
              To take home {money(takeHome)} after {money(expenses)} expenses and a{" "}
              {buffer}% tax/buffer.
            </p>
          </div>
        </div>
      </Reveal>

      {/* Controls */}
      <Reveal delay={80}>
        <div className="order-2 rounded-2xl border border-line bg-surface p-6 md:order-1">
          <p className="mb-5 font-mono text-[11px] uppercase tracking-widest text-faint">Your numbers</p>
          <div className="space-y-5">
            <MoneyInput label="Desired take-home / year" value={takeHome} onChange={setTakeHome} />
            <MoneyInput label="Business expenses / year" value={expenses} onChange={setExpenses} />
            <Slider label="Billable hours / week" value={hoursPerWeek} min={5} max={50} suffix=" hrs" onChange={setHoursPerWeek} />
            <Slider label="Weeks off / year" value={weeksOff} min={0} max={12} suffix=" wks" onChange={setWeeksOff} />
            <Slider label="Tax + buffer" value={buffer} min={10} max={45} suffix="%" onChange={setBuffer} />
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function MoneyInput({ label, value, onChange }: { label: string; value: number; onChange: (v: number) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex items-center gap-2 rounded-lg border border-line bg-base px-4 py-3">
        <span className="text-muted">$</span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          step={1000}
          value={value}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
          className="w-full bg-transparent text-sm text-ink focus:outline-none"
        />
      </div>
    </div>
  );
}

function Line({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/55">{k}</span>
      <span className="text-white/85">{v}</span>
    </div>
  );
}
