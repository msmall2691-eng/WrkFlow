"use client";

import { useMemo, useState } from "react";
import OfferLink from "../OfferLink";
import { appOffer, marketItems, smallProjects } from "@/lib/content";

/*
  PriceIt: "price your project before lunch", after Ironline's estimator.

  Every price comes from lib/content.ts; nothing is typed here. Pieces with a
  fixed price add to a running setup range and a monthly total. Bigger work
  is honestly "quoted", and the total says so instead of pretending. The
  button carries the list into the contact form, so what somebody picked
  arrives with their message.
*/

type Piece = {
  id: string;
  name: string;
  what: string;
  price: string;
  lo: number;
  hi: number;
  monthly: number;
  quoted?: boolean;
};

function money(n: number) {
  return `$${n.toLocaleString("en-US")}`;
}

function parseRange(price: string): { lo: number; hi: number } {
  const nums = (price.match(/\$[\d,]+/g) ?? []).map((s) => Number(s.replace(/[$,]/g, "")));
  return { lo: nums[0] ?? 0, hi: nums[1] ?? nums[0] ?? 0 };
}

function buildPieces(): Piece[] {
  const out: Piece[] = [];
  const founding = appOffer.spotsRemaining > 0;
  out.push({
    id: "build",
    name: "A new website, web app or tool",
    what: "Custom built, yours to own.",
    price: founding
      ? `${money(appOffer.price)} founding price · reg. ${money(appOffer.fullPrice)}`
      : money(appOffer.fullPrice),
    lo: founding ? appOffer.price : appOffer.fullPrice,
    hi: founding ? appOffer.price : appOffer.fullPrice,
    monthly: 0,
  });
  for (const id of ["quote-widget", "automation-pack", "welcome-book"]) {
    const m = marketItems.find((x) => x.id === id);
    if (!m) continue;
    const setup = parseRange(m.price);
    const mo = m.price.match(/\$(\d+)\/mo/);
    out.push({
      id,
      name: m.name,
      what: m.tagline,
      price: m.price,
      lo: setup.lo,
      hi: setup.lo,
      monthly: mo ? Number(mo[1]) : 0,
    });
  }
  for (const s of smallProjects) {
    const r = parseRange(s.price);
    out.push({ id: s.title, name: s.title, what: s.scope, price: s.price, lo: r.lo, hi: r.hi, monthly: 0 });
  }
  return out;
}

export default function PriceIt() {
  const pieces = useMemo(buildPieces, []);
  const [on, setOn] = useState<Set<string>>(() => new Set(["build"]));

  const picked = pieces.filter((p) => on.has(p.id));
  const lo = picked.reduce((a, p) => a + p.lo, 0);
  const hi = picked.reduce((a, p) => a + p.hi, 0);
  const mo = picked.reduce((a, p) => a + p.monthly, 0);

  function toggle(id: string) {
    setOn((s) => {
      const n = new Set(s);
      if (n.has(id)) n.delete(id);
      else n.add(id);
      return n;
    });
  }

  const summary = picked.length
    ? `What I picked on the price sheet:\n${picked.map((p) => `- ${p.name} (${p.price})`).join("\n")}`
    : undefined;

  return (
    <section aria-labelledby="price-heading" className="bp-band relative">
      <div className="mx-auto grid max-w-[1400px] gap-12 px-6 py-24 lg:grid-cols-12 lg:px-10">
        <div className="lg:col-span-5">
          <p className="bp-eyebrow"><span className="text-[color:var(--bp-print)]">[ 05 ]</span> Price sheet · real prices</p>
          <h2 id="price-heading" className="bp-h2 mt-4">
            Price your project.
            <span className="bp-serif block normal-case text-[color:var(--bp-print)]">Before lunch.</span>
          </h2>
          <p className="mt-5 max-w-md text-[16px] leading-relaxed text-[color:var(--bp-mute)]">
            Tick what you need. These are the real prices. Anything bigger gets a free written quote
            within a day.
          </p>

          <div className="bp-total mt-10">
            <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-[color:var(--bp-mute)]">Setup</p>
            <p className="bp-total-num" aria-live="polite">
              {picked.length === 0 ? "$0" : lo === hi ? money(lo) : `${money(lo)} – ${money(hi)}`}
            </p>
            {mo > 0 && (
              <p className="mt-1 text-[15px] text-[color:var(--bp-paper)]">
                plus {money(mo)}/mo
              </p>
            )}
            <p className="mt-3 text-[13px] text-[color:var(--bp-mute)]">
              {picked.length} {picked.length === 1 ? "piece" : "pieces"} picked · you own what gets built
            </p>
            <OfferLink offer="project" text={summary} className="bp-btn bp-btn-hi mt-6">
              Send this to Meg
            </OfferLink>
          </div>
        </div>

        <ul className="grid gap-2 lg:col-span-7" aria-label="Price sheet">
          {pieces.map((p) => {
            const checked = on.has(p.id);
            return (
              <li key={p.id}>
                <label className="bp-piece" data-on={checked}>
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggle(p.id)}
                    className="bp-check"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="block text-[16px] font-semibold text-[color:var(--bp-paper)]">{p.name}</span>
                    <span className="mt-0.5 block text-[14px] leading-snug text-[color:var(--bp-mute)]">{p.what}</span>
                  </span>
                  <span className="shrink-0 text-right font-mono text-[13px] text-[color:var(--bp-print)]">{p.price}</span>
                </label>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
