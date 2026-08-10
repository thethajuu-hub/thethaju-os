"use client";

import * as React from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GoalCard } from "@/components/dashboard/goal-card";
import { GoalDialog } from "@/components/dashboard/goal-dialog";
import type { Goal, GoalTimeframe } from "@/types";

export function GoalList({
  timeframe,
  goals,
  allGoals,
}: {
  timeframe: GoalTimeframe;
  goals: Goal[];
  /** Every goal across every timeframe — used to resolve parent titles and populate the picker. */
  allGoals: Goal[];
}) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editingGoal, setEditingGoal] = React.useState<Goal | undefined>(undefined);

  const goalById = React.useMemo(() => new Map(allGoals.map((g) => [g.id, g])), [allGoals]);

  const openCreate = () => {
    setEditingGoal(undefined);
    setDialogOpen(true);
  };

  const openEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11.5px] text-foreground-subtle">
          {goals.filter((g) => g.status === "completed").length}/{goals.length} complete
        </span>
        <Button variant="secondary" size="sm" onClick={openCreate}>
          <Plus className="h-3.5 w-3.5" />
          Add goal
        </Button>
      </div>

      {goals.length === 0 && (
        <p className="px-1 py-2 text-[12.5px] text-foreground-subtle">
          No goals here yet — add the first one above.
        </p>
      )}

      <div className="flex flex-col gap-2">
        {goals.map((goal) => (
          <GoalCard
            key={goal.id}
            goal={goal}
            parentTitle={goal.parentId ? goalById.get(goal.parentId)?.title ?? null : null}
            onEdit={() => openEdit(goal)}
          />
        ))}
      </div>

      <GoalDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        goal={editingGoal}
        defaultTimeframe={timeframe}
        parentOptions={allGoals}
      />
    </div>
  );
}
