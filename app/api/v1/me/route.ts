import { NextRequest } from "next/server";
import { authenticate, fail, getUsageToday, json, rateHeaders, resetAtISO, TIER_LIMITS } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const p = await authenticate(req);
  if (!p) return fail(401, "INVALID_API_KEY", "API key tidak valid atau tidak ditemukan.");
  const used = await getUsageToday(p.id);
  const limit = TIER_LIMITS[p.tier];
  return json(
    {
      success: true,
      data: {
        username: p.username, email: p.email, tier: p.tier,
        api_key_preview: p.api_key_preview,
        usage: { used, limit: limit < 0 ? "unlimited" : limit, remaining: limit < 0 ? "unlimited" : Math.max(0, limit - used), reset_at: resetAtISO() },
      },
      message: "OK",
    },
    200,
    rateHeaders(p.tier, used),
  );
}
