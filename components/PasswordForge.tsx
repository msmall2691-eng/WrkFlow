"use client";

import { useCallback, useEffect, useState } from "react";
import Reveal from "./Reveal";
import { Slider, Toggle } from "./KitUI";

/*
  PasswordForge — a password generator Playground tool.

  Length + character-set toggles, a live entropy-based strength meter, and a
  one-click copy. Regenerates on any change. Uses crypto.getRandomValues.
*/

const SETS = {
  lower: "abcdefghijklmnopqrstuvwxyz",
  upper: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  numbers: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.?/",
};
const AMBIGUOUS = /[Il1O0o]/g;

type Opts = {
  length: number;
  lower: boolean;
  upper: boolean;
  numbers: boolean;
  symbols: boolean;
  noAmbiguous: boolean;
};

function generate(o: Opts): string {
  let pool = "";
  if (o.lower) pool += SETS.lower;
  if (o.upper) pool += SETS.upper;
  if (o.numbers) pool += SETS.numbers;
  if (o.symbols) pool += SETS.symbols;
  if (o.noAmbiguous) pool = pool.replace(AMBIGUOUS, "");
  if (!pool) return "";
  const arr = new Uint32Array(o.length);
  crypto.getRandomValues(arr);
  let out = "";
  for (let i = 0; i < o.length; i++) out += pool[arr[i] % pool.length];
  return out;
}

function strength(o: Opts): { label: string; pct: number; color: string } {
  let poolSize = 0;
  if (o.lower) poolSize += 26;
  if (o.upper) poolSize += 26;
  if (o.numbers) poolSize += 10;
  if (o.symbols) poolSize += 24;
  if (o.noAmbiguous) poolSize = Math.max(1, poolSize - 6);
  const bits = poolSize > 1 ? o.length * Math.log2(poolSize) : 0;
  const pct = Math.min(100, Math.round((bits / 120) * 100));
  if (bits < 40) return { label: "Weak", pct, color: "#f43f5e" };
  if (bits < 70) return { label: "Fair", pct, color: "#f59e0b" };
  if (bits < 100) return { label: "Strong", pct, color: "#10b981" };
  return { label: "Fortress", pct, color: "#2563eb" };
}

export default function PasswordForge() {
  const [o, setO] = useState<Opts>({
    length: 18,
    lower: true,
    upper: true,
    numbers: true,
    symbols: true,
    noAmbiguous: false,
  });
  const [pw, setPw] = useState("");
  const [copied, setCopied] = useState(false);
  const set = <K extends keyof Opts>(k: K, v: Opts[K]) => setO((p) => ({ ...p, [k]: v }));

  const regen = useCallback(() => {
    setPw(generate(o));
    setCopied(false);
  }, [o]);

  useEffect(() => {
    regen();
  }, [regen]);

  const copy = async () => {
    if (!pw) return;
    try {
      await navigator.clipboard.writeText(pw);
      setCopied(true);
      setTimeout(() => setCopied(false), 1600);
    } catch {
      /* clipboard blocked — ignore */
    }
  };

  const s = strength(o);
  const noneSelected = !o.lower && !o.upper && !o.numbers && !o.symbols;

  return (
    <div className="grid gap-8 md:grid-cols-2 md:items-start">
      {/* Output stage */}
      <Reveal>
        <div className="order-1 rounded-2xl border border-line bg-[radial-gradient(120%_120%_at_50%_0%,var(--color-surface)_0%,var(--color-base)_70%)] p-8 md:order-2 md:sticky md:top-24">
          <div className="rounded-2xl bg-[#0b0e16] p-6 text-white shadow-[0_18px_50px_-16px_rgba(0,0,0,0.35)]">
            <p className="font-mono text-[11px] uppercase tracking-[0.25em] text-white/40">
              Generated password
            </p>
            <p className="mt-4 min-h-[2.5rem] break-all font-mono text-xl leading-snug text-white">
              {pw || "Select at least one character set"}
            </p>

            {/* Strength meter */}
            <div className="mt-6">
              <div className="mb-1.5 flex items-center justify-between font-mono text-[11px] uppercase tracking-widest">
                <span className="text-white/40">Strength</span>
                <span style={{ color: s.color }}>{noneSelected ? "—" : s.label}</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full bg-white/10">
                <div
                  className="h-full rounded-full transition-all duration-300"
                  style={{ width: `${noneSelected ? 0 : s.pct}%`, backgroundColor: s.color }}
                />
              </div>
            </div>

            <div className="mt-6 flex gap-3">
              <button
                type="button"
                onClick={copy}
                disabled={!pw}
                className="inline-flex flex-1 items-center justify-center gap-2 rounded-full bg-signal px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:translate-y-0"
              >
                {copied ? "Copied ✓" : "Copy"}
              </button>
              <button
                type="button"
                onClick={regen}
                aria-label="Regenerate"
                className="inline-flex items-center justify-center gap-2 rounded-full border border-white/20 px-5 py-3 text-sm font-medium text-white transition-colors hover:bg-white/10"
              >
                Regenerate ↻
              </button>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Controls */}
      <Reveal delay={80}>
        <div className="order-2 rounded-2xl border border-line bg-surface p-6 md:order-1">
          <p className="mb-5 font-mono text-[11px] uppercase tracking-widest text-faint">
            Controls
          </p>
          <div className="space-y-5">
            <Slider label="Length" value={o.length} min={6} max={48} suffix=" chars" onChange={(v) => set("length", v)} />
            <div className="grid grid-cols-2 gap-x-4 gap-y-3">
              <Toggle label="Lowercase" checked={o.lower} onChange={(v) => set("lower", v)} />
              <Toggle label="Uppercase" checked={o.upper} onChange={(v) => set("upper", v)} />
              <Toggle label="Numbers" checked={o.numbers} onChange={(v) => set("numbers", v)} />
              <Toggle label="Symbols" checked={o.symbols} onChange={(v) => set("symbols", v)} />
            </div>
            <Toggle label="Avoid look-alikes (Il1O0o)" checked={o.noAmbiguous} onChange={(v) => set("noAmbiguous", v)} />
            <p className="font-mono text-[10px] uppercase tracking-widest text-faint">
              Generated in your browser · never sent anywhere
            </p>
          </div>
        </div>
      </Reveal>
    </div>
  );
}
