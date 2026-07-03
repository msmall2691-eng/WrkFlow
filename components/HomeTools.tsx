"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import QuoteCalc from "./QuoteCalc";
import SignatureMaker from "./SignatureMaker";
import QRMaker from "./QRCode";
import InvoiceMaker from "./InvoiceMaker";
import SiteCheck from "./SiteCheck";
import AutomationCost from "./AutomationCost";

/*
  HomeTools — a free little playground: simple, genuinely useful tools we built,
  free to use with nothing to wire up. The polished, tuned-to-your-business
  versions live in the marketplace (M Linx).
*/
type Tool = "quote" | "sig" | "qr" | "invoice" | "sitecheck" | "cost";

const TABS: { id: Tool; label: string; blurb: string }[] = [
  { id: "quote", label: "Instant quote", blurb: "Service + size → a live price range you can send a customer. (Tuned to your pricing? That's the marketplace.)" },
  { id: "invoice", label: "Invoice maker", blurb: "Fill in the details → a clean, printable invoice or proposal PDF in one click." },
  { id: "sig", label: "Email signature", blurb: "Your details → a styled signature, ready to paste into Gmail or Outlook." },
  { id: "qr", label: "QR code", blurb: "Any link — or your WiFi — into a real QR code to download & print." },
  { id: "sitecheck", label: "Website check", blurb: "Paste any URL → a real Google Lighthouse speed, SEO & accessibility report." },
  { id: "cost", label: "Cost of busywork", blurb: "Hours + people → what manual work costs a year, and how fast automating it pays off." },
];

export default function HomeTools() {
  const [tool, setTool] = useState<Tool>("quote");
  const active = TABS.find((t) => t.id === tool)!;

  return (
    <section id="tools" className="relative overflow-hidden border-t border-line bg-[var(--section-alt-bg)] py-16 md:py-20">
      <div
        aria-hidden="true"
        className="floaty-slow pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-signal/[0.05] blur-[130px]"
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="mb-3 font-mono text-[10px] uppercase tracking-[0.2em] text-signal">
            Free tools
          </p>
        </Reveal>
        <Reveal>
          <h2 className="display text-2xl text-ink sm:text-3xl md:text-4xl">
            Free tools. Try them out.
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
            A playground of simple, genuinely useful tools — free, no signup,
            nothing to wire up. Want one tuned to your pricing and branding and
            built into your site? That&apos;s{" "}
            <a href="/marketplace" className="text-signal transition-opacity hover:opacity-80">
              M Linx, our marketplace →
            </a>
          </p>
        </Reveal>

        <Reveal delay={120}>
          <div className="mt-8 flex flex-wrap gap-2">
            {TABS.map((t) => (
              <button
                key={t.id}
                type="button"
                onClick={() => setTool(t.id)}
                aria-pressed={tool === t.id}
                className={`rounded-full border px-4 py-2 text-sm font-medium transition-all active:scale-[0.96] ${
                  tool === t.id
                    ? "border-gold/40 bg-gold/15 text-gold shadow-[0_0_24px_-8px_rgba(217,164,65,0.5)]"
                    : "border-line bg-surface text-muted hover:border-signal/40 hover:text-ink"
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
          <p className="mt-3 font-mono text-xs text-faint">{active.blurb}</p>
        </Reveal>

        <div className="mt-6">
          {tool === "quote" && <QuoteCalc />}
          {tool === "invoice" && <InvoiceMaker />}
          {tool === "sig" && <SignatureMaker />}
          {tool === "qr" && <QRMaker />}
          {tool === "sitecheck" && <SiteCheck />}
          {tool === "cost" && <AutomationCost />}
        </div>
      </div>
    </section>
  );
}
