import type { LucideIcon } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface StatCardProps {
  label: string;
  value: string;
  hint?: string;
  icon: LucideIcon;
  trend?: { value: string; direction: "up" | "down" | "flat" };
  className?: string;
}

export function StatCard({ label, value, hint, icon: Icon, trend, className }: StatCardProps) {
  const [primaryValue, ...unitParts] = value.split(" ");
  const unit = unitParts.join(" ");

  return (
    <Card className={cn("p-5", className)}>
      <div className="mb-5 flex items-center justify-between">
        <span className="text-[12px] font-bold text-foreground-muted">{label}</span>
        <div className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-[10px] bg-surface-elevated">
          <Icon className="h-4 w-4 text-foreground-muted" strokeWidth={1.75} />
        </div>
      </div>
      <p className="text-[26px] font-bold tracking-tight text-accent">
        {primaryValue}
        {unit && <span className="ml-1 text-[14px] font-semibold text-foreground-subtle">{unit}</span>}
      </p>
      {(hint || trend) && (
        <div className="mt-1.5 flex items-center gap-1.5 text-[12px]">
          {trend && (
            <span
              className={cn(
                trend.direction === "up" && "text-success",
                trend.direction === "down" && "text-danger",
                trend.direction === "flat" && "text-foreground-subtle"
              )}
            >
              {trend.value}
            </span>
          )}
          {hint && <span className="text-foreground-subtle">{hint}</span>}
        </div>
      )}
    </Card>
  );
}
