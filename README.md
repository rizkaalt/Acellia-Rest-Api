<!-- Typing SVG -->
<div align="center">

[![Typing SVG](https://readme-typing-svg.demolab.com?font=Pacifico&size=24&duration=3000&pause=800&color=C9A8E0&center=true&vCenter=true&multiline=false&width=560&lines=Acellia+REST+API;download+media+semudah+sihir+%E2%9C%A8;terus+mengembara~)](https://github.com/rizkaalt)

</div>

<!-- Banner -->
<div align="center">
  <img src="https://raw.githubusercontent.com/rizkaalt/rizkaalt/main/img/banner-elaina.jpg" width="100%" alt="Elaina banner" />
</div>

<div align="center">

![Next.js](https://img.shields.io/badge/Next.js_14-C9A8E0?style=for-the-badge&logo=nextdotjs&logoColor=1a0533&labelColor=1a0533)
![TypeScript](https://img.shields.io/badge/TypeScript-C9A8E0?style=for-the-badge&logo=typescript&logoColor=1a0533&labelColor=1a0533)
![Supabase](https://img.shields.io/badge/Supabase-C9A8E0?style=for-the-badge&logo=supabase&logoColor=1a0533&labelColor=1a0533)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS-C9A8E0?style=for-the-badge&logo=tailwindcss&logoColor=1a0533&labelColor=1a0533)
![Vercel](https://img.shields.io/badge/Vercel-C9A8E0?style=for-the-badge&logo=vercel&logoColor=1a0533&labelColor=1a0533)

</div>

---

# Irasshaimase~ 🧙‍♀️✨

<img align="right" src="https://raw.githubusercontent.com/rizkaalt/rizkaalt/main/img/Profile-elaina.png" width="170" alt="Elaina profile" />

**Acellia REST API** adalah REST API untuk mengambil link unduhan media dari banyak platform sosial.
Ada sistem **API key**, **tier**, dan **limit harian**, lengkap dengan dashboard dan dokumentasi bertema Material 3 ala Elaina.

<br clear="right" />

---

<div align="center">
  <img src="https://raw.githubusercontent.com/rizkaalt/rizkaalt/main/img/AboutMe-elaina.png" width="100%" alt="About" />
</div>

```text
Tentang Sihir Ini

Nama      : Acellia REST API
Wujud     : REST API + Dashboard + Docs
Fondasi   : Next.js 14 · Supabase · @coflyn/scrapr
Kemampuan : TikTok HD tanpa watermark · multi-platform
Penjaga   : API key · tier · rate limit harian
Motto     : download media semudah sihir~
```

<div align="center">

**✨ Fitur Sihir ✨**

</div>

| ✦ | Kemampuan | Keterangan |
|---|-----------|------------|
| 🎬 | TikTok HD tanpa watermark | TikWM sebagai jalur utama, scrapr sebagai cadangan |
| 🌐 | Multi-platform | Instagram, YouTube, X, Facebook, Spotify, Threads, Pinterest, dan banyak lagi |
| 🧩 | Semua method scrapr | Downloader, resolver link, anime, dan komik lewat satu pola endpoint |
| 🔑 | API key pribadi | Dibuat otomatis saat daftar, disimpan sebagai hash, bisa di-regenerate |
| ⏳ | Limit harian | Free 100 · Partner 500 · Owner unlimited, lengkap dengan header `X-RateLimit-*` |
| 🛡️ | Aman | Validasi URL, anti-SSRF, API key tidak pernah disimpan mentah |

---

<div align="center">

**🪄 Tier & Limit 🪄**

</div>

| Tier | Limit / hari | Cara dapat |
|------|--------------|------------|
| `free` | 100 | Default saat daftar |
| `partner` | 500 | Dinaikkan admin |
| `owner` | Unlimited | By invitation |

---

### 🔌 Endpoint

| Method | Path | Fungsi |
|--------|------|--------|
| `POST` / `GET` | `/api/v1/download` | Deteksi platform otomatis dari URL |
| `GET` · `POST` | `/api/v1/scrape/{platform}/{method}` | Panggil method scrapr tertentu (`url` atau `q`) |
| `GET` | `/api/v1/me` | Profil, tier, dan pemakaian hari ini |
| `POST` | `/api/v1/keys/regenerate` | Buat API key baru |
| `GET` | `/api/v1/platforms` | Daftar semua endpoint |

Daftar lengkap beserta contoh ada di halaman **`/docs`** setelah login.

Semua respons berbentuk JSON:

```json
{ "success": true, "message": "OK", "data": { } }
```

Saat limit habis, API membalas `429`:

```json
{
  "success": false,
  "error": "DAILY_LIMIT_EXCEEDED",
  "message": "Limit harian habis, upgrade ke Partner.",
  "limit": 100,
  "used": 100,
  "reset_at": "2026-11-23T00:00:00.000Z"
}
```

---

### 🚀 Setup Lokal

**1. Siapkan Supabase**
1. Buat project di [supabase.com](https://supabase.com).
2. Buka **SQL Editor**, paste isi `supabase/migrations/0001_init.sql`, lalu **Run**.
3. Jalankan juga izin tabel ini (Supabase baru tidak memberi izin otomatis):

```sql
grant usage on schema public to service_role, authenticated;
grant select, insert, update, delete on public.profiles, public.api_usage, public.request_logs to service_role;
grant usage, select on all sequences in schema public to service_role;
grant execute on function public.consume_quota(uuid, int) to service_role;
grant select on public.profiles, public.api_usage, public.request_logs to authenticated;
```

4. **Authentication → Sign In / Providers → Email**: matikan **Confirm email** (tanpa verifikasi).

**2. Isi environment**

```bash
cp .env.example .env.local
```

| Variabel | Isi |
|----------|-----|
| `NEXT_PUBLIC_SUPABASE_URL` | Project URL, contoh `https://abcd.supabase.co` (tanpa `/rest/v1/` dan tanpa `/` di akhir) |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Publishable / `anon` key |
| `SUPABASE_SERVICE_ROLE_KEY` | Secret / `service_role` key (**rahasia**) |
| `API_KEY_PEPPER` | String acak panjang. Jangan diganti setelah ada user, atau semua API key lama jadi tidak valid |

**3. Jalankan**

```bash
npm install
npm run dev
```

Buka http://localhost:3000, daftar, lalu simpan API key yang muncul. Key hanya ditampilkan **sekali**.

---

### ☁️ Deploy ke Vercel

1. Push repo ke GitHub.
2. [vercel.com](https://vercel.com) → **Add New → Project** → pilih repo.
3. Isi 4 environment variable di atas.
   - `NEXT_PUBLIC_*` dengan tipe **Config**.
   - `SUPABASE_SERVICE_ROLE_KEY` dan `API_KEY_PEPPER` dengan tipe **Secret**.
4. Klik **Deploy**.

`vercel.json` sudah mengatur `maxDuration` 60 detik untuk `app/api/**`, dan semua route memakai `runtime = "nodejs"`.

> Setelah mengubah environment variable, lakukan **Redeploy** supaya nilai barunya terpakai.

---

### 🌸 Custom Domain (Step by Step)

Contoh di bawah memakai `domainkamu.contoh`. Ganti dengan domain milikmu.
Hasil akhirnya: API bisa diakses di `https://api.domainkamu.contoh`.

**1. Tambahkan domain di Vercel**
1. Buka project di Vercel → **Settings → Domains**.
2. Ketik `api.domainkamu.contoh`, lalu klik **Add**.
3. Vercel menampilkan record DNS yang harus dibuat. Biasanya berbentuk **CNAME**.

**2. Buat record DNS**

Masuk ke panel DNS tempat domain kamu dikelola (Cloudflare, Niagahoster, IDCloudHost, Namecheap, dan sebagainya), lalu tambahkan:

| Type | Name / Host | Value / Target |
|------|-------------|----------------|
| `CNAME` | `api` | `cname.vercel-dns.com` |

Pakai nilai yang ditampilkan Vercel kalau berbeda dari contoh ini.

> Kalau memakai **Cloudflare**, ubah status proxy record itu menjadi **DNS only** (awan abu-abu), supaya Vercel bisa menerbitkan sertifikat HTTPS.

Kalau ingin domain utamanya (`domainkamu.contoh`, tanpa `api.`), Vercel biasanya meminta record **A** ke `76.76.21.21`. Ikuti yang tertulis di halaman Domains.

**3. Tunggu verifikasi**
- Kembali ke halaman Domains di Vercel dan tunggu statusnya **Valid Configuration**. Biasanya beberapa menit, kadang sampai beberapa jam.
- HTTPS aktif otomatis setelah valid.

**4. Perbarui base URL di kode**

Edit `lib/config.ts`:

```ts
export const BASE_URL = "https://api.domainkamu.contoh";
```

Lalu commit dan push. Contoh curl di halaman `/docs` akan memakai alamat barumu.

**5. Tes**

```bash
curl https://api.domainkamu.contoh/api/v1/me -H "x-api-key: sk_live_..."
```

---

### 👑 Jadikan User Owner

Jalankan di Supabase SQL Editor:

```sql
update profiles set tier = 'owner' where email = 'kamu@email.com';
```

Tier `partner` dengan cara yang sama, ganti `'owner'` menjadi `'partner'`.

---

### 🧪 Contoh Pemakaian

**cURL**

```bash
curl -X POST https://api.domainkamu.contoh/api/v1/download \
  -H "x-api-key: sk_live_..." \
  -H "Content-Type: application/json" \
  -d '{"url":"https://www.tiktok.com/@user/video/123"}'
```

**Node.js (misalnya untuk bot WhatsApp)**

```js
const res = await fetch("https://api.domainkamu.contoh/api/v1/download", {
  method: "POST",
  headers: { "x-api-key": process.env.ACELLIA_KEY, "Content-Type": "application/json" },
  body: JSON.stringify({ url }),
  signal: AbortSignal.timeout(30000),
});
const json = await res.json();
console.log(json.data.downloads);
```

---

### 🗂️ Struktur Project

```text
app/            halaman (landing, login, register, dashboard, pricing, docs) + route API
components/     komponen UI Material 3 + dekorasi Elaina
lib/            auth API key, rate limit, scraper, katalog endpoint
supabase/       migration SQL (tabel, RPC, RLS)
vendor/scrapr   scraper reference (@coflyn/scrapr)
```

---

### ⚠️ Catatan

- Scraper bergantung pada situs pihak ketiga. Situs bisa berubah atau mati kapan saja, dan sebagian scraper butuh browser headless sehingga tidak jalan di Vercel.
- Proyek ini dibuat untuk belajar dan penggunaan pribadi. Gunakan hanya untuk konten yang kamu punya haknya, dan patuhi ketentuan tiap platform.
- Vercel Hobby hanya untuk penggunaan non-komersial.
- `vendor/scrapr` memakai lisensi MIT miliknya sendiri.

---

<div align="center">
  <img src="https://raw.githubusercontent.com/rizkaalt/rizkaalt/main/img/banner-miss-you.jpg" width="70%" alt="banner" />

<br />

<img src="https://raw.githubusercontent.com/rizkaalt/rizkaalt/main/img/elaina-happy.png" width="130" alt="Elaina happy" />

[![Visitor Badge](https://komarev.com/ghpvc/?username=rizkaalt&color=C9A8E0&style=for-the-badge&label=Pengunjung+Penyihir)](https://github.com/rizkaalt)

*Terima kasih sudah mampir ke duniaku~ また来てね！✨*

</div>
