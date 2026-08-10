-- THE THAJU FOUNDER OS — Stage 4: Life
-- Planner, Habits, Health, Relationships, Travel, Documents
--
-- Run this in Supabase Dashboard → SQL Editor → New query → paste → Run.
-- Independent of the Stage 2/3 migrations — safe to run any time after 0001.

-- ============================================================
-- PLANNER — events, appointments, reminders with a date/time
-- (distinct from Tasks on Command Center, which are simple checklists)
-- ============================================================
create table if not exists public.life_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null,
  description text,
  category text not null default 'event' check (category in ('event', 'appointment', 'reminder')),
  event_date date not null,
  event_time time,
  created_at timestamptz not null default now()
);

alter table public.life_events enable row level security;

drop policy if exists "Users manage their own life events" on public.life_events;
create policy "Users manage their own life events"
  on public.life_events for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists life_events_user_date_idx on public.life_events (user_id, event_date);

-- ============================================================
-- HABITS — the habit itself, plus one row per day it's checked off
-- ============================================================
create table if not exists public.habits (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  archived boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

alter table public.habits enable row level security;

drop policy if exists "Users manage their own habits" on public.habits;
create policy "Users manage their own habits"
  on public.habits for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create table if not exists public.habit_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  habit_id uuid not null references public.habits(id) on delete cascade,
  log_date date not null,
  created_at timestamptz not null default now(),
  unique (habit_id, log_date)
);

alter table public.habit_logs enable row level security;

drop policy if exists "Users manage their own habit logs" on public.habit_logs;
create policy "Users manage their own habit logs"
  on public.habit_logs for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists habit_logs_habit_date_idx on public.habit_logs (habit_id, log_date);

-- ============================================================
-- HEALTH — one log per day: sleep, energy, mood, water, exercise
-- ============================================================
create table if not exists public.health_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  log_date date not null default current_date,
  sleep_hours numeric(4, 1),
  energy_level integer check (energy_level between 1 and 5),
  mood integer check (mood between 1 and 5),
  water_glasses integer,
  exercise_minutes integer,
  notes text,
  created_at timestamptz not null default now(),
  unique (user_id, log_date)
);

alter table public.health_logs enable row level security;

drop policy if exists "Users manage their own health logs" on public.health_logs;
create policy "Users manage their own health logs"
  on public.health_logs for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

create index if not exists health_logs_user_date_idx on public.health_logs (user_id, log_date);

-- ============================================================
-- RELATIONSHIPS — family, friends, mentors, colleagues
-- ============================================================
create table if not exists public.relationships (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  name text not null,
  relationship_type text not null default 'friend'
    check (relationship_type in ('family', 'friend', 'mentor', 'colleague', 'other')),
  last_contact_date date,
  follow_up_date date,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.relationships enable row level security;

drop policy if exists "Users manage their own relationships" on public.relationships;
create policy "Users manage their own relationships"
  on public.relationships for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- TRAVEL — trips taken, planned, and the bucket list
-- ============================================================
create table if not exists public.trips (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  destination text not null,
  status text not null default 'bucket_list'
    check (status in ('bucket_list', 'planned', 'completed')),
  start_date date,
  end_date date,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.trips enable row level security;

drop policy if exists "Users manage their own trips" on public.trips;
create policy "Users manage their own trips"
  on public.trips for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);

-- ============================================================
-- DOCUMENTS — resume, contracts, certificates, IDs
-- ============================================================
create table if not exists public.life_documents (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null,
  category text not null default 'other'
    check (category in ('resume', 'contract', 'certificate', 'id', 'other')),
  reference_url text,
  expiry_date date,
  notes text,
  created_at timestamptz not null default now()
);

alter table public.life_documents enable row level security;

drop policy if exists "Users manage their own life documents" on public.life_documents;
create policy "Users manage their own life documents"
  on public.life_documents for all
  using (auth.uid() = user_id) with check (auth.uid() = user_id);
