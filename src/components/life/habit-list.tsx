"use client";

import * as React from "react";
import { useTransition } from "react";
import { useFormStatus } from "react-dom";
import { Check, Flame, Plus, X, Archive } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { cn } from "@/lib/utils";
import { createHabit, toggleHabitToday, archiveHabit, deleteHabit } from "@/app/(app)/life/actions";
import type { Habit } from "@/types";

export function HabitList({ habits }: { habits: Habit[] }) {
  return (
    <div className="flex flex-col gap-4">
      <AddHabitForm />

      {habits.length === 0 ? (
        <EmptyState
          icon={Flame}
          title="No habits yet"
          description="Add one above — reading, deep work, training, anything worth a streak."
        />
      ) : (
        <div className="flex flex-col gap-1.5">
          {habits.map((habit) => (
            <HabitRow key={habit.id} habit={habit} />
          ))}
        </div>
      )}
    </div>
  );
}

function AddHabitForm() {
  const formRef = React.useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await createHabit(formData);
        formRef.current?.reset();
      }}
      className="flex items-center gap-2"
    >
      <Input name="name" placeholder="Add a habit — e.g. Reading" className="h-9 text-[13px]" />
      <AddButton />
    </form>
  );
}

function AddButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" variant="secondary" className="shrink-0" loading={pending}>
      <Plus className="h-3.5 w-3.5" />
      Add
    </Button>
  );
}

function HabitRow({ habit }: { habit: Habit }) {
  const [pending, startTransition] = useTransition();

  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-md border border-border px-3.5 py-2.5 transition-colors hover:border-border-strong",
        pending && "opacity-50"
      )}
    >
      <button
        onClick={() => startTransition(() => toggleHabitToday(habit.id, !habit.doneToday))}
        aria-label={habit.doneToday ? "Mark not done today" : "Mark done today"}
        className={cn(
          "flex h-7 w-7 shrink-0 items-center justify-center rounded-full border transition-colors",
          habit.doneToday ? "border-foreground bg-foreground" : "border-border-strong hover:border-foreground-muted"
        )}
      >
        {habit.doneToday && <Check className="h-3.5 w-3.5 text-bg" strokeWidth={3} />}
      </button>

      <span className="min-w-0 flex-1 truncate text-[13.5px] text-foreground">{habit.name}</span>

      <div className="flex shrink-0 items-center gap-1.5">
        {habit.currentStreak > 0 && (
          <span className="flex items-center gap-1 rounded-full border border-border bg-surface-elevated px-2 py-0.5 text-[11px] font-medium text-foreground-muted">
            <Flame className="h-3 w-3 text-foreground-subtle" />
            {habit.currentStreak}
          </span>
        )}
        <div className="flex items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
          <IconButton label="Archive" onClick={() => startTransition(() => archiveHabit(habit.id))}>
            <Archive className="h-3.5 w-3.5" />
          </IconButton>
          <IconButton label="Delete" onClick={() => startTransition(() => deleteHabit(habit.id))}>
            <X className="h-3.5 w-3.5" />
          </IconButton>
        </div>
      </div>
    </div>
  );
}

function IconButton({ children, label, onClick }: { children: React.ReactNode; label: string; onClick: () => void }) {
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
