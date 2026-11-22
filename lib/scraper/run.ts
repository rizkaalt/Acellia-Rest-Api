import "server-only";
import * as scrapr from "@coflyn/scrapr";

/* eslint-disable @typescript-eslint/no-explicit-any */
const root = scrapr as any;

export class UpstreamError extends Error {
  constructor(public code: string, message: string) { super(message); }
}

export async function runScrape(key: string, input: string, timeoutMs = 50_000): Promise<unknown> {
  let target: any = root;
  for (const part of key.split("/")) target = target?.[part];
  if (typeof target !== "function") throw new UpstreamError("NOT_IMPLEMENTED", "Method scraper tidak tersedia");

  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    const out: any = await Promise.race([
      Promise.resolve(target(input)),
      new Promise((_, rej) => { timer = setTimeout(() => rej(new UpstreamError("UPSTREAM_TIMEOUT", "Situs sumber terlalu lama merespons")), timeoutMs); }),
    ]);
    if (out && out.status === false) {
      throw new UpstreamError("SCRAPER_FAILED", String(out.message ?? "Scraper gagal mengambil data").slice(0, 200));
    }
    return out && "result" in out ? out.result : out;
  } catch (e) {
    if (e instanceof UpstreamError) throw e;
    throw new UpstreamError("SCRAPER_FAILED", "Situs sumber gagal diakses atau berubah struktur");
  } finally {
    if (timer) clearTimeout(timer);
  }
}
