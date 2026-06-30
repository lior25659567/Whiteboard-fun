import './timer-bar.css'
import { formatClock } from '../hooks/use-timer.js'

// Countdown display + start/pause. Goes gently into overtime, never hard-locks.
const TimerBar = ({ remaining, running, overtime, durationSec, onToggle, onReset }) => {
  const pct = Math.max(0, Math.min(100, (remaining / durationSec) * 100))

  return (
    <div className={`timer-bar ${overtime ? 'timer-bar--over' : ''}`}>
      <div className="timer-bar__row">
        <span className="timer-bar__clock t-display-section">{formatClock(remaining)}</span>
        <div className="timer-bar__controls">
          <button type="button" className="timer-bar__btn" onClick={onToggle}>
            {running ? 'Pause' : remaining === durationSec ? 'Start' : 'Resume'}
          </button>
          <button type="button" className="timer-bar__btn timer-bar__btn--ghost" onClick={onReset}>
            Reset
          </button>
        </div>
      </div>
      <div className="timer-bar__track" role="progressbar" aria-valuenow={Math.round(pct)}>
        <div className="timer-bar__fill" style={{ width: `${pct}%` }} />
      </div>
      {overtime && <p className="timer-bar__note t-caption">Overtime — wrap up your thinking.</p>}
    </div>
  )
}

export default TimerBar
