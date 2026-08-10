"use client";

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
import { saveTrip } from "@/app/(app)/life/actions";
import { TRIP_STATUS_LABELS } from "@/lib/life-labels";
import type { Trip, TripStatus } from "@/types";

const selectClass =
  "flex h-10 w-full rounded-md border border-border bg-surface px-3.5 text-[13.5px] text-foreground outline-none transition-colors focus:border-border-strong focus:ring-2 focus:ring-accent/30";

export function TripDialog({
  open,
  onOpenChange,
  trip,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  trip?: Trip;
}) {
  const isEdit = !!trip;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form
          action={async (formData) => {
            await saveTrip(formData);
            onOpenChange(false);
          }}
        >
          {isEdit && <input type="hidden" name="id" value={trip!.id} />}
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit" : "Add"} trip</DialogTitle>
            <DialogDescription>A destination, planned or already lived.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="destination">Destination</Label>
              <Input id="destination" name="destination" defaultValue={trip?.destination ?? ""} required autoFocus />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="status">Status</Label>
              <select id="status" name="status" defaultValue={trip?.status ?? "bucket_list"} className={selectClass}>
                {(Object.keys(TRIP_STATUS_LABELS) as TripStatus[]).map((s) => (
                  <option key={s} value={s}>
                    {TRIP_STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="startDate">Start date</Label>
                <Input id="startDate" name="startDate" type="date" defaultValue={trip?.startDate ?? ""} />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="endDate">End date</Label>
                <Input id="endDate" name="endDate" type="date" defaultValue={trip?.endDate ?? ""} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" defaultValue={trip?.notes ?? ""} rows={3} placeholder="Optional" />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" size="sm">
                Cancel
              </Button>
            </DialogClose>
            <SubmitButton label={isEdit ? "Save changes" : "Add trip"} />
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
