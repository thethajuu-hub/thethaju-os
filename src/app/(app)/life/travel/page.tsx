import { createClient } from "@/lib/supabase/server";
import { getTrips } from "@/lib/supabase/life-queries";
import { SectionHeader } from "@/components/dashboard/section-header";
import { SupabaseNotice } from "@/components/dashboard/supabase-notice";
import { TripList } from "@/components/life/trip-list";

function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export default async function TravelPage() {
  const configured = isSupabaseConfigured();
  const trips = configured ? await getTrips(createClient()) : [];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <SectionHeader
        title="Travel"
        description="Trips, the bucket list, and the destinations still ahead of you."
      />
      {!configured && <SupabaseNotice description="Your trips need a database to save." />}
      <TripList trips={trips} />
    </div>
  );
}
