import './nav-bar.css'
import PillButton from './ui/pill-button.jsx'

// Transparent top nav. Wordmark left; contextual actions right.
const NavBar = ({ phase, onNewSession, onOpenHistory, onExitSession }) => {
  return (
    <header className="nav-bar">
      <button
        type="button"
        className="nav-bar__brand"
        onClick={onNewSession}
        aria-label="Whiteboard-fun home"
      >
        <span className="nav-bar__mark" aria-hidden="true" />
        <span className="nav-bar__wordmark">
          Whiteboard<span className="accent-sky">.fun</span>
        </span>
      </button>

      <nav className="nav-bar__actions">
        {phase === 'active' ? (
          <PillButton variant="secondary" className="pill-button--sm" onClick={onExitSession}>
            Exit session
          </PillButton>
        ) : (
          <>
            <button type="button" className="nav-bar__link" onClick={onOpenHistory}>
              History
            </button>
            <PillButton variant="primary" className="pill-button--sm" onClick={onNewSession}>
              New session
            </PillButton>
          </>
        )}
      </nav>
    </header>
  )
}

export default NavBar
