"use client";

import * as React from "react";
import { useTransition } from "react";
import { Plus, Pencil, X, Clock, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { EventDialog } from "@/components/life/event-dialog";
import { deleteLifeEvent } from "@/app/(app)/life/actions";
import { EVENT_CATEGORY_LABELS, formatShortDate } from "@/lib/life-labels";
import { todayISO } from "@/lib/dates";
import { cn } from "@/lib/utils";
import type { LifeEvent } from "@/types";

export function EventList({ events }: { events: LifeEvent[] }) {
  const [dialogOpen, setDialogOpen] = React.useState(false);
  const [editing, setEditing] = React.useState<LifeEvent | undefined>(undefined);

  const today = todayISO();
  const upcoming = events.filter((e) => e.eventDate >= today);
  const past = events.filter((e) => e.eventDate < today);

  const openCreate = () => {
    setEditing(undefined);
    setDialogOpen(true);
  };
  const openEdit = (event: LifeEvent) => {
    setEditing(event);
    setDialogOpen(true);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-end">
        <Button size="sm" onClick={openCreate}>
          <Plus className="h-3.5 w-3.5" />
          Add event
        </Button>
      </div>

      {events.length === 0 ? (
        <EmptyState
          icon={CalendarDays}
          title="Nothing on the calendar"
          description="Add an event, appointment, or reminder to get started."
        />
      ) : (
        <div className="flex flex-col gap-6">
          <EventGroup title="Upcoming" events={upcoming} onEdit={openEdit} />
          {past.length > 0 && <EventGroup title="Past" events={past} onEdit={openEdit} muted />}
        </div>
      )}

      <EventDialog open={dialogOpen} onOpenChange={setDialogOpen} event={editing} />
    </div>
  );
}

function EventGroup({
  title,
  events,
  onEdit,
  muted,
}: {
  title: string;
  events: LifeEvent[];
  onEdit: (event: LifeEvent) => void;
  muted?: boolean;
}) {
  if (events.length === 0) return null;
  return (
    <div className="flex flex-col gap-2">
      <p className="text-[12px] font-medium text-foreground-subtle">{title}</p>
      <div className="flex flex-col gap-1.5">
        {events.map((event) => (
          <EventRow key={event.id} event={event} onEdit={() => onEdit(event)} muted={muted} />
        ))}
      </div>
    </div>
  );
}

function EventRow({ event, onEdit, muted }: { event: LifeEvent; onEdit: () => void; muted?: boolean }) {
  const [pending, startTransition] = useTransition();

  return (
    <div
      className={cn(
        "group flex items-center gap-3 rounded-md border border-border px-3.5 py-2.5 transition-colors hover:border-border-strong",
        muted && "opacity-60",
        pending && "opacity-40"
      )}
    >
      <div className="flex w-20 shrink-0 flex-col">
        <span className="text-[12.5px] font-medium text-foreground">{formatShortDate(event.eventDate)}</span>
        {event.eventTime && (
          <span className="flex items-center gap-1 text-[11px] text-foreground-subtle">
            <Clock className="h-2.5 w-2.5" />
            {event.eventTime.slice(0, 5)}
          </span>
        )}
      </div>
      <div className="flex min-w-0 flex-1 flex-col gap-0.5">
        <div className="flex items-center gap-1.5">
          <span className="truncate text-[13px] font-medium text-foreground">{event.title}</span>
          <Badge variant="outline">{EVENT_CATEGORY_LABELS[event.category]}</Badge>
        </div>
        {event.description && (
          <p className="truncate text-[12px] text-foreground-muted">{event.description}</p>
        )}
      </div>
      <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100">
        <IconButton label="Edit" onClick={onEdit}>
          <Pencil className="h-3.5 w-3.5" />
        </IconButton>
        <IconButton label="Delete" onClick={() => startTransition(() => deleteLifeEvent(event.id))}>
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
