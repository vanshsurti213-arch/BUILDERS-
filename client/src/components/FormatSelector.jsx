import { motion } from 'framer-motion'
import { CONTENT_TYPES } from '../data/contentTypes'

export default function FormatSelector({ value, onChange }) {
  return (
    <div>
      <p className="text-xs text-text-muted uppercase tracking-widest mb-3">Format</p>
      <div className="flex gap-2 flex-wrap">
        {CONTENT_TYPES.map((ct, i) => (
          <motion.button
            key={ct.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05, duration: 0.3 }}
            onClick={() => onChange(ct.id)}
            className={`relative px-4 py-2 rounded-full text-sm border transition-colors ${
              value === ct.id
                ? 'border-accent text-accent'
                : 'border-border text-text-muted hover:border-border-2 hover:text-text'
            }`}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {value === ct.id && (
              <motion.div
                layoutId="format-indicator"
                className="absolute inset-0 rounded-full bg-accent/10"
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <span className="relative z-10">{ct.label}</span>
          </motion.button>
        ))}
      </div>
    </div>
  )
}
