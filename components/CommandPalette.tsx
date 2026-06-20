"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

/*
  CommandPalette — a ⌘K / Ctrl-K launcher.

  A small signal that this studio builds real software: fuzzy-search the site,
  jump to any section, fire the primary actions (start a conversation, email,
  run the automation demo). Keyboard-first, accessible, no dependencies.
*/

type Command = {
  id: string;
  label: string;
  hint?: string;
  group: string;
  keywords?: string;
  run: () => void;
};

function scrollToId(id: string) {
  document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function CommandPalette() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [index, setIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLDivElement>(null);

  const close = useCallback(() => {
    setOpen(false);
    setQuery("");
    setIndex(0);
  }, []);

  const commands = useMemo<Command[]>(() => {
    const go = (id: string) => () => {
      close();
      scrollToId(id);
    };
    return [
      { id: "top", label: "Home", group: "Navigate", keywords: "hero start top", run: go("top") },
      { id: "shift", label: "The shift", group: "Navigate", keywords: "why now", run: go("shift") },
      { id: "who", label: "Who it's for", group: "Navigate", keywords: "audience fit", run: go("shift") },
      { id: "work", label: "Shipped & live", group: "Navigate", keywords: "work showcase portfolio", run: go("live") },
      { id: "kit", label: "Try it live (tools + automations)", group: "Navigate", keywords: "demos try tools calculator quote rate signature automation workflow lead intake", run: go("kit") },
      { id: "dash", label: "Rental dashboard", group: "Navigate", keywords: "dashboard analytics airbnb vrbo command center calendar sync revenue", run: go("dash") },
      { id: "services", label: "Services", group: "Navigate", keywords: "what we do offerings", run: go("services") },
      { id: "approach", label: "Approach", group: "Navigate", keywords: "process method", run: go("approach") },
      {
        id: "contact",
        label: "Start a conversation",
        hint: "→",
        group: "Actions",
        keywords: "contact talk hire quote",
        run: go("contact"),
      },
      {
        id: "email",
        label: "Email the studio",
        hint: "↗",
        group: "Actions",
        keywords: "mail email contact gmail",
        run: () => {
          close();
          window.location.href = "mailto:contact@mlinx.studio";
        },
      },
      {
        id: "call",
        label: "Call or text",
        hint: "↗",
        group: "Actions",
        keywords: "phone call text sms number",
        run: () => {
          close();
          window.location.href = "tel:+12074329492";
        },
      },
    ];
  }, [close]);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return commands;
    return commands.filter((c) =>
      `${c.label} ${c.group} ${c.keywords ?? ""}`.toLowerCase().includes(q),
    );
  }, [commands, query]);

  // Open/close hotkeys.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape" && open) {
        close();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, close]);

  // Focus the input when opened.
  useEffect(() => {
    if (open) {
      setIndex(0);
      requestAnimationFrame(() => inputRef.current?.focus());
    }
  }, [open]);

  // Clamp selection as results shrink.
  useEffect(() => {
    setIndex((i) => Math.min(i, Math.max(0, results.length - 1)));
  }, [results.length]);

  const onListKey = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setIndex((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setIndex((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      e.preventDefault();
      results[index]?.run();
    }
  };

  // Keep the active row in view.
  useEffect(() => {
    const el = listRef.current?.querySelector<HTMLElement>(`[data-i="${index}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [index]);

  return (
    <>
      {/* Persistent hint chip — bottom-left, out of the way */}
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Open command menu"
        className="fixed bottom-5 left-5 z-40 hidden items-center gap-2 rounded-full border border-line bg-base/80 px-3.5 py-2 font-mono text-[11px] uppercase tracking-widest text-muted shadow-sm backdrop-blur transition-colors hover:text-ink md:inline-flex"
      >
        <kbd className="rounded border border-line bg-surface px-1.5 py-0.5 text-[10px]">⌘K</kbd>
        Menu
      </button>

      {open && (
        <div
          className="fixed inset-0 z-[60] flex items-start justify-center px-4 pt-[12vh]"
          role="dialog"
          aria-modal="true"
          aria-label="Command menu"
        >
          <div
            className="absolute inset-0 bg-ink/40 backdrop-blur-sm"
            onClick={close}
            aria-hidden="true"
          />
          <div
            className="relative w-full max-w-xl overflow-hidden rounded-2xl border border-line bg-base shadow-2xl"
            onKeyDown={onListKey}
          >
            <div className="flex items-center gap-3 border-b border-line px-4">
              <span aria-hidden="true" className="text-faint">⌕</span>
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search or jump to…"
                className="w-full bg-transparent py-4 text-sm text-ink placeholder:text-faint focus:outline-none"
              />
              <kbd className="rounded border border-line bg-surface px-1.5 py-0.5 font-mono text-[10px] text-faint">
                Esc
              </kbd>
            </div>

            <div ref={listRef} className="max-h-[50vh] overflow-y-auto py-2">
              {results.length === 0 && (
                <p className="px-4 py-6 text-center text-sm text-faint">No matches.</p>
              )}
              {results.map((c, i) => {
                const showGroup = i === 0 || results[i - 1].group !== c.group;
                return (
                  <div key={c.id}>
                    {showGroup && (
                      <p className="px-4 pb-1 pt-3 font-mono text-[10px] uppercase tracking-widest text-faint">
                        {c.group}
                      </p>
                    )}
                    <button
                      type="button"
                      data-i={i}
                      onMouseEnter={() => setIndex(i)}
                      onClick={() => c.run()}
                      className={`flex w-full items-center justify-between px-4 py-2.5 text-left text-sm transition-colors ${
                        i === index ? "bg-signal/10 text-ink" : "text-muted hover:text-ink"
                      }`}
                    >
                      <span>{c.label}</span>
                      {c.hint && (
                        <span aria-hidden="true" className="text-faint">{c.hint}</span>
                      )}
                    </button>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
