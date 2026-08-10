import { createClient } from "@/lib/supabase/server";
import { getHealthLogs } from "@/lib/supabase/life-queries";
import { SectionHeader } from "@/components/dashboard/section-header";
import { SupabaseNotice } from "@/components/dashboard/supabase-notice";
import { HealthLogSection } from "@/components/life/health-log-section";

function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export default async function HealthPage() {
  const configured = isSupabaseConfigured();
  const logs = configured ? await getHealthLogs(createClient()) : [];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <SectionHeader
        title="Health"
        description="Sleep, energy, movement — the metrics that keep you operating well."
      />
      {!configured && <SupabaseNotice description="Your health log needs a database to save." />}
      <HealthLogSection logs={logs} />
    </div>
  );
}
