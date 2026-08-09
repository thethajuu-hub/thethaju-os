"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Check, Plus, X, ChevronUp, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createGoal, toggleGoal, deleteGoal, moveGoal } from "@/app/(app)/vision/actions";
import type { Goal, GoalTimeframe } from "@/types";

export function GoalList({ timeframe, goals }: { timeframe: GoalTimeframe; goals: Goal[] }) {
  const doneCount = goals.filter((g) => g.done).length;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[11.5px] text-foreground-subtle">
          {doneCount}/{goals.length} complete
        </span>
      </div>

      <AddGoalForm timeframe={timeframe} />

      {goals.length === 0 && (
        <p className="px-1 py-2 text-[12.5px] text-foreground-subtle">
          No goals here yet — add the first one above.
        </p>
      )}

      <div className="flex flex-col gap-0.5">
        {goals.map((goal, i) => (
          <GoalRow
            key={goal.id}
            goal={goal}
            timeframe={timeframe}
            isFirst={i === 0}
            isLast={i === goals.length - 1}
          />
        ))}
      </div>
    </div>
  );
}

function AddGoalForm({ timeframe }: { timeframe: GoalTimeframe }) {
  const formRef = React.useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await createGoal(formData);
        formRef.current?.reset();
      }}
      className="flex items-center gap-2"
    >
      <input type="hidden" name="timeframe" value={timeframe} />
      <Input name="title" placeholder="Add a goal for this horizon" className="h-9 text-[13px]" />
      <AddSubmitButton />
    </form>
  );
}

function AddSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" variant="secondary" className="shrink-0" loading={pending}>
      <Plus className="h-3.5 w-3.5" />
      Add
    </Button>
  );
}

function GoalRow({
  goal,
  timeframe,
  isFirst,
  isLast,
}: {
  goal: Goal;
  timeframe: GoalTimeframe;
  isFirst: boolean;
  isLast: boolean;
}) {
  const [pending, startTransition] = React.useTransition();

  return (
    <div
      className={cn(
        "group flex items-center gap-1 rounded-md px-1 py-1 transition-colors hover:bg-surface-hover",
        pending && "opacity-50"
      )}
    >
      <button
        onClick={() => startTransition(() => toggleGoal(goal.id, !goal.done))}
        className="flex items-center gap-2.5 rounded-md px-1.5 py-1.5 text-left"
      >
        <span
          className={cn(
            "flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-[5px] border transition-colors",
            goal.done ? "border-foreground bg-foreground" : "border-border-strong"
          )}
        >
          {goal.done && <Check className="h-3 w-3 text-bg" strokeWidth={3} />}
        </span>
      </button>

      <span
        className={cn(
          "min-w-0 flex-1 truncate text-[13px]",
          goal.done ? "text-foreground-subtle line-through" : "text-foreground"
        )}
      >
        {goal.title}
      </span>

      <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
        <IconButton
          label="Move up"
          disabled={isFirst}
          onClick={() => startTransition(() => moveGoal(timeframe, goal.id, "up"))}
        >
          <ChevronUp className="h-3.5 w-3.5" />
        </IconButton>
        <IconButton
          label="Move down"
          disabled={isLast}
          onClick={() => startTransition(() => moveGoal(timeframe, goal.id, "down"))}
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </IconButton>
        <IconButton label="Delete" onClick={() => startTransition(() => deleteGoal(goal.id))}>
          <X className="h-3.5 w-3.5" />
        </IconButton>
      </div>
    </div>
  );
}

function IconButton({
  children,
  label,
  onClick,
  disabled,
}: {
  children: React.ReactNode;
  label: string;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      className="flex h-6 w-6 items-center justify-center rounded text-foreground-subtle transition-colors hover:bg-surface-elevated hover:text-foreground-muted disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  );
}
