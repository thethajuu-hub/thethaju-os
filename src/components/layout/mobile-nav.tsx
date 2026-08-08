"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { NAV_MODULES, NAV_GROUPS, SETTINGS_MODULE } from "@/lib/navigation";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => setOpen(false), [pathname]);

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
      <DialogContent className="left-0 top-0 h-full w-[280px] max-w-[85vw] translate-x-0 translate-y-0 rounded-none rounded-r-lg p-0 data-[state=open]:animate-fade-in-up">
        <DialogTitle className="sr-only">Navigation</DialogTitle>
        <div className="flex h-14 items-center gap-2.5 border-b border-border px-4">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-foreground text-[12px] font-semibold text-bg">
            T
          </div>
          <span className="text-[13px] font-medium text-foreground">Founder OS</span>
        </div>
        <nav className="max-h-[calc(100vh-56px)] overflow-y-auto px-2.5 py-4">
          {NAV_GROUPS.map((group) => {
            const modules = NAV_MODULES.filter((m) => m.group === group);
            if (modules.length === 0) return null;
            return (
              <div key={group} className="mb-5 last:mb-0">
                <p className="mb-1.5 px-2 text-[10.5px] font-medium uppercase tracking-wider text-foreground-subtle">
                  {group}
                </p>
                <div className="flex flex-col gap-0.5">
                  {modules.map((module) => (
                    <Link
                      key={module.href}
                      href={module.href}
                      className={cn(
                        "flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px]",
                        pathname.startsWith(module.href)
                          ? "bg-surface-hover font-medium text-foreground"
                          : "text-foreground-muted"
                      )}
                    >
                      <module.icon className="h-[15px] w-[15px] shrink-0 text-foreground-subtle" strokeWidth={1.75} />
                      <span className="flex flex-1 items-center justify-between gap-2">
                        {module.label}
                        {module.status === "reserved" && (
                          <Badge variant="outline" className="px-1.5 py-0 text-[9.5px]">
                            Soon
                          </Badge>
                        )}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
          <div className="border-t border-border pt-3">
            <Link
              href={SETTINGS_MODULE.href}
              className="flex items-center gap-2.5 rounded-md px-2.5 py-2 text-[13px] text-foreground-muted"
            >
              <SETTINGS_MODULE.icon className="h-[15px] w-[15px] text-foreground-subtle" strokeWidth={1.75} />
              {SETTINGS_MODULE.label}
            </Link>
          </div>
        </nav>
      </DialogContent>
    </Dialog>
  );
}
