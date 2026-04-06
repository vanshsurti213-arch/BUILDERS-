// Define standard application format boundaries
export const CONTENT_TYPES = [
  {
    id: 'tweet',
    label: 'Tweet / X post',
    platform: 'Twitter / X',
    charLimit: 280,
    structureInstructions: 'Single tweet or thread. If thread, number each tweet (1/ 2/ 3/). Each tweet must be standalone-readable. Max 5 tweets in a thread.'
  },
  {
    id: 'caption',
    label: 'Instagram caption',
    platform: 'Instagram',
    charLimit: 2200,
    structureInstructions: 'Hook line (standalone, punchy). Body (2-4 short paragraphs). Optional CTA. If hashtags are appropriate, add 5-8 at the end separated by a blank line.'
  },
  {
    id: 'blog',
    label: 'Blog intro',
    platform: 'Blog / Article',
    charLimit: 500,
    structureInstructions: 'Opening paragraph only — 3 to 5 sentences. Set up the problem. Promise a payoff. Make the reader need to continue. Do not start solving the problem yet.'
  },
  {
    id: 'email',
    label: 'Cold email',
    platform: 'Email outreach',
    charLimit: 300,
    structureInstructions: 'Subject line first (labelled "Subject:"), then body. Body: 2-3 sentences max. One clear ask at the end. Sound like a human, not a tool.'
  },
  {
    id: 'linkedin',
    label: 'LinkedIn post',
    platform: 'LinkedIn',
    charLimit: 1300,
    structureInstructions: 'Hook line (one sentence, stops the scroll). 3-5 short paragraphs with line breaks between them. End with either a question to the reader or a clear CTA. No hashtags unless they feel natural.'
  }
]
