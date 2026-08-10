"use client";

import * as React from "react";
import { useTransition } from "react";
import { useFormStatus } from "react-dom";
import { Moon, Zap, Smile, Droplet, Dumbbell, X } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/ui/empty-state";
import { saveHealthLog, deleteHealthLog } from "@/app/(app)/life/actions";
import { formatShortDate } from "@/lib/life-labels";
import { todayISO } from "@/lib/dates";
import type { HealthLog } from "@/types";

export function HealthLogSection({ logs }: { logs: HealthLog[] }) {
  const today = todayISO();
  const todayLog = logs.find((l) => l.logDate === today);
  const history = logs.filter((l) => l.logDate !== today);

  return (
    <div className="flex flex-col gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Today</CardTitle>
          <CardDescription>{formatShortDate(today)} — log what you can, skip what you can&rsquo;t.</CardDescription>
        </CardHeader>
        <CardContent>
          <TodayForm log={todayLog} />
        </CardContent>
      </Card>

      <div className="flex flex-col gap-3">
        <p className="text-[12px] font-medium text-foreground-subtle">History</p>
        {history.length === 0 ? (
          <EmptyState icon={Moon} title="No history yet" description="Past logs will build up here day by day." />
        ) : (
          <div className="flex flex-col gap-1.5">
            {history.map((log) => (
              <HistoryRow key={log.id} log={log} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function TodayForm({ log }: { log?: HealthLog }) {
  return (
    <form action={saveHealthLog} className="flex flex-col gap-4">
      <input type="hidden" name="logDate" value={todayISO()} />
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Field icon={Moon} label="Sleep (hrs)" name="sleepHours" type="number" step="0.5" defaultValue={log?.sleepHours ?? ""} />
        <Field icon={Zap} label="Energy (1-5)" name="energyLevel" type="number" min={1} max={5} defaultValue={log?.energyLevel ?? ""} />
        <Field icon={Smile} label="Mood (1-5)" name="mood" type="number" min={1} max={5} defaultValue={log?.mood ?? ""} />
        <Field icon={Droplet} label="Water (glasses)" name="waterGlasses" type="number" defaultValue={log?.waterGlasses ?? ""} />
        <Field icon={Dumbbell} label="Exercise (min)" name="exerciseMinutes" type="number" defaultValue={log?.exerciseMinutes ?? ""} />
      </div>
      <div className="flex flex-col gap-1.5">
        <Label htmlFor="notes">Notes</Label>
        <Textarea id="notes" name="notes" defaultValue={log?.notes ?? ""} rows={2} placeholder="Optional" />
      </div>
      <div className="flex justify-end">
        <SaveButton />
      </div>
    </form>
  );
}

function Field({
  icon: Icon,
  label,
  name,
  type,
  step,
  min,
  max,
  defaultValue,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  name: string;
  type: string;
  step?: string;
  min?: number;
  max?: number;
  defaultValue: string | number;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <Label htmlFor={name} className="flex items-center gap-1.5">
        <Icon className="h-3 w-3 text-foreground-subtle" />
        {label}
      </Label>
      <Input id={name} name={name} type={type} step={step} min={min} max={max} defaultValue={defaultValue} />
    </div>
  );
}

function SaveButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" loading={pending}>
      Save today
    </Button>
  );
}

function HistoryRow({ log }: { log: HealthLog }) {
  const [pending, startTransition] = useTransition();

  const parts: string[] = [];
  if (log.sleepHours != null) parts.push(`${log.sleepHours}h sleep`);
  if (log.energyLevel != null) parts.push(`Energy ${log.energyLevel}/5`);
  if (log.mood != null) parts.push(`Mood ${log.mood}/5`);
  if (log.waterGlasses != null) parts.push(`${log.waterGlasses} glasses`);
  if (log.exerciseMinutes != null) parts.push(`${log.exerciseMinutes}min exercise`);

  return (
    <div
      className={`group flex items-center gap-3 rounded-md border border-border px-3.5 py-2.5 transition-colors hover:border-border-strong ${pending ? "opacity-40" : ""}`}
    >
      <span className="w-20 shrink-0 text-[12.5px] font-medium text-foreground">
        {formatShortDate(log.logDate)}
      </span>
      <span className="min-w-0 flex-1 truncate text-[12.5px] text-foreground-muted">
        {parts.length > 0 ? parts.join(" · ") : "No metrics logged"}
      </span>
      <button
        onClick={() => startTransition(() => deleteHealthLog(log.id))}
        aria-label="Delete"
        className="flex h-6 w-6 shrink-0 items-center justify-center rounded text-foreground-subtle opacity-0 transition-opacity hover:bg-surface-hover hover:text-foreground-muted group-hover:opacity-100"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
