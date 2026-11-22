import type { DownloadItem, MediaResult } from "./types";

/* eslint-disable @typescript-eslint/no-explicit-any */
export function fromScrapr(platform: string, r: any): MediaResult {
  const raw: any[] = Array.isArray(r?.downloads) ? r.downloads : [];
  const downloads: DownloadItem[] = raw
    .filter((d) => typeof d?.url === "string" && d.url)
    .map((d) => {
      const isAudio = d.type === "audio" || /mp3|audio/i.test(String(d.quality ?? ""));
      const q = String(d.quality ?? "");
      const hd = /1080|720|hd|high/i.test(q);
      return {
        label: d.label ?? (isAudio ? "Audio" : q || (hd ? "HD" : "Video")),
        url: d.url,
        quality: isAudio ? "audio" : hd ? "hd" : "sd",
        type: isAudio ? "audio" : "video",
      } as DownloadItem;
    });
  return {
    platform,
    title: r?.title ?? "",
    author: r?.author ?? r?.username ?? "",
    cover: r?.thumbnail ?? r?.cover ?? "",
    duration: typeof r?.duration === "number" ? r.duration : undefined,
    downloads,
  };
}
