import { NextRequest } from "next/server";
import { authenticate, consumeQuota, fail, json, logRequest, rateHeaders, resetAtISO, TIER_LIMITS } from "@/lib/api";
import { downloadSchema, detectPlatform } from "@/lib/scraper/validate";
import { resolveMedia, ResolveError } from "@/lib/scraper/resolve";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function POST(req: NextRequest) {
  const profile = await authenticate(req);
  if (!profile) {
    await logRequest(null, "/api/v1/download", 401);
    return fail(401, "INVALID_API_KEY", "API key tidak valid atau tidak ditemukan.");
  }

  let body: unknown;
  try { body = await req.json(); } catch {
    return fail(400, "INVALID_BODY", "Body harus JSON: { \"url\": \"...\" }");
  }
  const parsed = downloadSchema.safeParse(body);
  if (!parsed.success) {
    return fail(400, "INVALID_URL", parsed.error.issues[0]?.message ?? "URL tidak valid");
  }

  let quota;
  try { quota = await consumeQuota(profile); } catch {
    return fail(500, "INTERNAL_ERROR", "Gagal memeriksa kuota.");
  }
  const headers = rateHeaders(profile.tier, quota.used);
  if (!quota.allowed) {
    await logRequest(profile.id, "/api/v1/download", 429);
    return fail(429, "DAILY_LIMIT_EXCEEDED", "Limit harian habis, upgrade ke Partner.", headers, {
      limit: TIER_LIMITS[profile.tier], used: quota.used, reset_at: resetAtISO(),
    });
  }

  const platform = detectPlatform(new URL(parsed.data.url).hostname) ?? undefined;
  try {
    const data = await resolveMedia(parsed.data.url);
    await logRequest(profile.id, "/api/v1/download", 200, platform);
    return json({ success: true, data, message: "OK" }, 200, headers);
  } catch (e) {
    const code = e instanceof ResolveError ? e.code : "INTERNAL_ERROR";
    const status = e instanceof ResolveError ? 502 : 500;
    await logRequest(profile.id, "/api/v1/download", status, platform);
    return fail(status, code, e instanceof ResolveError ? e.message : "Terjadi kesalahan.", headers);
  }
}
