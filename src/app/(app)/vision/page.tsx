import { AlertTriangle } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { getVisionEntries, getAllGoals, getAllGoalsFlat } from "@/lib/supabase/queries";
import { SectionHeader } from "@/components/dashboard/section-header";
import { VisionStatementCard } from "@/components/dashboard/vision-statement-card";
import { GoalList } from "@/components/dashboard/goal-list";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { TIMEFRAME_LABELS, TIMEFRAME_ORDER } from "@/lib/goal-labels";
import type { VisionCategory } from "@/types";

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
    category: "dreams_future_vision",
    title: "Dreams / Future Vision",
    description: "What it looks like when it's all working, and where it's all headed.",
    placeholder: "On an ordinary Tuesday, years from now, I…",
  },
];

export default async function VisionPage() {
  const configured = isSupabaseConfigured();
  const data = configured ? await loadVisionData() : null;
  const allGoalsFlat = data?.allGoalsFlat ?? [];

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
            Command Center; weekly goals appear there too, as a preview.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="10yr">
            <TabsList className="h-auto flex-wrap">
              {TIMEFRAME_ORDER.map((tf) => (
                <TabsTrigger key={tf} value={tf}>
                  {TIMEFRAME_LABELS[tf]}
                </TabsTrigger>
              ))}
            </TabsList>
            {TIMEFRAME_ORDER.map((tf) => (
              <TabsContent key={tf} value={tf}>
                <GoalList timeframe={tf} goals={data?.goals[tf] ?? []} allGoals={allGoalsFlat} />
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
  const [vision, goals, allGoalsFlat] = await Promise.all([
    getVisionEntries(supabase),
    getAllGoals(supabase),
    getAllGoalsFlat(supabase),
  ]);
  return { vision, goals, allGoalsFlat };
}
