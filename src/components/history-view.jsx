import './history-view.css'
import PillButton from './ui/pill-button.jsx'
import { categoryLabel, difficultyLabel } from '../data/prompts.js'

const formatDate = (iso) => {
  const d = new Date(iso)
  return d.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })
}

const fmtTime = (sec) => `${Math.floor(sec / 60)}m`

// History + simple stats. Empty state nudges toward the first session.
const HistoryView = ({ sessions, onNewSession, onClear }) => {
  const count = sessions.length
  const avg =
    count > 0
      ? Math.round((sessions.reduce((s, x) => s + (x.totalScore || 0), 0) / count) * 10) / 10
      : 0

  return (
    <div className="app-band history">
      <section className="app-hero history__hero">
        <p className="app-hero__eyebrow t-eyebrow">Your practice log</p>
        <h1 className="t-display-section">{count > 0 ? 'Reps in the bank' : 'No sessions yet'}</h1>
        <p className="app-hero__sub t-body-lg">
          {count > 0
            ? 'Consistency beats intensity. One whiteboard a day adds up fast.'
            : 'Run your first session and it will show up here with your sketch and score.'}
        </p>
      </section>

      {count > 0 ? (
        <>
          <div className="history__stats">
            <div className="history__stat">
              <span className="t-display-section">{count}</span>
              <span className="t-caption history__stat-label">sessions</span>
            </div>
            <div className="history__stat">
              <span className="t-display-section">{avg}</span>
              <span className="t-caption history__stat-label">avg score / 25</span>
            </div>
          </div>

          <ul className="history__list">
            {sessions.map((s) => (
              <li key={s.id} className="history__item">
                {s.snapshot ? (
                  <img className="history__thumb" src={s.snapshot} alt="" />
                ) : (
                  <div className="history__thumb history__thumb--empty" />
                )}
                <div className="history__item-body">
                  <h2 className="t-heading-sm">{s.prompt.title}</h2>
                  <p className="t-caption history__item-meta">
                    {categoryLabel(s.prompt.category)} · {difficultyLabel(s.prompt.difficulty)} ·{' '}
                    {fmtTime(s.elapsedSec)} · {formatDate(s.endedAt)}
                  </p>
                  {s.notes && <p className="t-caption history__item-notes">“{s.notes}”</p>}
                </div>
                <div className="history__score">
                  <span className="t-heading-md">{s.totalScore}</span>
                  <span className="t-micro history__score-max">/25</span>
                </div>
              </li>
            ))}
          </ul>

          <div className="history__actions">
            <PillButton variant="primary" onClick={onNewSession}>
              New session
            </PillButton>
            <button type="button" className="history__clear t-caption" onClick={onClear}>
              Clear history
            </button>
          </div>
        </>
      ) : (
        <div className="history__empty">
          <PillButton variant="primary" onClick={onNewSession}>
            Start your first session
          </PillButton>
        </div>
      )}
    </div>
  )
}

export default HistoryView
