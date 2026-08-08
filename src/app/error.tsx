"use client";

import { useEffect } from "react";
import { ErrorState } from "@/components/ui/error-state";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex h-screen w-full items-center justify-center bg-bg px-6">
      <ErrorState
        title="The Founder OS hit a snag"
        description="An unexpected error interrupted this page. Try again — if it keeps happening, check the terminal for details."
        onRetry={reset}
        className="max-w-md border-0"
      />
    </div>
  );
}
