# RealtyPals — Local Development Guide

## Repository Layout

```
RealtyPalsxElite/
├── frontend/        ← Next.js UI app  (port 3000)
│   ├── app/              # pages (discover, compare, saved, …)
│   ├── components/       # React components
│   ├── lib/              # frontend helpers (env, format)
│   ├── types/            # TypeScript types
│   ├── public/           # static assets
│   ├── package.json
│   ├── next.config.js
│   ├── tailwind.config.ts
│   └── .env              # NEXT_PUBLIC_* vars (gitignored)
│
├── backend/         ← Express API server  (port 4000)
│   ├── src/
│   │   ├── index.ts              # server entry
│   │   ├── routes/               # chat, session, intent, projects, sectors
│   │   ├── lib/ai/               # Groq client, intentManager, prompts
│   │   ├── lib/db.ts             # Prisma client
│   │   └── repositories/         # DB queries
│   ├── prisma/schema.prisma      # schema copy for Prisma client gen
│   ├── package.json
│   └── .env                      # DB + AI secrets (gitignored)
│
├── prisma/          ← source of truth schema + seed data
│   ├── schema.prisma
│   ├── seed.ts
│   └── data/
│
├── CLAUDE.md        ← AI assistant context (product rules)
├── RUNNING_LOCALLY.md
└── .gitignore
```

**Flow:** Browser → Next.js `frontend/` (port 3000) → Express `backend/` (port 4000) → Supabase DB + Groq AI

---

## Prerequisites

- Node.js 18+
- npm 9+

---

## First-Time Setup

### 1. Install frontend dependencies

```bash
cd frontend
npm install
```

### 2. Install backend dependencies and generate Prisma client

```bash
cd backend
npm install
npx prisma generate
```

Expected: `✔ Generated Prisma Client`

### 3. Verify environment files

**`frontend/.env`** — already in repo (NEXT_PUBLIC only, no secrets):
```
NEXT_PUBLIC_API_URL="http://localhost:4000/api/v1"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**`backend/.env`** — create if missing (gitignored, contains real secrets):
```
DATABASE_URL="<supabase-connection-string>"
DIRECT_URL="<supabase-direct-url>"
GROQ_API_KEY="<groq-api-key>"
PORT=4000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

---

## Running Locally — Two Terminals

### Terminal 1 — Backend

```bash
cd backend
npm run dev
```

Expected:
```
  RealtyPals API  →  http://localhost:4000
  Health check    →  http://localhost:4000/health
```

Verify:
```bash
curl http://localhost:4000/health
# → {"status":"ok","ts":"..."}
```

### Terminal 2 — Frontend

```bash
cd frontend
npm run dev
```

Expected:
```
  ▲ Next.js 14.2.5
  - Local:  http://localhost:3000
```

Open **http://localhost:3000** in browser.

---

## Test the Chat Flow

### Manual smoke test

**1. Login**
- `http://localhost:3000` → enter any 10-digit phone → Start Discovery

**2. Discovery phase**
- Send: `I'm looking for a 3BHK flat in Sector 150 Noida`
- AI should ask for budget (sector + type + BHK already resolved)
- Answer: `under 2 crore`
- AI enters ADVISOR mode → property cards appear

**3. Advisor follow-up (context test)**
- Ask: `Tell me more about the first property`
- AI should reference the property by name — confirms conversation history is wired

**4. History persistence**
- Hard-refresh (`Ctrl+Shift+R`)
- Chat history should restore from DB — `GET /api/v1/chat/session` returns prior messages

**5. New chat**
- Click **+** button → chat clears → `DELETE /api/v1/chat/intent` fires → new session

**6. Compare redirect**
- Sidebar → Compare → click a suggestion → auto-fires in discover chat

---

## API Reference

Base URL: `http://localhost:4000`

| Method | Path | Header | Body | Description |
|--------|------|--------|------|-------------|
| `GET` | `/health` | — | — | Health check |
| `GET` | `/api/v1/chat/session` | `X-User-Id` | — | Get/create session + history |
| `POST` | `/api/v1/chat` | `X-User-Id` | `{message, session_id}` | Chat turn |
| `DELETE` | `/api/v1/chat/intent` | `X-User-Id` | — | Reset intent + new session |
| `GET` | `/api/v1/projects` | — | `?sector&bhk&min_price&max_price` | Project listing |
| `GET` | `/api/v1/sectors` | — | — | Available sectors |

### Chat response shape

```json
{
  "session_id": "uuid",
  "message": "AI text",
  "chatPhase": "DISCOVERY | ADVISOR",
  "showRecommendations": true,
  "projects": [...],
  "resolvedFields": { "sector": true, "bhk": true, "budget": true },
  "intent": { "completenessScore": 71, "bhk": 3, "sector": "Sector 150" },
  "next_expected_field": "budget"
}
```

---

## Quick curl Test

```bash
# 1. Start session
curl -s http://localhost:4000/api/v1/chat/session \
  -H "X-User-Id: test_user_1" | python3 -m json.tool

# 2. Send message (paste session_id from above)
curl -s -X POST http://localhost:4000/api/v1/chat \
  -H "Content-Type: application/json" \
  -H "X-User-Id: test_user_1" \
  -d '{"message":"3BHK in Sector 150 under 2 crore Noida","session_id":"<id>"}' \
  | python3 -m json.tool

# 3. Reset
curl -s -X DELETE http://localhost:4000/api/v1/chat/intent \
  -H "X-User-Id: test_user_1" | python3 -m json.tool
```

---

## Database

Schema source of truth: `prisma/schema.prisma`
Backend copy (for Prisma client generation): `backend/prisma/schema.prisma`

```bash
# Push schema to DB (run from backend/)
cd backend && npm run db:push

# Regenerate Prisma client after schema changes
cd backend && npm run db:generate

# Seed sample property data
cd backend && npm run db:seed
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `GROQ_API_KEY is not set` | Check `backend/.env` exists and has key |
| `NEXT_PUBLIC_API_URL is required` | Check `frontend/.env` has the URL |
| Empty chat history on refresh | Start backend before frontend |
| CORS errors in browser | Backend on 4000, frontend on 3000 — must match |
| Prisma P1001 connection error | Check `DATABASE_URL` in `backend/.env` |
| No property cards after chat | DB needs seed data: `cd backend && npm run db:seed` |
| Port conflict | `npx kill-port 3000` or `npx kill-port 4000` |

---

## Advisory Mode — How It Works

**Discovery phase** (chatPhase: `DISCOVERY`): AI asks progressive questions to build intent:
1. Sector / city (required)
2. Property type (flat/plot)
3. BHK count
4. Budget range

Once the AI has `sector + property_type + BHK + any budget` (completeness score ≥ 50), it automatically switches.

**Advisor phase** (chatPhase: `ADVISOR`): AI searches the DB for matching projects, then writes an honest evaluation with trade-offs. Property cards render in the chat. Follow-up questions work because the last 8 messages of conversation history are always passed to the AI.

You do not need to manually trigger ADVISOR mode — the transition is automatic.
