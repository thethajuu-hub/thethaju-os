import { createClient } from "@/lib/supabase/server";
import { getLifeEvents } from "@/lib/supabase/life-queries";
import { SectionHeader } from "@/components/dashboard/section-header";
import { SupabaseNotice } from "@/components/dashboard/supabase-notice";
import { EventList } from "@/components/life/event-list";

function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export default async function PlannerPage() {
  const configured = isSupabaseConfigured();
  const events = configured ? await getLifeEvents(createClient()) : [];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <SectionHeader
        title="Planner"
        description="Daily, weekly, and monthly planning — events, appointments, and reminders in one place."
      />
      {!configured && <SupabaseNotice description="Your planner events need a database to save." />}
      <EventList events={events} />
    </div>
  );
}
