"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import type { GoalTimeframe, GoalPriority, GoalStatus, VisionCategory } from "@/types";

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

/**
 * Create or update a goal — a single form powers both the "Add goal" and
 * "Edit goal" dialogs. Presence of a non-empty `id` field decides which.
 */
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
  const priority = String(formData.get("priority") || "medium") as GoalPriority;
  const status = String(formData.get("status") || "not_started") as GoalStatus;
  const progressRaw = Number(formData.get("progress") || 0);
  const progress = Math.min(100, Math.max(0, Number.isFinite(progressRaw) ? progressRaw : 0));
  const parentIdRaw = String(formData.get("parentId") || "").trim();
  // A goal can't be its own parent.
  const parentId = parentIdRaw && parentIdRaw !== id ? parentIdRaw : null;

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
  revalidatePath("/command-center");
}

export async function deleteGoal(id: string) {
  const supabase = requireSupabase();
  await supabase.from("goals").delete().eq("id", id);
  revalidatePath("/vision");
  revalidatePath("/command-center");
}
