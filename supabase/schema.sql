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
