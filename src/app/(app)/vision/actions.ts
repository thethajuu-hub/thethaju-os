"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { GoalTimeframe, VisionCategory } from "@/types";

function requireSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase isn't configured — add your project URL and anon key to .env.local.");
  }
  return createClient();
}

export async function saveVisionEntry(category: VisionCategory, content: string) {
  const supabase = requireSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  await supabase
    .from("vision_entries")
    .upsert(
      { user_id: user.id, category, content, updated_at: new Date().toISOString() },
      { onConflict: "user_id,category" }
    );

  revalidatePath("/vision");
}

export async function createGoal(formData: FormData) {
  const supabase = requireSupabase();
  const title = String(formData.get("title") || "").trim();
  const timeframe = String(formData.get("timeframe") || "") as GoalTimeframe;
  if (!title || !timeframe) return;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const { data: existing } = await supabase
    .from("goals")
    .select("sort_order")
    .eq("timeframe", timeframe)
    .order("sort_order", { ascending: false })
    .limit(1);
  const nextSortOrder = ((existing?.[0]?.sort_order as number | undefined) ?? -1) + 1;

  await supabase.from("goals").insert({
    user_id: user.id,
    title,
    timeframe,
    sort_order: nextSortOrder,
    priority: "medium",
    status: "not_started",
    progress: 0,
  });

  revalidatePath("/vision");
}

export async function saveGoal(formData: FormData) {
  const supabase = requireSupabase();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return;

  const id = String(formData.get("id") || "").trim() || null;
  const title = String(formData.get("title") || "").trim();
  const timeframe = String(formData.get("timeframe") || "") as GoalTimeframe;
  if (!title || !timeframe) return;

  const description = String(formData.get("description") || "").trim() || null;
  const deadline = String(formData.get("deadline") || "").trim() || null;
  const priority = String(formData.get("priority") || "medium");
  const status = String(formData.get("status") || "not_started");
  const progress = Number(formData.get("progress") ?? 0);
  const parentId = String(formData.get("parentId") || "").trim() || null;

  if (id) {
    await supabase
      .from("goals")
      .update({
        title,
        description,
        timeframe,
        deadline,
        priority,
        status,
        progress,
        parent_id: parentId,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id);
  } else {
    const { data: existing } = await supabase
      .from("goals")
      .select("sort_order")
      .eq("timeframe", timeframe)
      .order("sort_order", { ascending: false })
      .limit(1);
    const nextSortOrder = ((existing?.[0]?.sort_order as number | undefined) ?? -1) + 1;

    await supabase.from("goals").insert({
      user_id: user.id,
      title,
      description,
      timeframe,
      deadline,
      priority,
      status,
      progress,
      parent_id: parentId,
      sort_order: nextSortOrder,
    });
  }

  revalidatePath("/vision");
}

export async function updateGoalStatus(id: string, status: "not_started" | "in_progress" | "completed" | "on_hold") {
  const supabase = requireSupabase();
  await supabase
    .from("goals")
    .update({ status, progress: status === "completed" ? 100 : undefined, updated_at: new Date().toISOString() })
    .eq("id", id);
  revalidatePath("/vision");
}

export async function deleteGoal(id: string) {
  const supabase = requireSupabase();
  await supabase.from("goals").delete().eq("id", id);
  revalidatePath("/vision");
}

export async function moveGoal(timeframe: GoalTimeframe, id: string, direction: "up" | "down") {
  const supabase = requireSupabase();

  const { data: rows } = await supabase
    .from("goals")
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
    supabase.from("goals").update({ sort_order: b.sort_order }).eq("id", a.id),
    supabase.from("goals").update({ sort_order: a.sort_order }).eq("id", b.id),
  ]);

  revalidatePath("/vision");
}
