import { useRef, useState } from 'react'
import { ImagePlus, Loader2, Trash2 } from 'lucide-react'
import { compressImage } from '../../utils/compressImage'
import { uploadImage } from '../../lib/api'
import { isSupabaseConfigured } from '../../lib/supabase'

export default function ImageUploader({ value, onChange, label = 'Gambar utama' }) {
  const inputRef = useRef(null)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(file) {
    if (!file) return
    setBusy(true)
    setError('')
    try {
      const compact = await compressImage(file)
      const url = await uploadImage(compact)
      onChange(url)
    } catch (err) {
      setError(err.message || 'Gagal mengunggah gambar.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="admin-field">
      <label>{label}</label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="visually-hidden"
        onChange={(event) => handleFile(event.target.files?.[0])}
      />
      {value ? (
        <div style={{ display: 'grid', gap: 8 }}>
          <img className="upload-preview" src={value} alt="Pratinjau gambar utama" />
          <div style={{ display: 'flex', gap: 8 }}>
            <button type="button" className="btn btn--outline btn--sm" onClick={() => inputRef.current?.click()}>Ganti gambar</button>
            <button type="button" className="btn btn--outline btn--sm" onClick={() => onChange(null)}><Trash2 size={15} /> Hapus</button>
          </div>
        </div>
      ) : (
        <div
          className="upload-drop"
          role="button"
          tabIndex={0}
          onClick={() => inputRef.current?.click()}
          onKeyDown={(event) => (event.key === 'Enter' || event.key === ' ') && inputRef.current?.click()}
          onDragOver={(event) => event.preventDefault()}
          onDrop={(event) => { event.preventDefault(); handleFile(event.dataTransfer.files?.[0]) }}
        >
          {busy ? <Loader2 size={22} className="inline animate-spin" /> : <ImagePlus size={22} />}
          <p style={{ margin: '8px 0 0' }}>{busy ? 'Mengompres & mengunggah…' : 'Klik atau letakkan gambar di sini'}</p>
        </div>
      )}
      {error && <p className="admin-alert admin-alert--error" style={{ margin: 0 }}>{error}</p>}
      {!isSupabaseConfigured && <span className="hint">Mode pratinjau: gambar hanya tersimpan sementara di browser.</span>}
    </div>
  )
}
