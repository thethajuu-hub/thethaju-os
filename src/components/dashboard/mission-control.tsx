import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { formatCurrency, cn } from "@/lib/utils";
import type { RevenueTarget } from "@/types";

const DAILY_TARGETS: RevenueTarget[] = [
  { label: "Agency", target: 2000, current: 0 },
  { label: "Dropshipping", target: 1000, current: 0 },
];

const HORIZON_TARGETS: { label: string; target: RevenueTarget }[] = [
  { label: "This week", target: { label: "Weekly", target: 21000, current: 0 } },
  { label: "This month", target: { label: "Monthly", target: 90000, current: 0 } },
  { label: "This year", target: { label: "Yearly", target: 1080000, current: 0 } },
];

/**
 * Mission Control shows the founder's targets at every horizon. Figures are
 * wired to zero on purpose — this is the foundation phase, before Business
 * Portfolio and Personal Finance exist to feed it real numbers.
 */
export function MissionControl() {
  const totalTarget = DAILY_TARGETS.reduce((sum, t) => sum + t.target, 0);
  const totalCurrent = DAILY_TARGETS.reduce((sum, t) => sum + t.current, 0);
  const remaining = totalTarget - totalCurrent;

  return (
    <Card>
      <CardHeader className="flex-row items-start justify-between space-y-0">
        <div className="flex flex-col gap-1">
          <CardTitle>Mission Control</CardTitle>
          <CardDescription>Today&rsquo;s revenue target, and where every horizon stands.</CardDescription>
        </div>
        <Badge variant="accent">Live</Badge>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 rounded-md border border-border bg-bg/40 p-4">
          <div className="flex items-baseline justify-between">
            <span className="text-[12.5px] text-foreground-muted">Today&rsquo;s total target</span>
            <span className="font-mono text-[13px] text-foreground-subtle">
              {formatCurrency(totalCurrent)} / {formatCurrency(totalTarget)}
            </span>
          </div>
          <Progress value={(totalCurrent / totalTarget) * 100} />
          <p className="text-[12px] text-foreground-subtle">
            {formatCurrency(remaining)} remaining today
          </p>
        </div>

        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          {DAILY_TARGETS.map((t) => (
            <div key={t.label} className="flex flex-col gap-2 rounded-md border border-border p-3.5">
              <div className="flex items-center justify-between">
                <span className="text-[12.5px] font-medium text-foreground">{t.label}</span>
                <span className="font-mono text-[12px] text-foreground-subtle">
                  {formatCurrency(t.current)} / {formatCurrency(t.target)}
                </span>
              </div>
              <Progress value={(t.current / t.target) * 100} barClassName="bg-accent" />
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-3 border-t border-border pt-5 sm:grid-cols-3">
          {HORIZON_TARGETS.map(({ label, target }) => (
            <div key={label} className="flex flex-col gap-1.5">
              <span className="text-[11.5px] uppercase tracking-wide text-foreground-subtle">
                {label}
              </span>
              <span className="font-mono text-[15px] font-medium text-foreground">
                {formatCurrency(target.current)}
              </span>
              <span className="text-[11.5px] text-foreground-subtle">
                of {formatCurrency(target.target)} goal
              </span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
