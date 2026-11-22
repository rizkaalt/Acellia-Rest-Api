import { NextRequest } from "next/server";
import { authenticate, fail, getUsageToday, json, rateHeaders } from "@/lib/api";
import { generateApiKey } from "@/lib/apikey";
import { createAdminClient } from "@/lib/supabase/admin";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const p = await authenticate(req);
  if (!p) return fail(401, "INVALID_API_KEY", "API key tidak valid atau tidak ditemukan.");
  const { key, hash, preview } = generateApiKey();
  const { error } = await createAdminClient()
    .from("profiles").update({ api_key_hash: hash, api_key_preview: preview }).eq("id", p.id);
  if (error) return fail(500, "INTERNAL_ERROR", "Gagal membuat key baru.");
  return json(
    { success: true, data: { api_key: key, api_key_preview: preview }, message: "Simpan key ini, tidak akan ditampilkan lagi." },
    200,
    rateHeaders(p.tier, await getUsageToday(p.id)),
  );
}
