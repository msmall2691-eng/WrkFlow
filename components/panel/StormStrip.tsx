"use client";

import { useEffect, useState } from "react";
import { useMaine } from "@/lib/useMaine";

/*
  StormStrip — "storm mode". Appears only while the National Weather Service
  has an active alert for Portland, and says what it is and when it ends.

  The second line is the pitch, worded as what client systems CAN do, not as a
  count of jobs moved: there is no feed of real reschedules behind this page,
  so it does not claim one.

  Preview without waiting for a storm: /?storm=1 shows a sample alert, and the
  strip is labelled PREVIEW so it can never be mistaken for a real one.
*/
export default function StormStrip() {
  const d = useMaine();
  const [preview, setPreview] = useState(false);

  useEffect(() => {
    try {
      setPreview(new URLSearchParams(window.location.search).get("storm") === "1");
    } catch {
      /* ignore */
    }
  }, []);

  const alert = d?.alert ?? (preview ? { event: "Winter Storm Warning", severity: "Severe", ends: "Fri 1:00 PM" } : null);
  if (!alert) return null;
  const isPreview = !d?.alert && preview;

  return (
    <a
      href="#contact"
      className="cp-stripes relative mx-6 flex flex-wrap items-center gap-x-4 gap-y-1.5 rounded-xl border border-[color:var(--cp-amber-line)] bg-[#281c06]/80 px-4 py-2.5 text-[13px] no-underline lg:mx-7"
    >
      <span className="flex items-center gap-2 font-mono text-[11px] tracking-[0.1em] text-[color:var(--cp-amber)]">
        <svg aria-hidden="true" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <path d="M12 3l9.5 17h-19z" />
          <path d="M12 10v4M12 17.5v.5" />
        </svg>
        {isPreview ? "PREVIEW · " : ""}STORM MODE · {alert.event.toUpperCase()}
        {alert.ends ? ` UNTIL ${alert.ends.toUpperCase()}` : ""}
      </span>
      <span className="text-[#fde7b0]">
        A system can watch alerts like this, move outdoor jobs and text customers on its own.
      </span>
      <span className="ml-auto font-semibold text-[color:var(--cp-amber)]">Ask me how →</span>
    </a>
  );
}
