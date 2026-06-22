"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import QuoteCalc from "./QuoteCalc";
import SignatureMaker from "./SignatureMaker";
import QRMaker from "./QRCode";
import SiteCheck from "./SiteCheck";

/*
  HomeTools — a small, fun "have a play" beat. A curated handful of the free
  M Linx tools, live and inline, so a visitor gets to actually use the kind of
  software M Studio builds. The full lineup lives on /marketplace.
*/
type Tool = "quote" | "sig" | "qr" | "sitecheck";

const TABS: { id: Tool; label: string; blurb: string }[] = [
  { id: "quote", label: "Instant quote", blurb: "Service + size → a live price range you can send a customer." },
  { id: "sig", label: "Email signature", blurb: "Your details → a styled signature, ready to paste into Gmail or Outlook." },
  { id: "qr", label: "QR code", blurb: "Any link — or your WiFi — into a real QR code to download & print." },
  { id: "sitecheck", label: "Website check", blurb: "Paste any URL → a real Lighthouse speed, SEO & accessibility report." },
];

export default function HomeTools() {
  const [tool, setTool] = useState<Tool>("quote");
  const active = TABS.find((t) => t.id === tool)!;

  return (
    <section id="tools" className="relative overflow-hidden border-t border-line bg-[#0e1d2b] py-14 md:py-20">
      <div
        aria-hidden="true"
        className="floaty-slow pointer-events-none absolute -right-24 top-20 h-72 w-72 rounded-full bg-signal/[0.05] blur-[130px]"
      />
      <div className="relative mx-auto max-w-6xl px-6">
        <Reveal>
          <h2 className="display text-2xl text-ink sm:text-3xl md:text-4xl">
            Free tools. Have a play.
          </h2>
        </Reveal>
        <Reveal delay={80}>
          <p className="mt-3 max-w-xl text-base leading-relaxed text-muted">
            Real tools M Studio builds — free to use, right here, no signup.{" "}
            <a href="/marketplace" className="text-signal transition-opacity hover:opacity-80">
              See the full lineup on M Linx →
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
          <p className="mt-3 font-mono text-xs text-faint">{active.blurb}</p>
        </Reveal>

        <div className="mt-8">
          {tool === "quote" && <QuoteCalc />}
          {tool === "sig" && <SignatureMaker />}
          {tool === "qr" && <QRMaker />}
          {tool === "sitecheck" && <SiteCheck />}
        </div>
      </div>
    </section>
  );
}
