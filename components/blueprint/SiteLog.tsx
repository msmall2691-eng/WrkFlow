"use client";

import { useEffect, useState } from "react";
import { useMaine } from "@/lib/useMaine";

/*
  SiteLog: the live readout at the top of the homepage, in the shape of a
  job-site daily log ("Week 11 · 44 on site · 52°F" on the reference). Here:
  Maine, the local time, the temperature and the next sun event, all real.
  Time is computed on the client; weather comes from the shared /api/maine
  cache and each field renders only when it actually came back. Nothing is
  shown until the clock has a real value, so the server render never
  carries a made-up time.
*/
export default function SiteLog({ className = "" }: { className?: string }) {
  const d = useMaine();
  const [now, setNow] = useState<Date | null>(null);

  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 30_000);
    return () => clearInterval(t);
  }, []);

  if (!now) return null;

  const time = now.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    timeZone: "America/New_York",
  });

  const parts: string[] = ["Southern Maine", time];
  if (d?.tempF != null) parts.push(`${d.tempF}°F`);
  if (d?.conditions?.text) parts.push(d.conditions.text.toLowerCase());
  if (d?.sun) parts.push(`${d.sun.label.toLowerCase()} ${d.sun.time}`);

  return (
    <p className={`bp-log ${className}`}>
      <span className="bp-log-dot" aria-hidden="true" />
      {parts.map((p, i) => (
        <span key={i} className="whitespace-nowrap">
          {i > 0 && <span className="bp-log-sep" aria-hidden="true">•</span>}
          {p}
        </span>
      ))}
    </p>
  );
}
