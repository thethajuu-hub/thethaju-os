"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { Timeframe, RevenuePeriod, RevenueSource } from "@/types";

function requireSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase isn't configured — add your project URL and anon key to .env.local.");
  }
  return createClient();
}

export async function createTask(formData: FormData) {
  const supabase = requireSupabase();
  const title = String(formData.get("title") || "").trim();
  const timeframe = String(formData.get("timeframe") || "today") as Timeframe;
  const dueTime = String(formData.get("dueTime") || "").trim() || null;
  if (!title) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: existing } = await supabase
    .from("tasks")
    .select("sort_order")
    .eq("timeframe", timeframe)
    .order("sort_order", { ascending: false })
    .limit(1);
  const nextSortOrder = ((existing?.[0]?.sort_order as number | undefined) ?? -1) + 1;

  await supabase.from("tasks").insert({
    user_id: user.id,
    title,
    timeframe,
    due_time: dueTime,
    sort_order: nextSortOrder,
  });

  revalidatePath("/command-center");
}

export async function toggleTask(id: string, done: boolean) {
  const supabase = requireSupabase();
  await supabase
    .from("tasks")
    .update({ done, completed_at: done ? new Date().toISOString() : null })
    .eq("id", id);
  revalidatePath("/command-center");
}

export async function deleteTask(id: string) {
  const supabase = requireSupabase();
  await supabase.from("tasks").delete().eq("id", id);
  revalidatePath("/command-center");
}

export async function moveTask(timeframe: Timeframe, id: string, direction: "up" | "down") {
  const supabase = requireSupabase();

  const { data: rows } = await supabase
    .from("tasks")
    .select("id, sort_order")
    .eq("timeframe", timeframe)
    .order("sort_order", { ascending: true });

  if (!rows) return;
  const index = rows.findIndex((r) => r.id === id);
  const swapIndex = direction === "up" ? index - 1 : index + 1;
  if (index === -1 || swapIndex < 0 || swapIndex >= rows.length) return;

  const a = rows[index];
  const b = rows[swapIndex];

  await Promise.all([
    supabase.from("tasks").update({ sort_order: b.sort_order }).eq("id", a.id),
    supabase.from("tasks").update({ sort_order: a.sort_order }).eq("id", b.id),
  ]);

  revalidatePath("/command-center");
}

export async function upsertTargets(formData: FormData) {
  const supabase = requireSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const periods: RevenuePeriod[] = ["week", "month", "year"];
  const rows = periods.map((period) => ({
    user_id: user.id,
    period,
    target_amount: Number(formData.get(period) || 0),
  }));

  await supabase.from("revenue_targets").upsert(rows, { onConflict: "user_id,period" });
  revalidatePath("/command-center");
}

export async function addRevenueEntry(formData: FormData) {
  const supabase = requireSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const amount = Number(formData.get("amount") || 0);
  const source = String(formData.get("source") || "other") as RevenueSource;
  const note = String(formData.get("note") || "").trim() || null;
  if (!amount || amount <= 0) return;

  await supabase.from("revenue_entries").insert({
    user_id: user.id,
    source,
    amount,
    note,
  });

  revalidatePath("/command-center");
}
