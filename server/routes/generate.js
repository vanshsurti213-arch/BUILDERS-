import { Router } from 'express'
import Groq from 'groq-sdk'

export const generateRoute = Router()

generateRoute.post('/', async (req, res) => {
  const { brief, formatId, toneId } = req.body

  if (!brief) {
    return res.status(400).json({ error: 'Brief is required' })
  }

  // Setup Server-Sent Events
  res.writeHead(200, {
    'Content-Type': 'text/event-stream',
    'Cache-Control': 'no-cache',
    'Connection': 'keep-alive'
  })

  try {
    const groq = new Groq({ apiKey: process.env.GROQ_API_KEY || 'dummy_key' })
    const stream = await groq.chat.completions.create({
      model: 'llama-3.3-70b-versatile',
      max_tokens: 1024,
      stream: true,
      messages: [
        { role: 'system', content: `You are an expert social media and content manager. Your goal is to generate HIGH-REACH, VIRAL content that is heavily optimized for algorithm engagement. 
The user will provide a brief. The required format is ${formatId}. The tone should be ${toneId}. 

Follow these strict rules:
1. Start with an irresistible, punchy hook.
2. Use spacing optimally (e.g., single-line sentences for Twitter readability).
3. Provoke a response (ask a question or make a bold claim to drive replies).
4. Do not use cringe hashtags unless absolutely necessary for the niche.
Generate content accordingly.` },
        { role: 'user', content: brief }
      ]
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
    console.error('Groq API Error:', err)
    res.write(`data: ${JSON.stringify({ error: err.message || 'Failed to generate content' })}\n\n`)
    res.end()
  }
})
