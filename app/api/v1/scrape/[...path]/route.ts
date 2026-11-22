import { NextRequest } from "next/server";
import { authenticate, consumeQuota, fail, json, logRequest, rateHeaders, resetAtISO, TIER_LIMITS } from "@/lib/api";
import { findEndpoint } from "@/lib/scraper/catalog";
import { validateInput } from "@/lib/scraper/guard";
import { runScrape, UpstreamError } from "@/lib/scraper/run";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

type Ctx = { params: { path: string[] } };

async function handle(req: NextRequest, path: string[]) {
  const key = path.join("/");
  const ep = findEndpoint(key);
  if (!ep) return fail(404, "ENDPOINT_NOT_FOUND", "Endpoint tidak ditemukan. Lihat daftar di /docs.");

  const profile = await authenticate(req);
  if (!profile) return fail(401, "INVALID_API_KEY", "API key tidak valid atau tidak ditemukan.");

  const param = ep.input === "url" ? "url" : "q";
  let raw = req.nextUrl.searchParams.get(param);
  if (!raw && req.method === "POST") {
    const body = (await req.json().catch(() => null)) as Record<string, unknown> | null;
    const v = body?.[param] ?? body?.query;
    raw = typeof v === "string" ? v : null;
  }

  const err = await validateInput(ep, raw);
  if (err) return fail(400, ep.input === "url" ? "INVALID_URL" : "INVALID_QUERY", err);

  let quota;
  try { quota = await consumeQuota(profile); } catch { return fail(500, "INTERNAL_ERROR", "Gagal memeriksa kuota."); }
  const headers = rateHeaders(profile.tier, quota.used);
  const endpoint = `/api/v1/scrape/${key}`;
  if (!quota.allowed) {
    await logRequest(profile.id, endpoint, 429, ep.group.toLowerCase());
    return fail(429, "DAILY_LIMIT_EXCEEDED", "Limit harian habis, upgrade ke Partner.", headers, {
      limit: TIER_LIMITS[profile.tier], used: quota.used, reset_at: resetAtISO(),
    });
  }

  try {
    const data = await runScrape(key, raw!.trim());
    await logRequest(profile.id, endpoint, 200, ep.group.toLowerCase());
    return json({ success: true, data, message: "OK" }, 200, headers);
  } catch (e) {
    const ue = e instanceof UpstreamError ? e : new UpstreamError("INTERNAL_ERROR", "Terjadi kesalahan.");
    const status = ue.code === "INTERNAL_ERROR" ? 500 : ue.code === "NOT_IMPLEMENTED" ? 501 : 502;
    await logRequest(profile.id, endpoint, status, ep.group.toLowerCase());
    return fail(status, ue.code, ue.message, headers);
  }
}

export async function GET(req: NextRequest, ctx: Ctx) { return handle(req, ctx.params.path); }
export async function POST(req: NextRequest, ctx: Ctx) { return handle(req, ctx.params.path); }
