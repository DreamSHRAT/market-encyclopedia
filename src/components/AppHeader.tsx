import { Link } from 'react-router-dom'

export function AppHeader() {
  return (
    <header className="app-header">
      <Link to="/" className="app-header__brand">
        <span className="app-header__logo" aria-hidden>
          📈
        </span>
        <span className="app-header__text">
          <span className="app-header__name">Wizard Academy</span>
          <span className="app-header__tag">Learn markets · at your pace</span>
        </span>
      </Link>
    </header>
  )
}
