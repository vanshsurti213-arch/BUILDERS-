// Express backend setup
import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { generateRoute } from './routes/generate.js'
import { rateLimiter } from './middleware/rateLimit.js'

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors({ origin: 'http://localhost:5173' }))
app.use(express.json())
app.use('/api/generate', rateLimiter)
app.use('/api/generate', generateRoute)

app.listen(PORT, () => console.log(`ContentGen server running on :${PORT}`))
