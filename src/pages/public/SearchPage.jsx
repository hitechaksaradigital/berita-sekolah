import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'
import { Search } from 'lucide-react'
import PublicLayout from '../../components/common/PublicLayout'
import NewsCard from '../../components/news/NewsCard'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import { getPublishedPosts } from '../../lib/api'

export default function SearchPage() {
  const [searchParams, setSearchParams] = useSearchParams()
  const query = searchParams.get('q') || ''
  const [draft, setDraft] = useState(query)
  const [results, setResults] = useState([])
  const [loading, setLoading] = useState(false)

  useEffect(() => setDraft(query), [query])

  useEffect(() => {
    let active = true
    if (!query.trim()) {
      setResults([])
      return undefined
    }
    setLoading(true)
    getPublishedPosts({ search: query.trim() })
      .then((data) => active && setResults(data))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [query])

  return (
    <PublicLayout>
      <section className="frame section" style={{ paddingTop: 72 }}>
        <div className="axis-title">
          <p className="axis-title__side reveal">Cari berdasarkan judul, ringkasan, atau isi kabar.</p>
          <h1 className="display">Cari kabar</h1>
        </div>
        <form
          className="search-field reveal"
          style={{ marginTop: 56, maxWidth: 900 }}
          onSubmit={(event) => {
            event.preventDefault()
            setSearchParams(draft.trim() ? { q: draft.trim() } : {})
          }}
          role="search"
        >
          <Search size={26} aria-hidden="true" />
          <label className="visually-hidden" htmlFor="site-search">Kata kunci</label>
          <input id="site-search" value={draft} onChange={(event) => setDraft(event.target.value)} placeholder="Masukkan kata kunci…" />
          <button className="btn btn--accent btn--sm" type="submit">Cari</button>
        </form>

        <div style={{ marginTop: 64 }}>
          {loading ? <Loader label="Mencari kabar…" /> : query && !results.length ? (
            <EmptyState title={`Tidak ada kabar untuk “${query}”`} description="Coba kata kunci yang lebih singkat atau lihat semua berita." to="/berita" />
          ) : results.length ? (
            <>
              <p className="muted tabular reveal" style={{ marginBottom: 28 }}>{results.length} kabar ditemukan</p>
              <div className="news-grid">{results.map((post) => <NewsCard key={post.id} post={post} />)}</div>
            </>
          ) : (
            <p className="muted reveal">Mulai dengan mengetik kata kunci di kolom atas.</p>
          )}
        </div>
      </section>
    </PublicLayout>
  )
}
