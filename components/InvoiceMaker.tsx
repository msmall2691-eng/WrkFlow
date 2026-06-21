"use client";

import Reveal from "./Reveal";
import { Label, Slider } from "./KitUI";
import SaveResult from "./SaveResult";
import { useLocalStorage } from "@/lib/useLocalStorage";

/*
  InvoiceMaker — build an invoice or proposal with live totals, then print to a
  clean PDF (or copy/download the text). The kind of billing tool we wire into
  the systems we build for trades.
*/

type Item = { desc: string; qty: number; price: number };

const money = (n: number) =>
  `$${n.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

const DEFAULT_ITEMS: Item[] = [
  { desc: "Labor (per visit)", qty: 1, price: 240 },
  { desc: "Materials", qty: 1, price: 85 },
];

function esc(s: string) {
  return s.replace(/[&<>"]/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" })[c]!);
}

export default function InvoiceMaker() {
  const [biz, setBiz] = useLocalStorage("inv-biz", "Your Business");
  const [client, setClient] = useLocalStorage("inv-client", "Client Name");
  const [invNo, setInvNo] = useLocalStorage("inv-no", "0001");
  const [items, setItems] = useLocalStorage<Item[]>("inv-items", DEFAULT_ITEMS);
  const [taxRate, setTaxRate] = useLocalStorage("inv-tax", 0);
  const [notes, setNotes] = useLocalStorage("inv-notes", "Thanks for your business. Payment due within 14 days.");

  const subtotal = items.reduce((s, it) => s + it.qty * it.price, 0);
  const tax = (subtotal * taxRate) / 100;
  const total = subtotal + tax;
  const today = new Date().toLocaleDateString(undefined, { year: "numeric", month: "long", day: "numeric" });

  const setItem = (i: number, patch: Partial<Item>) =>
    setItems((prev) => prev.map((it, idx) => (idx === i ? { ...it, ...patch } : it)));
  const addItem = () => setItems((prev) => [...prev, { desc: "", qty: 1, price: 0 }]);
  const removeItem = (i: number) => setItems((prev) => prev.filter((_, idx) => idx !== i));

  const summary = [
    `INVOICE #${invNo}`,
    `From: ${biz}`,
    `To:   ${client}`,
    `Date: ${today}`,
    "",
    ...items.map((it) => `${it.qty} × ${it.desc || "—"} @ ${money(it.price)} = ${money(it.qty * it.price)}`),
    "",
    `Subtotal: ${money(subtotal)}`,
    ...(taxRate > 0 ? [`Tax (${taxRate}%): ${money(tax)}`] : []),
    `Total: ${money(total)}`,
    ...(notes ? ["", notes] : []),
  ].join("\n");

  function printInvoice() {
    const rows = items
      .map(
        (it) =>
          `<tr><td>${esc(it.desc) || "—"}</td><td class="r">${it.qty}</td><td class="r">${money(it.price)}</td><td class="r">${money(it.qty * it.price)}</td></tr>`,
      )
      .join("");
    const html = `<!doctype html><html><head><meta charset="utf-8"><title>Invoice ${esc(invNo)}</title>
<style>*{box-sizing:border-box}body{font-family:-apple-system,Segoe UI,Roboto,Helvetica,Arial,sans-serif;color:#16293a;margin:48px}
.top{display:flex;justify-content:space-between;align-items:flex-start;border-bottom:2px solid #16a394;padding-bottom:18px;margin-bottom:28px}
h1{font-size:26px;margin:0;letter-spacing:.04em}.muted{color:#6b7c89;font-size:13px}.biz{font-size:18px;font-weight:600}
table{width:100%;border-collapse:collapse;margin-top:8px}th,td{padding:10px 8px;border-bottom:1px solid #e3e9ec;font-size:14px;text-align:left}
th{font-size:11px;text-transform:uppercase;letter-spacing:.08em;color:#6b7c89}.r{text-align:right}
.totals{margin-top:18px;margin-left:auto;width:280px}.totals div{display:flex;justify-content:space-between;padding:6px 0;font-size:14px}
.grand{border-top:2px solid #16293a;font-size:18px;font-weight:700;margin-top:6px;padding-top:10px}.notes{margin-top:36px;color:#445;font-size:13px;white-space:pre-wrap}
.foot{margin-top:48px;color:#9aa7b1;font-size:11px;text-align:center}</style></head><body>
<div class="top"><div><div class="biz">${esc(biz)}</div><div class="muted">Invoice #${esc(invNo)}</div></div>
<div style="text-align:right"><h1>INVOICE</h1><div class="muted">${today}</div></div></div>
<div class="muted">Billed to</div><div style="font-weight:600;margin-bottom:8px">${esc(client)}</div>
<table><thead><tr><th>Description</th><th class="r">Qty</th><th class="r">Unit</th><th class="r">Amount</th></tr></thead><tbody>${rows}</tbody></table>
<div class="totals"><div><span>Subtotal</span><span>${money(subtotal)}</span></div>
${taxRate > 0 ? `<div><span>Tax (${taxRate}%)</span><span>${money(tax)}</span></div>` : ""}
<div class="grand"><span>Total</span><span>${money(total)}</span></div></div>
${notes ? `<div class="notes">${esc(notes)}</div>` : ""}</body></html>`;
    const w = window.open("", "_blank", "width=800,height=900");
    if (!w) return;
    w.document.write(html);
    w.document.close();
    w.focus();
    setTimeout(() => w.print(), 350);
  }

  return (
    <div className="grid gap-8 md:grid-cols-2 md:items-start">
      {/* Preview */}
      <Reveal>
        <div className="order-1 rounded-2xl border border-line bg-[radial-gradient(120%_120%_at_50%_0%,var(--color-surface)_0%,var(--color-base)_70%)] p-6 md:order-2 md:sticky md:top-24">
          <div className="rounded-xl bg-white p-6 text-[#16293a] shadow-[0_18px_50px_-16px_rgba(0,0,0,0.4)]">
            <div className="flex items-start justify-between border-b-2 border-signal pb-3">
              <div>
                <p className="text-base font-semibold">{biz || "Your Business"}</p>
                <p className="text-xs text-[#6b7c89]">Invoice #{invNo}</p>
              </div>
              <div className="text-right">
                <p className="font-display text-lg font-bold tracking-wide">INVOICE</p>
                <p className="text-xs text-[#6b7c89]">{today}</p>
              </div>
            </div>
            <p className="mt-3 text-[11px] uppercase tracking-wider text-[#6b7c89]">Billed to</p>
            <p className="text-sm font-semibold">{client || "Client Name"}</p>
            <table className="mt-4 w-full text-sm">
              <tbody>
                {items.map((it, i) => (
                  <tr key={i} className="border-b border-[#e3e9ec]">
                    <td className="py-2 pr-2">{it.desc || "—"}</td>
                    <td className="py-2 text-right text-[#6b7c89]">{it.qty}</td>
                    <td className="py-2 pl-2 text-right">{money(it.qty * it.price)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="ml-auto mt-3 w-48 text-sm">
              <div className="flex justify-between py-0.5"><span className="text-[#6b7c89]">Subtotal</span><span>{money(subtotal)}</span></div>
              {taxRate > 0 && (
                <div className="flex justify-between py-0.5"><span className="text-[#6b7c89]">Tax ({taxRate}%)</span><span>{money(tax)}</span></div>
              )}
              <div className="mt-1 flex justify-between border-t-2 border-[#16293a] pt-2 text-base font-bold">
                <span>Total</span><span>{money(total)}</span>
              </div>
            </div>
            {notes && <p className="mt-5 whitespace-pre-wrap text-xs text-[#445]">{notes}</p>}
          </div>
          <button
            type="button"
            onClick={printInvoice}
            className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-signal px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            Print / Save as PDF
          </button>
          <SaveResult summary={summary} filename={`invoice-${invNo}`} />
        </div>
      </Reveal>

      {/* Controls */}
      <Reveal delay={80}>
        <div className="order-2 rounded-2xl border border-line bg-surface p-6 md:order-1">
          <p className="mb-5 font-mono text-[11px] uppercase tracking-widest text-faint">Details</p>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Your business" value={biz} onChange={setBiz} />
            <Field label="Client" value={client} onChange={setClient} />
            <Field label="Invoice #" value={invNo} onChange={setInvNo} />
            <div className="flex items-end">
              <div className="w-full">
                <Slider label="Tax rate" value={taxRate} min={0} max={20} step={0.5} suffix="%" onChange={setTaxRate} />
              </div>
            </div>
          </div>

          <p className="mb-3 mt-6 font-mono text-[11px] uppercase tracking-widest text-faint">Line items</p>
          <div className="space-y-2">
            {items.map((it, i) => (
              <div key={i} className="flex items-center gap-2">
                <input
                  value={it.desc}
                  onChange={(e) => setItem(i, { desc: e.target.value })}
                  placeholder="Description"
                  className="min-w-0 flex-1 rounded-lg border border-line bg-base px-3 py-2 text-sm text-ink placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-signal/40"
                />
                <input
                  type="number"
                  min={0}
                  value={it.qty}
                  onChange={(e) => setItem(i, { qty: Math.max(0, Number(e.target.value)) })}
                  className="w-12 rounded-lg border border-line bg-base px-2 py-2 text-center text-sm text-ink focus:outline-none"
                  aria-label="Quantity"
                />
                <div className="flex w-24 items-center gap-1 rounded-lg border border-line bg-base px-2 py-2">
                  <span className="text-faint">$</span>
                  <input
                    type="number"
                    min={0}
                    value={it.price}
                    onChange={(e) => setItem(i, { price: Math.max(0, Number(e.target.value)) })}
                    className="w-full bg-transparent text-sm text-ink focus:outline-none"
                    aria-label="Unit price"
                  />
                </div>
                <button
                  type="button"
                  onClick={() => removeItem(i)}
                  aria-label="Remove line item"
                  className="shrink-0 rounded-md px-2 py-1 text-faint transition-colors hover:text-[#e5645a]"
                >
                  ×
                </button>
              </div>
            ))}
          </div>
          <button
            type="button"
            onClick={addItem}
            className="mt-3 inline-flex items-center gap-1.5 rounded-full border border-line px-4 py-2 text-xs font-medium text-muted transition-colors hover:border-signal/60 hover:text-ink"
          >
            + Add line item
          </button>

          <div className="mt-6">
            <Label>Notes</Label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              className="w-full rounded-lg border border-line bg-base px-3 py-2 text-sm text-ink placeholder:text-faint focus:outline-none focus:ring-2 focus:ring-signal/40"
            />
          </div>
        </div>
      </Reveal>
    </div>
  );
}

function Field({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <div>
      <Label>{label}</Label>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full rounded-lg border border-line bg-base px-3 py-2 text-sm text-ink focus:outline-none focus:ring-2 focus:ring-signal/40"
      />
    </div>
  );
}
