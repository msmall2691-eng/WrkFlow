"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import Magnetic from "./Magnetic";

const links = [
  { href: "/#shift", label: "Why now" },
  { href: "/#kit", label: "Demos" },
  { href: "/#live", label: "Work" },
  { href: "/#services", label: "Services" },
  { href: "/marketplace", label: "Linx" },
  { href: "/#approach", label: "Approach" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 16);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Solid backdrop whenever the mobile menu is open (so links read clearly).
  const solid = scrolled || menuOpen;

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        solid ? "border-b border-line bg-base/90 backdrop-blur-md" : "border-b border-transparent"
      }`}
    >
      <nav className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6">
        <a href="/" aria-label="M Studio — home" onClick={() => setMenuOpen(false)}>
          <Logo tag tone={solid ? "dark" : "light"} />
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`font-mono text-xs uppercase tracking-widest transition-colors ${
                scrolled ? "text-muted hover:text-ink" : "text-white/70 hover:text-white"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <Magnetic strength={0.4} className="hidden sm:inline-block">
            <a
              href="/#contact"
              className={`inline-block rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-widest transition-colors ${
                scrolled
                  ? "border-signal/40 bg-signal/10 text-signal hover:bg-signal/20"
                  : "border-white/30 text-white hover:bg-white/10"
              }`}
            >
              Start
            </a>
          </Magnetic>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMenuOpen((o) => !o)}
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            className={`flex h-10 w-10 items-center justify-center rounded-full border transition-colors md:hidden ${
              solid ? "border-line text-ink" : "border-white/30 text-white"
            }`}
          >
            <div className="relative h-3.5 w-5">
              <span className={`absolute left-0 h-0.5 w-5 bg-current transition-all ${menuOpen ? "top-1.5 rotate-45" : "top-0"}`} />
              <span className={`absolute left-0 top-1.5 h-0.5 w-5 bg-current transition-opacity ${menuOpen ? "opacity-0" : "opacity-100"}`} />
              <span className={`absolute left-0 h-0.5 w-5 bg-current transition-all ${menuOpen ? "top-1.5 -rotate-45" : "top-3"}`} />
            </div>
          </button>
        </div>
      </nav>

      {/* Mobile menu panel */}
      {menuOpen && (
        <div className="border-t border-line bg-base/95 backdrop-blur-md md:hidden">
          <div className="mx-auto max-w-6xl px-6 py-4">
            <div className="flex flex-col">
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="border-b border-line/60 py-3 font-mono text-sm uppercase tracking-widest text-muted transition-colors hover:text-ink"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/#contact"
                onClick={() => setMenuOpen(false)}
                className="mt-4 inline-flex items-center justify-center rounded-full bg-signal px-5 py-3 text-sm font-semibold text-white"
              >
                Start a conversation →
              </a>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
