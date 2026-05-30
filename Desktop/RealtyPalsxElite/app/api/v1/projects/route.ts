import { NextRequest, NextResponse } from 'next/server'
import { searchProjects } from '@/server/repositories/projectRepository'

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl

  const sector = searchParams.get('sector') ?? undefined
  const bhkRaw = searchParams.get('bhk')
  const minPriceRaw = searchParams.get('min_price')
  const maxPriceRaw = searchParams.get('max_price')

  try {
    const projects = await searchProjects({
      city: 'Noida',
      sector: sector ?? 'Sector 150',
      bhk: bhkRaw ? parseInt(bhkRaw, 10) : undefined,
      budget_min_cr: minPriceRaw ? parseFloat(minPriceRaw) / 10_000_000 : undefined,
      budget_max_cr: maxPriceRaw ? parseFloat(maxPriceRaw) / 10_000_000 : undefined,
    })

    return NextResponse.json({ projects })
  } catch (err) {
    console.error('[GET /api/v1/projects]', err)
    return NextResponse.json({ error: 'Failed to fetch projects' }, { status: 500 })
  }
}
