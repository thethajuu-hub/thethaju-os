import type { SupabaseClient } from "@supabase/supabase-js";
import { startOfWeekISO, startOfMonthISO, startOfYearISO } from "@/lib/dates";
import type { Task, Timeframe, RevenueTargets, RevenueAchieved } from "@/types";

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
