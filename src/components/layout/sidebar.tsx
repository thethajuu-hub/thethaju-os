"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, ChevronsRight, type LucideIcon } from "lucide-react";
import { NAV_MODULES, NAV_GROUPS, SETTINGS_MODULE } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Badge } from "@/components/ui/badge";

const COLLAPSE_KEY = "thaju-os-sidebar-collapsed";

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    const stored = window.localStorage.getItem(COLLAPSE_KEY);
    if (stored === "1") setCollapsed(true);
  }, []);

  const toggle = () => {
    setCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      return next;
    });
  };

  return (
    <aside
      className={cn(
        "hidden md:flex md:flex-col shrink-0 border-r border-border bg-surface transition-[width] duration-200 ease-out",
        collapsed ? "md:w-[68px]" : "md:w-[248px]"
      )}
    >
      <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-foreground text-[12px] font-semibold text-bg">
          T
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-none">
            <span className="text-[13px] font-medium tracking-tight text-foreground">
              Founder OS
            </span>
            <span className="text-[10.5px] text-foreground-subtle">Private workspace</span>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2.5 py-4">
        {NAV_GROUPS.map((group) => {
          const modules = NAV_MODULES.filter((m) => m.group === group);
          if (modules.length === 0) return null;
          return (
            <div key={group} className="mb-5 last:mb-0">
              {!collapsed && (
                <p className="mb-1.5 px-2 text-[10.5px] font-medium uppercase tracking-wider text-foreground-subtle">
                  {group}
                </p>
              )}
              <div className="flex flex-col gap-0.5">
                {modules.map((module) => (
                  <NavLink
                    key={module.href}
                    href={module.href}
                    label={module.label}
                    icon={module.icon}
                    reserved={module.status === "reserved"}
                    active={pathname.startsWith(module.href)}
                    collapsed={collapsed && mounted}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </nav>

      <div className="border-t border-border px-2.5 py-3">
        <NavLink
          href={SETTINGS_MODULE.href}
          label={SETTINGS_MODULE.label}
          icon={SETTINGS_MODULE.icon}
          active={pathname.startsWith(SETTINGS_MODULE.href)}
          collapsed={collapsed && mounted}
        />
        <button
          onClick={toggle}
          className="mt-1 flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[12.5px] text-foreground-subtle transition-colors hover:bg-surface-hover hover:text-foreground-muted"
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          {!collapsed && "Collapse"}
        </button>
      </div>
    </aside>
  );
}

function NavLink({
  href,
  label,
  icon: Icon,
  active,
  reserved,
  collapsed,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  reserved?: boolean;
  collapsed: boolean;
}) {
  const link = (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-2.5 rounded-md px-2.5 py-[7px] text-[13px] transition-colors",
        collapsed && "justify-center px-0",
        active
          ? "bg-surface-hover text-foreground font-medium"
          : "text-foreground-muted hover:bg-surface-hover hover:text-foreground"
      )}
    >
      <Icon
        className={cn("h-[15px] w-[15px] shrink-0", active ? "text-foreground" : "text-foreground-subtle group-hover:text-foreground-muted")}
        strokeWidth={1.75}
      />
      {!collapsed && (
        <span className="flex flex-1 items-center justify-between gap-2 truncate">
          {label}
          {reserved && (
            <Badge variant="outline" className="px-1.5 py-0 text-[9.5px]">
              Soon
            </Badge>
          )}
        </span>
      )}
    </Link>
  );

  if (!collapsed) return link;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{label}{reserved ? " — coming soon" : ""}</TooltipContent>
    </Tooltip>
  );
}
