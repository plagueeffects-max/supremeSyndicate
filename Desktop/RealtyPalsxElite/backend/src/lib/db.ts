import { PrismaClient } from '@prisma/client'

export const prisma = new PrismaClient({
  log: process.env.NODE_ENV === 'development' ? ['error'] : [],
  datasources: {
    db: {
      // Add connect_timeout so failed connections fail in 10s not 30s
      url: (process.env.DATABASE_URL ?? '') + (process.env.DATABASE_URL?.includes('?') ? '&' : '?') + 'connect_timeout=10',
    },
  },
})
