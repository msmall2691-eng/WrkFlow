"use client";

/*
  Daylight / Harbor.

  This lived inside AccentSwitcher — the floating "DAYLIGHT" pill that sat on
  top of the content on every page, and on a phone sat on top of the cards.
  The pill is gone, but it was the only thing in the app that wrote
  `localStorage.theme` and `data-theme`, so removing it outright would have
  stranded every returning visitor in whichever theme they last chose, with
  no way out. The toggle now lives in the command palette (⌘K) instead.

  The pre-paint script in app/layout.tsx reads the same localStorage key
  before anything renders, so a returning visitor never sees a flash of the
  other theme.
*/

export type ThemeMode = "dark" | "light";

export function currentTheme(): ThemeMode {
  if (typeof document === "undefined") return "dark";
  return document.documentElement.dataset.theme === "light" ? "light" : "dark";
}

export function applyTheme(mode: ThemeMode) {
  if (mode === "light") document.documentElement.dataset.theme = "light";
  else delete document.documentElement.dataset.theme;

  try {
    localStorage.setItem("theme", mode);
  } catch {
    /* Storage can be blocked (private mode); the theme still applies for
       this page view. */
  }
  /* DaylightSky, ReactiveAurora, WeatherLayer and AuroraSwell all listen for
     this and re-read the tint from the DOM attribute. */
  window.dispatchEvent(new Event("theme:change"));
}

export function toggleTheme(): ThemeMode {
  const next: ThemeMode = currentTheme() === "light" ? "dark" : "light";
  applyTheme(next);
  return next;
}
