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
import { saveLifeEvent } from "@/app/(app)/life/actions";
import { EVENT_CATEGORY_LABELS } from "@/lib/life-labels";
import type { LifeEvent, LifeEventCategory } from "@/types";

const selectClass =
  "flex h-10 w-full rounded-md border border-border bg-surface px-3.5 text-[13.5px] text-foreground outline-none transition-colors focus:border-border-strong focus:ring-2 focus:ring-accent/30";

export function EventDialog({
  open,
  onOpenChange,
  event,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  event?: LifeEvent;
}) {
  const isEdit = !!event;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form
          action={async (formData) => {
            await saveLifeEvent(formData);
            onOpenChange(false);
          }}
        >
          {isEdit && <input type="hidden" name="id" value={event!.id} />}
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit" : "Add"} event</DialogTitle>
            <DialogDescription>An event, appointment, or reminder with a date.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={event?.title ?? ""} required autoFocus />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="description">Notes</Label>
              <Textarea
                id="description"
                name="description"
                defaultValue={event?.description ?? ""}
                rows={3}
                placeholder="Optional"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="eventDate">Date</Label>
                <Input id="eventDate" name="eventDate" type="date" defaultValue={event?.eventDate ?? ""} required />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="eventTime">Time</Label>
                <Input id="eventTime" name="eventTime" type="time" defaultValue={event?.eventTime ?? ""} />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="category">Category</Label>
              <select id="category" name="category" defaultValue={event?.category ?? "event"} className={selectClass}>
                {(Object.keys(EVENT_CATEGORY_LABELS) as LifeEventCategory[]).map((c) => (
                  <option key={c} value={c}>
                    {EVENT_CATEGORY_LABELS[c]}
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
            <SubmitButton label={isEdit ? "Save changes" : "Add event"} />
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
