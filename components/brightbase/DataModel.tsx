"use client";

import { useState } from "react";
import { client, matching, modelFacts, modelGroups, modelNodes, type ModelNode } from "@/lib/brightbase-model";

/*
  "How the data fits together" — BrightBase's schema, drawn around the client.

  Pick a record and the panel in the middle says what it is and what it
  points to, and every record it points to lights up. That is the only
  motion here, and the visitor causes it (150ms colour change; nothing
  loops, nothing moves on its own).
*/

const LINK_TO_NODE: Record<string, string> = {
  Client: "client",
  Property: "properties",
  Request: "requests",
  Deal: "deals",
  Quote: "quotes",
  "Recurring schedule": "recurring",
  Job: "jobs",
  Message: "conversations",
};

function NodeButton({
  node,
  selected,
  linked,
  onPick,
}: {
  node: ModelNode;
  selected: boolean;
  linked: boolean;
  onPick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onPick}
      className={`flex w-full min-h-11 items-center justify-between gap-3 rounded-xl border px-3.5 py-2.5 text-left transition-colors duration-150 ${
        selected
          ? "border-[color:var(--cp-violet-line)] bg-[color:var(--cp-violet-wash)]"
          : linked
            ? "border-[rgba(45,212,191,0.55)] bg-[rgba(45,212,191,0.08)]"
            : "border-[color:var(--cp-line)] bg-[rgba(18,16,26,0.62)] hover:border-[color:var(--cp-hairline-strong)]"
      }`}
    >
      <span className="text-[14.5px] font-semibold text-[color:var(--cp-ink)]">{node.label}</span>
      <span className="font-mono text-[11px] text-[color:var(--cp-faint)]">{node.table}</span>
    </button>
  );
}

export default function DataModel() {
  const [pick, setPickState] = useState<string>("jobs");
  // On a phone the explanation sits above the list, off-screen once you are
  // tapping records lower down, so bring it into view. Desktop shows all three
  // columns at once and never scrolls.
  const setPick = (id: string) => {
    setPickState(id);
    if (typeof window === "undefined" || window.innerWidth >= 1024) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    document.getElementById("dm-detail")?.scrollIntoView({ block: "nearest", behavior: reduce ? "auto" : "smooth" });
  };
  const node = modelNodes.find((n) => n.id === pick);
  const linkedIds = new Set((node?.links ?? []).map((l) => LINK_TO_NODE[l]).filter(Boolean));
  const clientLinked = pick === "client" || linkedIds.has("client");

  const group = (g: ModelNode["group"]) => {
    const meta = modelGroups.find((x) => x.id === g);
    return (
      <div key={g} className="flex flex-col gap-2">
        <span className="text-[12.5px] font-medium text-[color:var(--cp-faint)]">{meta?.label}</span>
        {modelNodes
          .filter((n) => n.group === g)
          .map((n) => (
            <NodeButton key={n.id} node={n} selected={n.id === pick} linked={linkedIds.has(n.id)} onPick={() => setPick(n.id)} />
          ))}
      </div>
    );
  };

  return (
    <div className="flex flex-col gap-10">
      <div className="grid grid-cols-12 gap-y-6 lg:gap-x-6">
        <div className="col-span-12 flex min-w-0 flex-col gap-5 md:col-span-6 lg:col-span-4">
          {group("identity")}
          {group("sales")}
        </div>

        {/* The hub, and what the picked record does */}
        <div className="order-first col-span-12 flex min-w-0 flex-col gap-4 lg:order-none lg:col-span-4">
          <button
            type="button"
            aria-pressed={pick === "client"}
            onClick={() => setPick("client")}
            className="cp-tile flex flex-col items-start gap-2 p-5 text-left transition-colors duration-150"
            style={{
              background: "linear-gradient(150deg, rgba(139,92,246,0.30), rgba(45,212,191,0.10) 70%, rgba(18,16,26,0.6))",
              ...(clientLinked ? { borderColor: "rgba(185,162,255,0.55)" } : {}),
            }}
          >
            <span className="flex w-full items-center justify-between gap-3">
              <span className="font-display text-[26px] font-semibold tracking-[-0.02em] text-[color:var(--cp-ink)]">{client.label}</span>
              <span className="font-mono text-[11px] text-[color:var(--cp-soft)]">{client.table}</span>
            </span>
            <span className="text-[14px] leading-relaxed text-[color:var(--cp-soft)]">{client.body}</span>
          </button>

          <div id="dm-detail" className="cp-tile flex min-h-[210px] scroll-mt-4 flex-col gap-3 p-5" aria-live="polite">
            {node ? (
              <>
                <span className="flex items-center justify-between gap-3">
                  <span className="text-[17px] font-semibold text-[color:var(--cp-ink)]">{node.label}</span>
                  <span className="font-mono text-[11px] text-[color:var(--cp-faint)]">{node.table}</span>
                </span>
                <p className="m-0 text-[14px] leading-relaxed text-[color:var(--cp-muted)]">{node.body}</p>
                <div className="mt-auto flex flex-wrap items-center gap-2">
                  <span className="text-[12.5px] text-[color:var(--cp-faint)]">Points to</span>
                  {node.links.map((l) => (
                    <span key={l} className="rounded-md bg-[rgba(45,212,191,0.10)] px-2 py-1 text-[12.5px] text-[color:var(--cp-teal)]">
                      {l}
                    </span>
                  ))}
                </div>
              </>
            ) : (
              <p className="m-0 text-[14px] leading-relaxed text-[color:var(--cp-muted)]">
                Pick any record to see what it is and what it points to. Everything ends at the client.
              </p>
            )}
          </div>
        </div>

        <div className="col-span-12 flex min-w-0 flex-col gap-5 md:col-span-6 lg:col-span-4">
          {group("work")}
          {group("money")}
          {group("talk")}
        </div>
      </div>

      {/* How a message finds its client */}
      <div className="flex flex-col gap-4">
        <h3 className="m-0 text-[18px] font-semibold text-[color:var(--cp-ink)]">How an email, text or request finds its client</h3>
        <ol className="m-0 grid list-none grid-cols-1 gap-3 p-0 md:grid-cols-3">
          {matching.map((m, i) => (
            <li key={m.step} className="cp-tile flex flex-col gap-2 p-5">
              <span className="flex items-center gap-2.5">
                <span className="grid h-7 w-7 place-items-center rounded-lg bg-[color:var(--cp-violet-wash)] font-mono text-[12px] text-[color:var(--cp-violet-ink)]">
                  {i + 1}
                </span>
                <span className="text-[15.5px] font-semibold text-[color:var(--cp-ink)]">{m.step}</span>
              </span>
              <span className="text-[14px] leading-relaxed text-[color:var(--cp-muted)]">{m.body}</span>
            </li>
          ))}
        </ol>
      </div>

      <dl className="m-0 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {modelFacts.map((f) => (
          <div key={f.label} className="flex flex-col-reverse gap-1 border-t border-[color:var(--cp-line)] pt-4">
            <dt className="text-[13.5px] text-[color:var(--cp-muted)]">{f.label}</dt>
            <dd className="m-0 font-display text-[34px] font-semibold leading-none tracking-[-0.03em] text-[color:var(--cp-ink)]">{f.value}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
