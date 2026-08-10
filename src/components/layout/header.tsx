"use client";

import { usePathname } from "next/navigation";
import { Search } from "lucide-react";
import { MobileNav } from "@/components/layout/mobile-nav";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { UserMenu } from "@/components/layout/user-menu";
import { NAV_FLAT, SETTINGS_ITEM } from "@/lib/navigation";
import type { FounderProfile } from "@/types";

function useCurrentModuleLabel() {
  const pathname = usePathname();
  const all = [...NAV_FLAT, SETTINGS_ITEM];
  const match = all
    .filter((m) => pathname.startsWith(m.href))
    .sort((a, b) => b.href.length - a.href.length)[0];
  return match?.label ?? "Founder OS";
}

export function Header({ profile }: { profile: FounderProfile }) {
  const title = useCurrentModuleLabel();

  return (
    <header className="sticky top-0 z-30 flex h-14 shrink-0 items-center justify-between gap-4 border-b border-border bg-surface/80 px-4 backdrop-blur-md md:px-6">
      <div className="flex items-center gap-3">
        <MobileNav />
        <h1 className="text-[14px] font-medium tracking-tight text-foreground">{title}</h1>
      </div>

      <div className="flex items-center gap-1.5">
        <button
          className="hidden items-center gap-2 rounded-md border border-border bg-surface px-3 py-1.5 text-[12.5px] text-foreground-subtle transition-colors hover:border-border-strong hover:text-foreground-muted sm:flex"
          aria-label="Search"
        >
          <Search className="h-3.5 w-3.5" />
          <span>Search</span>
          <kbd className="ml-3 rounded border border-border bg-surface-elevated px-1.5 py-0.5 text-[10px] text-foreground-subtle">
            ⌘K
          </kbd>
        </button>
        <ThemeToggle />
        <UserMenu profile={profile} />
      </div>
    </header>
  );
}
