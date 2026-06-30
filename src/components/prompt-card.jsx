import { useState } from 'react'
import './prompt-card.css'
import Card from './ui/card.jsx'
import SolutionView from './solution-view.jsx'
import { categoryLabel, difficultyLabel } from '../data/prompts.js'

// The active prompt. Hints stay hidden until revealed so you attempt it cold.
const PromptCard = ({ prompt, onSkip, onInsertSketch }) => {
  const [revealed, setRevealed] = useState(false)

  return (
    <Card surface="canvas" radius="lg" className="prompt-card">
      <div className="prompt-card__meta">
        <span className="prompt-card__tag t-eyebrow">{categoryLabel(prompt.category)}</span>
        <span className="prompt-card__tag prompt-card__tag--soft t-eyebrow">
          {difficultyLabel(prompt.difficulty)}
        </span>
      </div>

      <h2 className="t-heading-lg prompt-card__title">{prompt.title}</h2>
      {prompt.context && (
        <p className="t-caption prompt-card__context">
          <span className="prompt-card__context-dot" aria-hidden="true" />
          {prompt.context}
        </p>
      )}
      <p className="t-body-md prompt-card__scenario">{prompt.scenario}</p>

      <dl className="prompt-card__facts">
        <div className="prompt-card__fact">
          <dt className="t-eyebrow">Primary user</dt>
          <dd className="t-body-md">{prompt.primaryUser}</dd>
        </div>
        <div className="prompt-card__fact">
          <dt className="t-eyebrow">Constraints</dt>
          <dd>
            <ul className="prompt-card__list">
              {prompt.constraints.map((c) => (
                <li key={c} className="t-body-md">
                  {c}
                </li>
              ))}
            </ul>
          </dd>
        </div>
      </dl>

      <div className="prompt-card__hints">
        {revealed ? (
          <SolutionView
            solution={prompt.solution}
            level={prompt.difficulty}
            onInsertSketch={onInsertSketch}
            prompt={prompt}
          />
        ) : (
          <button
            type="button"
            className="prompt-card__reveal t-caption"
            onClick={() => setRevealed(true)}
          >
            {prompt.difficulty === 'stretch'
              ? 'Show the approach →'
              : 'Show the full walkthrough & sketches →'}
          </button>
        )}
      </div>

      {onSkip && (
        <button type="button" className="prompt-card__skip t-caption" onClick={onSkip}>
          Swap for a different prompt
        </button>
      )}
    </Card>
  )
}

export default PromptCard
