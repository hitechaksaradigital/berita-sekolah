import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import ScrollManager from './components/common/ScrollManager'
import Loader from './components/common/Loader'
import Home from './pages/public/Home'
import NewsIndex from './pages/public/NewsIndex'
import NewsDetail from './pages/public/NewsDetail'
import CategoryPage from './pages/public/CategoryPage'
import SearchPage from './pages/public/SearchPage'
import AboutPage from './pages/public/AboutPage'
import NotFound from './pages/public/NotFound'

// Halaman admin (termasuk editor TipTap) dimuat terpisah agar bundel publik tetap ringan.
const AdminLayout = lazy(() => import('./components/admin/AdminLayout'))
const ProtectedRoute = lazy(() => import('./components/admin/ProtectedRoute'))
const Login = lazy(() => import('./pages/admin/Login'))
const Dashboard = lazy(() => import('./pages/admin/Dashboard'))
const ManagePosts = lazy(() => import('./pages/admin/ManagePosts'))
const PostEditor = lazy(() => import('./pages/admin/PostEditor'))
const ManageCategories = lazy(() => import('./pages/admin/ManageCategories'))
const ManageUsers = lazy(() => import('./pages/admin/ManageUsers'))

export default function App() {
  return (
    <>
      <ScrollManager />
      <Suspense fallback={<Loader label="Memuat halaman…" />}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/berita" element={<NewsIndex />} />
          <Route path="/berita/:slug" element={<NewsDetail />} />
          <Route path="/kategori" element={<CategoryPage />} />
          <Route path="/kategori/:slug" element={<CategoryPage />} />
          <Route path="/cari" element={<SearchPage />} />
          <Route path="/tentang" element={<AboutPage />} />

          <Route path="/admin/login" element={<Login />} />
          <Route path="/admin" element={<ProtectedRoute><AdminLayout /></ProtectedRoute>}>
            <Route index element={<Dashboard />} />
            <Route path="berita" element={<ManagePosts />} />
            <Route path="berita/baru" element={<PostEditor />} />
            <Route path="berita/:id/edit" element={<PostEditor />} />
            <Route path="kategori" element={<ProtectedRoute requireAdmin><ManageCategories /></ProtectedRoute>} />
            <Route path="pengguna" element={<ProtectedRoute requireAdmin><ManageUsers /></ProtectedRoute>} />
          </Route>
          <Route path="*" element={<NotFound />} />
        </Routes>
      </Suspense>
    </>
  )
}
