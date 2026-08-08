import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";

const ROWS = [
  { label: "Daily priority reminder", description: "A quiet nudge each morning to review today's priorities." },
  { label: "Weekly review prompt", description: "A prompt every Sunday to run your weekly review." },
  { label: "Goal deadline alerts", description: "A heads-up when a goal's deadline is approaching." },
];

export default function NotificationsSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Reserved for when Life Planner and Vision & Goals go live — nothing to send yet.
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col">
        {ROWS.map((row, i) => (
          <div key={row.label}>
            <div className="flex items-center justify-between gap-4 py-3.5">
              <div className="flex flex-col gap-0.5">
                <span className="text-[13px] font-medium text-foreground">{row.label}</span>
                <span className="text-[12px] text-foreground-subtle">{row.description}</span>
              </div>
              <Switch disabled />
            </div>
            {i < ROWS.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
