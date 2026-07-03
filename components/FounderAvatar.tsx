"use client";

import { useEffect, useState } from "react";

/*
  FounderAvatar — Meg's photo, tap to flip to an illustrated avatar of her.
  Real headshot on the front (grayscale, reveals color on hover); cartoon
  avatar on the back. Falls back to the "M" monogram if the front image is
  missing. Save-deterrents kept: context-menu blocked, drag disabled, a
  transparent guard sits over the faces.
*/
export default function FounderAvatar({
  className = "h-28 w-28 rounded-full",
}: {
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  const [flipped, setFlipped] = useState(false);
  const block = (e: React.SyntheticEvent) => e.preventDefault();

  // Preload the back-face avatar on idle so the first flip is instant.
  useEffect(() => {
    const load = () => {
      const img = new Image();
      img.src = "/meg-avatar.webp";
    };
    const w = window as unknown as { requestIdleCallback?: (cb: () => void) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(load);
    else setTimeout(load, 1200);
  }, []);

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
      aria-label={flipped ? "Show real photo of Meg" : "Show illustrated avatar of Meg"}
      onContextMenu={block}
      className={`group relative block shrink-0 cursor-pointer border-0 bg-transparent p-0 [perspective:1000px] ${className}`}
    >
      <span
        className="relative block h-full w-full transition-transform duration-700 ease-[cubic-bezier(0.16,1,0.3,1)] [transform-style:preserve-3d] motion-reduce:transition-none"
        style={{ transform: flipped ? "rotateY(180deg)" : "rotateY(0deg)" }}
      >
        {/* Front — real headshot */}
        <span className="absolute inset-0 overflow-hidden rounded-[inherit] [backface-visibility:hidden] [-webkit-backface-visibility:hidden]">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/meg.webp"
            alt="Meg, founder of M Studio"
            draggable={false}
            onError={() => setFailed(true)}
            onContextMenu={block}
            onDragStart={block}
            className="pointer-events-none h-full w-full select-none object-cover grayscale transition-[filter] duration-700 group-hover:grayscale-0 [-webkit-user-drag:none]"
          />
        </span>
        {/* Back — illustrated avatar (always full color) */}
        <span
          className="absolute inset-0 overflow-hidden rounded-[inherit] bg-[#dfeaf3] [backface-visibility:hidden] [-webkit-backface-visibility:hidden] [transform:rotateY(180deg)]"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/meg-avatar.webp"
            alt="Illustrated avatar of Meg"
            draggable={false}
            onContextMenu={block}
            onDragStart={block}
            loading="lazy"
            className="pointer-events-none h-full w-full select-none object-cover [-webkit-user-drag:none]"
          />
        </span>
      </span>
      {/* Transparent guard — intercepts long-press / right-click / drag on either face */}
      <span
        aria-hidden="true"
        className="absolute inset-0 select-none rounded-[inherit]"
        onContextMenu={block}
        onDragStart={block}
      />
    </button>
  );
}
