import express from 'express'
import cors from 'cors'
import session from 'express-session'
import SQLiteStore from 'connect-sqlite3'
import dotenv from 'dotenv'
import { generateRoute } from './routes/generate.js'
import { trendsRouter } from './routes/trends.js'
import { authRouter } from './routes/auth.js'
import { publishRouter } from './routes/publish.js'
import { rateLimiter } from './middleware/rateLimit.js'
import { initDb } from './db/schema.js'
import { startTrendSync } from './cron/trendSync.js'

dotenv.config()
initDb()
startTrendSync()

const app = express()
const SQLiteStoreSession = SQLiteStore(session)

app.use(cors({ origin: 'http://localhost:5173', credentials: true }))
app.use(express.json())
app.use(session({
  store:  new SQLiteStoreSession({ db: 'sessions.db' }),
  secret: process.env.SESSION_SECRET || 'contentgen-dev-secret',
  resave: false,
  saveUninitialized: true,
  cookie: { maxAge: 30 * 24 * 60 * 60 * 1000 }  // 30 days
}))

import { nichesRouter } from './routes/niches.js'

app.use('/api/generate', rateLimiter, generateRoute)
app.use('/api/trends',   trendsRouter)
app.use('/api/auth',     authRouter)
app.use('/api/publish',  publishRouter)
app.use('/api/niches',   nichesRouter)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => console.log(`ContentGen V2 running on :${PORT}`))
