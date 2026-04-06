import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useSearchParams, Link } from 'react-router-dom'
import AppNav from '../components/shared/AppNav'

const PLATFORMS = [
  {
    id: 'twitter',
    name: 'Twitter / X',
    icon: '𝕏',
    description: 'Post tweets and threads directly from ContentGen.',
    color: '#E8D5B7',
  },
  {
    id: 'linkedin',
    name: 'LinkedIn',
    icon: 'in',
    description: 'Publish LinkedIn posts with one click.',
    color: '#0A66C2',
  }
]

export default function Accounts() {
  const [status, setStatus] = useState({ twitter: null, linkedin: null })
  const [twitterKey, setTwitterKey] = useState('')
  const [showTwitterInput, setShowTwitterInput] = useState(false)
  const [searchParams] = useSearchParams()

  useEffect(() => {
    fetch('/api/auth/status')
      .then(r => r.json())
      .then(setStatus)
  }, [])

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <AppNav />

      <main className="max-w-3xl mx-auto px-6 pt-28 pb-20">
        {/* Header */}
        <motion.div
          className="mb-12"
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <p className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--accent)' }}>
            Connected accounts
          </p>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--text)', fontWeight: 300 }}>
            Your posting channels
          </h1>
          <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
            Connect your accounts once. ContentGen can then post directly,
            or you can approve everything first — your choice.
          </p>
        </motion.div>

        {/* Success / error banner */}
        {searchParams.get('connected') && (
          <motion.div
            className="mb-6 p-4 rounded-xl text-sm"
            style={{ background: 'rgba(34,197,94,0.1)', border: '1px solid rgba(34,197,94,0.2)', color: 'var(--green)' }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            ✓ {searchParams.get('connected')} connected successfully
          </motion.div>
        )}

        {/* Platform cards */}
        <motion.div 
          className="flex flex-col gap-4"
          initial="hidden"
          animate="visible"
          variants={{
            hidden: { opacity: 0 },
            visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
          }}
        >
          {PLATFORMS.map((p, i) => {
            const connected = status[p.id]
            return (
              <motion.div
                key={p.id}
                className="glass p-6 flex items-center justify-between gap-6"
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 1, y: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
                }}
                whileHover={{ scale: 1.015, y: -2, transition: { duration: 0.2 } }}
                style={{ cursor: 'default' }}
              >
                <div className="flex items-center gap-4">
                  <div
                    className="w-12 h-12 rounded-xl flex items-center justify-center text-sm font-bold shadow-lg"
                    style={{ background: `${p.color}18`, color: p.color, border: `1px solid ${p.color}30` }}
                  >
                    {p.icon}
                  </div>
                  <div>
                    <p className="font-medium text-sm" style={{ color: 'var(--text)' }}>{p.name}</p>
                    {connected ? (
                      <p className="text-xs mt-0.5" style={{ color: 'var(--green)' }}>
                        @{connected.username} · Connected
                      </p>
                    ) : (
                      <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{p.description}</p>
                    )}
                  </div>
                </div>

                <div>
                  {connected ? (
                    <button
                      onClick={() => {
                        fetch(`/api/auth/${p.id}`, { method: 'DELETE' })
                          .then(() => setStatus(s => ({ ...s, [p.id]: null })))
                      }}
                      className="px-4 py-2 rounded-lg text-xs"
                      style={{ color: 'var(--red)', border: '1px solid rgba(239,68,68,0.2)', background: 'rgba(239,68,68,0.05)' }}
                    >
                      Disconnect
                    </button>
                  ) : p.id === 'twitter' ? (
                    showTwitterInput ? (
                      <div className="flex items-center gap-2">
                        <input 
                          type="password"
                          value={twitterKey}
                          onChange={e => setTwitterKey(e.target.value)}
                          placeholder="Bearer Token"
                          className="px-3 py-1.5 rounded-lg text-xs outline-none bg-transparent border"
                          style={{ borderColor: 'var(--glass-border)', color: 'var(--text)' }}
                        />
                        <button
                          onClick={() => {
                            if (!twitterKey) return setShowTwitterInput(false)
                            fetch('/api/auth/twitter/key', {
                              method: 'POST',
                              headers: { 'Content-Type': 'application/json' },
                              body: JSON.stringify({ apiKey: twitterKey })
                            }).then(() => window.location.href = '/app/accounts?connected=twitter')
                          }}
                          className="px-3 py-1.5 rounded-lg text-xs font-medium bg-green-500/10 text-green-500 border border-green-500/20"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <motion.button
                        onClick={() => setShowTwitterInput(true)}
                        className="px-5 py-2 rounded-lg text-xs font-medium"
                        style={{ background: 'var(--accent)', color: '#050505' }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Add API Key →
                      </motion.button>
                    )
                  ) : (
                    <a href={`/api/auth/${p.id}`}>
                      <motion.button
                        className="px-5 py-2 rounded-lg text-xs font-medium"
                        style={{ background: 'var(--accent)', color: '#050505' }}
                        whileHover={{ scale: 1.03 }}
                        whileTap={{ scale: 0.97 }}
                      >
                        Connect →
                      </motion.button>
                    </a>
                  )}
                </div>
              </motion.div>
            )
          })}
        </motion.div>

        {/* Back to app */}
        <div className="mt-10">
          <Link to="/app" className="text-sm" style={{ color: 'var(--text-muted)' }}>
            ← Back to generator
          </Link>
        </div>
      </main>
    </div>
  )
}
