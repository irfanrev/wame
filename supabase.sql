create table if not exists public.whatsapp_attempts (
  id uuid primary key default gen_random_uuid(),
  created_at timestamptz not null default now(),
  masked_number text not null check (masked_number ~ '^628[*][*][*][0-9]{2}$'),
  source text not null check (source in ('paste', 'manual'))
);

alter table public.whatsapp_attempts enable row level security;
revoke all on public.whatsapp_attempts from public, anon, authenticated;
grant insert (masked_number, source) on public.whatsapp_attempts to anon;
drop policy if exists "Allow anonymous attempt inserts" on public.whatsapp_attempts;
create policy "Allow anonymous attempt inserts" on public.whatsapp_attempts
  for insert to anon with check (true);
