import { useEffect, useRef, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { ArrowLeft, Eye, Save, Send } from 'lucide-react'
import { getAllPosts, getCategories, getPostById, savePost } from '../../lib/api'
import { useAuth } from '../../contexts/AuthContext'
import { slugify, uniqueSlug } from '../../utils/slugify'
import RichTextEditor from '../../components/admin/RichTextEditor'
import ImageUploader from '../../components/admin/ImageUploader'
import Loader from '../../components/common/Loader'

const EMPTY = {
  title: '', slug: '', excerpt: '', content: '', thumbnail_url: null,
  category_id: '', status: 'draft', is_featured: false, author_id: '',
}

export default function PostEditor() {
  const { id } = useParams()
  const { profile, isAdmin } = useAuth()
  const navigate = useNavigate()
  const slugEdited = useRef(false)
  const [form, setForm] = useState(EMPTY)
  const [categories, setCategories] = useState([])
  const [existingSlugs, setExistingSlugs] = useState([])
  const [loading, setLoading] = useState(Boolean(id))
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    Promise.all([
      getCategories(),
      getAllPosts(),
      id ? getPostById(id) : Promise.resolve(null),
    ])
      .then(([cats, posts, post]) => {
        if (!active) return
        setCategories(cats)
        setExistingSlugs(posts)
        if (post) {
          slugEdited.current = true
          setForm({ ...post, category_id: String(post.category_id) })
        } else {
          setForm({ ...EMPTY, author_id: profile?.id || '' })
        }
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [id, profile?.id])

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  async function handleSave(status) {
    setError('')
    if (!form.title.trim()) return setError('Judul berita wajib diisi.')
    if (!form.category_id) return setError('Pilih kategori berita.')
    if (!form.content || form.content === '<p></p>') return setError('Isi berita wajib ditulis.')
    if (status === 'published' && !isAdmin) return setError('Hanya admin yang dapat mempublikasikan berita.')

    const slug = uniqueSlug(slugify(form.slug || form.title), existingSlugs, id)
    const payload = {
      title: form.title.trim(),
      slug,
      excerpt: form.excerpt.trim() || form.title.trim().slice(0, 160),
      content: form.content,
      thumbnail_url: form.thumbnail_url || null,
      category_id: Number(form.category_id),
      author_id: form.author_id || profile?.id,
      status,
      is_featured: isAdmin ? form.is_featured : false,
    }
    if (id) payload.id = id

    setSaving(true)
    try {
      await savePost(payload)
      navigate('/admin/berita')
    } catch (err) {
      setError(err.message || 'Berita gagal disimpan.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <Loader label="Membuka editor…" />

  return (
    <div>
      <div className="admin-title-row">
        <div>
          <h1>{id ? 'Sunting berita' : 'Tulis berita baru'}</h1>
          <p>{id ? 'Perbarui naskah lalu simpan atau publikasikan kembali.' : 'Tulis kabar sekolah, lalu simpan sebagai draf untuk ditinjau.'}</p>
        </div>
        <Link to="/admin/berita" className="btn btn--outline btn--sm"><ArrowLeft size={16} /> Kembali</Link>
      </div>

      {error && <div className="admin-alert admin-alert--error">{error}</div>}
      {!isAdmin && <div className="admin-alert admin-alert--info">Sebagai penulis, Anda dapat menyimpan draf. Admin Humas yang akan mempublikasikannya.</div>}

      <div className="admin-form-grid">
        <div>
          <section className="admin-card" style={{ marginBottom: 'var(--gap)' }}>
            <h2 style={{ marginBottom: 20 }}>Isi berita</h2>
            <div className="admin-field">
              <label htmlFor="post-title">Judul</label>
              <input
                id="post-title"
                className="admin-input"
                value={form.title}
                onChange={(event) => {
                  const title = event.target.value
                  setForm((current) => ({
                    ...current,
                    title,
                    slug: slugEdited.current ? current.slug : slugify(title),
                  }))
                }}
                placeholder="Contoh: Siswa raih juara lomba sains"
              />
            </div>
            <div className="admin-field">
              <label htmlFor="post-slug">Alamat tautan (slug)</label>
              <input id="post-slug" className="admin-input" value={form.slug} onChange={(event) => { slugEdited.current = true; update('slug', slugify(event.target.value)) }} placeholder="siswa-raih-juara-lomba-sains" />
              <span className="hint">Tautan publik: /berita/{form.slug || 'slug-berita'}</span>
            </div>
            <div className="admin-field">
              <label htmlFor="post-excerpt">Ringkasan</label>
              <textarea id="post-excerpt" className="admin-textarea" value={form.excerpt} onChange={(event) => update('excerpt', event.target.value)} placeholder="Satu atau dua kalimat yang tampil di kartu berita." />
            </div>
            <RichTextEditor key={id || 'new'} content={form.content} onChange={(html) => update('content', html)} />
          </section>
        </div>

        <aside style={{ display: 'grid', gap: 'var(--gap)', alignContent: 'start' }}>
          <section className="admin-card">
            <h2 style={{ marginBottom: 20 }}>Penerbitan</h2>
            <div className="admin-field">
              <label htmlFor="post-category">Kategori</label>
              <select id="post-category" className="admin-select" value={form.category_id} onChange={(event) => update('category_id', event.target.value)}>
                <option value="">Pilih kategori</option>
                {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
              </select>
            </div>
            {isAdmin && (
              <label style={{ display: 'flex', gap: 10, alignItems: 'center', marginBottom: 18, fontSize: 13 }}>
                <input type="checkbox" checked={form.is_featured} onChange={(event) => update('is_featured', event.target.checked)} />
                Tampilkan sebagai headline utama
              </label>
            )}
            <div style={{ display: 'grid', gap: 8 }}>
              <button className="btn btn--outline btn--block" type="button" disabled={saving} onClick={() => handleSave('draft')}><Save size={16} /> Simpan draf</button>
              {isAdmin && (
                <button className="btn btn--accent btn--block" type="button" disabled={saving} onClick={() => handleSave('published')}>
                  <Send size={16} /> {saving ? 'Menyimpan…' : 'Publikasikan'}
                </button>
              )}
              {id && form.status === 'published' && (
                <Link className="btn btn--outline btn--sm btn--block" to={`/berita/${form.slug}`} target="_blank"><Eye size={16} /> Lihat di situs</Link>
              )}
            </div>
          </section>

          <section className="admin-card">
            <ImageUploader value={form.thumbnail_url} onChange={(url) => update('thumbnail_url', url)} />
          </section>
        </aside>
      </div>
    </div>
  )
}
