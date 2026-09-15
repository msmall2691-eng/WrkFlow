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
      { id: "services", label: "Services", group: "Navigate", keywords: "what we do offerings websites tools plugins", run: go("services") },
      { id: "tools", label: "Free tools", group: "Navigate", keywords: "tools quote estimator email signature qr code website check lighthouse speed seo free try", run: go("tools") },
      { id: "work", label: "Selected work", group: "Navigate", keywords: "work showcase portfolio projects shipped", run: go("work") },
      {
        id: "marketplace",
        label: "M Linx marketplace",
        hint: "↗",
        group: "Navigate",
        keywords: "linx buy templates tools premade store shop products embed marketplace",
        run: () => {
          close();
          window.location.href = "/marketplace";
        },
      },
      { id: "approach", label: "Approach", group: "Navigate", keywords: "process method", run: go("approach") },
      { id: "pricing", label: "Pricing", group: "Navigate", keywords: "pricing cost price care plan starter site founding offer monthly", run: go("pricing") },
      { id: "meg", label: "Meet Meg", hint: "☕", group: "Navigate", keywords: "founder meg about story who", run: go("founder") },
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
      {
        id: "sitecheck",
        label: "Run a site check",
        hint: "↗",
        group: "Actions",
        keywords: "lighthouse speed audit performance seo accessibility site check pagespeed tool",
        run: () => {
          close();
          window.location.href = "/marketplace";
        },
      },
      {
        id: "accent",
        label: "Toggle accent color",
        hint: "◑",
        group: "Actions",
        keywords: "theme color accent palette signal recolor make it yours",
        // Leave the palette open so Enter can cycle through accents quickly.
        run: () => window.dispatchEvent(new Event("accent:cycle")),
      },
      {
        id: "scrub",
        label: "Scrub the Maine day",
        hint: "☀",
        group: "Actions",
        keywords: "time day sun sunrise sunset daylight preview scrub clock hour night dusk dawn",
        // Sends them to the handle rather than driving it from here: the
        // point of the thing is the dragging.
        run: () => {
          close();
          document.getElementById("top")?.scrollIntoView({ behavior: "smooth" });
          // After the scroll settles, put focus on the slider so it responds
          // to arrow keys immediately for anyone not using a pointer.
          setTimeout(() => {
            document
              .querySelector<HTMLInputElement>('input[type="range"][data-day-scrubber]')
              ?.focus();
          }, 600);
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

  // Open/close hotkeys — plus a global `cmdk:open` event so buttons
  // anywhere in the app (Nav, hint chips) can trigger the palette.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === "Escape" && open) {
        close();
      }
    };
    const onOpen = () => setOpen(true);
    window.addEventListener("keydown", onKey);
    window.addEventListener("cmdk:open", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("cmdk:open", onOpen);
    };
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
