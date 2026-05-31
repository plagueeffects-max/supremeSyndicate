import { NextRequest, NextResponse } from 'next/server'
import { z } from 'zod'
import { prisma } from '@/lib/db'
import { groq, GROQ_FAST, GROQ_SMART, safeJsonParse } from '@/lib/ai/groq'
import { PROMPTS } from '@/lib/ai/prompts'
import {
  mergeIntentState,
  isIntentComplete,
  getNextQuestion,
  type IntentState,
} from '@/lib/ai/intentManager'
import { searchProjects } from '@/lib/repositories/projectRepository'

const MAX_HISTORY = 12

const BodySchema = z.object({
  message: z.string().min(1).max(2000).trim(),
  session_id: z.string().uuid().optional(),
})

function getUserId(req: NextRequest): string | null {
  return req.headers.get('x-user-id')
}

export async function POST(request: NextRequest) {
  const userId = getUserId(request)
  if (!userId) {
    return NextResponse.json({ error: 'X-User-Id header required' }, { status: 400 })
  }

  let rawBody: unknown
  try {
    rawBody = await request.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const parsed = BodySchema.safeParse(rawBody)
  if (!parsed.success) {
    return NextResponse.json({ error: 'Invalid request', details: parsed.error.flatten() }, { status: 400 })
  }

  const { message, session_id } = parsed.data

  // ── 1. Load or create session ──────────────────────────────────────────
  let session = session_id
    ? await prisma.chatSession.findUnique({
        where: { id: session_id },
        include: { messages: { orderBy: { created_at: 'desc' }, take: MAX_HISTORY } },
      })
    : null

  if (!session) {
    session = await prisma.chatSession.create({
      data: { user_id: userId },
      include: { messages: { orderBy: { created_at: 'desc' }, take: MAX_HISTORY } },
    })
  }

  const sessionId = session.id
  const historyForAI = [...session.messages].reverse().map((m) => ({
    role: m.role as 'user' | 'assistant',
    content: m.content as string,
  }))

  // ── 2. Load or create UserMemory ────────────────────────────────────────
  const userMemory = await prisma.userMemory.upsert({
    where: { user_id: userId },
    create: { user_id: userId },
    update: {},
  })

  const existingIntent: IntentState = userMemory.summary_text
    ? (safeJsonParse(userMemory.summary_text) as unknown as IntentState)
    : { completenessScore: 0 }

  // ── 3. Persist user message ─────────────────────────────────────────────
  await prisma.chatMessage.create({
    data: { session_id: sessionId, role: 'user', content: message },
  })

  // ── 4. Extract intent ───────────────────────────────────────────────────
  let extracted: Record<string, unknown> = {}
  try {
    const intentCompletion = await groq.chat.completions.create({
      model: GROQ_FAST,
      messages: [
        { role: 'system', content: PROMPTS.INTENT_EXTRACTION },
        ...historyForAI,
        { role: 'user', content: message },
      ],
      temperature: 0,
      max_tokens: 300,
      response_format: { type: 'json_object' },
    })
    extracted = safeJsonParse(intentCompletion.choices[0].message.content)
  } catch (err) {
    console.error('[chat] Intent extraction failed:', err)
    extracted = { is_general_query: true }
  }

  // ── 5. Map to IntentState updates ───────────────────────────────────────
  const updates: Partial<IntentState> = {}
  if (extracted.bhk) updates.bhk = extracted.bhk as number
  if (extracted.budget_min || extracted.budget_max) {
    updates.budget = {
      min: extracted.budget_min as number | undefined,
      max: extracted.budget_max as number | undefined,
      flexibility: 'unknown',
    }
  }
  if (extracted.sector) updates.sector = `Sector ${extracted.sector}`
  if (extracted.city) updates.city = extracted.city as string
  if (extracted.purpose) updates.purpose = extracted.purpose as IntentState['purpose']
  if (extracted.property_type) updates.property_type = extracted.property_type as IntentState['property_type']
  if (extracted.possession_status) {
    updates.preferences = {
      ready_to_move: extracted.possession_status === 'ready_to_move',
      under_construction: extracted.possession_status === 'under_construction',
    }
  }

  const newIntent = mergeIntentState(existingIntent, updates)

  // ── 6. Persist intent ───────────────────────────────────────────────────
  await prisma.userMemory.update({
    where: { user_id: userId },
    data: {
      summary_text: JSON.stringify(newIntent),
      bhk_preference: newIntent.bhk ?? null,
      budget_min_cr: newIntent.budget?.min != null ? newIntent.budget.min / 10_000_000 : null,
      budget_max_cr: newIntent.budget?.max != null ? newIntent.budget.max / 10_000_000 : null,
      sector_preference: newIntent.sector ?? null,
      purpose: newIntent.purpose ?? null,
    },
  })

  const intentSummary = {
    completenessScore: newIntent.completenessScore,
    bhk: newIntent.bhk,
    budget: newIntent.budget,
    purpose: newIntent.purpose,
    is_general_query: extracted.is_general_query as boolean | undefined,
  }

  // ── Helper: persist AI message and return response ──────────────────────
  const respond = async (responseMessage: string, extras: Record<string, unknown> = {}) => {
    await Promise.all([
      prisma.chatMessage.create({
        data: {
          session_id: sessionId,
          role: 'assistant',
          content: responseMessage,
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          intent_snapshot: JSON.parse(JSON.stringify(newIntent)) as any,
        },
      }),
      prisma.chatSession.update({
        where: { id: sessionId },
        data: { message_count: { increment: 2 } },
      }),
    ])
    return NextResponse.json({
      session_id: sessionId,
      message: responseMessage,
      resolvedFields: newIntent.resolvedFields,
      intent: intentSummary,
      ...extras,
    })
  }

  // ── 7a. Greeting / chitchat ─────────────────────────────────────────────
  if (extracted.conversational_reply) {
    return respond(extracted.conversational_reply as string, {
      showRecommendations: false,
      chatPhase: 'DISCOVERY',
    })
  }

  // ── 7b. General / informational query ───────────────────────────────────
  if (extracted.is_general_query) {
    let aiMessage = ''
    try {
      const generalCompletion = await groq.chat.completions.create({
        model: GROQ_SMART,
        messages: [
          { role: 'system', content: PROMPTS.GENERAL_QUERY.replace('{{SEARCH_CONTEXT}}', '') },
          ...historyForAI.slice(-8),
          { role: 'user', content: message },
        ],
        temperature: 0.3,
        max_tokens: 1024,
      })
      aiMessage = generalCompletion.choices[0].message.content ?? ''
    } catch (err) {
      console.error('[chat] General query LLM call failed:', err)
      aiMessage = "I couldn't fetch a response right now. Please try again."
    }
    return respond(aiMessage, { showRecommendations: false, chatPhase: 'DISCOVERY' })
  }

  // ── 7c. Intent complete — search + advisor ───────────────────────────────
  if (isIntentComplete(newIntent)) {
    const projects = await searchProjects({
      city: newIntent.city ?? 'Noida',
      sector: newIntent.sector,
      bhk: newIntent.bhk,
      budget_min_cr: newIntent.budget?.min != null ? newIntent.budget.min / 10_000_000 : undefined,
      budget_max_cr: newIntent.budget?.max != null ? newIntent.budget.max / 10_000_000 : undefined,
    })

    const projectContext = projects
      .map(
        (p) =>
          `**${p.name}** by ${p.builder.name}\n` +
          `Price: ${p.price_range_label}\n` +
          `Configs: ${p.unit_types.map((u) => u.name).join(', ')}\n` +
          `RERA: ${p.rera_number ?? 'Not registered'}\n` +
          `Status: ${p.status.replace(/_/g, ' ')}\n` +
          `Sector: ${p.sector}, ${p.city}\n` +
          `Amenities: ${p.top_amenities.map((a) => a.name).join(', ')}\n` +
          `Connectivity: ${p.top_connectivity.map((c) => c.name).join(', ')}`,
      )
      .join('\n\n---\n\n')

    let advisorMessage = ''
    try {
      const advisorCompletion = await groq.chat.completions.create({
        model: GROQ_SMART,
        messages: [
          {
            role: 'system',
            content: PROMPTS.ADVISOR_MODE + '\n\n═══ SHORTLISTED PROPERTIES ═══\n\n' + projectContext,
          },
          ...historyForAI.slice(-8),
          { role: 'user', content: message },
        ],
        temperature: 0.3,
        max_tokens: 1024,
      })
      advisorMessage = advisorCompletion.choices[0].message.content ?? ''
    } catch (err) {
      console.error('[chat] Advisor LLM call failed:', err)
      advisorMessage = `Here are ${projects.length} properties matching your criteria.`
    }

    if (projects.length > 0) {
      const currentViewed = (userMemory.viewed_slugs as string[]) ?? []
      const allViewed = [...new Set([...currentViewed, ...projects.map((p) => p.slug)])]
      await prisma.userMemory.update({
        where: { user_id: userId },
        data: { viewed_slugs: allViewed },
      })
    }

    const SEARCH_PARAM_KEYS = ['bhk', 'budget', 'sector', 'city', 'property_type', 'purpose'] as const
    const hasNewSearchParams = SEARCH_PARAM_KEYS.some((k) => k in updates)
    const isFirstAdvisorTurn = historyForAI.length === 0

    return respond(advisorMessage, {
      showRecommendations: hasNewSearchParams || isFirstAdvisorTurn,
      projects: hasNewSearchParams || isFirstAdvisorTurn ? projects : undefined,
      chatPhase: 'ADVISOR',
    })
  }

  // ── 7d. Discovery — ask next question ───────────────────────────────────
  const nextQ = getNextQuestion(newIntent)

  const resolvedList = Object.entries(newIntent.resolvedFields ?? {})
    .filter(([, v]) => v)
    .map(([k]) => k)
    .join(', ')

  const questionSystemPrompt =
    `${PROMPTS.QUESTION_GENERATION}\n\n` +
    `═══ RESOLVED FIELDS — DO NOT ask about these ═══\n` +
    `${resolvedList || 'none yet'}\n\n` +
    `═══ NEXT QUESTION (rephrase naturally, keep it brief) ═══\n` +
    `"${nextQ.question}"\n\n` +
    `RULE: End your response with exactly this question rephrased. Ask no other question.`

  let questionMessage = nextQ.question
  try {
    const questionCompletion = await groq.chat.completions.create({
      model: GROQ_FAST,
      messages: [
        { role: 'system', content: questionSystemPrompt },
        ...historyForAI.slice(-4),
        { role: 'user', content: message },
      ],
      temperature: 0.3,
      max_tokens: 256,
    })
    questionMessage = questionCompletion.choices[0].message.content ?? nextQ.question
  } catch (err) {
    console.error('[chat] Question generation failed:', err)
    questionMessage = nextQ.question
  }

  return respond(questionMessage, {
    showRecommendations: false,
    chatPhase: 'DISCOVERY',
    next_expected_field: nextQ.field,
  })
}
