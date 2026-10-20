"use client";

import { useState } from "react";
import { Label } from "./KitUI";
import { useLocalStorage } from "@/lib/useLocalStorage";
import { toolsStamp } from "@/lib/content";
import { trackTool } from "@/lib/track";
import ToolEmailCapture from "./ToolEmailCapture";

/*
  SignatureMaker — fill in your details, get a styled email signature you can
  paste straight into Gmail/Outlook (copies rich HTML), or grab the raw HTML.
*/

const ACCENTS = ["#16a394", "#2563eb", "#d9a441", "#e5645a", "#7c3aed", "#0f172a"];

function esc(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
}

export default function SignatureMaker() {
  const [name, setName] = useLocalStorage("sig-name", "Your Name");
  const [title, setTitle] = useLocalStorage("sig-title", "Founder");
  const [company, setCompany] = useLocalStorage("sig-company", "Your Company");
  const [email, setEmail] = useLocalStorage("sig-email", "you@company.com");
  const [phone, setPhone] = useLocalStorage("sig-phone", "(207) 555-0100");
  const [site, setSite] = useLocalStorage("sig-site", "company.com");
  const [accent, setAccent] = useLocalStorage("sig-accent", ACCENTS[0]);
  const [copied, setCopied] = useState<"" | "rich" | "html">("");

  const sub = [title, company].filter(Boolean).join(" · ");
  const siteHref = site ? (/^https?:\/\//.test(site) ? site : `https://${site}`) : "";

  const html =
    `<table cellpadding="0" cellspacing="0" style="font-family:Arial,Helvetica,sans-serif;color:#1a1a1a;font-size:14px;line-height:1.5;"><tr><td>` +
    `<div style="font-weight:700;font-size:16px;color:#111;">${esc(name)}</div>` +
    (sub ? `<div style="color:#666;font-size:13px;">${esc(sub)}</div>` : "") +
    `<div style="margin-top:10px;padding-left:12px;border-left:3px solid ${accent};">` +
    (email ? `<div><a href="mailto:${esc(email)}" style="color:${accent};text-decoration:none;">${esc(email)}</a></div>` : "") +
    (phone ? `<div style="color:#444;">${esc(phone)}</div>` : "") +
    (site ? `<div><a href="${esc(siteHref)}" style="color:${accent};text-decoration:none;">${esc(site)}</a></div>` : "") +
    `</div></td></tr></table>`;

  const plain = [name, sub, email, phone, site].filter(Boolean).join("\n");

  async function copyRich() {
    try {
      await navigator.clipboard.write([
        new ClipboardItem({
          "text/html": new Blob([html], { type: "text/html" }),
          "text/plain": new Blob([plain], { type: "text/plain" }),
        }),
      ]);
      flash("rich");
    } catch {
      try {
        await navigator.clipboard.writeText(plain);
        flash("rich");
      } catch {
        /* ignore */
      }
    }
  }
  async function copyHtml() {
    try {
      await navigator.clipboard.writeText(html);
      flash("html");
    } catch {
      /* ignore */
    }
  }
  function flash(which: "rich" | "html") {
    setCopied(which);
    trackTool("sig", "copied");
    window.setTimeout(() => setCopied(""), 1800);
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 md:items-start">
      {/* Preview */}
      <div className="order-1 rounded-2xl border border-line bg-[radial-gradient(120%_120%_at_50%_0%,var(--color-surface)_0%,var(--color-base)_70%)] p-6 md:order-2 md:sticky md:top-24">
        <p className="mb-3 text-sm font-semibold text-ink">Preview</p>
        <div className="rounded-xl bg-white p-6">
          <div dangerouslySetInnerHTML={{ __html: html }} />
        </div>
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={copyRich}
            className="inline-flex items-center gap-2 rounded-full bg-signal px-5 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            {copied === "rich" ? "Copied ✓" : "Copy signature"}
          </button>
          <button
            type="button"
            onClick={copyHtml}
            className="inline-flex items-center gap-2 rounded-full border border-line bg-base px-4 py-2.5 text-xs font-medium text-muted transition-colors hover:border-signal/60 hover:text-ink"
          >
            {copied === "html" ? "Copied ✓" : "Copy HTML"}
          </button>
        </div>
        <p className="mt-3 text-xs text-faint">
          Paste into Gmail or Outlook settings
        </p>
        <div className="mt-4">
          <ToolEmailCapture
            tool="sig"
            toolLabel="Email signature"
            summary={`${plain}\n\n—\n${toolsStamp}`}
          />
        </div>
      </div>

      {/* Controls */}
      <div className="order-2 rounded-2xl border border-line bg-surface p-6 md:order-1">
        <p className="mb-5 text-sm font-semibold text-ink">Your details</p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Name" value={name} onChange={setName} />
          <Field label="Title" value={title} onChange={setTitle} />
          <Field label="Company" value={company} onChange={setCompany} />
          <Field label="Email" value={email} onChange={setEmail} />
          <Field label="Phone" value={phone} onChange={setPhone} />
          <Field label="Website" value={site} onChange={setSite} />
        </div>
        <div className="mt-5">
          <Label>Accent</Label>
          <div className="flex flex-wrap gap-2">
            {ACCENTS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Accent ${c}`}
                onClick={() => setAccent(c)}
                className={`h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 ${
                  accent === c ? "border-ink" : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-line bg-base px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-signal/40"
      />
    </div>
  );
}
