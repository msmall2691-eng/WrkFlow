"use client";

import Reveal from "./Reveal";
import { Label, Slider, Seg, Toggle } from "./KitUI";
import SaveResult from "./SaveResult";
import { useLocalStorage } from "@/lib/useLocalStorage";

/*
  QuoteCalc — an instant service-quote estimator (Playground tool).

  Service type + home size + add-ons + frequency → a live price range. Mirrors
  the kind of "instant estimate" tool we build for service businesses.
*/

type Service = "standard" | "deep" | "moveout";
type Freq = "onetime" | "monthly" | "biweekly" | "weekly";

const SERVICE: Record<Service, { label: string; base: number }> = {
  standard: { label: "Standard", base: 90 },
  deep: { label: "Deep clean", base: 150 },
  moveout: { label: "Move-out", base: 220 },
};
const FREQ: Record<Freq, { label: string; off: number }> = {
  onetime: { label: "One-time", off: 0 },
  monthly: { label: "Monthly", off: 0.05 },
  biweekly: { label: "Bi-weekly", off: 0.1 },
  weekly: { label: "Weekly", off: 0.15 },
};
const ADDONS: { key: keyof Addons; label: string; price: number }[] = [
  { key: "fridge", label: "Inside fridge", price: 25 },
  { key: "oven", label: "Inside oven", price: 30 },
  { key: "windows", label: "Interior windows", price: 40 },
  { key: "laundry", label: "Laundry", price: 20 },
];
type Addons = { fridge: boolean; oven: boolean; windows: boolean; laundry: boolean };

const money = (n: number) => `$${Math.round(n)}`;

export default function QuoteCalc() {
  const [service, setService] = useLocalStorage<Service>("tool-quote-service", "standard");
  const [beds, setBeds] = useLocalStorage("tool-quote-beds", 3);
  const [baths, setBaths] = useLocalStorage("tool-quote-baths", 2);
  const [freq, setFreq] = useLocalStorage<Freq>("tool-quote-freq", "biweekly");
  const [addons, setAddons] = useLocalStorage<Addons>("tool-quote-addons", { fridge: false, oven: false, windows: false, laundry: false });

  const addonTotal = ADDONS.reduce((s, a) => (addons[a.key] ? s + a.price : s), 0);
  const subtotal = SERVICE[service].base + beds * 18 + baths * 22 + addonTotal;
  const total = subtotal * (1 - FREQ[freq].off);
  const low = total * 0.92;
  const high = total * 1.08;

  const chosenAddons = ADDONS.filter((a) => addons[a.key]).map((a) => a.label);
  const summary = [
    "M Studio — Instant Quote",
    "",
    `Service:    ${SERVICE[service].label}`,
    `Home:       ${beds} bed · ${baths} bath`,
    `Frequency:  ${FREQ[freq].label}${FREQ[freq].off > 0 ? ` (${Math.round(FREQ[freq].off * 100)}% recurring discount)` : ""}`,
    `Add-ons:    ${chosenAddons.length ? chosenAddons.join(", ") : "none"}`,
    "",
    `Estimated:  ${money(low)}–${money(high)}`,
    "",
    "Estimate generated at mlinx.studio",
  ].join("\n");

  return (
    <div className="grid gap-8 md:grid-cols-2 md:items-start">
      {/* Estimate card */}
      <Reveal>
        <div className="order-1 rounded-2xl border border-line bg-[radial-gradient(120%_120%_at_50%_0%,var(--color-surface)_0%,var(--color-base)_70%)] p-8 md:order-2 md:sticky md:top-24">
          <div className="rounded-2xl bg-[#0e1c28] p-7 text-white shadow-[0_18px_50px_-16px_rgba(0,0,0,0.35)]">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/40">
              Estimated price
            </p>
            <p className="mt-2 font-display text-4xl tracking-tight">
              {money(low)}<span className="text-white/40">–</span>{money(high)}
            </p>
            <p className="mt-1 text-sm text-white/55">
              {SERVICE[service].label} · {FREQ[freq].label.toLowerCase()}
              {FREQ[freq].off > 0 && (
                <span className="text-[#6fd3c6]"> · {Math.round(FREQ[freq].off * 100)}% recurring discount</span>
              )}
            </p>

            <div className="mt-6 space-y-2 border-t border-white/10 pt-5 text-sm">
              <Line k={`${SERVICE[service].label} base`} v={money(SERVICE[service].base)} />
              <Line k={`${beds} bed · ${baths} bath`} v={money(beds * 18 + baths * 22)} />
              {addonTotal > 0 && <Line k="Add-ons" v={money(addonTotal)} />}
            </div>

            <a
              href="#contact"
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-signal px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
            >
              Request this quote →
            </a>

            <SaveResult summary={summary} filename="mstudio-quote" />
          </div>
        </div>
      </Reveal>

      {/* Controls */}
      <Reveal delay={80}>
        <div className="order-2 rounded-2xl border border-line bg-surface p-6 md:order-1">
          <p className="mb-5 font-mono text-[11px] uppercase tracking-widest text-faint">Your home</p>
          <div className="space-y-5">
            <Seg label="Service" value={service} onChange={setService} options={[["standard", "Standard"], ["deep", "Deep clean"], ["moveout", "Move-out"]]} />
            <Slider label="Bedrooms" value={beds} min={1} max={6} onChange={setBeds} />
            <Slider label="Bathrooms" value={baths} min={1} max={5} onChange={setBaths} />
            <Seg label="Frequency" value={freq} onChange={setFreq} options={[["onetime", "One-time"], ["biweekly", "Bi-weekly"], ["monthly", "Monthly"], ["weekly", "Weekly"]]} />
            <div>
              <Label>Add-ons</Label>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {ADDONS.map((a) => (
                  <Toggle
                    key={a.key}
                    label={`${a.label} +$${a.price}`}
                    checked={addons[a.key]}
                    onChange={(v) => setAddons((p) => ({ ...p, [a.key]: v }))}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </Reveal>
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
