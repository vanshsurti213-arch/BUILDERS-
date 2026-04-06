# ContentGen

AI-powered content generation with tone control. Built for the CSquareClub AI & ML Hackathon in 24 hours.

## The problem

Content creation is time-consuming. But the real problem isn't speed — it's that AI-generated content sounds the same. Generic. Toneless. Same voice regardless of brand, platform, or audience.

## The solution

ContentGen lets you pick your **format** (tweet, caption, blog, email, LinkedIn) and your **tone** (Bold, Witty, Formal, Gen-Z, Luxury) before generating. The same brief produces completely different output depending on what you choose. The output actually sounds like something a human decided to write.

## Features

- 5 content formats with platform-specific character limits and structure rules
- 5 distinct tones powered by prompt engineering, not just style words
- Pre-built templates for 20 common content scenarios
- Real-time streaming output (SSE) — watch it write
- Platform fit badge — know instantly if you're over the character limit
- Generation history — last 10 outputs saved locally, one click to restore
- Fully keyboard accessible

## Tech stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React 18 + Vite                   |
| Animation | Framer Motion v11                 |
| Styling   | Tailwind CSS v3                   |
| Backend   | Node.js + Express                 |
| AI        | Anthropic Claude (Sonnet)         |
| Streaming | Server-Sent Events (SSE)          |
| Storage   | localStorage (client-side)        |

## Setup

### Prerequisites
- Node.js 18+
- An Anthropic API key → https://console.anthropic.com

### Install

```bash
git clone <repo-url>
cd contentgen
npm install
cd client && npm install && cd ..
```

### Configure

```bash
cp .env.example .env
# Add your ANTHROPIC_API_KEY to .env
```

### Run

```bash
npm run dev
```

Frontend: http://localhost:5173
Backend: http://localhost:3001

### Build for production

```bash
npm run build
npm start
```

## How it works

1. User selects a **format** — defines the platform, character limit, and structure rules
2. User selects a **tone** — defines the voice, sentence style, and vocabulary register
3. User enters a **brief** — what they want to write about
4. App builds a **system prompt** (format rules) + **user prompt** (tone + brief) and sends to Claude
5. Claude streams the response back via SSE
6. Output appears in real time with a blinking cursor
7. Platform fit badge evaluates character count against the platform limit

## Prompt engineering

The quality difference vs a basic chatbot comes from the prompt structure:

**System prompt:** Platform-specific instructions. Character limit. Structure rules (e.g. for tweets: "each tweet must be standalone-readable"). Negative rules: no preamble, no sign-off, no corporate filler phrases.

**User prompt:** Tone description (each tone has a ~50-word instruction set, not just a label) + the user's brief.

Two separate layers = the model knows the rules before it reads the request.

## API

### POST /api/generate

Request:
```json
{
  "brief": "We just launched a new skincare brand targeting Gen Z in India.",
  "formatId": "caption",
  "toneId": "genz"
}
```

Response: Server-Sent Events stream
```
data: {"text": "ok "}
data: {"text": "but "}
data: {"text": "why "}
...
data: [DONE]
```

### Rate limiting

20 requests per IP per minute. Returns 429 if exceeded.

## Engineering decisions

**Why SSE over WebSockets?** SSE is one-way (server → client), which is all we need. Simpler to implement, no need for a separate WebSocket library, works natively with fetch and ReadableStream.

**Why no database?** This is a 24-hour hackathon MVP. localStorage handles history. The schema is defined in the codebase (contentTypes.js, tones.js) — adding a real DB is a clear next step, not a missing feature.

**Why separate system + user prompts?** Claude (and all frontier models) treat system prompts as rules and user prompts as requests. Mixing format rules into the user prompt degrades reliability. Keeping them separate gives consistent, predictable output.

**Why Framer Motion?** The streaming output, format switching, and tone selection all have meaningful state transitions. Framer Motion's layoutId and AnimatePresence make these transitions feel intentional rather than jarring. It's the difference between a prototype and a product.

## What's next

| Feature                     | Why                                              |
|-----------------------------|--------------------------------------------------|
| Multi-format in one click   | One brief → tweet + caption + email side by side |
| Brand voice lock            | Paste 3 writing examples, extract your voice     |
| Content calendar export     | 7 posts for a theme, export as CSV              |
| Image prompt pairing        | Auto-generate a Midjourney prompt per output    |
| Team workspace              | Shared brand voice, approval workflow            |
