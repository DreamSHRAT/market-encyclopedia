const KEY = 'market-encyclopedia-progress-v1'

export type ProgressState = {
  completedLessonIds: string[]
}

export function loadProgress(): ProgressState {
  try {
    const raw = localStorage.getItem(KEY)
    if (!raw) return { completedLessonIds: [] }
    const parsed = JSON.parse(raw) as ProgressState
    if (!Array.isArray(parsed.completedLessonIds)) {
      return { completedLessonIds: [] }
    }
    return parsed
  } catch {
    return { completedLessonIds: [] }
  }
}

export function markLessonComplete(lessonId: string) {
  const p = loadProgress()
  if (p.completedLessonIds.includes(lessonId)) return
  p.completedLessonIds.push(lessonId)
  localStorage.setItem(KEY, JSON.stringify(p))
}

export function isLessonComplete(lessonId: string): boolean {
  return loadProgress().completedLessonIds.includes(lessonId)
}
