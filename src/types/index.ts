export interface FounderProfile {
  id: string;
  fullName: string;
  email: string;
  avatarUrl?: string | null;
  role: "Founder";
}

export interface Priority {
  id: string;
  label: string;
  done: boolean;
  timeframe: "today" | "week" | "month";
}

export interface RevenueTarget {
  label: string;
  target: number;
  current: number;
  currency?: string;
}

export type ThemeMode = "light" | "dark" | "system";
