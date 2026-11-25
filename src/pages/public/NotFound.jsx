import PublicLayout from '../../components/common/PublicLayout'
import EmptyState from '../../components/common/EmptyState'

export default function NotFound() {
  return (
    <PublicLayout>
      <section className="frame section"><EmptyState title="Halaman tidak ditemukan" description="Alamat yang Anda buka tidak tersedia. Kembali ke beranda untuk melanjutkan." to="/" actionLabel="Ke beranda" /></section>
    </PublicLayout>
  )
}
