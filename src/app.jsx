import { useCallback, useRef, useState } from 'react'

import NavBar from './components/nav-bar.jsx'
import SessionSetup from './components/session-setup.jsx'
import PromptCard from './components/prompt-card.jsx'
import TimerBar from './components/timer-bar.jsx'
import FrameworkChecklist from './components/framework-checklist.jsx'
import WhiteboardTips from './components/whiteboard-tips.jsx'
import Whiteboard from './components/whiteboard.jsx'
import RubricPanel from './components/rubric-panel.jsx'
import HistoryView from './components/history-view.jsx'
import PillButton from './components/ui/pill-button.jsx'

import { useTimer } from './hooks/use-timer.js'
import { useHistory } from './hooks/use-local-storage.js'
import { pickPrompt } from './data/prompts.js'

const newId = () => `${Date.now().toString(36)}-${Math.floor(Math.random() * 1e6).toString(36)}`

// phases: 'setup' | 'active' | 'review' | 'history'
const App = () => {
  const [phase, setPhase] = useState('setup')
  const [config, setConfig] = useState({ category: 'all', difficulty: 'all', minutes: 20 })
  const [prompt, setPrompt] = useState(null)
  const [checks, setChecks] = useState({})
  const [review, setReview] = useState(null) // { snapshot, elapsedSec }

  const whiteboardRef = useRef(null)
  const { sessions, addSession, clearHistory } = useHistory()

  const durationSec = config.minutes * 60
  const timer = useTimer(durationSec)
  const { reset: resetTimer, start: startTimer } = timer

  const startSession = useCallback(
    (cfg) => {
      setConfig(cfg)
      setPrompt(pickPrompt(cfg.category, cfg.difficulty))
      setChecks({})
      setReview(null)
      setPhase('active')
      // Kick the timer off after the duration has been applied.
      setTimeout(() => startTimer(), 0)
    },
    [startTimer],
  )

  // Start a session on a user-supplied (AI-generated) custom challenge.
  const startCustomSession = useCallback(
    (customPrompt, minutes) => {
      setConfig({ category: 'custom', difficulty: customPrompt.difficulty, minutes })
      setPrompt(customPrompt)
      setChecks({})
      setReview(null)
      setPhase('active')
      setTimeout(() => startTimer(), 0)
    },
    [startTimer],
  )

  const swapPrompt = useCallback(() => {
    setPrompt((cur) => pickPrompt(config.category, config.difficulty, cur?.id))
  }, [config])

  const toggleCheck = useCallback(
    (id) => setChecks((prev) => ({ ...prev, [id]: !prev[id] })),
    [],
  )

  const insertSketch = useCallback((blocks) => {
    whiteboardRef.current?.insertSketch(blocks)
  }, [])

  const finishSession = useCallback(async () => {
    timer.pause()
    let snapshot = null
    if (whiteboardRef.current && !whiteboardRef.current.isEmpty()) {
      snapshot = await whiteboardRef.current.exportThumbnail()
    }
    setReview({ snapshot, elapsedSec: Math.max(0, timer.elapsedSec) })
    setPhase('review')
  }, [timer])

  const saveSession = useCallback(
    ({ rubric, totalScore, notes }) => {
      addSession({
        id: newId(),
        prompt,
        category: config.category,
        difficulty: config.difficulty,
        durationSec,
        elapsedSec: review?.elapsedSec ?? 0,
        frameworkChecks: checks,
        snapshot: review?.snapshot ?? null,
        rubric,
        totalScore,
        notes,
        endedAt: new Date().toISOString(),
      })
      resetTimer()
      setPhase('history')
    },
    [addSession, prompt, config, durationSec, review, checks, resetTimer],
  )

  const goSetup = useCallback(() => {
    resetTimer()
    setPhase('setup')
  }, [resetTimer])

  const exitToSetup = useCallback(() => {
    resetTimer()
    setReview(null)
    setPhase('setup')
  }, [resetTimer])

  return (
    <div className="app">
      <NavBar
        phase={phase}
        onNewSession={goSetup}
        onOpenHistory={() => setPhase('history')}
        onExitSession={exitToSetup}
      />

      {phase === 'setup' && (
        <SessionSetup
          onStart={startSession}
          onStartCustom={startCustomSession}
          hasHistory={sessions.length > 0}
          onOpenHistory={() => setPhase('history')}
        />
      )}

      {phase === 'active' && prompt && (
        <main className="app-workspace">
          <aside className="app-workspace__sidebar">
            <PromptCard
              key={prompt.id}
              prompt={prompt}
              onSkip={prompt.custom ? undefined : swapPrompt}
              onInsertSketch={insertSketch}
            />
            <TimerBar
              remaining={timer.remaining}
              running={timer.running}
              overtime={timer.overtime}
              durationSec={durationSec}
              onToggle={timer.toggle}
              onReset={timer.reset}
            />
            <FrameworkChecklist checks={checks} onToggle={toggleCheck} />
            <WhiteboardTips minutes={config.minutes} />
            <PillButton variant="primary" onClick={finishSession}>
              Finish &amp; score
            </PillButton>
          </aside>
          <section className="app-workspace__canvas">
            <Whiteboard ref={whiteboardRef} />
          </section>
        </main>
      )}

      {phase === 'review' && prompt && review && (
        <RubricPanel
          prompt={prompt}
          elapsedSec={review.elapsedSec}
          snapshot={review.snapshot}
          onSave={saveSession}
          onDiscard={exitToSetup}
        />
      )}

      {phase === 'history' && (
        <HistoryView sessions={sessions} onNewSession={goSetup} onClear={clearHistory} />
      )}
    </div>
  )
}

export default App
