"use client";

import { useEffect, useState } from "react";

type PromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type Mode = "prompt" | "ios" | "manual" | "installed";

/*
  InstallChip — a quiet, in-panel affordance advertising the site's PWA
  install path. Lives inside the LiveReadout (the "here's the tech" panel)
  so it feels like part of the showcase, not a marketing banner.

  Chrome / Edge      → tap fires the deferred beforeinstallprompt.
  iOS Safari         → tap reveals the Share → Add to Home Screen hint.
  Anything else      → tap reveals the URL-bar-icon hint.
  Already installed  → the chip hides itself.
*/
export default function InstallChip() {
  const [mode, setMode] = useState<Mode>("manual");
  const [tip, setTip] = useState<string | null>(null);

  useEffect(() => {
    // If we're already running standalone, nothing to advertise.
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) {
      setMode("installed");
      return;
    }

    // Pick up an event RegisterSW already stashed.
    if (window.__mstudioInstallPrompt) {
      setMode("prompt");
    } else {
      const isIOS =
        /iPad|iPhone|iPod/.test(navigator.userAgent) && !/CriOS|FxiOS/.test(navigator.userAgent);
      setMode(isIOS ? "ios" : "manual");
    }

    const onReady = () => setMode("prompt");
    const onInstalled = () => setMode("installed");
    window.addEventListener("mstudio:install-ready", onReady);
    window.addEventListener("appinstalled", onInstalled);
    return () => {
      window.removeEventListener("mstudio:install-ready", onReady);
      window.removeEventListener("appinstalled", onInstalled);
    };
  }, []);

  if (mode === "installed") return null;

  const label = mode === "ios" ? "Add to home screen" : "Get the app";

  const onClick = async () => {
    setTip(null);
    if (mode === "prompt") {
      const p = window.__mstudioInstallPrompt as PromptEvent | undefined;
      if (!p) return;
      try {
        await p.prompt();
        const { outcome } = await p.userChoice;
        window.__mstudioInstallPrompt = undefined;
        if (outcome === "accepted") setMode("installed");
      } catch {
        /* user canceled */
      }
      return;
    }
    if (mode === "ios") {
      setTip("Tap Safari's Share button, then choose “Add to Home Screen”.");
      return;
    }
    setTip("On Chrome / Edge, click the install icon at the right of the URL bar.");
  };

  return (
    <div className="mt-3 border-t border-white/10 pt-3">
      <div className="flex flex-wrap items-center gap-2">
        <span className="font-mono text-[9px] uppercase tracking-widest text-white/40">Install</span>
        <button
          type="button"
          onClick={onClick}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/20 bg-white/5 px-2.5 py-1 font-mono text-[10px] text-white/80 transition-colors hover:border-white/50 hover:bg-white/10 hover:text-white"
        >
          <span aria-hidden="true">↓</span>
          {label}
        </button>
        <span className="font-mono text-[9px] text-white/35">yes, this site is a real app</span>
      </div>
      {tip && (
        <p className="mt-2 font-mono text-[10px] leading-relaxed text-white/55">{tip}</p>
      )}
    </div>
  );
}
