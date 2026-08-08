"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import { SectionHeader } from "@/components/dashboard/section-header";

const TABS = [
  { href: "/settings/profile", label: "Profile" },
  { href: "/settings/appearance", label: "Appearance" },
  { href: "/settings/notifications", label: "Notifications" },
  { href: "/settings/data", label: "Data & Backup" },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <SectionHeader
        title="Settings"
        description="Your profile, appearance, and how the OS is configured."
      />

      <div className="flex flex-col gap-6 md:flex-row md:gap-10">
        <nav className="flex shrink-0 gap-1 overflow-x-auto md:w-[180px] md:flex-col md:overflow-visible">
          {TABS.map((tab) => (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                "shrink-0 rounded-md px-3 py-2 text-[13px] transition-colors",
                pathname === tab.href
                  ? "bg-surface-hover font-medium text-foreground"
                  : "text-foreground-muted hover:bg-surface-hover hover:text-foreground"
              )}
            >
              {tab.label}
            </Link>
          ))}
        </nav>
        <div className="min-w-0 flex-1">{children}</div>
      </div>
    </div>
  );
}
