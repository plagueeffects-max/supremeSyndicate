'use client'

import dynamic from 'next/dynamic'
import type { ProjectCard } from '@/types/project'

export const SECTOR_CENTROIDS: Record<string, [number, number]> = {
  'Sector 78':  [28.565, 77.392],
  'Sector 137': [28.506, 77.417],
  'Sector 150': [28.473, 77.444],
}

export const NOIDA_CENTER: [number, number] = [28.535, 77.391]

interface Props {
  properties: ProjectCard[]
}

// Dynamic import to avoid SSR issues with Leaflet
const MapInner = dynamic(() => import('./SectorMapInner'), { ssr: false })

export default function SectorMap({ properties }: Props) {
  if (!properties.length) return null
  return <MapInner properties={properties} />
}
