import { useEffect, useState } from 'react'
import { Link, useParams } from 'react-router-dom'
import { Check, Copy, Share2 } from 'lucide-react'
import PublicLayout from '../../components/common/PublicLayout'
import Loader from '../../components/common/Loader'
import EmptyState from '../../components/common/EmptyState'
import NewsCard from '../../components/news/NewsCard'
import { getPostBySlug, getPublishedPosts, incrementViews } from '../../lib/api'
import { formatDate, readingTime } from '../../utils/formatDate'
import { SITE } from '../../config/site'

export default function NewsDetail() {
  const { slug } = useParams()
  const [post, setPost] = useState(null)
  const [related, setRelated] = useState([])
  const [loading, setLoading] = useState(true)
  const [copied, setCopied] = useState(false)

  useEffect(() => {
    let active = true
    setLoading(true)
    getPostBySlug(slug)
      .then(async (data) => {
        if (!active) return
        setPost(data)
        if (data) {
          const seen = `viewed-${data.id}`
          if (!sessionStorage.getItem(seen)) {
            sessionStorage.setItem(seen, '1')
            incrementViews(data.id).catch(() => {})
          }
          const others = await getPublishedPosts({ excludeId: data.id, limit: 8 })
          const sameCategory = others.filter((item) => item.category_id === data.category_id)
          const rest = others.filter((item) => item.category_id !== data.category_id)
          if (active) setRelated([...sameCategory, ...rest].slice(0, 3))
        }
      })
      .finally(() => active && setLoading(false))
    return () => { active = false }
  }, [slug])

  if (loading) return <PublicLayout><Loader label="Membuka kabar…" /></PublicLayout>
  if (!post) return (
    <PublicLayout>
      <section className="frame section"><EmptyState title="Kabar tidak ditemukan" description="Tautan mungkin sudah berubah atau kabar belum dipublikasikan." to="/berita" /></section>
    </PublicLayout>
  )

  const shareUrl = window.location.href
  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(`${post.title} — ${shareUrl}`)}`

  return (
    <PublicLayout>
      <article>
        <header className="article-head frame" style={{ paddingTop: 72 }}>
          <h1>{post.title}</h1>
          <p className="lead muted" style={{ maxWidth: '62ch' }}>{post.excerpt}</p>
          <p className="small muted" style={{ marginTop: 24, marginBottom: 0 }}>
            <Link to={`/kategori/${post.categories?.slug || ''}`} className="text-link">{post.categories?.name || 'Berita'}</Link>
            {' · '}{formatDate(post.published_at, { withDay: true })} · {readingTime(post.content)} menit baca
          </p>
          <p className="small" style={{ marginTop: 28 }}>Ditulis oleh <strong>{post.author?.full_name || 'Redaksi'}</strong> · {SITE.name}</p>
          {post.thumbnail_url && (
            <img className="article-cover" src={post.thumbnail_url} alt="Gambar utama berita" width="1600" height="900" />
          )}
        </header>

        <div className="frame section" style={{ paddingTop: 56 }}>
          <div className="article" dangerouslySetInnerHTML={{ __html: post.content }} />

          <div className="article-share" style={{ maxWidth: 1080, margin: '72px auto 0', display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            <span className="small muted">Bagikan kabar ini:</span>
            <a className="btn btn--outline btn--sm" href={whatsappUrl} target="_blank" rel="noreferrer">
              <Share2 size={16} /> WhatsApp
            </a>
            <button
              className="btn btn--outline btn--sm"
              type="button"
              onClick={() => {
                navigator.clipboard?.writeText(shareUrl)
                setCopied(true)
                window.setTimeout(() => setCopied(false), 2000)
              }}
            >
              {copied ? <Check size={16} /> : <Copy size={16} />}{copied ? 'Tautan tersalin' : 'Salin tautan'}
            </button>
            <span className="small muted tabular" style={{ marginLeft: 'auto' }}>{post.views_count} kali dibaca</span>
          </div>
        </div>

        {related.length > 0 && (
          <section className="frame section section--tone" aria-labelledby="kabar-terkait">
            <h2 className="headline" id="kabar-terkait" style={{ marginBottom: 48 }}>Kabar terkait</h2>
            <div className="news-grid">{related.map((item) => <NewsCard key={item.id} post={item} />)}</div>
          </section>
        )}
      </article>
    </PublicLayout>
  )
}
