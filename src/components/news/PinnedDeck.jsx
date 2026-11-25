import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Link } from 'react-router-dom'
import { formatDate } from '../../utils/formatDate'

const TONES = ['deck-card--sage', 'deck-card--acid', 'deck-card--accent', 'deck-card--dark', 'deck-card--light']

export default function PinnedDeck({ posts, categories }) {
  const [activeCategory, setActiveCategory] = useState('all')
  const wrapRef = useRef(null)
  const cardsRef = useRef([])

  const visible = activeCategory === 'all'
    ? posts
    : posts.filter((post) => post.categories?.slug === activeCategory)

  useLayoutEffect(() => {
    cardsRef.current = cardsRef.current.slice(0, visible.length)
    if (window.innerWidth <= 1000 || visible.length === 0) return undefined

    const band = wrapRef.current?.querySelector('.deck-band')
    if (!band) return undefined

    let frame = 0
    const update = () => {
      frame = 0
      const wrap = wrapRef.current
      if (!wrap) return
      const rect = wrap.getBoundingClientRect()
      const travel = rect.height - window.innerHeight
      const progress = travel > 0 ? Math.min(1, Math.max(0, -rect.top / travel)) : 0
      const step = progress * visible.length
      const current = Math.min(visible.length - 1, Math.floor(step))
      const t = Math.min(1, step - current)
      const bandWidth = band.clientWidth
      const cardWidth = Math.min(620, bandWidth * 0.68)
      const sliver = 120

      cardsRef.current.forEach((card, index) => {
        if (!card) return
        if (index < current) {
          card.style.width = `${sliver}px`
          card.style.transform = `translateX(${index * sliver}px)`
          card.style.zIndex = '1'
          card.dataset.spine = 'true'
        } else {
          const base = current * sliver
          const enter = (1 - t) * (bandWidth - base)
          card.style.width = `${cardWidth}px`
          card.style.transform = `translateX(${base + enter + (index - current) * (cardWidth + 24)}px)`
          card.style.zIndex = String(20 + index - current)
          card.dataset.spine = 'false'
        }
      })
    }
    const onScroll = () => { if (!frame) frame = window.requestAnimationFrame(update) }
    update()
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [visible.length, activeCategory])

  useEffect(() => {
    setActiveCategory('all')
  }, [posts.length])

  const totalScreens = Math.min(3, Math.max(2, visible.length || 2))

  return (
    <div className="deck-wrap" ref={wrapRef} style={{ height: `${totalScreens * 100}svh` }}>
      <div className="deck-stage frame">
        <div className="deck-head">
          <div>
            <h2 className="headline" style={{ fontSize: 'clamp(2.5rem, 4.2vw, 4rem)' }}>Kabar terbaru</h2>
            <p className="muted" style={{ marginTop: 10, maxWidth: '42ch' }}>
              Sebuah kabar baik tidak perlu berteriak. Pilih topik yang ingin Anda ikuti.
            </p>
          </div>
          <div className="deck-filters" role="group" aria-label="Saring berita berdasarkan kategori">
            <button type="button" aria-pressed={activeCategory === 'all'} onClick={() => setActiveCategory('all')}>Semua</button>
            {categories.map((category) => (
              <button
                key={category.id}
                type="button"
                aria-pressed={activeCategory === category.slug}
                onClick={() => setActiveCategory(category.slug)}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>

        <div className="deck-band">
          {visible.map((post, index) => (
            <article
              key={post.id}
              ref={(el) => { cardsRef.current[index] = el }}
              className={`deck-card ${TONES[index % TONES.length]}`}
              data-spine="false"
            >
              <div className="deck-card__spine" aria-hidden="true">{post.title.slice(0, 14)}</div>
              <img
                className="deck-card__photo"
                src={post.thumbnail_url || '/images/tisa-students.jpg'}
                alt=""
                loading="lazy"
              />
              <div className="deck-card__body">
                <p className="small" style={{ marginBottom: 14, fontWeight: 600 }}>
                  {post.categories?.name || 'Berita'}
                </p>
                <h3 className="deck-card__title"><Link to={`/berita/${post.slug}`}>{post.title}</Link></h3>
                <p className="deck-card__excerpt">{post.excerpt}</p>
              </div>
              <div className="deck-card__foot">
                <span className="tabular">{formatDate(post.published_at || post.created_at, { short: true })}</span>
                <Link to={`/berita/${post.slug}`} className="text-link">Baca kabar ini →</Link>
              </div>
            </article>
          ))}
        </div>

        <div className="deck-tail">
          <span className="muted tabular">{visible.length} tulisan dalam pilihan ini</span>
          <Link to="/berita" className="text-link">Lihat semua berita →</Link>
        </div>
      </div>
    </div>
  )
}
