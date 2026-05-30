# RealtyPals — Local Development Guide

## Architecture

```
RealtyPalsxElite/
├── backend/         ← Express API server  (port 4000)
│   ├── src/
│   │   ├── index.ts              # entry point
│   │   ├── routes/               # chat, projects, sectors
│   │   ├── lib/ai/               # Groq client + intent manager + prompts
│   │   ├── lib/db.ts             # Prisma client
│   │   └── repositories/         # project DB queries
│   ├── prisma/schema.prisma      # DB schema
│   ├── package.json
│   └── .env                      # secrets — NOT committed
│
├── app/             ← Next.js pages (port 3000)
├── components/      ← React components
├── lib/             ← frontend-only helpers (env, format)
├── types/           ← shared TypeScript types
├── prisma/          ← root schema + seed data
└── .env             ← NEXT_PUBLIC_* vars for the frontend
```

**Flow:** Browser → Next.js (port 3000) → Express API (port 4000) → Supabase DB + Groq AI

---

## Prerequisites

- Node.js 18+
- npm 9+

---

## First-Time Setup

### 1. Clone and install root dependencies (frontend)

```bash
git clone <repo-url>
cd RealtyPalsxElite
npm install
```

### 2. Install backend dependencies

```bash
cd backend
npm install
```

### 3. Generate the Prisma client for the backend

```bash
# Still inside backend/
npx prisma generate
```

You should see `✔ Generated Prisma Client` output.

### 4. Verify environment files

**Root `.env`** (frontend config — already in repo):
```
NEXT_PUBLIC_API_URL="http://localhost:4000/api/v1"
NEXT_PUBLIC_APP_URL="http://localhost:3000"
```

**`backend/.env`** (backend secrets — create this file if it doesn't exist):
```
DATABASE_URL="<your-supabase-connection-string>"
DIRECT_URL="<your-supabase-direct-url>"
GROQ_API_KEY="<your-groq-api-key>"
PORT=4000
FRONTEND_URL=http://localhost:3000
NODE_ENV=development
```

> The `backend/.env` is gitignored. Ask a team member for the values or check your Supabase and Groq dashboards.

---

## Running Locally

You need **two terminals** — one for the backend, one for the frontend.

### Terminal 1 — Backend (Express API)

```bash
cd backend
npm run dev
```

Expected output:
```
  RealtyPals API  →  http://localhost:4000
  Health check    →  http://localhost:4000/health
```

Verify it's alive:
```bash
curl http://localhost:4000/health
# → {"status":"ok","ts":"..."}
```

### Terminal 2 — Frontend (Next.js)

```bash
# from repo root
npm run dev
```

Expected output:
```
  ▲ Next.js 14.2.5
  - Local: http://localhost:3000
```

Open **http://localhost:3000** in your browser.

---

## Testing the Chat Flow

### Step-by-step manual test

**1. Login**
- Go to `http://localhost:3000`
- Enter any 10-digit phone number → click **Start Discovery**
- You're redirected to `/discover`

**2. Discovery phase — verify AI asks progressive questions**
- Type: `I'm looking for a flat in Noida`
- AI should ask which sector → answer `Sector 150`
- AI should ask BHK → answer `3 BHK`
- AI should ask budget → answer `under 2 crore`

**3. Advisor phase — verify property recommendations appear**
- After enough intent is gathered, AI switches to ADVISOR mode
- Property cards should render in the chat
- `chatPhase: "ADVISOR"` in the network response

**4. Advisor follow-up — verify context carries**
- Ask: `Tell me more about the first property`
- AI should reference the specific property by name (not guess)
- This confirms conversation history is working

**5. History persistence — verify DB is wired**
- Hard-refresh the page (`Ctrl+Shift+R`)
- Chat history should restore from the database
- Network tab: `GET /api/v1/chat/session` should return `messages: [...]`

**6. New chat — verify session reset**
- Click the **+** button (top-left of chat input)
- Chat clears, `DELETE /api/v1/chat/intent` fires, new `session_id` returned

**7. Compare redirect**
- Click **Compare** in sidebar
- Click one of the example comparison queries
- Should land on `/discover` with that query auto-submitted

---

## API Endpoints Reference

All endpoints are served by the Express backend on `http://localhost:4000`.

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/health` | Health check |
| `GET` | `/api/v1/chat/session` | Get or create user's current session + message history |
| `POST` | `/api/v1/chat` | Send a chat message, get AI response |
| `DELETE` | `/api/v1/chat/intent` | Reset intent + create new session |
| `GET` | `/api/v1/projects` | List projects with optional filters |
| `GET` | `/api/v1/sectors` | List available sectors |

### Headers required for user-specific endpoints

```
X-User-Id: <user_id from localStorage>
```

### POST /api/v1/chat — request body

```json
{
  "message": "3BHK in Sector 150 under 2 crore",
  "session_id": "uuid-from-prior-response"
}
```

### POST /api/v1/chat — response shape

```json
{
  "session_id": "uuid",
  "message": "AI response text",
  "chatPhase": "DISCOVERY | ADVISOR",
  "showRecommendations": false,
  "projects": [],
  "resolvedFields": { "sector": true, "bhk": true },
  "intent": { "completenessScore": 71, "bhk": 3, "budget": {...} },
  "next_expected_field": "budget"
}
```

---

## Testing with Postman

A Postman collection is included at `postman/`. Import it directly.

Quick curl test:

```bash
# 1. Get or create session
curl -X GET http://localhost:4000/api/v1/chat/session \
  -H "X-User-Id: test_user_123"

# 2. Send first message (copy session_id from above)
curl -X POST http://localhost:4000/api/v1/chat \
  -H "Content-Type: application/json" \
  -H "X-User-Id: test_user_123" \
  -d '{"message":"3BHK in Sector 150 under 2 crore","session_id":"<session_id>"}'

# 3. Reset
curl -X DELETE http://localhost:4000/api/v1/chat/intent \
  -H "X-User-Id: test_user_123"
```

---

## Database

The app uses **Supabase PostgreSQL** via Prisma. Schema is defined in `backend/prisma/schema.prisma` and `prisma/schema.prisma` (same file, both kept in sync).

```bash
# Push schema changes (run from backend/)
cd backend && npm run db:push

# Re-generate Prisma client after schema changes
cd backend && npm run db:generate

# Seed sample properties
cd backend && npm run db:seed
```

---

## Troubleshooting

| Problem | Fix |
|---------|-----|
| `GROQ_API_KEY is not set` | Check `backend/.env` exists and has the key |
| `NEXT_PUBLIC_API_URL is required` | Check root `.env` has `NEXT_PUBLIC_API_URL="http://localhost:4000/api/v1"` |
| Chat returns empty history on refresh | Backend must be running before frontend — start backend first |
| `CORS` errors in browser console | Confirm backend is on port 4000, frontend on 3000 — no mismatch |
| Prisma `P1001` connection error | Check `DATABASE_URL` in `backend/.env`, verify Supabase is reachable |
| Property cards don't appear | Check DB has seed data: `cd backend && npm run db:seed` |
| Port 4000 already in use | Kill the process: `npx kill-port 4000` |
| Port 3000 already in use | Kill the process: `npx kill-port 3000` |

---

## Project Structure Quick Reference

```
frontend (root)              backend/
─────────────────────        ──────────────────────
app/                         src/
  layout.tsx                   index.ts        ← Express entry
  page.tsx (landing)           routes/
  discover/page.tsx              chat.ts       ← POST /api/v1/chat
  compare/page.tsx               chatSession.ts
  saved/page.tsx                 chatIntent.ts
  market-intelligence/           projects.ts
  lead-snapshot/                 sectors.ts
  value-estimator/             lib/
components/                    db.ts           ← Prisma client
  DiscoveryContent.tsx           ai/
  ProjectCard.tsx                  groq.ts
  Sidebar.tsx                      intentManager.ts
  Header.tsx                       prompts.ts
lib/                           repositories/
  env.ts                         projectRepository.ts
  format.ts                    types/
types/                           project.ts
  project.ts
  property.ts
```
