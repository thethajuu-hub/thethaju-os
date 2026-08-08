"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, ChevronDown } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { NAV_TREE, SETTINGS_ITEM, type NavItem } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const [expanded, setExpanded] = React.useState<Record<string, boolean>>({});
  const pathname = usePathname();

  React.useEffect(() => setOpen(false), [pathname]);

  React.useEffect(() => {
    for (const group of NAV_TREE) {
      for (const item of group.items) {
        if (item.children?.some((c) => pathname.startsWith(c.href))) {
          setExpanded((prev) => (prev[item.href] ? prev : { ...prev, [item.href]: true }));
        }
      }
    }
  }, [pathname]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden"
        onClick={() => setOpen(true)}
        aria-label="Open navigation"
      >
        <Menu className="h-[18px] w-[18px]" />
      </Button>
      <DialogContent className="left-0 top-0 h-full w-[288px] max-w-[85vw] translate-x-0 translate-y-0 rounded-none rounded-r-lg bg-sidebar-bg p-0 data-[state=open]:animate-fade-in-up">
        <DialogTitle className="sr-only">Navigation</DialogTitle>
        <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-[11.5px] font-semibold text-bg">
            T
          </div>
          <span className="text-[12.5px] font-medium text-foreground">Founder OS</span>
        </div>
        <nav className="max-h-[calc(100vh-56px)] overflow-y-auto px-2.5 py-4">
          {NAV_TREE.map((group) => (
            <div key={group.name} className="mb-5 last:mb-0">
              <p className="mb-1.5 px-2 text-[10.5px] font-medium uppercase tracking-wider text-foreground-subtle/80">
                {group.name}
              </p>
              <div className="flex flex-col gap-0.5">
                {group.items.map((item) => (
                  <MobileNavNode
                    key={item.href}
                    item={item}
                    pathname={pathname}
                    expanded={!!expanded[item.href]}
                    onToggleExpanded={() =>
                      setExpanded((prev) => ({ ...prev, [item.href]: !prev[item.href] }))
                    }
                  />
                ))}
              </div>
            </div>
          ))}
          <div className="border-t border-border pt-3">
            <Link
              href={SETTINGS_ITEM.href}
              className="flex items-center gap-2.5 rounded-md px-2.5 py-2.5 text-[13px] text-foreground-muted"
            >
              <SETTINGS_ITEM.icon className="h-[15px] w-[15px] text-foreground-subtle" strokeWidth={1.75} />
              {SETTINGS_ITEM.label}
            </Link>
          </div>
        </nav>
      </DialogContent>
    </Dialog>
  );
}

function MobileNavNode({
  item,
  pathname,
  expanded,
  onToggleExpanded,
}: {
  item: NavItem;
  pathname: string;
  expanded: boolean;
  onToggleExpanded: () => void;
}) {
  const hasChildren = !!item.children?.length;
  const selfActive = pathname === item.href;
  const descendantActive = item.children?.some((c) => pathname.startsWith(c.href)) ?? false;

  if (!hasChildren) {
    return (
      <Link
        href={item.href}
        className={cn(
          "flex items-center gap-2.5 rounded-md px-2.5 py-2.5 text-[13px]",
          pathname.startsWith(item.href)
            ? "bg-surface-hover font-medium text-foreground"
            : "text-foreground-muted"
        )}
      >
        <item.icon className="h-[15px] w-[15px] shrink-0 text-foreground-subtle" strokeWidth={1.75} />
        {item.label}
      </Link>
    );
  }

  return (
    <div>
      <div
        className={cn(
          "flex items-center rounded-md pr-1",
          (selfActive || descendantActive) && "bg-surface-hover"
        )}
      >
        <Link
          href={item.href}
          className={cn(
            "flex flex-1 items-center gap-2.5 px-2.5 py-2.5 text-[13px]",
            selfActive || descendantActive ? "font-medium text-foreground" : "text-foreground-muted"
          )}
        >
          <item.icon className="h-[15px] w-[15px] shrink-0 text-foreground-subtle" strokeWidth={1.75} />
          {item.label}
        </Link>
        <button
          onClick={onToggleExpanded}
          aria-label={expanded ? `Collapse ${item.label}` : `Expand ${item.label}`}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded text-foreground-subtle"
        >
          <ChevronDown className={cn("h-4 w-4 transition-transform duration-150", expanded && "rotate-180")} />
        </button>
      </div>
      {expanded && (
        <div className="ml-[13px] mt-0.5 flex flex-col gap-0.5 border-l border-border pl-3.5">
          {item.children!.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className={cn(
                "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[12.5px]",
                pathname.startsWith(child.href)
                  ? "bg-surface-hover font-medium text-foreground"
                  : "text-foreground-muted"
              )}
            >
              <child.icon className="h-3.5 w-3.5 shrink-0 text-foreground-subtle" strokeWidth={1.75} />
              {child.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
