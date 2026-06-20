"use client";

import { useEffect, useRef, useState } from "react";

/*
  useLocalStorage — persists a piece of tool state across visits so the
  Playground tools actually remember what the visitor set. SSR-safe: starts
  from the provided initial value, then hydrates from storage after mount.
*/
export function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(initial);
  const hydrated = useRef(false);

  // Hydrate once on mount (avoids SSR/client markup mismatch).
  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw != null) setValue(JSON.parse(raw) as T);
    } catch {
      /* ignore malformed / unavailable storage */
    }
    hydrated.current = true;
  }, [key]);

  // Persist after hydration so we never overwrite stored data with the initial.
  useEffect(() => {
    if (!hydrated.current) return;
    try {
      window.localStorage.setItem(key, JSON.stringify(value));
    } catch {
      /* ignore quota / unavailable storage */
    }
  }, [key, value]);

  return [value, setValue] as const;
}

/** Copy text to the clipboard, resolving true on success. */
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    return false;
  }
}
