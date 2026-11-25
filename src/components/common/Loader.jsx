export default function Loader({ label = 'Memuat kabar…' }) {
  return (
    <div className="loader" role="status" aria-live="polite">
      <div>
        <div className="loader__bar" aria-hidden="true" />
        <p className="small muted" style={{ marginTop: 18 }}>{label}</p>
      </div>
    </div>
  )
}
