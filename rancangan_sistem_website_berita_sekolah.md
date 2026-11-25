# Rancangan Sistem Website Berita Sekolah (React + Vite + Supabase + cPanel)

Dokumen ini berisi cetak biru (*blueprint*) arsitektur, skema basis data, keamanan, hingga panduan deployment untuk membangun portal berita sekolah modern yang cepat, aman, dan ramah terhadap hosting tradisional (cPanel).

---

## 1. Arsitektur Sistem & Tech Stack

Karena aplikasi akan di-deploy ke **cPanel** (yang umumnya hanya mendukung hosting statis atau PHP tanpa Node.js runtime secara default pada paket standar), pendekatan terbaik adalah menggunakan **Single Page Application (SPA)** dengan *Static Site Generation/Build*.

*   **Frontend Framework:** React 18+ dengan Vite (Build tool super cepat yang menghasilkan file statis HTML, CSS, dan JS murni).
*   **Routing:** React Router DOM v6+ (Menggunakan `BrowserRouter` dengan konfigurasi `.htaccess` di cPanel).
*   **Styling:** Tailwind CSS (Untuk desain responsif dan modern).
*   **Backend-as-a-Service (BaaS):** Supabase
    *   **Database:** PostgreSQL (Menyimpan data berita, kategori, profil penulis, komentar).
    *   **Authentication:** Supabase Auth (Login khusus Admin/Guru/Jurnalis Siswa).
    *   **Storage:** Supabase Storage (Menyimpan gambar thumbnail berita dan galeri agar tidak membebani kapasitas penyimpanan/inode cPanel).
*   **Rich Text Editor:** TipTap atau React-Quill (Untuk menulis dan memformat isi berita).

---

## 2. Struktur Peran Pengguna (User Roles)

1.  **Publik (Pengunjung / Siswa / Orang Tua):**
    *   Membaca berita, mencari artikel, memfilter berdasarkan kategori, melihat pengumuman, dan membagikan berita.
    *   *Tidak perlu login.*
2.  **Penulis / Jurnalis (OSIS / Ekskul Jurnalistik / Guru):**
    *   Login ke Dashboard Admin.
    *   Membuat, mengedit, dan menyimpan berita sebagai *Draft*.
3.  **Admin / Editor (Humas Sekolah / Pembina):**
    *   Memiliki semua akses Penulis.
    *   Menyetujui dan mempublikasikan berita (*Publish*).
    *   Mengelola kategori, menghapus berita, dan mengelola akun penulis.

---

## 3. Perancangan Basis Data (Supabase PostgreSQL)

Berikut adalah skema tabel yang perlu dibuat di dalam Supabase SQL Editor:

### A. Tabel `profiles` (Ekstensi dari `auth.users`)
Menyimpan data tambahan pengguna yang bisa login.
*   `id` (UUID, Primary Key, References `auth.users.id`)
*   `full_name` (Text) - Nama lengkap guru/siswa.
*   `role` (Text, Default: `'writer'`) - Nilai: `'admin'` atau `'writer'`.
*   `avatar_url` (Text, Nullable)
*   `created_at` (Timestamp with time zone)

### B. Tabel `categories`
Menyimpan kategori berita (misal: *Prestasi, Pengumuman, Kegiatan OSIS, Akademik, Artikel*).
*   `id` (Int8, Primary Key, Auto-increment)
*   `name` (Text, Unique)
*   `slug` (Text, Unique) - Contoh: `kegiatan-osis`
*   `created_at` (Timestamp with time zone)

### C. Tabel `posts` (Tabel Utama Berita)
Menyimpan seluruh konten berita dan pengumuman.
*   `id` (UUID, Primary Key, Default: `gen_random_uuid()`)
*   `title` (Text, Not Null)
*   `slug` (Text, Unique, Not Null) - Untuk URL SEO-friendly.
*   `excerpt` (Text) - Ringkasan singkat berita untuk tampilan card.
*   `content` (Text, Not Null) - Isi berita dalam format HTML/Markdown.
*   `thumbnail_url` (Text) - URL gambar dari Supabase Storage.
*   `category_id` (Int8, Foreign Key -> `categories.id`)
*   `author_id` (UUID, Foreign Key -> `profiles.id`)
*   `status` (Text, Default: `'draft'`) - Nilai: `'draft'`, `'published'`, `'archived'`.
*   `is_featured` (Boolean, Default: `false`) - Untuk ditampilkan di *Hero/Headline* utama.
*   `views_count` (Int4, Default: `0`) - Menghitung jumlah pembaca.
*   `published_at` (Timestamp with time zone, Nullable)
*   `created_at` (Timestamp with time zone, Default: `now()`)
*   `updated_at` (Timestamp with time zone)

### D. Supabase Storage Bucket
*   Buat bucket bernama **`news-images`** dengan akses **Public** agar gambar bisa dimuat langsung di halaman berita tanpa perlu token autentikasi.

---

## 4. Keamanan Data (Row Level Security / RLS)

Karena React berjalan di sisi klien (*browser*), kunci API Supabase (`ANON_KEY`) akan terlihat publik. Keamanan wajib diterapkan di level database menggunakan **RLS**:

1.  **Tabel `posts`:**
    *   `SELECT`: Publik hanya bisa membaca baris di mana `status = 'published'`. Pengguna yang login bisa membaca semua status.
    *   `INSERT`: Hanya pengguna yang login (`auth.role() = 'authenticated'`).
    *   `UPDATE`: Penulis hanya bisa mengedit miliknya sendiri (`auth.uid() = author_id`), sedangkan `admin` bisa mengedit semua.
    *   `DELETE`: Hanya role `admin`.
2.  **Tabel `categories`:**
    *   `SELECT`: Publik (Semua orang).
    *   `INSERT, UPDATE, DELETE`: Hanya role `admin`.
3.  **Storage (`news-images`):**
    *   `SELECT`: Publik.
    *   `INSERT, UPDATE, DELETE`: Hanya pengguna yang login.

---

## 5. Struktur Folder Proyek (React + Vite)

```text
website-berita-sekolah/
├── public/
│   ├── .htaccess          <-- WAJIB untuk cPanel SPA Routing
│   └── logo-sekolah.png
├── src/
│   ├── components/
│   │   ├── common/        <-- Navbar, Footer, Loader, Pagination
│   │   ├── news/          <-- NewsCard, HeroSlider, CategoryBadge
│   │   └── admin/         <-- SidebarAdmin, RichTextEditor, ImageUploader
│   ├── contexts/
│   │   └── AuthContext.jsx <-- Manajemen sesi login Supabase
│   ├── lib/
│   │   └── supabase.js    <-- Inisialisasi Supabase Client
│   ├── pages/
│   │   ├── public/
│   │   │   ├── Home.jsx
│   │   │   ├── NewsDetail.jsx
│   │   │   ├── CategoryPage.jsx
│   │   │   └── SearchPage.jsx
│   │   └── admin/
│   │       ├── Login.jsx
│   │       ├── Dashboard.jsx
│   │       ├── ManagePosts.jsx
│   │       ├── PostEditor.jsx
│   │       └── ManageCategories.jsx
│   ├── utils/
│   │   ├── formatDate.js  <-- Format tanggal Indonesia
│   │   └── slugify.js     <-- Generator slug otomatis dari judul
│   ├── App.jsx            <-- Konfigurasi Route & ProtectedRoute
│   └── main.jsx
├── .env                   <-- VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY
├── package.json
└── vite.config.js
```

---

## 6. Alur Kerja Fitur Utama

### A. Alur Publikasi Berita (Admin/Penulis)
1. Penulis masuk ke halaman `/admin/login`.
2. Membuka menu **Tulis Berita Baru**.
3. Mengisi Judul (sistem otomatis membuat *Slug*), memilih Kategori, dan mengunggah Gambar Utama.
4. Gambar langsung diunggah ke Supabase Storage (`news-images`), lalu sistem mengambil URL publiknya.
5. Menulis konten di Rich Text Editor.
6. Klik **Simpan Draft** (jika penulis adalah siswa/OSIS) atau **Publikasikan** (jika Admin/Pembina).

### B. Alur Pembacaan Berita (Publik)
1. Pengunjung membuka halaman utama (`/`). Sistem melakukan *fetch* ke Supabase untuk mengambil berita `is_featured = true` dan 6 berita terbaru dengan `status = 'published'`.
2. Pengunjung mengklik berita dan diarahkan ke `/berita/:slug`.
3. Sistem memanggil fungsi RPC (*Remote Procedure Call*) di Supabase untuk menambah `views_count + 1` secara aman tanpa membuka akses `UPDATE` tabel `posts` ke publik.

---

## 7. Konfigurasi Khusus & Panduan Upload ke cPanel

Agar aplikasi React-Vite berjalan mulus di server Apache/LiteSpeed milik cPanel tanpa error **404 Not Found** saat halaman di-refresh, ikuti langkah berikut:

### Langkah 1: Konfigurasi `vite.config.js`
Pastikan `base` diatur ke `'./'` atau `'/'` jika di-upload ke domain utama (misal: `berita.namasekolah.sch.id` atau `namasekolah.sch.id`).

```javascript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/', 
})
```

### Langkah 2: Buat File `.htaccess` di Folder `public/`
Saat Vite melakukan proses *build*, semua isi folder `public/` akan disalin ke folder `dist/`. Buat file bernama `.htaccess` di dalam `public/` dengan isi berikut:

```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteCond %{REQUEST_FILENAME} !-l
  RewriteRule . /index.html [L]
</IfModule>
```
*Fungsi: Mengarahkan semua rute URL (seperti `/berita/juara-lomba` atau `/admin`) kembali ke `index.html` agar ditangani oleh React Router.*

### Langkah 3: Proses Build di Lokal
1. Pastikan file `.env` sudah terisi dengan kredensial Supabase Production:
   ```env
   VITE_SUPABASE_URL=https://xyzcompany.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6...
   ```
2. Jalankan perintah build di terminal:
   ```bash
   npm run build
   ```
3. Akan muncul folder baru bernama **`dist/`** yang berisi file `index.html`, `.htaccess`, dan folder `assets/`.

### Langkah 4: Upload ke cPanel
1. Login ke **cPanel** sekolah.
2. Buka **File Manager** -> masuk ke folder **`public_html`** (atau folder subdomain jika menggunakan subdomain seperti `berita.sekolah.sch.id`).
3. Kompres seluruh **isi** di dalam folder `dist/` menjadi file `.zip` (misal: `build.zip`). *Catatan: Zip isinya, bukan folder `dist`-nya.*
4. Upload `build.zip` ke `public_html` di cPanel, lalu klik **Extract**.
5. Pastikan file `.htaccess` ikut terekstrak (aktifkan opsi *Show Hidden Files* di pengaturan kanan atas File Manager cPanel untuk memastikannya).
6. Selesai! Website berita sekolah sudah aktif dan dapat diakses.

---

## 8. Rekomendasi Pengembangan Lanjutan (Opsional)
*   **Optimasi Gambar:** Gunakan library seperti `browser-image-compression` di sisi React sebelum gambar diunggah ke Supabase Storage agar ukuran file tetap kecil (< 300KB) sehingga menghemat kuota bandwidth gratis Supabase.
*   **SEO & OpenGraph:** Karena SPA murni memiliki keterbatasan saat link dibagikan ke WhatsApp/Media Sosial (preview judul & gambar tidak muncul dinamis), Anda bisa menggunakan layanan gratis seperti **Prerender.io** atau memanfaatkan **Cloudflare Workers** di depan domain cPanel untuk menyuntikkan meta tag dinamis khusus bot media sosial.