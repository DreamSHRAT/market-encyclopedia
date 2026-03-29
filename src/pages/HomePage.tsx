import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import { catalog, lessonRefsSorted, lessonsById } from '../data/curriculum'
import { loadProgress } from '../lib/progress'
import { emojiForCategory } from '../ui/categoryEmojis'

export function HomePage() {
  const [q, setQ] = useState('')
  const progress = loadProgress()
  const allRefs = lessonRefsSorted()
  const totalLessons = allRefs.length
  const doneCount = progress.completedLessonIds.filter((id) =>
    allRefs.some((r) => r.id === id),
  ).length
  const pct = totalLessons ? Math.round((doneCount / totalLessons) * 100) : 0

  const firstRef = allRefs[0]
  const firstLesson = firstRef ? lessonsById[firstRef.id] : undefined

  const filtered = useMemo(() => {
    const needle = q.trim().toLowerCase()
    const refs = lessonRefsSorted()
    if (!needle) return refs
    return refs.filter((r) => {
      const L = lessonsById[r.id]
      if (!L) return false
      const blob = `${L.title} ${L.tags.join(' ')}`.toLowerCase()
      return blob.includes(needle)
    })
  }, [q])

  return (
    <div className="page home">
      <header className="home__hero">
        <p className="home__eyebrow">Hey there 👋</p>
        <h1 className="home__title">Your pocket-friendly markets coach</h1>
        <p className="home__lead">
          Bite-sized lessons, zero jargon walls — warm up with a quick quiz, learn the idea with visuals,
          then prove it in a boss round.{' '}
          <strong>{totalLessons} topics</strong> from charts to “wizard” playbooks to options. Skip
          around or ride the path — your call.
        </p>

        <div className="home__stats glass" role="status">
          <div className="home__stat">
            <span className="home__stat-num">{doneCount}</span>
            <span className="home__stat-label">of {totalLessons} done</span>
          </div>
          <div className="home__stat home__stat--meter">
            <div className="home__meter" role="presentation">
              <div className="home__meter-fill" style={{ width: `${pct}%` }} />
            </div>
            <span className="home__meter-label">{pct}% path</span>
          </div>
          <p className="home__stat-cheer">
            {doneCount === 0 && '🚀 Start one lesson — momentum loves company.'}
            {doneCount > 0 && doneCount < totalLessons && '🔥 Keep the streak — you’re building real skill.'}
            {doneCount >= totalLessons && '🏆 You cleared the path — revisit anytime for muscle memory.'}
          </p>
        </div>

        {firstRef && firstLesson && (
          <p className="home__start">
            <Link to={`/lesson/${firstRef.id}`} className="btn primary home__start-btn">
              Start learning → {firstLesson.title}
            </Link>
          </p>
        )}

        <p className="home__disclaimer glass glass--warn">
          <span aria-hidden>🧪</span> Educational only — not financial advice, not a broker. We’re here
          to teach ideas, not pick your stocks.
        </p>

        <label className="home__search">
          <span className="sr-only">Search topics</span>
          <span className="home__search-icon" aria-hidden>
            🔎
          </span>
          <input
            type="search"
            placeholder="Try: CAN SLIM, Darvas, PEG, options…"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            autoComplete="off"
          />
        </label>
      </header>

      {catalog.categories.map((cat) => {
        const lessons = filtered.filter((r) => r.categoryId === cat.id)
        if (lessons.length === 0) return null
        const em = emojiForCategory(cat.id)
        return (
          <section key={cat.id} className="home__section">
            <h2 className="home__cat">
              <span className="home__cat-emoji" aria-hidden>
                {em}
              </span>{' '}
              {cat.title}
            </h2>
            <p className="home__cat-desc">{cat.description}</p>
            <ul className="home__list">
              {lessons.map((r) => {
                const L = lessonsById[r.id]
                if (!L) return null
                const done = progress.completedLessonIds.includes(r.id)
                return (
                  <li key={r.id}>
                    <Link to={`/lesson/${r.id}`} className="home__card">
                      <span className="home__card-title">{L.title}</span>
                      <span className="home__tags">{L.tags.join(' · ')}</span>
                      {done ? (
                        <span className="home__done">✅ Nailed it</span>
                      ) : (
                        <span className="home__todo">Tap to learn →</span>
                      )}
                    </Link>
                  </li>
                )
              })}
            </ul>
          </section>
        )
      })}

      {filtered.length === 0 && (
        <p className="home__empty">
          <span aria-hidden>🔭</span> No matches — try another word?
        </p>
      )}

      <section className="home__pwa glass">
        <h2 className="home__pwa-title">📱 Add to Home Screen</h2>
        <p>
          On iPhone: Safari → Share → <strong>Add to Home Screen</strong> — feels almost like an app.
          Works great on HTTPS (Netlify / Vercel / Cloudflare).
        </p>
      </section>
    </div>
  )
}
