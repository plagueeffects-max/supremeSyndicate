import Groq from 'groq-sdk'

if (!process.env.GROQ_API_KEY) {
  throw new Error('GROQ_API_KEY is not set in environment variables')
}

export const groq = new Groq({ apiKey: process.env.GROQ_API_KEY })

export const GROQ_FAST = 'llama-3.1-8b-instant'
export const GROQ_SMART = 'llama-3.3-70b-versatile'
