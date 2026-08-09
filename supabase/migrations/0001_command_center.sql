-- THE THAJU FOUNDER OS — Stage 2: Command Center
-- Tasks (Today / This week / This month) + Mission Control (targets + revenue)
--
-- Run this in Supabase Dashboard → SQL Editor → New query → paste → Run.
-- Safe to run once. Re-running will error on "already exists" — that's fine,
-- it means it's already applied.

-- ============================================================
-- TASKS — Today's Focus / This week / This month
-- ============================================================
create table if not exists public.tasks (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null,
  timeframe text not null check (timeframe in ('today', 'week', 'month')),
  done boolean not null default false,
  due_time time,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.tasks enable row level security;

create policy "Users manage their own tasks"
  on public.tasks
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists tasks_user_timeframe_idx
  on public.tasks (user_id, timeframe, sort_order);

-- ============================================================
-- MISSION CONTROL — targets per period
-- ============================================================
create table if not exists public.revenue_targets (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  period text not null check (period in ('week', 'month', 'year')),
  target_amount numeric(12, 2) not null default 0,
  updated_at timestamptz not null default now(),
  unique (user_id, period)
);

alter table public.revenue_targets enable row level security;

create policy "Users manage their own targets"
  on public.revenue_targets
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- MISSION CONTROL — revenue entries
-- Shared table: Agency and Dropshipping will insert here directly once
-- those modules ship (Stage 5/6), tagged by `source`. Mission Control's
-- totals never need to change — it just sums this table by period.
-- ============================================================
create table if not exists public.revenue_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  source text not null check (source in ('agency', 'dropshipping', 'other')),
  amount numeric(12, 2) not null,
  entry_date date not null default current_date,
  note text,
  created_at timestamptz not null default now()
);

alter table public.revenue_entries enable row level security;

create policy "Users manage their own revenue entries"
  on public.revenue_entries
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists revenue_entries_user_date_idx
  on public.revenue_entries (user_id, entry_date);
