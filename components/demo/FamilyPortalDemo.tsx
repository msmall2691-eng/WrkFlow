"use client";

import { useState } from "react";

/*
  Family portal — the demo (Nov 15 2026).

  A WEB APP for small childcare programs. The real one runs Arrowhead
  Explorers: a door tablet where families check in with a code, and a
  private page where parents see their child's day. The real portal holds
  children's names, logs and photos, so none of it is shown; this demo uses
  an invented program and invented families, and no photographs at all.

  Two panels side by side, so a visitor sees the cause and the effect at
  once: check in at the door on the left, the parent's day updates on the
  right. Sage and moss, rounded and calm, for a childcare setting.
*/

const FAMILIES: Record<string, { name: string; kids: string[] }> = {
  "1234": { name: "The Rivera family", kids: ["Ada", "Luca"] },
  "5678": { name: "The Okoro family", kids: ["Zuri"] },
};

type Entry = { time: string; text: string };

function now() {
  return new Date().toLocaleTimeString("en-US", { hour: "numeric", minute: "2-digit" });
}

export default function FamilyPortalDemo() {
  const [pin, setPin] = useState("");
  const [family, setFamily] = useState<string | null>(null);
  const [present, setPresent] = useState<Record<string, boolean>>({});
  const [pick, setPick] = useState<Record<string, boolean>>({});
  const [log, setLog] = useState<Entry[]>([]);
  const [error, setError] = useState("");

  function press(d: string) {
    setError("");
    const p = (pin + d).slice(0, 4);
    setPin(p);
    if (p.length === 4) {
      if (FAMILIES[p]) {
        setFamily(p);
        setPick(Object.fromEntries(FAMILIES[p].kids.map((k) => [k, true])));
      } else {
        setError("That code isn't on the list. Try 1234 or 5678.");
      }
      setTimeout(() => setPin(""), 150);
    }
  }

  function confirm() {
    if (!family) return;
    const kids = FAMILIES[family].kids.filter((k) => pick[k]);
    const checkingOut = kids.every((k) => present[k]);
    setPresent((p) => ({ ...p, ...Object.fromEntries(kids.map((k) => [k, !checkingOut])) }));
    setLog((l) => [{ time: now(), text: `${kids.join(" and ")} ${checkingOut ? "checked out" : "checked in"} at the door` }, ...l]);
    setFamily(null);
  }

  function staffNote(text: string) {
    setLog((l) => [{ time: now(), text }, ...l]);
  }

  const rivera = FAMILIES["1234"];

  return (
    <div className="min-h-screen bg-[#eaf0e6] text-[#26352a]">
      <p className="bg-[#26352a] px-5 py-2.5 text-center text-[13px] leading-snug text-[#d6e4cf]">
        Demo of a family portal, a web app by M Studio. The program and families are invented.
        Nothing is saved.
      </p>

      <header className="px-5 py-5">
        <div className="mx-auto max-w-6xl">
          <p className="m-0 text-[18px] font-semibold">Little Pines Nature School</p>
          <p className="m-0 text-[13px] text-[#26352a]/60">Door kiosk on the left, a parent&apos;s phone on the right</p>
        </div>
      </header>

      <main className="mx-auto grid max-w-6xl gap-6 px-5 pb-10 lg:grid-cols-2">
        {/* Kiosk */}
        <section aria-labelledby="kiosk-h" className="rounded-[28px] bg-white p-6 shadow-[0_1px_0_rgba(38,53,42,0.06)]">
          <h1 id="kiosk-h" className="m-0 text-center text-[20px] font-semibold">Welcome. Enter your family code.</h1>

          {!family ? (
            <>
              <div className="mt-4 flex justify-center gap-3" aria-label={`${pin.length} of 4 digits entered`}>
                {[0, 1, 2, 3].map((i) => (
                  <span key={i} className={`h-3.5 w-3.5 rounded-full border-2 border-[#5b7f4a] ${i < pin.length ? "bg-[#5b7f4a]" : ""}`} />
                ))}
              </div>
              <p className="m-0 mt-2 min-h-5 text-center text-[13px] text-[#9a3b2a]" role="alert">{error}</p>
              <div className="mx-auto mt-3 grid max-w-[260px] grid-cols-3 gap-3">
                {["1", "2", "3", "4", "5", "6", "7", "8", "9", "", "0", "⌫"].map((d, i) =>
                  d === "" ? (
                    <span key={i} />
                  ) : (
                    <button
                      key={i}
                      type="button"
                      onClick={() => (d === "⌫" ? setPin((p) => p.slice(0, -1)) : press(d))}
                      aria-label={d === "⌫" ? "Delete" : d}
                      className="aspect-square rounded-full bg-[#f2f6ef] text-[20px] font-medium active:bg-[#dfe9d8]"
                    >
                      {d}
                    </button>
                  ),
                )}
              </div>
              <p className="m-0 mt-4 text-center text-[12.5px] text-[#26352a]/55">Sample codes: 1234 or 5678</p>
            </>
          ) : (
            <div className="mt-5">
              <p className="m-0 text-center text-[15px]">Hi, {FAMILIES[family].name}.</p>
              <ul className="m-0 mx-auto mt-4 max-w-xs list-none space-y-2 p-0">
                {FAMILIES[family].kids.map((k) => (
                  <li key={k}>
                    <label className="flex min-h-12 items-center justify-between rounded-2xl bg-[#f2f6ef] px-4 text-[15px]">
                      {k} <span className="text-[12.5px] text-[#26352a]/55">{present[k] ? "here now" : "not here yet"}</span>
                      <input
                        type="checkbox"
                        checked={!!pick[k]}
                        onChange={(e) => setPick((p) => ({ ...p, [k]: e.target.checked }))}
                        className="h-5 w-5 accent-[#5b7f4a]"
                      />
                    </label>
                  </li>
                ))}
              </ul>
              <div className="mt-5 flex justify-center gap-3">
                <button type="button" onClick={confirm} className="min-h-11 rounded-full bg-[#5b7f4a] px-6 text-[15px] font-semibold text-white">
                  {FAMILIES[family].kids.filter((k) => pick[k]).every((k) => present[k]) ? "Check out" : "Check in"}
                </button>
                <button type="button" onClick={() => setFamily(null)} className="min-h-11 rounded-full px-5 text-[15px] text-[#26352a]/70">
                  Cancel
                </button>
              </div>
            </div>
          )}

          <div className="mt-6 border-t border-[#26352a]/10 pt-4">
            <p className="m-0 text-[13px] font-semibold">Staff, add to today&apos;s log</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {["Snack: apples and crackers", "Nap 12:30 to 1:45", "Nature walk to the beach", "Practiced letters A to E"].map((t) => (
                <button key={t} type="button" onClick={() => staffNote(t)} className="min-h-9 rounded-full border border-[#5b7f4a]/40 px-3 text-[13px]">
                  {t}
                </button>
              ))}
            </div>
          </div>
        </section>

        {/* Parent view */}
        <section aria-labelledby="parent-h" className="mx-auto w-full max-w-sm rounded-[36px] border-[10px] border-[#26352a] bg-[#fbfcfa] p-5">
          <h2 id="parent-h" className="m-0 text-[17px] font-semibold">{rivera.name}</h2>
          <p className="m-0 text-[12.5px] text-[#26352a]/55">Today at Little Pines</p>
          <ul className="m-0 mt-4 list-none space-y-2 p-0">
            {rivera.kids.map((k) => (
              <li key={k} className="flex items-center justify-between rounded-2xl bg-[#eaf0e6] px-4 py-3 text-[14.5px]">
                {k}
                <span className={`rounded-full px-2.5 py-0.5 text-[12px] font-semibold ${present[k] ? "bg-[#5b7f4a] text-white" : "bg-white text-[#26352a]/60"}`}>
                  {present[k] ? "At school" : "Not checked in"}
                </span>
              </li>
            ))}
          </ul>
          <p className="m-0 mt-5 text-[13px] font-semibold">The day so far</p>
          <ol className="m-0 mt-2 list-none space-y-2 p-0" aria-live="polite">
            {log.length === 0 && (
              <li className="rounded-xl border border-dashed border-[#26352a]/20 px-3 py-3 text-[13px] text-[#26352a]/55">
                Check in with code 1234, then add a log entry, and it appears here.
              </li>
            )}
            {log.map((e, i) => (
              <li key={i} className="flex gap-3 text-[13.5px]">
                <span className="w-16 shrink-0 text-[#26352a]/50">{e.time}</span>
                <span>{e.text}</span>
              </li>
            ))}
          </ol>
        </section>
      </main>

      <footer className="border-t border-[#26352a]/10 px-5 py-6 text-center text-[13px] text-[#26352a]/60">
        The family portal is a web app for childcare programs: kiosk check-in, attendance and a parent page.{" "}
        <a href="/catalog?c=apps" className="font-semibold text-[#3f6332]">Back to the catalog</a>
      </footer>
    </div>
  );
}
