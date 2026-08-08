"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ErrorStateProps {
  title?: string;
  description?: string;
  onRetry?: () => void;
  className?: string;
}

/** The interface's own voice: state what happened, offer the way out. No apologies. */
function ErrorState({
  title = "This section couldn't load",
  description = "Something interrupted the request. Try again, or come back in a moment.",
  onRetry,
  className,
}: ErrorStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-4 rounded-lg border border-border bg-surface px-6 py-16 text-center",
        className
      )}
    >
      <div className="flex h-11 w-11 items-center justify-center rounded-full border border-danger/20 bg-danger/8">
        <AlertTriangle className="h-[18px] w-[18px] text-danger" strokeWidth={1.75} />
      </div>
      <div className="flex max-w-sm flex-col gap-1.5">
        <p className="text-[14px] font-medium text-foreground">{title}</p>
        <p className="text-[13px] leading-relaxed text-foreground-muted">{description}</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          Try again
        </Button>
      )}
    </div>
  );
}

export { ErrorState };
