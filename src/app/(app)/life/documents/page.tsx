import { createClient } from "@/lib/supabase/server";
import { getLifeDocuments } from "@/lib/supabase/life-queries";
import { SectionHeader } from "@/components/dashboard/section-header";
import { SupabaseNotice } from "@/components/dashboard/supabase-notice";
import { DocumentList } from "@/components/life/document-list";

function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export default async function DocumentsPage() {
  const configured = isSupabaseConfigured();
  const documents = configured ? await getLifeDocuments(createClient()) : [];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <SectionHeader
        title="Documents"
        description="Resume, contracts, certificates — every important file in one vault."
      />
      {!configured && <SupabaseNotice description="Your documents need a database to save." />}
      <DocumentList documents={documents} />
    </div>
  );
}
