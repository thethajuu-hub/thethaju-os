"use client";

import * as React from "react";
import { useFormState, useFormStatus } from "react-dom";
import { AlertCircle } from "lucide-react";
import { signIn, type AuthActionState } from "@/app/(auth)/actions";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";

const initialState: AuthActionState = {};

export default function LoginPage() {
  const [state, formAction] = useFormState(signIn, initialState);

  return (
    <div className="flex flex-col gap-8 animate-fade-in-up">
      <div className="flex flex-col items-center gap-3 text-center">
        <div className="flex h-9 w-9 items-center justify-center rounded-md bg-accent text-[14px] font-semibold text-accent-foreground">
          T
        </div>
        <div className="flex flex-col gap-1">
          <h1 className="text-[17px] font-medium tracking-tight text-foreground">
            THE THAJU FOUNDER OS
          </h1>
          <p className="text-[13px] text-foreground-muted">
            Your private headquarters. Sign in to continue.
          </p>
        </div>
      </div>

      <form action={formAction} className="flex flex-col gap-4">
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="email">Email</Label>
          <Input id="email" name="email" type="email" placeholder="you@example.com" autoComplete="email" required />
        </div>
        <div className="flex flex-col gap-1.5">
          <Label htmlFor="password">Password</Label>
          <Input id="password" name="password" type="password" placeholder="••••••••" autoComplete="current-password" required />
        </div>

        {state?.error && (
          <div className="flex items-start gap-2 rounded-md border border-danger/20 bg-danger/8 px-3 py-2.5 text-[12.5px] leading-relaxed text-danger">
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            <span>{state.error}</span>
          </div>
        )}

        <SubmitButton />
      </form>

      <p className="text-center text-[12px] text-foreground-subtle">
        This is a single-founder workspace. There&rsquo;s no sign-up — the account is provisioned directly in Supabase.
      </p>
    </div>
  );
}

function SubmitButton() {
  const { pending } = useFormStatus();
  return (
    <Button type="submit" className="w-full" loading={pending}>
      {pending ? "Signing in" : "Sign in"}
    </Button>
  );
}
