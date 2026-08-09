import type { Metadata } from "next";
// Self-hosted fonts — installed from npm, never fetched from a Google CDN at
// build time. Keeps `next build` fully offline-safe (CI, air-gapped, corporate
// networks that block fonts.googleapis.com all still work).
import "@fontsource/plus-jakarta-sans/400.css";
import "@fontsource/plus-jakarta-sans/500.css";
import "@fontsource/plus-jakarta-sans/600.css";
import "@fontsource/plus-jakarta-sans/700.css";
import "@fontsource/plus-jakarta-sans/800.css";
import "@fontsource/jetbrains-mono/400.css";
import "@fontsource/jetbrains-mono/500.css";
import "@/app/globals.css";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { AppTooltipProvider } from "@/components/providers/tooltip-provider";
import { cn } from "@/lib/utils";

export const metadata: Metadata = {
  title: "THE THAJU FOUNDER OS",
  description:
    "A private operating system for running a life, a body of businesses, and a body of work — from one place.",
  robots: { index: false, follow: false },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={cn("font-sans antialiased")}>
        <ThemeProvider attribute="class" defaultTheme="dark" enableSystem disableTransitionOnChange>
          <AppTooltipProvider>{children}</AppTooltipProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}
