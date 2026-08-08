import Link from "next/link";
import { ChevronRight } from "lucide-react";
import { findNavItem } from "@/lib/navigation";
import { SectionHeader } from "@/components/dashboard/section-header";
import { Card } from "@/components/ui/card";

/**
 * Renders the overview page for a parent module that has children in the
 * sidebar (Business, Life, Money, Growth, Journal). Lists each child as a
 * quiet, clickable row — the same progressive-disclosure idea as the
 * sidebar itself, just expressed as a page instead of a flyout.
 */
export function ModuleHubPage({ href }: { href: string }) {
  const item = findNavItem(href);
  if (!item) return null;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <SectionHeader title={item.label} description={item.description} />

      {item.children && item.children.length > 0 ? (
        <div className="flex flex-col divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
          {item.children.map((child) => (
            <Link
              key={child.href}
              href={child.href}
              className="group flex items-center gap-3.5 px-4 py-3.5 transition-colors hover:bg-surface-hover"
            >
              <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-border bg-bg">
                <child.icon className="h-[15px] w-[15px] text-foreground-subtle" strokeWidth={1.75} />
              </span>
              <span className="flex min-w-0 flex-1 flex-col gap-0.5">
                <span className="text-[13.5px] font-medium text-foreground">{child.label}</span>
                <span className="truncate text-[12px] text-foreground-subtle">{child.description}</span>
              </span>
              <ChevronRight className="h-4 w-4 shrink-0 text-foreground-subtle transition-transform group-hover:translate-x-0.5" />
            </Link>
          ))}
        </div>
      ) : (
        <Card className="px-6 py-14 text-center">
          <p className="text-[13px] text-foreground-muted">
            {item.label} hasn&rsquo;t been built yet — this space is reserved for a future phase.
          </p>
        </Card>
      )}
    </div>
  );
}
