import { cn } from "@/lib/utils";
import { getInitials } from "@/lib/utils";

interface AvatarProps {
  name: string;
  className?: string;
}

function Avatar({ name, className }: AvatarProps) {
  return (
    <div
      className={cn(
        "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-foreground text-[11px] font-medium text-bg",
        className
      )}
    >
      {getInitials(name)}
    </div>
  );
}

export { Avatar };
