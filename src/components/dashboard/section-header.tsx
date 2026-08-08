import { cn } from "@/lib/utils";

export function SectionHeader({
  title,
  description,
  action,
  className,
}: {
  title: string;
  description?: string;
  action?: React.ReactNode;
  className?: string;
}) {
  return (
    <div className={cn("flex items-start justify-between gap-4", className)}>
      <div className="flex flex-col gap-1">
        <h2 className="text-[14.5px] font-medium tracking-tight text-foreground">{title}</h2>
        {description && <p className="text-[12.5px] text-foreground-muted">{description}</p>}
      </div>
      {action}
    </div>
  );
}
