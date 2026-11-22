import "server-only";
import { tiktok } from "@coflyn/scrapr";
import type { MediaResult } from "./types";
import { fromScrapr } from "./normalize";

interface TikwmData {
  title?: string; cover?: string; duration?: number;
  hdplay?: string; play?: string; music?: string;
  author?: { nickname?: string; unique_id?: string };
}

async function viaTikwm(url: string): Promise<MediaResult> {
  const res = await fetch(`https://www.tikwm.com/api/?url=${encodeURIComponent(url)}&hd=1`, {
    signal: AbortSignal.timeout(15_000),
    headers: { "User-Agent": "Mozilla/5.0 (compatible; AcelliaAPI/1.0)" },
    cache: "no-store",
  });
  const body = (await res.json()) as { code: number; data?: TikwmData };
  if (!res.ok || body.code !== 0 || !body.data) throw new Error("TIKWM_FAILED");
  const d = body.data;
  const downloads: MediaResult["downloads"] = [];
  if (d.hdplay) downloads.push({ label: "HD No Watermark", url: d.hdplay, quality: "hd", type: "video" });
  if (d.play) downloads.push({ label: "No Watermark", url: d.play, quality: "sd", type: "video" });
  if (d.music) downloads.push({ label: "Audio MP3", url: d.music, quality: "audio", type: "audio" });
  if (!downloads.length) throw new Error("TIKWM_EMPTY");
  return {
    platform: "tiktok",
    title: d.title ?? "",
    author: d.author?.nickname ?? d.author?.unique_id ?? "",
    cover: d.cover ?? "",
    duration: d.duration,
    downloads,
  };
}

export async function resolveTikTok(url: string): Promise<MediaResult> {
  try {
    return await viaTikwm(url);
  } catch {
    /* fallback ke scrapr */
  }
  for (const fn of [tiktok.snaptik, tiktok.ssstik, tiktok.tiktokio]) {
    try {
      const r = await fn(url);
      if (r?.status) {
        const n = fromScrapr("tiktok", r.result);
        if (n.downloads.length) return n;
      }
    } catch {
      /* coba scraper berikutnya */
    }
  }
  throw new Error("TIKTOK_RESOLVE_FAILED");
}
