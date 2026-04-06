import { useState, useRef } from 'react'
import { motion } from 'framer-motion'

export default function PromptInput({ value, onChange }) {
  const [focused, setFocused] = useState(false)

  return (
    <div>
      <p className="text-xs text-text-muted uppercase tracking-widest mb-3">Your brief</p>
      <motion.div
        animate={{
          borderColor: focused ? 'rgba(232,213,183,0.4)' : 'rgba(255,255,255,0.08)'
        }}
        transition={{ duration: 0.2 }}
        className="rounded-xl border bg-surface"
      >
        <textarea
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Describe what you want to write about. The more specific, the better the output. e.g. 'We just launched a new D2C skincare brand targeting Gen Z women in India. Announce the launch.'"
          rows={5}
          maxLength={1000}
          className="w-full bg-transparent p-4 text-sm text-text placeholder-text-dim resize-none focus:outline-none font-sans leading-relaxed"
        />
        <div className="px-4 pb-3 flex justify-between items-center">
          <span className="text-xs text-text-dim">Be specific. Vague briefs = generic output.</span>
          <motion.span
            animate={{ opacity: value.length > 0 ? 1 : 0 }}
            className="text-xs text-text-muted font-mono"
          >
            {value.length}/1000
          </motion.span>
        </div>
      </motion.div>
    </div>
  )
}
