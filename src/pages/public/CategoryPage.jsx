import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import PublicLayout from '../../components/common/PublicLayout'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import { getCategories, getPublishedPosts } from '../../lib/api'
import { formatDate } from '../../utils/formatDate'

export default function CategoryPage() {
  const { slug } = useParams()
  const [categories, setCategories] = useState([])
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    setLoading(true)
    Promise.all([getCategories(), getPublishedPosts({ categorySlug: slug })])
      .then(([cats, data]) => {
        if (!active) return
        setCategories(cats)
        setPosts(data)
      })
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [slug])

  const current = categories.find((category) => category.slug === slug)

  return (
    <PublicLayout>
      <section className="frame section" style={{ paddingTop: 72 }}>
        <div className="axis-title">
          <p className="axis-title__side reveal">Kabar dikelompokkan agar mudah ditemukan.</p>
          <h1 className="display">{current ? current.name : 'Kategori berita'}</h1>
        </div>

        <nav className="deck-filters" style={{ marginTop: 44 }} aria-label="Daftar kategori">
          <Link to="/kategori" aria-current={!slug ? 'page' : undefined} className={`reveal ${!slug ? 'font-bold' : ''}`}>Semua topik</Link>
          {categories.map((category) => (
            <Link
              key={category.id}
              to={`/kategori/${category.slug}`}
              aria-current={slug === category.slug ? 'page' : undefined}
              className={`reveal ${slug === category.slug ? 'font-bold' : ''}`}
            >
              {category.name}
            </Link>
          ))}
        </nav>

        <div style={{ marginTop: 64 }}>
          {loading ? <Loader /> : !posts.length ? (
            <EmptyState title="Belum ada kabar di topik ini" description="Coba topik lain atau kembali setelah redaksi mempublikasikan kabar baru." to="/berita" />
          ) : (
            <>
              <div className="category-mosaic reveal" aria-hidden="true">
                <img src={posts[0]?.thumbnail_url || '/images/tisa-students.jpg'} alt="" />
                <img src="/images/students-reading-at-tables-in-school-library.jpg" alt="" />
                <img src="/images/summit-high-school-at-awards-ceremony-june.jpg" alt="" />
              </div>
              <div className="archive-list">
                {posts.map((post, index) => (
                  <article className="list-row reveal" key={post.id}>
                    {post.thumbnail_url ? (
                      <Link to={`/berita/${post.slug}`}><img src={post.thumbnail_url} alt="" loading="lazy" /></Link>
                    ) : <div style={{ height: 150, background: 'var(--field-sage)' }} />}
                    <div className="reveal">
                      <h3 className="reveal"><Link to={`/berita/${post.slug}`}>{post.title}</Link></h3>
                      <p className="small muted reveal" style={{ marginBottom: 10 }}>{formatDate(post.published_at)}</p>
                      <p className="muted reveal" style={{ margin: 0 }}>{post.excerpt}</p>
                    </div>
                    <span className="small muted tabular reveal">{index + 1}</span>
                  </article>
                ))}
              </div>
            </>
          )}
        </div>
      </section>
    </PublicLayout>
  )
}
