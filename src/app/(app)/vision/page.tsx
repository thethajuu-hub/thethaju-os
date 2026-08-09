import { AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getVisionEntries, getAllGoals } from "@/lib/supabase/queries";
import { SectionHeader } from "@/components/dashboard/section-header";
import { VisionStatementCard } from "@/components/dashboard/vision-statement-card";
import { GoalList } from "@/components/dashboard/goal-list";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import type { VisionCategory, GoalTimeframe } from "@/types";

function isSupabaseConfigured() {
  return Boolean(process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);
}

const VISION_CARDS: {
  category: VisionCategory;
  title: string;
  description: string;
  placeholder: string;
}[] = [
  {
    category: "life_vision",
    title: "Life Vision",
    description: "The life you're building, in your own words.",
    placeholder: "Ten years from now, my life looks like…",
  },
  {
    category: "mission",
    title: "Founder Mission",
    description: "Why you're building what you're building.",
    placeholder: "I'm building this because…",
  },
  {
    category: "core_values",
    title: "Core Values",
    description: "The principles you don't compromise on.",
    placeholder: "Discipline. Honesty. Craft. …",
  },
  {
    category: "dream_life",
    title: "Dream Life",
    description: "What it looks like when it's all working.",
    placeholder: "On an ordinary Tuesday, I…",
  },
  {
    category: "long_term_vision",
    title: "Long-Term Vision",
    description: "Where this is all headed, beyond any single goal.",
    placeholder: "In the long run, I want to have…",
  },
];

const GOAL_TABS: { key: GoalTimeframe; label: string }[] = [
  { key: "10yr", label: "10 Year" },
  { key: "5yr", label: "5 Year" },
  { key: "3yr", label: "3 Year" },
  { key: "1yr", label: "1 Year" },
  { key: "quarter", label: "Quarter" },
  { key: "month", label: "Month" },
  { key: "week", label: "Week" },
];

export default async function VisionPage() {
  const configured = isSupabaseConfigured();
  const data = configured ? await loadVisionData() : null;

  return (
    <div className="flex flex-col gap-8 animate-fade-in">
      <SectionHeader
        title="Vision"
        description="Where you're going, and the ladder of goals that gets you there."
      />

      {!configured && (
        <div className="flex items-start gap-3 rounded-lg border border-warning/25 bg-warning/8 px-4 py-3.5">
          <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" strokeWidth={1.75} />
          <div className="flex flex-col gap-0.5">
            <p className="text-[13px] font-medium text-foreground">Supabase isn&rsquo;t connected</p>
            <p className="text-[12.5px] leading-relaxed text-foreground-muted">
              Vision statements and goals need a database to save. Add your project URL and anon key to
              <code className="mx-1 rounded bg-surface-elevated px-1 py-0.5 text-[11.5px]">.env.local</code>
              — see the README.
            </p>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {VISION_CARDS.map((card) => (
          <VisionStatementCard
            key={card.category}
            category={card.category}
            title={card.title}
            description={card.description}
            placeholder={card.placeholder}
            content={data?.vision[card.category]?.content ?? ""}
          />
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Goal ladder</CardTitle>
          <CardDescription>
            10-year down to this week — each rung a step toward the last. Today&rsquo;s tasks live on
            Command Center; this year&rsquo;s revenue target lives in Mission Control.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="10yr">
            <TabsList className="h-auto flex-wrap">
              {GOAL_TABS.map((tab) => (
                <TabsTrigger key={tab.key} value={tab.key}>
                  {tab.label}
                </TabsTrigger>
              ))}
            </TabsList>
            {GOAL_TABS.map((tab) => (
              <TabsContent key={tab.key} value={tab.key}>
                <GoalList timeframe={tab.key} goals={data?.goals[tab.key] ?? []} />
              </TabsContent>
            ))}
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
}

async function loadVisionData() {
  const supabase = createClient();
  const [vision, goals] = await Promise.all([getVisionEntries(supabase), getAllGoals(supabase)]);
  return { vision, goals };
}
