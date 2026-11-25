import { ChevronLeft, ChevronRight } from 'lucide-react'

export default function Pagination({ page, totalPages, onChange }) {
  if (totalPages <= 1) return null
  return (
    <nav className="pagination" aria-label="Halaman berita">
      <button type="button" onClick={() => onChange(page - 1)} disabled={page <= 1} aria-label="Halaman sebelumnya">
        <ChevronLeft size={18} />
      </button>
      <span className="tabular">Halaman {page} dari {totalPages}</span>
      <button type="button" onClick={() => onChange(page + 1)} disabled={page >= totalPages} aria-label="Halaman berikutnya">
        <ChevronRight size={18} />
      </button>
    </nav>
  )
}
