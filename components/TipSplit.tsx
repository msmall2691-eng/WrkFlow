"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { Label, Slider, Toggle } from "./KitUI";

/*
  TipSplit — a bill tip + split calculator Playground tool.

  Enter the bill, pick a tip, split across people. A live "receipt" shows the
  tip, total, and per-person amount. Round-up rolls the per-person to a whole
  dollar and back-fills the total.
*/

const TIP_PRESETS = [15, 18, 20, 25];
const money = (n: number) => `$${n.toFixed(2)}`;

export default function TipSplit() {
  const [bill, setBill] = useState("84.50");
  const [tip, setTip] = useState(20);
  const [people, setPeople] = useState(3);
  const [roundUp, setRoundUp] = useState(false);

  const billNum = Math.max(0, parseFloat(bill) || 0);
  const tipAmount = (billNum * tip) / 100;
  let total = billNum + tipAmount;
  let perPerson = people > 0 ? total / people : total;
  if (roundUp) {
    perPerson = Math.ceil(perPerson);
    total = perPerson * people;
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 md:items-start">
      {/* Receipt stage */}
      <Reveal>
        <div className="order-1 flex justify-center rounded-2xl border border-line bg-[radial-gradient(120%_120%_at_50%_0%,var(--color-surface)_0%,var(--color-base)_70%)] p-8 md:order-2 md:sticky md:top-24">
          <div className="w-full max-w-[340px] rounded-2xl bg-[#0e1c28] p-7 text-white shadow-[0_18px_50px_-16px_rgba(0,0,0,0.35)]">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/40">
              Receipt
            </p>
            <div className="mt-5 space-y-3 border-b border-dashed border-white/15 pb-5 text-sm">
              <Row k="Bill" v={money(billNum)} />
              <Row k={`Tip (${tip}%)`} v={money(tipAmount)} />
              <Row k="Total" v={money(total)} strong />
              <Row k="People" v={`${people}`} />
            </div>
            <div className="mt-5">
              <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-[#6fd3c6]">
                Each person pays
              </p>
              <p className="mt-1 font-display text-5xl tracking-tight">
                {money(perPerson)}
              </p>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Controls */}
      <Reveal delay={80}>
        <div className="order-2 rounded-2xl border border-line bg-surface p-6 md:order-1">
          <p className="mb-5 font-mono text-[11px] uppercase tracking-widest text-faint">
            Controls
          </p>

          <div className="space-y-5">
            <div>
              <Label>Bill amount</Label>
              <div className="flex items-center gap-2 rounded-lg border border-line bg-base px-4 py-3">
                <span className="text-muted">$</span>
                <input
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.01"
                  value={bill}
                  onChange={(e) => setBill(e.target.value)}
                  className="w-full bg-transparent text-sm text-ink focus:outline-none"
                  placeholder="0.00"
                />
              </div>
            </div>

            <div>
              <Slider label="Tip" value={tip} min={0} max={30} suffix="%" onChange={setTip} />
              <div className="mt-3 flex flex-wrap gap-2">
                {TIP_PRESETS.map((p) => (
                  <button
                    key={p}
                    type="button"
                    onClick={() => setTip(p)}
                    className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
                      tip === p
                        ? "bg-signal text-white"
                        : "border border-line text-muted hover:text-ink"
                    }`}
                  >
                    {p}%
                  </button>
                ))}
              </div>
            </div>

            <Slider label="Split between" value={people} min={1} max={12} suffix={people === 1 ? " person" : " people"} onChange={setPeople} />

            <Toggle label="Round up per person" checked={roundUp} onChange={setRoundUp} />
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function Row({ k, v, strong = false }: { k: string; v: string; strong?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/55">{k}</span>
      <span className={strong ? "font-semibold text-white" : "text-white/85"}>{v}</span>
    </div>
  );
}
