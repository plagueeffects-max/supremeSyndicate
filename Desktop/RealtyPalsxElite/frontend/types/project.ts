export interface ProjectCard {
  id: string
  slug: string
  name: string
  tagline?: string | null
  builder: { name: string; slug: string }
  rera_number?: string | null
  sector: string
  city: string
  address?: string | null
  land_area_acres?: number | null
  total_towers?: number | null
  status: 'under_construction' | 'ready_to_move' | 'new_launch'
  possession_label?: string | null
  architect?: string | null
  interior_designer?: string | null
  design_theme?: string | null
  marketing_claims: string[]
  hero_image_url?: string | null
  price_min_cr?: number | null
  price_max_cr?: number | null
  price_range_label: string
  unit_types: UnitTypeSummary[]
  top_amenities: AmenitySummary[]
  top_connectivity: ConnSummary[]
}

export interface UnitTypeSummary {
  name: string
  bhk: number
  super_area_sqft?: number | null
  carpet_area_sqft?: number | null
  price_min_cr?: number | null
  price_max_cr?: number | null
  price_label?: string | null
}

export interface AmenitySummary {
  name: string
  category: 'sports' | 'lifestyle' | 'wellness' | 'kids' | 'security' | 'parking'
}

export interface ConnSummary {
  type: 'metro' | 'road' | 'school' | 'hospital' | 'mall' | 'landmark' | 'airport' | 'university'
  name: string
  distance_km?: number | null
}
