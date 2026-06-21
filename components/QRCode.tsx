"use client";

import { useEffect, useState } from "react";
import QRCodeLib from "qrcode";
import { Label, Seg, Toggle } from "./KitUI";
import { useLocalStorage } from "@/lib/useLocalStorage";

/*
  QRMaker — type a link (or WiFi details) and get a real QR you can download as
  a PNG. WiFi mode builds the standard WIFI: payload guests scan to auto-join.
*/
type Mode = "link" | "wifi";
type Sec = "WPA" | "WEP" | "nopass";

const DARKS = ["#0b1722", "#16a394", "#2563eb", "#7c3aed", "#000000"];

// Escape per the WIFI: QR spec (\ ; , : " all get a leading backslash).
const wifiEsc = (s: string) => s.replace(/([\\;,:"])/g, "\\$1");

export default function QRMaker() {
  const [mode, setMode] = useLocalStorage<Mode>("qr-mode", "link");
  const [text, setText] = useLocalStorage("qr-text", "https://mlinx.studio");
  const [ssid, setSsid] = useLocalStorage("qr-ssid", "Cottage WiFi");
  const [pwd, setPwd] = useLocalStorage("qr-pwd", "welcome2maine");
  const [sec, setSec] = useLocalStorage<Sec>("qr-sec", "WPA");
  const [hidden, setHidden] = useLocalStorage("qr-hidden", false);
  const [dark, setDark] = useLocalStorage("qr-dark", "#0b1722");
  const [dataUrl, setDataUrl] = useState("");

  const payload =
    mode === "wifi"
      ? `WIFI:T:${sec};S:${wifiEsc(ssid)};P:${sec === "nopass" ? "" : wifiEsc(pwd)};${hidden ? "H:true;" : ""};`
      : text;

  useEffect(() => {
    let cancelled = false;
    QRCodeLib.toDataURL(payload.trim() || " ", {
      width: 480,
      margin: 2,
      errorCorrectionLevel: "M",
      color: { dark, light: "#ffffff" },
    })
      .then((url) => !cancelled && setDataUrl(url))
      .catch(() => {});
    return () => {
      cancelled = true;
    };
  }, [payload, dark]);

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
          download={mode === "wifi" ? "wifi-qr.png" : "qr-code.png"}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-signal px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
        >
          Download PNG
        </a>
        <p className="mt-3 text-center font-mono text-[10px] uppercase tracking-widest text-faint">
          {mode === "wifi" ? "Guests scan to join your WiFi" : "Scans on any phone camera"}
        </p>
      </div>

      {/* Controls */}
      <div className="order-2 rounded-2xl border border-line bg-surface p-6 md:order-1">
        <div className="mb-5">
          <Seg
            value={mode}
            onChange={setMode}
            options={[["link", "Link / text"], ["wifi", "WiFi"]]}
          />
        </div>

        {mode === "link" ? (
          <>
            <Label>Link or text</Label>
            <textarea
              value={text}
              onChange={(e) => setText(e.target.value)}
              rows={3}
              placeholder="https://your-link.com  ·  or any text"
              className="w-full rounded-lg border border-line bg-base px-4 py-3 text-sm text-ink placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-signal/40"
            />
          </>
        ) : (
          <div className="space-y-4">
            <div>
              <Label>Network name (SSID)</Label>
              <input
                value={ssid}
                onChange={(e) => setSsid(e.target.value)}
                className="w-full rounded-lg border border-line bg-base px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-signal/40"
              />
            </div>
            {sec !== "nopass" && (
              <div>
                <Label>Password</Label>
                <input
                  value={pwd}
                  onChange={(e) => setPwd(e.target.value)}
                  className="w-full rounded-lg border border-line bg-base px-4 py-2.5 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-signal/40"
                />
              </div>
            )}
            <Seg
              label="Security"
              value={sec}
              onChange={setSec}
              options={[["WPA", "WPA/WPA2"], ["WEP", "WEP"], ["nopass", "None"]]}
            />
            <Toggle label="Hidden network" checked={hidden} onChange={setHidden} />
          </div>
        )}

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
          {mode === "wifi"
            ? "Print it for the rental, the shop, or the front desk—guests scan and they're on, no typing."
            : "Put it on a flyer, a menu, a business card, or a booking link—it updates live as you type."}
        </p>
      </div>
    </div>
  );
}
