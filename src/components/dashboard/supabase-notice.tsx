import { AlertTriangle } from "lucide-react";

/** Shown on any data-backed page when Supabase env vars aren't set. */
export function SupabaseNotice({ description }: { description: string }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-warning/25 bg-warning/8 px-4 py-3.5">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" strokeWidth={1.75} />
      <div className="flex flex-col gap-0.5">
        <p className="text-[13px] font-medium text-foreground">Supabase isn&rsquo;t connected</p>
        <p className="text-[12.5px] leading-relaxed text-foreground-muted">
          {description} Add your project URL and anon key to
          <code className="mx-1 rounded bg-surface-elevated px-1 py-0.5 text-[11.5px]">.env.local</code>
          — see the README.
        </p>
      </div>
    </div>
  );
}
