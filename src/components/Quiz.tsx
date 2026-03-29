import { useRef, useState } from 'react'
import type { Question } from '../types/lesson'
import { quizSceneEmoji } from '../lib/quizMascots'

type Props = {
  title: string
  subtitle?: string
  questions: Question[]
  showHints?: boolean
  submitLabel?: string
  onComplete: (correct: number, total: number) => void
  lessonId: string
  quizKind: 'diagnostic' | 'mastery'
}

export function Quiz({
  title,
  subtitle,
  questions,
  showHints = true,
  submitLabel = 'Check ✓',
  onComplete,
  lessonId,
  quizKind,
}: Props) {
  const [i, setI] = useState(0)
  const [picked, setPicked] = useState<number | null>(null)
  const [revealed, setRevealed] = useState(false)
  const scoreRef = useRef(0)

  const q = questions[i]
  const last = i === questions.length - 1
  const progressPct = ((i + 1) / questions.length) * 100
  const scene = quizSceneEmoji(lessonId, i, quizKind)

  function choose(idx: number) {
    if (revealed) return
    setPicked(idx)
  }

  function check() {
    if (picked === null) return
    setRevealed(true)
    if (picked === q.correctIndex) {
      scoreRef.current += 1
    }
  }

  function handleAfterReveal() {
    if (last) {
      onComplete(scoreRef.current, questions.length)
      return
    }
    setI((x) => x + 1)
    setPicked(null)
    setRevealed(false)
  }

  const gotItRight = revealed && picked === q.correctIndex

  return (
    <section className="quiz">
      <div className="quiz__head">
        <h2 className="quiz__title">{title}</h2>
        {subtitle && <p className="quiz__subtitle">{subtitle}</p>}
        <div className="quiz__bar-wrap" aria-hidden>
          <div className="quiz__bar" style={{ width: `${progressPct}%` }} />
        </div>
        <p className="quiz__progress">
          Question {i + 1} of {questions.length}
        </p>
      </div>

      <div className="quiz__scene" aria-hidden>
        <div className="quiz__scene-circle">
          <span className="quiz__scene-emoji">{scene}</span>
        </div>
        <p className="quiz__scene-label">Scene {i + 1} — tap an answer</p>
      </div>

      <p className="quiz__prompt">{q.prompt}</p>
      <ul className="quiz__choices">
        {q.choices.map((c, idx) => (
          <li key={idx}>
            <button
              type="button"
              className={
                'quiz__choice' +
                (picked === idx ? ' quiz__choice--picked' : '') +
                (revealed
                  ? idx === q.correctIndex
                    ? ' quiz__choice--correct'
                    : picked === idx
                      ? ' quiz__choice--wrong'
                      : ''
                  : '')
              }
              onClick={() => choose(idx)}
            >
              <span className="quiz__choice-text">{c}</span>
            </button>
          </li>
        ))}
      </ul>
      {showHints && q.hint && !revealed && (
        <p className="quiz__hint">
          <span className="quiz__hint-emoji" aria-hidden>
            💡
          </span>
          <span>
            <strong>Hint:</strong> {q.hint}
          </span>
        </p>
      )}

      {revealed && (
        <div className={'quiz__reveal' + (gotItRight ? ' quiz__reveal--win' : ' quiz__reveal--learn')}>
          <div className="quiz__face-row">
            {gotItRight ? (
              <>
                <span className="quiz__face quiz__face--happy" aria-hidden>
                  😄
                </span>
                <div className="quiz__face-text">
                  <strong>Nailed it!</strong>
                  <span>That’s the green light — brain cells high-fiving.</span>
                </div>
              </>
            ) : (
              <>
                <span className="quiz__face quiz__face--oops" aria-hidden>
                  🥺
                </span>
                <div className="quiz__face-text">
                  <strong>Plot twist!</strong>
                  <span>Wrong answer — but every miss is free data. Read below, then bounce back.</span>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {revealed && q.explanation && (
        <p className="quiz__explain">{q.explanation}</p>
      )}

      <div className="quiz__actions">
        {!revealed ? (
          <button type="button" className="btn primary" onClick={check} disabled={picked === null}>
            {submitLabel}
          </button>
        ) : (
          <button type="button" className="btn primary" onClick={handleAfterReveal}>
            {last ? 'Continue →' : 'Next question →'}
          </button>
        )}
      </div>
    </section>
  )
}
