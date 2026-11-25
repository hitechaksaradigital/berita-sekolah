import { useEffect, useState } from 'react'
import { getProfiles, updateUserRole } from '../../lib/api'
import { useAuth } from '../../contexts/AuthContext'
import { formatDate } from '../../utils/formatDate'
import Loader from '../../components/common/Loader'
import { isSupabaseConfigured } from '../../lib/supabase'

export default function ManageUsers() {
  const { profile: currentUser } = useAuth()
  const [profiles, setProfiles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    getProfiles().then((data) => active && setProfiles(data)).catch((err) => active && setError(err.message)).finally(() => active && setLoading(false))
    return () => { active = false }
  }, [])

  async function changeRole(id, role) {
    try {
      await updateUserRole(id, role)
      setProfiles((current) => current.map((item) => (item.id === id ? { ...item, role } : item)))
    } catch (err) {
      setError(err.message)
    }
  }

  if (loading) return <Loader label="Memuat pengguna…" />

  return (
    <div>
      <div className="admin-title-row">
        <div><h1>Pengguna</h1><p>Pengguna yang boleh masuk dan menulis di portal sekolah.</p></div>
      </div>
      {error && <div className="admin-alert admin-alert--error">{error}</div>}
      <div className="admin-alert admin-alert--info">
        {isSupabaseConfigured
          ? 'Tambah akun baru melalui Supabase Dashboard → Authentication → Users. Profil otomatis dibuat oleh trigger database dengan peran penulis; ubah perannya di tabel ini.'
          : 'Mode pratinjau: akun contoh tersedia di src/data/demo.js. Peran yang diubah hanya berlaku di browser ini.'}
      </div>

      <section className="admin-card" style={{ paddingInline: 16 }}>
        {!profiles.length ? <p className="admin-empty">Belum ada pengguna.</p> : (
          <table className="admin-table">
            <thead><tr><th>Nama</th><th>Email</th><th>Peran</th><th>Bergabung</th></tr></thead>
            <tbody>
              {profiles.map((item) => (
                <tr key={item.id}>
                  <td style={{ fontWeight: 600 }}>{item.full_name}{item.id === currentUser?.id && <span className="pill pill--accent" style={{ marginLeft: 8 }}>Anda</span>}</td>
                  <td>{item.email || '—'}</td>
                  <td>
                    <select
                      className="admin-select"
                      style={{ width: 130 }}
                      value={item.role}
                      disabled={item.id === currentUser?.id}
                      onChange={(event) => changeRole(item.id, event.target.value)}
                      aria-label={`Peran ${item.full_name}`}
                    >
                      <option value="writer">Penulis</option>
                      <option value="admin">Admin</option>
                    </select>
                  </td>
                  <td>{formatDate(item.created_at, { short: true })}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </section>
    </div>
  )
}
