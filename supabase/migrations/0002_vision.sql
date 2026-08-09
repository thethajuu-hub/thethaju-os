-- THE THAJU FOUNDER OS — Stage 3: Vision & Goals
--
-- Run this in Supabase Dashboard → SQL Editor → New query → paste → Run.
-- Requires 0001_command_center.sql to have been run first.

-- ============================================================
-- VISION — Life Vision, Founder Mission, Core Values, Dream Life,
-- Long-Term Vision. One row per category, free-form text.
-- ============================================================
create table if not exists public.vision_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  category text not null check (
    category in ('life_vision', 'mission', 'core_values', 'dream_life', 'long_term_vision')
  ),
  content text not null default '',
  updated_at timestamptz not null default now(),
  unique (user_id, category)
);

alter table public.vision_entries enable row level security;

create policy "Users manage their own vision entries"
  on public.vision_entries
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- ============================================================
-- GOALS — the ladder from 10-year vision down to this week.
-- "Today" already lives in tasks; "this year" is already tracked by
-- Mission Control's revenue target — goals cover the rungs between.
-- ============================================================
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  title text not null,
  timeframe text not null check (
    timeframe in ('10yr', '5yr', '3yr', '1yr', 'quarter', 'month', 'week')
  ),
  done boolean not null default false,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  completed_at timestamptz
);

alter table public.goals enable row level security;

create policy "Users manage their own goals"
  on public.goals
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

create index if not exists goals_user_timeframe_idx
  on public.goals (user_id, timeframe, sort_order);
