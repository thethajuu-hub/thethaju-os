"use client";

import * as React from "react";
import { useTransition } from "react";
import { Pencil, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { deleteGoal } from "@/app/(app)/vision/actions";
import { STATUS_LABELS, STATUS_BADGE_VARIANT, PRIORITY_LABELS, TIMEFRAME_LABELS } from "@/lib/goal-labels";
import type { Goal } from "@/types";

function formatDeadline(deadline: string) {
  const d = new Date(`${deadline}T00:00:00`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

export function GoalCard({
  goal,
  parentTitle,
  onEdit,
}: {
  goal: Goal;
  parentTitle: string | null;
  onEdit: () => void;
}) {
  const [pending, startTransition] = useTransition();
  const isOverdue =
    goal.deadline && goal.status !== "completed" && new Date(goal.deadline) < new Date(new Date().toDateString());

  return (
    <div
      className={cn(
        "group flex flex-col gap-2.5 rounded-md border border-border p-3.5 transition-colors hover:border-border-strong",
        pending && "opacity-50"
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex min-w-0 flex-col gap-1">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="text-[13.5px] font-medium text-foreground">{goal.title}</span>
            <Badge variant={STATUS_BADGE_VARIANT[goal.status]}>{STATUS_LABELS[goal.status]}</Badge>
            {goal.priority === "high" && (
              <span className="text-[11px] font-medium uppercase tracking-wide text-foreground-muted">
                High priority
              </span>
            )}
          </div>
          {goal.description && (
            <p className="text-[12.5px] leading-relaxed text-foreground-muted">{goal.description}</p>
          )}
          {parentTitle && (
            <p className="text-[11.5px] text-foreground-subtle">
              Under {TIMEFRAME_LABELS[goal.timeframe]} · {parentTitle}
            </p>
          )}
        </div>

        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <IconButton label="Edit goal" onClick={onEdit}>
            <Pencil className="h-3.5 w-3.5" />
          </IconButton>
          <IconButton label="Delete goal" onClick={() => startTransition(() => deleteGoal(goal.id))}>
            <X className="h-3.5 w-3.5" />
          </IconButton>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <Progress value={goal.progress} className="flex-1" />
        <span className="font-mono text-[11.5px] text-foreground-subtle">{goal.progress}%</span>
      </div>

      <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11.5px] text-foreground-subtle">
        <span>{PRIORITY_LABELS[goal.priority]} priority</span>
        {goal.deadline && (
          <span className={cn(isOverdue && "font-medium text-danger")}>
            {isOverdue ? "Overdue — " : "Due "}
            {formatDeadline(goal.deadline)}
          </span>
        )}
      </div>
    </div>
  );
}

function IconButton({
  children,
  label,
  onClick,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      aria-label={label}
      className="flex h-6 w-6 items-center justify-center rounded text-foreground-subtle transition-colors hover:bg-surface-hover hover:text-foreground-muted"
    >
      {children}
    </button>
  );
}
