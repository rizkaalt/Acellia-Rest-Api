import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { Card, Chip, Progress, TopBar } from "@/components/ui";
import KeyCard from "@/components/KeyCard";
import { TIER_LIMITS, type Tier } from "@/lib/api";

export const dynamic = "force-dynamic";

export default async function Dashboard() {
  const supabase = createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/login");

  const { data: profile } = await supabase.from("profiles").select("username, tier, api_key_preview").eq("id", auth.user.id).single();
  const today = new Date().toISOString().slice(0, 10);
  const { data: usage } = await supabase.from("api_usage").select("count").eq("user_id", auth.user.id).eq("usage_date", today).maybeSingle();

  const tier = (profile?.tier ?? "free") as Tier;
  const limit = TIER_LIMITS[tier];
  const used = usage?.count ?? 0;

  return (
    <>
      <TopBar authed />
      <main className="mx-auto max-w-3xl space-y-4 px-4 py-8">
        <div className="flex items-center justify-between">
          <h1 className="font-heading text-2xl">Halo, {profile?.username} ✨</h1>
          <Chip>{tier}</Chip>
        </div>
        <KeyCard preview={profile?.api_key_preview ?? "-"} />
        <Card className="space-y-3">
          <h2 className="font-heading text-xl">Pemakaian hari ini</h2>
          <Progress value={used} max={limit} />
          <p className="text-sm text-outline">{used} / {limit < 0 ? "unlimited" : limit} request (reset 00:00 UTC)</p>
        </Card>
        <Link href="/docs" className="block rounded-m3-xl bg-primary-container p-5 text-on-primary-container">Lihat dokumentasi API →</Link>
      </main>
    </>
  );
}
