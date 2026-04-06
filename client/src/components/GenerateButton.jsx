import { motion } from 'framer-motion'

const dots = {
  animate: {
    transition: { staggerChildren: 0.2, repeat: Infinity }
  }
}
const dot = {
  animate: { y: [0, -4, 0], transition: { duration: 0.6, repeat: Infinity, ease: 'easeInOut' } }
}

export default function GenerateButton({ onClick, isStreaming, disabled }) {
  return (
    <motion.button
      onClick={onClick}
      disabled={disabled || isStreaming}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      className={`w-full py-4 rounded-xl font-medium text-sm tracking-wide transition-opacity ${
        disabled
          ? 'bg-surface border border-border text-text-dim cursor-not-allowed'
          : 'bg-accent text-bg hover:opacity-90 cursor-pointer'
      }`}
    >
      {isStreaming ? (
        <motion.div className="flex items-center justify-center gap-1.5" variants={dots} animate="animate">
          <span className="text-bg/70 text-sm">Generating</span>
          {[0,1,2].map(i => (
            <motion.span
              key={i}
              className="w-1 h-1 rounded-full bg-bg/70 inline-block"
              variants={dot}
              transition={{ delay: i * 0.2 }}
            />
          ))}
        </motion.div>
      ) : (
        'Generate →'
      )}
    </motion.button>
  )
}
