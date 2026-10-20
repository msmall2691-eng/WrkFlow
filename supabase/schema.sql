-- Workflow Studio — contact submissions table.
-- This mirrors the migrations applied to the live "Workflow Studio" Supabase
-- project. Kept in-repo for reference and reproducibility.

create table if not exists public.contact_submissions (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  company     text,
  message     text not null
);

-- RLS on. The public site uses the publishable (anon) key, which is granted
-- INSERT-only on well-formed rows — no SELECT/UPDATE/DELETE. Submissions can be
-- written by the form but never read with the public key. Read them in the
-- Supabase dashboard (or with the service role key).
alter table public.contact_submissions enable row level security;

create policy "anon can insert valid submissions"
  on public.contact_submissions
  for insert
  to anon
  with check (
    char_length(name) between 1 and 200
    and char_length(email) between 3 and 320
    and email like '%_@_%.__%'
    and char_length(message) between 1 and 5000
    and (company is null or char_length(company) <= 200)
  );

create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);

-- ---------------------------------------------------------------------------
-- leads — the system of record for every lead the site captures.
--
-- Supersedes contact_submissions (kept above for the rows already in it). The
-- contact form, the project questionnaire and the free-tool email capture all
-- insert here BEFORE sending any email, so an SMTP outage or a missing Gmail
-- credential can no longer lose a lead. See lib/leads.ts.
-- ---------------------------------------------------------------------------

create table if not exists public.leads (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  -- Which part of the site captured it: contact | questionnaire | tool | site-check
  source      text not null,
  name        text,
  email       text not null,
  company     text,
  phone       text,
  -- Free text for the contact form; the rendered brief for the questionnaire.
  message     text,
  -- Which CTA produced the lead, as a human label ("Care Plan", "Custom build").
  offer       text,
  -- Structured extras: questionnaire answers, tool id, concept choice.
  details     jsonb
);

-- Same posture as contact_submissions: RLS on, and the publishable (anon) key
-- the site runs on gets INSERT-only on well-formed rows. No SELECT/UPDATE/
-- DELETE, so a lead can be written by the form but never read back with the
-- public key. Read them in the Supabase dashboard or with the service role key.
alter table public.leads enable row level security;

create policy "anon can insert valid leads"
  on public.leads
  for insert
  to anon
  with check (
    source in ('contact', 'questionnaire', 'tool', 'site-check')
    and char_length(email) between 3 and 320
    and email like '%_@_%.__%'
    and (name is null or char_length(name) <= 200)
    and (company is null or char_length(company) <= 200)
    and (phone is null or char_length(phone) <= 60)
    and (message is null or char_length(message) <= 20000)
    and (offer is null or char_length(offer) <= 80)
  );

create index if not exists leads_created_at_idx
  on public.leads (created_at desc);

-- Answers "how many leads did the questionnaire bring in last month".
create index if not exists leads_source_created_at_idx
  on public.leads (source, created_at desc);
