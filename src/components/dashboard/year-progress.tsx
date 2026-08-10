import { Card, CardHeader, CardTitle } from "@/components/ui/card";

const RADIUS = 58;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export function YearProgress({ target, achieved }: { target: number; achieved: number }) {
  const pct = target > 0 ? Math.min(100, Math.round((achieved / target) * 100)) : 0;
  const offset = CIRCUMFERENCE - (CIRCUMFERENCE * pct) / 100;
  const year = new Date().getFullYear();

  return (
    <Card className="flex flex-col p-6">
      <CardHeader className="flex-row items-center justify-between space-y-0 p-0 pb-1">
        <CardTitle className="text-[15.5px] font-bold">Year progress</CardTitle>
        <span className="rounded-full bg-surface-elevated px-2.5 py-1 text-[11px] font-semibold text-foreground-muted">
          {year}
        </span>
      </CardHeader>

      <div className="flex flex-col items-center justify-center pt-1">
        <div className="relative flex items-center justify-center">
          <svg width="140" height="140" viewBox="0 0 140 140">
            <circle cx="70" cy="70" r={RADIUS} fill="none" stroke="hsl(var(--border))" strokeWidth="14" />
            <circle
              cx="70"
              cy="70"
              r={RADIUS}
              fill="none"
              stroke="#0356C5"
              strokeWidth="14"
              strokeLinecap="round"
              strokeDasharray={CIRCUMFERENCE}
              strokeDashoffset={offset}
              transform="rotate(-90 70 70)"
              className="transition-[stroke-dashoffset] duration-500 ease-out"
            />
          </svg>
          <span className="absolute text-[26px] font-bold tracking-tight text-accent">{pct}%</span>
        </div>
        <p className="mt-1 text-center text-[11px] text-foreground-subtle">of yearly target reached</p>
      </div>

      <div className="mt-4 flex justify-center gap-3.5">
        <span className="flex items-center text-[11.5px] text-foreground-muted">
          <i className="mr-1.5 inline-block h-[7px] w-[7px] rounded-full bg-[#0356C5]" />
          Revenue
        </span>
        <span className="flex items-center text-[11.5px] text-foreground-muted">
          <i className="mr-1.5 inline-block h-[7px] w-[7px] rounded-full bg-border" />
          Remaining
        </span>
      </div>
    </Card>
  );
}
