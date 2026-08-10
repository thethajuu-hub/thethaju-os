import Link from "next/link";
import { ArrowRight, Target } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { STATUS_LABELS, STATUS_BADGE_VARIANT } from "@/lib/goal-labels";
import type { Goal } from "@/types";

/** Read-only preview of this week's goals — editing happens on /vision. */
export function WeeklyGoalsCard({ goals }: { goals: Goal[] }) {
  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div className="flex flex-col gap-1">
          <CardTitle>This week&rsquo;s goals</CardTitle>
          <CardDescription>Pulled from Vision — edit them there.</CardDescription>
        </div>
        <Link
          href="/vision"
          className="flex items-center gap-1 text-[12.5px] text-foreground-muted transition-colors hover:text-foreground"
        >
          Open Vision
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </CardHeader>
      <CardContent>
        {goals.length === 0 ? (
          <EmptyState
            icon={Target}
            title="No weekly goals yet"
            description="Set them on Vision and they'll show up here."
          />
        ) : (
          <div className="flex flex-col gap-2">
            {goals.map((goal) => (
              <div
                key={goal.id}
                className="flex flex-col gap-2 rounded-xl border border-border p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="truncate text-[13px] font-medium text-foreground">{goal.title}</span>
                  <Badge variant={STATUS_BADGE_VARIANT[goal.status]}>{STATUS_LABELS[goal.status]}</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Progress value={goal.progress} className="flex-1" />
                  <span className="font-mono text-[11px] text-foreground-subtle">{goal.progress}%</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
