import { useEffect, useState } from 'react'
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom'
import { ExternalLink, FileText, FolderTree, LayoutDashboard, LogOut, Menu, Users, X } from 'lucide-react'
import { useAuth } from '../../contexts/AuthContext'
import { getAllPosts } from '../../lib/api'
import { SITE } from '../../config/site'

const NAV = [
  { to: '/admin', label: 'Ringkasan', icon: LayoutDashboard, end: true },
  { to: '/admin/berita', label: 'Berita', icon: FileText },
  { to: '/admin/kategori', label: 'Kategori', icon: FolderTree, admin: true },
  { to: '/admin/pengguna', label: 'Pengguna', icon: Users, admin: true },
]

export default function AdminLayout() {
  const { profile, isAdmin, isDemo, signOut } = useAuth()
  const [draftCount, setDraftCount] = useState(0)
  const [menuOpen, setMenuOpen] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    let active = true
    getAllPosts().then((posts) => active && setDraftCount(posts.filter((post) => post.status === 'draft').length)).catch(() => {})
    return () => { active = false }
  }, [])

  async function handleSignOut() {
    await signOut()
    navigate('/admin/login')
  }

  const sidebar = (
    <aside className={`admin-sidebar ${menuOpen ? 'open' : ''}`}>
      <div className="admin-sidebar__brand">
        <span className="admin-mark">{SITE.shortName}</span>
        <span>Redaksi {SITE.name}</span>
        <button className="icon-btn" style={{ marginLeft: 'auto' }} onClick={() => setMenuOpen(false)} aria-label="Tutup menu" ><X size={18} /></button>
      </div>
      <nav className="admin-nav" aria-label="Navigasi redaksi">
        <p className="admin-nav__label">Redaksi</p>
        {NAV.filter((item) => !item.admin || isAdmin).map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `admin-nav__item ${isActive ? 'active' : ''}`}
            onClick={() => setMenuOpen(false)}
          >
            <item.icon size={16} strokeWidth={1.7} />
            {item.label}
            {item.label === 'Berita' && draftCount > 0 && <span className="admin-nav__count">{draftCount}</span>}
          </NavLink>
        ))}
        <p className="admin-nav__label" style={{ marginTop: 28 }}>Publik</p>
        <Link to="/" className="admin-nav__item" onClick={() => setMenuOpen(false)}>
          <ExternalLink size={16} strokeWidth={1.7} /> Lihat situs
        </Link>
      </nav>
      <div className="admin-sidebar__foot">
        {isDemo && <div className="admin-alert admin-alert--info" style={{ margin: 0 }}>Mode pratinjau: perubahan tersimpan di browser ini.</div>}
        <div className="admin-user">
          <span className="admin-user__avatar">{(profile?.full_name || 'P')[0]}</span>
          <span style={{ minWidth: 0 }}>
            <strong style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{profile?.full_name || 'Penulis'}</strong>
            <span>{isAdmin ? 'Admin / Editor' : 'Penulis'}</span>
          </span>
        </div>
        <button type="button" className="btn btn--outline btn--sm btn--block" onClick={handleSignOut}>
          <LogOut size={16} /> Keluar
        </button>
      </div>
    </aside>
  )

  return (
    <div className="admin-shell">
      <div className="admin-mobile-bar">
        <span className="admin-sidebar__brand" style={{ padding: 0 }}><span className="admin-mark">{SITE.shortName}</span> Redaksi</span>
        <button type="button" className="icon-btn" onClick={() => setMenuOpen(true)} aria-label="Buka menu"><Menu size={20} /></button>
      </div>
      <div className="admin-layout">
        {sidebar}
        <main className="admin-main"><Outlet /></main>
      </div>
    </div>
  )
}
