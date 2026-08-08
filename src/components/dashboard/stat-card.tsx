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
  return (
    <Card className={cn("p-5", className)}>
      <div className="flex items-start justify-between">
        <p className="text-[12.5px] text-foreground-muted">{label}</p>
        <Icon className="h-4 w-4 text-foreground-subtle" strokeWidth={1.75} />
      </div>
      <p className="mt-2.5 font-mono text-[24px] font-medium tracking-tight text-foreground">
        {value}
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
