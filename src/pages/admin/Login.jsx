import { useState } from 'react'
import { Link, Navigate, useNavigate } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import { SITE } from '../../config/site'
import { isSupabaseConfigured } from '../../lib/supabase'

export default function Login() {
  const { user, loading, signIn, isDemo } = useAuth()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const navigate = useNavigate()

  if (!loading && user) return <Navigate to="/admin" replace />

  async function handleSubmit(event) {
    event.preventDefault()
    setBusy(true)
    setError('')
    try {
      await signIn(email, password)
      navigate('/admin')
    } catch (err) {
      setError(err.message || 'Masuk gagal. Periksa email dan kata sandi.')
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="admin-shell login-page">
      <div className="login-art">
        <Link to="/" className="wordmark" style={{ color: '#fff' }}>{SITE.name}</Link>
        <div className="login-art__body">
          <h2>Kabar baik berawal dari peduli.</h2>
          <img src="/images/tisa-students.jpg" alt="Siswa di lingkungan sekolah" width="1200" height="900" />
        </div>
        <p className="small" style={{ color: '#bbb', margin: 0 }}>Portal berita · {SITE.city}</p>
      </div>
      <div className="login-form-side">
        <form className="login-form" onSubmit={handleSubmit}>
          <p className="small" style={{ color: '#93401d', fontWeight: 700 }}>Ruang redaksi</p>
          <h1>Masuk redaksi</h1>
          <p className="muted" style={{ marginBottom: 32 }}>Hanya penulis dan admin sekolah yang dapat mengelola kabar.</p>

          {error && <div className="admin-alert admin-alert--error">{error}</div>}
          {!isSupabaseConfigured && (
            <div className="admin-alert admin-alert--info">
              Mode pratinjau aktif. Masuk dengan <strong>admin@sekolahkita.sch.id</strong> (admin) atau <strong>writer@sekolahkita.sch.id</strong> (penulis), kata sandi minimal 6 karakter.
            </div>
          )}

          <div className="admin-field">
            <label htmlFor="login-email">Email sekolah</label>
            <input id="login-email" className="admin-input" type="email" required autoComplete="username" value={email} onChange={(event) => setEmail(event.target.value)} placeholder="nama@sekolah.sch.id" />
          </div>
          <div className="admin-field">
            <label htmlFor="login-password">Kata sandi</label>
            <input id="login-password" className="admin-input" type="password" required autoComplete="current-password" value={password} onChange={(event) => setPassword(event.target.value)} placeholder="••••••••" />
          </div>
          <button className="btn btn--accent btn--block" type="submit" disabled={busy}>
            {busy ? 'Memeriksa…' : 'Masuk'}
          </button>
          <p className="small muted" style={{ marginTop: 24, marginBottom: 0 }}>
            <Link to="/" className="text-link">Kembali ke situs publik</Link>
          </p>
          {isDemo && <p className="small muted" style={{ marginTop: 8 }}>Kredensial demo hanya berlaku sebelum Supabase dikonfigurasi.</p>}
        </form>
      </div>
    </div>
  )
}
