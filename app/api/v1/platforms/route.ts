import { NextRequest } from "next/server";
import { authenticate, fail, getUsageToday, json, rateHeaders } from "@/lib/api";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const PLATFORMS = [
  { platform: "tiktok", example: "https://www.tiktok.com/@user/video/1234567890" },
  { platform: "instagram", example: "https://www.instagram.com/reel/XXXXXXXX/" },
  { platform: "youtube", example: "https://www.youtube.com/watch?v=XXXXXXXXXXX" },
  { platform: "twitter", example: "https://x.com/user/status/1234567890" },
  { platform: "facebook", example: "https://www.facebook.com/watch/?v=1234567890" },
  { platform: "spotify", example: "https://open.spotify.com/track/XXXXXXXX" },
  { platform: "threads", example: "https://www.threads.net/@user/post/XXXXXXXX" },
  { platform: "pinterest", example: "https://www.pinterest.com/pin/1234567890/" },
  { platform: "soundcloud", example: "https://soundcloud.com/artist/track" },
  { platform: "reddit", example: "https://www.reddit.com/r/sub/comments/abc123/title/" },
];

export async function GET(req: NextRequest) {
  const p = await authenticate(req);
  if (!p) return fail(401, "INVALID_API_KEY", "API key tidak valid atau tidak ditemukan.");
  return json({ success: true, data: PLATFORMS, message: "OK" }, 200, rateHeaders(p.tier, await getUsageToday(p.id)));
}
