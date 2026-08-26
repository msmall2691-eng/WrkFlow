"use client";

import { useEffect, useState } from "react";
import Logo from "./Logo";
import Magnetic from "./Magnetic";

const links = [
  { href: "/#services", label: "Services" },
  { href: "/#work", label: "Work" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/about", label: "About" },
  { href: "/marketplace", label: "M Linx" },
  { href: "/intake", label: "Intake" },
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
        <a href="/#top" aria-label="M Studio — back to top" onClick={() => setMenuOpen(false)}>
          <Logo tone={solid ? "dark" : "light"} />
        </a>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`font-mono text-xs uppercase tracking-widest transition-colors ${
                scrolled ? "text-muted hover:text-ink" : "text-[color:var(--nav-hero-ink)] hover:text-[color:var(--nav-hero-ink2)]"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* Search: opens the ⌘K command palette (desktop shows a fake input,
              mobile shows a compact icon button). */}
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("cmdk:open"))}
            aria-label="Open command menu"
            className={`hidden items-center gap-1.5 rounded-full border px-2.5 py-1.5 font-mono text-[11px] transition-all active:scale-[0.96] md:inline-flex ${
              scrolled
                ? "border-line bg-surface/80 text-muted hover:text-ink"
                : "border-[color:var(--nav-hero-line)] text-[color:var(--nav-hero-ink)] hover:border-[color:var(--nav-hero-line2)] hover:text-[color:var(--nav-hero-ink2)]"
            }`}
          >
            <span aria-hidden="true">⌕</span>
            <kbd
              className={`rounded border px-1.5 text-[10px] tracking-normal ${
                scrolled ? "border-line bg-base text-faint" : "border-[color:var(--nav-hero-line)] text-[color:var(--nav-hero-ink)]"
              }`}
            >
              ⌘K
            </kbd>
          </button>
          <button
            type="button"
            onClick={() => window.dispatchEvent(new Event("cmdk:open"))}
            aria-label="Open search"
            className={`flex h-10 w-10 items-center justify-center rounded-full border text-lg transition-all active:scale-[0.94] md:hidden ${
              solid ? "border-line text-ink" : "border-[color:var(--nav-hero-line)] text-[color:var(--nav-hero-ink2)]"
            }`}
          >
            <span aria-hidden="true">⌕</span>
          </button>

          <Magnetic strength={0.4} className="hidden sm:inline-block">
            <a
              href="/#contact"
              className={`inline-block rounded-full border px-4 py-2 font-mono text-xs uppercase tracking-widest transition-all active:scale-[0.96] ${
                scrolled
                  ? "border-signal/40 bg-signal/10 text-signal hover:bg-signal/20"
                  : "border-[color:var(--nav-hero-line)] text-[color:var(--nav-hero-ink2)] hover:bg-[color:var(--nav-hero-line)]/40"
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
              solid ? "border-line text-ink" : "border-[color:var(--nav-hero-line)] text-[color:var(--nav-hero-ink2)]"
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

      {/* Mobile menu panel — slides down with staggered link entrance */}
      {menuOpen && (
        <div className="animate-menu-in origin-top border-t border-line bg-base/95 backdrop-blur-md md:hidden">
          <div className="mx-auto max-w-6xl px-6 py-4">
            <div className="flex flex-col">
              {links.map((link, i) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  style={{ animationDelay: `${i * 60}ms` }}
                  className="animate-menu-item border-b border-line/60 py-3 font-mono text-sm uppercase tracking-widest text-muted opacity-0 transition-colors hover:text-ink active:text-signal"
                >
                  {link.label}
                </a>
              ))}
              <a
                href="/#contact"
                onClick={() => setMenuOpen(false)}
                style={{ animationDelay: `${links.length * 60}ms` }}
                className="animate-menu-item mt-4 inline-flex items-center justify-center rounded-full bg-signal px-5 py-3 text-sm font-semibold text-white opacity-0 transition-transform active:scale-[0.97]"
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
