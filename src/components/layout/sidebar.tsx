"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronsLeft, ChevronsRight, ChevronRight, type LucideIcon } from "lucide-react";
import { NAV_TREE, SETTINGS_ITEM, type NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

const COLLAPSE_KEY = "thaju-os-sidebar-collapsed";
const EXPANDED_KEY = "thaju-os-sidebar-expanded";

export function Sidebar() {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = React.useState(false);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const [mounted, setMounted] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
    if (window.localStorage.getItem(COLLAPSE_KEY) === "1") setCollapsed(true);
    const storedExpanded = window.localStorage.getItem(EXPANDED_KEY);
    if (storedExpanded) {
      try {
        setExpanded(JSON.parse(storedExpanded));
      } catch {
        /* ignore malformed value */
      }
    }
  }, []);

  // Auto-expand whichever parent contains the active route, so a deep link
  // never lands on a page whose parent looks collapsed.
  React.useEffect(() => {
    for (const group of NAV_TREE) {
      for (const item of group.items) {
        if (item.children?.some((c) => pathname.startsWith(c.href))) {
          setExpanded((prev) => (prev[item.href] ? prev : { ...prev, [item.href]: true }));
        }
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const toggleCollapsed = () => {
    setCollapsed((prev) => {
      const next = !prev;
      window.localStorage.setItem(COLLAPSE_KEY, next ? "1" : "0");
      return next;
    });
  };

  const toggleExpanded = (href: string) => {
    setExpanded((prev) => {
      const next = { ...prev, [href]: !prev[href] };
      window.localStorage.setItem(EXPANDED_KEY, JSON.stringify(next));
      return next;
    });
  };

  return (
    <aside
      className={cn(
        "hidden md:flex md:flex-col shrink-0 border-r border-border bg-sidebar-bg transition-[width] duration-200 ease-out",
        collapsed ? "md:w-[64px]" : "md:w-[236px]"
      )}
    >
      <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-foreground text-[11.5px] font-semibold text-bg">
          T
        </div>
        {!collapsed && (
          <div className="flex flex-col leading-none">
            <span className="text-[12.5px] font-medium tracking-tight text-foreground">
              Founder OS
            </span>
            <span className="text-[10.5px] text-foreground-subtle">Private workspace</span>
          </div>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-2.5 py-4">
        {NAV_TREE.map((group) => (
          <div key={group.name} className="mb-5 last:mb-0">
            {!collapsed && (
              <p className="mb-1.5 px-2 text-[10.5px] font-medium uppercase tracking-wider text-foreground-subtle/80">
                {group.name}
              </p>
            )}
            <div className="flex flex-col gap-0.5">
              {group.items.map((item) => (
                <NavNode
                  key={item.href}
                  item={item}
                  pathname={pathname}
                  collapsed={collapsed && mounted}
                  expanded={!!expanded[item.href]}
                  onToggleExpanded={() => toggleExpanded(item.href)}
                />
              ))}
            </div>
          </div>
        ))}
      </nav>

      <div className="border-t border-border px-2.5 py-3">
        <SimpleLink
          href={SETTINGS_ITEM.href}
          label={SETTINGS_ITEM.label}
          icon={SETTINGS_ITEM.icon}
          active={pathname.startsWith(SETTINGS_ITEM.href)}
          collapsed={collapsed && mounted}
        />
        <button
          onClick={toggleCollapsed}
          className="mt-1 flex w-full items-center gap-2.5 rounded-md px-2.5 py-2 text-[12.5px] text-foreground-subtle transition-colors hover:bg-surface-hover hover:text-foreground-muted"
        >
          {collapsed ? <ChevronsRight className="h-4 w-4" /> : <ChevronsLeft className="h-4 w-4" />}
          {!collapsed && "Collapse"}
        </button>
      </div>
    </aside>
  );
}

function NavNode({
  item,
  pathname,
  collapsed,
  expanded,
  onToggleExpanded,
}: {
  item: NavItem;
  pathname: string;
  collapsed: boolean;
  expanded: boolean;
  onToggleExpanded: () => void;
}) {
  const hasChildren = !!item.children?.length;
  const selfActive = pathname === item.href;
  const descendantActive = item.children?.some((c) => pathname.startsWith(c.href)) ?? false;
  const active = selfActive || (!hasChildren && pathname.startsWith(item.href));

  if (!hasChildren) {
    return (
      <SimpleLink
        href={item.href}
        label={item.label}
        icon={item.icon}
        active={active}
        collapsed={collapsed}
      />
    );
  }

  // Collapsed rail: parent is just a link to its hub page, no inline expansion.
  if (collapsed) {
    return (
      <SimpleLink
        href={item.href}
        label={item.label}
        icon={item.icon}
        active={selfActive || descendantActive}
        collapsed
      />
    );
  }

  return (
    <div>
      <div
        className={cn(
          "group flex items-center rounded-md pr-1 transition-colors",
          selfActive || descendantActive ? "bg-surface-hover" : "hover:bg-surface-hover"
        )}
      >
        <Link
          href={item.href}
          className={cn(
            "flex flex-1 items-center gap-2.5 px-2.5 py-[7px] text-[13px]",
            selfActive || descendantActive
              ? "font-medium text-foreground"
              : "text-foreground-muted group-hover:text-foreground"
          )}
        >
          <item.icon
            className={cn(
              "h-[15px] w-[15px] shrink-0",
              selfActive || descendantActive ? "text-foreground" : "text-foreground-subtle"
            )}
            strokeWidth={1.75}
          />
          <span className="truncate">{item.label}</span>
        </Link>
        <button
          onClick={onToggleExpanded}
          aria-label={expanded ? `Collapse ${item.label}` : `Expand ${item.label}`}
          className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-foreground-subtle transition-colors hover:bg-surface-elevated hover:text-foreground-muted"
        >
          <ChevronRight
            className={cn("h-3.5 w-3.5 transition-transform duration-150", expanded && "rotate-90")}
          />
        </button>
      </div>

      <div
        className={cn(
          "grid overflow-hidden transition-[grid-template-rows] duration-200 ease-out",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
      >
        <div className="min-h-0">
          <div className="ml-[13px] mt-0.5 flex flex-col gap-0.5 border-l border-border pl-3.5">
            {item.children!.map((child) => (
              <SimpleLink
                key={child.href}
                href={child.href}
                label={child.label}
                icon={child.icon}
                active={pathname.startsWith(child.href)}
                collapsed={false}
                compact
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SimpleLink({
  href,
  label,
  icon: Icon,
  active,
  collapsed,
  compact,
}: {
  href: string;
  label: string;
  icon: LucideIcon;
  active: boolean;
  collapsed: boolean;
  compact?: boolean;
}) {
  const link = (
    <Link
      href={href}
      className={cn(
        "group flex items-center gap-2.5 rounded-md text-[13px] transition-colors",
        compact ? "px-2.5 py-[6px] text-[12.5px]" : "px-2.5 py-[7px]",
        collapsed && "justify-center px-0",
        active
          ? "bg-surface-hover font-medium text-foreground"
          : "text-foreground-muted hover:bg-surface-hover hover:text-foreground"
      )}
    >
      <Icon
        className={cn(
          compact ? "h-3.5 w-3.5" : "h-[15px] w-[15px]",
          "shrink-0",
          active ? "text-foreground" : "text-foreground-subtle group-hover:text-foreground-muted"
        )}
        strokeWidth={1.75}
      />
      {!collapsed && <span className="truncate">{label}</span>}
    </Link>
  );

  if (!collapsed) return link;

  return (
    <Tooltip>
      <TooltipTrigger asChild>{link}</TooltipTrigger>
      <TooltipContent side="right">{label}</TooltipContent>
    </Tooltip>
  );
}
