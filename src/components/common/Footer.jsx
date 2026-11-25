import { Link } from 'react-router-dom'
import { SITE } from '../../config/site'
import { IMAGE_CREDITS } from '../../data/imageCredits'

export default function Footer() {
  return (
    <footer className="site-footer">
      <p className="site-footer__name">{SITE.name}</p>
      <div className="site-footer__cols">
        <div className="site-footer__places">
          <a href={`mailto:${SITE.email}`}>{SITE.email}</a>
          <a href={`tel:${SITE.phone.replace(/[^0-9+]/g, '')}`}>{SITE.phone}</a>
          <span>{SITE.address}</span>
        </div>
        <div className="site-footer__links">
          <ul>
            <li><strong>Jelajahi</strong></li>
            <li><Link to="/berita">Semua berita</Link></li>
            <li><Link to="/kategori">Kategori</Link></li>
            <li><Link to="/tentang">Tentang portal</Link></li>
          </ul>
          <ul>
            <li><strong>Redaksi</strong></li>
            <li><Link to="/admin">Dashboard</Link></li>
            <li><Link to="/admin/berita">Kelola berita</Link></li>
            <li><Link to="/admin/login">Masuk</Link></li>
          </ul>
          <ul>
            <li><strong>Ikuti</strong></li>
            {SITE.social.map((item) => (
              <li key={item.label}><a href={item.href} target="_blank" rel="noreferrer">{item.label}</a></li>
            ))}
          </ul>
        </div>
      </div>
      <div className="site-footer__legal">
        <span>© {new Date().getFullYear()} {SITE.name}. Dikelola oleh Humas sekolah.</span>
        <a href="#top">Kembali ke atas ↑</a>
      </div>
      <p className="site-footer__credits small">
        Foto contoh (CC0, untuk pratinjau): {IMAGE_CREDITS.map((credit) => (
          <span key={credit.title}>
            <a href={credit.source} target="_blank" rel="noreferrer">{credit.title}</a> — {credit.creator}, {credit.licence}.{' '}
          </span>
        ))}
      </p>
    </footer>
  )
}
