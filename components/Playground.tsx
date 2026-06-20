"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import CalculatorKit from "./CalculatorKit";
import TipSplit from "./TipSplit";
import PasswordForge from "./PasswordForge";
import QuoteCalc from "./QuoteCalc";
import RateCalc from "./RateCalc";
import SignatureMaker from "./SignatureMaker";

/*
  Playground — a small shelf of genuinely-useful, fully-built mini tools.

  A tab bar swaps between the Calculator construction kit, a Tip & Split
  receipt tool, and a Password Forge. Each is interactive, frontend-only, and
  shows the same care we put into real product UI.
*/

type Tab = "quote" | "rate" | "sig" | "calc" | "tip" | "pw";

const TABS: { id: Tab; label: string; blurb: string }[] = [
  { id: "quote", label: "Instant quote", blurb: "Service + size → a live price range, like a real estimate tool." },
  { id: "rate", label: "What to charge", blurb: "Target income → the hourly rate you actually need." },
  { id: "sig", label: "Email signature", blurb: "Fill it in, copy a styled signature to your clipboard." },
  { id: "calc", label: "Calculator kit", blurb: "A working calculator with a wall of live tweaks." },
  { id: "tip", label: "Tip & Split", blurb: "Split the bill—tip, total, and per-person, instantly." },
  { id: "pw", label: "Password Forge", blurb: "Strong passwords with a live strength meter." },
];

export default function Playground() {
  const [tab, setTab] = useState<Tab>("quote");
  const active = TABS.find((t) => t.id === tab)!;

  return (
    <section id="kit" className="relative border-t border-line py-28 md:py-36">
      <div className="mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="marker mb-6">// Playground</p>
        </Reveal>
        <div className="grid gap-8 md:grid-cols-12 md:items-end">
          <div className="md:col-span-8">
            <Reveal>
              <h2 className="display text-3xl text-ink sm:text-4xl md:text-5xl">
                Little tools, built properly.
              </h2>
            </Reveal>
          </div>
          <div className="md:col-span-4">
            <Reveal delay={80}>
              <p className="text-base leading-relaxed text-muted">
                A few things everyone needs—each fully working and obsessively
                detailed. The same care goes into the real thing we build for you.
              </p>
            </Reveal>
          </div>
        </div>

        {/* Tab bar */}
        <Reveal delay={120}>
          <div className="mt-10 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="inline-flex flex-wrap gap-1 rounded-full border border-line bg-surface p-1">
              {TABS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTab(t.id)}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    tab === t.id ? "bg-signal text-white" : "text-muted hover:text-ink"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <p className="font-mono text-xs text-faint">{active.blurb}</p>
          </div>
        </Reveal>

        <div className="mt-8">
          {tab === "quote" && <QuoteCalc />}
          {tab === "rate" && <RateCalc />}
          {tab === "sig" && <SignatureMaker />}
          {tab === "calc" && <CalculatorKit />}
          {tab === "tip" && <TipSplit />}
          {tab === "pw" && <PasswordForge />}
        </div>
      </div>
    </section>
  );
}
