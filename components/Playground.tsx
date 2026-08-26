"use client";

import { useEffect, useState } from "react";
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
import { trackTool } from "@/lib/track";

/*
  Playground — a small set of genuinely useful, free tools. Each one gives the
  visitor something to take with them (a report, a signature, a QR, a quote, an invoice).

  Lives on the homepage (id="tools" — CommandPalette's "Free tools" command and
  WorkflowSpine's rail scroll here). MarketCatalog's "Use it free" links point
  at /#tools too.
*/

type Tool = "sitecheck" | "quote" | "invoice" | "sig" | "vcard" | "qr" | "utm" | "cost";
type Group = "Win & bill" | "Brand & share" | "Site & ops";

const TOOLS: {
  id: Tool;
  label: string;
  blurb: string;
  group: Group;
  nudge: { line: string; cta: string; href: string };
}[] = [
  {
    id: "quote",
    label: "Instant quote",
    blurb: "Service + size → a live price range you can send a customer.",
    group: "Win & bill",
    nudge: { line: "Tuned to your pricing? That's the marketplace.", cta: "M Linx Quote", href: "/marketplace" },
  },
  {
    id: "invoice",
    label: "Invoice maker",
    blurb: "Build an invoice or proposal → print to a clean PDF in one click.",
    group: "Win & bill",
    nudge: { line: "Want invoices that send and track themselves? That's a custom build.", cta: "Tell me what you need", href: "/#contact" },
  },
  {
    id: "sig",
    label: "Email signature",
    blurb: "Fill in your details → a styled signature, ready to paste into Gmail or Outlook.",
    group: "Brand & share",
    nudge: { line: "Want your whole brand looking this sharp? That's a custom build.", cta: "Start a conversation", href: "/#contact" },
  },
  {
    id: "vcard",
    label: "Digital card",
    blurb: "Your details → a .vcf and a scan-to-save QR for cards, emails & signatures.",
    group: "Brand & share",
    nudge: { line: "Want a real site behind that card? That's the marketplace.", cta: "M Linx Site", href: "/marketplace" },
  },
  {
    id: "qr",
    label: "QR code",
    blurb: "Any link—or your WiFi—into a real QR code to download & print.",
    group: "Brand & share",
    nudge: { line: "Want that QR pointed at a page built to convert? That's the marketplace.", cta: "M Linx Site", href: "/marketplace" },
  },
  {
    id: "utm",
    label: "Tracked link",
    blurb: "Add campaign tags to any link → a tracked URL for emails, ads & bios.",
    group: "Brand & share",
    nudge: { line: "Want links tracked and reported automatically? That's the marketplace.", cta: "M Linx Flows", href: "/marketplace" },
  },
  {
    id: "sitecheck",
    label: "Website check",
    blurb: "Paste any URL → a real Lighthouse speed, SEO & accessibility report.",
    group: "Site & ops",
    nudge: { line: "Want the fixes done, not just found?", cta: "Start a conversation", href: "/#contact" },
  },
  {
    id: "cost",
    label: "Cost of manual work",
    blurb: "Hours + people → the yearly cost, and how fast automation pays for itself.",
    group: "Site & ops",
    nudge: { line: "Want that time back? This is exactly what M Studio automates.", cta: "Start a conversation", href: "/#contact" },
  },
];

const GROUPS: Group[] = ["Win & bill", "Brand & share", "Site & ops"];

export default function Playground() {
  const [tool, setTool] = useState<Tool>("quote");
  const activeTool = TOOLS.find((t) => t.id === tool)!;

  // Track the default tool as "opened" once on mount, then again on every
  // tab switch — so Meg can see which free tools get looked at.
  useEffect(() => {
    trackTool(tool, "opened");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function selectTool(id: Tool) {
    setTool(id);
    trackTool(id, "opened");
  }

  return (
    <section id="tools" className="relative overflow-hidden border-t border-line py-14 md:py-20">
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
            The same{" "}
            <span className="inline-flex items-center gap-1.5 align-middle text-ink">
              <LinxMark className="h-3 w-auto" />M Linx
            </span>{" "}
            tools we build into client systems — free to use here.
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
                        onClick={() => selectTool(t.id)}
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

        {/* Soft funnel — one-sentence bridge from free tool → the paid work */}
        <Reveal>
          <div className="mt-6 flex flex-wrap items-center gap-x-2 gap-y-1 rounded-xl border border-line bg-surface/60 px-4 py-3 text-sm">
            <span className="text-muted">{activeTool.nudge.line}</span>
            <a
              href={activeTool.nudge.href}
              className="font-semibold text-signal transition-opacity hover:opacity-80"
            >
              {activeTool.nudge.cta} →
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
