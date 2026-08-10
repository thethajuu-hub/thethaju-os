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
import { saveRelationship } from "@/app/(app)/life/actions";
import { RELATIONSHIP_TYPE_LABELS } from "@/lib/life-labels";
import type { Relationship, RelationshipType } from "@/types";

const selectClass =
  "flex h-10 w-full rounded-md border border-border bg-surface px-3.5 text-[13.5px] text-foreground outline-none transition-colors focus:border-border-strong focus:ring-2 focus:ring-accent/30";

export function RelationshipDialog({
  open,
  onOpenChange,
  relationship,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  relationship?: Relationship;
}) {
  const isEdit = !!relationship;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form
          action={async (formData) => {
            await saveRelationship(formData);
            onOpenChange(false);
          }}
        >
          {isEdit && <input type="hidden" name="id" value={relationship!.id} />}
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit" : "Add"} person</DialogTitle>
            <DialogDescription>Family, friends, mentors — the people worth staying close to.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="name">Name</Label>
              <Input id="name" name="name" defaultValue={relationship?.name ?? ""} required autoFocus />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="relationshipType">Relationship</Label>
              <select
                id="relationshipType"
                name="relationshipType"
                defaultValue={relationship?.relationshipType ?? "friend"}
                className={selectClass}
              >
                {(Object.keys(RELATIONSHIP_TYPE_LABELS) as RelationshipType[]).map((t) => (
                  <option key={t} value={t}>
                    {RELATIONSHIP_TYPE_LABELS[t]}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="lastContactDate">Last contact</Label>
                <Input
                  id="lastContactDate"
                  name="lastContactDate"
                  type="date"
                  defaultValue={relationship?.lastContactDate ?? ""}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <Label htmlFor="followUpDate">Follow up</Label>
                <Input
                  id="followUpDate"
                  name="followUpDate"
                  type="date"
                  defaultValue={relationship?.followUpDate ?? ""}
                />
              </div>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" defaultValue={relationship?.notes ?? ""} rows={3} placeholder="Optional" />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" size="sm">
                Cancel
              </Button>
            </DialogClose>
            <SubmitButton label={isEdit ? "Save changes" : "Add person"} />
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
