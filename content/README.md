# Your curriculum (source of truth)

Put your teaching material here. The app and Cursor both use **files in this folder**, not a separate “training” step.

## What the web app reads today

- **Lessons:** `topics/*.json` (see `_template.topic.json`) — imported at build time.
- **Catalog:** `catalog.json` — categories and lesson order for the encyclopedia home screen.
- **Master blueprint (not auto-loaded yet):** `framework/WizardTrader_Academy_Core.v2.json` — teaching/testing logic, library integration bullets, global rules, and DB hints. Use **`@content/framework`** when you want the assistant to align new `topics/*.json` with that design.
- **Imported Stock Teaching curriculum:** `imported/stock-teaching-curriculum.json` (copy of `stock-teaching-app/web/data/curriculum.json`). Regenerate level lessons with `npm run generate:stock-lessons` after editing that file — outputs `topics/stock-teach-*.json`.
- **Reference PDFs** in `reference/`: kept for your research and for **@ mentions in Cursor**. They are **not** auto-ingested into the app (binary PDFs need a separate export-to-text or manual copy step).

## How “training” works in Cursor

- There is **no offline model training** on your PC from this folder.
- When you chat in Cursor, **@ mention** files or folders (e.g. `@content`) so the assistant **reads your text** and follows your wording, order, and definitions.
- Optional: add a project rule in `.cursor/rules` that says “when changing lessons, prefer `content/` over hard-coded copy.”

## Suggested layout

| Path | Purpose |
|------|--------|
| `topics/` | One file per topic (JSON below) or one subfolder per topic with `lesson.md` + `quiz.json` |
| `reference/` | Long notes, PDF text exports, glossary — good for @-context when writing or reviewing |
| `media/` | Images/SVG for diagrams (referenced by path in topic JSON) |

## Topic file format (JSON)

Each file in `topics/` describes **one lesson level**: gauge → teach → verify.

Fields:

- `id`, `title`, `tags` (e.g. `["options","calls"]`)
- `diagnosticQuestions[]` — short check before teaching (`prompt`, `choices[]`, `correctIndex`, `hint`)
- `teachSlides[]` — simple “5-year-old” steps (`title`, `body`, optional `visual`: `candle` \| `callput` \| `none`)
- `masteryQuestions[]` — must pass to unlock next (`prompt`, `choices[]`, `correctIndex`, `explanation`)

Copy `topics/_template.topic.json` and rename.

## Plain Markdown option

If you prefer free-form notes first, add `reference/my-notes.md` and split into JSON later, or use one markdown file per lesson with a agreed heading structure — say in chat which you use.

## Compliance

Educational only; not personalized investment advice. Keep disclaimers in app UI when you ship.
