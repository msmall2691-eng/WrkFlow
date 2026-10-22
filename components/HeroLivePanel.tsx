"use client";

import { useId, useState } from "react";
import { useMaine } from "@/lib/useMaine";
import LiveReadout from "./LiveReadout";

/*
  The hero's live-conditions panel, plus the sentence that makes it argue for
  her instead of just sitting there.

  Context, because this component exists to settle a disagreement in the
  repo's own history. The panel was removed in #109 on the reasoning that it
  proved we can read a weather API rather than build a business a website,
  and that on a phone it pushed the real work to the third screen. #110 then
  recorded Meg's decision the other way: the panel stays, as her signature
  and as proof she can wire a site to live data, with the proof reel moving
  to its own band directly below the hero. #109 merged after #110 and
  silently took the panel back out. This restores the decision.

  Both objections are answered rather than ignored:

  · The panel was decoration because nothing said what it was for. The
    caption below says it, in Meg's words, and turns a weather widget into
    the one thing on the page that demonstrates the service being sold.

  · It ate the first phone screen. Under 640px the panel collapses to a
    one-line strip the visitor can open, so the hero stays short and the
    proof reel starts on the second screen. At 640px and up the panel sits
    beside the headline exactly as it always did.

  The responsive split is CSS, not a media query read in JavaScript: the
  strip is `sm:hidden` and the panel is `hidden sm:block` until opened. That
  way the server and the client render the same tree and there is nothing to
  mismatch on hydration.
*/
export default function HeroLivePanel() {
  const [open, setOpen] = useState(false);
  const panelId = useId();
  const m = useMaine();

  /* The three readings the strip shows when it is closed. Each is omitted
     rather than shown as a dash when the feed drops it, which it does
     routinely. */
  const summary = [
    m?.conditions?.text,
    m?.tempF != null ? `${Math.round(m.tempF)}°` : null,
    m?.sunset ? `sunset ${m.sunset}` : null,
  ].filter(Boolean);

  return (
    <div className="w-full lg:ml-auto">
      {/*
        Phone only. A real <button> with aria-expanded, not a div: this
        toggles content, so it has to be reachable and announced. Full width
        and py-3 puts the target well past the 24px minimum that the reel
        dots missed.
      */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls={panelId}
        className="flex w-full items-center justify-between gap-3 rounded-xl border border-[var(--panel-line)] bg-[var(--panel-bg)]/70 px-4 py-3 text-left backdrop-blur-sm sm:hidden"
      >
        <span className="flex items-center gap-2 text-xs text-[color:var(--panel-ink)]">
          <span className="relative flex h-1.5 w-1.5" aria-hidden="true">
            <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-signal/60 motion-reduce:hidden" />
            <span className="relative inline-flex h-1.5 w-1.5 rounded-full bg-signal" />
          </span>
          {summary.length > 0 ? (
            summary.join(" · ")
          ) : (
            <span className="text-[color:var(--panel-faint)]">
              Live Maine conditions
            </span>
          )}
        </span>
        <span
          aria-hidden="true"
          className="text-[color:var(--panel-faint)] transition-transform"
          style={{ transform: open ? "rotate(180deg)" : undefined }}
        >
          ⌄
        </span>
      </button>

      {/* Open on a phone only when asked; always open from `sm` up. */}
      <div
        id={panelId}
        className={`${open ? "mt-3 block" : "hidden"} sm:mt-0 sm:block`}
      >
        <div className="lg:shadow-[0_30px_80px_-40px_rgba(0,0,0,0.8)]">
          <LiveReadout />
        </div>
      </div>

      {/*
        The caption, in Meg's voice and her wording from the handoff doc.
        This is the whole justification for the panel being in the hero: it
        names what the live data is proof OF.

        TODO(2.1f) — the roadmap wants this linked to a short "How this site
        works" section (weather and sun data → /api/maine → page theme). That
        section does not exist yet, so the sentence stands on its own rather
        than linking nowhere.
      */}
      <p className="mt-3 max-w-md text-xs leading-relaxed text-muted sm:mt-4 sm:text-sm">
        This page is reading live Maine weather and daylight right now. I
        connect client sites to their own live data the same way: bookings,
        inventory, schedules.
      </p>
    </div>
  );
}
