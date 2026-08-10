import { createClient } from "@/lib/supabase/server";
import { getHabitsWithStreaks } from "@/lib/supabase/life-queries";
import { SectionHeader } from "@/components/dashboard/section-header";
import { SupabaseNotice } from "@/components/dashboard/supabase-notice";
import { HabitList } from "@/components/life/habit-list";

function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export default async function HabitsPage() {
  const configured = isSupabaseConfigured();
  const habits = configured ? await getHabitsWithStreaks(createClient()) : [];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <SectionHeader
        title="Habits"
        description="Reading, deep work, training — every habit worth a streak."
      />
      {!configured && <SupabaseNotice description="Your habits need a database to save." />}
      <HabitList habits={habits} />
    </div>
  );
}
