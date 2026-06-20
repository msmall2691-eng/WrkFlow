"use client";

import { useState } from "react";
import LiquidChrome, { type ChromePalette } from "@/components/LiquidChrome";

const PALETTES: { id: ChromePalette; label: string }[] = [
  { id: "chrome", label: "Liquid Chrome" },
  { id: "ion", label: "Ion Blue" },
  { id: "aurora", label: "Aurora" },
  { id: "gold", label: "Molten Gold" },
];

export default function Lab() {
  const [palette, setPalette] = useState<ChromePalette>("chrome");
  const [intensity, setIntensity] = useState(1);

  return (
    <main className="relative h-[100svh] w-full overflow-hidden bg-black text-white">
      {/* The shader fills the viewport behind everything. */}
      <div className="absolute inset-0">
        <LiquidChrome palette={palette} intensity={intensity} />
      </div>

      {/* Foreground UI — frosted panels keep text legible over the metal. */}
      <div className="relative z-10 flex h-full flex-col justify-between p-6 md:p-10">
        {/* Top: brand + readout */}
        <div className="flex items-start justify-between gap-4">
          <div className="rounded-2xl border border-white/15 bg-black/30 px-5 py-4 backdrop-blur-md">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/60">
              mLinx Studio · Lab
            </p>
            <h1 className="mt-2 font-mono text-lg font-semibold uppercase tracking-[0.22em]">
              Liquid Chrome
            </h1>
          </div>

          <div className="hidden rounded-2xl border border-white/15 bg-black/30 px-5 py-4 text-right backdrop-blur-md sm:block">
            <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-white/60">
              Interactive shader wallpaper
            </p>
            <p className="mt-2 max-w-xs text-sm text-white/80">
              Move the cursor to bend the metal. Click anywhere to send ripples
              through it.
            </p>
          </div>
        </div>

        {/* Center hint */}
        <div className="pointer-events-none mx-auto max-w-md text-center">
          <p className="rounded-full border border-white/15 bg-black/30 px-5 py-2.5 font-mono text-[11px] uppercase tracking-[0.25em] text-white/80 backdrop-blur-md">
            Move · Click · Fidget
          </p>
        </div>

        {/* Bottom: controls */}
        <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          {/* Palette segmented control */}
          <div className="inline-flex flex-wrap gap-1 self-start rounded-full border border-white/15 bg-black/30 p-1.5 backdrop-blur-md">
            {PALETTES.map((p) => {
              const active = p.id === palette;
              return (
                <button
                  key={p.id}
                  type="button"
                  onClick={() => setPalette(p.id)}
                  className={`rounded-full px-4 py-2 font-mono text-[10px] uppercase tracking-[0.18em] transition-colors ${
                    active
                      ? "bg-white text-black"
                      : "text-white/70 hover:text-white"
                  }`}
                >
                  {p.label}
                </button>
              );
            })}
          </div>

          {/* Intensity slider */}
          <div className="flex items-center gap-3 self-start rounded-full border border-white/15 bg-black/30 px-5 py-3 backdrop-blur-md md:self-end">
            <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-white/60">
              Flow
            </span>
            <input
              type="range"
              min={0.2}
              max={2}
              step={0.05}
              value={intensity}
              onChange={(e) => setIntensity(Number(e.target.value))}
              className="h-1 w-40 cursor-pointer appearance-none rounded-full bg-white/25 accent-white"
              aria-label="Flow intensity"
            />
          </div>
        </div>
      </div>
    </main>
  );
}
