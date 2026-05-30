import { NextResponse } from 'next/server'

export async function GET() {
  return NextResponse.json({
    sectors: [{ name: 'Sector 150', city: 'Noida' }],
  })
}
