import { createClient } from "@/lib/supabase/server";
import { TopBar } from "@/components/ui";
import DocsExplorer from "@/components/DocsExplorer";

export default async function Docs() {
  const { data } = await createClient().auth.getUser();
  return (
    <>
      <TopBar authed={!!data.user} />
      <main className="mx-auto max-w-3xl space-y-4 px-4 py-8">
        <h1 className="font-heading text-3xl">Dokumentasi</h1>
        <DocsExplorer />
      </main>
    </>
  );
}
