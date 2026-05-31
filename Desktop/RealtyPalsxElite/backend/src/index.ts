import 'dotenv/config'
import express from 'express'
import cors from 'cors'
import { prisma } from './lib/db'

import chatRouter from './routes/chat'
import chatSessionRouter from './routes/chatSession'
import chatIntentRouter from './routes/chatIntent'
import projectsRouter from './routes/projects'
import sectorsRouter from './routes/sectors'

const app = express()
const PORT = process.env.PORT ?? 4000

app.use(cors({
  origin: process.env.FRONTEND_URL ?? 'http://localhost:3000',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'X-User-Id'],
}))

app.use(express.json())

// Routes — order matters: specific paths before generic /chat
app.use('/api/v1/chat/session', chatSessionRouter)
app.use('/api/v1/chat/intent', chatIntentRouter)
app.use('/api/v1/chat', chatRouter)
app.use('/api/v1/projects', projectsRouter)
app.use('/api/v1/sectors', sectorsRouter)

app.get('/health', async (_, res) => {
  try {
    await prisma.$queryRaw`SELECT 1`
    res.json({ status: 'ok', db: 'connected', ts: new Date().toISOString() })
  } catch {
    res.status(503).json({ status: 'degraded', db: 'unreachable', ts: new Date().toISOString() })
  }
})

app.listen(PORT, async () => {
  console.log(`\n  RealtyPals API  →  http://localhost:${PORT}`)
  console.log(`  Health check    →  http://localhost:${PORT}/health`)

  // DB connectivity check on startup
  try {
    await prisma.$queryRaw`SELECT 1`
    console.log('  Database        →  ✓ connected\n')
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : String(e)
    console.error(`  Database        →  ✗ UNREACHABLE\n`)
    console.error('  ⚠️  Go to https://supabase.com/dashboard and RESUME your project\n')
    console.error(`  Detail: ${msg.split('\n')[0]}\n`)
  }
})
