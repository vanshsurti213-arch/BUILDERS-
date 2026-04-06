import db from '../db/db.js'
import fetch from 'node-fetch'
import { TwitterApi } from 'twitter-api-v2'

function getToken(sessionId, platform) {
  const row = db.prepare(`
    SELECT access_token, platform_user_id FROM connected_accounts
    WHERE session_id = ? AND platform = ?
  `).get(sessionId, platform)
  if (!row) throw new Error(`No ${platform} account connected`)
  return row
}

// Post a tweet
import snoowrap from 'snoowrap'

// Post a Reddit post to user's profile
export async function postReddit(sessionId, text) {
  // ⚡ HACKATHON FALLBACK: If keys are missing, simulate a successful API call
  if (!process.env.REDDIT_CLIENT_ID || !process.env.REDDIT_USERNAME) {
    console.log('[Hackathon Mode] API keys missing. Simulating successful Reddit post...')
    await new Promise(r => setTimeout(r, 1500)) // simulate network delay
    return { id: `demo_${Date.now()}`, url: `https://reddit.com/user/demo` }
  }

  const r = new snoowrap({
    userAgent: 'node:contentgen-autopilot:v1.0 (by /u/' + process.env.REDDIT_USERNAME + ')',
    clientId: process.env.REDDIT_CLIENT_ID,
    clientSecret: process.env.REDDIT_CLIENT_SECRET,
    username: process.env.REDDIT_USERNAME,
    password: process.env.REDDIT_PASSWORD
  });

  try {
    // Submitting a selfpost directly to the user's own profile page (u_username)
    const title = text.split('\n')[0].substring(0, 50) + '...' // First line as title
    const submission = await r.submitSelfpost({
      subreddit: 'u_' + process.env.REDDIT_USERNAME, 
      title: title,
      text: text
    })
    
    return { id: submission.name, url: submission.url }
  } catch (err) {
    console.error('Snoowrap Error:', err);
    throw new Error(err.message || 'Reddit posting failed')
  }
}

// Post a LinkedIn post
export async function postLinkedIn(sessionId, text) {
  const { access_token, platform_user_id } = getToken(sessionId, 'linkedin')

  const res = await fetch('https://api.linkedin.com/v2/ugcPosts', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Content-Type': 'application/json',
      'X-Restli-Protocol-Version': '2.0.0'
    },
    body: JSON.stringify({
      author: `urn:li:person:${platform_user_id}`,
      lifecycleState: 'PUBLISHED',
      specificContent: {
        'com.linkedin.ugc.ShareContent': {
          shareCommentary: { text },
          shareMediaCategory: 'NONE'
        }
      },
      visibility: {
        'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC'
      }
    })
  })

  const data = await res.json()
  if (!res.ok) throw new Error(data.message || 'LinkedIn post failed')
  return data
}
