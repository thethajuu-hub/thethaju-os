"use client";

import { TooltipProvider as RadixTooltipProvider } from "@/components/ui/tooltip";

export function AppTooltipProvider({ children }: { children: React.ReactNode }) {
  return (
    <RadixTooltipProvider delayDuration={300} skipDelayDuration={100}>
      {children}
    </RadixTooltipProvider>
  );
}
