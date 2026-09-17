"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { PHASES, phaseAt, type Phase } from "@/lib/daylight";

/*
  AccentSwitcher — a public "make it yours" accent picker, now tied to place.

  By default the accent follows the actual Maine daylight: dawn sand → midday
  teal → dusk navy → night. Pick a swatch to override (saved per device);
  "Maine daylight" puts it back on auto. Updates the --color-signal variables
  that drive buttons, links, markers, toggles, sliders, etc.
*/

type Accent = Phase;

const ACCENTS: Accent[] = [
  { name: "Sea Glass", signal: "#16a394", dim: "#0e8f86" },
  { name: "Harbor", signal: "#2f6df0", dim: "#1f54c9" },
  { name: "Brass", signal: "#d9a441", dim: "#b9842b" },
  { name: "Coral", signal: "#f4623a", dim: "#d94f2b" },
  { name: "Orchid", signal: "#8b5cf6", dim: "#7c3aed" },
  { name: "Rose", signal: "#f43f5e", dim: "#e11d48" },
];

const KEY = "mstudio-accent";
const TICK = 10 * 60 * 1000; // re-check the daylight phase every 10 min

function hexToRgb(hex: string) {
  const h = hex.replace("#", "");
  return { r: parseInt(h.slice(0, 2), 16), g: parseInt(h.slice(2, 4), 16), b: parseInt(h.slice(4, 6), 16) };
}

export default function AccentSwitcher() {
  const [open, setOpen] = useState(false);
  const shell = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(1); // default: Harbor (index 1); -1 when auto
  const [auto, setAuto] = useState(false);
  const [phase, setPhase] = useState<Accent>(PHASES.day);
  const [light, setLight] = useState(false);
  const [mode, setMode] = useState<"dark" | "light">("light");
  const activeRef = useRef(1);
  const timer = useRef<ReturnType<typeof setInterval> | null>(null);
  // True while DayScrubber is previewing another time of day. `preview` is
  // the phase it is showing, so the pill's swatch matches the page instead of
  // advertising a saved accent that is not currently on screen.
  const scrubbing = useRef(false);
  const [preview, setPreview] = useState<Accent | null>(null);

  /*
    Daylight / Harbor — persists in localStorage; the pre-paint script in
    layout.tsx reads it before anything renders, so a returning visitor never
    sees a flash of the other theme.
  */
  const applyTheme = useCallback((mode: "dark" | "light") => {
    const effective = mode;

    if (effective === "light") document.documentElement.dataset.theme = "light";
    else delete document.documentElement.dataset.theme;

    try { localStorage.setItem("theme", mode); } catch { /* ignore */ }
    setMode(mode);
    setLight(effective === "light");
    window.dispatchEvent(new Event("theme:change"));
  }, []);

  const applyColor = (a: Accent) => {
    const root = document.documentElement.style;
    root.setProperty("--color-signal", a.signal);
    root.setProperty("--color-signal-dim", a.dim);
    const { r, g, b } = hexToRgb(a.signal);
    root.setProperty("--color-signal-glow", `rgba(${r}, ${g}, ${b}, 0.16)`);
    window.dispatchEvent(new Event("accentchange"));
  };

  const stopTimer = () => {
    if (timer.current) clearInterval(timer.current);
    timer.current = null;
  };

  const enableAuto = (persist = true) => {
    setAuto(true);
    setActive(-1);
    activeRef.current = -1;
    const p = phaseAt();
    setPhase(p);
    applyColor(p);
    if (persist) {
      try {
        localStorage.setItem(KEY, "auto");
      } catch {
        /* ignore */
      }
    }
    stopTimer();
    timer.current = setInterval(() => {
      const np = phaseAt();
      setPhase(np);
      if (!scrubbing.current) applyColor(np);
    }, TICK);
  };

  const selectManual = (i: number, persist = true) => {
    setAuto(false);
    setActive(i);
    activeRef.current = i;
    stopTimer();
    applyColor(ACCENTS[i]);
    if (persist) {
      try {
        localStorage.setItem(KEY, String(i));
      } catch {
        /* ignore */
      }
    }
  };

  // Restore saved preference (default: Maine daylight auto).
  useEffect(() => {
    let saved: string | null = null;
    try {
      saved = localStorage.getItem(KEY);
    } catch {
      /* ignore */
    }
    if (saved === "auto") enableAuto(false);
    else if (saved != null && ACCENTS[Number(saved)]) selectManual(Number(saved), false);
    else selectManual(1, false); // default: Harbor
    // Initialize theme mode + light flag from whatever the pre-paint script
    // already settled, so the control opens showing the truth.
    let storedTheme: string | null = null;
    try {
      storedTheme = localStorage.getItem("theme");
    } catch {
      /* ignore */
    }
    // A legacy stored "auto" (or nothing) now resolves to Daylight, matching
    // what the pre-paint script already put on the element.
    setMode(storedTheme === "dark" ? "dark" : "light");
    setLight(document.documentElement.dataset.theme === "light");
    return stopTimer;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Command palette "Toggle accent color" — cycle the manual swatches.
  useEffect(() => {
    const onCycle = () => selectManual((activeRef.current + 1 + ACCENTS.length) % ACCENTS.length);
    window.addEventListener("accent:cycle", onCycle);
    return () => window.removeEventListener("accent:cycle", onCycle);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Hero "remote" — inline swatches set the accent here (single source of truth).
  useEffect(() => {
    const onSet = (e: Event) => {
      const d = (e as CustomEvent).detail;
      if (d === "auto") enableAuto();
      else if (typeof d === "number" && ACCENTS[d]) selectManual(d);
    };
    window.addEventListener("accent:set", onSet);
    return () => window.removeEventListener("accent:set", onSet);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
    DayScrubber preview — accent only.

    It used to flip the whole page to Harbor when you dragged past sunset,
    which was the single most dramatic thing on the site and exactly the
    wrong instinct: the page ships Daylight on purpose, and a control that
    drops a visitor into a near-black screen undoes that in one gesture. The
    accent still walks dawn → midday → dusk → night, so the arc is visible
    without the page going dark underneath it.

    Nothing here persists, and `scrubbing` parks the ten-minute auto tick so
    it cannot overwrite a preview mid-drag. Releasing with `null` restores
    whatever accent was actually true.
  */
  useEffect(() => {
    const onScrub = (e: Event) => {
      const d = (e as CustomEvent).detail as { at: number } | null;
      if (!d) {
        scrubbing.current = false;
        setPreview(null);
        applyColor(activeRef.current === -1 ? phaseAt() : ACCENTS[activeRef.current] ?? PHASES.day);
        return;
      }
      scrubbing.current = true;
      const p = phaseAt(new Date(d.at));
      setPreview(p);
      applyColor(p);
    };

    window.addEventListener("daylight:scrub", onScrub);
    return () => {
      window.removeEventListener("daylight:scrub", onScrub);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  /*
    Dismissal. The panel opens above its own trigger, so "click the button
    again" means aiming at a target the panel is sitting on top of — the
    reason this felt hard to close. Escape and an outside click are the two
    things people actually try, plus an explicit ✕ in the header.
  */
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onDown = (e: PointerEvent) => {
      if (!shell.current?.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    // Deferred so the click that opened the panel doesn't immediately close it.
    const id = setTimeout(() => window.addEventListener("pointerdown", onDown), 0);
    return () => {
      clearTimeout(id);
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onDown);
    };
  }, [open]);

  const swatch = preview ?? (auto ? phase : ACCENTS[active] ?? PHASES.day);

  return (
    <div ref={shell} className="fixed bottom-5 right-5 z-40 flex flex-col items-end">
      {open && (
        <div
          role="dialog"
          aria-label="Appearance settings"
          className="mb-3 w-[17.5rem] overflow-hidden rounded-2xl border border-line bg-surface/95 shadow-2xl backdrop-blur-md"
        >
          {/* Header — titled, and closable without hunting for the trigger. */}
          <div className="flex items-center justify-between border-b border-line px-4 py-3">
            <p className="font-mono text-[10px] uppercase tracking-widest text-faint">
              Appearance
            </p>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close appearance settings"
              className="-mr-1 flex h-6 w-6 items-center justify-center rounded-md text-faint transition-colors hover:bg-white/5 hover:text-ink"
            >
              <span aria-hidden="true" className="text-sm leading-none">✕</span>
            </button>
          </div>

          <div className="space-y-4 p-4">
            {/* Mode. Daylight is what the site ships and what most people
                should see; Harbor is a preference, not half a rotation. The
                old third option ("Auto — follows the sun") is gone: it served
                a near-black page to every evening visitor, which read as the
                studio being a night-time thing. */}
            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-faint">
                Mode
              </p>
              <div className="grid grid-cols-2 gap-2">
                {([
                  { id: "light", label: "Daylight", note: "Default", glyph: "☀" },
                  { id: "dark", label: "Harbor", note: "Dark", glyph: "☾" },
                ] as const).map((m) => {
                  const on = m.id === mode;
                  return (
                    <button
                      key={m.id}
                      type="button"
                      onClick={() => applyTheme(m.id)}
                      aria-pressed={on}
                      className={`flex flex-col items-start gap-0.5 rounded-lg border px-3 py-2 text-left transition-colors ${
                        on
                          ? "border-signal/50 bg-signal/10"
                          : "border-line hover:border-signal/30 hover:bg-white/5"
                      }`}
                    >
                      <span className="text-xs text-ink">
                        <span aria-hidden="true" className="mr-1 text-faint">{m.glyph}</span>
                        {m.label}
                      </span>
                      <span className="font-mono text-[9px] uppercase tracking-widest text-faint">
                        {m.note}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Accent — auto first, with a plain-language explanation of what
                "Maine daylight" actually means. */}
            <div>
              <p className="mb-2 font-mono text-[10px] uppercase tracking-widest text-faint">
                Accent color
              </p>

              <button
                type="button"
                onClick={() => enableAuto()}
                aria-pressed={auto}
                className={`flex w-full items-center gap-2.5 rounded-lg border px-3 py-2.5 text-left transition-colors ${
                  auto ? "border-signal/50 bg-signal/10" : "border-line hover:border-signal/30 hover:bg-white/5"
                }`}
              >
                <span
                  className="h-4 w-4 shrink-0 rounded-full"
                  style={{ backgroundColor: phase.signal }}
                />
                <span className="flex-1">
                  <span className="block text-xs text-ink">Maine daylight</span>
                  <span className="block text-[10px] leading-snug text-faint">
                    Follows the sky in Portland — {phase.name} right now
                  </span>
                </span>
                {auto && (
                  <span aria-hidden="true" className="text-xs text-signal">✓</span>
                )}
              </button>

              <p className="mb-2 mt-3 text-[10px] text-faint">Or pick one and keep it:</p>
              <div className="grid grid-cols-3 gap-2">
                {ACCENTS.map((a, i) => (
                  <button
                    key={a.name}
                    type="button"
                    onClick={() => selectManual(i)}
                    aria-pressed={!auto && active === i}
                    className={`flex flex-col items-center gap-1.5 rounded-lg border p-2 transition-colors ${
                      !auto && active === i
                        ? "border-signal/50 bg-signal/10"
                        : "border-transparent hover:border-line hover:bg-white/5"
                    }`}
                  >
                    <span
                      className="h-6 w-6 rounded-full"
                      style={{ backgroundColor: a.signal }}
                    />
                    <span className="text-[10px] leading-none text-muted">{a.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Current state, in words rather than jargon. */}
            <div className="flex items-center justify-between border-t border-line pt-3">
              <span className="text-[10px] text-faint">
                {auto ? "Changing with the day" : "Saved on this device"}
              </span>
              {!auto && (
                <button
                  type="button"
                  onClick={() => {
                    try {
                      localStorage.removeItem(KEY);
                    } catch {
                      /* ignore */
                    }
                    enableAuto(false);
                  }}
                  className="font-mono text-[10px] uppercase tracking-widest text-signal transition-opacity hover:opacity-75"
                >
                  Back to auto
                </button>
              )}
            </div>
          </div>
        </div>
      )}

      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        /* Was "Change accent color", which is why the Harbor/Daylight switch
           inside this panel was unfindable: the button that opens it claimed
           to do something narrower than it does. */
        aria-label="Appearance — light or dark theme, and accent colour"
        aria-expanded={open}
        className="inline-flex items-center gap-2 rounded-full border border-line bg-surface/90 px-4 py-2.5 font-mono text-[11px] uppercase tracking-widest text-muted shadow-lg backdrop-blur-md transition-colors hover:text-ink"
      >
        <span
          className="h-3.5 w-3.5 rounded-full ring-2 ring-offset-1 ring-offset-surface"
          style={{ backgroundColor: swatch.signal }}
        />
        {light ? "Daylight" : "Harbor"}
      </button>
    </div>
  );
}
