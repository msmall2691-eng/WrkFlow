"use client";

import { useEffect, useState } from "react";

/*
  BackToTop — a quiet "return to top" button that fades in once you've scrolled
  down. Sits above the accent switcher (bottom-right).
*/
export default function BackToTop() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => setShow(window.scrollY > 700);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <button
      type="button"
      aria-label="Back to top"
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
      className={`fixed bottom-5 left-5 z-40 flex h-11 w-11 items-center justify-center rounded-full border border-line bg-base/80 text-lg text-ink shadow-sm backdrop-blur transition-all duration-300 hover:border-signal/60 hover:text-signal md:bottom-20 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-2 opacity-0"
      }`}
    >
      <span aria-hidden="true">↑</span>
    </button>
  );
}
