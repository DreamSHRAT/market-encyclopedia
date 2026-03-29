import { Navigate, Route, Routes } from 'react-router-dom'
import { AppHeader } from './components/AppHeader'
import { HomePage } from './pages/HomePage'
import { LessonPage } from './pages/LessonPage'

export default function App() {
  return (
    <div className="shell">
      <AppHeader />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/lesson/:lessonId" element={<LessonPage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      <footer className="footer">
        <p>
          Made for curious humans learning markets — not financial advice. Past lessons don’t predict
          tomorrow. Stay safe, stay skeptical, and size risk like a grown-up. 🛡️
        </p>
      </footer>
    </div>
  )
}
