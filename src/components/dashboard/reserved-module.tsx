import { NAV_MODULES } from "@/lib/navigation";
import { SectionHeader } from "@/components/dashboard/section-header";
import { EmptyState } from "@/components/ui/empty-state";
import { Badge } from "@/components/ui/badge";

/**
 * Every reserved module in the sidebar renders through this component until
 * its own build phase starts. The route already exists and is wired into
 * navigation, auth, and the design system — only the module's real content
 * is missing, by design, per the foundation-only scope of this phase.
 */
export function ReservedModulePage({ href }: { href: string }) {
  const mod = NAV_MODULES.find((m) => m.href === href);
  if (!mod) return null;

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <SectionHeader
        title={mod.label}
        description={mod.description}
        action={<Badge variant="outline">Reserved for a future phase</Badge>}
      />
      <EmptyState
        icon={mod.icon}
        title={`${mod.label} hasn't been built yet`}
        description={`This route, its place in the sidebar, and its design system are ready. ${mod.label} itself ships in its own phase, once the foundation is signed off.`}
      />
    </div>
  );
}
