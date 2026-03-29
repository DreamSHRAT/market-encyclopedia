import { useMemo } from 'react'
import { buildLessonStory } from '../lib/storyFromLesson'
import type { Lesson } from '../types/lesson'

type Props = { lesson: Lesson }

export function LessonStory({ lesson }: Props) {
  const paragraphs = useMemo(() => buildLessonStory(lesson), [lesson])

  if (paragraphs.length === 0) return null

  return (
    <aside className="story-panel" aria-label="Story intro">
      <div className="story-panel__ribbon">
        <span className="story-panel__icon" aria-hidden>
          📗
        </span>
        <h2 className="story-panel__title">Story mode</h2>
      </div>
      <div className="story-panel__body">
        {paragraphs.map((p, i) => (
          <p key={i} className="story-panel__p">
            {p}
          </p>
        ))}
      </div>
    </aside>
  )
}
