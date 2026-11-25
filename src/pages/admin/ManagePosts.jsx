import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Check, FilePlus2, Pencil, Search, Trash2, Undo2 } from 'lucide-react'
import { deletePost, getAllPosts, savePost } from '../../lib/api'
import { useAuth } from '../../contexts/AuthContext'
import { formatDate, formatNumber } from '../../utils/formatDate'
import Loader from '../../components/common/Loader'

const TABS = [
  { id: 'all', label: 'Semua' },
  { id: 'published', label: 'Terbit' },
  { id: 'draft', label: 'Draf' },
  { id: 'archived', label: 'Arsip' },
]

export default function ManagePosts() {
  const { isAdmin, profile } = useAuth()
  const [posts, setPosts] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('all')
  const [search, setSearch] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getAllPosts().then((data) => active && setPosts(data)).finally(() => active && setLoading(false))
    return () => { active = false }
  }, [])

  const filtered = useMemo(() => posts.filter((post) => {
    const matchTab = tab === 'all' || post.status === tab
    const matchSearch = `${post.title} ${post.categories?.name || ''}`.toLowerCase().includes(search.toLowerCase())
    return matchTab && matchSearch
  }), [posts, tab, search])

  async function toggleStatus(post) {
    const next = post.status === 'published' ? 'draft' : 'published'
    if (!window.confirm(next === 'published' ? `Publikasikan “${post.title}”?` : `Tarik “${post.title}” menjadi draf?`)) return
    try {
      const updated = await savePost({ id: post.id, status: next })
      setPosts((current) => current.map((item) => (item.id === post.id ? updated : item)))
    } catch (err) {
      setError(err.message)
    }
  }

  async function remove(post) {
    if (!window.confirm(`Hapus “${post.title}” secara permanen?`)) return
    try {
      await deletePost(post.id)
      setPosts((current) => current.filter((item) => item.id !== post.id))
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <Loader label="Memuat daftar berita…" />

  return (
    <div>
      <div className="admin-title-row">
        <div><h1>Berita</h1><p>Kelola draf, tinjau naskah, dan publikasikan kabar sekolah.</p></div>
        <Link to="/admin/berita/baru" className="btn btn--accent btn--sm"><FilePlus2 size={16} /> Tulis berita</Link>
      </div>

      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      <div className="admin-tabs" role="tablist" aria-label="Status berita">
        {TABS.map((item) => (
          <button
            key={item.id}
            type="button"
            role="tab"
            aria-selected={tab === item.id}
            className={tab === item.id ? 'active' : ''}
            onClick={() => setTab(item.id)}
          >
            {item.label} ({posts.filter((post) => item.id === 'all' || post.status === item.id).length})
          </button>
        ))}
      </div>

      <div className="admin-toolbar">
        <div style={{ position: 'relative', width: 300, maxWidth: '100%' }}>
          <Search size={16} style={{ position: 'absolute', left: 10, top: 10, color: '#8b919c' }} />
          <input className="admin-input" style={{ paddingLeft: 34 }} placeholder="Cari judul atau kategori" value={search} onChange={(event) => setSearch(event.target.value)} />
        </div>
        <span className="admin-count">{filtered.length} berita</span>
      </div>

      <div className="admin-card" style={{ paddingInline: 16 }}>
        {!filtered.length ? <p className="admin-empty">Tidak ada berita pada pilihan ini.</p> : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Judul</th><th>Kategori</th><th>Status</th><th className="num">Pembaca</th><th>Diperbarui</th><th className="num">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => {
                const canEdit = isAdmin || post.author_id === profile?.id
                return (
                  <tr key={post.id}>
                    <td style={{ minWidth: 260 }}>
                      <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                        {post.thumbnail_url
                          ? <img className="admin-table__thumb" src={post.thumbnail_url} alt="" />
                          : <span className="admin-table__thumb" style={{ display: 'grid', placeItems: 'center', color: '#9ca3af' }}>—</span>}
                        <div style={{ minWidth: 0 }}>
                          <Link to={`/admin/berita/${post.id}/edit`} style={{ fontWeight: 600 }}>{post.title}</Link>
                          <small style={{ color: '#5f6672', fontSize: 12 }}>{post.author?.full_name || 'Penulis'}</small>
                        </div>
                      </div>
                    </td>
                    <td>{post.categories?.name || '—'}</td>
                    <td><span className={`pill pill--${post.status}`}>{post.status === 'published' ? 'Terbit' : post.status === 'draft' ? 'Draf' : 'Arsip'}</span></td>
                    <td className="num">{formatNumber(post.views_count)}</td>
                    <td>{formatDate(post.updated_at, { short: true })}</td>
                    <td>
                      <div className="admin-actions">
                        {canEdit && <Link className="icon-btn" to={`/admin/berita/${post.id}/edit`} title="Sunting" aria-label="Sunting"><Pencil size={16} /></Link>}
                        {isAdmin && <button className="icon-btn" type="button" onClick={() => toggleStatus(post)} title={post.status === 'published' ? 'Tarik menjadi draf' : 'Publikasikan'} aria-label={post.status === 'published' ? 'Tarik menjadi draf' : 'Publikasikan'}>{post.status === 'published' ? <Undo2 size={16} /> : <Check size={16} />}</button>}
                        {isAdmin && <button className="icon-btn danger" type="button" onClick={() => remove(post)} title="Hapus" aria-label="Hapus"><Trash2 size={16} /></button>}
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
