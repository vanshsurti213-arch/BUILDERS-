import { useState, useEffect } from 'react'

const KEY = 'contentgen_history'
const MAX = 10

export function useHistory() {
  const [history, setHistory] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(KEY)) || []
    } catch {
      return []
    }
  })

  useEffect(() => {
    localStorage.setItem(KEY, JSON.stringify(history))
  }, [history])

  const addToHistory = (item) => {
    setHistory(prev => [...prev, item].slice(-MAX))
  }

  const clearHistory = () => setHistory([])

  return { history, addToHistory, clearHistory }
}
