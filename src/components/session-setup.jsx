import { useState } from 'react'
import './session-setup.css'
import PillTab from './ui/pill-tab.jsx'
import PillButton from './ui/pill-button.jsx'
import CustomChallenge from './custom-challenge.jsx'
import { CATEGORIES, DIFFICULTIES } from '../data/prompts.js'

const DURATIONS = [
  { min: 10, label: '10 min' },
  { min: 20, label: '20 min' },
  { min: 30, label: '30 min' },
  { min: 45, label: '45 min' },
]

// Setup screen: choose what to practice, then start a session.
const SessionSetup = ({ onStart, onStartCustom, hasHistory, onOpenHistory }) => {
  const [category, setCategory] = useState('all')
  const [difficulty, setDifficulty] = useState('all')
  const [minutes, setMinutes] = useState(20)

  return (
    <div className="app-band session-setup">
      <section className="app-hero">
        <p className="app-hero__eyebrow t-eyebrow">Data UX whiteboard practice</p>
        <h1 className="t-display-section">Sketch your way through Fabric-style problems</h1>
        <p className="app-hero__sub t-body-lg">
          Pull a realistic data-product prompt, set a timer, work the framework, and whiteboard a
          solution. Then score yourself and watch your reps add up.
        </p>
      </section>

      <div className="session-setup__picker">
        <fieldset className="session-setup__group">
          <legend className="t-eyebrow session-setup__legend">Focus area</legend>
          <div className="session-setup__pills">
            {CATEGORIES.map((c) => (
              <PillTab key={c.id} active={category === c.id} onClick={() => setCategory(c.id)}>
                {c.label}
              </PillTab>
            ))}
          </div>
        </fieldset>

        <fieldset className="session-setup__group">
          <legend className="t-eyebrow session-setup__legend">Difficulty</legend>
          <div className="session-setup__pills">
            {DIFFICULTIES.map((d) => (
              <PillTab key={d.id} active={difficulty === d.id} onClick={() => setDifficulty(d.id)}>
                {d.label}
              </PillTab>
            ))}
          </div>
        </fieldset>

        <fieldset className="session-setup__group">
          <legend className="t-eyebrow session-setup__legend">Time on the clock</legend>
          <div className="session-setup__pills">
            {DURATIONS.map((d) => (
              <PillTab key={d.min} active={minutes === d.min} onClick={() => setMinutes(d.min)}>
                {d.label}
              </PillTab>
            ))}
          </div>
        </fieldset>

        <div className="session-setup__actions">
          <PillButton variant="primary" onClick={() => onStart({ category, difficulty, minutes })}>
            Start session
          </PillButton>
          {hasHistory && (
            <PillButton variant="secondary" onClick={onOpenHistory}>
              View past sessions
            </PillButton>
          )}
        </div>

        <CustomChallenge minutes={minutes} onStart={onStartCustom} />
      </div>
    </div>
  )
}

export default SessionSetup
