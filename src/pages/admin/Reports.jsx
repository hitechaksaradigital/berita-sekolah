import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { Download } from 'lucide-react'
import { getAllPosts } from '../../lib/api'
import { formatDate, formatNumber } from '../../utils/formatDate'
import Loader from '../../components/common/Loader'

const STATUS_OPTIONS = [
  { id: 'all', label: 'Semua status' },
  { id: 'published', label: 'Terbit' },
  { id: 'draft', label: 'Draf' },
  { id: 'archived', label: 'Arsip' },
]

const STATUS_LABELS = {
  published: 'Terbit',
  draft: 'Draf',
  archived: 'Arsip',
}

const COLUMNS = [
  'ID',
  'Judul',
  'Slug',
  'Kategori',
  'Penulis',
  'Status',
  'Ringkasan',
  'Isi',
  'Gambar',
  'Dibuat',
  'Diperbarui',
  'Diterbitkan',
  'Pembaca',
  'Unggulan',
  'URL Publik',
  'URL Redaksi',
]

function csvCell(value) {
  if (value === null || value === undefined) return ''
  const text = String(value).replace(/\s+/g, ' ').trim()
  if (!text) return ''
  // Cegah spreadsheet menafsirkan teks judul/isi sebagai rumus.
  const safe = /^[=+\-@\t\r]/.test(text) ? `'${text}` : text
  return /[",\n\r]/.test(safe) ? `"${safe.replace(/"/g, '""')}"` : safe
}

function plainText(html = '') {
  const holder = document.createElement('div')
  holder.innerHTML = html
  return (holder.textContent || '').replace(/\s+/g, ' ').trim()
}

function toRows(posts, origin) {
  return posts.map((post) => [
    post.id,
    post.title,
    post.slug,
    post.categories?.name || '',
    post.author?.full_name || '',
    STATUS_LABELS[post.status] || post.status,
    post.excerpt || '',
    plainText(post.content),
    post.thumbnail_url || '',
    post.created_at || '',
    post.updated_at || '',
    post.published_at || '',
    post.views_count ?? 0,
    post.is_featured ? 'Ya' : 'Tidak',
    `${origin}/berita/${post.slug}`,
    `${origin}/admin/berita/${post.id}/edit`,
  ])
}

export default function Reports() {
  const [posts, setPosts] = useState([])
  const [status, setStatus] = useState('all')
  const [loading, setLoading] = useState(true)
  const [downloading, setDownloading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getAllPosts()
      .then((data) => active && setPosts(data))
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [])

  const counts = useMemo(() => ({
    all: posts.length,
    published: posts.filter((post) => post.status === 'published').length,
    draft: posts.filter((post) => post.status === 'draft').length,
    archived: posts.filter((post) => post.status === 'archived').length,
  }), [posts])

  const totalViews = useMemo(() => posts.reduce((sum, post) => sum + (post.views_count || 0), 0), [posts])
  const filtered = useMemo(
    () => status === 'all' ? posts : posts.filter((post) => post.status === status),
    [posts, status],
  )

  function downloadCsv() {
    if (!filtered.length) return
    setDownloading(true)
    try {
      const csv = [COLUMNS, ...toRows(filtered, window.location.origin)]
        .map((row) => row.map(csvCell).join(','))
        .join('\r\n')
      const blob = new Blob([`\uFEFF${csv}`], { type: 'text/csv;charset=utf-8;' })
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      const suffix = status === 'all' ? '' : `-${status}`
      link.href = url
      link.download = `laporan-berita${suffix}-${new Date().toISOString().slice(0, 10)}.csv`
      document.body.appendChild(link)
      link.click()
      link.remove()
      window.setTimeout(() => URL.revokeObjectURL(url), 1000)
    } catch (err) {
      setError(err.message)
    } finally {
      setDownloading(false)
    }
  }

  if (loading) return <Loader label="Memuat laporan…" />

  return (
    <div>
      <div className="admin-title-row">
        <div>
          <h1>Laporan</h1>
          <p>Unduh arsip berita beserta kategori, penulis, status, dan statistiknya.</p>
        </div>
        <button
          type="button"
          className="btn btn--accent btn--sm"
          onClick={downloadCsv}
          disabled={downloading || !filtered.length}
        >
          <Download size={16} /> {downloading ? 'Menyiapkan…' : 'Unduh CSV'}
        </button>
      </div>

      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      <div className="admin-card">
        <div className="admin-list">
          <div className="admin-list__row admin-list__row--two"><span>Total berita</span><strong className="tabular">{counts.all}</strong></div>
          <div className="admin-list__row admin-list__row--two"><span>Berita terbit</span><strong className="tabular">{counts.published}</strong></div>
          <div className="admin-list__row admin-list__row--two"><span>Draf</span><strong className="tabular">{counts.draft}</strong></div>
          <div className="admin-list__row admin-list__row--two"><span>Arsip</span><strong className="tabular">{counts.archived}</strong></div>
          <div className="admin-list__row admin-list__row--two"><span>Total pembaca</span><strong className="tabular">{formatNumber(totalViews)}</strong></div>
        </div>
      </div>

      <div className="admin-toolbar" style={{ marginTop: 24 }}>
        <label htmlFor="report-status" className="admin-kpi__label">Status</label>
        <select
          id="report-status"
          className="admin-select"
          style={{ maxWidth: 180 }}
          value={status}
          onChange={(event) => setStatus(event.target.value)}
        >
          {STATUS_OPTIONS.map((option) => (
            <option key={option.id} value={option.id}>{option.label} ({counts[option.id]})</option>
          ))}
        </select>
        <span className="admin-count">{filtered.length} baris</span>
      </div>

      <p className="admin-kpi__note" style={{ marginBottom: 12 }}>
        Filter status ikut menentukan isi berkas. CSV berisi satu baris per berita dengan 16 kolom, termasuk ringkasan, isi, dan tautan.
      </p>

      <div className="admin-card" style={{ paddingInline: 16 }}>
        {!filtered.length ? <p className="admin-empty">Tidak ada berita pada pilihan ini.</p> : (
          <table className="admin-table">
            <thead>
              <tr>
                <th>Judul</th><th>Kategori</th><th>Status</th><th>Penulis</th><th className="num">Pembaca</th><th>Diperbarui</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map((post) => (
                <tr key={post.id}>
                  <td style={{ minWidth: 260 }}>
                    <Link to={`/admin/berita/${post.id}/edit`} style={{ fontWeight: 600 }}>{post.title}</Link>
                    <small style={{ color: '#5f6672', fontSize: 12, display: 'block' }}>{post.slug}</small>
                  </td>
                  <td>{post.categories?.name || '—'}</td>
                  <td><span className={`pill pill--${post.status}`}>{STATUS_LABELS[post.status] || post.status}</span></td>
                  <td>{post.author?.full_name || '—'}</td>
                  <td className="num">{formatNumber(post.views_count)}</td>
                  <td>{formatDate(post.updated_at, { short: true })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  )
}
