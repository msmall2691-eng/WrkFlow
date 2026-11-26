"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { homeHero, homeNav } from "@/lib/content";

/*
  The approved design's top bar: the wordmark, four links, one call to
  action, and a ground that fades in once the hero is behind it.

  **`PanelHeader` is not replaced, it is not used here.** That header is
  the site's nav on ten other routes and keeps its six links, its ⌘K
  button and its Book-a-call CTA. The approved homepage asks for something
  quieter over full-bleed video, so this is the homepage's own bar and
  nothing else renders it. ⌘K still works on this page: `CommandPalette`
  is mounted beside the stage and listens on the document.

  Client-side only for the scroll state. `setStuck` with an unchanged
  value does not re-render, so this costs one listener and nothing else.
*/
export default function StageTopBar() {
  const [stuck, setStuck] = useState(false);

  useEffect(() => {
    let ticking = false;
    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      requestAnimationFrame(() => {
        setStuck(window.scrollY > 40);
        ticking = false;
      });
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className={`topbar${stuck ? " stuck" : ""}`}>
      <div className="wrap">
        <Link href="/" className="mark">
          M<b>·</b>Studio
        </Link>
        <nav className="topnav" aria-label="Primary">
          {homeNav.map((n) =>
            n.href.startsWith("#") ? (
              <a key={n.href} href={n.href}>
                {n.label}
              </a>
            ) : (
              <Link key={n.href} href={n.href}>
                {n.label}
              </Link>
            ),
          )}
        </nav>
        {/* The same words as the hero's primary action, from the same
            place: the design offers one thing to do, twice. */}
        <a href="#contact" className="btn btn-solid">
          {homeHero.primary}
        </a>
      </div>
    </header>
  );
}
