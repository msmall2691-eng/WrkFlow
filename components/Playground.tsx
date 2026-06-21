"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import AutomationCost from "./AutomationCost";
import SiteCheck from "./SiteCheck";
import SignatureMaker from "./SignatureMaker";
import QRMaker from "./QRCode";
import QuoteCalc from "./QuoteCalc";
import InvoiceMaker from "./InvoiceMaker";
import LinxMark from "./LinxMark";

/*
  Playground — a small set of genuinely useful, free tools. Each one gives the
  visitor something to take with them (a report, a signature, a QR, a quote, an invoice).
*/

type Tool = "sitecheck" | "quote" | "invoice" | "sig" | "qr" | "cost";

const TOOLS: {
  id: Tool;
  label: string;
  blurb: string;
  nudge: { line: string; product: string };
}[] = [
  {
    id: "sitecheck",
    label: "Website check",
    blurb: "Paste any URL → a real Lighthouse speed, SEO & accessibility report.",
    nudge: { line: "Want a site that scores green out of the box?", product: "Linx Site" },
  },
  {
    id: "quote",
    label: "Instant quote",
    blurb: "Service + size → a live price range you can send a customer.",
    nudge: { line: "Want this estimator on your own site?", product: "Linx Quote" },
  },
  {
    id: "invoice",
    label: "Invoice maker",
    blurb: "Build an invoice or proposal → print to a clean PDF in one click.",
    nudge: { line: "Want invoicing wired into your booking flow?", product: "Linx Booking" },
  },
  {
    id: "sig",
    label: "Email signature",
    blurb: "Fill in your details → a styled signature, ready to paste into Gmail or Outlook.",
    nudge: { line: "Need a site to match your new signature?", product: "Linx Site" },
  },
  {
    id: "qr",
    label: "QR code",
    blurb: "Type any link → a real QR code you can download and print.",
    nudge: { line: "Point that QR at a landing page that converts?", product: "Linx Site" },
  },
  {
    id: "cost",
    label: "Cost of manual work",
    blurb: "Hours + people → the yearly cost, and how fast automation pays for itself.",
    nudge: { line: "Ready to hand this busywork to automation?", product: "Linx Flows" },
  },
];

export default function Playground() {
  const [tool, setTool] = useState<Tool>("sitecheck");
  const activeTool = TOOLS.find((t) => t.id === tool)!;

  return (
    <section id="kit" className="relative overflow-hidden border-t border-line py-16 md:py-24">
      <div
        aria-hidden="true"
        className="floaty-slow pointer-events-none absolute -right-24 top-20 h-80 w-80 rounded-full bg-signal/[0.09] blur-[130px]"
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <p className="marker mb-4">// Linx · try one free</p>
        </Reveal>
        <Reveal>
          <h2 className="display text-2xl text-ink sm:text-3xl md:text-4xl">
            Free tools you can actually use—built for trades.
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
            Free, working tools by{" "}
            <span className="inline-flex items-center gap-1.5 align-middle text-ink">
              <LinxMark className="h-3 w-auto" />Linx
            </span>—the same kind we build into the systems behind your website.{" "}
            <a href="/marketplace" className="text-signal transition-opacity hover:opacity-80">
              See the full lineup →
            </a>
          </p>
        </Reveal>

        {/* Tabs */}
        <Reveal delay={120}>
          <div className="mt-8">
            <div className="inline-flex flex-wrap gap-1 rounded-full border border-line bg-surface p-1">
              {TOOLS.map((t) => (
                <button
                  key={t.id}
                  type="button"
                  onClick={() => setTool(t.id)}
                  className={`rounded-full px-4 py-2.5 text-sm font-medium transition-colors ${
                    tool === t.id ? "bg-gold/20 text-gold" : "text-muted hover:text-ink"
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <p className="mt-3 font-mono text-xs text-faint">{activeTool.blurb}</p>
          </div>
        </Reveal>

        <div className="mt-8">
          {tool === "sitecheck" && <SiteCheck />}
          {tool === "quote" && <QuoteCalc />}
          {tool === "invoice" && <InvoiceMaker />}
          {tool === "sig" && <SignatureMaker />}
          {tool === "qr" && <QRMaker />}
          {tool === "cost" && <AutomationCost />}
        </div>

        {/* Soft funnel — free demo → matching Linx product */}
        <Reveal>
          <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-line bg-surface/60 px-4 py-3 text-sm">
            <span className="text-muted">{activeTool.nudge.line}</span>
            <a
              href="/marketplace"
              className="font-semibold text-signal transition-opacity hover:opacity-80"
            >
              {activeTool.nudge.product} →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
