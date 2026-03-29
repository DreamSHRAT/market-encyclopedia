/** Scene “props” for each question — keeps quizzes feel like little skits */
const SCENE_EMOJIS = [
  '🎬',
  '🍿',
  '🧃',
  '🎮',
  '🌿',
  '📗',
  '🧠',
  '☕',
  '🎯',
  '🐢',
  '🦊',
  '🎢',
  '🥨',
  '🛼',
  '🎪',
  '🌱',
]

function hash(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

export function quizSceneEmoji(
  lessonId: string,
  questionIndex: number,
  kind: 'diagnostic' | 'mastery',
): string {
  const salt = kind === 'mastery' ? 17 : 3
  const idx = (hash(lessonId) + questionIndex * 11 + salt) % SCENE_EMOJIS.length
  return SCENE_EMOJIS[idx]!
}
