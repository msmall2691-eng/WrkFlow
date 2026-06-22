"use client";

import { useState } from "react";

/*
  FounderAvatar — shows Meg's photo (/meg.png), falling back to the "M" monogram
  if the file is ever missing. Pass `className` to control size/shape.

  Save-deterrents (note: no web page can fully prevent saving — screenshots and
  dev tools always exist): right-click/context-menu blocked, drag disabled, and
  a transparent guard layer sits over the image so long-press/right-click land
  on it, not the <img>.
*/
export default function FounderAvatar({
  className = "h-28 w-28 rounded-full",
}: {
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
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
    <span
      className={`relative block shrink-0 overflow-hidden ${className}`}
      onContextMenu={block}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src="/meg.png"
        alt="Meg, founder of M Studio"
        draggable={false}
        onError={() => setFailed(true)}
        onContextMenu={block}
        onDragStart={block}
        className="pointer-events-none h-full w-full select-none object-cover [-webkit-user-drag:none]"
      />
      {/* Transparent guard — intercepts long-press / right-click / drag */}
      <span
        aria-hidden="true"
        className="absolute inset-0 select-none"
        onContextMenu={block}
        onDragStart={block}
      />
    </span>
  );
}
