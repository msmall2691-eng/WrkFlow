"use client";

import { useEffect } from "react";

type PromptEvent = Event & {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

declare global {
  interface Window {
    __mstudioInstallPrompt?: PromptEvent;
  }
}

/*
  RegisterSW — registers /sw.js so the browser can advertise the site as
  installable, and stashes any `beforeinstallprompt` event on window so the
  in-page install pill (LiveReadout) can trigger it even when the event
  fires before that pill mounts. Zero UI, silent on unsupported browsers.
*/
export default function RegisterSW() {
  useEffect(() => {
    // Register /sw.js on idle so it never competes with first paint.
    if (typeof navigator !== "undefined" && "serviceWorker" in navigator) {
      const register = () => navigator.serviceWorker.register("/sw.js").catch(() => {});
      if ("requestIdleCallback" in window) {
        (window as unknown as { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(register);
      } else {
        setTimeout(register, 800);
      }
    }

    // Capture beforeinstallprompt so the pill can fire it later.
    const onPrompt = (e: Event) => {
      e.preventDefault();
      window.__mstudioInstallPrompt = e as PromptEvent;
      window.dispatchEvent(new CustomEvent("mstudio:install-ready"));
    };
    window.addEventListener("beforeinstallprompt", onPrompt);
    return () => window.removeEventListener("beforeinstallprompt", onPrompt);
  }, []);
  return null;
}
