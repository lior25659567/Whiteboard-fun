import { useCallback, useEffect, useState } from 'react'

// Persisted state backed by localStorage, with a JSON-safe read/write.
export const useLocalStorage = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw ? JSON.parse(raw) : initialValue
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      // Ignore quota / serialization errors — persistence is best-effort.
    }
  }, [key, value])

  return [value, setValue]
}

const HISTORY_KEY = 'whiteboard-fun:sessions'

// Session-history convenience wrapper around the storage hook.
export const useHistory = () => {
  const [sessions, setSessions] = useLocalStorage(HISTORY_KEY, [])

  const addSession = useCallback(
    (session) => setSessions((prev) => [session, ...prev]),
    [setSessions],
  )
  const clearHistory = useCallback(() => setSessions([]), [setSessions])

  return { sessions, addSession, clearHistory }
}
