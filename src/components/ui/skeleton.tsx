import { cn } from "@/lib/utils";

/** Shimmering placeholder for content that is still loading. */
function Skeleton({ className, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "skeleton-shimmer animate-shimmer rounded-md bg-surface-hover",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };
