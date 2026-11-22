import "server-only";
import { createHash, randomBytes } from "crypto";

export function generateApiKey() {
  const key = `sk_live_${randomBytes(16).toString("hex")}`; // 32 hex
  return { key, hash: hashApiKey(key), preview: `${key.slice(0, 11)}...${key.slice(-4)}` };
}

export function hashApiKey(key: string) {
  const pepper = process.env.API_KEY_PEPPER;
  if (!pepper) throw new Error("API_KEY_PEPPER belum di-set");
  return createHash("sha256").update(key + pepper).digest("hex");
}
