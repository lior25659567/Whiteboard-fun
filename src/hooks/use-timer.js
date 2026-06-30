import { useCallback, useEffect, useRef, useState } from 'react'

// Countdown timer with start / pause / resume / reset.
// durationSec sets the starting time; remaining counts down to 0 (no hard stop).
export const useTimer = (durationSec) => {
  const [remaining, setRemaining] = useState(durationSec)
  const [running, setRunning] = useState(false)
  const intervalRef = useRef(null)

  // Reset whenever the configured duration changes (e.g. new session).
  useEffect(() => {
    setRemaining(durationSec)
    setRunning(false)
  }, [durationSec])

  useEffect(() => {
    if (!running) return
    intervalRef.current = setInterval(() => {
      setRemaining((r) => r - 1)
    }, 1000)
    return () => clearInterval(intervalRef.current)
  }, [running])

  const start = useCallback(() => setRunning(true), [])
  const pause = useCallback(() => setRunning(false), [])
  const toggle = useCallback(() => setRunning((r) => !r), [])
  const reset = useCallback(() => {
    setRunning(false)
    setRemaining(durationSec)
  }, [durationSec])

  const overtime = remaining < 0
  const elapsedSec = durationSec - remaining

  return { remaining, running, overtime, elapsedSec, start, pause, toggle, reset }
}

export const formatClock = (totalSec) => {
  const sign = totalSec < 0 ? '-' : ''
  const s = Math.abs(totalSec)
  const m = Math.floor(s / 60)
  const sec = s % 60
  return `${sign}${m}:${String(sec).padStart(2, '0')}`
}
