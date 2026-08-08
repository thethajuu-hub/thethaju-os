import { BookOpen, Lightbulb, GraduationCap, Flame } from "lucide-react";
import { SectionHeader } from "@/components/dashboard/section-header";
import { MissionControl } from "@/components/dashboard/mission-control";
import { PriorityList } from "@/components/dashboard/priority-list";
import { StatCard } from "@/components/dashboard/stat-card";
import { EmptyState } from "@/components/ui/empty-state";

export default function CommandCenterPage() {
  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <SectionHeader
        title="Good to see you back."
        description="Here's where everything stands this morning."
      />

      <MissionControl />

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        <PriorityList
          title="Today"
          seed={[
            { label: "Ship the Founder OS foundation", done: false, timeframe: "today" },
            { label: "Review agency pipeline", done: false, timeframe: "today" },
            { label: "30 min deep work — learning", done: false, timeframe: "today" },
          ]}
        />
        <PriorityList
          title="This week"
          seed={[
            { label: "Close out foundation phase", done: false, timeframe: "week" },
            { label: "Plan Business Portfolio module", done: false, timeframe: "week" },
          ]}
        />
        <PriorityList
          title="This month"
          seed={[
            { label: "Hit monthly revenue target", done: false, timeframe: "month" },
            { label: "Finish current course module", done: false, timeframe: "month" },
          ]}
        />
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
