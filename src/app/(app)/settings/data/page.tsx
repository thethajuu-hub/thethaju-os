import { DatabaseBackup, Download, ShieldCheck } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

const ROWS = [
  {
    icon: Download,
    label: "Export your data",
    description: "Download everything you've stored as a portable archive.",
    action: "Export",
  },
  {
    icon: DatabaseBackup,
    label: "Backups",
    description: "Automatic backups will run once business data starts flowing in.",
    action: "Configure",
  },
  {
    icon: ShieldCheck,
    label: "Privacy",
    description: "This workspace is private by default — single account, no external users.",
    action: "Review",
  },
];

export default function DataSettingsPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Data & Backup</CardTitle>
        <CardDescription>Export, backup, and privacy — wired up as modules come online.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col">
        {ROWS.map((row, i) => (
          <div key={row.label}>
            <div className="flex items-center justify-between gap-4 py-3.5">
              <div className="flex items-start gap-3">
                <row.icon className="mt-0.5 h-4 w-4 text-foreground-subtle" strokeWidth={1.75} />
                <div className="flex flex-col gap-0.5">
                  <span className="text-[13px] font-medium text-foreground">{row.label}</span>
                  <span className="text-[12px] text-foreground-subtle">{row.description}</span>
                </div>
              </div>
              <Button variant="secondary" size="sm" disabled>
                {row.action}
              </Button>
            </div>
            {i < ROWS.length - 1 && <Separator />}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
