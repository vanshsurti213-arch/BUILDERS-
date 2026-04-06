import { Router } from 'express'
import { postReddit, postLinkedIn } from '../lib/socialPublisher.js'
import db from '../db/db.js'

export const publishRouter = Router()

// POST /api/publish
publishRouter.post('/', async (req, res) => {
  const { platform, content, formatId, toneId, trendId } = req.body

  if (!platform || !content) {
    return res.status(400).json({ error: 'platform and content are required' })
  }

  const sessionId = req.sessionID

  try {
    // Real implementation for Reddit
    let result = { id: `mock_${Date.now()}` }
    
    if (platform === 'reddit' || platform === 'twitter') { // Keep twitter mapping to reddit as fallback for now
      try {
        result = await postReddit(sessionId, content)
      } catch (err) {
        console.warn('Reddit post failed:', err.message)
        throw new Error(`Reddit API Error: ${err.message}`)
      }
    } else {
      // Hackathon Demo Bypass for others
      await new Promise(r => setTimeout(r, 1500))
    }

    // Log to scheduled_posts
    db.prepare(`
      INSERT INTO scheduled_posts (session_id, platform, content, format_id, tone_id, trend_id, status, posted_at)
      VALUES (?, ?, ?, ?, ?, ?, 'posted', datetime('now'))
    `).run(sessionId, platform, content, formatId, toneId, trendId || null)

    res.json({ ok: true, result })
  } catch (err) {
    console.error('Publish error:', err)
    res.status(500).json({ error: err.message })
  }
})

// GET /api/publish/history — posted content log
publishRouter.get('/history', (req, res) => {
  const posts = db.prepare(`
    SELECT * FROM scheduled_posts
    WHERE session_id = ?
    ORDER BY created_at DESC LIMIT 50
  `).all(req.sessionID)
  res.json({ posts })
})
