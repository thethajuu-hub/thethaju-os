import type { SupabaseClient } from "@supabase/supabase-js";
import { todayISO } from "@/lib/dates";
import type {
  LifeEvent,
  Habit,
  HealthLog,
  Relationship,
  Trip,
  LifeDocument,
} from "@/types";

// ============================================================
// PLANNER
// ============================================================
interface LifeEventRow {
  id: string;
  title: string;
  description: string | null;
  category: LifeEvent["category"];
  event_date: string;
  event_time: string | null;
  created_at: string;
}

function mapLifeEvent(row: LifeEventRow): LifeEvent {
  return {
    id: row.id,
    title: row.title,
    description: row.description,
    category: row.category,
    eventDate: row.event_date,
    eventTime: row.event_time,
    createdAt: row.created_at,
  };
}

export async function getLifeEvents(supabase: SupabaseClient): Promise<LifeEvent[]> {
  const { data, error } = await supabase
    .from("life_events")
    .select("id, title, description, category, event_date, event_time, created_at")
    .order("event_date", { ascending: true })
    .order("event_time", { ascending: true, nullsFirst: false });

  if (error) {
    console.error("getLifeEvents failed:", error.message);
    return [];
  }
  return (data ?? []).map(mapLifeEvent);
}

// ============================================================
// HABITS — with server-computed current streak
// ============================================================
export async function getHabitsWithStreaks(supabase: SupabaseClient): Promise<Habit[]> {
  const { data: habits, error } = await supabase
    .from("habits")
    .select("id, name, archived, sort_order, created_at")
    .eq("archived", false)
    .order("sort_order", { ascending: true })
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getHabitsWithStreaks failed:", error.message);
    return [];
  }
  if (!habits || habits.length === 0) return [];

  const { data: logs, error: logsError } = await supabase
    .from("habit_logs")
    .select("habit_id, log_date")
    .in(
      "habit_id",
      habits.map((h) => h.id)
    )
    .order("log_date", { ascending: false });

  if (logsError) {
    console.error("habit_logs query failed:", logsError.message);
  }

  const logsByHabit = new Map<string, Set<string>>();
  for (const row of logs ?? []) {
    if (!logsByHabit.has(row.habit_id)) logsByHabit.set(row.habit_id, new Set());
    logsByHabit.get(row.habit_id)!.add(row.log_date);
  }

  const today = todayISO();

  return habits.map((h) => {
    const dates = logsByHabit.get(h.id) ?? new Set<string>();
    const doneToday = dates.has(today);
    const streak = computeStreak(dates);
    return {
      id: h.id,
      name: h.name,
      archived: h.archived,
      sortOrder: h.sort_order,
      createdAt: h.created_at,
      currentStreak: streak,
      doneToday,
    };
  });
}

function computeStreak(dates: Set<string>): number {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // If today isn't logged yet, the streak still "counts" through
  // yesterday — you haven't broken it until the day ends unlogged.
  let cursor = new Date(today);
  if (!dates.has(toISO(cursor))) {
    cursor.setDate(cursor.getDate() - 1);
  }

  let streak = 0;
  while (dates.has(toISO(cursor))) {
    streak += 1;
    cursor.setDate(cursor.getDate() - 1);
  }
  return streak;
}

function toISO(d: Date): string {
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

// ============================================================
// HEALTH
// ============================================================
interface HealthLogRow {
  id: string;
  log_date: string;
  sleep_hours: number | null;
  energy_level: number | null;
  mood: number | null;
  water_glasses: number | null;
  exercise_minutes: number | null;
  notes: string | null;
  created_at: string;
}

function mapHealthLog(row: HealthLogRow): HealthLog {
  return {
    id: row.id,
    logDate: row.log_date,
    sleepHours: row.sleep_hours,
    energyLevel: row.energy_level,
    mood: row.mood,
    waterGlasses: row.water_glasses,
    exerciseMinutes: row.exercise_minutes,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

export async function getHealthLogs(supabase: SupabaseClient, limit = 30): Promise<HealthLog[]> {
  const { data, error } = await supabase
    .from("health_logs")
    .select("id, log_date, sleep_hours, energy_level, mood, water_glasses, exercise_minutes, notes, created_at")
    .order("log_date", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("getHealthLogs failed:", error.message);
    return [];
  }
  return (data ?? []).map(mapHealthLog);
}

// ============================================================
// RELATIONSHIPS
// ============================================================
interface RelationshipRow {
  id: string;
  name: string;
  relationship_type: Relationship["relationshipType"];
  last_contact_date: string | null;
  follow_up_date: string | null;
  notes: string | null;
  created_at: string;
}

function mapRelationship(row: RelationshipRow): Relationship {
  return {
    id: row.id,
    name: row.name,
    relationshipType: row.relationship_type,
    lastContactDate: row.last_contact_date,
    followUpDate: row.follow_up_date,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

export async function getRelationships(supabase: SupabaseClient): Promise<Relationship[]> {
  const { data, error } = await supabase
    .from("relationships")
    .select("id, name, relationship_type, last_contact_date, follow_up_date, notes, created_at")
    .order("name", { ascending: true });

  if (error) {
    console.error("getRelationships failed:", error.message);
    return [];
  }
  return (data ?? []).map(mapRelationship);
}

// ============================================================
// TRAVEL
// ============================================================
interface TripRow {
  id: string;
  destination: string;
  status: Trip["status"];
  start_date: string | null;
  end_date: string | null;
  notes: string | null;
  created_at: string;
}

function mapTrip(row: TripRow): Trip {
  return {
    id: row.id,
    destination: row.destination,
    status: row.status,
    startDate: row.start_date,
    endDate: row.end_date,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

export async function getTrips(supabase: SupabaseClient): Promise<Trip[]> {
  const { data, error } = await supabase
    .from("trips")
    .select("id, destination, status, start_date, end_date, notes, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getTrips failed:", error.message);
    return [];
  }
  return (data ?? []).map(mapTrip);
}

// ============================================================
// DOCUMENTS
// ============================================================
interface LifeDocumentRow {
  id: string;
  title: string;
  category: LifeDocument["category"];
  reference_url: string | null;
  expiry_date: string | null;
  notes: string | null;
  created_at: string;
}

function mapLifeDocument(row: LifeDocumentRow): LifeDocument {
  return {
    id: row.id,
    title: row.title,
    category: row.category,
    referenceUrl: row.reference_url,
    expiryDate: row.expiry_date,
    notes: row.notes,
    createdAt: row.created_at,
  };
}

export async function getLifeDocuments(supabase: SupabaseClient): Promise<LifeDocument[]> {
  const { data, error } = await supabase
    .from("life_documents")
    .select("id, title, category, reference_url, expiry_date, notes, created_at")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("getLifeDocuments failed:", error.message);
    return [];
  }
  return (data ?? []).map(mapLifeDocument);
}
