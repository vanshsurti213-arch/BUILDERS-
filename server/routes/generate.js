import Groq from 'groq-sdk'
import { buildSystemPrompt, buildUserPrompt } from '../lib/promptBuilder.js'

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export const generateRoute = async (req, res) => {
  const { brief, formatId, toneId } = req.body

  // Validate inputs
  if (!brief || !formatId || !toneId) {
    return res.status(400).json({ error: 'brief, formatId, and toneId are required' })
  }
  if (brief.trim().length < 5) {
    return res.status(400).json({ error: 'Brief is too short. Give us something to work with.' })
  }
  if (brief.length > 1000) {
    return res.status(400).json({ error: 'Brief exceeds 1000 characters.' })
  }

  // Set SSE headers
  res.setHeader('Content-Type', 'text/event-stream')
  res.setHeader('Cache-Control', 'no-cache')
  res.setHeader('Connection', 'keep-alive')
  res.flushHeaders()

  try {
    const systemPrompt = buildSystemPrompt(formatId)
    const userPrompt = buildUserPrompt(brief, toneId)

    const stream = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt }
      ],
      stream: true,
      max_tokens: 1000
    })

    for await (const chunk of stream) {
      const text = chunk.choices[0]?.delta?.content || ''
      if (text) {
        res.write(`data: ${JSON.stringify({ text })}\n\n`)
      }
    }

    res.write('data: [DONE]\n\n')
    res.end()

  } catch (err) {
    console.error('Generate error:', err)
    res.write(`data: ${JSON.stringify({ error: err.message })}\n\n`)
    res.end()
  }
}
