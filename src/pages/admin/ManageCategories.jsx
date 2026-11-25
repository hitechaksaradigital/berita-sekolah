import { useEffect, useState } from 'react'
import { Pencil, Plus, Trash2 } from 'lucide-react'
import { deleteCategory, getAllPosts, getCategories, saveCategory } from '../../lib/api'
import { slugify } from '../../utils/slugify'
import Loader from '../../components/common/Loader'

const EMPTY = { name: '', slug: '' }

export default function ManageCategories() {
  const [categories, setCategories] = useState([])
  const [posts, setPosts] = useState([])
  const [form, setForm] = useState(EMPTY)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    Promise.all([getCategories(), getAllPosts()])
      .then(([cats, allPosts]) => {
        if (!active) return
        setCategories(cats)
        setPosts(allPosts)
      })
      .catch((err) => active && setError(err.message))
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [])

  async function handleSubmit(event) {
    event.preventDefault()
    setError('')
    if (!form.name.trim()) return setError('Nama kategori wajib diisi.')
    const slug = slugify(form.slug || form.name)
    const duplicate = categories.some((category) => category.slug === slug && category.id !== editingId)
    if (duplicate) return setError('Slug kategori sudah digunakan.')
    try {
      const next = await saveCategory({ id: editingId || undefined, name: form.name.trim(), slug })
      setCategories(next)
      setForm(EMPTY)
      setEditingId(null)
    } catch (err) {
      setError(err.message)
    }
  }

  async function remove(category) {
    const used = posts.filter((post) => post.category_id === category.id).length
    if (used > 0) {
      setError(`Kategori “${category.name}” masih dipakai ${used} berita. Pindahkan beritanya terlebih dahulu.`)
      return
    }
    if (!window.confirm(`Hapus kategori “${category.name}”?`)) return
    try {
      await deleteCategory(category.id)
      setCategories((current) => current.filter((item) => item.id !== category.id))
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <Loader label="Memuat kategori…" />

  return (
    <div>
      <div className="admin-title-row">
        <div><h1>Kategori</h1><p>Atur topik yang dipakai saat menulis berita.</p></div>
      </div>
      {error && <div className="admin-alert admin-alert--error">{error}</div>}

      <div className="admin-grid">
        <section className="admin-card">
          <div className="admin-card__head"><h2>Daftar kategori</h2><span>{categories.length} kategori</span></div>
          <div className="admin-list">
            {categories.map((category) => (
              <div className="admin-list__row admin-list__row--two" key={category.id}>
                <div>
                  <strong>{category.name}</strong>
                  <small>/kategori/{category.slug} · {posts.filter((post) => post.category_id === category.id).length} berita</small>
                </div>
                <div className="admin-actions">
                  <button className="icon-btn" type="button" aria-label="Sunting kategori" onClick={() => { setEditingId(category.id); setForm({ name: category.name, slug: category.slug }) }}><Pencil size={16} /></button>
                  <button className="icon-btn danger" type="button" aria-label="Hapus kategori" onClick={() => remove(category)}><Trash2 size={16} /></button>
                </div>
              </div>
            ))}
            {!categories.length && <p className="admin-empty">Belum ada kategori.</p>}
          </div>
        </section>

        <section className="admin-card">
          <h2 style={{ marginBottom: 20 }}>{editingId ? 'Sunting kategori' : 'Kategori baru'}</h2>
          <form onSubmit={handleSubmit}>
            <div className="admin-field">
              <label htmlFor="category-name">Nama</label>
              <input id="category-name" className="admin-input" value={form.name} onChange={(event) => setForm((current) => ({ ...current, name: event.target.value, slug: slugify(event.target.value) }))} placeholder="Contoh: Prestasi" />
            </div>
            <div className="admin-field">
              <label htmlFor="category-slug">Slug</label>
              <input id="category-slug" className="admin-input" value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: slugify(event.target.value) }))} placeholder="prestasi" />
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button className="btn btn--accent btn--sm" type="submit"><Plus size={16} /> {editingId ? 'Simpan perubahan' : 'Tambah kategori'}</button>
              {editingId && <button className="btn btn--outline btn--sm" type="button" onClick={() => { setEditingId(null); setForm(EMPTY) }}>Batal</button>}
            </div>
          </form>
        </section>
      </div>
    </div>
  )
}
