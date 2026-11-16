# Miftah PS — Rental PlayStation (Nuxt 4)

Website rental PlayStation dengan Nuxt 4, Tailwind CSS 4, dan database Neon (PostgreSQL).
Semua isi website (konsol, ruangan, game, promo, pengaturan, foto) disimpan di database dan dikelola lewat halaman admin. Tidak ada data contoh di dalam kode.

## Menjalankan

Butuh Node.js **22.22.3 atau lebih baru** (syarat Nuxt 4.6).

```bash
npm i
cp .env.example .env     # lalu isi DATABASE_URL dan ADMIN_PASSWORD
npm run dev
```

Buka http://localhost:3000. Tabel database dibuat otomatis saat pertama kali dibuka.

## Halaman

| Alamat | Isi |
| --- | --- |
| `/` | Beranda (hero, ringkasan konsol, ruangan, promo, tentang) |
| `/konsol`, `/konsol/:slug` | Daftar konsol dan halaman lengkap + tombol booking WhatsApp |
| `/ruangan`, `/ruangan/:slug` | Daftar ruangan dan halaman lengkap + tombol booking WhatsApp |
| `/game` | List Game, bisa difilter PS3 / PS4 / PS5 dan dicari |
| `/promo`, `/tentang`, `/kontak` | Info & Promo, Tentang, Kontak + form booking |
| `/admin` | Admin (login hanya dengan password) |

## Admin

Masuk di `/admin` memakai `ADMIN_PASSWORD` dari file `.env`. Menu: Konsol, Ruangan, Game, Promo, Pengaturan.

- Foto diupload dengan **tarik ke kotak upload atau klik untuk memilih** (bisa banyak sekaligus). Foto dikecilkan otomatis di browser, lalu disimpan di database Neon. Foto pertama jadi sampul.
- Nomor WhatsApp, alamat, jam buka, dan link sosmed diisi di **Pengaturan**. Semua tombol booking memakai nomor itu.
- Harga tidak ditampilkan. Ruangan punya kolom "Info tarif" yang boleh dikosongkan.

## Data awal (opsional)

Kalau mau langsung ada isi, buka Neon Console -> SQL Editor, lalu jalankan isi `db/seed.sql` (setelah `npm run dev` pernah dibuka). Aman dijalankan berulang.

## Deploy ke Vercel / Netlify

1. Push ke GitHub, import project.
2. Isi Environment Variables: `DATABASE_URL`, `ADMIN_PASSWORD` (dan `SESSION_SECRET` berupa teks acak panjang, opsional).
3. Deploy. Tidak perlu konfigurasi tambahan. Foto disimpan di database sehingga aman di hosting serverless (disk-nya read-only).

## SEO dan sitemap

- `/sitemap.xml` dibuat otomatis: halaman tetap + halaman detail konsol dan ruangan dari database.
- `/robots.txt` menunjuk ke sitemap dan menutup `/admin` dari mesin pencari.
- Kata kunci utama: **rental ps tasikmalaya** dan **rental ps miftah**. Ada di meta keywords, judul, deskripsi, dan data terstruktur (JSON-LD) di beranda. Ubah di `app/utils/seo.ts`.
- Isi `SITE_URL` di `.env` (atau Environment Variables Vercel) dengan domain asli, lalu daftarkan `https://domain-kamu/sitemap.xml` di Google Search Console.

## Struktur singkat

```
app/            tampilan (pages, components, layouts)
server/api/     API publik dan /api/admin/* (wajib login)
server/utils/   koneksi Neon, login, CRUD
db/seed.sql     data awal opsional
```
