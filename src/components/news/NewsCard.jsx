import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/formatDate'
import CategoryBadge from './CategoryBadge'

export default function NewsCard({ post }) {
  return (
    <article className="news-card reveal">
      <Link to={`/berita/${post.slug}`} className="news-card__media" tabIndex={-1} aria-hidden="true">
        {post.thumbnail_url
          ? <img src={post.thumbnail_url} alt="" width="800" height="600" loading="lazy" decoding="async" />
          : <div className="news-card__placeholder" />}
      </Link>
      <div>
        <div className="small muted" style={{ marginBottom: 10 }}>
          <CategoryBadge category={post.categories} />
          <span>{formatDate(post.published_at || post.created_at, { short: true })}</span>
        </div>
        <h3 className="news-card__title"><Link to={`/berita/${post.slug}`}>{post.title}</Link></h3>
        <p className="news-card__excerpt" style={{ marginTop: 12 }}>{post.excerpt}</p>
      </div>
      <div className="news-card__meta">
        <span>Oleh {post.author?.full_name || 'Redaksi'}</span>
        <span>·</span>
        <span className="tabular">{post.views_count} dibaca</span>
      </div>
    </article>
  )
}
