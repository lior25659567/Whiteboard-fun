import './framework-checklist.css'
import Card from './ui/card.jsx'
import { FRAMEWORK_STEPS } from '../data/frameworks.js'

// The UX-whiteboard structure. Checking items builds a repeatable habit and
// feeds the session record. Sky check = active brand accent.
const FrameworkChecklist = ({ checks, onToggle }) => {
  const done = FRAMEWORK_STEPS.filter((s) => checks[s.id]).length

  return (
    <Card surface="cloud" radius="lg" className="framework">
      <div className="framework__head">
        <p className="t-eyebrow framework__label">Your approach</p>
        <span className="t-caption framework__count">
          {done}/{FRAMEWORK_STEPS.length}
        </span>
      </div>

      <ul className="framework__list">
        {FRAMEWORK_STEPS.map((step, i) => {
          const checked = !!checks[step.id]
          return (
            <li key={step.id}>
              <button
                type="button"
                className={`framework__item ${checked ? 'framework__item--done' : ''}`}
                onClick={() => onToggle(step.id)}
                aria-pressed={checked}
              >
                <span className="framework__box" aria-hidden="true">
                  {checked ? '✓' : i + 1}
                </span>
                <span className="framework__text">
                  <span className="t-body-md framework__step-label">{step.label}</span>
                  <span className="t-caption framework__step-hint">{step.hint}</span>
                  {step.tip && (
                    <span className="t-micro framework__step-tip">
                      <span aria-hidden="true">💡 </span>
                      {step.tip}
                    </span>
                  )}
                </span>
              </button>
            </li>
          )
        })}
      </ul>
    </Card>
  )
}

export default FrameworkChecklist
