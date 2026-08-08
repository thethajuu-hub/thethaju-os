import { findNavItem } from "@/lib/navigation";
import { SectionHeader } from "@/components/dashboard/section-header";
import { EmptyState } from "@/components/ui/empty-state";

/** Internal tab preview shown only for the two named future businesses. */
const INTERNAL_PREVIEW: Record<string, string[]> = {
  "/business/agency": ["Overview", "Revenue", "Clients", "Projects", "Expenses", "Growth"],
  "/business/dropshipping": [
    "Overview",
    "Sales",
    "Products",
    "Marketing",
    "Inventory",
    "Analytics",
    "Learning",
  ],
};

/**
 * Every reserved leaf route renders through this component until its own
 * build phase starts. The route already exists and is wired into
 * navigation, auth, and the design system — only the module's real content
 * is missing, by design, per the foundation-only scope of this phase.
 */
export function ReservedModulePage({ href }: { href: string }) {
  const item = findNavItem(href);
  if (!item) return null;

  const preview = INTERNAL_PREVIEW[href];

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      <SectionHeader title={item.label} description={item.description} />
      <EmptyState
        icon={item.icon}
        title={`${item.label} hasn't been built yet`}
        description="This route, its place in the sidebar, and its design system are ready. The module itself ships in its own phase, once the foundation is signed off."
      />
      {preview && (
        <div className="rounded-lg border border-dashed border-border p-5">
          <p className="mb-3 text-[12px] font-medium text-foreground-subtle">
            Planned inside {item.label}
          </p>
          <div className="flex flex-wrap gap-2">
            {preview.map((tab) => (
              <span
                key={tab}
                className="rounded-md border border-border bg-bg px-2.5 py-1 text-[12px] text-foreground-muted"
              >
                {tab}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
