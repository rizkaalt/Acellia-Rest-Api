import { NextRequest } from "next/server";
import { authenticate, fail, getUsageToday, json, rateHeaders } from "@/lib/api";
import { SCRAPE_ENDPOINTS } from "@/lib/scraper/catalog";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET(req: NextRequest) {
  const p = await authenticate(req);
  if (!p) return fail(401, "INVALID_API_KEY", "API key tidak valid atau tidak ditemukan.");
  const endpoints = SCRAPE_ENDPOINTS.map((e) => ({
    path: `/api/v1/scrape/${e.key}`,
    category: e.category,
    platform: e.group,
    input: e.input === "url" ? "url" : "q",
    source: e.source,
  }));
  return json(
    { success: true, data: { total: endpoints.length, endpoints }, message: "OK" },
    200,
    rateHeaders(p.tier, await getUsageToday(p.id)),
  );
}
