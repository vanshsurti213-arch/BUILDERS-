import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { CONTENT_TYPES } from '../data/contentTypes'
import { TONES } from '../data/tones'

export default function OutputPanel({ output, isStreaming, error, formatId, toneId }) {
  const [copied, setCopied] = useState(false)
  const format = CONTENT_TYPES.find(f => f.id === formatId)
  const tone = TONES.find(t => t.id === toneId)
  const charCount = output.length
  const wordCount = output.trim() ? output.trim().split(/\s+/).length : 0
  const overLimit = charCount > (format?.charLimit || Infinity)

  const handleCopy = async () => {
    await navigator.clipboard.writeText(output)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const hasOutput = output.length > 0

  return (
    <div className="h-full flex flex-col">
      <p className="text-xs text-text-muted uppercase tracking-widest mb-3">Output</p>

      <div className="flex-1 relative">
        {/* Empty state */}
        <AnimatePresence>
          {!hasOutput && !error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0, y: -8 }}
              className="absolute inset-0 flex flex-col items-center justify-center"
            >
              <p className="font-serif text-4xl text-text-dim italic">ContentGen</p>
              <p className="text-xs text-text-dim mt-2">your content will appear here</p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Error state */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0 }}
              className="p-4 rounded-xl border border-red/30 bg-red/5 text-red text-sm"
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Output card */}
        <AnimatePresence>
          {hasOutput && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-3"
            >
              {/* Label row */}
              <div className="flex items-center gap-2 text-xs text-text-muted">
                <span>{format?.label}</span>
                <span>·</span>
                <span>{tone?.label} tone</span>
              </div>

              {/* Content box */}
              <div className="rounded-xl border border-border bg-surface p-5 min-h-48">
                <p className="text-sm leading-relaxed whitespace-pre-wrap text-text font-sans">
                  {output}
                  {isStreaming && (
                    <motion.span
                      animate={{ opacity: [1, 0, 1] }}
                      transition={{ duration: 0.8, repeat: Infinity }}
                      className="inline-block w-0.5 h-4 bg-accent ml-0.5 align-middle"
                    />
                  )}
                </p>
              </div>

              {/* Metrics + Actions */}
              <AnimatePresence>
                {!isStreaming && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3 }}
                    className="flex items-center gap-3"
                  >
                    {/* Platform fit badge */}
                    <motion.span
                      initial={{ scale: 0.8 }}
                      animate={{ scale: 1 }}
                      transition={{ type: 'spring', stiffness: 400 }}
                      className={`px-3 py-1 rounded-full text-xs font-medium ${
                        overLimit
                          ? 'bg-red/10 text-red border border-red/20'
                          : 'bg-green/10 text-green border border-green/20'
                      }`}
                    >
                      {overLimit ? `Over limit (${charCount}/${format?.charLimit})` : `${format?.platform} ✓`}
                    </motion.span>

                    <span className="text-xs text-text-muted">{wordCount} words</span>

                    <div className="ml-auto flex gap-2">
                      <button
                        onClick={handleCopy}
                        className="px-3 py-1.5 text-xs border border-border rounded-lg text-text-muted hover:text-text hover:border-border-2 transition-colors"
                      >
                        {copied ? 'Copied ✓' : 'Copy'}
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
