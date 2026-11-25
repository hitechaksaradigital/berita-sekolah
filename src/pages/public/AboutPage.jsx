import PublicLayout from '../../components/common/PublicLayout'
import { SITE } from '../../config/site'

const STRIP = [
  { src: '/images/tisa-students.jpg', alt: 'Siswa berkumpul di halaman sekolah' },
  { src: '/images/fabrication-lab-wing-watts-hall-north-carolina.jpg', alt: 'Ruang praktik sains dan teknologi sekolah' },
  { src: '/images/summit-high-school-at-awards-ceremony-june.jpg', alt: 'Upacara penghargaan siswa' },
]

export default function AboutPage() {
  return (
    <PublicLayout>
      <section className="frame section about-page" style={{ paddingTop: 72 }}>
        <div className="axis-title">
          <p className="axis-title__side reveal">Tentang portal dan alur kerja redaksinya.</p>
          <h1 className="display">Tentang portal berita</h1>
        </div>

        <figure className="about-hero reveal">
          <img src="/images/students-reading-at-tables-in-school-library.jpg" alt="Siswa membaca di perpustakaan sekolah" />
        </figure>

        <div className="facts-row" style={{ marginTop: 72 }}>
          <div className="facts reveal">
            <div><div className="fact__label">Nama</div><div className="fact__value">{SITE.name}</div></div>
            <div><div className="fact__label">Berdiri</div><div className="fact__value">{SITE.founded}</div></div>
            <div><div className="fact__label">Alamat</div><div className="fact__value">{SITE.address}</div></div>
          </div>
          <div className="reveal">
            <p className="facts-row__body reveal" style={{ maxWidth: '34ch', fontSize: 'clamp(1.25rem, 1.7vw, 1.625rem)' }}>
              Portal ini dikelola oleh Humas sekolah bersama siswa jurnalis. Setiap tulisan disunting sebelum tampil di halaman utama.
            </p>
          </div>
        </div>

        <div className="about-strip" aria-hidden="true">
          {STRIP.map((image) => (
            <div className="reveal" key={image.src}>
              <img src={image.src} alt="" loading="lazy" />
            </div>
          ))}
        </div>

        <div className="about-editorial reveal" style={{ marginTop: 96 }}>
          <div className="article">
            <h2 className="reveal">Alur penerbitan</h2>
            <p className="reveal">Siswa dan guru yang masuk ke dashboard redaksi menulis berita sebagai draf. Admin Humas meninjau draf tersebut, memastikan fakta dan bahasanya sudah tepat, lalu mempublikasikannya. Berita yang sudah terbit tampil di beranda, halaman kategori, dan hasil pencarian.</p>
            <h2 className="reveal">Hubungi redaksi</h2>
            <p className="reveal">Untuk usulan kabar, koreksi, atau kerja sama, kirim pesan ke {SITE.email} atau telepon {SITE.phone}. Saran Anda membantu kami menjaga kabar sekolah tetap akurat dan berguna.</p>
          </div>
        </div>
      </section>
    </PublicLayout>
  )
}
