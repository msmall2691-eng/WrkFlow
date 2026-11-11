"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import PrintArtwork from "./PrintArtwork";
import {
  CATEGORIES,
  PRINTS,
  SIZES,
  money,
  shop,
  type Category,
  type Print,
  type PrintSize,
} from "@/lib/demo-shop";

/*
  The Fathom & Fog storefront.

  A real storefront, not a picture of one: browse, filter, open a product,
  pick a size, add to a cart that totals correctly, change quantities, and
  reach a checkout. The one thing it deliberately does not do is take money,
  and the checkout says so rather than mocking a card form, because a fake
  payment field in a public demo is exactly the sort of thing that is fine
  until somebody types a real card number into it.

  Cart state is local and deliberately not persisted. A visitor poking at a
  demo should get a clean store on reload, and there is nothing here worth
  keeping. No analytics, no storage, nothing leaves the page.
*/

type Line = { print: Print; size: PrintSize; qty: number };

const lineTotal = (l: Line) => (l.print.priceCents + l.size.addCents) * l.qty;
const keyOf = (p: Print, s: PrintSize) => `${p.id}:${s.id}`;

export default function ShopDemo() {
  const [cat, setCat] = useState<Category>("All");
  const [open, setOpen] = useState<Print | null>(null);
  const [lines, setLines] = useState<Line[]>([]);
  const [cartOpen, setCartOpen] = useState(false);
  const [placed, setPlaced] = useState(false);

  const shown = useMemo(
    () => (cat === "All" ? PRINTS : PRINTS.filter((p) => p.category === cat)),
    [cat],
  );
  const count = lines.reduce((n, l) => n + l.qty, 0);
  const total = lines.reduce((n, l) => n + lineTotal(l), 0);

  function add(print: Print, size: PrintSize) {
    setLines((prev) => {
      const k = keyOf(print, size);
      const hit = prev.find((l) => keyOf(l.print, l.size) === k);
      return hit
        ? prev.map((l) => (keyOf(l.print, l.size) === k ? { ...l, qty: l.qty + 1 } : l))
        : [...prev, { print, size, qty: 1 }];
    });
    setOpen(null);
    setCartOpen(true);
  }

  function setQty(k: string, qty: number) {
    setLines((prev) =>
      qty <= 0
        ? prev.filter((l) => keyOf(l.print, l.size) !== k)
        : prev.map((l) => (keyOf(l.print, l.size) === k ? { ...l, qty } : l)),
    );
  }

  return (
    <div className="min-h-screen bg-[#fbf7f1] text-[#1d2b35]">
      {/* Unmissable, and first in the DOM so a screen reader hits it first. */}
      <div className="bg-[#1d2b35] px-5 py-2.5 text-center text-[13px] leading-snug text-[#f1e6d8]">
        <strong className="font-semibold">Demo store.</strong> {shop.demoNote}
      </div>

      <header className="sticky top-0 z-30 border-b border-[#1d2b35]/10 bg-[#fbf7f1]/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-5 py-4">
          <div>
            <p className="font-serif text-[22px] leading-none tracking-tight">{shop.name}</p>
            <p className="mt-1 text-[12px] text-[#1d2b35]/55">{shop.tagline}</p>
          </div>
          <button
            type="button"
            onClick={() => setCartOpen(true)}
            className="relative rounded-full border border-[#1d2b35]/25 px-5 py-2.5 text-sm font-medium transition-colors hover:bg-[#1d2b35] hover:text-[#fbf7f1]"
          >
            Cart
            {count > 0 && (
              <span className="ml-2 rounded-full bg-[#9c4221] px-2 py-0.5 text-xs text-white">
                {count}
              </span>
            )}
          </button>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-5 pb-24">
        <section className="py-12 md:py-16">
          <h1 className="max-w-2xl font-serif text-[2.1rem] leading-[1.1] sm:text-5xl">
            Prints of the coast, drawn one at a time.
          </h1>
          <p className="mt-5 max-w-lg text-[1rem] leading-relaxed text-[#1d2b35]/70">
            Six scenes, three sizes, printed on heavy matte stock. Every one of
            these is drawn rather than photographed.
          </p>
        </section>

        <div className="flex flex-wrap gap-2 border-y border-[#1d2b35]/10 py-4">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              aria-pressed={cat === c}
              className={`rounded-full px-4 py-2 text-sm transition-colors ${
                cat === c
                  ? "bg-[#1d2b35] text-[#fbf7f1]"
                  : "border border-[#1d2b35]/20 hover:border-[#1d2b35]/50"
              }`}
            >
              {c}
            </button>
          ))}
        </div>

        <ul className="mt-10 grid gap-x-7 gap-y-12 sm:grid-cols-2 lg:grid-cols-3">
          {shown.map((p) => (
            <li key={p.id}>
              <button
                type="button"
                onClick={() => setOpen(p)}
                className="group block w-full text-left"
              >
                <div className="overflow-hidden rounded-[3px] bg-white p-3 shadow-[0_1px_2px_rgba(29,43,53,0.14)] transition-shadow duration-300 group-hover:shadow-[0_14px_34px_-18px_rgba(29,43,53,0.5)]">
                  <PrintArtwork art={p.art} id={p.id} className="aspect-[4/3] w-full" />
                </div>
                <div className="mt-3 flex items-baseline justify-between gap-3">
                  <h2 className="font-serif text-[17px]">{p.name}</h2>
                  <span className="text-sm text-[#1d2b35]/60">
                    from {money(p.priceCents)}
                  </span>
                </div>
                <p className="mt-1 text-[13px] leading-relaxed text-[#1d2b35]/60">
                  {p.blurb}
                </p>
              </button>
            </li>
          ))}
        </ul>
      </main>

      <footer className="border-t border-[#1d2b35]/10 px-5 py-10 text-center text-[13px] text-[#1d2b35]/55">
        <p>
          {shop.name} is a demo storefront built by{" "}
          <Link href="/" className="underline underline-offset-4 hover:text-[#1d2b35]">
            M Studio
          </Link>
          . It is not a real shop.
        </p>
      </footer>

      {open && <ProductSheet print={open} onClose={() => setOpen(null)} onAdd={add} />}

      {cartOpen && (
        <CartSheet
          lines={lines}
          total={total}
          placed={placed}
          onQty={setQty}
          onPlace={() => setPlaced(true)}
          onClose={() => {
            setCartOpen(false);
            if (placed) {
              setPlaced(false);
              setLines([]);
            }
          }}
        />
      )}
    </div>
  );
}

function ProductSheet({
  print,
  onClose,
  onAdd,
}: {
  print: Print;
  onClose: () => void;
  onAdd: (p: Print, s: PrintSize) => void;
}) {
  const [size, setSize] = useState<PrintSize>(SIZES[0]);
  return (
    <Overlay label={print.name} onClose={onClose}>
      <div className="grid gap-7 md:grid-cols-[1.15fr_1fr]">
        <div className="rounded-[3px] bg-white p-3 shadow-[0_1px_2px_rgba(29,43,53,0.14)]">
          <PrintArtwork art={print.art} id={`sheet-${print.id}`} className="aspect-[4/3] w-full" />
        </div>
        <div>
          <p className="text-[12px] uppercase tracking-wider text-[#1d2b35]/45">
            {print.category}
          </p>
          <h2 className="mt-2 font-serif text-[1.7rem] leading-tight">{print.name}</h2>
          <p className="mt-3 text-[15px] leading-relaxed text-[#1d2b35]/70">{print.blurb}</p>

          <fieldset className="mt-7">
            <legend className="text-[13px] font-medium">Size</legend>
            <div className="mt-2.5 flex flex-wrap gap-2">
              {SIZES.map((s) => (
                <button
                  key={s.id}
                  type="button"
                  onClick={() => setSize(s)}
                  aria-pressed={size.id === s.id}
                  className={`rounded-[3px] border px-4 py-2.5 text-sm transition-colors ${
                    size.id === s.id
                      ? "border-[#1d2b35] bg-[#1d2b35] text-[#fbf7f1]"
                      : "border-[#1d2b35]/25 hover:border-[#1d2b35]/60"
                  }`}
                >
                  {s.label}
                </button>
              ))}
            </div>
          </fieldset>

          <p className="mt-7 font-serif text-[1.6rem]">
            {money(print.priceCents + size.addCents)}
          </p>

          <button
            type="button"
            onClick={() => onAdd(print, size)}
            className="mt-4 w-full rounded-[3px] bg-[#9c4221] px-6 py-3.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
          >
            Add to cart
          </button>
        </div>
      </div>
    </Overlay>
  );
}

function CartSheet({
  lines,
  total,
  placed,
  onQty,
  onPlace,
  onClose,
}: {
  lines: Line[];
  total: number;
  placed: boolean;
  onQty: (k: string, qty: number) => void;
  onPlace: () => void;
  onClose: () => void;
}) {
  return (
    <Overlay label="Cart" onClose={onClose}>
      {placed ? (
        <div className="py-6 text-center">
          <h2 className="font-serif text-[1.6rem]">That is as far as the demo goes.</h2>
          <p className="mx-auto mt-3 max-w-md text-[15px] leading-relaxed text-[#1d2b35]/70">
            A real build would take the payment here, email the receipt, and
            drop the order into whatever the shop already runs on. Nothing was
            charged and nothing was sent, because there is nothing behind this
            store.
          </p>
          <button
            type="button"
            onClick={onClose}
            className="mt-7 rounded-[3px] bg-[#1d2b35] px-7 py-3 text-sm font-semibold text-[#fbf7f1]"
          >
            Start over
          </button>
        </div>
      ) : lines.length === 0 ? (
        <div className="py-10 text-center">
          <h2 className="font-serif text-[1.4rem]">Your cart is empty.</h2>
          <button
            type="button"
            onClick={onClose}
            className="mt-5 text-sm underline underline-offset-4"
          >
            Keep looking
          </button>
        </div>
      ) : (
        <>
          <h2 className="font-serif text-[1.5rem]">Cart</h2>
          <ul className="mt-5 divide-y divide-[#1d2b35]/10">
            {lines.map((l) => {
              const k = keyOf(l.print, l.size);
              return (
                <li key={k} className="flex items-center gap-4 py-4">
                  <div className="w-20 shrink-0 rounded-[2px] bg-white p-1.5 shadow-[0_1px_2px_rgba(29,43,53,0.14)]">
                    <PrintArtwork art={l.print.art} id={`cart-${k}`} className="aspect-[4/3] w-full" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-serif text-[15px]">{l.print.name}</p>
                    <p className="text-[13px] text-[#1d2b35]/55">{l.size.label}</p>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <QtyButton label={`Remove one ${l.print.name}`} onClick={() => onQty(k, l.qty - 1)}>
                      −
                    </QtyButton>
                    <span className="w-7 text-center text-sm tabular-nums">{l.qty}</span>
                    <QtyButton label={`Add one ${l.print.name}`} onClick={() => onQty(k, l.qty + 1)}>
                      +
                    </QtyButton>
                  </div>
                  <span className="w-20 text-right text-sm tabular-nums">
                    {money(lineTotal(l))}
                  </span>
                </li>
              );
            })}
          </ul>

          <div className="mt-5 flex items-baseline justify-between border-t border-[#1d2b35]/15 pt-5">
            <span className="text-sm text-[#1d2b35]/65">Total</span>
            {/* Marked for the smoke test. With a single line at quantity
                two the line total and the grand total are the same string,
                so a test matching on text alone cannot tell them apart. */}
            <span data-testid="cart-total" className="font-serif text-[1.5rem] tabular-nums">
              {money(total)}
            </span>
          </div>

          <button
            type="button"
            onClick={onPlace}
            className="mt-6 w-full rounded-[3px] bg-[#9c4221] px-6 py-3.5 text-sm font-semibold text-white"
          >
            Checkout
          </button>
          {/*
            Said before the click, not only after. A visitor should know this
            takes no money before they press a button labelled Checkout.
          */}
          <p className="mt-3 text-center text-[12px] text-[#1d2b35]/55">
            No card is asked for and nothing is charged. This is a demo.
          </p>
        </>
      )}
    </Overlay>
  );
}

function QtyButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="h-8 w-8 rounded-[3px] border border-[#1d2b35]/25 text-sm leading-none transition-colors hover:border-[#1d2b35]/60"
    >
      {children}
    </button>
  );
}

function Overlay({
  children,
  label,
  onClose,
}: {
  children: React.ReactNode;
  label: string;
  onClose: () => void;
}) {
  return (
    <div
      className="fixed inset-0 z-40 flex items-start justify-center overflow-y-auto px-4 py-8 sm:py-14"
      role="dialog"
      aria-modal="true"
      aria-label={label}
    >
      <div
        className="absolute inset-0 bg-[#1d2b35]/45 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />
      <div className="relative w-full max-w-3xl rounded-[4px] bg-[#fbf7f1] p-6 shadow-2xl sm:p-8">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close"
          className="absolute right-4 top-4 text-xl leading-none text-[#1d2b35]/45 transition-colors hover:text-[#1d2b35]"
        >
          ×
        </button>
        {children}
      </div>
    </div>
  );
}
