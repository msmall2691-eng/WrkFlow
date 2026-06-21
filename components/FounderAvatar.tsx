"use client";

import { useState } from "react";

/*
  Founder avatar — shows Meg's photo (/meg.png), falling back to the "M" monogram
  if the file is ever missing. Pass `className` to control size/shape.
*/
export default function FounderAvatar({
  className = "h-28 w-28 rounded-full",
}: {
  className?: string;
}) {
  const [failed, setFailed] = useState(false);

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
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/meg.png"
      alt="Meg, founder of M Studio"
      onError={() => setFailed(true)}
      className={`shrink-0 object-cover ${className}`}
    />
  );
}
