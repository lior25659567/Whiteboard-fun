import { useState } from 'react'
import './solution-view.css'
import SketchPreview from './sketch-preview.jsx'
import { FRAMEWORK_STEPS } from '../data/frameworks.js'

// How much of the worked solution to give away, by the prompt's difficulty:
//   warm-up → 'full'   : every step's answer + the sketch, all shown.
//   core    → 'medium' : answers shown; the example sketch waits behind a toggle
//                        (picture the screen yourself first).
//   stretch → 'lean'   : only the approach (step labels). The answers AND sketch
//                        stay hidden until you choose to reveal them.
const DEPTH = { warmup: 'full', core: 'medium', stretch: 'lean' }

const LEVEL_NOTE = {
  full: 'Warm-up — here’s the full worked answer.',
  medium: 'Core — answers are shown. Try to picture the screen before revealing the sketch.',
  lean: 'Stretch — you get the approach only. Reveal the full answer if you get stuck.',
}

// The standard questions that "clarifying the challenge" actually means asking,
// before you draw anything.
const CLARIFY_QUESTIONS = [
  'Who exactly is this for, and what’s their biggest pain?',
  'Where and when will they use it?',
  'What’s the business goal behind it?',
  'Any constraints — data scale, permissions, device?',
  'What does “this worked” look like?',
]

// The clarify step, shown concretely: define the problem, surface the pain
// points, and list the questions to ask — pulled from the brief itself, so it's
// obvious how "clarifying" actually works for this challenge.
const ClarifyBlock = ({ prompt }) => (
  <div className="clarify">
    <p className="t-caption clarify__intro">
      Before drawing, do three things: restate the problem, surface the user’s pain points, and ask
      what’s still unclear.
    </p>
    <div className="clarify__part">
      <span className="t-eyebrow clarify__heading">1 · The problem to solve</span>
      <p className="t-caption clarify__text">{prompt?.scenario}</p>
    </div>
    <div className="clarify__part">
      <span className="t-eyebrow clarify__heading">2 · Pain points to dig into</span>
      <p className="t-caption clarify__text clarify__who">For {prompt?.primaryUser}:</p>
      <ul className="clarify__list">
        {(prompt?.constraints || []).map((c) => (
          <li key={c} className="t-caption">
            {c}
          </li>
        ))}
      </ul>
    </div>
    <div className="clarify__part">
      <span className="t-eyebrow clarify__heading">3 · Questions to ask first</span>
      <ul className="clarify__list">
        {CLARIFY_QUESTIONS.map((q) => (
          <li key={q} className="t-caption">
            {q}
          </li>
        ))}
      </ul>
    </div>
  </div>
)

const SolutionView = ({ solution, level = 'warmup', onInsertSketch, prompt }) => {
  const depth = DEPTH[level] || 'full'
  const [open, setOpen] = useState(false)

  if (!solution) return null
  // Walk through every framework step in order. Use the prompt's specific answer
  // where we have one; fall back to the step's own guidance (e.g. "Generate
  // ideas", which is your own divergent thinking rather than a fixed answer).
  const steps = FRAMEWORK_STEPS
  const detailFor = (step) => solution.steps?.[step.id] || step.hint

  const showDetails = depth !== 'lean' || open
  const showSketch = depth === 'full' || open
  const showToggle = depth !== 'full' && !open
  const toggleLabel =
    depth === 'lean' ? 'Reveal the full answer →' : 'Show the example sketch →'

  return (
    <div className="solution">
      <p className="t-caption solution__level-note">{LEVEL_NOTE[depth]}</p>

      <section className="solution__section">
        <p className="t-eyebrow solution__label accent-sky">
          {depth === 'lean' ? 'The approach — step by step' : 'How this prompt fits the framework'}
        </p>
        <ol className={`solution__steps ${showDetails ? '' : 'solution__steps--labels'}`}>
          {steps.map((step, i) => (
            <li key={step.id} className="solution__step">
              <span className="solution__num" aria-hidden="true">
                {i + 1}
              </span>
              <span className="solution__step-body">
                <span className="t-body-md solution__step-title">{step.label}</span>
                {showDetails &&
                  (step.id === 'scope' ? (
                    <ClarifyBlock prompt={prompt} />
                  ) : (
                    <span className="t-caption solution__step-detail">{detailFor(step)}</span>
                  ))}
              </span>
            </li>
          ))}
        </ol>
      </section>

      {showSketch && (
        <section className="solution__section">
          <p className="t-eyebrow solution__label accent-sky">What it could look like</p>
          <div className="solution__sketches">
            {solution.sketches.map((sketch) => (
              <figure key={sketch.caption} className="solution__sketch">
                <SketchPreview blocks={sketch.blocks} />
                <figcaption className="t-caption solution__sketch-caption">{sketch.caption}</figcaption>
                {onInsertSketch && (
                  <button
                    type="button"
                    className="solution__insert t-caption"
                    onClick={() => onInsertSketch(sketch.blocks)}
                  >
                    ↘ Insert into canvas
                  </button>
                )}
              </figure>
            ))}
          </div>
        </section>
      )}

      {showToggle && (
        <button type="button" className="solution__reveal t-caption" onClick={() => setOpen(true)}>
          {toggleLabel}
        </button>
      )}
    </div>
  )
}

export default SolutionView
