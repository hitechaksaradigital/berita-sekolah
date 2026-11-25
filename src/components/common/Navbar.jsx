import { Link, NavLink } from 'react-router-dom'
import { SITE } from '../../config/site'

export default function Navbar({ absolute = false }) {
  return (
    <header className={`site-nav ${absolute ? '' : 'site-nav--static'}`}>
      <Link to="/" className="wordmark" aria-label={`${SITE.name} — beranda`}>
        {SITE.name}
      </Link>
      <nav className="nav-links" aria-label="Navigasi utama">
        <NavLink to="/berita" className={({ isActive }) => (isActive ? 'text-[var(--accent)]' : '')}>Berita</NavLink>
        <NavLink to="/kategori" className={({ isActive }) => (isActive ? 'text-[var(--accent)]' : '')}>Kategori</NavLink>
        <NavLink to="/tentang" className={({ isActive }) => (isActive ? 'text-[var(--accent)]' : '')}>Tentang</NavLink>
      </nav>
      <div className="nav-action">
        <Link to="/admin" className="btn btn--accent btn--sm">Masuk redaksi</Link>
      </div>
    </header>
  )
}
