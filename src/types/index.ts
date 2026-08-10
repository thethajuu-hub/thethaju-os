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

/** Mirrors public.goals — see supabase/migrations/0003_vision_goals_upgrade.sql */
export type GoalTimeframe = "10yr" | "5yr" | "3yr" | "1yr" | "yearly" | "quarterly" | "monthly" | "weekly";
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
