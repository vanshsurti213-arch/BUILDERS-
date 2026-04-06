import { useState, useRef } from 'react'

export function useGenerate() {
  const [output, setOutput]       = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const [error, setError]         = useState(null)
  const abortRef = useRef(null)

  const generate = async ({ brief, formatId, toneId }) => {
    // Abort any in-progress stream
    if (abortRef.current) abortRef.current.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setOutput('')
    setError(null)
    setIsStreaming(true)

    try {
      const res = await fetch('/api/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ brief, formatId, toneId }),
        signal: controller.signal
      })

      if (!res.ok) {
        const err = await res.json()
        throw new Error(err.error || 'Generation failed')
      }

      const reader = res.body.getReader()
      const decoder = new TextDecoder()
      let buffer = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        buffer += decoder.decode(value, { stream: true })
        const lines = buffer.split('\n')
        buffer = lines.pop() || ''

        for (const line of lines) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') continue
          try {
            const parsed = JSON.parse(data)
            if (parsed.error) throw new Error(parsed.error)
            if (parsed.text) setOutput(prev => prev + parsed.text)
          } catch (e) {
            console.error('JSON parsing error:', e.message, 'Raw data:', data)
          }
        }
      }

    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message)
      }
    } finally {
      setIsStreaming(false)
    }
  }

  return { output, isStreaming, error, generate }
}
