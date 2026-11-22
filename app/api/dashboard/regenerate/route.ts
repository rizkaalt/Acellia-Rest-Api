import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { generateApiKey } from "@/lib/apikey";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

// Regenerate lewat sesi login (dashboard), bukan lewat API key.
export async function POST() {
  const { data } = await createClient().auth.getUser();
  if (!data.user) return NextResponse.json({ success: false, error: "UNAUTHORIZED", message: "Belum login." }, { status: 401 });
  const { key, hash, preview } = generateApiKey();
  const { error } = await createAdminClient().from("profiles").update({ api_key_hash: hash, api_key_preview: preview }).eq("id", data.user.id);
  if (error) return NextResponse.json({ success: false, error: "INTERNAL_ERROR", message: "Gagal." }, { status: 500 });
  return NextResponse.json({ success: true, data: { api_key: key, api_key_preview: preview }, message: "OK" });
}
