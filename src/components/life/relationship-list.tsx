"use client";

import * as React from "react";
import { useTransition } from "react";
import { Plus, Pencil, X, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { RelationshipDialog } from "@/components/life/relationship-dialog";
import { deleteRelationship } from "@/app/(app)/life/actions";
import { RELATIONSHIP_TYPE_LABELS, formatShortDate } from "@/lib/life-labels";
import { cn } from "@/lib/utils";
import type { Relationship } from "@/types";

export function RelationshipList({ relationships }: { relationships: Relationship[] }) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Relationship | undefined>(undefined);

  const openCreate = () => {
    setEditing(undefined);
    setDialogOpen(true);
  };
  const openEdit = (r: Relationship) => {
    setEditing(r);
    setDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end">
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-3.5 w-3.5" />
          Add person
        </Button>
      </div>

      {relationships.length === 0 ? (
        <EmptyState
          icon={Users}
          title="No one added yet"
          description="Add family, friends, and mentors to keep track of who to stay close to."
        />
      ) : (
        <div className="flex flex-col gap-1.5">
          {relationships.map((r) => (
            <RelationshipRow key={r.id} relationship={r} onEdit={() => openEdit(r)} />
          ))}
        </div>
      )}

      <RelationshipDialog open={dialogOpen} onOpenChange={setDialogOpen} relationship={editing} />
    </div>
  );
}

function RelationshipRow({ relationship, onEdit }: { relationship: Relationship; onEdit: () => void }) {
  const [pending, startTransition] = useTransition();
  const overdue =
    relationship.followUpDate && new Date(relationship.followUpDate) < new Date(new Date().toDateString());

  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-md border border-border px-3.5 py-2.5 transition-colors hover:border-border-strong",
        pending && "opacity-40"
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-[13px] font-medium text-foreground">{relationship.name}</span>
          <Badge variant="outline">{RELATIONSHIP_TYPE_LABELS[relationship.relationshipType]}</Badge>
        </div>
        <div className="flex flex-wrap gap-x-3 text-[11.5px] text-foreground-subtle">
          {relationship.lastContactDate && <span>Last contact {formatShortDate(relationship.lastContactDate)}</span>}
          {relationship.followUpDate && (
            <span className={cn(overdue && "font-medium text-danger")}>
              Follow up {formatShortDate(relationship.followUpDate)}
            </span>
          )}
        </div>
      </div>
      <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
        <IconButton label="Edit" onClick={onEdit}>
          <Pencil className="h-3.5 w-3.5" />
        </IconButton>
        <IconButton label="Delete" onClick={() => startTransition(() => deleteRelationship(relationship.id))}>
          <X className="h-3.5 w-3.5" />
        </IconButton>
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
