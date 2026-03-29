/**
 * Reads content/imported/stock-teaching-curriculum.json and writes
 * content/topics/stock-teach-*.json (one lesson per level).
 * Run: node tools/generate-stock-teaching-lessons.mjs
 */
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __dirname = path.dirname(fileURLToPath(import.meta.url))
const root = path.join(__dirname, '..')

function trunc(s, n) {
  const t = (s || '').replace(/\s+/g, ' ').trim()
  if (t.length <= n) return t
  return t.slice(0, n - 1) + '…'
}

function hashStr(s) {
  let h = 0
  for (let i = 0; i < s.length; i++) h = (Math.imul(31, h) + s.charCodeAt(i)) | 0
  return Math.abs(h)
}

function shuffle3(correct, w1, w2, seed) {
  const arr = [
    { text: correct, ok: true },
    { text: w1, ok: false },
    { text: w2, ok: false },
  ]
  let x = seed % 100000
  for (let i = 2; i > 0; i--) {
    x = (x * 1103515245 + 12345) & 0x7fffffff
    const j = x % (i + 1)
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return {
    choices: arr.map((a) => a.text),
    correctIndex: arr.findIndex((a) => a.ok),
  }
}

function wrongPool(item, items) {
  return items.filter((x) => x.id !== item.id).map((x) => trunc(x.answer, 220))
}

function buildMCQ(item, items) {
  const correct = trunc(item.answer, 220)
  const pool = wrongPool(item, items).filter((t) => t && t !== correct)
  const w1 = pool[hashStr(item.id + 'a') % pool.length] || 'Inflation only affects bonds, never stocks.'
  let w2 = pool[hashStr(item.id + 'b') % pool.length] || 'Diversification means one stock only.'
  if (w2 === w1) w2 = pool[(hashStr(item.id + 'c') + 1) % pool.length] || w1 + ' (variant).'
  const { choices, correctIndex } = shuffle3(correct, w1, w2, hashStr(item.id))
  return {
    prompt: item.question,
    choices,
    correctIndex,
    hint: 'Pick the answer that matches the plain-language idea from the lesson.',
    explanation: trunc(item.answer, 280),
  }
}

function levelToLesson(level) {
  const items = level.items
  const id = `stock-teach-${level.levelId}`
  const teachSlides = items.map((it) => ({
    title: trunc(it.question, 120),
    body: `${it.answer}\n\n**Example:** ${it.example}`,
    visual: 'none',
  }))

  const diagItems = [items[0], items[1]]
  const diagnosticQuestions = diagItems.map((it) => buildMCQ(it, items))

  const last3 = items.slice(-3)
  const masteryQuestions = last3.map((it) => {
    const q = buildMCQ(it, items)
    delete q.hint
    return q
  })

  const recapSlide = {
    title: `⚡ ${trunc(level.levelTitle, 80)}`,
    body: `${level.levelSummary}\n\nStart with the first card anytime you need a reset.`,
    visual: 'none',
  }

  return {
    id,
    title: level.levelTitle.replace(/^Level \d+ — /, 'Foundations: '),
    tags: ['stock-teaching', level.levelId, 'basics'],
    diagnosticQuestions,
    teachSlides,
    recapSlide,
    masteryQuestions,
    diagnosticPassRatio: 0.8,
    masteryPassRatio: 0.66,
  }
}

const raw = JSON.parse(
  fs.readFileSync(path.join(root, 'content/imported/stock-teaching-curriculum.json'), 'utf8'),
)

for (const level of raw.sequence) {
  const lesson = levelToLesson(level)
  const out = path.join(root, 'content/topics', `${lesson.id}.json`)
  fs.writeFileSync(out, JSON.stringify(lesson, null, 2) + '\n', 'utf8')
  console.log('Wrote', path.relative(root, out))
}

console.log('Done.')
