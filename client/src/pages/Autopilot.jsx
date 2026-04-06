import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import AppNav from '../components/shared/AppNav'

const WORKFLOWS = [
  { id: 'trend-fetch', name: 'Trend fetcher', description: 'Pulls top Reddit posts every hour and caches them.', schedule: 'Every hour', status: 'active' },
  { id: 'auto-generate', name: 'LLM Synthesis', description: 'Takes top trend of the day, generates variants based on trajectory.', schedule: 'Continuous', status: 'active' },
  { id: 'auto-post', name: 'Queue Manager', description: 'Posts approved content to connected accounts on schedule.', schedule: 'On approval', status: 'active' }
]

const TERMINAL_LOGS = [
  "> INITIALIZING ContentGen LLM ENGINE_v3.3...",
  "> CONNECTING to data streams (Reddit/Twitter API)... [OK]",
  "> SCANNING r/technology for high-velocity trends...",
  "> TREND IDENTIFIED: 'OpenAI architectural shifts'",
  "> ALLOCATING compute to generating 3 hooks...",
  "> ⚙️ SYNTHESIZING: \"The hidden layers of Sam Altman's new stack...\"",
  "> PUSHING to approval queue... [SUCCESS]",
  "> WAITING for next scheduled cron job..."
]

export default function Autopilot() {
  const [history, setHistory] = useState([])
  const [trajectory, setTrajectory] = useState({ days: '7', focus: 'Viral Hooks', platform: 'twitter' })
  const [logs, setLogs] = useState([TERMINAL_LOGS[0]])
  const [accounts, setAccounts] = useState({ twitter: null, linkedin: null })
  const [isExecuting, setIsExecuting] = useState(false)
  const [nicheData, setNicheData] = useState(null)

  const fetchHistory = () => {
    fetch('/api/publish/history')
      .then(r => r.json())
      .then(d => setHistory(d.posts || []))
  }

  useEffect(() => {
    fetchHistory()
    fetch('/api/auth/status').then(r => r.json()).then(setAccounts)
    fetch('/api/niches').then(r => r.json()).then(setNicheData)
  }, [])

  // Simulate initial Agent terminal typing
  useEffect(() => {
    let i = 1;
    const interval = setInterval(() => {
      if (i < TERMINAL_LOGS.length) {
        setLogs(prev => [...prev, TERMINAL_LOGS[i]])
        i++;
      } else {
        clearInterval(interval)
      }
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const handleExecuteAgent = async () => {
    if (isExecuting) return
    setIsExecuting(true)
    
    setLogs([
      `> INITIATING BATCH GENERATION FOR @${accounts.twitter?.username || 'user'}`,
      "> COMPILING 3 POSTS BASED ON TARGET: " + trajectory.focus.toUpperCase()
    ])

    const mockContent = [
      `Just pushed the new architectural shift! If you aren't optimizing your React 19 concurrent renders, you're missing out. #tech #webdev`,
      `Hot take: Micro-frontends add way more complexity than they actually solve for 90% of teams. Fight me. 🥊`,
      `Here's my complete 7-step playbook for caching data intelligently in NextJS. Thread 🧵👇`
    ]

    for (let c = 0; c < mockContent.length; c++) {
      await new Promise(r => setTimeout(r, 1500))
      setLogs(prev => [...prev, `> SYNTHESIZED POST ${c + 1}...`])
      await new Promise(r => setTimeout(r, 1000))
      
      try {
        await fetch('/api/publish', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ platform: trajectory.platform, content: mockContent[c], formatId: 'tweet', toneId: 'bold' })
        })
        setLogs(prev => [...prev, `> POST ${c + 1} DIRECTED TO ${trajectory.platform.toUpperCase()} QUEUE... [SUCCESS]`])
      } catch (e) {
        setLogs(prev => [...prev, `> POST ${c + 1} FAILED: ${e.message}`])
      }
      fetchHistory()
    }

    setLogs(prev => [...prev, "> BATCH EXECUTION COMPLETE. BACK TO STANDBY."])
    setIsExecuting(false)
  }

  return (
    <div className="min-h-screen" style={{ background: 'var(--bg)' }}>
      <AppNav />

      <main className="max-w-5xl mx-auto px-6 pt-28 pb-20 grid grid-cols-1 lg:grid-cols-12 gap-12">
        
        {/* LEFT COLUMN: Main Configurations */}
        <div className="lg:col-span-7">
          <motion.div className="mb-10" initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-xs uppercase tracking-[0.2em] mb-3" style={{ color: 'var(--accent)' }}>
              Automation Command
            </p>
            <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', color: 'var(--text)', fontWeight: 300 }}>
              Agentic Autopilot
            </h1>
            <p className="mt-3 text-sm" style={{ color: 'var(--text-muted)' }}>
              Set your target trajectory. ContentGen will continuously analyze live trends and scaffold your future queue automatically.
            </p>
          </motion.div>

          {/* Configuration Form */}
          <motion.div className="glass p-6 mb-10" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.1 }}>
            <h2 className="text-sm font-medium mb-5 tracking-[0.1em] uppercase" style={{ color: 'var(--text)' }}>Content Trajectory</h2>
            <div className="grid grid-cols-2 gap-4">
              <div className="flex flex-col gap-2">
                <label className="text-xs" style={{ color: 'var(--text-muted)' }}>Target Schedule</label>
                <select 
                  className="bg-transparent border rounded-lg p-2 text-sm outline-none"
                  style={{ borderColor: 'var(--glass-border)', color: 'var(--text)' }}
                  value={trajectory.days} onChange={e => setTrajectory({...trajectory, days: e.target.value})}
                >
                  <option value="3" style={{ background: 'var(--bg-1)' }}>Next 3 Days</option>
                  <option value="7" style={{ background: 'var(--bg-1)' }}>Next 7 Days</option>
                  <option value="14" style={{ background: 'var(--bg-1)' }}>Next 14 Days</option>
                </select>
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-xs" style={{ color: 'var(--text-muted)' }}>Target Platform</label>
                <select 
                  className="bg-transparent border rounded-lg p-2 text-sm outline-none"
                  style={{ borderColor: 'var(--glass-border)', color: 'var(--text)' }}
                  value={trajectory.platform} onChange={e => setTrajectory({...trajectory, platform: e.target.value})}
                >
                  <option value="reddit" style={{ background: 'var(--bg-1)' }}>Reddit (r/all)</option>
                  <option value="twitter" style={{ background: 'var(--bg-1)' }}>Twitter / X</option>
                </select>
              </div>
              <div className="flex flex-col gap-2 col-span-2">
                <label className="text-xs" style={{ color: 'var(--text-muted)' }}>Primary Focus</label>
                <div className="flex gap-2">
                  {['Viral Hooks', 'Deep Dives', 'Shitposts'].map(focus => (
                    <button 
                      key={focus}
                      className={`flex-1 py-2 text-xs rounded-lg transition-colors border ${trajectory.focus === focus ? 'border-accent text-accent bg-accent/10' : 'border-transparent text-text-muted bg-surface'}`}
                      onClick={() => setTrajectory({...trajectory, focus})}
                    >
                      {focus}
                    </button>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="mt-6 pt-6 border-t" style={{ borderColor: 'var(--glass-border)' }}>
              <motion.button
                onClick={handleExecuteAgent}
                disabled={isExecuting}
                className="w-full py-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-2 border shadow-[0_0_15px_rgba(34,197,94,0.1)] relative group overflow-hidden"
                style={{ 
                  background: 'linear-gradient(90deg, #1A1A1A 0%, #0D1B11 100%)', 
                  borderColor: 'var(--green)', 
                  color: 'var(--green)',
                  opacity: isExecuting ? 0.5 : 1
                }}
                whileHover={{ scale: 1.01 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="absolute inset-0 bg-green-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                <motion.div className="w-1.5 h-1.5 rounded-full bg-green-500" animate={isExecuting ? { scale: [1,1.5,1], opacity: [1,0.5,1] } : {}} transition={{ repeat: Infinity, duration: 1.5 }} />
                {isExecuting 
                  ? 'Compiling batch operation...' 
                  : `Launch Agentic Workflow for @${accounts.twitter?.username || 'Twitter'}`
                }
              </motion.button>
            </div>
          </motion.div>

          {/* Workflows */}
          <p className="text-xs uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--text-muted)' }}>
            Active n8n Micro-Agents
          </p>
          <motion.div 
            className="flex flex-col gap-3 mb-12"
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0 },
              visible: { opacity: 1, transition: { staggerChildren: 0.1 } }
            }}
          >
            {WORKFLOWS.map((w, i) => (
              <motion.div
                key={w.id}
                className="glass p-5 flex items-center justify-between gap-4"
                variants={{
                  hidden: { opacity: 0, x: -20 },
                  visible: { opacity: 1, x: 0, transition: { type: 'spring', stiffness: 300, damping: 24 } }
                }}
              >
                <div className="flex items-center gap-4">
                  <motion.div
                    className="w-2 h-2 rounded-full flex-shrink-0"
                    style={{ background: w.status === 'active' ? 'var(--green)' : 'var(--text-dim)' }}
                    animate={w.status === 'active' ? { opacity: [1, 0.4, 1], scale: [1, 1.2, 1] } : {}}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                  <div>
                    <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>{w.name}</p>
                    <p className="text-xs mt-0.5" style={{ color: 'var(--text-muted)' }}>{w.description}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Niche Tracking */}
          <p className="text-xs uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--text-muted)' }}>
            Personalized Niche Insights
          </p>
          <motion.div 
            className="mb-12 glass p-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            {!nicheData ? (
              <p className="text-xs text-text-muted">Scanning timeline...</p>
            ) : !nicheData.hasTwitter ? (
              <p className="text-xs text-amber-500">Connect a Twitter account to sync personalized niches.</p>
            ) : (
              <div>
                <div className="flex gap-2 flex-wrap mb-6">
                  {nicheData.niches.map((n, i) => (
                    <span key={n} className="px-3 py-1 rounded-full text-xs font-medium" style={{ background: 'var(--accent)', color: '#000' }}>
                      {n}
                    </span>
                  ))}
                </div>
                <p className="text-[10px] uppercase font-mono tracking-widest text-text-muted mb-3 border-b pb-2" style={{ borderColor: 'var(--glass-border)' }}>Recent Updates in Niches</p>
                <div className="flex flex-col gap-4">
                  {nicheData.updates.map(u => (
                    <div key={u.id} className="text-xs border-l-2 pl-3" style={{ borderColor: 'var(--green)' }}>
                      <p className="text-text font-medium">{u.headline}</p>
                      <p className="text-[10px] text-text-muted mt-1 uppercase tracking-wider">{u.niche} • {u.engagement} Engagement</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>

        {/* RIGHT COLUMN: terminal and History */}
        <div className="lg:col-span-5 flex flex-col gap-8">
          
          {/* Agent Live Console */}
          <motion.div 
            className="rounded-xl border overflow-hidden flex flex-col"
            style={{ background: '#000', borderColor: 'var(--glass-border)', height: '280px' }}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
          >
            <div className="px-4 py-2 flex items-center gap-2 border-b" style={{ borderColor: 'var(--glass-border)', background: 'var(--bg-1)' }}>
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--red)' }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: '#EAB308' }} />
              <div className="w-2.5 h-2.5 rounded-full" style={{ background: 'var(--green)' }} />
              <span className="ml-2 text-[10px] font-mono tracking-widest uppercase text-text-muted">LLM ENGINE_ACTIVITY</span>
            </div>
            <div className="p-4 flex-1 overflow-y-auto font-mono text-[11px] flex flex-col gap-2">
              {logs.map((log, i) => (
                <motion.div 
                  key={i} 
                  initial={{ opacity: 0, x: -10 }} 
                  animate={{ opacity: 1, x: 0 }}
                  style={{ color: log.includes('[OK]') || log.includes('[SUCCESS]') ? 'var(--green)' : 'var(--accent)' }}
                >
                  {log}
                </motion.div>
              ))}
              <motion.div animate={{ opacity: [1,0,1] }} transition={{ duration: 0.8, repeat: Infinity }} className="w-2 h-3 bg-accent" />
            </div>
          </motion.div>

          <div>
            <p className="text-xs uppercase tracking-[0.15em] mb-4" style={{ color: 'var(--text-muted)' }}>
              Recent Telemetry
            </p>
            {history.length === 0 ? (
              <div className="glass p-6 text-center text-xs text-text-muted">
                Standing by. Awaiting execution context.
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {history.map((post, i) => (
                  <div key={post.id} className="glass p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-surface text-accent">
                        {post.platform}
                      </span>
                    </div>
                    <p className="text-xs line-clamp-2 text-text-muted">
                      {post.content}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </main>
    </div>
  )
}
