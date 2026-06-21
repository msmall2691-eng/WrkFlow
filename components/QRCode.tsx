"use client";

import { useEffect, useState } from "react";
import QRCodeLib from "qrcode";
import { Label } from "./KitUI";
import { useLocalStorage } from "@/lib/useLocalStorage";

/*
  QRMaker — type any link or text, get a real QR code you can download as a PNG.
  Genuinely useful: menus, business cards, booking links, wifi, anything.
*/
export default function QRMaker() {
  const [text, setText] = useLocalStorage("qr-text", "https://mlinx.studio");
  const [dark, setDark] = useLocalStorage("qr-dark", "#0b1722");
  const [dataUrl, setDataUrl] = useState("");

  useEffect(() => {
    let cancelled = false;
    QRCodeLib.toDataURL(text.trim() || " ", {
      width: 480,
      margin: 2,
      errorCorrectionLevel: "M",
      color: { dark, light: "#ffffff" },
    })
      .then((url) => {
        if (!cancelled) setDataUrl(url);
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [text, dark]);

  const DARKS = ["#0b1722", "#16a394", "#2563eb", "#7c3aed", "#000000"];

  return (
    <div className="grid gap-8 md:grid-cols-2 md:items-start">
      {/* QR preview */}
      <div className="order-1 rounded-2xl border border-line bg-[radial-gradient(120%_120%_at_50%_0%,var(--color-surface)_0%,var(--color-base)_70%)] p-6 md:order-2 md:sticky md:top-24">
        <div className="mx-auto flex max-w-[280px] items-center justify-center rounded-2xl bg-white p-5">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          {dataUrl && <img src={dataUrl} alt="QR code" className="h-auto w-full" />}
        </div>
        <a
          href={dataUrl || undefined}
          download="qr-code.png"
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-signal px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          Download PNG
        </a>
        <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-widest text-faint">
          Scans on any phone camera
        </p>
      </div>

      {/* Controls */}
      <div className="order-2 rounded-2xl border border-line bg-surface p-6 md:order-1">
        <Label>Link or text</Label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          rows={3}
          placeholder="https://your-link.com  ·  or any text"
          className="w-full rounded-lg border border-line bg-base px-4 py-3 text-sm text-ink placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-signal/40"
        />
        <div className="mt-5">
          <Label>Color</Label>
          <div className="flex flex-wrap gap-2">
            {DARKS.map((c) => (
              <button
                key={c}
                type="button"
                aria-label={`Color ${c}`}
                onClick={() => setDark(c)}
                className={`h-7 w-7 rounded-full border-2 transition-transform hover:scale-110 ${
                  dark === c ? "border-ink" : "border-transparent"
                }`}
                style={{ backgroundColor: c }}
              />
            ))}
          </div>
        </div>
        <p className="mt-5 text-xs leading-relaxed text-faint">
          Put it on a flyer, a menu, a business card, or a booking link—it updates
          live as you type.
        </p>
      </div>
    </div>
  );
}
