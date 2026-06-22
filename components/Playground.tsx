"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import AutomationCost from "./AutomationCost";
import SiteCheck from "./SiteCheck";
import SignatureMaker from "./SignatureMaker";
import QRMaker from "./QRCode";
import QuoteCalc from "./QuoteCalc";
import InvoiceMaker from "./InvoiceMaker";
import VCard from "./VCard";
import UTMBuilder from "./UTMBuilder";
import LinxMark from "./LinxMark";

/*
  Playground — a small set of genuinely useful, free tools. Each one gives the
  visitor something to take with them (a report, a signature, a QR, a quote, an invoice).
*/

type Tool = "sitecheck" | "quote" | "invoice" | "sig" | "vcard" | "qr" | "utm" | "cost";
type Group = "Win & bill" | "Brand & share" | "Site & ops";

const TOOLS: {
  id: Tool;
  label: string;
  blurb: string;
  group: Group;
  nudge: { line: string; product: string };
}[] = [
  {
    id: "quote",
    label: "Instant quote",
    blurb: "Service + size → a live price range you can send a customer.",
    group: "Win & bill",
    nudge: { line: "Want this estimator on your own site?", product: "M Linx Quote" },
  },
  {
    id: "invoice",
    label: "Invoice maker",
    blurb: "Build an invoice or proposal → print to a clean PDF in one click.",
    group: "Win & bill",
    nudge: { line: "Want invoicing wired into your booking flow?", product: "M Linx Booking" },
  },
  {
    id: "sig",
    label: "Email signature",
    blurb: "Fill in your details → a styled signature, ready to paste into Gmail or Outlook.",
    group: "Brand & share",
    nudge: { line: "Need a site to match your new signature?", product: "M Linx Site" },
  },
  {
    id: "vcard",
    label: "Digital card",
    blurb: "Your details → a .vcf and a scan-to-save QR for cards, emails & signatures.",
    group: "Brand & share",
    nudge: { line: "Want a real one-page site behind that card?", product: "M Linx Site" },
  },
  {
    id: "qr",
    label: "QR code",
    blurb: "Any link—or your WiFi—into a real QR code to download & print.",
    group: "Brand & share",
    nudge: { line: "Point that QR at a landing page that converts?", product: "M Linx Site" },
  },
  {
    id: "utm",
    label: "Tracked link",
    blurb: "Add campaign tags to any link → a tracked URL for emails, ads & bios.",
    group: "Brand & share",
    nudge: { line: "Want these tracked and reported automatically?", product: "M Linx Flows" },
  },
  {
    id: "sitecheck",
    label: "Website check",
    blurb: "Paste any URL → a real Lighthouse speed, SEO & accessibility report.",
    group: "Site & ops",
    nudge: { line: "Want a site that scores green out of the box?", product: "M Linx Site" },
  },
  {
    id: "cost",
    label: "Cost of manual work",
    blurb: "Hours + people → the yearly cost, and how fast automation pays for itself.",
    group: "Site & ops",
    nudge: { line: "Ready to hand this busywork to automation?", product: "M Linx Flows" },
  },
];

const GROUPS: Group[] = ["Win & bill", "Brand & share", "Site & ops"];

export default function Playground() {
  const [tool, setTool] = useState<Tool>("quote");
  const activeTool = TOOLS.find((t) => t.id === tool)!;

  return (
    <section id="kit" className="relative overflow-hidden border-t border-line py-14 md:py-20">
      <div
        aria-hidden="true"
        className="floaty-slow pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-signal/[0.05] blur-[130px]"
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <h2 className="display text-2xl text-ink sm:text-3xl md:text-4xl">
            Free tools. No signup. Built for trades.
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
            Real tools from{" "}
            <span className="inline-flex items-center gap-1.5 align-middle text-ink">
              <LinxMark className="h-3 w-auto" />M Linx
            </span>, the same ones I build into client systems. Use them as much as
            you want.{" "}
            <a href="/marketplace" className="text-signal transition-opacity hover:opacity-80">
              See the full lineup →
            </a>
          </p>
        </Reveal>

        {/* Tabs — grouped; each tool is its own clean pill */}
        <Reveal delay={120}>
          <div className="mt-8 flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-3">
              {GROUPS.map((g) => (
                <div key={g} className="flex flex-col gap-2.5">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-faint">{g}</span>
                  <div className="flex flex-wrap gap-2">
                    {TOOLS.filter((t) => t.group === g).map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTool(t.id)}
                        className={`rounded-full border px-4 py-2 text-sm font-medium transition-colors ${
                          tool === t.id
                            ? "border-gold/40 bg-gold/15 text-gold"
                            : "border-line bg-surface text-muted hover:border-signal/40 hover:text-ink"
                        }`}
                      >
                        {t.label}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="font-mono text-xs text-faint">{activeTool.blurb}</p>
          </div>
        </Reveal>

        <div className="mt-8">
          {tool === "sitecheck" && <SiteCheck />}
          {tool === "quote" && <QuoteCalc />}
          {tool === "invoice" && <InvoiceMaker />}
          {tool === "sig" && <SignatureMaker />}
          {tool === "vcard" && <VCard />}
          {tool === "qr" && <QRMaker />}
          {tool === "utm" && <UTMBuilder />}
          {tool === "cost" && <AutomationCost />}
        </div>

        {/* Soft funnel — free demo → matching M Linx product */}
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
