"use client";

import * as React from "react";
import { Check } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { Priority } from "@/types";

/**
 * Foundation phase: priorities live in component state only. Once
 * Life Planner ships, this reads/writes through that module instead.
 */
export function PriorityList({
  title,
  seed,
}: {
  title: string;
  seed: Omit<Priority, "id">[];
}) {
  const [items, setItems] = React.useState<Priority[]>(
    seed.map((s, i) => ({ ...s, id: `${title}-${i}` }))
  );

  const toggle = (id: string) => {
    setItems((prev) => prev.map((p) => (p.id === id ? { ...p, done: !p.done } : p)));
  };

  const doneCount = items.filter((i) => i.done).length;

  return (
    <Card>
      <CardHeader className="flex-row items-center justify-between space-y-0">
        <CardTitle>{title}</CardTitle>
        <span className="font-mono text-[11.5px] text-foreground-subtle">
          {doneCount}/{items.length}
        </span>
      </CardHeader>
      <CardContent className="flex flex-col gap-0.5">
        {items.map((item) => (
          <button
            key={item.id}
            onClick={() => toggle(item.id)}
            className="flex items-center gap-2.5 rounded-md px-2 py-2 text-left transition-colors hover:bg-surface-hover"
          >
            <span
              className={cn(
                "flex h-[17px] w-[17px] shrink-0 items-center justify-center rounded-[5px] border transition-colors",
                item.done ? "border-foreground bg-foreground" : "border-border-strong"
              )}
            >
              {item.done && <Check className="h-3 w-3 text-bg" strokeWidth={3} />}
            </span>
            <span
              className={cn(
                "text-[13px]",
                item.done ? "text-foreground-subtle line-through" : "text-foreground"
              )}
            >
              {item.label}
            </span>
          </button>
        ))}
      </CardContent>
    </Card>
  );
}
