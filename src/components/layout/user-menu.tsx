"use client";

import { LogOut, Settings, User } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar } from "@/components/ui/avatar";
import { signOut } from "@/app/(auth)/actions";
import type { FounderProfile } from "@/types";

export function UserMenu({ profile }: { profile: FounderProfile }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="flex items-center gap-2 rounded-md p-1 outline-none transition-colors hover:bg-surface-hover focus-visible:ring-2 focus-visible:ring-accent/40">
        <Avatar name={profile.fullName} />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel className="flex flex-col gap-0.5 px-2.5 py-2">
          <span className="text-[13px] font-medium normal-case tracking-normal text-foreground">
            {profile.fullName}
          </span>
          <span className="text-[12px] font-normal normal-case tracking-normal text-foreground-subtle">
            {profile.email}
          </span>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/settings/profile">
            <User className="h-3.5 w-3.5 text-foreground-muted" />
            Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings">
            <Settings className="h-3.5 w-3.5 text-foreground-muted" />
            Settings
          </Link>
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <form action={signOut} className="w-full">
          <DropdownMenuItem asChild>
            <button type="submit" className="w-full text-danger focus:text-danger">
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </button>
          </DropdownMenuItem>
        </form>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
