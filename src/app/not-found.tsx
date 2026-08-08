import Link from "next/link";
import { Compass } from "lucide-react";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-bg px-6 text-center">
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-border bg-surface-elevated">
        <Compass className="h-[18px] w-[18px] text-foreground-subtle" strokeWidth={1.75} />
      </div>
      <div className="flex flex-col gap-1.5">
        <p className="text-[15px] font-medium text-foreground">Page not found</p>
        <p className="max-w-sm text-[13px] text-foreground-muted">
          The page you&rsquo;re looking for doesn&rsquo;t exist, or hasn&rsquo;t been built yet.
        </p>
      </div>
      <Button asChild size="sm" variant="secondary">
        <Link href="/command-center">Back to Command Center</Link>
      </Button>
    </div>
  );
}
