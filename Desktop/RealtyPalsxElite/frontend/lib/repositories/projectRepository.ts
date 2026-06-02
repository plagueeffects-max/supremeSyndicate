import { prisma } from '@/lib/db'
import { rerank as jinaRerank, embed } from '@/lib/ai/jina'
import { cohereRerank } from '@/lib/ai/cohere'
import { getCached, setCached, makeKey } from '@/lib/redis'
import type { ProjectCard, ProjectDetail, UnitTypeSummary, AmenitySummary, ConnSummary } from '@/types/project'

const CATEGORY_ORDER = ['sports', 'lifestyle', 'wellness', 'kids', 'security', 'parking'] as const
const CONN_PRIORITY = ['metro', 'airport', 'road'] as const

export interface SearchFilters {
  sector?: string
  city?: string
  bhk?: number
  budget_min_cr?: number
  budget_max_cr?: number
  possession_year_max?: number
}

/** Build a rich text description of a property for Jina reranking. */
function toRerankDoc(p: ProjectCard): string {
  const bhks = p.unit_types.map((u) => `${u.bhk}BHK`).join(', ')
  const amenities = p.top_amenities.map((a) => a.name).join(', ')
  const conn = p.top_connectivity
    .map((c) => `${c.name}${c.distance_km ? ` ${c.distance_km}km` : ''}`)
    .join(', ')
  return [
    `${p.name} by ${p.builder.name}`,
    `${p.sector}, ${p.city}`,
    `Price: ${p.price_range_label}`,
    `Configs: ${bhks}`,
    `Status: ${p.status.replace(/_/g, ' ')}`,
    p.possession_label ? `Possession: ${p.possession_label}` : '',
    amenities ? `Amenities: ${amenities}` : '',
    conn ? `Nearby: ${conn}` : '',
    p.tagline ?? '',
  ]
    .filter(Boolean)
    .join('. ')
}

/** True when query is open-ended (no strong location/BHK/budget signal) */
function isVagueQuery(filters: SearchFilters, query?: string): boolean {
  const hasHardFilters = filters.sector || filters.bhk || filters.budget_max_cr || filters.budget_min_cr
  return !hasHardFilters && !!query && query.length > 10
}

function buildCacheKey(filters: SearchFilters, userQuery?: string): string {
  return makeKey(
    'search',
    filters.city ?? 'noida',
    filters.sector ?? '',
    String(filters.bhk ?? ''),
    String(filters.budget_min_cr ?? ''),
    String(filters.budget_max_cr ?? ''),
    String(filters.possession_year_max ?? ''),
    (userQuery ?? '').toLowerCase().slice(0, 60).replace(/\s+/g, '-'),
  )
}

export async function searchProjects(
  filters: SearchFilters,
  userQuery?: string,
): Promise<ProjectCard[]> {
  // ── Redis cache (2-hour TTL for results, 30-min for empty) ──────────────
  const cacheKey = buildCacheKey(filters, userQuery)
  const cached = await getCached<ProjectCard[]>(cacheKey)
  if (cached) {
    console.log(`[repo] 🗄 search cache hit key=${cacheKey.slice(0, 80)}`)
    return cached
  }

  // ── Vector similarity path (vague open-ended queries) ───────────────────
  if (isVagueQuery(filters, userQuery) && process.env.JINA_API_KEY) {
    const queryEmbedding = await embed(userQuery!)
    if (queryEmbedding) {
      const vectorStr = `[${queryEmbedding.join(',')}]`
      const cityFilter = filters.city ?? 'Noida'
      const vectorRows = await prisma.$queryRaw<Array<{ id: string }>>`
        SELECT p.id
        FROM projects p
        WHERE p.city = ${cityFilter}
          AND p.embedding IS NOT NULL
        ORDER BY p.embedding <=> ${vectorStr}::vector
        LIMIT 15
      `
      if (vectorRows.length > 0) {
        const ids = vectorRows.map((r) => r.id)
        const rows = await prisma.project.findMany({
          where: { id: { in: ids } },
          include: {
            builder: { select: { name: true, slug: true } },
            unit_types: { orderBy: { bhk: 'asc' } },
            amenities: true,
            connectivity: true,
            images: { orderBy: { sort_order: 'asc' } },
          },
        })
        const ordered = ids
          .map((id) => rows.find((r) => r.id === id))
          .filter(Boolean) as typeof rows
        const vectorResults = ordered.slice(0, 6).map(toProjectCard)
        await setCached(cacheKey, vectorResults, 60 * 60 * 2)
        return vectorResults
      }
    }
  }

  // ── Filter-based path (structured intent) ───────────────────────────────
  const unitConditions: object[] = []
  if (filters.bhk) unitConditions.push({ bhk: filters.bhk })
  if (filters.budget_max_cr != null) unitConditions.push({ price_min_cr: { lte: filters.budget_max_cr } })
  if (filters.budget_min_cr != null) unitConditions.push({ price_max_cr: { gte: filters.budget_min_cr } })

  const rows = await prisma.project.findMany({
    where: {
      ...(filters.city && { city: filters.city }),
      ...(filters.sector && { sector: filters.sector }),
      ...(filters.possession_year_max != null && {
        possession_date: { lte: new Date(filters.possession_year_max, 11, 31) },
      }),
      ...(unitConditions.length > 0 && {
        unit_types: { some: unitConditions.length === 1 ? unitConditions[0] : { AND: unitConditions } },
      }),
    },
    include: {
      builder: { select: { name: true, slug: true } },
      unit_types: { orderBy: { bhk: 'asc' } },
      amenities: true,
      connectivity: true,
      images: { orderBy: { sort_order: 'asc' } },
    },
    orderBy: { created_at: 'asc' },
    take: 15,
  })

  const cards = rows.map(toProjectCard)

  if (cards.length === 0) {
    await setCached(cacheKey, [], 60 * 30)
    return []
  }

  // Rerank chain: Jina (primary) → Cohere (fallback) → DB order
  if (userQuery && cards.length > 1) {
    const docs = cards.map(toRerankDoc)

    if (process.env.JINA_API_KEY) {
      const ranked = await jinaRerank(userQuery, docs, 6)
      if (ranked.length > 0) {
        const jinaResults = ranked.map((r) => cards[r.index]).filter(Boolean) as ProjectCard[]
        await setCached(cacheKey, jinaResults, 60 * 60 * 2)
        return jinaResults
      }
    }

    if (process.env.COHERE_API_KEY) {
      const ranked = await cohereRerank(userQuery, docs, 6)
      if (ranked.length > 0) {
        const cohereResults = ranked.map((r) => cards[r.index]).filter(Boolean) as ProjectCard[]
        await setCached(cacheKey, cohereResults, 60 * 60 * 2)
        return cohereResults
      }
    }
  }

  const finalResults = cards.slice(0, 6)
  await setCached(cacheKey, finalResults, 60 * 60 * 2)
  return finalResults
}

export async function getProjectBySlug(slug: string): Promise<ProjectCard | null> {
  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      builder: { select: { name: true, slug: true } },
      unit_types: { orderBy: { bhk: 'asc' } },
      amenities: true,
      connectivity: true,
      images: { orderBy: { sort_order: 'asc' } },
    },
  })
  return project ? toProjectCard(project) : null
}

export async function getProjectDetail(slug: string): Promise<ProjectDetail | null> {
  const project = await prisma.project.findUnique({
    where: { slug },
    include: {
      builder: true,
      unit_types: { orderBy: { bhk: 'asc' } },
      amenities: true,
      connectivity: true,
      images: { orderBy: { sort_order: 'asc' } },
    },
  })
  if (!project) return null

  const card = toProjectCard(project)
  const b = project.builder

  return {
    ...card,
    long_description: (project as any).long_description ?? null,
    design_theme: (project as any).design_theme ?? null,
    total_units: (project as any).total_units ?? null,
    marketing_claims: (project as any).marketing_claims ?? [],
    all_amenities: project.amenities.map((a: any) => ({ name: a.name, category: a.category })),
    all_connectivity: project.connectivity.map((c: any) => ({ type: c.type, name: c.name, distance_km: c.distance_km })),
    builder_detail: {
      name: b.name,
      slug: b.slug,
      tagline: b.tagline ?? null,
      description: b.description ?? null,
      founded_year: b.founded_year ?? null,
      headquarters: b.headquarters ?? null,
      website: b.website ?? null,
      credai_member: b.credai_member ?? false,
      delivered_units: b.delivered_units ?? null,
      delivered_projects: b.delivered_projects ?? [],
      ongoing_projects: b.ongoing_projects ?? [],
      awards: b.awards ?? [],
    },
  }
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function toProjectCard(p: any): ProjectCard {
  const allPrices = p.unit_types
    .flatMap((u: any) => [u.price_min_cr, u.price_max_cr])
    .filter((v: any): v is number => v != null)

  const price_min_cr = allPrices.length ? Math.min(...allPrices) : null
  const price_max_cr = allPrices.length ? Math.max(...allPrices) : null

  const fmt = (n: number) => n.toFixed(2)

  const price_range_label =
    price_min_cr != null && price_max_cr != null
      ? price_min_cr === price_max_cr
        ? `₹${fmt(price_min_cr)} Cr`
        : `₹${fmt(price_min_cr)} – ${fmt(price_max_cr)} Cr`
      : 'Price on request'

  const sortedAmenities = [...p.amenities].sort(
    (a: any, b: any) =>
      CATEGORY_ORDER.indexOf(a.category as any) - CATEGORY_ORDER.indexOf(b.category as any),
  )
  const top_amenities: AmenitySummary[] = sortedAmenities.slice(0, 6).map((a: any) => ({
    name: a.name,
    category: a.category,
  }))

  const top_connectivity: ConnSummary[] = []
  for (const type of CONN_PRIORITY) {
    const found = p.connectivity.find((c: any) => c.type === type)
    if (found) top_connectivity.push({ type: found.type, name: found.name, distance_km: found.distance_km })
  }

  return {
    id: p.id,
    slug: p.slug,
    name: p.name,
    tagline: p.tagline,
    builder: p.builder,
    rera_number: p.rera_number,
    rera_url: p.rera_url ?? null,
    lat: p.lat ?? null,
    lng: p.lng ?? null,
    sector: p.sector,
    city: p.city,
    address: p.address,
    land_area_acres: p.land_area_acres,
    total_towers: p.total_towers,
    status: p.status,
    possession_label: p.possession_label,
    architect: p.architect,
    interior_designer: p.interior_designer,
    design_theme: p.design_theme,
    marketing_claims: p.marketing_claims,
    hero_image_url: p.hero_image_url,
    price_min_cr,
    price_max_cr,
    price_range_label,
    unit_types: p.unit_types.map(
      (u: any): UnitTypeSummary => ({
        name: u.name,
        bhk: u.bhk,
        super_area_sqft: u.super_area_sqft,
        carpet_area_sqft: u.carpet_area_sqft,
        price_min_cr: u.price_min_cr,
        price_max_cr: u.price_max_cr,
        price_label: u.price_label,
      }),
    ),
    top_amenities,
    top_connectivity,
    images: p.images?.map((img: any) => ({
      id: img.id,
      url: img.url,
      type: img.type as string,
      caption: img.caption,
      sort_order: img.sort_order,
    })) ?? [],
  }
}
