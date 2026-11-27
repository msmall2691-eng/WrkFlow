"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Label, Slider, Seg, Toggle } from "./KitUI";
import { requestOffer } from "@/lib/offer";
import SaveResult from "./SaveResult";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { trackTool } from "@/lib/track";

/*
  QuoteCalc — an instant service-quote estimator. Industry + service tier +
  size + add-ons + frequency → a live price range. The kind of "get a price
  now" tool we build into trades / cleaning / STR-turnover sites.

  Tiers, size fields, and add-ons are config per industry below — reasonable
  placeholder numbers for Lawn care / Handyman / Pet care (Cleaning is the
  original, real-world-tuned tier). Meg: tune INDUSTRIES after launch.
*/

type Industry = "cleaning" | "lawn" | "handyman" | "petcare";
type Freq = "onetime" | "monthly" | "biweekly" | "weekly";

type Tier = { key: string; label: string; base: number };
type SizeField = { key: string; label: string; min: number; max: number; step?: number; perUnit: number };
type Addon = { key: string; label: string; price: number };
type IndustryConfig = { label: string; tiers: Tier[]; sizeFields: SizeField[]; addons: Addon[] };

const INDUSTRIES: Record<Industry, IndustryConfig> = {
  cleaning: {
    label: "Cleaning",
    tiers: [
      { key: "standard", label: "Standard", base: 90 },
      { key: "deep", label: "Deep clean", base: 150 },
      { key: "moveout", label: "Move-out / make-ready", base: 220 },
    ],
    sizeFields: [
      { key: "beds", label: "Bedrooms", min: 1, max: 6, perUnit: 18 },
      { key: "baths", label: "Bathrooms", min: 1, max: 5, perUnit: 22 },
    ],
    addons: [
      { key: "fridge", label: "Inside fridge", price: 25 },
      { key: "oven", label: "Inside oven", price: 30 },
      { key: "windows", label: "Interior windows", price: 40 },
      { key: "laundry", label: "Laundry", price: 20 },
    ],
  },
  lawn: {
    label: "Lawn care",
    tiers: [
      { key: "mow", label: "Mow & trim", base: 45 },
      { key: "full", label: "Full service", base: 85 },
      { key: "cleanup", label: "Seasonal cleanup", base: 150 },
    ],
    sizeFields: [{ key: "size", label: "Lot size (k sq ft)", min: 1, max: 20, perUnit: 6 }],
    addons: [
      { key: "edging", label: "Edging", price: 15 },
      { key: "mulch", label: "Mulch refresh", price: 60 },
      { key: "leaf", label: "Leaf removal", price: 35 },
    ],
  },
  handyman: {
    label: "Handyman",
    tiers: [
      { key: "small", label: "Small job (under 2 hrs)", base: 120 },
      { key: "half", label: "Half day", base: 280 },
      { key: "full", label: "Full day", base: 520 },
    ],
    sizeFields: [{ key: "rooms", label: "Rooms involved", min: 1, max: 6, perUnit: 15 }],
    addons: [
      { key: "materials", label: "Materials run", price: 40 },
      { key: "haul", label: "Debris haul-away", price: 50 },
    ],
  },
  petcare: {
    label: "Pet care",
    tiers: [
      { key: "walk", label: "Dog walk (30 min)", base: 25 },
      { key: "visit", label: "Drop-in visit", base: 30 },
      { key: "overnight", label: "Overnight sitting", base: 75 },
    ],
    sizeFields: [{ key: "pets", label: "Number of pets", min: 1, max: 5, perUnit: 8 }],
    addons: [
      { key: "meds", label: "Medication admin", price: 10 },
      { key: "extra", label: "Extra daily visit", price: 20 },
    ],
  },
};

const FREQ: Record<Freq, { label: string; off: number }> = {
  onetime: { label: "One-time", off: 0 },
  monthly: { label: "Monthly", off: 0.05 },
  biweekly: { label: "Bi-weekly", off: 0.1 },
  weekly: { label: "Weekly", off: 0.15 },
};

const money = (n: number) => `$${Math.round(n)}`;

function defaultSizeValues(cfg: IndustryConfig): Record<string, number> {
  return Object.fromEntries(cfg.sizeFields.map((f) => [f.key, Math.ceil((f.min + f.max) / 2)]));
}
function defaultAddons(cfg: IndustryConfig): Record<string, boolean> {
  return Object.fromEntries(cfg.addons.map((a) => [a.key, false]));
}

export default function QuoteCalc() {
  const [industry, setIndustry] = useLocalStorage<Industry>("q-industry", "cleaning");
  const config = INDUSTRIES[industry];

  // Tier / size / add-ons reset to the new industry's defaults on switch —
  // a job at one industry's config almost never maps onto another's fields.
  const [tier, setTier] = useState(config.tiers[0].key);
  const [sizeValues, setSizeValues] = useState<Record<string, number>>(() => defaultSizeValues(config));
  const [addons, setAddons] = useState<Record<string, boolean>>(() => defaultAddons(config));
  const [freq, setFreq] = useLocalStorage<Freq>("q-freq", "biweekly");

  useEffect(() => {
    const cfg = INDUSTRIES[industry];
    setTier(cfg.tiers[0].key);
    setSizeValues(defaultSizeValues(cfg));
    setAddons(defaultAddons(cfg));
  }, [industry]);

  function selectIndustry(next: Industry) {
    setIndustry(next);
    trackTool("quote", "opened");
  }

  const tierConfig = config.tiers.find((t) => t.key === tier) ?? config.tiers[0];
  const sizeTotal = config.sizeFields.reduce((s, f) => s + (sizeValues[f.key] ?? f.min) * f.perUnit, 0);
  const addonTotal = config.addons.reduce((s, a) => (addons[a.key] ? s + a.price : s), 0);
  const subtotal = tierConfig.base + sizeTotal + addonTotal;
  const total = subtotal * (1 - FREQ[freq].off);
  const low = total * 0.92;
  const high = total * 1.08;

  const chosenAddons = config.addons.filter((a) => addons[a.key]).map((a) => a.label);
  const sizeSummary = config.sizeFields
    .map((f) => `${sizeValues[f.key] ?? f.min} ${f.label.toLowerCase()}`)
    .join(" · ");

  const summary = [
    `Instant quote — ${config.label}`,
    "",
    `Service:    ${tierConfig.label}`,
    `Size:       ${sizeSummary}`,
    `Frequency:  ${FREQ[freq].label}${FREQ[freq].off > 0 ? ` (${Math.round(FREQ[freq].off * 100)}% off)` : ""}`,
    `Add-ons:    ${chosenAddons.length ? chosenAddons.join(", ") : "none"}`,
    "",
    `Estimate:   ${money(low)}–${money(high)}`,
  ].join("\n");

  return (
    <div className="grid gap-8 md:grid-cols-2 md:items-start">
      {/* Controls — left: adjust the job */}
              <div className="rounded-2xl border border-line bg-surface p-6">
          <p className="mb-5 text-[11.5px] font-medium uppercase tracking-widest text-faint">The job</p>
          <div className="space-y-5">
            <Seg
              label="Industry"
              value={industry}
              onChange={selectIndustry}
              options={[["cleaning", "Cleaning"], ["lawn", "Lawn care"], ["handyman", "Handyman"], ["petcare", "Pet care"]]}
            />
            <Seg
              label="Service"
              value={tier}
              onChange={setTier}
              options={config.tiers.map((t) => [t.key, t.label] as [string, string])}
            />
            {config.sizeFields.map((f) => (
              <Slider
                key={f.key}
                label={f.label}
                value={sizeValues[f.key] ?? f.min}
                min={f.min}
                max={f.max}
                step={f.step}
                onChange={(v) => setSizeValues((p) => ({ ...p, [f.key]: v }))}
              />
            ))}
            <Seg label="Frequency" value={freq} onChange={setFreq} options={[["onetime", "One-time"], ["biweekly", "Bi-weekly"], ["monthly", "Monthly"], ["weekly", "Weekly"]]} />
            <div>
              <Label>Add-ons</Label>
              <div className="grid grid-cols-2 gap-x-4 gap-y-3">
                {config.addons.map((a) => (
                  <Toggle
                    key={a.key}
                    label={`${a.label} +$${a.price}`}
                    checked={addons[a.key] ?? false}
                    onChange={(v) => setAddons((p) => ({ ...p, [a.key]: v }))}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

      {/* Result — right: the live price */}
              <div className="rounded-2xl border border-line bg-[radial-gradient(120%_120%_at_50%_0%,var(--color-surface)_0%,var(--color-base)_70%)] p-8 md:sticky md:top-24">
          <div className="rounded-2xl border border-line bg-elevated p-7 text-ink shadow-[0_18px_50px_-16px_rgba(11,23,34,0.25)]">
            <p className="text-[11.5px] font-medium uppercase tracking-[0.2em] text-faint">Estimated price</p>
            <p className="mt-2 font-display text-4xl tracking-tight">
              {money(low)}<span className="text-faint">–</span>{money(high)}
            </p>
            <p className="mt-1 text-sm text-muted">
              {config.label} · {tierConfig.label} · {FREQ[freq].label.toLowerCase()}
              {FREQ[freq].off > 0 && (
                <span className="text-signal"> · {Math.round(FREQ[freq].off * 100)}% recurring discount</span>
              )}
            </p>
            <div className="mt-6 space-y-2 border-t border-line pt-5 text-sm">
              <Line k={`${tierConfig.label} base`} v={money(tierConfig.base)} />
              <Line k={sizeSummary} v={money(sizeTotal)} />
              {addonTotal > 0 && <Line k="Add-ons" v={money(addonTotal)} />}
            </div>
            {/* Carries the quote they just built into the contact box, rather
                than dropping it at the anchor (site survey O-02). The tools
                live on /tools, which has no contact section, so this goes to
                the homepage form; requestOffer stashes the quote for it. */}
            <Link
              href="/?offer=quote#contact"
              onClick={() => requestOffer("quote", summary)}
              className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-signal px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 active:scale-[0.98]"
            >
              Request this quote →
            </Link>
            <SaveResult summary={summary} filename="instant-quote" tool="quote" toolLabel="Instant quote" />
          </div>
        </div>
    </div>
  );
}

function Line({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-muted">{k}</span>
      <span className="text-ink">{v}</span>
    </div>
  );
}
