import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Navbar from '../../components/common/Navbar'
import Footer from '../../components/common/Footer'
import Loader from '../../components/common/Loader'
import PinnedDeck from '../../components/news/PinnedDeck'
import { getCategories, getPublishedPosts } from '../../lib/api'
import { SITE } from '../../config/site'
import { formatDate } from '../../utils/formatDate'
import { readingTime } from '../../utils/formatDate'

export default function Home() {
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [featured, setFeatured] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const frame = window.requestAnimationFrame(() => {
      document.querySelector('.hero')?.classList.add('hero-ready')
    })
    return () => window.cancelAnimationFrame(frame)
  }, [])

  useEffect(() => {
    let active = true
    Promise.all([
      getPublishedPosts({ limit: 6 }),
      getPublishedPosts({ featured: true, limit: 1 }),
      getCategories(),
    ])
      .then(([latest, featured, cats]) => {
        if (!active) return
        setPosts(latest)
        setFeatured(featured[0] || latest[0] || null)
        setCategories(cats)
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [])

  const announcements = posts.filter((post) => post.categories?.slug === 'pengumuman').slice(0, 4)
  const achievements = posts.filter((post) => post.categories?.slug === 'prestasi').slice(0, 4)

  return (
    <div id="top">
      <Navbar absolute />
      <main>
        <section className="hero">
          <div className="hero__inner">
            <img
              className="hero__photo"
              src="/images/siswa-sekolah-rakyat-upacara.jpg"
              alt="Siswa-siswi Sekolah Rakyat mengikuti upacara HUT RI"
              width="1040" height="694"
            />
            <div className="hero__support">
              Prestasi, pengumuman, dan kegiatan. Ditulis siswa, disunting guru, untuk seluruh komunitas sekolah.
            </div>
            <div className="hero__statement">
              <h1 className="display">
                <span className="mask-line"><span>Kabar sekolah,</span></span>
                <span className="mask-line"><span>satu halaman.</span></span>
              </h1>
              <div className="hero__action">
                <a href="#kabar" className="btn btn--accent">Baca berita terbaru</a>
                <span className="hero__stamp">Edisi {formatDate(new Date(), { withDay: true })}</span>
              </div>
            </div>
          </div>
        </section>

        {loading ? <Loader label="Mengambil kabar dari redaksi…" /> : error ? (
          <div className="frame section"><h2 className="headline">Kabar belum dapat dimuat</h2><p className="muted">{error}</p></div>
        ) : (
          <>
            {featured && (
              <section className="intro frame" aria-labelledby="headline-utama">
                <img
                  className="intro__photo"
                  src={featured.thumbnail_url || '/images/tisa-students.jpg'}
                  alt="Suasana kegiatan sekolah"
                  width="1400" height="1050"
                />
                <div className="intro__content">
                  <h2 className="headline intro__title" id="headline-utama">
                    <Link to={`/berita/${featured.slug}`}>{featured.title}</Link>
                  </h2>
                  <p className="intro__body">{featured.excerpt}</p>
                  <div className="intro__meta">
                    <Link to={`/berita/${featured.slug}`} className="text-link">Baca selengkapnya →</Link>
                    <span>{formatDate(featured.published_at)}</span>
                    <span>·</span>
                    <span>{readingTime(featured.content)} menit baca</span>
                  </div>
                </div>
                <img
                  className="intro__small-photo"
                  src="/images/students-reading-at-tables-in-school-library.jpg"
                  alt="Siswa membaca di perpustakaan sekolah"
                  width="800" height="600" loading="lazy"
                />
              </section>
            )}

            <section id="kabar" aria-label="Kabar terbaru" style={{ paddingTop: 'var(--section-gap)' }}>
              <PinnedDeck posts={posts} categories={categories} />
            </section>

            <section className="section frame section--tone" aria-labelledby="tentang-portal">
              <div className="facts-row">
                <div className="facts">
                  <div><div className="fact__label">Berdiri</div><div className="fact__value">{SITE.founded}</div></div>
                  <div><div className="fact__label">Lokasi</div><div className="fact__value">{SITE.city}</div></div>
                  <div><div className="fact__label">Siswa</div><div className="fact__value">{SITE.students} siswa</div></div>
                </div>
                <div>
                  <h2 className="headline" id="tentang-portal" style={{ marginBottom: 28 }}>Satu papan pengumuman untuk seluruh sekolah.</h2>
                  <p className="facts-row__body">
                    Portal ini menjadi tempat berhenti sejenak: apa yang baru saja diraih siswa, apa yang perlu disiapkan besok, dan siapa yang sedang melakukan sesuatu yang baik di lingkungan sekolah.
                  </p>
                </div>
              </div>
              <div className="facts-row">
                <div className="facts">
                  <div><div className="fact__label">Prestasi</div><div className="fact__value">{achievements.length} kabar</div></div>
                  <div><div className="fact__label">Pengumuman</div><div className="fact__value">{announcements.length} kabar</div></div>
                  <div><div className="fact__label">Redaksi</div><div className="fact__value">{SITE.teachers} guru & siswa</div></div>
                </div>
                <div className="record-columns">
                  <div>
                    <p className="small muted" style={{ marginBottom: 14 }}>Prestasi terkini</p>
                    <div className="record-list">
                      {achievements.map((post) => (
                        <div key={post.id}>
                          <Link to={`/berita/${post.slug}`}>{post.title}</Link>
                          <span>{new Date(post.published_at).getFullYear()}</span>
                        </div>
                      ))}
                      {!achievements.length && <div><span>—</span></div>}
                    </div>
                  </div>
                  <div>
                    <p className="small muted" style={{ marginBottom: 14 }}>Pengumuman</p>
                    <div className="record-list">
                      {announcements.map((post) => (
                        <div key={post.id}>
                          <Link to={`/berita/${post.slug}`}>{post.title}</Link>
                          <span>{new Date(post.published_at).getFullYear()}</span>
                        </div>
                      ))}
                      {!announcements.length && <div><span>—</span></div>}
                    </div>
                  </div>
                </div>
              </div>
            </section>

            <section className="section--dark closing frame" aria-labelledby="ajak-redaksi">
              <h2 id="ajak-redaksi">Jadi bagian dari kabar ini.</h2>
              <div className="closing__foot">
                <p>Siswa, guru, dan orang tua bisa ikut menulis. Kabar yang baik berawal dari orang yang peduli.</p>
                <Link to="/admin/login" className="btn btn--on-dark">Masuk redaksi →</Link>
              </div>
            </section>
          </>
        )}
      </main>
      <Footer />
    </div>
  )
}
