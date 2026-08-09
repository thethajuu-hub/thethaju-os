import { AlertTriangle, BookOpen, Lightbulb, GraduationCap, Flame } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import {
  getAllTasks,
  getRevenueTargets,
  getRevenueAchieved,
  getRevenueBySourceThisMonth,
} from "@/lib/supabase/queries";
import { greetingForHour } from "@/lib/dates";
import { SectionHeader } from "@/components/dashboard/section-header";
import { MissionControl } from "@/components/dashboard/mission-control";
import { PriorityList } from "@/components/dashboard/priority-list";
import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/ui/empty-state";

function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

export default async function CommandCenterPage() {
  const configured = isSupabaseConfigured();
  const greeting = greetingForHour(new Date().getHours());
  const dateLabel = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
  });

  const data = configured ? await loadCommandCenterData() : null;

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <SectionHeader title={`${greeting}.`} description={dateLabel} />

      {!configured && (
        <div className="flex items-start gap-3 rounded-lg border border-warning/25 bg-warning/8 px-4 py-3.5">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" strokeWidth={1.75} />
          <div className="flex flex-col gap-0.5">
            <p className="text-[13px] font-medium text-foreground">Supabase isn&rsquo;t connected</p>
            <p className="text-[12.5px] leading-relaxed text-foreground-muted">
              Tasks and Mission Control need a database to work. Add your project URL and anon key to
              <code className="mx-1 rounded bg-surface-elevated px-1 py-0.5 text-[11.5px]">.env.local</code>
              — see the README.
            </p>
          </div>
        </div>
      )}

      <MissionControl
        targets={data?.targets ?? { week: 0, month: 0, year: 0 }}
        achieved={data?.achieved ?? { week: 0, month: 0, year: 0 }}
        bySource={data?.bySource ?? { agency: 0, dropshipping: 0, other: 0 }}
      />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <PriorityList title="Today" timeframe="today" tasks={data?.tasks.today ?? []} />
        <PriorityList title="This week" timeframe="week" tasks={data?.tasks.week ?? []} />
        <PriorityList title="This month" timeframe="month" tasks={data?.tasks.month ?? []} />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatCard label="Learning streak" value="0 days" icon={Flame} hint="starts today" />
        <StatCard label="Courses in progress" value="0" icon={GraduationCap} />
        <StatCard label="Ideas captured" value="0" icon={Lightbulb} />
        <StatCard label="Journal entries" value="0" icon={BookOpen} />
      </div>

      <div className="flex flex-col gap-3">
        <SectionHeader title="Recent activity" />
        <EmptyState
          icon={BookOpen}
          title="Nothing logged yet"
          description="As modules come online — Business Portfolio, Journal, Learning Hub — their activity will surface here automatically."
        />
      </div>
    </div>
  );
}

async function loadCommandCenterData() {
  const supabase = createClient();
  const [tasks, targets, achieved, bySource] = await Promise.all([
    getAllTasks(supabase),
    getRevenueTargets(supabase),
    getRevenueAchieved(supabase),
    getRevenueBySourceThisMonth(supabase),
  ]);
  return { tasks, targets, achieved, bySource };
}
