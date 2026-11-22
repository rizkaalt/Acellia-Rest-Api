import { SCRAPE_ENDPOINTS, type Category } from "./scraper/catalog";
import { BASE_URL } from "./config";

export type DocCategory = "Core" | Category;
export const CATEGORIES: DocCategory[] = ["Core", "Downloader", "Resolver", "Anime", "Comic"];

export interface DocParam { name: string; where: "query" | "body" | "header"; required: boolean; desc: string }
export interface DocEndpoint {
  id: string;
  methods: ("GET" | "POST")[];
  path: string;
  category: DocCategory;
  group: string;
  title: string;
  params: DocParam[];
  curl: string;
  response: string;
  source?: string;
}

const KEY = "sk_live_xxx";
const AUTH: DocParam = { name: "x-api-key", where: "header", required: true, desc: "API key kamu (atau Authorization: Bearer)" };

const core: DocEndpoint[] = [
  {
    id: "core/download", methods: ["POST", "GET"], path: "/api/v1/download", category: "Core", group: "Smart",
    title: "Download otomatis: deteksi platform dari URL (TikTok HD via TikWM + fallback)",
    params: [AUTH, { name: "url", where: "body", required: true, desc: "URL media (JSON body, atau ?url= untuk GET)" }],
    curl: `curl -X POST ${BASE_URL}/api/v1/download \\\n  -H "x-api-key: ${KEY}" -H "Content-Type: application/json" \\\n  -d '{"url":"https://www.tiktok.com/@user/video/123"}'`,
    response: `{ "success": true, "message": "OK", "data": {\n  "platform": "tiktok", "title": "...", "author": "...", "cover": "...",\n  "downloads": [\n    { "label": "HD No Watermark", "url": "...", "quality": "hd", "type": "video" },\n    { "label": "Audio MP3", "url": "...", "quality": "audio", "type": "audio" }\n  ] } }`,
  },
  {
    id: "core/me", methods: ["GET"], path: "/api/v1/me", category: "Core", group: "Akun", title: "Profil, tier, dan pemakaian hari ini",
    params: [AUTH],
    curl: `curl ${BASE_URL}/api/v1/me -H "x-api-key: ${KEY}"`,
    response: `{ "success": true, "message": "OK", "data": {\n  "username": "...", "tier": "free", "api_key_preview": "sk_live_abcd...wxyz",\n  "usage": { "used": 3, "limit": 100, "remaining": 97, "reset_at": "..." } } }`,
  },
  {
    id: "core/regenerate", methods: ["POST"], path: "/api/v1/keys/regenerate", category: "Core", group: "Akun", title: "Buat API key baru (key lama langsung mati)",
    params: [AUTH],
    curl: `curl -X POST ${BASE_URL}/api/v1/keys/regenerate -H "x-api-key: ${KEY}"`,
    response: `{ "success": true, "message": "...", "data": { "api_key": "sk_live_...", "api_key_preview": "..." } }`,
  },
  {
    id: "core/platforms", methods: ["GET"], path: "/api/v1/platforms", category: "Core", group: "Info", title: "Daftar semua endpoint scraper",
    params: [AUTH],
    curl: `curl ${BASE_URL}/api/v1/platforms -H "x-api-key: ${KEY}"`,
    response: `{ "success": true, "message": "OK", "data": { "total": 70, "endpoints": [ { "path": "...", "category": "...", "input": "url" } ] } }`,
  },
];

const RESP: Record<Category, string> = {
  Downloader: `{ "success": true, "message": "OK", "data": {\n  "title": "...", "thumbnail": "...",\n  "downloads": [ { "label": "...", "url": "...", "quality": "...", "type": "video" } ] } }`,
  Resolver: `{ "success": true, "message": "OK", "data": {\n  "title": "...", "downloads": [ { "label": "...", "url": "..." } ] } }`,
  Anime: `{ "success": true, "message": "OK", "data": [ { "title": "...", "url": "..." } ] }`,
  Comic: `{ "success": true, "message": "OK", "data": [ { "title": "...", "url": "..." } ] }`,
};

function sample(ep: (typeof SCRAPE_ENDPOINTS)[number]): string {
  if (ep.input === "query") return "solo leveling";
  const host = ep.hosts?.[0] ?? "example.com";
  const last = ep.key.split("/").pop();
  if (last === "getEpisodes" || last === "getChapters") return `https://${host}/judul-anime/`;
  return `https://${host}/...`;
}

const scrape: DocEndpoint[] = SCRAPE_ENDPOINTS.map((ep) => {
  const param = ep.input === "url" ? "url" : "q";
  const path = `/api/v1/scrape/${ep.key}`;
  const last = ep.key.split("/").pop();
  const listLike = last === "search" || last === "getEpisodes" || last === "getChapters";
  const resp = listLike || ep.category === "Anime" || ep.category === "Comic" ? (listLike ? RESP.Anime : RESP.Downloader) : RESP[ep.category];
  return {
    id: ep.key, methods: ["GET", "POST"], path, category: ep.category, group: ep.group, title: ep.summary, source: ep.source,
    params: [
      AUTH,
      { name: param, where: "query", required: true, desc: ep.input === "url" ? "URL media (atau kirim di JSON body)" : "Kata kunci pencarian" },
    ],
    curl: `curl -G "${BASE_URL}${path}" \\\n  --data-urlencode "${param}=${sample(ep)}" \\\n  -H "x-api-key: ${KEY}"`,
    response: resp,
  };
});

export const DOC_ENDPOINTS: DocEndpoint[] = [...core, ...scrape];
export const PLATFORM_COUNT = new Set(scrape.map((e) => e.group)).size;
