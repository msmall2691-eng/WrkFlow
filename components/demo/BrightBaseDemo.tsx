"use client";

import { useState } from "react";

/*
  BrightBase — the demo (Nov 15 2026).

  A WEB APP: the operations system a service business runs on. The real one
  runs The Maine Cleaning Co. every day. Meg's note: the screenshots "are
  not a good visual of what we can do", so this lets a visitor push one job
  through the whole life of a job themselves, in five steps, with an
  invented company and customer. This content really is a sequence, which
  is why it is numbered.

  Design: white, ink and one indigo, close to the real app, so what a buyer
  clicks here is what they would get. Each step changes the same job card
  and adds to the activity log, which is the point: one record, start to
  finish, instead of five apps.
*/

const STEPS = [
  { key: "request", label: "Request", action: "Send the quote" },
  { key: "quote", label: "Quote", action: "Customer approves" },
  { key: "booked", label: "Booked", action: "Mark the job done" },
  { key: "invoiced", label: "Invoiced", action: "Customer pays" },
  { key: "paid", label: "Paid", action: "" },
] as const;

const LINES = [
  { item: "Deep clean, 3 bed / 2 bath", qty: 1, price: 340 },
  { item: "Inside windows", qty: 1, price: 45 },
];

function nextWeekday(): string {
  const d = new Date();
  d.setDate(d.getDate() + 3);
  return d.toLocaleDateString("en-US", { weekday: "long", month: "long", day: "numeric" });
}

export default function BrightBaseDemo() {
  const [step, setStep] = useState(0);
  const [log, setLog] = useState<string[]>(["Request came in from the website form"]);
  const total = LINES.reduce((s, l) => s + l.qty * l.price, 0);
  const when = nextWeekday();

  const events = [
    "Quote Q-1042 sent by text and email",
    `Customer approved the quote. Booked for ${when}, 9:00, crew: Tess`,
    "Crew marked the job done with photos. Invoice INV-2188 sent",
    `Paid $${total}.00 by card. Receipt sent`,
  ];

  function advance() {
    if (step >= STEPS.length - 1) return;
    setLog((l) => [...l, events[step]]);
    setStep((s) => s + 1);
  }

  function reset() {
    setStep(0);
    setLog(["Request came in from the website form"]);
  }

  const status = STEPS[step];

  return (
    <div className="min-h-screen bg-[#f6f7fb] text-[#0f172a]">
      <p className="bg-[#0f172a] px-5 py-2.5 text-center text-[13px] leading-snug text-[#c7d2fe]">
        Demo of BrightBase, a web app by M Studio. The company, customer and prices are invented.
        Nothing is saved or sent.
      </p>

      <div className="mx-auto max-w-6xl px-5 py-6">
        <header className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="grid h-8 w-8 place-items-center rounded-lg bg-[#4f46e5] text-[14px] font-bold text-white">B</span>
            <div>
              <p className="m-0 text-[16px] font-semibold">BrightBase</p>
              <p className="m-0 text-[12.5px] text-[#0f172a]/55">Harbor Light Cleaning · office view</p>
            </div>
          </div>
          <button type="button" onClick={reset} className="min-h-9 rounded-lg border border-[#0f172a]/15 bg-white px-3.5 text-[13.5px]">
            Start over
          </button>
        </header>

        {/* The life of one job, as a real sequence. */}
        <ol className="m-0 mt-6 grid list-none grid-cols-5 gap-1.5 p-0" aria-label="Job progress">
          {STEPS.map((s, i) => (
            <li key={s.key}>
              <div className={`h-1.5 rounded-full ${i <= step ? "bg-[#4f46e5]" : "bg-[#0f172a]/10"}`} />
              <p className={`m-0 mt-1.5 text-[12px] ${i === step ? "font-semibold text-[#0f172a]" : "text-[#0f172a]/50"}`}>
                {i + 1}. {s.label}
              </p>
            </li>
          ))}
        </ol>

        <div className="mt-6 grid gap-5 lg:grid-cols-[1.4fr_1fr]">
          {/* The job record */}
          <section aria-labelledby="job-h" className="rounded-2xl border border-[#0f172a]/10 bg-white p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <h1 id="job-h" className="m-0 text-[19px] font-semibold">Casey Tidewater</h1>
                <p className="m-0 mt-0.5 text-[13px] text-[#0f172a]/60">10 Sample Street, Kennebunk · (207) 555-0142</p>
              </div>
              <span className="rounded-md bg-[#eef2ff] px-2.5 py-1 text-[12.5px] font-semibold text-[#3730a3]">{status.label}</span>
            </div>

            <table className="mt-5 w-full border-collapse text-[13.5px]">
              <thead>
                <tr className="text-left text-[12px] text-[#0f172a]/50">
                  <th className="pb-2 font-medium">Service</th>
                  <th className="pb-2 text-right font-medium">Price</th>
                </tr>
              </thead>
              <tbody>
                {LINES.map((l) => (
                  <tr key={l.item} className="border-t border-[#0f172a]/8">
                    <td className="py-2">{l.item}</td>
                    <td className="py-2 text-right">${l.price}.00</td>
                  </tr>
                ))}
                <tr className="border-t border-[#0f172a]/15 font-semibold">
                  <td className="py-2">Total</td>
                  <td className="py-2 text-right">${total}.00</td>
                </tr>
              </tbody>
            </table>

            <dl className="mt-4 grid grid-cols-2 gap-3 text-[13px]">
              <div className="rounded-lg bg-[#f6f7fb] p-3">
                <dt className="text-[#0f172a]/50">Scheduled</dt>
                <dd className="m-0 mt-0.5 font-medium">{step >= 2 ? `${when}, 9:00` : "Not yet"}</dd>
              </div>
              <div className="rounded-lg bg-[#f6f7fb] p-3">
                <dt className="text-[#0f172a]/50">Balance</dt>
                <dd className="m-0 mt-0.5 font-medium">{step >= 4 ? "$0.00, paid" : step >= 3 ? `$${total}.00 due` : "Not invoiced"}</dd>
              </div>
            </dl>

            {step < STEPS.length - 1 ? (
              <button
                type="button"
                onClick={advance}
                className="mt-5 min-h-11 w-full rounded-xl bg-[#4f46e5] px-5 text-[14.5px] font-semibold text-white hover:bg-[#4338ca] sm:w-auto"
              >
                {status.action}
              </button>
            ) : (
              <p className="m-0 mt-5 rounded-xl bg-[#ecfdf5] px-4 py-3 text-[14px] text-[#065f46]">
                Done. One record took this job from the first message to paid.
              </p>
            )}
          </section>

          {/* Activity */}
          <section aria-labelledby="log-h" className="rounded-2xl border border-[#0f172a]/10 bg-white p-5">
            <h2 id="log-h" className="m-0 text-[15px] font-semibold">Activity</h2>
            <ol className="m-0 mt-3 list-none space-y-3 p-0" aria-live="polite">
              {log.map((e, i) => (
                <li key={e} className="flex gap-3 text-[13.5px]">
                  <span className={`mt-1.5 h-2 w-2 shrink-0 rounded-full ${i === log.length - 1 ? "bg-[#4f46e5]" : "bg-[#0f172a]/20"}`} />
                  <span>{e}</span>
                </li>
              ))}
            </ol>
            <p className="m-0 mt-5 border-t border-[#0f172a]/8 pt-4 text-[12.5px] leading-relaxed text-[#0f172a]/60">
              In the real app the customer gets the texts and emails, the crew sees the job on their
              phone, and the payment goes to your bank through Stripe.
            </p>
          </section>
        </div>
      </div>

      <footer className="border-t border-[#0f172a]/10 px-5 py-6 text-center text-[13px] text-[#0f172a]/60">
        BrightBase is a web app for service businesses: quotes, scheduling, crew, invoices and payments.{" "}
        <a href="/brightbase" className="font-semibold text-[#4f46e5]">More about BrightBase</a>
      </footer>
    </div>
  );
}
