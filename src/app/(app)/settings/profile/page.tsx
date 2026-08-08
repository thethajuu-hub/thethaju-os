import { createClient } from "@/lib/supabase/server";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";

async function getProfile() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
  if (!supabaseUrl || !supabaseAnonKey) {
    return { fullName: "Muhammed Thajudheen", email: "founder@thaju.os" };
  }
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return {
    fullName: (user?.user_metadata?.full_name as string) || "Founder",
    email: user?.email ?? "",
  };
}

export default async function ProfileSettingsPage() {
  const profile = await getProfile();

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile</CardTitle>
        <CardDescription>This is your only account — there are no other members.</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-6">
        <div className="flex items-center gap-3">
          <Avatar name={profile.fullName} className="h-12 w-12 text-[14px]" />
          <div className="flex flex-col">
            <span className="text-[13.5px] font-medium text-foreground">{profile.fullName}</span>
            <span className="text-[12.5px] text-foreground-subtle">{profile.email}</span>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="fullName">Full name</Label>
            <Input id="fullName" defaultValue={profile.fullName} />
          </div>
          <div className="flex flex-col gap-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" defaultValue={profile.email} disabled />
          </div>
        </div>

        <div className="flex justify-end border-t border-border pt-5">
          <Button size="sm" disabled>
            Save changes
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
