import { Link } from 'react-router-dom'

export default function EmptyState({ title = 'Belum ada berita', description = 'Coba kategori lain atau kembali saat berita berikutnya terbit.', to, actionLabel }) {
  return (
    <div className="empty-state">
      <h2>{title}</h2>
      <p className="muted">{description}</p>
      {to && <Link className="btn btn--accent" to={to} style={{ marginTop: 24 }}>{actionLabel || 'Lihat semua berita'}</Link>}
    </div>
  )
}
