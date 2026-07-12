"use client";

import { useState } from "react";

/*
  FounderAvatar — the illustrated Meg is the main portrait, with a small
  real-photo badge in the bottom-right corner. Tap the portrait to flip;
  the main becomes the real photo, and the badge becomes the illustrated
  one — always showing "the other version" so both faces stay on screen.

  Save-deterrents kept: context-menu blocked, drag disabled, transparent
  guard over the faces. Falls back to the "M" monogram if the primary
  image fails to load.
*/
export default function FounderAvatar({
  className = "h-28 w-28 rounded-full",
  showBadge = true,
}: {
  className?: string;
  /** Hide the internal corner badge — set false when this whole avatar is
   *  already being used as a small badge elsewhere (avoids a badge-on-a-badge). */
  showBadge?: boolean;
}) {
  const [failed, setFailed] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const block = (e: React.SyntheticEvent) => e.preventDefault();

  if (failed) {
    return (
      <span
        aria-hidden="true"
        className={`flex shrink-0 items-center justify-center bg-[#16384a] font-display text-4xl text-white ${className}`}
      >
        M
      </span>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setFlipped((f) => !f)}
      aria-label={flipped ? "Show illustrated Meg" : "Show real photo of Meg"}
      onContextMenu={block}
      className={`group relative block shrink-0 cursor-pointer appearance-none border-0 bg-transparent p-0 transition-transform active:scale-[0.98] [perspective:1000px] ${className}`}
    >
      {/* Flip card — cartoon on front, real headshot on back */}
      <span
        className="relative block h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d] motion-reduce:transition-none"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* Front — illustrated Meg */}
        <span className="absolute inset-0 overflow-hidden rounded-full bg-[#dfeaf3] [backface-visibility:hidden] [-webkit-backface-visibility:hidden]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/meg-avatar.webp"
            alt="Illustrated Meg, founder of M Studio"
            draggable={false}
            onError={() => setFailed(true)}
            onContextMenu={block}
            onDragStart={block}
            className="pointer-events-none h-full w-full select-none object-cover [-webkit-user-drag:none]"
          />
        </span>
        {/* Back — real headshot (grayscale, reveals color on hover) */}
        <span className="absolute inset-0 overflow-hidden rounded-full [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/meg.webp"
            alt="Meg, founder of M Studio"
            draggable={false}
            onContextMenu={block}
            onDragStart={block}
            className="pointer-events-none h-full w-full select-none object-cover grayscale transition-[filter] duration-700 group-hover:grayscale-0 [-webkit-user-drag:none]"
          />
        </span>
      </span>
      {/* Corner badge — always shows "the other face" so both stay on screen.
          Positioned outside the flip inner so it doesn't rotate with the card. */}
      {showBadge && (
        <span
          aria-hidden="true"
          className="absolute -bottom-1 -right-1 h-12 w-12 overflow-hidden rounded-full bg-[#dfeaf3] shadow-[0_6px_20px_-8px_rgba(0,0,0,0.4)] ring-4 ring-[var(--color-base)] sm:h-14 sm:w-14"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={flipped ? "/meg-avatar.webp" : "/meg.webp"}
            alt=""
            draggable={false}
            onContextMenu={block}
            onDragStart={block}
            className="pointer-events-none h-full w-full select-none object-cover [-webkit-user-drag:none]"
          />
        </span>
      )}
      {/* Transparent guard — intercepts long-press / right-click / drag */}
      <span
        aria-hidden="true"
        className="absolute inset-0 select-none rounded-full"
        onContextMenu={block}
        onDragStart={block}
      />
    </button>
  );
}
