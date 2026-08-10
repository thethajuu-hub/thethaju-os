import type { SupabaseClient } from "@supabase/supabase-js";
import { startOfWeekISO, startOfMonthISO, startOfYearISO } from "@/lib/dates";
import type {
  Task,
  Timeframe,
  RevenueTargets,
  RevenueAchieved,
  VisionCategory,
  VisionEntry,
  GoalTimeframe,
  Goal,
} from "@/types";

interface TaskRow {
  id: string;
  title: string;
  timeframe: Timeframe;
  done: boolean;
  due_time: string | null;
  sort_order: number;
  created_at: string;
}

function mapTask(row: TaskRow): Task {
  return {
    id: row.id,
    title: row.title,
    timeframe: row.timeframe,
    done: row.done,
    dueTime: row.due_time,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
  };
}

export async function getTasksByTimeframe(
  supabase: SupabaseClient,
  timeframe: Timeframe
): Promise<Task[]> {
  const { data, error } = await supabase
    .from("tasks")
    .select("id, title, timeframe, done, due_time, sort_order, created_at")
    .eq("timeframe", timeframe)
    .order("done", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getTasksByTimeframe failed:", error.message);
    return [];
  }
  return (data ?? []).map(mapTask);
}

export async function getAllTasks(supabase: SupabaseClient): Promise<Record<Timeframe, Task[]>> {
  const { data, error } = await supabase
    .from("tasks")
    .select("id, title, timeframe, done, due_time, sort_order, created_at")
    .order("done", { ascending: true })
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const empty: Record<Timeframe, Task[]> = { today: [], week: [], month: [] };
  if (error) {
    console.error("getAllTasks failed:", error.message);
    return empty;
  }
  for (const row of (data ?? []) as TaskRow[]) {
    empty[row.timeframe].push(mapTask(row));
  }
  return empty;
}

export async function getRevenueTargets(supabase: SupabaseClient): Promise<RevenueTargets> {
  const { data, error } = await supabase
    .from("revenue_targets")
    .select("period, target_amount");

  const targets: RevenueTargets = { week: 0, month: 0, year: 0 };
  if (error) {
    console.error("getRevenueTargets failed:", error.message);
    return targets;
  }
  for (const row of data ?? []) {
    targets[row.period as keyof RevenueTargets] = Number(row.target_amount);
  }
  return targets;
}

export async function getRevenueAchieved(supabase: SupabaseClient): Promise<RevenueAchieved> {
  const now = new Date();
  const [weekRes, monthRes, yearRes] = await Promise.all([
    supabase.from("revenue_entries").select("amount").gte("entry_date", startOfWeekISO(now)),
    supabase.from("revenue_entries").select("amount").gte("entry_date", startOfMonthISO(now)),
    supabase.from("revenue_entries").select("amount").gte("entry_date", startOfYearISO(now)),
  ]);

  const sum = (rows: { amount: number }[] | null) =>
    (rows ?? []).reduce((total, r) => total + Number(r.amount), 0);

  if (weekRes.error) console.error("revenue week query failed:", weekRes.error.message);
  if (monthRes.error) console.error("revenue month query failed:", monthRes.error.message);
  if (yearRes.error) console.error("revenue year query failed:", yearRes.error.message);

  return {
    week: sum(weekRes.data),
    month: sum(monthRes.data),
    year: sum(yearRes.data),
  };
}

export interface RevenueBySource {
  agency: number;
  dropshipping: number;
  other: number;
}

/** This month's revenue, split by source — ready for Agency/Dropshipping to feed once they ship. */
export async function getRevenueBySourceThisMonth(supabase: SupabaseClient): Promise<RevenueBySource> {
  const { data, error } = await supabase
    .from("revenue_entries")
    .select("source, amount")
    .gte("entry_date", startOfMonthISO());

  const totals: RevenueBySource = { agency: 0, dropshipping: 0, other: 0 };
  if (error) {
    console.error("getRevenueBySourceThisMonth failed:", error.message);
    return totals;
  }
  for (const row of data ?? []) {
    const key = row.source as keyof RevenueBySource;
    if (key in totals) totals[key] += Number(row.amount);
  }
  return totals;
}

// ============================================================
// VISION & GOALS — Stage 3
// ============================================================

const VISION_CATEGORIES: VisionCategory[] = [
  "life_vision",
  "mission",
  "core_values",
  "dreams_future_vision",
];

export async function getVisionEntries(
  supabase: SupabaseClient
): Promise<Record<VisionCategory, VisionEntry>> {
  const { data, error } = await supabase
    .from("vision_entries")
    .select("category, content, updated_at");

  const result = VISION_CATEGORIES.reduce((acc, category) => {
    acc[category] = { category, content: "", updatedAt: null };
    return acc;
  }, {} as Record<VisionCategory, VisionEntry>);

  if (error) {
    console.error("getVisionEntries failed:", error.message);
    return result;
  }
  for (const row of data ?? []) {
    const category = row.category as VisionCategory;
    result[category] = { category, content: row.content, updatedAt: row.updated_at };
  }
  return result;
}

interface GoalRow {
  id: string;
  parent_id: string | null;
  title: string;
  description: string | null;
  timeframe: GoalTimeframe;
  deadline: string | null;
  priority: Goal["priority"];
  status: Goal["status"];
  progress: number;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

function mapGoal(row: GoalRow): Goal {
  return {
    id: row.id,
    parentId: row.parent_id,
    title: row.title,
    description: row.description,
    timeframe: row.timeframe,
    deadline: row.deadline,
    priority: row.priority,
    status: row.status,
    progress: row.progress,
    sortOrder: row.sort_order,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

const GOAL_TIMEFRAMES: GoalTimeframe[] = [
  "10yr",
  "5yr",
  "3yr",
  "1yr",
  "yearly",
  "quarterly",
  "monthly",
  "weekly",
];

export async function getAllGoals(supabase: SupabaseClient): Promise<Record<GoalTimeframe, Goal[]>> {
  const { data, error } = await supabase
    .from("goals")
    .select(
      "id, parent_id, title, description, timeframe, deadline, priority, status, progress, sort_order, created_at, updated_at"
    )
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  const empty = GOAL_TIMEFRAMES.reduce((acc, t) => {
    acc[t] = [];
    return acc;
  }, {} as Record<GoalTimeframe, Goal[]>);
  if (error) {
    console.error("getAllGoals failed:", error.message);
    return empty;
  }
  for (const row of (data ?? []) as GoalRow[]) {
    empty[row.timeframe].push(mapGoal(row));
  }
  return empty;
}
