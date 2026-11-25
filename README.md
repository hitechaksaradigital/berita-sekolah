# Portal Berita Sekolah

Website berita sekolah berbasis **React + Vite + Supabase**, siap dibangun menjadi file statis lalu di-upload ke **cPanel** (`public_html`). Pengunjung bisa membaca dan mencari berita; penulis (`writer`) membuat draft; admin (`admin`) mempublikasikan berita, mengelola kategori dan pengguna, serta mengunduh laporan berita CSV.

---

## 1. Jalankan di komputer

Butuh Node.js 18 atau lebih baru.

```bash
npm install
npm run dev
```

Buka alamat local yang ditampilkan Vite (biasanya `http://localhost:5173`).

Skrip lain:

```bash
npm run lint    # eslint
npm run build   # menghasilkan folder dist/
npm run preview # pratinjau hasil build
```

### Mode demo (fallback, saat ini nonaktif)

Selama `.env` belum berisi kredensial yang valid, aplikasi otomatis memakai **data contoh** dan **login tiruan** yang tersimpan di `localStorage`. Ini memungkinkan seluruh alur diceka tanpa backend. Pada checkout ini `.env` sudah terisi untuk project `berita-sekolah`, jadi mode demo **tidak dipakai**.

| Peran | Email | Kata sandi |
| --- | --- | --- |
| Admin | `admin@sekolahkita.sch.id` | apa saja, minimal 6 karakter |
| Penulis | `writer@sekolahkita.sch.id` | apa saja, minimal 6 karakter |

Mode demo **hanya untuk pratinjau**. Berita, kategori, dan sesi yang dibuat tidak terbawa lintas perangkat, dan tautan gambar hasil unggahan hanya berlaku selama sesi browser tersebut.

---

## 2. Siapkan Supabase

### Project yang sudah terhubung

| Item | Nilai |
| --- | --- |
| Nama project | `berita-sekolah` |
| Project ref | `xvfnepiofimorudvwbes` |
| Region | `ap-southeast-1` (Singapura) |
| URL | `https://xvfnepiofimorudvwbes.supabase.co` |
| Status skema | `supabase/schema.sql` sudah diterapkan (tabel, RLS, RPC, bucket, 5 kategori) |
| Konten | 8 berita: 7 `published`, 1 `draf` |
| Akun | 1 admin (`admin@sekolahkita.sch.id`), 2 penulis (`writer@…`, `siswa@…`) |

Kata sandi awal ada di [`supabase/credentials.local.md`](supabase/credentials.local.md) (file ini **tidak ikut di-commit**). Ganti kata sandi tersebut sebelum situs dipakai produksi.

Langkah 1–6 di bawah hanya diperlukan bila Anda membuat project Supabase baru. Untuk project di atas, lanjut ke bagian 3.

1. Buat project baru di [Supabase Dashboard](https://supabase.com/dashboard).
2. Buka **SQL Editor → New query**, tempel seluruh isi [`supabase/schema.sql`](supabase/schema.sql), lalu **Run**.  
   Skrip ini membuat tabel `profiles`, `categories`, `posts`, trigger, kebijakan RLS, fungsi `increment_post_views`, bucket Storage publik `news-images`, dan lima kategori awal. Aman dijalankan ulang.
3. Di **Authentication → Providers → Email**, aktifkan provider email. Untuk penggunaan awal yang praktis, matikan *Confirm email* atau klik konfirmasi pada email pengguna tersebut.
4. Buat akun melalui **Authentication → Users → Add user** (atau lewat form pendaftaran yang Anda sediakan). Setiap akun baru otomatis mendapat profil dengan role `writer`.
5. Untuk akun admin pertama, jalankan di SQL Editor:

   ```sql
   update public.profiles
      set role = 'admin'
    where email = 'admin@sekolahkita.sch.id';
   ```

6. Ambil **Project URL** dan **anon/public key** di **Project Settings → API**.

### Ringkasan aturan keamanan

- Publik hanya dapat membaca berita `published` dan daftar kategori.
- Pengguna login dapat membaca semua status berita; `writer` hanya membuat/edit berita miliknya dan **tidak dapat** mempublikasikan atau menandai *featured*.
- Hanya `admin` yang dapat menghapus berita, mengelola kategori, mengubah role, mempublikasikan, dan membuka menu **Laporan** untuk mengunduh CSV.
- Klik pembaca memanggil RPC `increment_post_views`; publik tidak diberi izin `UPDATE` langsung pada tabel `posts`.
- Gambar diunggah ke bucket `news-images` (publik untuk dibaca, hanya pengguna login yang boleh mengunggah). Ukuran file dikompres di browser menjadi ±300 KB sebelum diunggah.

> Profil penulis sengaja dapat dibaca publik agar nama penulis tampil pada kartu berita. Jangan menyimpan data sensitif di tabel `profiles`.

---

## 3. Hubungkan aplikasi ke Supabase

File `.env` sudah dibuat dengan kredensial project `berita-sekolah`:

```env
VITE_SUPABASE_URL=https://xvfnepiofimorudvwbes.supabase.co
VITE_SUPABASE_ANON_KEY=<anon key project tersebut>
```

Untuk clone baru, salin `.env.example` menjadi `.env` lalu isi URL dan anon key project Anda. Setelah `.env` berisi nilai yang valid, restart `npm run dev`; mode demo otomatis mati. Kunci `anon` memang terlihat di browser—keamanan bergantung pada RLS, jangan pernah memasukkan *service role key* ke dalam kode atau file `.env` yang ikut ter-build.

Pastikan `.env` tidak di-commit (sudah ada di `.gitignore`).

---

## 4. Ganti identitas dan konten contoh

Sebelum dipublish:

1. Edit [`src/config/site.js`](src/config/site.js): nama sekolah, singkatan, tagline, kota, tahun berdiri, jumlah siswa/guru, email, telepon, alamat, dan tautan sosial.
2. Ganti 8 berita contoh yang sudah ada di Supabase melalui halaman admin (`/admin/berita`). [`src/data/demo.js`](src/data/demo.js) tidak dipakai dalam mode Supabase, tetapi tetap ada di repository sebagai fallback pengembangan.
3. Ganti delapan foto contoh di `public/images/` dengan foto kegiatan sekolah Anda. Tujuh foto berlisensi **CC0** dan foto upacara Sekolah Rakyat di beranda berstatus **domain publik**; kreditnya tampil di footer lewat [`public/images/credits.json`](public/images/credits.json). Perbarui atau hapus berkas credits bila semua foto sudah diganti.
4. Perbarui judul/deskripsi/meta di [`index.html`](index.html) bila perlu.

---

## 5. Deploy

### Vercel (production)

Proyek ini sudah memiliki [`vercel.json`](vercel.json) untuk build Vite (`dist/`) dan rewrite SPA, sehingga rute seperti `/berita/...` tidak 404 saat di-refresh.

```bash
npx vercel login                 # hanya jika belum login
npx vercel link --yes --project berita-sekolah
npx vercel env add VITE_SUPABASE_URL --environment production --type config
npx vercel env add VITE_SUPABASE_ANON_KEY --environment production --type config
npx vercel deploy --prod --yes
```

Tambahkan pula variabel yang sama ke `preview` dan `development` bila ingin men-deploy branch lain. Kedua nilai di atas adalah URL dan **anon/publishable key** Supabase; keduanya aman dikirim ke browser karena akses data diatur oleh RLS. **Jangan** pernah menaruh *service role key* di env var `VITE_*` atau kode klien.

Folder `.vercel/` dan `.env.local` yang dibuat oleh CLI sudah masuk `.gitignore`.

### cPanel

```bash
npm run build
```

Hasil build ada di folder `dist/`. Isi folder itulah yang di-upload (bukan folder `dist`-nya).

1. Login cPanel → **File Manager** → buka `public_html` (atau folder subdomain yang dituju).
2. Buat ZIP dari **seluruh isi** `dist/`, misalnya `site.zip`.
3. Upload ZIP tersebut ke `public_html`, lalu **Extract**.
4. Pastikan file tersembunyi `.htaccess` ikut terekstrak (centang *Show Hidden Files*). File ini mengarahkan semua rute React ke `index.html` sehingga refresh pada `/berita/...` tidak 404.
5. Pastikan `index.html`, folder `assets/`, folder `images/`, dan `.htaccess` berada langsung di dalam `public_html`.
6. Kunjungi domain; lalu buka `/admin/login` untuk mengelola berita.

Untuk subdomain, taruh hasil build di folder subdomain tersebut. `vite.config.js` memakai `base: '/'`, cocok untuk domain utama; bila aplikasi dipasang di dalam subfolder (misal `/berita`), sesuaikan `base` dan `RewriteBase` pada `.htaccess`.

### Catatan SPA

Karena ini SPA murni, *preview* judul/gambar di WhatsApp saat tautan dibagikan memakai meta tag statis dari `index.html`. Untuk meta tag dinamis per artikel, gunakan layanan prerender (mis. Prerender.io atau Cloudflare Worker) di depan domain cPanel.

---

## 6. Struktur penting

```text
public/
  .htaccess              SPA fallback + cache header untuk cPanel
  images/                Foto contoh + credits.json
src/
  components/            Navbar, Footer, kartu berita, editor, uploader
  config/site.js         Identitas sekolah & nama bucket
  contexts/AuthContext.jsx
  data/demo.js           Data contoh mode demo
  lib/api.js             Semua query Supabase + fallback demo
  pages/public/          Halaman pembaca
  pages/admin/           Login, dashboard, kelola berita/kategori/pengguna, laporan CSV
  styles.css             Token desain & seluruh gaya visual
supabase/schema.sql      Skema, RLS, RPC, storage, seed kategori
```

---

## 7. Pemeriksaan yang sudah dijalankan

- `npm install` berhasil (29 peringatan kerentanan moderat dari dependensi, belum ditangani).
- `npm run lint` — 0 error, 0 warning.
- `npm run build` — berhasil menghasilkan `dist/` dengan *chunk* admin terpisah dari bundel publik, termasuk `Reports-*.js`.
- Inspeksi tata letak otonom (taste-skill, 1440/768/390 px) pada halaman publik: beranda `0 FAIL / 7 WARN`, `/berita` `0 FAIL / 3 WARN`, detail artikel `0 FAIL / 5 WARN`, `/kategori/prestasi` `0 FAIL / 2 WARN`, `/cari?q=sekolah` `0 FAIL / 3 WARN`, `/tentang` `0 FAIL / 2 WARN`.
- Inspeksi layar aplikasi (`--app`) pada halaman admin: login `0 FAIL / 0 WARN`, dashboard `0 FAIL / 0 WARN`, kelola berita `0 FAIL / 1 WARN`, editor `0 FAIL / 2 WARN`. Sisa peringatan bersifat disengaja: angka pada tabel mobile dirata-kiri karena tabel berubah menjadi tumpukan baris; kanvas editor kosong dan kartu metadata yang lebih pendek adalah kondisi normal saat menulis berita baru. Halaman laporan mengikuti pola tabel dan kartu yang sama.
- Lint sumber taste-skill mode aplikasi: `0 FAIL / 1 WARN` (tanda pisah em pada teks contoh). Mode publik tetap menandai garis 1 px pada komponen admin karena kedua gaya berada dalam satu `src/styles.css`; garis tersebut justru diizinkan oleh sheet aplikasi.

### Verifikasi Supabase sungguhan (25 Nov 2026)

- Auth: login `admin`, `writer`, dan `siswa` melalui `/auth/v1/token?grant_type=password` mengembalikan HTTP 200 + `access_token`. Penyebab gagal sebelumnya (`email_change` NULL pada `auth.users`) sudah diperbaiki.
- RLS lewat REST: anon hanya melihat 7 berita `published`; pengguna login melihat 8 (termasuk draf). Writer dapat mengedit draf miliknya, tetapi tidak dapat mempublikasikan (403 `42501`) atau mengedit berita penulis lain; admin dapat mengedit draf. Upaya writer mengubah role sendiri tidak berubah di database.
- RPC `increment_post_views` dan bucket Storage `news-images`: unggah anon ditolak, unggah/login writer berhasil, hapus objek uji berhasil.
- UI: beranda memuat 6 berita + kategori langsung dari `*.supabase.co/rest/v1` (HTTP 200); login admin berhasil dan dashboard menampilkan 8 berita / 7 terbit / 1 draf.
- Laporan CSV: tombol unduh menghasilkan `laporan-berita-2026-11-25.csv` dengan BOM UTF-8, 16 kolom, dan 8 baris berita; filter status `Terbit` menghasilkan 7 baris. Menu dan rute `/admin/laporan` hanya terlihat/dapat dibuka oleh `admin`; `writer` dialihkan ke `/admin`.

Masih perlu dilakukan manual sebelum produksi: penilaian estetika screenshot, penggantian identitas sekolah, konten berita, dan foto contoh, serta rotasi kata sandi awal.
