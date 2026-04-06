import { motion, AnimatePresence } from 'framer-motion'
import { TEMPLATES } from '../data/templates'

export default function TemplateBar({ formatId, onSelect }) {
  const templates = TEMPLATES[formatId] || []

  return (
    <div>
      <p className="text-xs text-text-muted uppercase tracking-widest mb-3">Quick start</p>
      <AnimatePresence mode="wait">
        <motion.div
          key={formatId}
          initial={{ opacity: 0, x: 10 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -10 }}
          transition={{ duration: 0.2 }}
          className="flex gap-2 flex-wrap"
        >
          {templates.map((tpl) => (
            <button
              key={tpl.id}
              onClick={() => onSelect(tpl.brief)}
              className="px-3 py-1.5 rounded-md text-xs border border-border text-text-muted hover:border-border-2 hover:text-text bg-surface hover:bg-s2 transition-all"
            >
              {tpl.label}
            </button>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  )
}
