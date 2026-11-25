import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../contexts/AuthContext'
import Loader from '../common/Loader'

export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, isAdmin, loading } = useAuth()
  const location = useLocation()

  if (loading) return <div className="admin-shell"><Loader label="Memeriksa sesi…" /></div>
  if (!user) return <Navigate to="/admin/login" replace state={{ from: location.pathname }} />
  if (requireAdmin && !isAdmin) return <Navigate to="/admin" replace />
  return children
}
