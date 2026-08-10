import { createClient } from "@/lib/supabase/server";
import { getRelationships } from "@/lib/supabase/life-queries";
import { SectionHeader } from "@/components/dashboard/section-header";
import { SupabaseNotice } from "@/components/dashboard/supabase-notice";
import { RelationshipList } from "@/components/life/relationship-list";

function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export default async function RelationshipsPage() {
  const configured = isSupabaseConfigured();
  const relationships = configured ? await getRelationships(createClient()) : [];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <SectionHeader
        title="Relationships"
        description="Family, friends, mentors — the people worth staying close to."
      />
      {!configured && <SupabaseNotice description="Your relationships need a database to save." />}
      <RelationshipList relationships={relationships} />
    </div>
  );
}
