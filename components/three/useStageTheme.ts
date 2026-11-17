"use client";

import { useEffect, useState } from "react";
import { Color } from "three";

/*
  The scene's colours, read from the site's own tokens and re-read when the
  palette changes.

  **This is the #115 / #118 / #148 lesson applied before it can bite a third
  time.** The rule in CLAUDE.md is that a colour which must follow the theme
  is a token and never a hardcoded value. WebGL cannot read a CSS variable,
  so a scene has to copy those tokens into GPU state, and a copy is exactly
  what went wrong on the dust canvas in #148: `ctx.fillStyle` was set once
  from `getComputedStyle`, which reads as correct and is as frozen as a
  literal from the next frame on. Switching to Harbor left it painting
  rgb(11,23,34) on an rgb(8,7,12) ground, about 1.05:1, so it did not dim,
  it disappeared.

  A three.js `Color` is the same kind of copy, with the same failure, so the
  subscription is built in here rather than remembered later. `lib/theme.ts`
  dispatches `theme:change`, and `WeatherLayer`, `DaylightSky`,
  `AuroraSwell`, `ReactiveAurora` and `LiveReadout` already listen for it.

  One reader, used by every piece of the scene, so there is no second place
  for an answer to go stale.
*/

export type StageTheme = {
  /** Fog and clear colour: the page's own ground. */
  ground: Color;
  /** Structure, for grid lines and edges. */
  line: Color;
  /** Dust and highlights. */
  ink: Color;
  /** The accent, used sparingly. */
  accent: Color;
  /** True when Harbor is on, for lighting choices that are not a colour. */
  dark: boolean;
};

function readVar(styles: CSSStyleDeclaration, name: string, fallback: string) {
  const v = styles.getPropertyValue(name).trim();
  return v.length > 0 ? v : fallback;
}

/*
  The ground is read from what is actually painted, not from a token,
  because there is no token for it: `.cp` sets `background: #08070c` in
  Harbor and `#f7f4ef` in Daylight as literals in each theme branch.

  Checked rather than assumed. The first draft of this file read a
  `--cp-bg` that does not exist, which would have silently fallen back to
  a hardcoded pair and re-created the exact bug this file is written to
  prevent: a colour that stops following the theme. Asking the element
  what colour it is cannot drift from what the stylesheet says, whatever
  anyone renames later.
*/
function readGround(dark: boolean): string {
  /*
    `body` rather than `.cp`, and the order matters: `.cp` is exactly what
    this feature makes transparent once the stage mounts, so reading it
    returns rgba(0,0,0,0) and falls through to a literal pair. `body:has(.cp)`
    keeps the real ground in both themes, which is also what prevents a
    flash of white before the first frame.
  */
  for (const el of [document.body, document.querySelector(".cp")]) {
    if (!el) continue;
    const painted = getComputedStyle(el).backgroundColor;
    if (painted && painted !== "transparent" && !painted.startsWith("rgba(0, 0, 0, 0")) {
      return painted;
    }
  }
  return dark ? "#08070c" : "#f7f4ef";
}

function readTheme(): StageTheme {
  /*
    Fallbacks are the Daylight values rather than black, because a scene is
    drawn before paint in some browsers and a missing token should look like
    the site rather than like a hole in it.
  */
  if (typeof document === "undefined") {
    return {
      ground: new Color("#f7f4ef"),
      line: new Color("#0b1722"),
      ink: new Color("#0b1722"),
      accent: new Color("#8b5cf6"),
      dark: false,
    };
  }

  const root = document.documentElement;
  const styles = getComputedStyle(root);
  const dark = root.dataset.theme !== "light";

  return {
    ground: new Color(readGround(dark)),
    line: new Color(readVar(styles, "--cp-soft", dark ? "#cfcadf" : "#3f4a58")),
    ink: new Color(readVar(styles, "--cp-ink", dark ? "#f2f0f7" : "#0b1722")),
    accent: new Color(readVar(styles, "--cp-violet", "#8b5cf6")),
    dark,
  };
}

export function useStageTheme(): StageTheme {
  const [theme, setTheme] = useState<StageTheme>(readTheme);

  useEffect(() => {
    /*
      Read once on mount as well as on change. The first read happens in
      `useState`'s initialiser, which on the client runs before the
      pre-paint theme script has necessarily finished, so this second read
      is what makes a page loaded straight into Harbor correct.
    */
    const sync = () => setTheme(readTheme());
    sync();
    window.addEventListener("theme:change", sync);
    return () => window.removeEventListener("theme:change", sync);
  }, []);

  return theme;
}
