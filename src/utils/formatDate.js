const MONTHS = [
  'Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni',
  'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember',
]

const DAYS = ['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu']

export function formatDate(value, options = {}) {
  if (!value) return '—'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return '—'
  const day = date.getDate()
  const month = MONTHS[date.getMonth()]
  const year = date.getFullYear()
  if (options.withTime) {
    const time = date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    return `${day} ${month} ${year} · ${time}`
  }
  if (options.short) return `${day} ${month.slice(0, 3)} ${year}`
  if (options.withDay) return `${DAYS[date.getDay()]}, ${day} ${month} ${year}`
  return `${day} ${month} ${year}`
}

export function formatNumber(value = 0) {
  return new Intl.NumberFormat('id-ID').format(value)
}

export function readingTime(html = '') {
  const words = html.replace(/<[^>]*>/g, ' ').trim().split(/\s+/).filter(Boolean).length
  return Math.max(1, Math.round(words / 200))
}
