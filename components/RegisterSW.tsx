"use client";

import { useEffect } from "react";

/*
  RegisterSW — registers /sw.js so the browser can advertise the site as
  installable. Zero UI. Silent on failure — nothing regresses on a browser
  that doesn't support service workers.
*/
export default function RegisterSW() {
  useEffect(() => {
    if (typeof navigator === "undefined" || !("serviceWorker" in navigator)) return;
    // Register on idle so it never competes with first paint.
    const register = () => navigator.serviceWorker.register("/sw.js").catch(() => {});
    if ("requestIdleCallback" in window) {
      (window as unknown as { requestIdleCallback: (cb: () => void) => number }).requestIdleCallback(register);
    } else {
      setTimeout(register, 800);
    }
  }, []);
  return null;
}
