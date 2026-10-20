"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Logo from "./Logo";

/* Mirrors the homepage order, and leads with Work for the same reason the
   page does. "Intake" came out: it is the Contact panel's own CTA, and seven
   links is more than a nav can carry at 1440px without turning into a list. */
const links = [
  { href: "/#work", label: "Work" },
  { href: "/services", label: "Services" },
  { href: "/#pricing", label: "Pricing" },
  { href: "/tools", label: "Tools" },
  { href: "/marketplace", label: "M Linx" },
  { href: "/about", label: "About" },
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
        <Link href="/#top" aria-label="M Studio — back to top" onClick={() => setMenuOpen(false)}>
          <Logo tone={solid ? "dark" : "light"} />
        </Link>

        <div className="hidden items-center gap-8 md:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className={`text-sm font-medium transition-colors ${
                scrolled ? "text-muted hover:text-ink" : "text-[color:var(--nav-hero-ink)] hover:text-[color:var(--nav-hero-ink2)]"
              }`}
            >
              {link.label}
            </a>
          ))}
        </div>

        <div className="flex items-center gap-3">
          {/* The two ⌘K buttons lived here — a fake search input on
              desktop and an icon button on mobile — to advertise a shortcut
              that is not what anyone came to this site to use. The palette
              and its real ⌘K / Ctrl-K hotkey are untouched. */}
          <Link
            href="/#contact"
            className={`hidden rounded-full border px-4 py-2 text-sm font-semibold transition-all active:scale-[0.96] sm:inline-block ${
              scrolled
                ? "border-signal/40 bg-signal/10 text-signal hover:bg-signal/20"
                : "border-[color:var(--nav-hero-line)] text-[color:var(--nav-hero-ink2)] hover:bg-[color:var(--nav-hero-line)]/40"
            }`}
          >
            Start
          </Link>

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
                  className="animate-menu-item border-b border-line/60 py-3 text-base font-medium text-muted opacity-0 transition-colors hover:text-ink active:text-signal"
                >
                  {link.label}
                </a>
              ))}
              <Link
                href="/#contact"
                onClick={() => setMenuOpen(false)}
                style={{ animationDelay: `${links.length * 60}ms` }}
                className="animate-menu-item mt-4 inline-flex items-center justify-center rounded-full bg-signal px-5 py-3 text-sm font-semibold text-white opacity-0 transition-transform active:scale-[0.97]"
              >
                Start a conversation →
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
