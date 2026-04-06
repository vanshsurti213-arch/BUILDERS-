import { Router } from 'express'
import db from '../db/db.js'

export const nichesRouter = Router()

nichesRouter.get('/', async (req, res) => {
  const sessionId = req.sessionID

  // Check if they have a real twitter account connected
  const twitterAccount = db.prepare(`
    SELECT * FROM connected_accounts
    WHERE session_id = ? AND platform = 'twitter'
  `).get(sessionId)

  if (!twitterAccount) {
    return res.json({
      hasTwitter: false,
      niches: [],
      updates: []
    })
  }

  // Simulate scanning of timeline and LLM deduction of niches based on the fact
  // that a key is present (We do this to avoid burning heavy rate limits for hackathon).
  
  const detectedNiches = ["Web3 & Crypto", "Indie Hacking", "AI Engineering"]
  
  const mockUpdates = [
    {
      id: 1,
      niche: "AI Engineering",
      headline: "OpenAI announces new reasoning models shaping agentic frameworks.",
      engagement: "High"
    },
    {
      id: 2,
      niche: "Indie Hacking",
      headline: "Micro-SaaS founders are moving away from subscription models to lifetime deals.",
      engagement: "Medium"
    },
    {
      id: 3,
      niche: "Web3 & Crypto",
      headline: "Solana DeFi TVL hits new high, sparking infrastructure discussions.",
      engagement: "High"
    }
  ]

  // Add an intentional slight delay to simulate the "Agentic scanning process"
  await new Promise(r => setTimeout(r, 1200))

  res.json({
    hasTwitter: true,
    niches: detectedNiches,
    updates: mockUpdates
  })
})
