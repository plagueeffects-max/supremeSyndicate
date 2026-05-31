import { prisma } from '@/lib/db'
import type { ProjectCard, ProjectDetail, UnitTypeSummary, AmenitySummary, ConnSummary } from '@/types/project'

const CATEGORY_ORDER = ['sports', 'lifestyle', 'wellness', 'kids', 'security', 'parking'] as const
const CONN_PRIORITY = ['metro', 'airport', 'road'] as const

export interface SearchFilters {
  sector?: string
  city?: string
  bhk?: number
  budget_min_cr?: number
  budget_max_cr?: number
}

export async function searchProjects(filters: SearchFilters): Promise<ProjectCard[]> {
  const unitConditions: object[] = []
  if (filters.bhk) unitConditions.push({ bhk: filters.bhk })
  if (filters.budget_max_cr != null) unitConditions.push({ price_min_cr: { lte: filters.budget_max_cr } })
  if (filters.budget_min_cr != null) unitConditions.push({ price_max_cr: { gte: filters.budget_min_cr } })

  const projects = await prisma.project.findMany({
    where: {
      ...(filters.city && { city: filters.city }),
      ...(filters.sector && { sector: filters.sector }),
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
    take: 10,
  })

  return projects.map(toProjectCard)
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
