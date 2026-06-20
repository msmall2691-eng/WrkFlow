"use client";

import { useRef } from "react";

/*
  Tilt — a subtle pointer-following 3D tilt for cards (hover-capable devices
  only). On touch it's inert; scroll-reveal carries the motion there instead.
*/
export default function Tilt({
  children,
  className = "",
  max = 6,
}: {
  children: React.ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || matchMedia("(hover: none)").matches) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateX(${-py * max}deg) rotateY(${px * max}deg)`;
  };
  const reset = () => {
    const el = ref.current;
    if (el) el.style.transform = "";
  };

  return (
    <div
      ref={ref}
      onPointerMove={onMove}
      onPointerLeave={reset}
      className={`h-full transition-transform duration-200 ease-out [transform-style:preserve-3d] ${className}`}
    >
      {children}
    </div>
  );
}
