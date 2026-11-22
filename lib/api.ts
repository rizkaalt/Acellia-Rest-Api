import "server-only";
import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { hashApiKey } from "@/lib/apikey";

export const TIER_LIMITS = { free: 100, partner: 500, owner: -1 } as const;
export type Tier = keyof typeof TIER_LIMITS;

export interface Profile {
  id: string;
  username: string;
  email: string;
  tier: Tier;
  api_key_preview: string | null;
}

export function resetAtISO() {
  const d = new Date();
  return new Date(Date.UTC(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate() + 1)).toISOString();
}

export interface RateInfo { limit: number; used: number }

export function rateHeaders(tier: Tier, used: number): Record<string, string> {
  const limit = TIER_LIMITS[tier];
  return {
    "X-RateLimit-Limit": limit < 0 ? "unlimited" : String(limit),
    "X-RateLimit-Remaining": limit < 0 ? "unlimited" : String(Math.max(0, limit - used)),
    "X-RateLimit-Reset": resetAtISO(),
  };
}

export function json(body: Record<string, unknown>, status = 200, headers: Record<string, string> = {}) {
  return NextResponse.json(body, { status, headers });
}

export function fail(status: number, error: string, message: string, headers: Record<string, string> = {}, extra: Record<string, unknown> = {}) {
  return json({ success: false, error, message, ...extra }, status, headers);
}

export function extractKey(req: Request): string | null {
  const x = req.headers.get("x-api-key");
  if (x) return x.trim();
  const auth = req.headers.get("authorization");
  if (auth?.toLowerCase().startsWith("bearer ")) return auth.slice(7).trim();
  return null;
}

export async function authenticate(req: Request): Promise<Profile | null> {
  const key = extractKey(req);
  if (!key || !/^sk_live_[0-9a-f]{32}$/.test(key)) return null;
  const admin = createAdminClient();
  const { data } = await admin
    .from("profiles")
    .select("id, username, email, tier, api_key_preview")
    .eq("api_key_hash", hashApiKey(key))
    .maybeSingle();
  return (data as Profile | null) ?? null;
}

export async function getUsageToday(userId: string): Promise<number> {
  const admin = createAdminClient();
  const today = new Date().toISOString().slice(0, 10);
  const { data } = await admin.from("api_usage").select("count").eq("user_id", userId).eq("usage_date", today).maybeSingle();
  return data?.count ?? 0;
}

export async function consumeQuota(profile: Profile): Promise<{ allowed: boolean; used: number }> {
  const admin = createAdminClient();
  const { data, error } = await admin.rpc("consume_quota", {
    p_user_id: profile.id,
    p_limit: TIER_LIMITS[profile.tier],
  });
  if (error || !data?.[0]) throw new Error("QUOTA_CHECK_FAILED");
  return { allowed: data[0].allowed, used: data[0].used };
}

export async function logRequest(userId: string | null, endpoint: string, status: number, platform?: string) {
  try {
    await createAdminClient().from("request_logs").insert({ user_id: userId, endpoint, status_code: status, platform: platform ?? null });
  } catch {
    /* logging tidak boleh menggagalkan request */
  }
}
