"use client";

import Script from "next/script";
import Link from "next/link";
import { useEffect, useState } from "react";
import { track } from "@vercel/analytics";
import { requestOffer } from "@/lib/offer";

/*
  The real Instant Quote plug-in (public/embed/quote.js), running on this
  page exactly as it would on a client's site, in demo mode so nothing is
  sent. Sample prices for an invented roofing company, labelled as such.
*/

const DEMO_CONFIG = {
  business: "Sample Roofing",
  color: "#1d4ed8",
  title: "Price your roof",
  demo: true,
  services: [
    { name: "Leak repair", base: 350, perUnit: 0 },
    { name: "Full replacement", base: 1800, perUnit: 450, unit: "square", min: 10, max: 60, start: 22 },
    { name: "Gutters", base: 200, perUnit: 9, unit: "foot", min: 40, max: 300, step: 10, start: 120 },
  ],
  extras: [
    { name: "Haul away old roofing", price: 400 },
    { name: "Ice and water shield", price: 650 },
  ],
};

declare global {
  interface Window {
    MStudioQuote?: { init: () => void };
  }
}

export function LiveQuotePlugin() {
  // A client-side navigation onto this page mounts the div after the script
  // has already run once, so ask it to look again.
  useEffect(() => {
    window.MStudioQuote?.init();
  }, []);
  return (
    <>
      <div data-mstudio-quote>
        <script type="application/json" dangerouslySetInnerHTML={{ __html: JSON.stringify(DEMO_CONFIG) }} />
      </div>
      <Script src="/embed/quote.js" strategy="afterInteractive" onReady={() => window.MStudioQuote?.init()} />
    </>
  );
}

export function CopySnippet({ code, label }: { code: string; label: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <div className="overflow-hidden rounded-xl border border-[var(--cp-hairline)] bg-[color:var(--cp-fill)]">
      <div className="flex items-center justify-between border-b border-[var(--cp-hairline)] px-4 py-2">
        <span className="text-[12.5px] font-medium text-[color:var(--cp-faint)]">{label}</span>
        <button
          type="button"
          onClick={() => {
            navigator.clipboard?.writeText(code).then(() => {
              setCopied(true);
              setTimeout(() => setCopied(false), 1600);
            });
          }}
          className="min-h-8 rounded-md px-2.5 text-[12.5px] font-semibold text-[color:var(--cp-violet-ink)] hover:bg-[color:var(--cp-fill-strong)]"
        >
          {copied ? "Copied" : "Copy"}
        </button>
      </div>
      <pre className="m-0 overflow-x-auto p-4 font-mono text-[12.5px] leading-relaxed text-[color:var(--cp-soft)]">
        <code>{code}</code>
      </pre>
    </div>
  );
}

export function GetPlugin({ label, strong }: { label: string; strong?: boolean }) {
  return (
    <Link
      href="#contact"
      data-offer="quote"
      onClick={() => {
        requestOffer("quote", "From the plug-ins page: Instant Quote");
        try {
          track("plugin_ask", { plugin: "instant-quote" });
        } catch {
          /* best-effort */
        }
      }}
      className={
        strong
          ? "cp-cta inline-flex min-h-11 items-center rounded-xl px-5 text-[15px] font-semibold text-white no-underline"
          : "inline-flex min-h-11 items-center text-[14.5px] font-semibold text-[color:var(--cp-violet-ink)] no-underline hover:underline"
      }
    >
      {label}
    </Link>
  );
}
