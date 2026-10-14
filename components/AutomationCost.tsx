"use client";
import { Label, Slider } from "./KitUI";
import SaveResult from "./SaveResult";
import { useLocalStorage } from "@/lib/useLocalStorage";

/*
  AutomationCost — "What's manual work costing you?" (Playground tool).

  People × hours/week of repetitive work × loaded hourly cost → the annual cost
  of doing it by hand, and what's recoverable once it's automated. Mirrors the
  conversation we have before building a workflow.
*/

const money = (n: number) =>
  isFinite(n) ? `$${Math.round(n).toLocaleString()}` : "—";

export default function AutomationCost() {
  const [people, setPeople] = useLocalStorage("tool-cost-people", 2);
  const [hours, setHours] = useLocalStorage("tool-cost-hours", 8);
  const [rate, setRate] = useLocalStorage("tool-cost-rate", 35);
  const [automatable, setAutomatable] = useLocalStorage("tool-cost-automatable", 60);
  const [invest, setInvest] = useLocalStorage("tool-cost-invest", 3000);

  const weeklyHours = people * hours;
  const annualHours = weeklyHours * 52;
  const annualCost = annualHours * rate;
  const recoverableHours = annualHours * (automatable / 100);
  const recoverable = recoverableHours * rate;

  const monthlyRecoverable = recoverable / 12;
  const breakEvenMonths =
    invest > 0 && monthlyRecoverable > 0 ? invest / monthlyRecoverable : null;
  const breakEvenLabel =
    breakEvenMonths == null
      ? "—"
      : breakEvenMonths < 1
        ? "under a month"
        : `${Math.ceil(breakEvenMonths)} ${Math.ceil(breakEvenMonths) === 1 ? "month" : "months"}`;
  const firstYearNet = recoverable - invest;

  const summary = [
    "M Studio — What's manual work costing you?",
    "",
    `People on the task:    ${people}`,
    `Hours/week each:       ${hours}`,
    `Loaded hourly cost:    ${money(rate)}/hr`,
    `Share automatable:     ${automatable}%`,
    `Automation setup:      ${money(invest)} (one-time)`,
    "",
    `Manual hours/year:     ${Math.round(annualHours).toLocaleString()}`,
    `Annual cost of manual: ${money(annualCost)}`,
    `Recoverable/year:      ${money(recoverable)} (${Math.round(recoverableHours).toLocaleString()} hrs)`,
    `Pays for itself in:    ${breakEvenLabel}`,
    `Net in year one:       ${money(firstYearNet)}`,
    "",
    "Estimated at mlinx.studio",
  ].join("\n");

  return (
    <div className="grid gap-8 md:grid-cols-2 md:items-start">
      {/* Result card */}
              <div className="order-1 rounded-2xl border border-line bg-[radial-gradient(120%_120%_at_50%_0%,var(--color-surface)_0%,var(--color-base)_70%)] p-8 md:order-2 md:sticky md:top-24">
          <div className="rounded-2xl bg-[#0e1c28] p-7 text-white shadow-[0_18px_50px_-16px_rgba(0,0,0,0.35)]">
            <p className="text-sm text-white/60">
              Manual work is costing you
            </p>
            <p className="mt-2 font-display text-4xl tracking-tight">
              {money(annualCost)}<span className="text-xl text-white/40">/yr</span>
            </p>
            <p className="mt-1 text-sm text-white/55">
              ≈ {Math.round(annualHours).toLocaleString()} hours a year, by hand
            </p>

            <div className="mt-6 space-y-2 border-t border-white/10 pt-5 text-sm">
              <Line k="Recoverable with automation" v={money(recoverable)} highlight />
              <Line k="Hours you'd get back / yr" v={Math.round(recoverableHours).toLocaleString()} />
              <Line k="Hours lost / week" v={Math.round(weeklyHours).toLocaleString()} />
            </div>

            {/* Break-even / ROI */}
            {breakEvenMonths != null && (
              <div className="mt-5 rounded-xl border border-signal/30 bg-signal/10 p-4">
                <p className="text-xs text-white/55">A {money(invest)} automation pays for itself in</p>
                <p className="mt-0.5 font-display text-2xl text-[#6fd3c6]">{breakEvenLabel}</p>
                <p className="mt-1 text-xs text-white/45">
                  then nets {money(firstYearNet)} back in the first year.
                </p>
              </div>
            )}

            <p className="mt-4 text-xs leading-relaxed text-white/45">
              Based on {people} {people === 1 ? "person" : "people"} spending {hours} hrs/week each at{" "}
              {money(rate)}/hr, with {automatable}% of it automatable.
            </p>

            <a
              href="/#contact"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-signal px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Let&apos;s recover this →
            </a>

            <SaveResult summary={summary} filename="mstudio-automation-cost" tool="cost" toolLabel="Cost of busywork" />
          </div>
        </div>

      {/* Controls */}
              <div className="order-2 rounded-2xl border border-line bg-surface p-6 md:order-1">
          <p className="mb-5 text-sm font-semibold text-ink">Your numbers</p>
          <div className="space-y-5">
            <Slider label="People doing the task" value={people} min={1} max={20} onChange={setPeople} />
            <Slider label="Hours/week each (repetitive work)" value={hours} min={1} max={40} suffix=" hrs" onChange={setHours} />
            <MoneyInput label="Loaded hourly cost (wage + overhead)" value={rate} onChange={setRate} />
            <Slider label="Share that's automatable" value={automatable} min={10} max={95} suffix="%" onChange={setAutomatable} />
            <MoneyInput label="Automation setup (one-time)" value={invest} step={500} suffix="" onChange={setInvest} />
          </div>
        </div>
    </div>
  );
}

function MoneyInput({
  label,
  value,
  onChange,
  step = 5,
  suffix = "/hr",
}: {
  label: string;
  value: number;
  onChange: (v: number) => void;
  step?: number;
  suffix?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <div className="flex items-center gap-2 rounded-lg border border-line bg-base px-4 py-3">
        <span className="text-muted">$</span>
        <input
          type="number"
          inputMode="numeric"
          min={0}
          step={step}
          value={value}
          onChange={(e) => onChange(Math.max(0, Number(e.target.value)))}
          className="w-full bg-transparent text-sm text-ink focus:outline-none"
        />
        {suffix && <span className="text-faint text-sm">{suffix}</span>}
      </div>
    </div>
  );
}

function Line({ k, v, highlight = false }: { k: string; v: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-white/55">{k}</span>
      <span className={highlight ? "font-semibold text-[#6fd3c6]" : "text-white/85"}>{v}</span>
    </div>
  );
}
