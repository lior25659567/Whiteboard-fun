import { useState } from 'react'
import './whiteboard-tips.css'
import Card from './ui/card.jsx'

// Cross-cutting whiteboard-challenge tips: how to budget time across the steps,
// how to set up the board, and the mindset that scores well. Collapsible so it
// doesn't crowd the workspace.
const WhiteboardTips = ({ minutes }) => {
  const [open, setOpen] = useState(false)

  // Time plan: ~30% understanding, ~50% ideating + sketching, ~20% wrapping up
  // (mirrors the common "20m / 30m / 10m for an hour" guidance).
  const understand = Math.max(1, Math.round(minutes * 0.3))
  const wrap = Math.max(1, Math.round(minutes * 0.2))
  const sketch = Math.max(1, minutes - understand - wrap)

  return (
    <Card surface="cloud" radius="lg" className="wtips">
      <button
        type="button"
        className="wtips__head"
        aria-expanded={open}
        onClick={() => setOpen((o) => !o)}
      >
        <span className="t-eyebrow wtips__label">Whiteboarding tips</span>
        <span className="wtips__chevron" aria-hidden="true">
          {open ? '▾' : '▸'}
        </span>
      </button>

      {open && (
        <div className="wtips__body">
          <div className="wtips__tip">
            <span className="t-body-md wtips__tip-title">Budget your {minutes} minutes</span>
            <div className="wtips__plan">
              <span className="wtips__chip">Understand ~{understand}m</span>
              <span className="wtips__chip">Ideate &amp; sketch ~{sketch}m</span>
              <span className="wtips__chip">Wrap up ~{wrap}m</span>
            </div>
            <span className="t-caption wtips__tip-detail">
              Glance at the clock between steps so you leave time to summarise.
            </span>
          </div>

          <div className="wtips__tip">
            <span className="t-body-md wtips__tip-title">Split your board</span>
            <span className="t-caption wtips__tip-detail">
              Notes &amp; the user flow on the left; sketches on the right — rough ideas up top,
              detailed wireframes below.
            </span>
          </div>

          <div className="wtips__tip">
            <span className="t-body-md wtips__tip-title">Make it a conversation</span>
            <span className="t-caption wtips__tip-detail">
              Think out loud, narrate your reasoning, and fold in the interviewer’s feedback. They’re
              judging your process, not the final pixels.
            </span>
          </div>

          <div className="wtips__tip">
            <span className="t-body-md wtips__tip-title">It’s about the process</span>
            <span className="t-caption wtips__tip-detail">
              Show you can think critically, design for the user, weigh business goals, and handle the
              ambiguity calmly.
            </span>
          </div>

          <p className="t-micro wtips__source">Based on common UX whiteboard-interview guidance.</p>
        </div>
      )}
    </Card>
  )
}

export default WhiteboardTips
