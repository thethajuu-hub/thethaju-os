"use client";

import * as React from "react";
import { useFormStatus } from "react-dom";
import { Pencil, Plus } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { formatCurrency } from "@/lib/utils";
import { upsertTargets, addRevenueEntry } from "@/app/(app)/command-center/actions";
import type { RevenueTargets, RevenueAchieved } from "@/types";
import type { RevenueBySource } from "@/lib/supabase/queries";

const PERIODS: { key: keyof RevenueTargets; label: string }[] = [
  { key: "week", label: "This week" },
  { key: "month", label: "This month" },
  { key: "year", label: "This year" },
];

const SOURCE_LABELS: { key: keyof RevenueBySource; label: string }[] = [
  { key: "agency", label: "Agency" },
  { key: "dropshipping", label: "Dropshipping" },
  { key: "other", label: "Other" },
];

export function MissionControl({
  targets,
  achieved,
  bySource,
}: {
  targets: RevenueTargets;
  achieved: RevenueAchieved;
  bySource: RevenueBySource;
}) {
  const [editOpen, setEditOpen] = React.useState(false);
  const [addOpen, setAddOpen] = React.useState(false);
  const hasAnySource = bySource.agency > 0 || bySource.dropshipping > 0 || bySource.other > 0;

  return (
    <Card className="overflow-hidden border-none bg-gradient-to-br from-accent to-[#102A4C] text-white shadow-elevated">
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div className="flex flex-col gap-1">
          <CardTitle className="text-[15.5px] font-bold text-white">Mission Control</CardTitle>
          <CardDescription className="max-w-[380px] text-[12.5px] leading-relaxed text-[#9AA8BC]">
            Where every horizon stands, pulled straight from your revenue log.
          </CardDescription>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="rounded-full bg-white/10 px-2.5 py-1 text-[11px] font-semibold text-[#cfcfca]">
            Revenue log
          </span>
          <Button variant="ghost" size="icon" aria-label="Edit targets" onClick={() => setEditOpen(true)} className="text-white/70 hover:bg-white/10 hover:text-white">
            <Pencil className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col gap-5">
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-3">
          {PERIODS.map(({ key, label }) => {
            const target = targets[key];
            const current = achieved[key];
            const pct = target > 0 ? Math.min(100, (current / target) * 100) : 0;
            return (
              <div key={key} className="flex flex-col gap-2.5 rounded-2xl border border-white/10 bg-white/[0.06] p-4">
                <span className="text-[10.5px] font-bold uppercase tracking-wide text-[#8FA0B8]">
                  {label}
                </span>
                <span className="font-mono text-[22px] font-bold tracking-tight text-white">
                  {formatCurrency(current)}
                </span>
                {target > 0 ? (
                  <>
                    <Progress value={pct} barClassName="bg-white" className="bg-white/15" />
                    <span className="text-[11px] text-[#7E90A8]">
                      {pct.toFixed(0)}% of {formatCurrency(target)}
                    </span>
                  </>
                ) : (
                  <span className="text-[11px] text-[#7E90A8]">No target set — click Edit to add one</span>
                )}
              </div>
            );
          })}
        </div>

        <Button
          size="sm"
          onClick={() => setAddOpen(true)}
          className="w-fit rounded-full bg-white text-accent hover:bg-white/90"
        >
          <Plus className="h-3.5 w-3.5" />
          Add revenue
        </Button>

        {hasAnySource && (
          <div className="border-t border-white/10 pt-5">
            <p className="mb-3 text-[12px] font-medium text-[#9AA8BC]">This month by source</p>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
              {SOURCE_LABELS.map(({ key, label }) => (
                <div key={key} className="flex items-center justify-between rounded-xl border border-white/10 bg-white/[0.04] px-3.5 py-2.5">
                  <span className="text-[12.5px] text-[#B7C2D4]">{label}</span>
                  <span className="font-mono text-[13px] text-white">
                    {formatCurrency(bySource[key])}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>

      <EditTargetsDialog open={editOpen} onOpenChange={setEditOpen} targets={targets} />
      <AddRevenueDialog open={addOpen} onOpenChange={setAddOpen} />
    </Card>
  );
}

function EditTargetsDialog({
  open,
  onOpenChange,
  targets,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  targets: RevenueTargets;
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form
          action={async (formData) => {
            await upsertTargets(formData);
            onOpenChange(false);
          }}
        >
          <DialogHeader>
            <DialogTitle>Edit revenue targets</DialogTitle>
            <DialogDescription>What you&rsquo;re aiming for at each horizon.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            {PERIODS.map(({ key, label }) => (
              <div key={key} className="flex flex-col gap-1.5">
                <Label htmlFor={`target-${key}`}>{label} target</Label>
                <Input
                  id={`target-${key}`}
                  name={key}
                  type="number"
                  min="0"
                  step="1"
                  defaultValue={targets[key] || ""}
                  placeholder="0"
                />
              </div>
            ))}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" size="sm">
                Cancel
              </Button>
            </DialogClose>
            <SubmitButton label="Save targets" />
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function AddRevenueDialog({
  open,
  onOpenChange,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const formRef = React.useRef<HTMLFormElement>(null);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form
          ref={formRef}
          action={async (formData) => {
            await addRevenueEntry(formData);
            formRef.current?.reset();
            onOpenChange(false);
          }}
        >
          <DialogHeader>
            <DialogTitle>Add revenue</DialogTitle>
            <DialogDescription>
              Log a manual entry now — Agency and Dropshipping will post here automatically once those modules ship.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="amount">Amount</Label>
              <Input id="amount" name="amount" type="number" min="0" step="0.01" placeholder="0.00" required />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="source">Source</Label>
              <select
                id="source"
                name="source"
                defaultValue="other"
                className="flex h-10 w-full rounded-md border border-border bg-surface px-3.5 text-[13.5px] text-foreground outline-none transition-colors focus:border-border-strong focus:ring-2 focus:ring-accent/30"
              >
                <option value="agency">Agency</option>
                <option value="dropshipping">Dropshipping</option>
                <option value="other">Other</option>
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="note">Note (optional)</Label>
              <Input id="note" name="note" placeholder="e.g. Client invoice #204" />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" size="sm">
                Cancel
              </Button>
            </DialogClose>
            <SubmitButton label="Add revenue" />
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
