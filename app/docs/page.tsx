import { createClient } from "@/lib/supabase/server";
import { Card, TopBar } from "@/components/ui";

const BASE = "https://YOUR-APP.vercel.app";

function Code({ children }: { children: string }) {
  return <pre className="overflow-x-auto rounded-m3 bg-tertiary p-4 text-xs text-white"><code>{children}</code></pre>;
}

export default async function Docs() {
  const { data } = await createClient().auth.getUser();
  return (
    <>
      <TopBar authed={!!data.user} />
      <main className="mx-auto max-w-3xl space-y-4 px-4 py-8">
        <h1 className="font-heading text-3xl">Dokumentasi</h1>
        <Card className="space-y-2">
          <h2 className="font-heading text-xl">Autentikasi</h2>
          <p className="text-sm">Kirim API key lewat header <code>x-api-key</code> atau <code>Authorization: Bearer</code>.</p>
        </Card>
        <Card className="space-y-2">
          <h2 className="font-heading text-xl">POST /api/v1/download</h2>
          <Code>{`curl -X POST ${BASE}/api/v1/download \\
  -H "x-api-key: sk_live_xxx" \\
  -H "Content-Type: application/json" \\
  -d '{"url":"https://www.tiktok.com/@user/video/123"}'`}</Code>
          <Code>{`{ "success": true, "message": "OK", "data": {
  "platform": "tiktok", "title": "...", "author": "...", "cover": "...",
  "downloads": [
    { "label": "HD No Watermark", "url": "...", "quality": "hd", "type": "video" },
    { "label": "Audio MP3", "url": "...", "quality": "audio", "type": "audio" }
  ] } }`}</Code>
        </Card>
        <Card className="space-y-2">
          <h2 className="font-heading text-xl">GET /api/v1/me</h2>
          <Code>{`curl ${BASE}/api/v1/me -H "Authorization: Bearer sk_live_xxx"`}</Code>
        </Card>
        <Card className="space-y-2">
          <h2 className="font-heading text-xl">POST /api/v1/keys/regenerate</h2>
          <Code>{`curl -X POST ${BASE}/api/v1/keys/regenerate -H "x-api-key: sk_live_xxx"`}</Code>
        </Card>
        <Card className="space-y-2">
          <h2 className="font-heading text-xl">GET /api/v1/platforms</h2>
          <Code>{`curl ${BASE}/api/v1/platforms -H "x-api-key: sk_live_xxx"`}</Code>
        </Card>
        <Card className="space-y-2">
          <h2 className="font-heading text-xl">Error & rate limit</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm">
            <li><code>400 INVALID_URL / INVALID_BODY</code></li>
            <li><code>401 INVALID_API_KEY</code></li>
            <li><code>429 DAILY_LIMIT_EXCEEDED</code> (berisi limit, used, reset_at)</li>
            <li><code>502 TIKTOK_RESOLVE_FAILED / RESOLVE_FAILED</code></li>
          </ul>
          <p className="text-sm">Header: <code>X-RateLimit-Limit</code>, <code>X-RateLimit-Remaining</code>, <code>X-RateLimit-Reset</code>.</p>
        </Card>
      </main>
    </>
  );
}
