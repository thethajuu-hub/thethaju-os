import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Sidebar } from "@/components/layout/sidebar";
import { Header } from "@/components/layout/header";
import type { FounderProfile } from "@/types";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const profile = await getFounderProfile();

  return (
    <div className="flex h-screen w-full gap-4 overflow-hidden bg-bg p-4 md:gap-5 md:p-5">
      <Sidebar />
      <div className="flex min-w-0 flex-1 flex-col">
        <Header profile={profile} />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-[1200px] py-2">{children}</div>
        </main>
      </div>
    </div>
  );
}

/**
 * Resolves the signed-in founder's profile. Falls back to a local dev
 * profile when Supabase isn't configured yet, so the shell stays usable
 * while the foundation is wired up — but redirects to /login the moment
 * Supabase IS configured and there's no session, per the middleware gate.
 */
async function getFounderProfile(): Promise<FounderProfile> {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseAnonKey) {
    return {
      id: "local-dev",
      fullName: "Muhammed Thajudheen",
      email: "founder@thaju.os",
      role: "Founder",
    };
  }

  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/login");
  }

  return {
    id: user.id,
    fullName: (user.user_metadata?.full_name as string) || "Founder",
    email: user.email ?? "",
    avatarUrl: (user.user_metadata?.avatar_url as string) || null,
    role: "Founder",
  };
}
