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
