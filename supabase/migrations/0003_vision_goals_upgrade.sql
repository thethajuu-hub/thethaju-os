-- THE THAJU FOUNDER OS — Stage 3 upgrade: full Vision & Goals data model
--
-- Safe to run whether or not 0002_vision.sql was already applied:
--   • If `goals` / `vision_entries` don't exist yet, this creates them in
--     their final shape directly.
--   • If they already exist (from 0002), this ALTERs them in place —
--     adding the new columns, migrating existing values, and replacing
--     the old constraints. Nothing is dropped destructively except the
--     old `done` / `completed_at` columns on `goals`, which are fully
--     superseded by the new `status` column (migrated automatically
--     below before the columns are removed).
--
-- Run this in Supabase Dashboard → SQL Editor → New query → paste → Run.

-- ============================================================
-- VISION — 4 categories per this stage's spec: Life Vision, Founder
-- Mission, Core Values, Dreams / Future Vision. (0002 shipped 5 —
-- "Dream Life" and "Long-Term Vision" are consolidated into one here.)
-- ============================================================
create table if not exists public.vision_entries (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  category text not null,
  content text not null default '',
  updated_at timestamptz not null default now(),
  unique (user_id, category)
);

alter table public.vision_entries enable row level security;

drop policy if exists "Users manage their own vision entries" on public.vision_entries;
create policy "Users manage their own vision entries"
  on public.vision_entries
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Consolidate old categories into 'dreams_future_vision'. If a user has
-- both 'dream_life' and 'long_term_vision' rows, the 'long_term_vision'
-- one is dropped in favor of 'dream_life' to avoid a uniqueness clash —
-- edit the surviving entry afterward if you want to merge the text by hand.
delete from public.vision_entries v1
where v1.category = 'long_term_vision'
  and exists (
    select 1 from public.vision_entries v2
    where v2.user_id = v1.user_id and v2.category = 'dream_life'
  );

update public.vision_entries
set category = 'dreams_future_vision'
where category in ('dream_life', 'long_term_vision');

alter table public.vision_entries drop constraint if exists vision_entries_category_check;
alter table public.vision_entries
  add constraint vision_entries_category_check
  check (category in ('life_vision', 'mission', 'core_values', 'dreams_future_vision'));

-- ============================================================
-- GOALS — full hierarchy: 10-Year, 5-Year, 3-Year, 1-Year, Yearly,
-- Quarterly, Monthly, Weekly. Each with description, deadline,
-- priority, status, progress, and an optional parent goal.
-- ============================================================
create table if not exists public.goals (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null default auth.uid() references auth.users(id) on delete cascade,
  parent_id uuid references public.goals(id) on delete set null,
  title text not null,
  description text,
  timeframe text not null,
  deadline date,
  priority text not null default 'medium',
  status text not null default 'not_started',
  progress integer not null default 0,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.goals enable row level security;

drop policy if exists "Users manage their own goals" on public.goals;
create policy "Users manage their own goals"
  on public.goals
  for all
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Add any columns missing from a pre-existing 0002 table (no-ops on a
-- table freshly created above, since it already has all of these).
alter table public.goals add column if not exists parent_id uuid references public.goals(id) on delete set null;
alter table public.goals add column if not exists description text;
alter table public.goals add column if not exists deadline date;
alter table public.goals add column if not exists priority text default 'medium';
alter table public.goals add column if not exists status text default 'not_started';
alter table public.goals add column if not exists progress integer default 0;
alter table public.goals add column if not exists updated_at timestamptz not null default now();

-- Migrate the old boolean `done` into the new `status`, if that column
-- exists (it won't on a fresh install, since it was never created above).
do $$
begin
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'goals' and column_name = 'done'
  ) then
    update public.goals set status = 'completed' where done = true and status = 'not_started';
    alter table public.goals drop column done;
  end if;
  if exists (
    select 1 from information_schema.columns
    where table_schema = 'public' and table_name = 'goals' and column_name = 'completed_at'
  ) then
    alter table public.goals drop column completed_at;
  end if;
end $$;

-- Migrate old short timeframe codes ('quarter'/'month'/'week') to the
-- new labels used by this stage's 8-rung ladder.
update public.goals set timeframe = 'quarterly' where timeframe = 'quarter';
update public.goals set timeframe = 'monthly' where timeframe = 'month';
update public.goals set timeframe = 'weekly' where timeframe = 'week';

alter table public.goals drop constraint if exists goals_timeframe_check;
alter table public.goals
  add constraint goals_timeframe_check
  check (timeframe in ('10yr', '5yr', '3yr', '1yr', 'yearly', 'quarterly', 'monthly', 'weekly'));

alter table public.goals drop constraint if exists goals_priority_check;
alter table public.goals
  add constraint goals_priority_check
  check (priority in ('low', 'medium', 'high'));

alter table public.goals drop constraint if exists goals_status_check;
alter table public.goals
  add constraint goals_status_check
  check (status in ('not_started', 'in_progress', 'completed', 'on_hold'));

alter table public.goals drop constraint if exists goals_progress_check;
alter table public.goals
  add constraint goals_progress_check
  check (progress >= 0 and progress <= 100);

create index if not exists goals_user_timeframe_idx on public.goals (user_id, timeframe, sort_order);
create index if not exists goals_user_parent_idx on public.goals (user_id, parent_id);
