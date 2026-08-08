import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  action?: React.ReactNode;
  className?: string;
}

/**
 * Used by every reserved module in the foundation phase, and by any list
 * that has nothing in it yet. The empty state is an invitation to act, not
 * an apology — see the module's own description for what will live here.
 */
function EmptyState({ icon: Icon, title, description, action, className }: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-lg border border-dashed border-border px-6 py-16 text-center animate-fade-in-up",
        className
      )}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface-elevated">
        <Icon className="h-[18px] w-[18px] text-foreground-subtle" strokeWidth={1.75} />
      </div>
      <div className="flex max-w-sm flex-col gap-1.5">
        <p className="text-[14px] font-medium text-foreground">{title}</p>
        <p className="text-[13px] leading-relaxed text-foreground-muted">{description}</p>
      </div>
      {action}
    </div>
  );
}

export { EmptyState };
