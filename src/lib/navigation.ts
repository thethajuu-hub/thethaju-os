import type { LucideIcon } from "lucide-react";
import {
  LayoutGrid,
  Compass,
  CalendarDays,
  Briefcase,
  Library,
  GraduationCap,
  Lightbulb,
  Wallet,
  Scale,
  BookOpen,
  Flame,
  HeartPulse,
  Users,
  Boxes,
  FileText,
  Plane,
  Sparkles,
  BarChart3,
  History,
  Settings,
} from "lucide-react";

export interface NavModule {
  /** Route segment under /(app) */
  href: string;
  label: string;
  icon: LucideIcon;
  /** One line describing what the module will hold — used by its empty state. */
  description: string;
  /** Foundation phase ships Command Center + Settings live; the rest are reserved routes. */
  status: "live" | "reserved";
  /** Groups the sidebar into sections that mirror how a founder actually thinks. */
  group: "Overview" | "Direction" | "Build" | "Capital" | "Self";
}

export const NAV_MODULES: NavModule[] = [
  {
    href: "/command-center",
    label: "Command Center",
    icon: LayoutGrid,
    description: "Today's priorities, Mission Control, and the pulse of everything you run.",
    status: "live",
    group: "Overview",
  },
  {
    href: "/vision-goals",
    label: "Vision & Goals",
    icon: Compass,
    description: "Your life vision, mission, core values, and goals from 1 to 10 years out.",
    status: "reserved",
    group: "Direction",
  },
  {
    href: "/life-planner",
    label: "Life Planner",
    icon: CalendarDays,
    description: "Daily, weekly, monthly, and yearly planning in one continuous view.",
    status: "reserved",
    group: "Direction",
  },
  {
    href: "/decision-journal",
    label: "Decision Journal",
    icon: Scale,
    description: "Every major decision — the options weighed, the reasoning, the outcome.",
    status: "reserved",
    group: "Direction",
  },
  {
    href: "/business-portfolio",
    label: "Business Portfolio",
    icon: Briefcase,
    description: "Every business you own, each with its own dashboard and a combined view.",
    status: "reserved",
    group: "Build",
  },
  {
    href: "/knowledge-base",
    label: "Knowledge Base",
    icon: Library,
    description: "Notes, research, articles, and summaries — searchable in one place.",
    status: "reserved",
    group: "Build",
  },
  {
    href: "/learning-hub",
    label: "Learning Hub",
    icon: GraduationCap,
    description: "Courses, books, certifications, and skills, tracked from start to mastery.",
    status: "reserved",
    group: "Build",
  },
  {
    href: "/idea-vault",
    label: "Idea Vault",
    icon: Lightbulb,
    description: "Capture every idea the moment it arrives — tagged, searchable, never lost.",
    status: "reserved",
    group: "Build",
  },
  {
    href: "/personal-finance",
    label: "Personal Finance",
    icon: Wallet,
    description: "Income, expenses, savings, investments, and your full financial picture.",
    status: "reserved",
    group: "Capital",
  },
  {
    href: "/assets",
    label: "Asset Manager",
    icon: Boxes,
    description: "Domains, hosting, devices, licenses, and every asset you own.",
    status: "reserved",
    group: "Capital",
  },
  {
    href: "/documents",
    label: "Personal Documents",
    icon: FileText,
    description: "Resume, contracts, certificates, and every important file in one vault.",
    status: "reserved",
    group: "Capital",
  },
  {
    href: "/journal",
    label: "Journal & Reflection",
    icon: BookOpen,
    description: "Daily journaling, weekly and monthly reviews, wins, and lessons learned.",
    status: "reserved",
    group: "Self",
  },
  {
    href: "/habits",
    label: "Habit Tracker",
    icon: Flame,
    description: "Reading, deep work, training, and every habit worth a streak.",
    status: "reserved",
    group: "Self",
  },
  {
    href: "/health",
    label: "Health Dashboard",
    icon: HeartPulse,
    description: "Sleep, energy, movement, and the metrics that keep you operating well.",
    status: "reserved",
    group: "Self",
  },
  {
    href: "/relationships",
    label: "Relationship Manager",
    icon: Users,
    description: "Family, friends, mentors, and the people worth staying close to.",
    status: "reserved",
    group: "Self",
  },
  {
    href: "/travel",
    label: "Travel & Lifestyle",
    icon: Plane,
    description: "Trips, the bucket list, and the destinations still ahead of you.",
    status: "reserved",
    group: "Self",
  },
  {
    href: "/ai-coach",
    label: "AI Founder Coach",
    icon: Sparkles,
    description: "An assistant that knows your goals, reviews your week, and helps you decide.",
    status: "reserved",
    group: "Overview",
  },
  {
    href: "/analytics",
    label: "Personal Analytics",
    icon: BarChart3,
    description: "Goal completion, learning hours, streaks, and growth — measured over time.",
    status: "reserved",
    group: "Overview",
  },
  {
    href: "/timeline",
    label: "Life Timeline",
    icon: History,
    description: "The visual history of every milestone, skill, and decision that shaped you.",
    status: "reserved",
    group: "Overview",
  },
];

export const SETTINGS_MODULE: NavModule = {
  href: "/settings",
  label: "Settings",
  icon: Settings,
  description: "Profile, appearance, notifications, and how the OS is configured.",
  status: "live",
  group: "Overview",
};

export const NAV_GROUPS: NavModule["group"][] = [
  "Overview",
  "Direction",
  "Build",
  "Capital",
  "Self",
];
