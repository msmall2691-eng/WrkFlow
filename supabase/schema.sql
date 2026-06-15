-- Workflow Studio — contact submissions table.
-- Apply in the Supabase SQL editor (or via the CLI) before wiring the
-- SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY env vars.

create table if not exists public.contact_submissions (
  id          uuid primary key default gen_random_uuid(),
  created_at  timestamptz not null default now(),
  name        text not null,
  email       text not null,
  company     text,
  message     text not null
);

-- Row Level Security on. The API route uses the service role key, which
-- bypasses RLS, so no public policies are needed. Keeping RLS enabled
-- ensures the anon/public key can never read or write this table.
alter table public.contact_submissions enable row level security;

create index if not exists contact_submissions_created_at_idx
  on public.contact_submissions (created_at desc);
