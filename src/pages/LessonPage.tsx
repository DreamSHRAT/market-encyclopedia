import { useEffect, useMemo, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { LessonStory } from '../components/LessonStory'
import { Quiz } from '../components/Quiz'
import { TeachVisual } from '../components/TeachVisual'
import {
  catalog,
  getLesson,
  getNextLessonId,
  lessonsById,
} from '../data/curriculum'
import { markLessonComplete } from '../lib/progress'
import { emojiForCategory } from '../ui/categoryEmojis'
import type { TeachSlide } from '../types/lesson'

type Phase = 'diagnostic' | 'teach' | 'mastery' | 'done'

export function LessonPage() {
  const { lessonId = '' } = useParams()
  const navigate = useNavigate()
  const lesson = getLesson(lessonId)

  const [phase, setPhase] = useState<Phase>('diagnostic')
  const [teachSlides, setTeachSlides] = useState<TeachSlide[]>([])
  const [teachIdx, setTeachIdx] = useState(0)
  const [skippedFullLesson, setSkippedFullLesson] = useState(false)
  const [masteryAttempt, setMasteryAttempt] = useState(0)

  useEffect(() => {
    setPhase('diagnostic')
    setTeachSlides([])
    setTeachIdx(0)
    setSkippedFullLesson(false)
    setMasteryAttempt(0)
  }, [lessonId])

  const passDiag = lesson?.diagnosticPassRatio ?? 0.8
  const passMaster = lesson?.masteryPassRatio ?? 0.66

  const categoryMeta = useMemo(() => {
    if (!lesson) return { title: '', emoji: '📌' }
    const catId = catalog.lessons.find((r) => r.id === lesson.id)?.categoryId
    const title = catalog.categories.find((c) => c.id === catId)?.title ?? ''
    return { title, emoji: emojiForCategory(catId ?? '') }
  }, [lesson])

  if (!lesson) {
    return (
      <div className="page page--center">
        <p className="oops__emoji" aria-hidden>
          🤔
        </p>
        <h1 className="oops__title">We couldn’t find that lesson</h1>
        <p className="oops__text">Maybe the link got trimmed — let’s head home.</p>
        <Link to="/" className="btn primary">
          Take me home 🏠
        </Link>
      </div>
    )
  }

  const L = lesson

  function onDiagnosticDone(correct: number, total: number) {
    const ratio = total === 0 ? 0 : correct / total
    const skip = ratio >= passDiag && L.recapSlide
    if (skip) {
      setSkippedFullLesson(true)
      setTeachSlides([L.recapSlide!])
    } else {
      setSkippedFullLesson(false)
      setTeachSlides(L.teachSlides)
    }
    setTeachIdx(0)
    setPhase('teach')
  }

  function onMasteryDone(correct: number, total: number) {
    const ratio = total === 0 ? 0 : correct / total
    if (ratio >= passMaster) {
      markLessonComplete(L.id)
      setPhase('done')
    } else {
      setMasteryAttempt((a) => a + 1)
    }
  }

  const nextId = getNextLessonId(L.id)

  return (
    <div className="page lesson">
      <header className="lesson__head">
        <Link to="/" className="link lesson__back">
          ← Home
        </Link>
        <p className="lesson__crumb">
          <span className="lesson__crumb-emoji" aria-hidden>
            {categoryMeta.emoji}
          </span>{' '}
          {categoryMeta.title || 'Lesson'}
        </p>
        <h1 className="lesson__title">{L.title}</h1>
        <ol className="lesson__steps" aria-label="Lesson steps">
          <li className={phase === 'diagnostic' ? 'lesson__steps-item lesson__steps-item--active' : 'lesson__steps-item'}>
            🧠 Warm-up
          </li>
          <li className={phase === 'teach' ? 'lesson__steps-item lesson__steps-item--active' : 'lesson__steps-item'}>
            📚 Learn
          </li>
          <li className={phase === 'mastery' ? 'lesson__steps-item lesson__steps-item--active' : 'lesson__steps-item'}>
            🎯 Prove it
          </li>
          <li className={phase === 'done' ? 'lesson__steps-item lesson__steps-item--active' : 'lesson__steps-item'}>
            🎉 Done
          </li>
        </ol>
      </header>

      {phase === 'diagnostic' && (
        <Quiz
          key={`${L.id}-diagnostic`}
          title="🧠 Warm-up quiz"
          subtitle="Low pressure — we’re just seeing what you already know."
          questions={L.diagnosticQuestions}
          showHints
          submitLabel="Check my answer ✓"
          onComplete={onDiagnosticDone}
          lessonId={L.id}
          quizKind="diagnostic"
        />
      )}

      {phase === 'teach' && teachSlides.length > 0 && (
        <section className="teach">
          {skippedFullLesson && (
            <p className="teach__banner">
              <span aria-hidden>⚡️</span> You crushed the warm-up — here’s a lightning recap instead of
              the full lesson.
            </p>
          )}
          <LessonStory lesson={L} />
          {!skippedFullLesson && (
            <p className="teach__intro">
              <span aria-hidden>📖</span> Plain language, tiny steps. You’ve got this.
            </p>
          )}
          <div className="teach__card">
            <h2 className="teach__slide-title">{teachSlides[teachIdx]!.title}</h2>
            <TeachVisual kind={teachSlides[teachIdx]!.visual ?? 'none'} />
            <p className="teach__body">{teachSlides[teachIdx]!.body.replace(/\*\*/g, '')}</p>
          </div>
          <div className="teach__nav">
            <button
              type="button"
              className="btn"
              disabled={teachIdx === 0}
              onClick={() => setTeachIdx((x) => Math.max(0, x - 1))}
            >
              ← Back
            </button>
            <span className="teach__count">
              Slide {teachIdx + 1} / {teachSlides.length}
            </span>
            {teachIdx < teachSlides.length - 1 ? (
              <button type="button" className="btn primary" onClick={() => setTeachIdx((x) => x + 1)}>
                Next →
              </button>
            ) : (
              <button type="button" className="btn primary" onClick={() => setPhase('mastery')}>
                Bring on the test 🎯
              </button>
            )}
          </div>
        </section>
      )}

      {phase === 'mastery' && (
        <>
          <p className="lesson__hint">
            🎯 Score at least {(passMaster * 100).toFixed(0)}% to unlock the next stop on the path.
            (Educational fun — not advice.)
          </p>
          <Quiz
            key={`${L.id}-mastery-${masteryAttempt}`}
            title="🎯 Boss round"
            subtitle="Show off that beautiful brain — wrong answers are free lessons."
            questions={L.masteryQuestions}
            showHints={false}
            submitLabel="Lock it in ✓"
            onComplete={onMasteryDone}
            lessonId={L.id}
            quizKind="mastery"
          />
        </>
      )}

      {phase === 'done' && (
        <section className="done">
          <p className="done__emoji" aria-hidden>
            🎉
          </p>
          <h2 className="done__title">You did it!</h2>
          <p className="done__text">
            <strong>{L.title}</strong> is now in your mental toolkit. Come back anytime — spaced
            repetition is the cheat code for memory.
          </p>
          <div className="done__actions">
            {nextId && lessonsById[nextId] && (
              <button type="button" className="btn primary" onClick={() => navigate(`/lesson/${nextId}`)}>
                Next up: {lessonsById[nextId]!.title} →
              </button>
            )}
            <Link to="/" className="btn">
              Browse all topics 🗂️
            </Link>
          </div>
        </section>
      )}
    </div>
  )
}
