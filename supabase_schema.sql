-- Run this entire file in the Supabase SQL Editor (see DEPLOYMENT.md step 2).
-- It creates one table that stores the whole tracker as a single JSON blob,
-- which matches how the app already saves its state, plus the permissions
-- needed for the app to read and write it, and for live updates to work.

create table if not exists irc_tracker_state (
  id int primary key,
  snapshot jsonb not null,
  updated_at timestamptz not null default now()
);

-- Row Level Security must be enabled, then we add a permissive policy.
-- This app has no login system, so "anyone with the link" can read/write —
-- that matches a steering-committee tool used by trusted committee leads.
-- (See DEPLOYMENT.md "About security" for what this means in practice.)
alter table irc_tracker_state enable row level security;

drop policy if exists "Allow shared read" on irc_tracker_state;
create policy "Allow shared read"
  on irc_tracker_state for select
  using (true);

drop policy if exists "Allow shared insert" on irc_tracker_state;
create policy "Allow shared insert"
  on irc_tracker_state for insert
  with check (true);

drop policy if exists "Allow shared update" on irc_tracker_state;
create policy "Allow shared update"
  on irc_tracker_state for update
  using (true);

-- Enable realtime so changes one person makes show up live for everyone
-- else who has the app open (Supabase Dashboard -> Database -> Replication
-- also needs this table toggled on; see DEPLOYMENT.md step 3).
alter publication supabase_realtime add table irc_tracker_state;
