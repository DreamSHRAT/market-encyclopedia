import type { Catalog, Lesson } from '../types/lesson'
import catalogJson from '../../content/catalog.json'
import stockBeginner from '../../content/topics/stock-teach-beginner.json'
import stockBuilding from '../../content/topics/stock-teach-building.json'
import stockIntermediate from '../../content/topics/stock-teach-intermediate.json'
import stockAdvanced from '../../content/topics/stock-teach-advanced.json'
import candles01 from '../../content/topics/candles-01-one-bar.json'
import candles02 from '../../content/topics/candles-02-bull-bear.json'
import chartPatterns from '../../content/topics/chart-patterns-basics.json'
import marketHealth from '../../content/topics/market-health-accumulation.json'
import canSlim from '../../content/topics/can-slim-overview.json'
import darvasBox from '../../content/topics/darvas-box-theory.json'
import lynchGarp from '../../content/topics/lynch-garp-basics.json'
import schwagerPsy from '../../content/topics/schwager-psychology-risk.json'
import paulosMath from '../../content/topics/paulos-math-myths.json'
import sorosReflex from '../../content/topics/soros-reflexivity-cycles.json'
import riskStops from '../../content/topics/risk-stops-seven-eight.json'
import options01 from '../../content/topics/options-01-contract.json'
import options02 from '../../content/topics/options-02-calls.json'
import options03 from '../../content/topics/options-03-puts.json'

export const catalog = catalogJson as Catalog

const lessons: Lesson[] = [
  stockBeginner as Lesson,
  stockBuilding as Lesson,
  stockIntermediate as Lesson,
  stockAdvanced as Lesson,
  candles01 as Lesson,
  candles02 as Lesson,
  chartPatterns as Lesson,
  marketHealth as Lesson,
  canSlim as Lesson,
  darvasBox as Lesson,
  lynchGarp as Lesson,
  schwagerPsy as Lesson,
  paulosMath as Lesson,
  sorosReflex as Lesson,
  riskStops as Lesson,
  options01 as Lesson,
  options02 as Lesson,
  options03 as Lesson,
]

export const lessonsById: Record<string, Lesson> = Object.fromEntries(
  lessons.map((l) => [l.id, l]),
)

export function getLesson(id: string): Lesson | undefined {
  return lessonsById[id]
}

function sortByPathOrder() {
  return [...catalog.lessons].sort((a, b) => a.pathOrder - b.pathOrder)
}

export function getNextLessonId(currentId: string): string | undefined {
  const ordered = sortByPathOrder()
  const idx = ordered.findIndex((r) => r.id === currentId)
  if (idx === -1 || idx === ordered.length - 1) return undefined
  return ordered[idx + 1]?.id
}

export function lessonRefsSorted() {
  return sortByPathOrder()
}
