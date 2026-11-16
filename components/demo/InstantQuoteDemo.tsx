"use client";

import { useState } from "react";

/*
  Instant quote — the demo (Nov 15 2026).

  An ADD-ON FOR YOUR SITE: a quote calculator that drops into a business's
  existing website. The demo makes "add-on" visible by showing it twice:
  on the left, an invented landscaping company's site with the widget sitting
  in it; on the right, the owner's settings. Change a price on the right and
  the quote on the left changes, which is the whole idea, it is set to your
  prices. Submitting shows the lead email the owner would get. Nothing is
  sent.

  The host site wears its own look (deep green, a contractor's colours) so
  the widget reads as a guest inside somebody else's site.
*/

type Service = { id: string; name: string; base: number; perUnit: number; unit: string };

const DEFAULTS: Service[] = [
  { id: "mow", name: "Weekly mowing", base: 35, perUnit: 8, unit: "quarter acre" },
  { id: "cleanup", name: "Spring cleanup", base: 150, perUnit: 60, unit: "quarter acre" },
  { id: "mulch", name: "Mulch install", base: 90, perUnit: 45, unit: "yard of mulch" },
];

export default function InstantQuoteDemo() {
  const [services, setServices] = useState(DEFAULTS);
  const [pick, setPick] = useState("cleanup");
  const [size, setSize] = useState(2);
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const s = services.find((x) => x.id === pick)!;
  const low = Math.round(s.base + s.perUnit * size * 0.9);
  const high = Math.round(s.base + s.perUnit * size * 1.15);

  function setPrice(id: string, key: "base" | "perUnit", v: number) {
    setServices((all) => all.map((x) => (x.id === id ? { ...x, [key]: Math.max(0, v) } : x)));
  }

  return (
    <div className="min-h-screen bg-[#eef0ec] text-[#1b2a1f]">
      <p className="bg-[#1b2a1f] px-5 py-2.5 text-center text-[13px] leading-snug text-[#d9e6d2]">
        Demo of the instant quote add-on by M Studio. Ledgeview Lawn &amp; Garden is an invented business.
        Nothing is sent.
      </p>

      <main className="mx-auto grid max-w-6xl gap-6 px-5 py-6 lg:grid-cols-[1.35fr_1fr]">
        {/* The customer's website, with the add-on inside it */}
        <section aria-label="A sample business website with the quote add-on" className="overflow-hidden rounded-2xl border border-[#1b2a1f]/12 bg-white">
          <div className="flex items-center gap-1.5 border-b border-[#1b2a1f]/10 bg-[#f6f7f4] px-3 py-2">
            <span className="h-2.5 w-2.5 rounded-full bg-[#1b2a1f]/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#1b2a1f]/15" />
            <span className="h-2.5 w-2.5 rounded-full bg-[#1b2a1f]/15" />
            <span className="ml-2 truncate text-[12px] text-[#1b2a1f]/50">ledgeviewlawn.example</span>
          </div>
          <div className="bg-[#274b32] px-6 py-8 text-white">
            <p className="m-0 text-[13px] opacity-80">Ledgeview Lawn &amp; Garden</p>
            <h1 className="m-0 mt-2 max-w-md text-[26px] font-semibold leading-tight">Yard work, priced before you call.</h1>
          </div>

          <div className="p-6">
            <div className="rounded-2xl border-2 border-dashed border-[#4f46e5]/40 p-1">
              <p className="m-0 px-3 pt-1 text-[11px] font-semibold text-[#4f46e5]">The add-on</p>
              <div className="rounded-xl bg-[#f6f7f4] p-5">
                <p className="m-0 text-[16px] font-semibold">Get an instant estimate</p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {services.map((x) => (
                    <button
                      key={x.id}
                      type="button"
                      onClick={() => { setPick(x.id); setSent(false); }}
                      aria-pressed={pick === x.id}
                      className={`min-h-9 rounded-full px-3.5 text-[13.5px] ${pick === x.id ? "bg-[#274b32] text-white" : "border border-[#1b2a1f]/20 bg-white"}`}
                    >
                      {x.name}
                    </button>
                  ))}
                </div>
                <label className="mt-4 block text-[13px]">
                  How much? <span className="font-semibold">{size} {s.unit}{size === 1 ? "" : "s"}</span>
                  <input type="range" min={1} max={8} value={size} onChange={(e) => { setSize(Number(e.target.value)); setSent(false); }} className="mt-1 block w-full accent-[#274b32]" />
                </label>
                <p className="m-0 mt-4 text-[13px] text-[#1b2a1f]/60">Estimated price</p>
                <p className="m-0 text-[30px] font-semibold tracking-tight">${low} to ${high}</p>
                {!sent ? (
                  <form
                    onSubmit={(e) => { e.preventDefault(); setSent(true); }}
                    className="mt-3 flex flex-wrap gap-2"
                  >
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      aria-label="Your email"
                      className="min-h-10 flex-1 rounded-lg border border-[#1b2a1f]/20 bg-white px-3 text-[14px]"
                    />
                    <button type="submit" className="min-h-10 rounded-lg bg-[#274b32] px-4 text-[14px] font-semibold text-white">
                      Send me this quote
                    </button>
                  </form>
                ) : (
                  <p className="m-0 mt-3 rounded-lg bg-white px-3 py-2.5 text-[13.5px]">Sent. Ledgeview will follow up within a day.</p>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* The owner's side */}
        <div className="space-y-5">
          <section aria-labelledby="set-h" className="rounded-2xl border border-[#1b2a1f]/12 bg-white p-5">
            <h2 id="set-h" className="m-0 text-[15px] font-semibold">Your prices</h2>
            <p className="m-0 mt-1 text-[12.5px] text-[#1b2a1f]/60">Change a number and the quote on your site updates.</p>
            <table className="mt-3 w-full text-[13px]">
              <thead>
                <tr className="text-left text-[11.5px] text-[#1b2a1f]/50">
                  <th className="pb-1.5 font-medium">Service</th>
                  <th className="pb-1.5 font-medium">Base $</th>
                  <th className="pb-1.5 font-medium">Per unit $</th>
                </tr>
              </thead>
              <tbody>
                {services.map((x) => (
                  <tr key={x.id} className="border-t border-[#1b2a1f]/8">
                    <td className="py-2 pr-2">{x.name}</td>
                    {(["base", "perUnit"] as const).map((k) => (
                      <td key={k} className="py-2 pr-2">
                        <input
                          type="number"
                          value={x[k]}
                          onChange={(e) => setPrice(x.id, k, Number(e.target.value))}
                          aria-label={`${x.name} ${k === "base" ? "base price" : "price per unit"}`}
                          className="min-h-9 w-20 rounded-md border border-[#1b2a1f]/20 px-2"
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </section>

          <section aria-labelledby="lead-h" className="rounded-2xl border border-[#1b2a1f]/12 bg-white p-5" aria-live="polite">
            <h2 id="lead-h" className="m-0 text-[15px] font-semibold">The email you get</h2>
            {sent ? (
              <div className="mt-3 rounded-xl bg-[#f6f7f4] p-4 text-[13.5px] leading-relaxed">
                <p className="m-0 font-semibold">New estimate request: {s.name}</p>
                <p className="m-0 mt-1">From {email || "a visitor"}</p>
                <p className="m-0">{size} {s.unit}{size === 1 ? "" : "s"} · quoted ${low} to ${high}</p>
              </div>
            ) : (
              <p className="m-0 mt-2 text-[13px] text-[#1b2a1f]/60">Send the quote on the left to see the lead arrive here.</p>
            )}
          </section>

          <p className="m-0 text-[12.5px] leading-relaxed text-[#1b2a1f]/60">
            An add-on means it goes on the website you already have, with one line of code. It is set
            up to your services, prices and colours.
          </p>
        </div>
      </main>

      <footer className="border-t border-[#1b2a1f]/10 px-5 py-6 text-center text-[13px] text-[#1b2a1f]/60">
        <a href="/catalog?c=booking" className="font-semibold text-[#274b32]">Back to the catalog</a>
      </footer>
    </div>
  );
}
