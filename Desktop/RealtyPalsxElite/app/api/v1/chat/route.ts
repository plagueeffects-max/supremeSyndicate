import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { groq, GROQ_FAST, GROQ_SMART } from '@/lib/ai/groq'
import { PROMPTS } from '@/lib/ai/prompts'
import {
  mergeIntentState,
  isIntentComplete,
  getNextQuestion,
  type IntentState,
} from '@/lib/ai/intentManager'
import { searchProjects } from '@/server/repositories/projectRepository'

export async function POST(req: NextRequest) {
  const userId = req.headers.get('X-User-Id')
  if (!userId) {
    return NextResponse.json({ error: 'X-User-Id header required' }, { status: 400 })
  }

  let body: { message?: string; quickReply?: { field: string; value: string } }
  try {
    body = await req.json()
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 })
  }

  const message = body.message?.trim()
  if (!message) {
    return NextResponse.json({ error: 'message is required' }, { status: 400 })
  }

  // ── 1. Load or create UserMemory ──────────────────────────────────────
  const userMemory = await prisma.userMemory.upsert({
    where: { user_id: userId },
    create: { user_id: userId },
    update: {},
  })

  const existingIntent: IntentState = userMemory.summary_text
    ? (JSON.parse(userMemory.summary_text) as IntentState)
    : { completenessScore: 0 }

  // ── 2. Extract intent from message ────────────────────────────────────
  let extracted: Record<string, unknown> = {}
  try {
    const intentCompletion = await groq.chat.completions.create({
      model: GROQ_FAST,
      messages: [
        { role: 'system', content: PROMPTS.INTENT_EXTRACTION },
        { role: 'user', content: message },
      ],
      temperature: 0,
      max_tokens: 300,
    })
    extracted = JSON.parse(intentCompletion.choices[0].message.content ?? '{}')
  } catch {
    extracted = { is_general_query: true }
  }

  // ── 3. Map extracted fields to IntentState updates ────────────────────
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

  // ── 4. Persist intent ─────────────────────────────────────────────────
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

  // ── 5a. Pure greeting / chitchat ──────────────────────────────────────
  if (extracted.conversational_reply) {
    return NextResponse.json({
      message: extracted.conversational_reply,
      showRecommendations: false,
      chatPhase: 'DISCOVERY',
      resolvedFields: newIntent.resolvedFields,
      intent: intentSummary,
    })
  }

  // ── 5b. General / informational query ────────────────────────────────
  if (extracted.is_general_query) {
    let aiMessage = ''
    try {
      const generalCompletion = await groq.chat.completions.create({
        model: GROQ_SMART,
        messages: [
          {
            role: 'system',
            content: PROMPTS.GENERAL_QUERY.replace('{{SEARCH_CONTEXT}}', ''),
          },
          { role: 'user', content: message },
        ],
        temperature: 0.3,
        max_tokens: 1024,
      })
      aiMessage = generalCompletion.choices[0].message.content ?? ''
    } catch {
      aiMessage = "I couldn't fetch a response right now. Please try again."
    }

    return NextResponse.json({
      message: aiMessage,
      showRecommendations: false,
      chatPhase: 'DISCOVERY',
      resolvedFields: newIntent.resolvedFields,
      intent: { ...intentSummary, is_general_query: true },
    })
  }

  // ── 5c. Enough intent — search DB + advisor response ──────────────────
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
          { role: 'user', content: message },
        ],
        temperature: 0.3,
        max_tokens: 1024,
      })
      advisorMessage = advisorCompletion.choices[0].message.content ?? ''
    } catch {
      advisorMessage = `Here are ${projects.length} properties matching your criteria in ${newIntent.sector ?? 'Sector 150'}.`
    }

    return NextResponse.json({
      message: advisorMessage,
      showRecommendations: true,
      projects,
      chatPhase: 'ADVISOR',
      resolvedFields: newIntent.resolvedFields,
      intent: intentSummary,
    })
  }

  // ── 5d. Not enough intent — ask next question ─────────────────────────
  const nextQ = getNextQuestion(newIntent)

  let questionMessage = nextQ.question
  try {
    const questionCompletion = await groq.chat.completions.create({
      model: GROQ_FAST,
      messages: [
        { role: 'system', content: PROMPTS.QUESTION_GENERATION },
        { role: 'user', content: message },
      ],
      temperature: 0.3,
      max_tokens: 256,
    })
    questionMessage = questionCompletion.choices[0].message.content ?? nextQ.question
  } catch {
    questionMessage = nextQ.question
  }

  return NextResponse.json({
    message: questionMessage,
    showRecommendations: false,
    chatPhase: 'DISCOVERY',
    next_expected_field: nextQ.field,
    resolvedFields: newIntent.resolvedFields,
    intent: intentSummary,
  })
}
