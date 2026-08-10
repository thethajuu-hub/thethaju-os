"use client";

import * as React from "react";
import { useTransition } from "react";
import { Plus, Pencil, X, Plane } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { TripDialog } from "@/components/life/trip-dialog";
import { deleteTrip } from "@/app/(app)/life/actions";
import { TRIP_STATUS_LABELS, TRIP_STATUS_BADGE_VARIANT, formatShortDate } from "@/lib/life-labels";
import type { Trip } from "@/types";

export function TripList({ trips }: { trips: Trip[] }) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<Trip | undefined>(undefined);

  const openCreate = () => {
    setEditing(undefined);
    setDialogOpen(true);
  };
  const openEdit = (t: Trip) => {
    setEditing(t);
    setDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-end">
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-3.5 w-3.5" />
          Add trip
        </Button>
      </div>

      {trips.length === 0 ? (
        <EmptyState
          icon={Plane}
          title="No trips yet"
          description="Add a destination — planned, or just on the bucket list."
        />
      ) : (
        <div className="flex flex-col gap-1.5">
          {trips.map((t) => (
            <TripRow key={t.id} trip={t} onEdit={() => openEdit(t)} />
          ))}
        </div>
      )}

      <TripDialog open={dialogOpen} onOpenChange={setDialogOpen} trip={editing} />
    </div>
  );
}

function TripRow({ trip, onEdit }: { trip: Trip; onEdit: () => void }) {
  const [pending, startTransition] = useTransition();

  return (
    <div
      className={`group flex items-center gap-3 rounded-md border border-border px-3.5 py-2.5 transition-colors hover:border-border-strong ${pending ? "opacity-40" : ""}`}
    >
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-[13px] font-medium text-foreground">{trip.destination}</span>
          <Badge variant={TRIP_STATUS_BADGE_VARIANT[trip.status]}>{TRIP_STATUS_LABELS[trip.status]}</Badge>
        </div>
        {(trip.startDate || trip.endDate) && (
          <span className="text-[11.5px] text-foreground-subtle">
            {trip.startDate ? formatShortDate(trip.startDate) : "—"}
            {trip.endDate ? ` – ${formatShortDate(trip.endDate)}` : ""}
          </span>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
        <IconButton label="Edit" onClick={onEdit}>
          <Pencil className="h-3.5 w-3.5" />
        </IconButton>
        <IconButton label="Delete" onClick={() => startTransition(() => deleteTrip(trip.id))}>
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
