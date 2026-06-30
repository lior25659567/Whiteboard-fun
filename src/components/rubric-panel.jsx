import { useMemo, useState } from 'react'
import './rubric-panel.css'
import PillButton from './ui/pill-button.jsx'
import { RUBRIC_CRITERIA, SCORE_SCALE, scoreLabel } from '../data/rubric.js'
import { categoryLabel, difficultyLabel } from '../data/prompts.js'

// Review screen: self-score against the rubric, add notes, save the session.
const RubricPanel = ({ prompt, elapsedSec, snapshot, onSave, onDiscard }) => {
  const [scores, setScores] = useState({})
  const [notes, setNotes] = useState('')

  const scored = RUBRIC_CRITERIA.filter((c) => scores[c.id]).length
  const total = useMemo(
    () => RUBRIC_CRITERIA.reduce((sum, c) => sum + (scores[c.id] || 0), 0),
    [scores],
  )
  const maxTotal = RUBRIC_CRITERIA.length * 5
  const complete = scored === RUBRIC_CRITERIA.length

  const setScore = (id, value) => setScores((prev) => ({ ...prev, [id]: value }))

  const handleSave = () => {
    onSave({ rubric: scores, totalScore: total, notes: notes.trim() })
  }

  const mins = Math.floor(elapsedSec / 60)
  const secs = elapsedSec % 60

  return (
    <div className="app-band rubric">
      <section className="app-hero rubric__hero">
        <p className="app-hero__eyebrow t-eyebrow">Session review</p>
        <h1 className="t-display-section">How did that go?</h1>
        <p className="app-hero__sub t-body-lg">
          Score yourself honestly — the trend across sessions is what makes you sharper.
        </p>
      </section>

      <div className="rubric__body">
        <div className="rubric__summary">
          {snapshot ? (
            <img className="rubric__thumb" src={snapshot} alt="Your whiteboard sketch" />
          ) : (
            <div className="rubric__thumb rubric__thumb--empty t-caption">No sketch captured</div>
          )}
          <div className="rubric__summary-meta">
            <h2 className="t-heading-md">{prompt.title}</h2>
            <p className="t-caption rubric__summary-tags">
              {categoryLabel(prompt.category)} · {difficultyLabel(prompt.difficulty)}
            </p>
            <p className="t-caption rubric__summary-time">
              Time spent: {mins}m {String(secs).padStart(2, '0')}s
            </p>
          </div>
        </div>

        <ul className="rubric__criteria">
          {RUBRIC_CRITERIA.map((c) => (
            <li key={c.id} className="rubric__criterion">
              <div className="rubric__criterion-head">
                <span className="t-body-md rubric__criterion-label">{c.label}</span>
                <span className="t-caption rubric__criterion-score">
                  {scores[c.id] ? scoreLabel(scores[c.id]) : '—'}
                </span>
              </div>
              <p className="t-caption rubric__criterion-hint">{c.hint}</p>
              <div className="rubric__scale">
                {SCORE_SCALE.map((n) => (
                  <button
                    key={n}
                    type="button"
                    className={`rubric__dot ${scores[c.id] === n ? 'rubric__dot--active' : ''}`}
                    onClick={() => setScore(c.id, n)}
                    aria-label={`${c.label}: ${n} of 5`}
                  >
                    {n}
                  </button>
                ))}
              </div>
            </li>
          ))}
        </ul>

        <label className="rubric__notes">
          <span className="t-eyebrow rubric__notes-label">Notes to your future self</span>
          <textarea
            className="rubric__notes-input t-body-md"
            rows={3}
            placeholder="What worked, what you missed, what to try next time…"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
          />
        </label>

        <div className="rubric__footer">
          <div className="rubric__total">
            <span className="t-display-section">{total}</span>
            <span className="t-caption rubric__total-max">/ {maxTotal}</span>
          </div>
          <div className="rubric__actions">
            <PillButton variant="ghost" onClick={onDiscard}>
              Discard
            </PillButton>
            <PillButton variant="primary" disabled={!complete} onClick={handleSave}>
              {complete ? 'Save session' : `Score all ${RUBRIC_CRITERIA.length}`}
            </PillButton>
          </div>
        </div>
      </div>
    </div>
  )
}

export default RubricPanel
