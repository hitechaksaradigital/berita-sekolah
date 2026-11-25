import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, FilePlus2 } from 'lucide-react'
import { getAllPosts, getCategories } from '../../lib/api'
import { useAuth } from '../../contexts/AuthContext'
import { formatDate, formatNumber } from '../../utils/formatDate'
import Loader from '../../components/common/Loader'

export default function Dashboard() {
  const { isAdmin } = useAuth()
  const [posts, setPosts] = useState([])
  const [categories, setCategories] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    Promise.all([getAllPosts(), getCategories()])
      .then(([allPosts, cats]) => {
        if (!active) return
        setPosts(allPosts)
        setCategories(cats)
      })
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [])

  if (loading) return <Loader label="Menyiapkan ringkasan redaksi…" />

  const published = posts.filter((post) => post.status === 'published')
  const drafts = posts.filter((post) => post.status === 'draft')
  const totalViews = posts.reduce((sum, post) => sum + (post.views_count || 0), 0)
  const counts = categories.map((category) => ({
    ...category,
    count: published.filter((post) => post.category_id === category.id).length,
  }))
  const maxCount = Math.max(1, ...counts.map((item) => item.count))
  const recent = posts.slice(0, 5)
  const queue = drafts.slice(0, 4)

  return (
    <div>
      <div className="admin-title-row">
        <div>
          <h1>Ringkasan redaksi</h1>
          <p>
            {drafts.length > 0
              ? `Ada ${drafts.length} draf yang menunggu tinjauan sebelum dipublikasikan.`
              : 'Semua draf sudah ditinjau. Kabar terbaru siap dipublikasikan.'}
          </p>
        </div>
        <Link to="/admin/berita/baru" className="btn btn--accent btn--sm"><FilePlus2 size={16} /> Tulis berita</Link>
      </div>

      <div className="admin-kpis">
        <div className="admin-kpi"><div className="admin-kpi__label">Seluruh berita</div><div className="admin-kpi__value">{posts.length}</div><div className="admin-kpi__note">dirakum dalam redaksi</div></div>
        <div className="admin-kpi"><div className="admin-kpi__label">Terbit</div><div className="admin-kpi__value">{published.length}</div><div className="admin-kpi__note">dapat dibaca publik</div></div>
        <div className="admin-kpi"><div className="admin-kpi__label">Draf</div><div className="admin-kpi__value">{drafts.length}</div><div className="admin-kpi__note">belum dipublikasikan</div></div>
        <div className="admin-kpi"><div className="admin-kpi__label">Pembaca</div><div className="admin-kpi__value">{formatNumber(totalViews)}</div><div className="admin-kpi__note">total seluruh kabar</div></div>
      </div>

      <div className="admin-grid">
        <div style={{ display: 'grid', gap: 'var(--gap)' }}>
          <section className="admin-card">
            <div className="admin-card__head">
              <h2>Kabar terbaru</h2>
              <span>Diperbarui {formatDate(new Date(), { short: true })}</span>
            </div>
            <div className="admin-list">
              {recent.map((post) => (
                <div className="admin-list__row admin-list__row--two" key={post.id}>
                  <div style={{ minWidth: 0 }}>
                    <Link to={`/admin/berita/${post.id}/edit`} style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</Link>
                    <small>{post.categories?.name || 'Tanpa kategori'} · {formatDate(post.updated_at)}</small>
                  </div>
                  <span className={`pill pill--${post.status}`}>{post.status === 'published' ? 'Terbit' : post.status === 'draft' ? 'Draf' : 'Arsip'}</span>
                </div>
              ))}
              {!recent.length && <p className="admin-empty">Belum ada berita. Mulai dengan menulis kabar pertama.</p>}
            </div>
          </section>

          <section className="admin-card">
            <div className="admin-card__head">
              <h2>Berita per kategori</h2>
              <span>{published.length} berita terbit</span>
            </div>
            <div style={{ display: 'grid', gap: 14 }}>
              {counts.map((category) => (
                <div key={category.id} style={{ display: 'grid', gridTemplateColumns: '150px 1fr 36px', gap: 12, alignItems: 'center', fontSize: 13 }}>
                  <span>{category.name}</span>
                  <span style={{ height: 8, background: 'var(--raised)', overflow: 'hidden' }}>
                    <span style={{ display: 'block', height: '100%', width: `${(category.count / maxCount) * 100}%`, background: 'var(--brand)' }} />
                  </span>
                  <span className="tabular" style={{ textAlign: 'right' }}>{category.count}</span>
                </div>
              ))}
              {!counts.length && <p className="admin-empty">Belum ada kategori.</p>}
            </div>
          </section>
        </div>

        <aside>
          <p className="admin-plain-head">Antrian tinjauan</p>
          <div className="admin-card" style={{ padding: 0, paddingInline: 16 }}>
            <div className="admin-list">
              {queue.map((post) => (
                <div className="admin-list__row" key={post.id}>
                  <div style={{ minWidth: 0 }}>
                    <Link to={`/admin/berita/${post.id}/edit`} style={{ display: 'block', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{post.title}</Link>
                    <small>{post.author?.full_name || 'Penulis'} · {formatDate(post.created_at, { short: true })}</small>
                  </div>
                </div>
              ))}
              {!queue.length && <p className="admin-empty">Tidak ada draf yang menunggu.</p>}
            </div>
          </div>
          <Link to="/admin/berita" className="btn btn--outline btn--sm btn--block" style={{ marginTop: 16 }}>Lihat semua berita</Link>
          {!isAdmin && <p className="small muted" style={{ marginTop: 16 }}>Hanya admin yang dapat mempublikasikan berita.</p>}
          <p className="small muted" style={{ marginTop: 32 }}>
            <Link to="/berita" className="text-link">Buka situs publik <ArrowRight size={14} style={{ verticalAlign: 'middle' }} /></Link>
          </p>
        </aside>
      </div>
    </div>
  )
}
