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
import { saveLifeDocument } from "@/app/(app)/life/actions";
import { DOCUMENT_CATEGORY_LABELS } from "@/lib/life-labels";
import type { LifeDocument, LifeDocumentCategory } from "@/types";

const selectClass =
  "flex h-10 w-full rounded-md border border-border bg-surface px-3.5 text-[13.5px] text-foreground outline-none transition-colors focus:border-border-strong focus:ring-2 focus:ring-accent/30";

export function DocumentDialog({
  open,
  onOpenChange,
  document,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  document?: LifeDocument;
}) {
  const isEdit = !!document;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <form
          action={async (formData) => {
            await saveLifeDocument(formData);
            onOpenChange(false);
          }}
        >
          {isEdit && <input type="hidden" name="id" value={document!.id} />}
          <DialogHeader>
            <DialogTitle>{isEdit ? "Edit" : "Add"} document</DialogTitle>
            <DialogDescription>Resume, contracts, certificates — tracked, not stored as files here.</DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="title">Title</Label>
              <Input id="title" name="title" defaultValue={document?.title ?? ""} required autoFocus />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="category">Category</Label>
              <select id="category" name="category" defaultValue={document?.category ?? "other"} className={selectClass}>
                {(Object.keys(DOCUMENT_CATEGORY_LABELS) as LifeDocumentCategory[]).map((c) => (
                  <option key={c} value={c}>
                    {DOCUMENT_CATEGORY_LABELS[c]}
                  </option>
                ))}
              </select>
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="referenceUrl">Link (optional)</Label>
              <Input
                id="referenceUrl"
                name="referenceUrl"
                type="url"
                defaultValue={document?.referenceUrl ?? ""}
                placeholder="https://…"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="expiryDate">Expiry date (optional)</Label>
              <Input id="expiryDate" name="expiryDate" type="date" defaultValue={document?.expiryDate ?? ""} />
            </div>
            <div className="flex flex-col gap-1.5">
              <Label htmlFor="notes">Notes</Label>
              <Textarea id="notes" name="notes" defaultValue={document?.notes ?? ""} rows={2} placeholder="Optional" />
            </div>
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary" size="sm">
                Cancel
              </Button>
            </DialogClose>
            <SubmitButton label={isEdit ? "Save changes" : "Add document"} />
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
