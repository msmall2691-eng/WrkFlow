"use client";

import { useState } from "react";
import { Label } from "./KitUI";
import { copyToClipboard } from "@/lib/useLocalStorage";
import { useLocalStorage } from "@/lib/useLocalStorage";

/*
  UTMBuilder — paste a link, add campaign tags, copy a tracked URL. Small, but
  every marketer/owner needs it for emails, ads, and social.
*/
export default function UTMBuilder() {
  const [url, setUrl] = useLocalStorage("utm-url", "https://yoursite.com");
  const [source, setSource] = useLocalStorage("utm-source", "instagram");
  const [medium, setMedium] = useLocalStorage("utm-medium", "social");
  const [campaign, setCampaign] = useLocalStorage("utm-campaign", "spring-promo");
  const [term, setTerm] = useLocalStorage("utm-term", "");
  const [content, setContent] = useLocalStorage("utm-content", "");
  const [copied, setCopied] = useState(false);

  let built = url.trim();
  try {
    const u = new URL(/^https?:\/\//.test(built) ? built : `https://${built}`);
    const params = u.searchParams;
    const set = (k: string, v: string) => v.trim() && params.set(k, v.trim());
    set("utm_source", source);
    set("utm_medium", medium);
    set("utm_campaign", campaign);
    set("utm_term", term);
    set("utm_content", content);
    built = u.toString();
  } catch {
    built = url.trim();
  }

  async function copy() {
    if (await copyToClipboard(built)) {
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    }
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 md:items-start">
      {/* Result */}
      <div className="order-1 rounded-2xl border border-line bg-[radial-gradient(120%_120%_at_50%_0%,var(--color-surface)_0%,var(--color-base)_70%)] p-6 md:order-2 md:sticky md:top-24">
        <p className="mb-3 font-mono text-[11px] uppercase tracking-widest text-faint">Tracked link</p>
        <div className="break-all rounded-xl border border-line bg-[#0e1c28] p-4 text-sm text-[#6fd3c6]">
          {built}
        </div>
        <button
          type="button"
          onClick={copy}
          className="mt-4 inline-flex w-full items-center justify-center gap-2 rounded-full bg-signal px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          {copied ? "Copied ✓" : "Copy link"}
        </button>
        <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-widest text-faint">
          Paste into emails, ads, or bios to see what works
        </p>
      </div>

      {/* Controls */}
      <div className="order-2 rounded-2xl border border-line bg-surface p-6 md:order-1">
        <div className="space-y-3">
          <Field label="Website URL" value={url} onChange={setUrl} />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Source (utm_source)" value={source} onChange={setSource} placeholder="instagram" />
            <Field label="Medium (utm_medium)" value={medium} onChange={setMedium} placeholder="social" />
          </div>
          <Field label="Campaign (utm_campaign)" value={campaign} onChange={setCampaign} placeholder="spring-promo" />
          <div className="grid grid-cols-2 gap-3">
            <Field label="Term (optional)" value={term} onChange={setTerm} placeholder="" />
            <Field label="Content (optional)" value={content} onChange={setContent} placeholder="" />
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full rounded-lg border border-line bg-base px-3 py-2 text-sm text-ink placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-signal/40"
      />
    </div>
  );
}
