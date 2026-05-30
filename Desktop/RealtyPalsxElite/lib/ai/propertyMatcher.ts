import { PrismaClient, PropertyStatus, ImageType } from '@prisma/client';

export interface EnrichedFields {
  bhk?: number;
  size_sqft?: number;
  price?: number;
  price_per_sqft?: number;
  status?: PropertyStatus;
  builder?: string;
  project_name?: string;
  highlights?: string[];
  amenities?: string[];
  bathrooms?: number | null;
  balconies?: number | null;
  image_url?: string | null;
  images?: Array<{
    id: string;
    image_url: string;
    image_type: ImageType;
    caption: string | null;
    sort_order: number;
  }>;
}

/**
 * Fuzzy-match a Google Places result against the Prisma property DB.
 * Returns a subset of DB fields to merge into the Places-sourced card,
 * or null if no match or the DB lookup fails.
 *
 * Keeps DB queries in logic/ per architecture rules.
 */
export async function fuzzyMatchProperty(
  prisma: PrismaClient,
  projectName: string,
  _address: string // Reserved: future sector-scoped disambiguation when project names collide across cities
): Promise<EnrichedFields | null> {
  const term = projectName.trim().toLowerCase();
  if (!term) return null;

  try {
    const match = await prisma.property.findFirst({
      where: {
        OR: [
          { project_name: { contains: term, mode: 'insensitive' } },
          { builder: { contains: term, mode: 'insensitive' } },
        ],
      },
      include: {
        images: { orderBy: { sort_order: 'asc' } },
      },
    });

    if (!match) return null;

    return {
      bhk: match.bhk,
      size_sqft: match.size_sqft,
      price: match.price,
      price_per_sqft: match.price_per_sqft,
      status: match.status,
      builder: match.builder,
      project_name: match.project_name ?? undefined,
      highlights: match.highlights,
      amenities: match.amenities,
      bathrooms: match.bathrooms,
      balconies: match.balconies,
      image_url: match.image_url,
      images: match.images.map(img => ({
        id: img.id,
        image_url: img.image_url,
        image_type: img.image_type,
        caption: img.caption,
        sort_order: img.sort_order,
      })),
    };
  } catch {
    return null;
  }
}
