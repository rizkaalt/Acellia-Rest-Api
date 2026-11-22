import { Check } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, Chip, TopBar } from "@/components/ui";

const plans = [
  { name: "Free", limit: "100 request / hari", note: "Default saat daftar", cta: "Paket kamu saat ini" },
  { name: "Partner", limit: "500 request / hari", note: "Hubungi admin untuk upgrade", cta: "Hubungi admin" },
  { name: "Owner", limit: "Unlimited", note: "By invitation", cta: "By invitation" },
];

export default async function Pricing() {
  const { data } = await createClient().auth.getUser();
  return (
    <>
      <TopBar authed={!!data.user} />
      <main className="mx-auto max-w-5xl px-4 py-10">
        <h1 className="mb-8 text-center font-heading text-3xl">Pricing</h1>
        <div className="grid gap-4 md:grid-cols-3">
          {plans.map((p) => (
            <Card key={p.name} className="space-y-3">
              <Chip>{p.name}</Chip>
              <p className="font-heading text-2xl">{p.limit}</p>
              <p className="flex items-center gap-2 text-sm text-outline"><Check size={16} />{p.note}</p>
              <button disabled className="h-10 w-full rounded-full border border-outline text-sm text-primary opacity-70">{p.cta}</button>
            </Card>
          ))}
        </div>
      </main>
    </>
  );
}
