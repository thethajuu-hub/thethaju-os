import type { GoalTimeframe, GoalPriority, GoalStatus } from "@/types";

export const TIMEFRAME_LABELS: Record<GoalTimeframe, string> = {
  "10yr": "10-Year",
  "5yr": "5-Year",
  "3yr": "3-Year",
  "1yr": "1-Year",
  yearly: "Yearly",
  quarterly: "Quarterly",
  monthly: "Monthly",
  weekly: "Weekly",
};

export const TIMEFRAME_ORDER: GoalTimeframe[] = [
  "10yr",
  "5yr",
  "3yr",
  "1yr",
  "yearly",
  "quarterly",
  "monthly",
  "weekly",
];

export const PRIORITY_LABELS: Record<GoalPriority, string> = {
  low: "Low",
  medium: "Medium",
  high: "High",
};

export const STATUS_LABELS: Record<GoalStatus, string> = {
  not_started: "Not started",
  in_progress: "In progress",
  completed: "Completed",
  on_hold: "On hold",
};

export const STATUS_BADGE_VARIANT: Record<GoalStatus, "outline" | "accent" | "success" | "warning"> = {
  not_started: "outline",
  in_progress: "accent",
  completed: "success",
  on_hold: "warning",
};
