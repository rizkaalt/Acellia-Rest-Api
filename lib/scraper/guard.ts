import "server-only";
import { lookup } from "dns/promises";
import { isIP } from "net";
import type { ScrapeEndpoint } from "./catalog";

export function isPrivateIp(ip: string): boolean {
  if (isIP(ip) === 4) {
    const [a, b] = ip.split(".").map(Number);
    return a === 10 || a === 127 || a === 0 || (a === 169 && b === 254) || (a === 172 && b >= 16 && b <= 31) || (a === 192 && b === 168) || (a === 100 && b >= 64 && b <= 127);
  }
  const v = ip.toLowerCase();
  return v === "::1" || v === "::" || v.startsWith("fc") || v.startsWith("fd") || v.startsWith("fe80") || v.startsWith("::ffff:127.") || v.startsWith("::ffff:10.") || v.startsWith("::ffff:192.168.");
}

function hostMatches(host: string, allowed: string[]) {
  const h = host.toLowerCase().replace(/^www\./, "");
  return allowed.some((d) => h === d || h.endsWith("." + d));
}

/** Validasi input endpoint scrape. Return string error atau null jika valid. */
export async function validateInput(ep: ScrapeEndpoint, raw: string | null): Promise<string | null> {
  if (!raw || !raw.trim()) return ep.input === "url" ? "Parameter 'url' wajib diisi" : "Parameter 'q' wajib diisi";
  const value = raw.trim();
  if (ep.input === "query") return value.length > 200 ? "Query terlalu panjang (maks 200 karakter)" : null;

  if (value.length > 2048) return "URL terlalu panjang";
  let u: URL;
  try { u = new URL(value); } catch { return "URL tidak valid"; }
  if (u.protocol !== "http:" && u.protocol !== "https:") return "Hanya http/https";
  if (u.username || u.password) return "URL tidak boleh berisi kredensial";
  const host = u.hostname.toLowerCase();
  if (host === "localhost" || host.endsWith(".local") || host.endsWith(".internal")) return "Host internal ditolak";
  if (isIP(host.replace(/^\[|\]$/g, "")) && isPrivateIp(host.replace(/^\[|\]$/g, ""))) return "Host internal ditolak";

  if (ep.hosts) {
    if (!hostMatches(host, ep.hosts)) return `URL harus dari: ${ep.hosts.slice(0, 3).join(", ")}`;
    return null;
  }
  // Endpoint tanpa whitelist: pastikan DNS tidak mengarah ke IP privat (anti-SSRF).
  try {
    const addrs = await lookup(host, { all: true });
    if (addrs.some((a) => isPrivateIp(a.address))) return "Host internal ditolak";
  } catch {
    return "Host tidak bisa di-resolve";
  }
  return null;
}
