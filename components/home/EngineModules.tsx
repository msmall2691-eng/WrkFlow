"use client";

import { engineNodes, litEngineNode } from "@/lib/engineNodes";

/*
  The four modules, as text, and as the control that lights them in the
  scene.

  **This exists because the 3D blocks were unreachable and the copy said
  otherwise.** The brief put the captions in a floating 3D label shown on
  hover, and the stage is a `fixed`, `-z-10`, `pointer-events-none` layer
  behind the whole site, so no block in it could ever be hovered. Act
  three told the visitor to hover one. `lib/engineNodes.ts` carries the
  full reasoning for turning it round.

  Buttons rather than list items with mouse handlers, because the point of
  moving the control into the page is that everybody gets it: a finger
  taps, a keyboard tabs, and focus lights the same block hover does.
  `aria-pressed` is deliberately absent — nothing is toggled or kept, this
  only points at something.

  Every word here is also the scene's, read from the one module, so the
  picture and the prose cannot end up describing different products.
*/
export default function EngineModules() {
  return (
    <ul
      className="m-0 mt-7 grid list-none grid-cols-1 gap-2.5 p-0 sm:grid-cols-2"
      /* Leaving the group clears the highlight, whichever item the pointer
         left by. Per-item `onMouseLeave` fires on the way between two
         items as well, so the scene would flicker dark between neighbours. */
      onMouseLeave={() => litEngineNode(null)}
      onBlur={(e) => {
        if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
          litEngineNode(null);
        }
      }}
    >
      {engineNodes.map((n) => (
        <li key={n.id} className="min-w-0">
          <button
            type="button"
            onMouseEnter={() => litEngineNode(n.id)}
            onFocus={() => litEngineNode(n.id)}
            /* A tap on a touch screen has no hover to rely on. */
            onClick={() => litEngineNode(n.id)}
            className="cp-tile flex w-full min-w-0 cursor-pointer flex-col items-start gap-1.5 p-3.5 text-left transition-colors duration-150 hover:border-[color:var(--cp-violet-line)] focus-visible:border-[color:var(--cp-violet-line)]"
          >
            <span className="text-[11px] uppercase tracking-wider text-[color:var(--cp-violet-ink)]">
              {n.spec}
            </span>
            <span className="text-[15px] font-semibold text-[color:var(--cp-ink)]">
              {n.label}
            </span>
            <span className="text-[13.5px] leading-relaxed text-[color:var(--cp-muted)]">
              {n.blurb}
            </span>
          </button>
        </li>
      ))}
    </ul>
  );
}
