import type { Lesson } from '../types/lesson'

function stripMd(s: string): string {
  return s.replace(/\*\*/g, '').replace(/\s+/g, ' ').trim()
}

function firstChunk(text: string, max: number): string {
  const t = stripMd(text)
  if (t.length <= max) return t
  const cut = t.slice(0, max)
  const lastSpace = cut.lastIndexOf(' ')
  return (lastSpace > 48 ? cut.slice(0, lastSpace) : cut) + '…'
}

function hashId(s: string): number {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

/**
 * Builds 2–4 short, playful paragraphs from the lesson title + teach slide copy
 * so concepts feel like a tiny story, not a textbook wall.
 */
export function buildLessonStory(L: Lesson): string[] {
  const slides = L.teachSlides
  if (slides.length === 0) return []

  const h = hashId(L.id)
  const title = stripMd(L.title)

  const coldOpens = [
    `You walk into today's lesson—“${title}”—and the narrator (us) is already way too invested. `,
    `Imagine explaining “${title}” to a friend at brunch. They only nod if it's simple and a little silly. `,
    `Opening scene: you're curious about “${title}.” The market doesn't do drama, but we do — in a good way. `,
  ]

  const p0 = coldOpens[h % coldOpens.length].replace(/\*\*/g, '') + firstChunk(slides[0].body, 210)

  const out: string[] = [p0]

  if (slides.length > 1) {
    const beats = [
      `Act two: the story pivots to “${stripMd(slides[1].title).slice(0, 72)}”. `,
      `Then the plot thickens: `,
      `Next reel: `,
    ]
    out.push(beats[h % beats.length] + firstChunk(slides[1].body, 200))
  }

  if (slides.length > 2) {
    const bridges = [
      `And because no good tale skips the twist — `,
      `Bonus beat: `,
      `Final campfire line: `,
    ]
    out.push(bridges[h % bridges.length] + firstChunk(slides[2].body, 160))
  }

  const closers = [
    `That's the vibe. The slides below unpack it step by step — same ideas, zero boredom.`,
    `Roll credits on story time; now we zoom in slide-by-slide so it sticks.`,
    `Fin. (Educational fan-fiction. Not advice — just memory glue.)`,
  ]
  out.push(closers[h % closers.length])

  return out.map(stripMd)
}
