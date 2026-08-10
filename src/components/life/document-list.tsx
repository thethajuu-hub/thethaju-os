"use client";

import * as React from "react";
import { useTransition } from "react";
import { Plus, Pencil, X, FileText, ExternalLink } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { DocumentDialog } from "@/components/life/document-dialog";
import { deleteLifeDocument } from "@/app/(app)/life/actions";
import { DOCUMENT_CATEGORY_LABELS, formatShortDate } from "@/lib/life-labels";
import { cn } from "@/lib/utils";
import type { LifeDocument } from "@/types";

export function DocumentList({ documents }: { documents: LifeDocument[] }) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<LifeDocument | undefined>(undefined);

  const openCreate = () => {
    setEditing(undefined);
    setDialogOpen(true);
  };
  const openEdit = (d: LifeDocument) => {
    setEditing(d);
    setDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end">
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-3.5 w-3.5" />
          Add document
        </Button>
      </div>

      {documents.length === 0 ? (
        <EmptyState
          icon={FileText}
          title="No documents tracked yet"
          description="Add your resume, contracts, and certificates to keep them all in one vault."
        />
      ) : (
        <div className="flex flex-col gap-1.5">
          {documents.map((d) => (
            <DocumentRow key={d.id} document={d} onEdit={() => openEdit(d)} />
          ))}
        </div>
      )}

      <DocumentDialog open={dialogOpen} onOpenChange={setDialogOpen} document={editing} />
    </div>
  );
}

function DocumentRow({ document, onEdit }: { document: LifeDocument; onEdit: () => void }) {
  const [pending, startTransition] = useTransition();
  const expiringSoon =
    document.expiryDate &&
    new Date(document.expiryDate) < new Date(Date.now() + 30 * 24 * 60 * 60 * 1000);
  const expired = document.expiryDate && new Date(document.expiryDate) < new Date(new Date().toDateString());

  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-md border border-border px-3.5 py-2.5 transition-colors hover:border-border-strong",
        pending && "opacity-40"
      )}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-[13px] font-medium text-foreground">{document.title}</span>
          <Badge variant="outline">{DOCUMENT_CATEGORY_LABELS[document.category]}</Badge>
          {document.referenceUrl && (
            <a
              href={document.referenceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-foreground-subtle transition-colors hover:text-foreground-muted"
              aria-label="Open link"
            >
              <ExternalLink className="h-3 w-3" />
            </a>
          )}
        </div>
        {document.expiryDate && (
          <span className={cn("text-[11.5px] text-foreground-subtle", (expired || expiringSoon) && "font-medium text-danger")}>
            {expired ? "Expired " : "Expires "}
            {formatShortDate(document.expiryDate)}
          </span>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
        <IconButton label="Edit" onClick={onEdit}>
          <Pencil className="h-3.5 w-3.5" />
        </IconButton>
        <IconButton label="Delete" onClick={() => startTransition(() => deleteLifeDocument(document.id))}>
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
