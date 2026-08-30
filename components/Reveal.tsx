"use client";

import { useEffect, useRef, useState } from "react";

type RevealProps = {
  children: React.ReactNode;
  /** Stagger delay in ms. */
  delay?: number;
  className?: string;
  as?: keyof React.JSX.IntrinsicElements;
};

/**
 * Wraps content in a scroll-triggered reveal. Uses IntersectionObserver
 * and respects prefers-reduced-motion (handled in globals.css).
 */
export default function Reveal({
  children,
  delay = 0,
  className = "",
  as: Tag = "div",
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    // Robustness: if IO is unavailable, never leave content hidden.
    if (typeof IntersectionObserver === "undefined") {
      setVisible(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0, rootMargin: "0px 0px 12% 0px" },
    );

    observer.observe(node);
    // Failsafe: a fast flick can outrun the observer, leaving a viewport of
    // hidden content that reads as a broken page. Whatever happens, nothing
    // stays invisible for more than a beat.
    const failsafe = window.setTimeout(() => setVisible(true), 1200);
    return () => {
      observer.disconnect();
      window.clearTimeout(failsafe);
    };
  }, []);

  const Component = Tag as React.ElementType;

  return (
    <Component
      ref={ref}
      className={`reveal ${visible ? "is-visible" : ""} ${className}`}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
    >
      {children}
    </Component>
  );
}
