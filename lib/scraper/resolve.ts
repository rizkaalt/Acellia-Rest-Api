import "server-only";
import * as scrapr from "@coflyn/scrapr";
import { detectPlatform } from "./validate";
import { resolveTikTok } from "./tiktok";
import { fromScrapr } from "./normalize";
import type { MediaResult } from "./types";

type ScrapeFn = (url: string) => Promise<{ status: boolean; result?: unknown; message?: string }>;

/* eslint-disable @typescript-eslint/no-explicit-any */
const s = scrapr as any;

// Urutan = prioritas fallback per platform.
const CHAINS: Record<string, ScrapeFn[]> = {
  instagram: [s.instagram.direct, s.instagram.indown, s.instagram.snapsave],
  youtube: [s.youtube.ytmp3, s.youtube.ytmp3gg],
  twitter: [s.twitter.direct, s.twitter.tweeload, s.twitter.savetwt],
  facebook: [s.facebook.snapsave, s.facebook.fdown],
  spotify: [s.spotify.spotisaver, s.spotify.spotidown, s.spotify.spotmate],
  threads: [s.threads.threadster],
  pinterest: [s.pinterest.direct, s.pinterest.pindown],
  soundcloud: [s.soundcloud.klickaud],
  reddit: [s.reddit.rapidsave],
};

export class ResolveError extends Error {
  constructor(public code: string, message: string) { super(message); }
}

export async function resolveMedia(rawUrl: string): Promise<MediaResult> {
  const platform = detectPlatform(new URL(rawUrl).hostname);
  if (!platform) throw new ResolveError("UNSUPPORTED_PLATFORM", "Platform tidak didukung");

  if (platform === "tiktok") {
    try { return await resolveTikTok(rawUrl); }
    catch { throw new ResolveError("TIKTOK_RESOLVE_FAILED", "Gagal mengambil video TikTok"); }
  }

  for (const fn of CHAINS[platform] ?? []) {
    if (typeof fn !== "function") continue;
    try {
      const r = await fn(rawUrl);
      if (r?.status) {
        const n = fromScrapr(platform, r.result);
        if (n.downloads.length) return n;
      }
    } catch { /* lanjut ke scraper berikutnya */ }
  }
  throw new ResolveError("RESOLVE_FAILED", `Gagal mengambil media dari ${platform}`);
}
