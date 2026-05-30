import 'dotenv/config'
import express from 'express'
import cors from 'cors'

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

app.get('/health', (_, res) => res.json({ status: 'ok', ts: new Date().toISOString() }))

app.listen(PORT, () => {
  console.log(`\n  RealtyPals API  →  http://localhost:${PORT}`)
  console.log(`  Health check    →  http://localhost:${PORT}/health\n`)
})
