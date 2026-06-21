"use client";

import { useEffect, useState } from "react";
import QRCodeLib from "qrcode";
import { Label } from "./KitUI";
import { useLocalStorage } from "@/lib/useLocalStorage";

/*
  VCard — a digital business card. Fill it in → download a .vcf (saves straight
  to Contacts) and a scan-to-save QR for cards, emails, and signatures.
*/
const vEsc = (s: string) => s.replace(/([\\,;])/g, "\\$1").replace(/\n/g, "\\n");

export default function VCard() {
  const [name, setName] = useLocalStorage("vc-name", "Your Name");
  const [title, setTitle] = useLocalStorage("vc-title", "Founder");
  const [company, setCompany] = useLocalStorage("vc-company", "Your Company");
  const [phone, setPhone] = useLocalStorage("vc-phone", "(207) 555-0100");
  const [email, setEmail] = useLocalStorage("vc-email", "you@company.com");
  const [site, setSite] = useLocalStorage("vc-site", "company.com");
  const [qr, setQr] = useState("");

  const siteUrl = site ? (/^https?:\/\//.test(site) ? site : `https://${site}`) : "";
  const vcf = [
    "BEGIN:VCARD",
    "VERSION:3.0",
    `FN:${vEsc(name)}`,
    company && `ORG:${vEsc(company)}`,
    title && `TITLE:${vEsc(title)}`,
    phone && `TEL;TYPE=CELL:${vEsc(phone)}`,
    email && `EMAIL;TYPE=WORK:${vEsc(email)}`,
    siteUrl && `URL:${vEsc(siteUrl)}`,
    "END:VCARD",
  ]
    .filter(Boolean)
    .join("\n");

  useEffect(() => {
    let cancelled = false;
    QRCodeLib.toDataURL(vcf, { width: 480, margin: 2, color: { dark: "#0b1722", light: "#ffffff" } })
      .then((u) => !cancelled && setQr(u))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [vcf]);

  function download() {
    const blob = new Blob([vcf], { type: "text/vcard;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${name.replace(/\s+/g, "-").toLowerCase() || "contact"}.vcf`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 md:items-start">
      {/* Card + QR */}
      <div className="order-1 rounded-2xl border border-line bg-[radial-gradient(120%_120%_at_50%_0%,var(--color-surface)_0%,var(--color-base)_70%)] p-6 md:order-2 md:sticky md:top-24">
        <div className="rounded-2xl bg-[#0e1c28] p-6 text-white shadow-[0_18px_50px_-16px_rgba(0,0,0,0.35)]">
          <div className="flex items-start justify-between gap-4">
            <div>
              <p className="font-display text-xl">{name || "Your Name"}</p>
              <p className="text-sm text-white/55">{[title, company].filter(Boolean).join(" · ")}</p>
            </div>
            <div className="shrink-0 rounded-lg bg-white p-1.5">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              {qr && <img src={qr} alt="Scan to save contact" className="h-16 w-16" />}
            </div>
          </div>
          <div className="mt-5 space-y-1 border-t border-white/10 pt-4 text-sm text-white/80">
            {email && <p>{email}</p>}
            {phone && <p>{phone}</p>}
            {site && <p className="text-[#6fd3c6]">{site}</p>}
          </div>
        </div>
        <button
          type="button"
          onClick={download}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-signal px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          Download contact card (.vcf)
        </button>
        <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-widest text-faint">
          Scan the QR to save — works in any signature or on a card
        </p>
      </div>

      {/* Controls */}
      <div className="order-2 rounded-2xl border border-line bg-surface p-6 md:order-1">
        <p className="mb-5 font-mono text-[11px] uppercase tracking-widest text-faint">Your details</p>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Name" value={name} onChange={setName} />
          <Field label="Title" value={title} onChange={setTitle} />
          <Field label="Company" value={company} onChange={setCompany} />
          <Field label="Phone" value={phone} onChange={setPhone} />
          <Field label="Email" value={email} onChange={setEmail} />
          <Field label="Website" value={site} onChange={setSite} />
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
