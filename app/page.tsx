import { Sparkles, Layers, KeyRound, Gauge } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { Card, LinkButton, TopBar } from "@/components/ui";
import { MagicCircle, WitchHat } from "@/components/Decor";

const features = [
  { icon: Sparkles, title: "TikTok HD tanpa watermark", text: "TikWM sebagai jalur utama, scrapr sebagai cadangan." },
  { icon: Layers, title: "Multi-platform", text: "Instagram, YouTube, X, Facebook, Spotify, Threads, dan lainnya." },
  { icon: KeyRound, title: "API key pribadi", text: "Dibuat otomatis saat daftar, bisa di-regenerate kapan saja." },
  { icon: Gauge, title: "Limit harian jelas", text: "Free 100, Partner 500 per hari, lengkap dengan header rate limit." },
];

export default async function Home() {
  const { data } = await createClient().auth.getUser();
  return (
    <>
      <TopBar authed={!!data.user} />
      <main className="mx-auto max-w-5xl px-4 pb-20">
        <section className="relative grid place-items-center gap-6 py-16 text-center">
          <MagicCircle className="absolute -z-10 h-80 w-80 opacity-60 sm:h-[26rem] sm:w-[26rem]" />
          <WitchHat className="h-16 w-16" />
          <h1 className="font-heading text-4xl font-bold sm:text-5xl">Acellia REST API</h1>
          <p className="max-w-md text-lg text-outline">Download media sosial semudah sihir.</p>
          <div className="flex flex-wrap justify-center gap-3">
            <LinkButton href="/register">Daftar Gratis</LinkButton>
            <LinkButton href="/docs" variant="outlined">Lihat Docs</LinkButton>
          </div>
        </section>
        <section className="grid gap-4 sm:grid-cols-2">
          {features.map(({ icon: I, title, text }) => (
            <Card key={title} className="flex gap-4">
              <span className="grid h-12 w-12 shrink-0 place-items-center rounded-m3-lg bg-primary-container text-primary"><I size={22} /></span>
              <div><h3 className="font-semibold">{title}</h3><p className="text-sm text-outline">{text}</p></div>
            </Card>
          ))}
        </section>
      </main>
    </>
  );
}
