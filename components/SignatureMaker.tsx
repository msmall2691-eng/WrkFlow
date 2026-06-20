"use client";

import { useState } from "react";
import Reveal from "./Reveal";
import { Label, Seg, Toggle } from "./KitUI";

/*
  SignatureMaker — an email signature generator (Playground tool).

  Fill your details, pick a layout + accent, and copy a styled signature
  straight to the clipboard as rich HTML (pastes into Gmail/Outlook intact).
*/

type Fields = {
  name: string;
  title: string;
  company: string;
  phone: string;
  email: string;
  website: string;
};

const ACCENTS = ["#2563eb", "#10b981", "#8b5cf6", "#f59e0b", "#f43f5e", "#0f172a"];

function buildHtml(f: Fields, accent: string, layout: "stacked" | "inline", divider: boolean): string {
  const site = f.website.replace(/^https?:\/\//, "");
  const contact =
    layout === "inline"
      ? [f.phone, f.email, site].filter(Boolean).join("&nbsp;&nbsp;•&nbsp;&nbsp;")
      : [f.phone, f.email, site].filter(Boolean).join("<br/>");
  return `<table cellpadding="0" cellspacing="0" style="font-family:Arial,Helvetica,sans-serif;color:#18181b;font-size:13px;line-height:1.5;border-collapse:collapse">
  <tr>
    ${divider ? `<td style="border-left:3px solid ${accent};padding:2px 14px 2px 0"></td>` : ""}
    <td style="padding:0">
      <div style="font-size:15px;font-weight:700;color:#18181b">${f.name || ""}</div>
      <div style="color:#52525b">${[f.title, f.company].filter(Boolean).join(", ")}</div>
      <div style="margin-top:6px;color:#52525b">
        ${
          layout === "inline"
            ? contact.replace(site, `<a href="https://${site}" style="color:${accent};text-decoration:none">${site}</a>`)
            : [f.phone, f.email]
                .filter(Boolean)
                .map((x) => `<div>${x}</div>`)
                .join("") +
              (site ? `<div><a href="https://${site}" style="color:${accent};text-decoration:none">${site}</a></div>` : "")
        }
      </div>
    </td>
  </tr>
</table>`;
}

export default function SignatureMaker() {
  const [f, setF] = useState<Fields>({
    name: "Jordan Avery",
    title: "Owner",
    company: "Bright & Tidy Co.",
    phone: "(207) 555-0142",
    email: "jordan@brighttidy.co",
    website: "brighttidy.co",
  });
  const [accent, setAccent] = useState(ACCENTS[0]);
  const [layout, setLayout] = useState<"stacked" | "inline">("stacked");
  const [divider, setDivider] = useState(true);
  const [copied, setCopied] = useState(false);
  const set = <K extends keyof Fields>(k: K, v: string) => setF((p) => ({ ...p, [k]: v }));

  const site = f.website.replace(/^https?:\/\//, "");

  const copy = async () => {
    const html = buildHtml(f, accent, layout, divider);
    const plain = [f.name, [f.title, f.company].filter(Boolean).join(", "), f.phone, f.email, site]
      .filter(Boolean)
      .join("\n");
    try {
      if (navigator.clipboard && "write" in navigator.clipboard && typeof ClipboardItem !== "undefined") {
        await navigator.clipboard.write([
          new ClipboardItem({
            "text/html": new Blob([html], { type: "text/html" }),
            "text/plain": new Blob([plain], { type: "text/plain" }),
          }),
        ]);
      } else {
        await navigator.clipboard.writeText(plain);
      }
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch {
      /* clipboard blocked — ignore */
    }
  };

  return (
    <div className="grid gap-8 md:grid-cols-2 md:items-start">
      {/* Live preview */}
      <Reveal>
        <div className="order-1 rounded-2xl border border-line bg-[radial-gradient(120%_120%_at_50%_0%,var(--color-surface)_0%,var(--color-base)_70%)] p-8 md:order-2 md:sticky md:top-24">
          <div className="rounded-xl bg-white p-6 shadow-[0_18px_50px_-16px_rgba(0,0,0,0.25)]">
            <p className="mb-4 font-mono text-[10px] uppercase tracking-widest text-faint">Preview</p>
            <div className="flex" style={{ fontFamily: "Arial, Helvetica, sans-serif" }}>
              {divider && <div className="mr-3.5" style={{ borderLeft: `3px solid ${accent}` }} />}
              <div className="text-[13px] leading-relaxed text-[#18181b]">
                <div className="text-[15px] font-bold">{f.name}</div>
                <div className="text-[#52525b]">{[f.title, f.company].filter(Boolean).join(", ")}</div>
                <div className="mt-1.5 text-[#52525b]">
                  {layout === "inline" ? (
                    <span>
                      {[f.phone, f.email].filter(Boolean).join("  •  ")}
                      {site && (f.phone || f.email) ? "  •  " : ""}
                      {site && <a href={`https://${site}`} style={{ color: accent, textDecoration: "none" }}>{site}</a>}
                    </span>
                  ) : (
                    <>
                      {f.phone && <div>{f.phone}</div>}
                      {f.email && <div>{f.email}</div>}
                      {site && <div><a href={`https://${site}`} style={{ color: accent, textDecoration: "none" }}>{site}</a></div>}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={copy}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-signal px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            {copied ? "Copied to clipboard ✓" : "Copy signature"}
          </button>
          <p className="mt-2 text-center text-xs text-faint">Paste into Gmail or Outlook—styling intact.</p>
        </div>
      </Reveal>

      {/* Controls */}
      <Reveal delay={80}>
        <div className="order-2 rounded-2xl border border-line bg-surface p-6 md:order-1">
          <p className="mb-5 font-mono text-[11px] uppercase tracking-widest text-faint">Your details</p>
          <div className="space-y-4">
            <Field label="Name" value={f.name} onChange={(v) => set("name", v)} />
            <div className="grid grid-cols-2 gap-3">
              <Field label="Title" value={f.title} onChange={(v) => set("title", v)} />
              <Field label="Company" value={f.company} onChange={(v) => set("company", v)} />
            </div>
            <Field label="Phone" value={f.phone} onChange={(v) => set("phone", v)} />
            <Field label="Email" value={f.email} onChange={(v) => set("email", v)} />
            <Field label="Website" value={f.website} onChange={(v) => set("website", v)} />

            <div className="pt-1">
              <Label>Accent</Label>
              <div className="flex items-center gap-2">
                {ACCENTS.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={`accent ${c}`}
                    onClick={() => setAccent(c)}
                    className={`h-7 w-7 rounded-full ring-2 ring-offset-2 ring-offset-surface transition ${accent === c ? "ring-ink" : "ring-transparent"}`}
                    style={{ backgroundColor: c }}
                  />
                ))}
              </div>
            </div>

            <Seg label="Layout" value={layout} onChange={setLayout} options={[["stacked", "Stacked"], ["inline", "Inline"]]} />
            <Toggle label="Accent divider bar" checked={divider} onChange={setDivider} />
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-line bg-base px-4 py-2.5 text-sm text-ink focus:border-signal/60 focus:outline-none"
      />
    </div>
  );
}
