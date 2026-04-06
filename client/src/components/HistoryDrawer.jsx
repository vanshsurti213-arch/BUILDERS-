import { motion } from 'framer-motion'
import { CONTENT_TYPES } from '../data/contentTypes'
import { TONES } from '../data/tones'

export default function HistoryDrawer({ history, onClose, onRestore }) {
  return (
    <>
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
        className="fixed inset-0 bg-black/60 z-40"
      />

      {/* Panel */}
      <motion.div
        initial={{ x: '100%' }}
        animate={{ x: 0 }}
        exit={{ x: '100%' }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed right-0 top-0 bottom-0 w-80 bg-surface border-l border-border z-50 overflow-y-auto"
      >
        <div className="p-5">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-serif text-lg text-accent italic">History</h2>
            <button onClick={onClose} className="text-text-muted hover:text-text text-lg">×</button>
          </div>

          {history.length === 0 ? (
            <p className="text-sm text-text-muted">No history yet. Generate something.</p>
          ) : (
            <div className="flex flex-col gap-3">
              {history.slice().reverse().map((item, i) => {
                const format = CONTENT_TYPES.find(f => f.id === item.formatId)
                const tone = TONES.find(t => t.id === item.toneId)
                return (
                  <motion.div
                    key={item.timestamp}
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.04 }}
                    className="p-3 rounded-lg border border-border bg-s2 cursor-pointer hover:border-border-2 transition-colors"
                    onClick={() => onRestore(item)}
                  >
                    <div className="flex gap-2 mb-2">
                      <span className="text-xs text-text-muted">{format?.label}</span>
                      <span className="text-xs text-text-dim">·</span>
                      <span className="text-xs text-text-muted">{tone?.label}</span>
                    </div>
                    <p className="text-xs text-text line-clamp-2">{item.brief}</p>
                  </motion.div>
                )
              })}
            </div>
          )}
        </div>
      </motion.div>
    </>
  )
}
