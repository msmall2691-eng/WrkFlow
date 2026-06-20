"use client";

import { useEffect, useState } from "react";

/*
  ScrollProgress — a thin accent bar at the very top that tracks page scroll.
  Global, decorative; recolors with the accent via the signal token.
*/
export default function ScrollProgress() {
  const [pct, setPct] = useState(0);

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement;
      const max = el.scrollHeight - el.clientHeight;
      setPct(max > 0 ? (el.scrollTop / max) * 100 : 0);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  return (
    <div aria-hidden="true" className="fixed inset-x-0 top-0 z-[60] h-0.5">
      <div
        className="h-full bg-signal shadow-[0_0_8px_var(--color-signal)]"
        style={{ width: `${pct}%` }}
      />
    </div>
  );
}
