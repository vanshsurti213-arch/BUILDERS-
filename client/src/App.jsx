// React App Entry & State
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import FormatSelector from './components/FormatSelector'
import ToneSelector from './components/ToneSelector'
import TemplateBar from './components/TemplateBar'
import PromptInput from './components/PromptInput'
import GenerateButton from './components/GenerateButton'
import OutputPanel from './components/OutputPanel'
import HistoryDrawer from './components/HistoryDrawer'
import { useGenerate } from './hooks/useGenerate'
import { useHistory } from './hooks/useHistory'

export default function App() {
  const [formatId, setFormatId] = useState('tweet')
  const [toneId, setToneId]     = useState('bold')
  const [brief, setBrief]       = useState('')
  const [historyOpen, setHistoryOpen] = useState(false)

  const { output, isStreaming, error, generate } = useGenerate()
  const { history, addToHistory } = useHistory()

  const handleGenerate = async () => {
    if (!brief.trim() || isStreaming) return
    await generate({ brief, formatId, toneId })
    addToHistory({ brief, formatId, toneId, output, timestamp: Date.now() })
  }

  return (
    <div className="min-h-screen bg-bg text-text font-sans">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 border-b border-border bg-bg/80 backdrop-blur-sm">
        <div className="max-w-7xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-serif text-xl text-accent">ContentGen</span>
          <button
            onClick={() => setHistoryOpen(true)}
            className="text-sm text-text-muted hover:text-text transition-colors"
          >
            History ({history.length})
          </button>
        </div>
      </header>

      {/* Main */}
      <main className="max-w-7xl mx-auto px-6 pt-24 pb-16 grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Left — Inputs */}
        <div className="flex flex-col gap-6">
          <FormatSelector value={formatId} onChange={setFormatId} />
          <ToneSelector value={toneId} onChange={setToneId} />
          <TemplateBar formatId={formatId} onSelect={setBrief} />
          <PromptInput value={brief} onChange={setBrief} />
          <GenerateButton
            onClick={handleGenerate}
            isStreaming={isStreaming}
            disabled={!brief.trim()}
          />
        </div>

        {/* Right — Output */}
        <div className="flex flex-col">
          <OutputPanel
            output={output}
            isStreaming={isStreaming}
            error={error}
            formatId={formatId}
            toneId={toneId}
          />
        </div>
      </main>

      {/* History Drawer */}
      <AnimatePresence>
        {historyOpen && (
          <HistoryDrawer
            history={history}
            onClose={() => setHistoryOpen(false)}
            onRestore={(item) => {
              setBrief(item.brief)
              setFormatId(item.formatId)
              setToneId(item.toneId)
              setHistoryOpen(false)
            }}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
