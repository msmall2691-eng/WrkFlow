"use client";

import { useEffect, useState } from "react";

type PromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type Mode = "prompt" | "ios" | "manual" | "installed";

/*
  InstallChip — a compact "install ↓" pill designed to sit inline in the
  LiveReadout's theme row. Chrome / Edge fire the deferred install prompt
  on tap; iOS Safari and other browsers reveal a short inline hint. Hides
  itself when running standalone.
*/
export default function InstallChip() {
  const [mode, setMode] = useState<Mode>("manual");
  const [tip, setTip] = useState<string | null>(null);

  useEffect(() => {
    const standalone =
      window.matchMedia("(display-mode: standalone)").matches ||
      (navigator as unknown as { standalone?: boolean }).standalone === true;
    if (standalone) {
      setMode("installed");
      return;
    }

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
        /* dismissed */
      }
      return;
    }
    setTip(mode === "ios" ? "Share → Add to Home Screen" : "URL bar → install icon");
  };

  return (
    <>
      <button
        type="button"
        onClick={onClick}
        className="inline-flex items-center gap-1 rounded-full border border-white/15 px-2 py-0.5 font-mono text-[9px] uppercase tracking-widest text-white/45 transition-colors hover:border-white/40 hover:text-white/85"
      >
        install <span aria-hidden="true">↓</span>
      </button>
      {tip && <span className="font-mono text-[9px] text-white/50">{tip}</span>}
    </>
  );
}
