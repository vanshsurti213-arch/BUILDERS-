import { motion } from 'framer-motion'
import { TONES } from '../data/tones'

const TONE_COLORS = {
  bold:   { bg: '#3C3489', text: '#EEEDFE', glow: '#7F77DD' },
  witty:  { bg: '#3B6D11', text: '#EAF3DE', glow: '#5DCAA5' },
  formal: { bg: '#185FA5', text: '#E6F1FB', glow: '#378ADD' },
  genz:   { bg: '#993556', text: '#FBEAF0', glow: '#D4537E' },
  luxury: { bg: '#444441', text: '#F1EFE8', glow: '#888780' },
}

export default function ToneSelector({ value, onChange }) {
  return (
    <div>
      <p className="text-xs text-text-muted uppercase tracking-widest mb-3">Tone</p>
      <div className="flex gap-2 flex-wrap">
        {TONES.map((tone, i) => {
          const isActive = value === tone.id
          const colors = TONE_COLORS[tone.id]
          return (
            <motion.button
              key={tone.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.06, duration: 0.3 }}
              onClick={() => onChange(tone.id)}
              className="relative px-4 py-2 rounded-lg text-sm border overflow-hidden"
              style={{
                borderColor: isActive ? colors.bg : 'rgba(255,255,255,0.08)',
                color: isActive ? colors.text : '#6B6B6B',
              }}
              whileHover={{ scale: 1.03, borderColor: colors.glow }}
              whileTap={{ scale: 0.97 }}
            >
              {/* Active background */}
              <motion.div
                className="absolute inset-0"
                animate={{ backgroundColor: isActive ? colors.bg : 'transparent' }}
                transition={{ duration: 0.2 }}
              />
              {/* Active glow dot */}
              {isActive && (
                <motion.div
                  className="absolute top-1.5 right-1.5 w-1.5 h-1.5 rounded-full"
                  style={{ backgroundColor: colors.glow }}
                  animate={{ opacity: [1, 0.4, 1] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                />
              )}
              <span className="relative z-10 font-medium">{tone.label}</span>
            </motion.button>
          )
        })}
      </div>
    </div>
  )
}
