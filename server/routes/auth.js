import { Router } from 'express'
import crypto from 'crypto'
import db from '../db/db.js'

export const authRouter = Router()

// ─── HACKATHON DEMO MODE OAUTH BYPASS ───────────────────────────────────────
// Mocks the OAuth flow for Twitter and LinkedIn so users don't need real API keys

// Twitter Demo OAuth
authRouter.get('/twitter', (req, res) => {
  db.prepare(`
    INSERT OR REPLACE INTO connected_accounts
    (session_id, platform, platform_user_id, username, access_token, expires_at)
    VALUES (?, 'twitter', 'demo_twitter_123', 'contentgen_demo', 'mock_token_twitter', datetime('now', '+2 hours'))
  `).run(req.sessionID)
  
  res.redirect('/app/accounts?connected=twitter')
})

// Twitter Custom API Key (Bearer Token)
authRouter.post('/twitter/key', (req, res) => {
  const { apiKey } = req.body
  if (!apiKey) return res.status(400).json({ error: 'API Key / Bearer Token is required' })

  // We save the apiKey directly into access_token field
  db.prepare(`
    INSERT OR REPLACE INTO connected_accounts
    (session_id, platform, platform_user_id, username, access_token, expires_at)
    VALUES (?, 'twitter', 'custom_user', 'custom_twitter_user', ?, datetime('now', '+10 years'))
  `).run(req.sessionID, apiKey)
  
  res.json({ ok: true })
})

// LinkedIn Demo OAuth
authRouter.get('/linkedin', (req, res) => {
  db.prepare(`
    INSERT OR REPLACE INTO connected_accounts
    (session_id, platform, platform_user_id, username, access_token, expires_at)
    VALUES (?, 'linkedin', 'demo_linkedin_123', 'ContentGen User', 'mock_token_linkedin', datetime('now', '+60 days'))
  `).run(req.sessionID)
  
  res.redirect('/app/accounts?connected=linkedin')
})

// GET /api/auth/status — which accounts are connected?
authRouter.get('/status', (req, res) => {
  const accounts = db.prepare(`
    SELECT platform, username, connected_at FROM connected_accounts
    WHERE session_id = ?
  `).all(req.sessionID)

  const status = { twitter: null, linkedin: null }
  for (const a of accounts) status[a.platform] = { username: a.username, connectedAt: a.connected_at }

  res.json(status)
})

// DELETE /api/auth/:platform — disconnect
authRouter.delete('/:platform', (req, res) => {
  db.prepare(`
    DELETE FROM connected_accounts WHERE session_id = ? AND platform = ?
  `).run(req.sessionID, req.params.platform)
  res.json({ ok: true })
})
