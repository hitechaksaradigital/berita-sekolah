import { useEffect, useState } from 'react'
import PublicLayout from '../../components/common/PublicLayout'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import Pagination from '../../components/common/Pagination'
import NewsCard from '../../components/news/NewsCard'
import { getPublishedPosts } from '../../lib/api'

const PER_PAGE = 9

export default function NewsIndex() {
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [page, setPage] = useState(1)

  useEffect(() => {
    let active = true
    getPublishedPosts()
      .then((data) => active && setPosts(data))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [])

  useEffect(() => setPage(1), [posts.length])

  const totalPages = Math.max(1, Math.ceil(posts.length / PER_PAGE))
  const visible = posts.slice((page - 1) * PER_PAGE, page * PER_PAGE)

  return (
    <PublicLayout>
      <section className="frame section" style={{ paddingTop: 72 }}>
        <div className="axis-title">
          <p className="axis-title__side">Arsip kabar sekolah, dari yang terbaru hingga yang terdahulu.</p>
          <h1 className="display">Semua berita</h1>
        </div>
        {loading ? <Loader /> : !posts.length ? <EmptyState to="/">Kembali ke beranda</EmptyState> : (
          <>
            <div className="news-grid" style={{ marginTop: 72 }}>
              {visible.map((post) => <NewsCard key={post.id} post={post} />)}
            </div>
            <Pagination page={page} totalPages={totalPages} onChange={setPage} />
          </>
        )}
      </section>
    </PublicLayout>
  )
}
