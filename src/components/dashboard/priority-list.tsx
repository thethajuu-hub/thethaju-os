"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Check, Plus, X, ChevronUp, ChevronDown, Clock } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { createTask, toggleTask, deleteTask, moveTask } from "@/app/(app)/command-center/actions";
import type { Task, Timeframe } from "@/types";

export function PriorityList({
  title,
  timeframe,
  tasks,
}: {
  title: string;
  timeframe: Timeframe;
  tasks: Task[];
}) {
  const [addOpen, setAddOpen] = React.useState(false);
  const doneCount = tasks.filter((t) => t.done).length;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>{title}</CardTitle>
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11.5px] text-foreground-subtle">
            {doneCount}/{tasks.length}
          </span>
          <button
            onClick={() => setAddOpen((v) => !v)}
            aria-label="Add task"
            className={cn(
              "flex h-6 w-6 items-center justify-center rounded-md text-foreground-subtle transition-colors hover:bg-surface-hover hover:text-foreground",
              addOpen && "bg-surface-hover text-foreground"
            )}
          >
            <Plus className={cn("h-3.5 w-3.5 transition-transform", addOpen && "rotate-45")} />
          </button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-2">
        {addOpen && <AddTaskForm timeframe={timeframe} onDone={() => setAddOpen(false)} />}

        {tasks.length === 0 && !addOpen && (
          <p className="px-2 py-3 text-[12.5px] text-foreground-subtle">
            Nothing here yet — add your first priority.
          </p>
        )}

        <div className="flex flex-col gap-0.5">
          {tasks.map((task, i) => (
            <TaskRow
              key={task.id}
              task={task}
              timeframe={timeframe}
              isFirst={i === 0}
              isLast={i === tasks.length - 1}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function AddTaskForm({ timeframe, onDone }: { timeframe: Timeframe; onDone: () => void }) {
  const formRef = React.useRef<HTMLFormElement>(null);

  return (
    <form
      ref={formRef}
      action={async (formData) => {
        await createTask(formData);
        formRef.current?.reset();
        onDone();
      }}
      className="mb-1 flex flex-col gap-2 rounded-md border border-border bg-bg/40 p-2.5"
    >
      <input type="hidden" name="timeframe" value={timeframe} />
      <Input name="title" placeholder="What needs to happen?" autoFocus className="h-8 text-[12.5px]" />
      <div className="flex items-center gap-2">
        <Input name="dueTime" type="time" className="h-8 w-auto text-[12.5px]" />
        <AddSubmitButton />
      </div>
    </form>
  );
}

function AddSubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" className="ml-auto h-8" loading={pending}>
      Add
    </Button>
  );
}

function TaskRow({
  task,
  timeframe,
  isFirst,
  isLast,
}: {
  task: Task;
  timeframe: Timeframe;
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
        onClick={() => startTransition(() => toggleTask(task.id, !task.done))}
        className="flex items-center gap-2.5 rounded-md px-1.5 py-1.5 text-left"
      >
        <span
          className={cn(
            "flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-[5px] border transition-colors",
            task.done ? "border-foreground bg-foreground" : "border-border-strong"
          )}
        >
          {task.done && <Check className="h-3 w-3 text-bg" strokeWidth={3} />}
        </span>
      </button>

      <div className="flex min-w-0 flex-1 flex-col">
        <span
          className={cn(
            "truncate text-[13px]",
            task.done ? "text-foreground-subtle line-through" : "text-foreground"
          )}
        >
          {task.title}
        </span>
        {task.dueTime && (
          <span className="flex items-center gap-1 text-[11px] text-foreground-subtle">
            <Clock className="h-2.5 w-2.5" />
            {task.dueTime.slice(0, 5)}
          </span>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
        <IconButton
          label="Move up"
          disabled={isFirst}
          onClick={() => startTransition(() => moveTask(timeframe, task.id, "up"))}
        >
          <ChevronUp className="h-3.5 w-3.5" />
        </IconButton>
        <IconButton
          label="Move down"
          disabled={isLast}
          onClick={() => startTransition(() => moveTask(timeframe, task.id, "down"))}
        >
          <ChevronDown className="h-3.5 w-3.5" />
        </IconButton>
        <IconButton label="Delete" onClick={() => startTransition(() => deleteTask(task.id))}>
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
