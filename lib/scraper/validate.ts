import { z } from "zod";
import { isIP } from "net";

export const PLATFORM_HOSTS: Record<string, string[]> = {
  tiktok: ["tiktok.com", "vt.tiktok.com", "vm.tiktok.com", "tt.site"],
  instagram: ["instagram.com", "instagr.am"],
  youtube: ["youtube.com", "youtu.be", "m.youtube.com", "music.youtube.com"],
  twitter: ["twitter.com", "x.com", "mobile.twitter.com"],
  facebook: ["facebook.com", "fb.watch", "fb.com", "m.facebook.com"],
  spotify: ["open.spotify.com", "spotify.com", "spotify.link"],
  threads: ["threads.net", "threads.com"],
  pinterest: ["pinterest.com", "pin.it", "id.pinterest.com"],
  soundcloud: ["soundcloud.com", "on.soundcloud.com"],
  reddit: ["reddit.com", "redd.it"],
};

export function detectPlatform(hostname: string): string | null {
  const h = hostname.toLowerCase().replace(/^www\./, "");
  for (const [platform, hosts] of Object.entries(PLATFORM_HOSTS)) {
    if (hosts.some((d) => h === d || h.endsWith("." + d))) return platform;
  }
  return null;
}

function isPrivateHost(hostname: string): boolean {
  const h = hostname.toLowerCase();
  if (h === "localhost" || h.endsWith(".localhost") || h.endsWith(".local") || h.endsWith(".internal")) return true;
  const bare = h.replace(/^\[|\]$/g, "");
  const v = isIP(bare);
  if (v === 4) {
    const [a, b] = bare.split(".").map(Number);
    return (
      a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) ||
      (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127)
    );
  }
  if (v === 6) return true; // tolak literal IPv6
  return false;
}

export const downloadSchema = z.object({
  url: z
    .string()
    .trim()
    .min(8)
    .max(2048)
    .superRefine((value, ctx) => {
      let u: URL;
      try { u = new URL(value); } catch { ctx.addIssue({ code: "custom", message: "URL tidak valid" }); return; }
      if (u.protocol !== "http:" && u.protocol !== "https:") ctx.addIssue({ code: "custom", message: "Hanya http/https" });
      else if (u.username || u.password) ctx.addIssue({ code: "custom", message: "URL tidak boleh berisi kredensial" });
      else if (isPrivateHost(u.hostname)) ctx.addIssue({ code: "custom", message: "Host internal ditolak" });
      else if (!detectPlatform(u.hostname)) ctx.addIssue({ code: "custom", message: "Platform tidak didukung" });
    }),
});
