// Data contoh untuk pratinjau saat kredensial Supabase belum diisi.
// Saat VITE_SUPABASE_URL & VITE_SUPABASE_ANON_KEY tersedia, file ini tidak dipakai.
const STORAGE_KEY = 'berita-sekolah-demo-v1'

export const DEMO_PROFILES = [
  {
    id: '11111111-1111-4111-8111-111111111111',
    full_name: 'Ibu Rina — Humas',
    email: 'admin@sekolahkita.sch.id',
    role: 'admin',
    avatar_url: null,
  },
  {
    id: '22222222-2222-4222-8222-222222222222',
    full_name: 'Andi Pratama — OSIS',
    email: 'writer@sekolahkita.sch.id',
    role: 'writer',
    avatar_url: null,
  },
  {
    id: '33333333-3333-4333-8333-333333333333',
    full_name: 'Siti Aisyah — Jurnalistik',
    email: 'siswa@sekolahkita.sch.id',
    role: 'writer',
    avatar_url: null,
  },
]

export const DEMO_CATEGORIES = [
  { id: 1, name: 'Prestasi', slug: 'prestasi' },
  { id: 2, name: 'Pengumuman', slug: 'pengumuman' },
  { id: 3, name: 'Kegiatan OSIS', slug: 'kegiatan-osis' },
  { id: 4, name: 'Akademik', slug: 'akademik' },
  { id: 5, name: 'Artikel', slug: 'artikel' },
]

const paragraph = (text) => `<p>${text}</p>`

const DEMO_POSTS = [
  {
    id: 'a1000000-0000-4000-8000-000000000001',
    title: 'Siswa Raih Juara Nasional Karya Tulis Ilmiah',
    slug: 'siswa-juara-nasional-karya-tulis-ilmiah',
    excerpt: 'Dua siswa kelas XII membawa pulang trofi nasional setelah meneliti pengelolaan sampah di lingkungan sekolah.',
    content: [
      paragraph('Dua siswa kelas XII Sekolah Kita meraih juara nasional dalam Kompetisi Karya Tulis Ilmiah tingkat SMA se-Indonesia. Penelitian mereka membahas pengelolaan sampah organik di kantin sekolah.'),
      '<h2>Riset yang dimulai dari kantin</h2>',
      paragraph('Selama tiga bulan, tim mengamati timbulan sampah harian, mewawancarai penjual kantin, dan menguji komposter sederhana hasil rancangan mereka sendiri. Data tersebut kemudian menjadi dasar rekomendasi untuk sekolah.'),
      paragraph('"Kami ingin membuktikan bahwa perubahan kecil di lingkungan sekitar bisa diukur dan dilaporkan dengan baik," kata ketua tim dalam wawancara usai pengumuman pemenang.'),
      '<h2>Langkah berikutnya</h2>',
      paragraph('Hasil riset akan dipresentasikan dalam forum ilmiah sekolah dan dijadikan bahan pertimbangan program sekolah ramah lingkungan tahun depan.'),
    ].join(''),
    thumbnail_url: '/images/summit-high-school-at-awards-ceremony-june.jpg',
    category_id: 1,
    author_id: '33333333-3333-4333-8333-333333333333',
    status: 'published',
    is_featured: true,
    views_count: 1284,
    published_at: '2026-11-22T07:30:00+07:00',
    created_at: '2026-11-20T09:12:00+07:00',
    updated_at: '2026-11-22T07:30:00+07:00',
  },
  {
    id: 'a1000000-0000-4000-8000-000000000002',
    title: 'Jadwal Ujian Tengah Semester Genap Diumumkan',
    slug: 'jadwal-ujian-tengah-semester-genap',
    excerpt: 'Seluruh siswa dapat melihat jadwal UTS, ruang ujian, dan ketentuan pengawasan melalui papan pengumuman digital.',
    content: [
      paragraph('Panitia ujian telah menetapkan jadwal Ujian Tengah Semester Genap tahun ajaran 2026/2027. Pelaksanaan berlangsung selama lima hari pelajaran dengan rentang waktu 07.30 sampai 11.30.'),
      '<h2>Yang perlu disiapkan</h2>',
      paragraph('Siswa wajib membawa kartu peserta ujian, alat tulis, dan penggaris tanpa kalkulator kecuali mata pelajaran yang menentukan lain. Daftar ruang ujian diumumkan paling lambat tiga hari sebelum pelaksanaan.'),
      paragraph('Ketentuan lengkap dapat dilihat pada papan pengumuman digital di gerbang sekolah dan melalui akun masing-masing.'),
    ].join(''),
    thumbnail_url: '/images/a-student-saying-the-national-pledge.jpg',
    category_id: 2,
    author_id: '11111111-1111-4111-8111-111111111111',
    status: 'published',
    is_featured: false,
    views_count: 967,
    published_at: '2026-11-20T10:00:00+07:00',
    created_at: '2026-11-19T14:25:00+07:00',
    updated_at: '2026-11-20T10:00:00+07:00',
  },
  {
    id: 'a1000000-0000-4000-8000-000000000003',
    title: 'Laboratorium Kreatif Sekolah Dibuka Kembali',
    slug: 'laboratorium-kreatif-sekolah-dibuka-kembali',
    excerpt: 'Fasilitas fabrikasi digital kini dapat dipakai ekskul robotika dan kelas desain setelah renovasi dua bulan.',
    content: [
      paragraph('Setelah menjalani renovasi selama dua bulan, laboratorium kreatif sekolah kembali dibuka. Ruangan ini dilengkapi area fabrikasi digital, perangkat pemodelan, dan meja kerja kelompok.'),
      paragraph('Penggunaan laboratorium dijadwalkan melalui guru pembimbing masing-masing ekskul. Siswa dari kelas desain dan robotika menjadi pengguna pertama pada pekan ini.'),
    ].join(''),
    thumbnail_url: '/images/fabrication-lab-wing-watts-hall-north-carolina.jpg',
    category_id: 4,
    author_id: '22222222-2222-4222-8222-222222222222',
    status: 'published',
    is_featured: false,
    views_count: 642,
    published_at: '2026-11-18T08:15:00+07:00',
    created_at: '2026-11-17T11:00:00+07:00',
    updated_at: '2026-11-18T08:15:00+07:00',
  },
  {
    id: 'a1000000-0000-4000-8000-000000000004',
    title: 'OSIS Gelar Bakti Sosial Akhir Pekan Ini',
    slug: 'osis-gelar-bakti-sosial-akhir-pekan-ini',
    excerpt: 'Siswa akan mengunjungi panti asuhan sekitar dengan program membaca bersama dan donasi buku hasil patroli literasi.',
    content: [
      paragraph('Dewan pengurus OSIS mengumumkan kegiatan bakti sosial akhir pekan ini. Rencana kegiatan meliputi sesi membaca bersama, berbagi alat tulis, dan perbaikan kecil fasilitas perpustakaan mitra.'),
      paragraph('Pendaftaran peserta dibuka hingga hari Kamis melalui koordinator ekskul masing-masing. Kuota peserta dibatasi agar kegiatan tetap nyaman dan aman.'),
    ].join(''),
    thumbnail_url: '/images/tisa-students.jpg',
    category_id: 3,
    author_id: '22222222-2222-4222-8222-222222222222',
    status: 'published',
    is_featured: false,
    views_count: 438,
    published_at: '2026-11-15T13:45:00+07:00',
    created_at: '2026-11-14T16:20:00+07:00',
    updated_at: '2026-11-15T13:45:00+07:00',
  },
  {
    id: 'a1000000-0000-4000-8000-000000000005',
    title: 'Perpustakaan Menambah 500 Koleksi Baru',
    slug: 'perpustakaan-menambah-500-koleksi-baru',
    excerpt: 'Koleksi baru terdiri dari buku pelajaran, literatur fiksi, dan referensi karir yang dapat dipinjam mulai hari ini.',
    content: [
      paragraph('Perpustakaan sekolah menerima tambahan 500 buku hasil kerja sama dengan penerbit lokal dan donasi orang tua siswa. Koleksi baru sudah dapat dipinjam dengan kartu perpustakaan.'),
      paragraph('Pengguna perpustakaan dapat mencari judul melalui katalog digital yang tersedia di komputer area baca.'),
    ].join(''),
    thumbnail_url: '/images/students-reading-at-tables-in-school-library.jpg',
    category_id: 4,
    author_id: '33333333-3333-4333-8333-333333333333',
    status: 'published',
    is_featured: false,
    views_count: 351,
    published_at: '2026-11-12T09:00:00+07:00',
    created_at: '2026-11-11T10:40:00+07:00',
    updated_at: '2026-11-12T09:00:00+07:00',
  },
  {
    id: 'a1000000-0000-4000-8000-000000000006',
    title: 'Catatan dari Kelas: Belajar Bersama di Era Digital',
    slug: 'catatan-dari-kelas-belajar-bersama-di-era-digital',
    excerpt: 'Refleksi siswa tentang cara menjaga percakapan dan kolaborasi tetap hidup di tengah belajar yang serba daring.',
    content: [
      paragraph('Teknologi membuat bahan pelajaran lebih mudah diakses, tetapi pertanyaan yang muncul di ruang kelas tetap tidak bisa digantikan oleh layar.'),
      paragraph('Di artikel ini, beberapa siswa berbagi kebiasaan kecil yang membantu mereka tetap fokus: mencatat dengan tangan, bertanya bergiliran, dan membaca ulang bersama teman sebangku.'),
    ].join(''),
    thumbnail_url: '/images/asian-students-at-the-kalahan.jpg',
    category_id: 5,
    author_id: '33333333-3333-4333-8333-333333333333',
    status: 'published',
    is_featured: false,
    views_count: 287,
    published_at: '2026-11-08T15:20:00+07:00',
    created_at: '2026-11-07T12:00:00+07:00',
    updated_at: '2026-11-08T15:20:00+07:00',
  },
  {
    id: 'a1000000-0000-4000-8000-000000000007',
    title: 'Upacara Bendera Peringatan Hari Kemerdekaan',
    slug: 'upacara-bendera-peringatan-hari-kemerdekaan',
    excerpt: 'Seluruh warga sekolah mengikuti upacara dengan pembacaan teks proklamasi dan serangkaian lomba tradisional.',
    content: [
      paragraph('Upacara bendera dilaksanakan di lapangan sekolah dengan pembina upacara dari jajaran guru. Kegiatan dilanjutkan dengan lomba tradisional yang diikuti perwakilan tiap kelas.'),
    ].join(''),
    thumbnail_url: '/images/new-jersey-youth-challenge-academy.jpg',
    category_id: 3,
    author_id: '22222222-2222-4222-8222-222222222222',
    status: 'published',
    is_featured: false,
    views_count: 512,
    published_at: '2026-08-17T08:00:00+07:00',
    created_at: '2026-08-16T13:00:00+07:00',
    updated_at: '2026-08-17T08:00:00+07:00',
  },
  {
    id: 'a1000000-0000-4000-8000-000000000008',
    title: 'Draf: Profil Ekskul Jurnalistik Sekolah',
    slug: 'draf-profil-ekskul-jurnalistik-sekolah',
    excerpt: 'Kenalan dengan tim yang menulis dan menyunting kabar sekolah setiap minggu.',
    content: [paragraph('Ekskul jurnalistik terbuka untuk siswa yang suka menulis, mewawancara, dan memotret kegiatan sekolah.')].join(''),
    thumbnail_url: null,
    category_id: 5,
    author_id: '22222222-2222-4222-8222-222222222222',
    status: 'draft',
    is_featured: false,
    views_count: 0,
    published_at: null,
    created_at: '2026-11-23T10:00:00+07:00',
    updated_at: '2026-11-23T10:00:00+07:00',
  },
]

function seed() {
  return {
    categories: structuredClone(DEMO_CATEGORIES),
    posts: structuredClone(DEMO_POSTS),
    profiles: structuredClone(DEMO_PROFILES),
    session: null,
  }
}

export function readDemo() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) {
      const initial = seed()
      localStorage.setItem(STORAGE_KEY, JSON.stringify(initial))
      return initial
    }
    return JSON.parse(raw)
  } catch {
    return seed()
  }
}

export function writeDemo(state) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
  return state
}

export function updateDemo(mutator) {
  const state = readDemo()
  const next = mutator(state)
  return writeDemo(next || state)
}
