"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { todayISO } from "@/lib/dates";
import type {
  LifeEventCategory,
  RelationshipType,
  TripStatus,
  LifeDocumentCategory,
} from "@/types";

function requireSupabase() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Supabase isn't configured — add your project URL and anon key to .env.local.");
  }
  return createClient();
}

async function currentUserId(supabase: ReturnType<typeof createClient>) {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return user?.id ?? null;
}

function revalidateLife(path: string) {
  revalidatePath(path);
  revalidatePath("/life");
}

// ============================================================
// PLANNER
// ============================================================
export async function saveLifeEvent(formData: FormData) {
  const supabase = requireSupabase();
  const userId = await currentUserId(supabase);
  if (!userId) return;

  const id = String(formData.get("id") || "").trim() || null;
  const title = String(formData.get("title") || "").trim();
  const eventDate = String(formData.get("eventDate") || "").trim();
  if (!title || !eventDate) return;

  const description = String(formData.get("description") || "").trim() || null;
  const category = String(formData.get("category") || "event") as LifeEventCategory;
  const eventTime = String(formData.get("eventTime") || "").trim() || null;

  const payload = {
    user_id: userId,
    title,
    description,
    category,
    event_date: eventDate,
    event_time: eventTime,
  };

  if (id) {
    await supabase.from("life_events").update(payload).eq("id", id);
  } else {
    await supabase.from("life_events").insert(payload);
  }
  revalidateLife("/life/planner");
}

export async function deleteLifeEvent(id: string) {
  const supabase = requireSupabase();
  await supabase.from("life_events").delete().eq("id", id);
  revalidateLife("/life/planner");
}

// ============================================================
// HABITS
// ============================================================
export async function createHabit(formData: FormData) {
  const supabase = requireSupabase();
  const userId = await currentUserId(supabase);
  if (!userId) return;

  const name = String(formData.get("name") || "").trim();
  if (!name) return;

  const { data: existing } = await supabase
    .from("habits")
    .select("sort_order")
    .order("sort_order", { ascending: false })
    .limit(1);
  const nextSortOrder = ((existing?.[0]?.sort_order as number | undefined) ?? -1) + 1;

  await supabase.from("habits").insert({ user_id: userId, name, sort_order: nextSortOrder });
  revalidateLife("/life/habits");
}

export async function toggleHabitToday(habitId: string, done: boolean) {
  const supabase = requireSupabase();
  const userId = await currentUserId(supabase);
  if (!userId) return;

  const today = todayISO();
  if (done) {
    await supabase.from("habit_logs").upsert(
      { user_id: userId, habit_id: habitId, log_date: today },
      { onConflict: "habit_id,log_date" }
    );
  } else {
    await supabase.from("habit_logs").delete().eq("habit_id", habitId).eq("log_date", today);
  }
  revalidateLife("/life/habits");
  revalidatePath("/command-center");
}

export async function archiveHabit(id: string) {
  const supabase = requireSupabase();
  await supabase.from("habits").update({ archived: true }).eq("id", id);
  revalidateLife("/life/habits");
}

export async function deleteHabit(id: string) {
  const supabase = requireSupabase();
  await supabase.from("habits").delete().eq("id", id);
  revalidateLife("/life/habits");
}

// ============================================================
// HEALTH
// ============================================================
export async function saveHealthLog(formData: FormData) {
  const supabase = requireSupabase();
  const userId = await currentUserId(supabase);
  if (!userId) return;

  const logDate = String(formData.get("logDate") || "").trim() || todayISO();
  const numOrNull = (key: string) => {
    const raw = String(formData.get(key) || "").trim();
    return raw === "" ? null : Number(raw);
  };

  const payload = {
    user_id: userId,
    log_date: logDate,
    sleep_hours: numOrNull("sleepHours"),
    energy_level: numOrNull("energyLevel"),
    mood: numOrNull("mood"),
    water_glasses: numOrNull("waterGlasses"),
    exercise_minutes: numOrNull("exerciseMinutes"),
    notes: String(formData.get("notes") || "").trim() || null,
  };

  await supabase.from("health_logs").upsert(payload, { onConflict: "user_id,log_date" });
  revalidateLife("/life/health");
}

export async function deleteHealthLog(id: string) {
  const supabase = requireSupabase();
  await supabase.from("health_logs").delete().eq("id", id);
  revalidateLife("/life/health");
}

// ============================================================
// RELATIONSHIPS
// ============================================================
export async function saveRelationship(formData: FormData) {
  const supabase = requireSupabase();
  const userId = await currentUserId(supabase);
  if (!userId) return;

  const id = String(formData.get("id") || "").trim() || null;
  const name = String(formData.get("name") || "").trim();
  if (!name) return;

  const payload = {
    user_id: userId,
    name,
    relationship_type: String(formData.get("relationshipType") || "friend") as RelationshipType,
    last_contact_date: String(formData.get("lastContactDate") || "").trim() || null,
    follow_up_date: String(formData.get("followUpDate") || "").trim() || null,
    notes: String(formData.get("notes") || "").trim() || null,
  };

  if (id) {
    await supabase.from("relationships").update(payload).eq("id", id);
  } else {
    await supabase.from("relationships").insert(payload);
  }
  revalidateLife("/life/relationships");
}

export async function deleteRelationship(id: string) {
  const supabase = requireSupabase();
  await supabase.from("relationships").delete().eq("id", id);
  revalidateLife("/life/relationships");
}

// ============================================================
// TRAVEL
// ============================================================
export async function saveTrip(formData: FormData) {
  const supabase = requireSupabase();
  const userId = await currentUserId(supabase);
  if (!userId) return;

  const id = String(formData.get("id") || "").trim() || null;
  const destination = String(formData.get("destination") || "").trim();
  if (!destination) return;

  const payload = {
    user_id: userId,
    destination,
    status: String(formData.get("status") || "bucket_list") as TripStatus,
    start_date: String(formData.get("startDate") || "").trim() || null,
    end_date: String(formData.get("endDate") || "").trim() || null,
    notes: String(formData.get("notes") || "").trim() || null,
  };

  if (id) {
    await supabase.from("trips").update(payload).eq("id", id);
  } else {
    await supabase.from("trips").insert(payload);
  }
  revalidateLife("/life/travel");
}

export async function deleteTrip(id: string) {
  const supabase = requireSupabase();
  await supabase.from("trips").delete().eq("id", id);
  revalidateLife("/life/travel");
}

// ============================================================
// DOCUMENTS
// ============================================================
export async function saveLifeDocument(formData: FormData) {
  const supabase = requireSupabase();
  const userId = await currentUserId(supabase);
  if (!userId) return;

  const id = String(formData.get("id") || "").trim() || null;
  const title = String(formData.get("title") || "").trim();
  if (!title) return;

  const payload = {
    user_id: userId,
    title,
    category: String(formData.get("category") || "other") as LifeDocumentCategory,
    reference_url: String(formData.get("referenceUrl") || "").trim() || null,
    expiry_date: String(formData.get("expiryDate") || "").trim() || null,
    notes: String(formData.get("notes") || "").trim() || null,
  };

  if (id) {
    await supabase.from("life_documents").update(payload).eq("id", id);
  } else {
    await supabase.from("life_documents").insert(payload);
  }
  revalidateLife("/life/documents");
}

export async function deleteLifeDocument(id: string) {
  const supabase = requireSupabase();
  await supabase.from("life_documents").delete().eq("id", id);
  revalidateLife("/life/documents");
}
