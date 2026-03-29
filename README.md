# Market Encyclopedia

Interactive lesson app (Wizard Academy): diagnostic → teach → mastery quizzes, built with React, TypeScript, and Vite.

## Scripts

- `npm install` — install dependencies
- `npm run dev` — local dev server
- `npm run build` — production build to `dist/`
- `npm run generate:stock-lessons` — regenerate Stock Teaching lessons from `content/imported/stock-teaching-curriculum.json`

## Deploy

Publish the `dist` folder (e.g. Netlify: build command `npm run build`, publish directory `dist`). SPA routing is handled via `public/_redirects` copied into the build.
