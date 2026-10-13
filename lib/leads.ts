import { createClient, type SupabaseClient } from "@supabase/supabase-js";

/*
  Lead storage.

  Every lead on this site used to exist only as an email. If Gmail SMTP was
  down, or the env vars were missing, the visitor saw an error and the lead was
  simply gone — no record anywhere. So: write the lead to Postgres FIRST, then
  send the notification. Email becomes the convenience, not the system of
  record.

  Supabase is reached with the publishable (anon) key, which an RLS policy
  grants INSERT-only on well-formed rows (see supabase/schema.sql). It can
  never read leads back, so it is safe to hold in the deployment env.

  Two rules this module exists to enforce:
    1. storeLead never throws and never rejects. A storage problem must not
       take down the form that is trying to capture a lead.
    2. storeLead never hangs. A stalled database call would hold the request
       open until the serverless function timed out, which the visitor
       experiences as a broken form, so the insert is given a hard deadline.
*/

export type LeadSource = "contact" | "questionnaire" | "tool" | "site-check";

export type Lead = {
  source: LeadSource;
  email: string;
  name?: string;
  company?: string;
  phone?: string;
  message?: string;
  /* Which CTA produced the lead, already resolved to a human label. */
  offer?: string;
  /* Anything structured worth keeping — questionnaire answers, tool id. */
  details?: Record<string, unknown>;
};

/* Mirrors the length limits in the table's RLS check so a long answer is
   truncated here rather than silently rejected by Postgres. */
const LIMITS = {
  name: 200,
  email: 320,
  company: 200,
  phone: 60,
  message: 20_000,
  offer: 80,
} as const;

const INSERT_TIMEOUT_MS = 5_000;

/* `undefined` = not yet resolved, `null` = resolved to "not configured". */
let cached: SupabaseClient | null | undefined;

function getClient(): SupabaseClient | null {
  if (cached !== undefined) return cached;
  const url = process.env.SUPABASE_URL?.trim();
  const key = process.env.SUPABASE_ANON_KEY?.trim();
  cached =
    url && key
      ? createClient(url, key, {
          auth: { persistSession: false, autoRefreshToken: false },
        })
      : null;
  return cached;
}

/** Whether lead storage is wired up at all. Used for diagnostics/logging. */
export function leadStoreConfigured(): boolean {
  return getClient() !== null;
}

function trim(value: string | undefined, max: number): string | null {
  const v = (value ?? "").trim();
  if (!v) return null;
  return v.length > max ? v.slice(0, max) : v;
}

/**
 * Persist a lead. Resolves true when the row landed, false otherwise — the
 * caller uses that to decide whether a failed email is survivable.
 */
export async function storeLead(lead: Lead): Promise<boolean> {
  const db = getClient();
  if (!db) return false;

  const email = trim(lead.email, LIMITS.email);
  if (!email) return false;

  try {
    const { error } = await db
      .from("leads")
      .insert({
        source: lead.source,
        email,
        name: trim(lead.name, LIMITS.name),
        company: trim(lead.company, LIMITS.company),
        phone: trim(lead.phone, LIMITS.phone),
        message: trim(lead.message, LIMITS.message),
        offer: trim(lead.offer, LIMITS.offer),
        details: lead.details ?? null,
      })
      .abortSignal(AbortSignal.timeout(INSERT_TIMEOUT_MS));

    if (error) {
      console.error(`storeLead(${lead.source}): insert failed`, error.message);
      return false;
    }
    return true;
  } catch (err) {
    // Includes the abort on timeout. Logged, never rethrown.
    console.error(`storeLead(${lead.source}): insert threw`, err);
    return false;
  }
}
