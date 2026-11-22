# Acellia REST API

Next.js 14 (App Router) + Supabase + `@coflyn/scrapr`, UI Material 3 tema Elaina.

## Setup
1. Buat project di https://supabase.com.
2. Jalankan isi `supabase/migrations/0001_init.sql` di SQL Editor.
3. Supabase → Authentication → Providers → Email: aktif. Untuk testing, matikan "Confirm email" (tanpa verifikasi).
4. `cp .env.example .env.local` lalu isi:
   - `NEXT_PUBLIC_SUPABASE_URL`, `NEXT_PUBLIC_SUPABASE_ANON_KEY`, `SUPABASE_SERVICE_ROLE_KEY` (Project Settings → API)
   - `API_KEY_PEPPER`: string acak panjang, jangan diganti setelah ada user (key lama jadi tidak valid).
5. `npm install && npm run dev` → http://localhost:3000

## Deploy Vercel
Import repo → isi 4 env di atas → Deploy. `vercel.json` sudah mengatur `maxDuration` 60 untuk `app/api/**`.
Semua route API memakai `runtime = "nodejs"`.

## Jadikan user owner
```sql
update profiles set tier = 'owner' where email = 'kamu@email.com';
```
Tier: free 100/hari, partner 500/hari, owner unlimited.

## Test dengan curl
```bash
curl http://localhost:3000/api/v1/me -H "x-api-key: sk_live_..."
curl -X POST http://localhost:3000/api/v1/download \
  -H "x-api-key: sk_live_..." -H "Content-Type: application/json" \
  -d '{"url":"https://www.tiktok.com/@user/video/123"}'
```

## Catatan
- `@coflyn/scrapr` dipasang dari `vendor/scrapr` (`file:`). Dependensinya (axios, cheerio) ikut terpasang lewat `npm install`.
- Scraper bergantung pada situs pihak ketiga; bisa berubah/mati sewaktu-waktu.
- Key mentah hanya ditampilkan sekali; di database hanya hash SHA-256(key + pepper).

## Domain kustom (api.camellia.my.id)
1. Vercel → Project → Settings → Domains → tambahkan `api.camellia.my.id`.
2. Di DNS domain, buat record `CNAME`: nama `api` → `cname.vercel-dns.com`.
3. Ubah `BASE_URL` di `lib/config.ts` jika domainnya berbeda.

## Endpoint scraper
Semua method `@coflyn/scrapr` tersedia di `GET|POST /api/v1/scrape/{platform}/{method}` (parameter `url` atau `q`).
Daftar lengkap ada di halaman `/docs` dan `GET /api/v1/platforms`.
