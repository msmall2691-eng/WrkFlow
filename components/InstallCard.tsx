"use client";

import { useEffect, useState } from "react";

type PromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

type Mode = "prompt" | "ios" | "manual" | "installed";

/*
  InstallCard — a small capability showcase in the hero. Frames the PWA as
  a service we build for other businesses ("your customers could save yours
  the same way"). Live demo button honors the platform:

    Chrome / Edge   → fires the deferred beforeinstallprompt.
    iOS Safari      → reveals a short Share → Add to Home Screen hint.
    Anything else   → reveals the URL-bar-icon hint.
    Already running → the card hides itself.
*/
export default function InstallCard() {
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
    setTip(
      mode === "ios"
        ? "Tap Safari's Share button, then choose “Add to Home Screen”."
        : "In Chrome or Edge, click the install icon at the right of the URL bar.",
    );
  };

  return (
    <div className="max-w-md rounded-xl border border-white/12 bg-[#08131d]/60 p-4 backdrop-blur-sm">
      <p className="font-mono text-[10px] uppercase tracking-[0.18em] text-signal/85">
        Installable as an app
      </p>
      <p className="mt-2 text-[13px] leading-relaxed text-white/80">
        Save this site to your home screen — no App Store, no downloads. Your customers could
        do the same with yours.
      </p>
      <div className="mt-3 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onClick}
          className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/10 px-3 py-1.5 font-mono text-[11px] text-white transition-all hover:border-white/50 hover:bg-white/15 active:scale-[0.96]"
        >
          Install this site <span aria-hidden="true">↓</span>
        </button>
        {tip && <span className="font-mono text-[10px] leading-relaxed text-white/60">{tip}</span>}
      </div>
      <p className="mt-3 border-t border-white/10 pt-3 font-mono text-[10px]">
        <a href="#contact" className="text-signal transition-colors hover:text-white/90">
          Want it on your site? Start a conversation →
        </a>
      </p>
    </div>
  );
}
