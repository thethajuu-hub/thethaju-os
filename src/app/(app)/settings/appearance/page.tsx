"use client";

import { useTheme } from "next-themes";
import * as React from "react";
import { Check, Sun, Moon, Monitor } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { cn } from "@/lib/utils";

const THEMES = [
  { value: "light", label: "Light", icon: Sun },
  { value: "dark", label: "Dark", icon: Moon },
  { value: "system", label: "System", icon: Monitor },
] as const;

export default function AppearanceSettingsPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = React.useState(false);
  React.useEffect(() => setMounted(true), []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Appearance</CardTitle>
        <CardDescription>
          Monochrome, by design — light and dark share the same restraint.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
          {THEMES.map(({ value, label, icon: Icon }) => {
            const active = mounted && theme === value;
            return (
              <button
                key={value}
                onClick={() => setTheme(value)}
                className={cn(
                  "flex flex-col items-center gap-2.5 rounded-lg border p-4 text-center transition-colors",
                  active
                    ? "border-foreground bg-surface-hover"
                    : "border-border hover:border-border-strong hover:bg-surface-hover"
                )}
              >
                <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface">
                  <Icon className="h-4 w-4 text-foreground-muted" strokeWidth={1.75} />
                </div>
                <span className="flex items-center gap-1.5 text-[13px] font-medium text-foreground">
                  {label}
                  {active && <Check className="h-3.5 w-3.5" />}
                </span>
              </button>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
