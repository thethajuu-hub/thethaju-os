import type { LifeEventCategory, RelationshipType, TripStatus, LifeDocumentCategory } from "@/types";

export const EVENT_CATEGORY_LABELS: Record<LifeEventCategory, string> = {
  event: "Event",
  appointment: "Appointment",
  reminder: "Reminder",
};

export const RELATIONSHIP_TYPE_LABELS: Record<RelationshipType, string> = {
  family: "Family",
  friend: "Friend",
  mentor: "Mentor",
  colleague: "Colleague",
  other: "Other",
};

export const TRIP_STATUS_LABELS: Record<TripStatus, string> = {
  bucket_list: "Bucket list",
  planned: "Planned",
  completed: "Completed",
};

export const TRIP_STATUS_BADGE_VARIANT: Record<TripStatus, "outline" | "accent" | "success"> = {
  bucket_list: "outline",
  planned: "accent",
  completed: "success",
};

export const DOCUMENT_CATEGORY_LABELS: Record<LifeDocumentCategory, string> = {
  resume: "Resume",
  contract: "Contract",
  certificate: "Certificate",
  id: "ID / Passport",
  other: "Other",
};

export function formatShortDate(iso: string): string {
  const d = new Date(`${iso}T00:00:00`);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}
