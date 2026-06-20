"use client";

import { useMemo, useReducer, useState } from "react";
import Reveal from "./Reveal";
import { Label, Slider, Seg, Toggle } from "./KitUI";

/*
  CalculatorKit — a "calculator construction kit" Playground tool.

  A fully working calculator on one side, a wall of always-on tweaks on the
  other. Theme, accent, button shape, spacing, typography, effects, layout —
  all live. Returned as a body (no <section>) so the Playground can host it.
*/

// ---------- calculator engine ----------
type CalcState = { value: string; prev: number | null; op: string | null; overwrite: boolean };
type CalcAction =
  | { type: "digit"; d: string }
  | { type: "dot" }
  | { type: "op"; op: string }
  | { type: "equals" }
  | { type: "clear" }
  | { type: "sign" }
  | { type: "percent" };

const INITIAL: CalcState = { value: "0", prev: null, op: null, overwrite: true };

function apply(a: number, b: number, op: string): number {
  switch (op) {
    case "+": return a + b;
    case "−": return a - b;
    case "×": return a * b;
    case "÷": return b === 0 ? NaN : a / b;
    default: return b;
  }
}

function fmt(n: number): string {
  if (!isFinite(n)) return "Error";
  const s = String(Math.round(n * 1e10) / 1e10);
  return s.length > 12 ? n.toPrecision(8).replace(/\.?0+$/, "") : s;
}

function reducer(state: CalcState, action: CalcAction): CalcState {
  if (state.value === "Error" && action.type !== "clear") return state;
  switch (action.type) {
    case "digit": {
      if (state.overwrite) return { ...state, value: action.d, overwrite: false };
      if (state.value.replace("-", "").replace(".", "").length >= 12) return state;
      return { ...state, value: state.value === "0" ? action.d : state.value + action.d };
    }
    case "dot":
      if (state.overwrite) return { ...state, value: "0.", overwrite: false };
      return state.value.includes(".") ? state : { ...state, value: state.value + "." };
    case "sign":
      return { ...state, value: fmt(parseFloat(state.value) * -1) };
    case "percent":
      return { ...state, value: fmt(parseFloat(state.value) / 100), overwrite: true };
    case "op": {
      const cur = parseFloat(state.value);
      if (state.op && !state.overwrite && state.prev !== null) {
        const r = apply(state.prev, cur, state.op);
        return { value: fmt(r), prev: r, op: action.op, overwrite: true };
      }
      return { ...state, prev: cur, op: action.op, overwrite: true };
    }
    case "equals": {
      if (state.op === null || state.prev === null) return state;
      const r = apply(state.prev, parseFloat(state.value), state.op);
      return { value: fmt(r), prev: null, op: null, overwrite: true };
    }
    case "clear":
      return INITIAL;
    default:
      return state;
  }
}

// ---------- tweaks ----------
type Tweaks = {
  mode: "dark" | "light";
  accent: string;
  opStyle: "tint" | "solid";
  radius: number;
  gap: number;
  btnH: number;
  pad: number;
  calcRadius: number;
  displaySize: number;
  align: "left" | "center" | "right";
  font: "sans" | "mono" | "serif";
  shadow: number; // 0–3
  glow: boolean;
  gradient: boolean;
  hairline: boolean;
  press: "scale" | "push" | "none";
  zeroWide: boolean;
};

const DEFAULTS: Tweaks = {
  mode: "dark",
  accent: "#2563eb",
  opStyle: "tint",
  radius: 14,
  gap: 10,
  btnH: 58,
  pad: 22,
  calcRadius: 28,
  displaySize: 50,
  align: "right",
  font: "sans",
  shadow: 2,
  glow: false,
  gradient: true,
  hairline: false,
  press: "scale",
  zeroWide: true,
};

const SWATCHES = ["#2563eb", "#10b981", "#8b5cf6", "#f59e0b", "#f43f5e", "#06b6d4", "#e2e8f0", "#f97316"];

function hexToRgb(hex: string): [number, number, number] {
  const h = hex.replace("#", "");
  const v = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  return [parseInt(v.slice(0, 2), 16), parseInt(v.slice(2, 4), 16), parseInt(v.slice(4, 6), 16)];
}
function contrastOn(hex: string): string {
  const [r, g, b] = hexToRgb(hex);
  const lum = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return lum > 0.62 ? "#0b0e16" : "#ffffff";
}

const FONTS: Record<Tweaks["font"], string> = {
  sans: "var(--font-sans, ui-sans-serif, system-ui, sans-serif)",
  mono: "var(--font-mono, ui-monospace, monospace)",
  serif: "var(--font-display, Georgia, 'Times New Roman', serif)",
};

const SHADOWS = [
  "none",
  "0 4px 16px rgba(0,0,0,0.12)",
  "0 18px 50px -16px rgba(0,0,0,0.30)",
  "0 30px 80px -20px rgba(0,0,0,0.55)",
];

const KIT_CSS = `
.cck{display:flex;flex-direction:column;gap:var(--g);width:100%;max-width:340px;padding:var(--pad);border-radius:var(--cr);background-color:var(--bg);background-image:var(--bgi);box-shadow:var(--sh);transition:background-color .2s,box-shadow .2s,border-radius .2s,padding .2s}
.cck-disp{min-height:calc(var(--ds) + 16px);display:flex;align-items:flex-end;justify-content:var(--justify);padding:8px 10px;color:var(--text);font-family:var(--font);font-size:var(--ds);line-height:1;font-weight:500;letter-spacing:-0.02em;overflow:hidden;white-space:nowrap}
.cck-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:var(--g)}
.cck-btn{height:var(--bh);border-radius:var(--r);border:1px solid var(--border);background:var(--surface);color:var(--text);font-family:var(--font);font-size:clamp(15px,calc(var(--bh) * 0.34),24px);font-weight:500;cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform .08s ease,filter .15s ease,background .2s,border-radius .2s,height .15s}
.cck-btn:hover{filter:brightness(1.07)}
.cck-btn:active{transform:var(--press)}
.cck-btn.fn{background:var(--fn)}
.cck-btn.op{background:var(--op);color:var(--opText);box-shadow:var(--opGlow)}
.cck-btn.op.sel{background:var(--accent);color:var(--accentText)}
.cck-btn.eq{background:var(--accent);color:var(--accentText);box-shadow:var(--glow)}
.cck-btn.wide{grid-column:span 2}
`;

function randomOf<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function randInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function CalculatorKit() {
  const [calc, dispatch] = useReducer(reducer, INITIAL);
  const [t, setT] = useState<Tweaks>(DEFAULTS);
  const set = <K extends keyof Tweaks>(k: K, v: Tweaks[K]) => setT((p) => ({ ...p, [k]: v }));

  const randomize = () =>
    setT({
      mode: randomOf(["dark", "light"]),
      accent: randomOf(SWATCHES),
      opStyle: randomOf(["tint", "solid"]),
      radius: randInt(0, 28),
      gap: randInt(4, 16),
      btnH: randInt(46, 74),
      pad: randInt(14, 34),
      calcRadius: randInt(6, 40),
      displaySize: randInt(34, 64),
      align: randomOf(["left", "center", "right"]),
      font: randomOf(["sans", "mono", "serif"]),
      shadow: randInt(0, 3),
      glow: Math.random() > 0.5,
      gradient: Math.random() > 0.5,
      hairline: Math.random() > 0.5,
      press: randomOf(["scale", "push", "none"]),
      zeroWide: Math.random() > 0.4,
    });

  const vars = useMemo(() => {
    const [r, g, b] = hexToRgb(t.accent);
    const base =
      t.mode === "dark"
        ? { bg: "#0b0e16", surface: "#1b2130", fn: "#272f42", text: "#f4f5f8", border: "rgba(255,255,255,0.08)" }
        : { bg: "#ffffff", surface: "#eef0f4", fn: "#e2e5ec", text: "#18181b", border: "rgba(0,0,0,0.08)" };
    const accentText = contrastOn(t.accent);
    const opBg = t.opStyle === "solid" ? t.accent : `rgba(${r},${g},${b},0.16)`;
    const opText = t.opStyle === "solid" ? accentText : t.accent;
    const glow = t.glow ? `0 0 26px -2px rgba(${r},${g},${b},0.7)` : "none";
    return {
      "--bg": base.bg,
      "--bgi": t.gradient
        ? `radial-gradient(130% 100% at 50% 0%, rgba(${r},${g},${b},0.18) 0%, transparent 62%)`
        : "none",
      "--surface": base.surface,
      "--fn": base.fn,
      "--text": base.text,
      "--accent": t.accent,
      "--accentText": accentText,
      "--op": opBg,
      "--opText": opText,
      "--opGlow": t.opStyle === "solid" ? glow : "none",
      "--glow": glow,
      "--border": t.hairline ? base.border : "transparent",
      "--r": `${t.radius}px`,
      "--g": `${t.gap}px`,
      "--bh": `${t.btnH}px`,
      "--pad": `${t.pad}px`,
      "--cr": `${t.calcRadius}px`,
      "--ds": `${t.displaySize}px`,
      "--justify": t.align === "left" ? "flex-start" : t.align === "center" ? "center" : "flex-end",
      "--font": FONTS[t.font],
      "--sh": SHADOWS[t.shadow],
      "--press": t.press === "scale" ? "scale(0.95)" : t.press === "push" ? "translateY(2px)" : "none",
    } as React.CSSProperties;
  }, [t]);

  return (
    <div className="grid gap-8 md:grid-cols-2 md:items-start">
      <style>{KIT_CSS}</style>

      {/* Calculator stage */}
      <Reveal>
        <div className="order-1 flex justify-center rounded-2xl border border-line bg-[radial-gradient(120%_120%_at_50%_0%,var(--color-surface)_0%,var(--color-base)_70%)] p-8 md:order-2 md:sticky md:top-24">
          <div className="cck" style={vars}>
            <div className="cck-disp">{calc.value}</div>
            <div className="cck-grid">
              <Btn cls="fn" onClick={() => dispatch({ type: "clear" })}>AC</Btn>
              <Btn cls="fn" onClick={() => dispatch({ type: "sign" })}>±</Btn>
              <Btn cls="fn" onClick={() => dispatch({ type: "percent" })}>%</Btn>
              <Btn cls={`op${calc.op === "÷" ? " sel" : ""}`} onClick={() => dispatch({ type: "op", op: "÷" })}>÷</Btn>

              {["7", "8", "9"].map((d) => (
                <Btn key={d} onClick={() => dispatch({ type: "digit", d })}>{d}</Btn>
              ))}
              <Btn cls={`op${calc.op === "×" ? " sel" : ""}`} onClick={() => dispatch({ type: "op", op: "×" })}>×</Btn>

              {["4", "5", "6"].map((d) => (
                <Btn key={d} onClick={() => dispatch({ type: "digit", d })}>{d}</Btn>
              ))}
              <Btn cls={`op${calc.op === "−" ? " sel" : ""}`} onClick={() => dispatch({ type: "op", op: "−" })}>−</Btn>

              {["1", "2", "3"].map((d) => (
                <Btn key={d} onClick={() => dispatch({ type: "digit", d })}>{d}</Btn>
              ))}
              <Btn cls={`op${calc.op === "+" ? " sel" : ""}`} onClick={() => dispatch({ type: "op", op: "+" })}>+</Btn>

              <Btn cls={t.zeroWide ? "wide" : ""} onClick={() => dispatch({ type: "digit", d: "0" })}>0</Btn>
              <Btn onClick={() => dispatch({ type: "dot" })}>.</Btn>
              <Btn cls={t.zeroWide ? "eq" : "eq wide"} onClick={() => dispatch({ type: "equals" })}>=</Btn>
            </div>
          </div>
        </div>
      </Reveal>

      {/* Controls — always on screen */}
      <Reveal delay={80}>
        <div className="order-2 rounded-2xl border border-line bg-surface p-6 md:order-1">
          <div className="mb-5 flex items-center justify-between">
            <p className="font-mono text-[11px] uppercase tracking-widest text-faint">Controls</p>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={randomize}
                className="rounded-full bg-signal px-3.5 py-1.5 text-xs font-semibold text-white transition-transform hover:-translate-y-0.5"
              >
                Randomize ✦
              </button>
              <button
                type="button"
                onClick={() => setT(DEFAULTS)}
                className="rounded-full border border-line px-3.5 py-1.5 text-xs font-medium text-muted transition-colors hover:text-ink"
              >
                Reset
              </button>
            </div>
          </div>

          <div className="space-y-5">
            <Seg label="Theme" value={t.mode} onChange={(v) => set("mode", v)} options={[["dark", "Dark"], ["light", "Light"]]} />

            <div>
              <Label>Accent</Label>
              <div className="flex flex-wrap items-center gap-2">
                {SWATCHES.map((c) => (
                  <button
                    key={c}
                    type="button"
                    aria-label={`accent ${c}`}
                    onClick={() => set("accent", c)}
                    className={`h-7 w-7 rounded-full ring-2 ring-offset-2 ring-offset-surface transition ${
                      t.accent === c ? "ring-ink" : "ring-transparent"
                    }`}
                    style={{ backgroundColor: c }}
                  />
                ))}
                <label className="relative h-7 w-7 cursor-pointer overflow-hidden rounded-full border border-line">
                  <input
                    type="color"
                    value={t.accent}
                    onChange={(e) => set("accent", e.target.value)}
                    className="absolute -left-2 -top-2 h-11 w-11 cursor-pointer border-0 bg-transparent p-0"
                    aria-label="custom accent color"
                  />
                </label>
              </div>
            </div>

            <Seg label="Operator style" value={t.opStyle} onChange={(v) => set("opStyle", v)} options={[["tint", "Tinted"], ["solid", "Solid"]]} />
            <Seg label="Font" value={t.font} onChange={(v) => set("font", v)} options={[["sans", "Sans"], ["mono", "Mono"], ["serif", "Serif"]]} />
            <Seg label="Display align" value={t.align} onChange={(v) => set("align", v)} options={[["left", "Left"], ["center", "Center"], ["right", "Right"]]} />
            <Seg label="Press effect" value={t.press} onChange={(v) => set("press", v)} options={[["scale", "Scale"], ["push", "Push"], ["none", "None"]]} />

            <Slider label="Display size" value={t.displaySize} min={30} max={68} suffix="px" onChange={(v) => set("displaySize", v)} />
            <Slider label="Button radius" value={t.radius} min={0} max={30} suffix="px" onChange={(v) => set("radius", v)} />
            <Slider label="Button height" value={t.btnH} min={44} max={78} suffix="px" onChange={(v) => set("btnH", v)} />
            <Slider label="Gap" value={t.gap} min={2} max={18} suffix="px" onChange={(v) => set("gap", v)} />
            <Slider label="Padding" value={t.pad} min={10} max={36} suffix="px" onChange={(v) => set("pad", v)} />
            <Slider label="Outer radius" value={t.calcRadius} min={0} max={44} suffix="px" onChange={(v) => set("calcRadius", v)} />
            <Slider label="Shadow" value={t.shadow} min={0} max={3} onChange={(v) => set("shadow", v)} />

            <div className="grid grid-cols-2 gap-x-4 gap-y-3 pt-1">
              <Toggle label="Accent glow" checked={t.glow} onChange={(v) => set("glow", v)} />
              <Toggle label="BG gradient" checked={t.gradient} onChange={(v) => set("gradient", v)} />
              <Toggle label="Hairlines" checked={t.hairline} onChange={(v) => set("hairline", v)} />
              <Toggle label="Wide zero" checked={t.zeroWide} onChange={(v) => set("zeroWide", v)} />
            </div>
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function Btn({ children, cls = "", onClick }: { children: React.ReactNode; cls?: string; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className={`cck-btn ${cls}`}>
      {children}
    </button>
  );
}
