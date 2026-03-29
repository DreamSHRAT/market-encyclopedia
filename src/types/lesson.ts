export type VisualKind =
  | 'none'
  | 'candle'
  | 'candle-bull-bear'
  | 'option-contract'
  | 'call-payoff'
  | 'put-payoff'

export type Question = {
  prompt: string
  choices: string[]
  correctIndex: number
  hint?: string
  explanation?: string
}

export type TeachSlide = {
  title: string
  body: string
  visual?: VisualKind
}

export type Lesson = {
  id: string
  title: string
  tags: string[]
  diagnosticQuestions: Question[]
  teachSlides: TeachSlide[]
  /** If diagnostic score ≥ pass ratio, show this instead of full teach slides */
  recapSlide?: TeachSlide
  masteryQuestions: Question[]
  /** Share of correct diagnostic answers to treat as “already knows this” (default 0.8) */
  diagnosticPassRatio?: number
  /** Share of correct mastery answers to pass (default 0.8) */
  masteryPassRatio?: number
}

export type Category = {
  id: string
  title: string
  description: string
}

export type LessonRef = {
  id: string
  categoryId: string
  /** Order within a category (home screen lists) */
  order: number
  /** Global learning path: lower = earlier. Used for “Next lesson” across the whole app */
  pathOrder: number
}

export type Catalog = {
  categories: Category[]
  lessons: LessonRef[]
}
