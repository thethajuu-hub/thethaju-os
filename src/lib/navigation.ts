import type { LucideIcon } from "lucide-react";
import {
  LayoutGrid,
  Compass,
  Home,
  CalendarDays,
  Flame,
  HeartPulse,
  Users,
  Plane,
  FileText,
  Briefcase,
  Building2,
  Package,
  Rocket,
  Wallet,
  Landmark,
  Boxes,
  TrendingUp,
  GraduationCap,
  Library,
  BarChart3,
  Lightbulb,
  BookOpen,
  NotebookPen,
  Scale,
  History,
  Sparkles,
  Settings,
} from "lucide-react";

export interface NavItem {
  /** Route segment under /(app) */
  href: string;
  label: string;
  icon: LucideIcon;
  /** One line describing what the module will hold — used by its empty/hub state. */
  description: string;
  /** Foundation phase ships Command Center + Settings live; the rest are reserved routes. */
  status: "live" | "reserved";
  /** Second-level items, shown via progressive disclosure when the parent is expanded. */
  children?: NavItem[];
}

export type NavGroupName =
  | "Overview"
  | "Direction"
  | "Business"
  | "Capital"
  | "Growth"
  | "Journal"
  | "AI";

export interface NavGroup {
  name: NavGroupName;
  items: NavItem[];
}

export const NAV_TREE: NavGroup[] = [
  {
    name: "Overview",
    items: [
      {
        href: "/command-center",
        label: "Command Center",
        icon: LayoutGrid,
        description: "Today's priorities, Mission Control, and the pulse of everything you run.",
        status: "live",
      },
    ],
  },
  {
    name: "Direction",
    items: [
      {
        href: "/vision",
        label: "Vision",
        icon: Compass,
        description: "Your life vision, mission, core values, and goals from 1 to 10 years out.",
        status: "reserved",
      },
      {
        href: "/life",
        label: "Life",
        icon: Home,
        description: "Planning, habits, health, relationships, travel, and documents — one home for daily life.",
        status: "reserved",
        children: [
          {
            href: "/life/planner",
            label: "Planner",
            icon: CalendarDays,
            description: "Daily, weekly, monthly, and yearly planning in one continuous view.",
            status: "reserved",
          },
          {
            href: "/life/habits",
            label: "Habits",
            icon: Flame,
            description: "Reading, deep work, training, and every habit worth a streak.",
            status: "reserved",
          },
          {
            href: "/life/health",
            label: "Health",
            icon: HeartPulse,
            description: "Sleep, energy, movement, and the metrics that keep you operating well.",
            status: "reserved",
          },
          {
            href: "/life/relationships",
            label: "Relationships",
            icon: Users,
            description: "Family, friends, mentors, and the people worth staying close to.",
            status: "reserved",
          },
          {
            href: "/life/travel",
            label: "Travel",
            icon: Plane,
            description: "Trips, the bucket list, and the destinations still ahead of you.",
            status: "reserved",
          },
          {
            href: "/life/documents",
            label: "Documents",
            icon: FileText,
            description: "Resume, contracts, certificates, and every important file in one vault.",
            status: "reserved",
          },
        ],
      },
    ],
  },
  {
    name: "Business",
    items: [
      {
        href: "/business",
        label: "Business",
        icon: Briefcase,
        description: "Every business you own, each with its own dashboard and a combined view.",
        status: "reserved",
        children: [
          {
            href: "/business/agency",
            label: "Agency",
            icon: Building2,
            description: "Revenue, clients, projects, expenses, and growth for the agency.",
            status: "reserved",
          },
          {
            href: "/business/dropshipping",
            label: "Dropshipping",
            icon: Package,
            description: "Sales, products, marketing, inventory, analytics, and learning in one hub.",
            status: "reserved",
          },
          {
            href: "/business/future",
            label: "Future Businesses",
            icon: Rocket,
            description: "Reserved for whatever you build next — SaaS, digital products, and beyond.",
            status: "reserved",
          },
        ],
      },
    ],
  },
  {
    name: "Capital",
    items: [
      {
        href: "/money",
        label: "Money",
        icon: Wallet,
        description: "Income, expenses, savings, investments, and every asset you own.",
        status: "reserved",
        children: [
          {
            href: "/money/finance",
            label: "Finance",
            icon: Landmark,
            description: "Income, expenses, savings, investments, and your full financial picture.",
            status: "reserved",
          },
          {
            href: "/money/assets",
            label: "Assets",
            icon: Boxes,
            description: "Domains, hosting, devices, licenses, and every asset you own.",
            status: "reserved",
          },
        ],
      },
    ],
  },
  {
    name: "Growth",
    items: [
      {
        href: "/growth",
        label: "Growth",
        icon: TrendingUp,
        description: "Learning, knowledge, and the metrics that show how far you've come.",
        status: "reserved",
        children: [
          {
            href: "/growth/learning",
            label: "Learning",
            icon: GraduationCap,
            description: "Courses, books, certifications, and skills, tracked from start to mastery.",
            status: "reserved",
          },
          {
            href: "/growth/knowledge",
            label: "Knowledge",
            icon: Library,
            description: "Notes, research, articles, and summaries — searchable in one place.",
            status: "reserved",
          },
          {
            href: "/growth/analytics",
            label: "Analytics",
            icon: BarChart3,
            description: "Goal completion, learning hours, streaks, and growth — measured over time.",
            status: "reserved",
          },
        ],
      },
      {
        href: "/ideas",
        label: "Ideas",
        icon: Lightbulb,
        description: "Capture every idea the moment it arrives — tagged, searchable, never lost.",
        status: "reserved",
      },
    ],
  },
  {
    name: "Journal",
    items: [
      {
        href: "/journal",
        label: "Journal",
        icon: BookOpen,
        description: "Daily reflection and every major decision, kept in one place.",
        status: "reserved",
        children: [
          {
            href: "/journal/daily",
            label: "Daily Journal",
            icon: NotebookPen,
            description: "Daily journaling, weekly and monthly reviews, wins, and lessons learned.",
            status: "reserved",
          },
          {
            href: "/journal/decisions",
            label: "Decisions",
            icon: Scale,
            description: "Every major decision — the options weighed, the reasoning, the outcome.",
            status: "reserved",
          },
        ],
      },
      {
        href: "/timeline",
        label: "Timeline",
        icon: History,
        description: "The visual history of every milestone, skill, and decision that shaped you.",
        status: "reserved",
      },
    ],
  },
  {
    name: "AI",
    items: [
      {
        href: "/coach",
        label: "Founder Coach",
        icon: Sparkles,
        description: "An assistant that knows your goals, reviews your week, and helps you decide.",
        status: "reserved",
      },
    ],
  },
];

export const SETTINGS_ITEM: NavItem = {
  href: "/settings",
  label: "Settings",
  icon: Settings,
  description: "Profile, appearance, notifications, and how the OS is configured.",
  status: "live",
};

/** Flat list of every item (parents + children), used for lookups like the header title and hub pages. */
export const NAV_FLAT: NavItem[] = NAV_TREE.flatMap((group) =>
  group.items.flatMap((item) => [item, ...(item.children ?? [])])
);

export function findNavItem(href: string): NavItem | undefined {
  if (href === SETTINGS_ITEM.href) return SETTINGS_ITEM;
  return NAV_FLAT.find((item) => item.href === href);
}
