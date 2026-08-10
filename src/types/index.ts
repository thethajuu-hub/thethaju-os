export interface FounderProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  role: "Founder";
}

export type Timeframe = "today" | "week" | "month";

/** Mirrors public.tasks — see supabase/migrations/0001_command_center.sql */
export interface Task {
  id: string;
  title: string;
  timeframe: Timeframe;
  done: boolean;
  dueTime: string | null;
  sortOrder: number;
  createdAt: string;
}

export type RevenuePeriod = "week" | "month" | "year";
export type RevenueSource = "agency" | "dropshipping" | "other";

/** Mirrors public.revenue_targets */
export interface RevenueTargets {
  week: number;
  month: number;
  year: number;
}

/** Sum of public.revenue_entries within each period, computed server-side. */
export interface RevenueAchieved {
  week: number;
  month: number;
  year: number;
}

export interface RevenueEntry {
  id: string;
  source: RevenueSource;
  amount: number;
  entryDate: string;
  note: string | null;
  createdAt: string;
}

export type ThemeMode = "light" | "dark" | "system";

export type VisionCategory = "life_vision" | "mission" | "core_values" | "dreams_future_vision";

export interface VisionEntry {
  category: VisionCategory;
  content: string;
  updatedAt: string | null;
}

export type GoalTimeframe =
  | "10yr"
  | "5yr"
  | "3yr"
  | "1yr"
  | "yearly"
  | "quarterly"
  | "monthly"
  | "weekly";

export type GoalPriority = "low" | "medium" | "high";
export type GoalStatus = "not_started" | "in_progress" | "completed" | "on_hold";

export interface Goal {
  id: string;
  parentId: string | null;
  title: string;
  description: string | null;
  timeframe: GoalTimeframe;
  deadline: string | null;
  priority: GoalPriority;
  status: GoalStatus;
  progress: number;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

// ============================================================
// LIFE — Stage 4
// ============================================================

export type LifeEventCategory = "event" | "appointment" | "reminder";

export interface LifeEvent {
  id: string;
  title: string;
  description: string | null;
  category: LifeEventCategory;
  eventDate: string;
  eventTime: string | null;
  createdAt: string;
}

export interface Habit {
  id: string;
  name: string;
  archived: boolean;
  sortOrder: number;
  createdAt: string;
  /** Computed server-side, not a DB column. */
  currentStreak: number;
  /** Whether today already has a log entry. */
  doneToday: boolean;
}

export interface HealthLog {
  id: string;
  logDate: string;
  sleepHours: number | null;
  energyLevel: number | null;
  mood: number | null;
  waterGlasses: number | null;
  exerciseMinutes: number | null;
  notes: string | null;
  createdAt: string;
}

export type RelationshipType = "family" | "friend" | "mentor" | "colleague" | "other";

export interface Relationship {
  id: string;
  name: string;
  relationshipType: RelationshipType;
  lastContactDate: string | null;
  followUpDate: string | null;
  notes: string | null;
  createdAt: string;
}

export type TripStatus = "bucket_list" | "planned" | "completed";

export interface Trip {
  id: string;
  destination: string;
  status: TripStatus;
  startDate: string | null;
  endDate: string | null;
  notes: string | null;
  createdAt: string;
}

export type LifeDocumentCategory = "resume" | "contract" | "certificate" | "id" | "other";

export interface LifeDocument {
  id: string;
  title: string;
  category: LifeDocumentCategory;
  referenceUrl: string | null;
  expiryDate: string | null;
  notes: string | null;
  createdAt: string;
}
