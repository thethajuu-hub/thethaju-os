"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { saveGoal } from "@/app/(app)/vision/actions";
import { TIMEFRAME_LABELS, TIMEFRAME_ORDER, PRIORITY_LABELS, STATUS_LABELS } from "@/lib/goal-labels";
import type { Goal, GoalTimeframe, GoalPriority, GoalStatus } from "@/types";

const selectClass =
  "flex h-10 w-full rounded-md border border-border bg-surface px-3.5 text-[13.5px] text-foreground outline-none transition-colors focus:border-border-strong focus:ring-2 focus:ring-accent/30";

export function GoalDialog({
  open,
  onOpenChange,
  goal,
  defaultTimeframe,
  parentOptions,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  /** Omit for "create" mode; pass the goal being edited for "edit" mode. */
  goal?: Goal;
  defaultTimeframe: GoalTimeframe;
  /** Flat list of every other goal, for the optional parent-goal picker. */
  parentOptions: Goal[];
}) {
  const isEdit = !!goal;
  const [progress, setProgress] = React.useState(goal?.progress ?? 0);

  React.useEffect(() => {
    setProgress(goal?.progress ?? 0);
  }, [goal, open]);

  const eligibleParents = parentOptions.filter((g) => g.id !== goal?.id);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85vh] overflow-y-auto">
        <form
          action={async (formData) => {
            await saveGoal(formData);
            onOpenChange(false);
          }}
        >
          {isEdit && <input type="hidden" name="id" value={goal!.id} />}

          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit goal" : "Add goal"}</DialogTitle>
            <DialogDescription>
              {isEdit ? "Update this goal's details." : `New ${TIMEFRAME_LABELS[defaultTimeframe]} goal.`}
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={goal?.title ?? ""} required autoFocus />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={goal?.description ?? ""}
                placeholder="Optional — what does success look like here?"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="timeframe">Time period</Label>
                <select
                  id="timeframe"
                  name="timeframe"
                  defaultValue={goal?.timeframe ?? defaultTimeframe}
                  className={selectClass}
                >
                  {TIMEFRAME_ORDER.map((tf) => (
                    <option key={tf} value={tf}>
                      {TIMEFRAME_LABELS[tf as GoalTimeframe]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="deadline">Deadline</Label>
                <Input
                  id="deadline"
                  name="deadline"
                  type="date"
                  defaultValue={goal?.deadline ?? ""}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  name="priority"
                  defaultValue={goal?.priority ?? "medium"}
                  className={selectClass}
                >
                  {(Object.keys(PRIORITY_LABELS) as GoalPriority[]).map((p) => (
                    <option key={p} value={p}>
                      {PRIORITY_LABELS[p]}
                    </option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="status">Status</Label>
                <select
                  id="status"
                  name="status"
                  defaultValue={goal?.status ?? "not_started"}
                  className={selectClass}
                >
                  {(Object.keys(STATUS_LABELS) as GoalStatus[]).map((s) => (
                    <option key={s} value={s}>
                      {STATUS_LABELS[s]}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="progress">Progress</Label>
                <span className="font-mono text-[12px] text-foreground-subtle">{progress}%</span>
              </div>
              <input
                id="progress"
                name="progress"
                type="range"
                min={0}
                max={100}
                step={5}
                value={progress}
                onChange={(e) => setProgress(Number(e.target.value))}
                className="h-1.5 w-full cursor-pointer appearance-none rounded-full bg-surface-hover accent-foreground"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <Label htmlFor="parentId">Parent goal</Label>
              <select
                id="parentId"
                name="parentId"
                defaultValue={goal?.parentId ?? ""}
                className={selectClass}
              >
                <option value="">None</option>
                {eligibleParents.map((g) => (
                  <option key={g.id} value={g.id}>
                    {TIMEFRAME_LABELS[g.timeframe]} — {g.title}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" size="sm">
                Cancel
              </Button>
            </DialogClose>
            <SubmitButton label={isEdit ? "Save changes" : "Add goal"} />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function SubmitButton({ label }: { label: string }) {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" size="sm" loading={pending}>
      {label}
    </Button>
  );
}
