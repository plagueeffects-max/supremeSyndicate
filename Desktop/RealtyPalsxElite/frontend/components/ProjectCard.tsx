'use client'

import { useState, useCallback } from 'react'
import Image from 'next/image'
import {
  ClockCountdown, CheckCircle, SealCheck,
  Subway, AirplaneTakeoff, Path,
  SoccerBall, Buildings, Leaf, Baby, Heart, Tree,
  MapPin, ArrowRight, Sparkle, BookmarkSimple,
  CaretLeft, CaretRight,
} from '@phosphor-icons/react'
import type { ProjectCard as ProjectCardType, AmenitySummary, ConnSummary } from '@/types/project'
import { API_BASE } from '@/lib/env'

interface Props {
  project: ProjectCardType
  userId: string | null
  index?: number
  onDetailOpen?: (project: ProjectCardType) => void
}

const AMENITY_ICONS: Record<AmenitySummary['category'], React.ElementType> = {
  sports: SoccerBall, lifestyle: Buildings, wellness: Leaf,
  kids: Baby, security: SealCheck, parking: Buildings,
}

const CONN_ICONS: Record<ConnSummary['type'], React.ElementType> = {
  metro: Subway, airport: AirplaneTakeoff, road: Path,
  school: Buildings, hospital: Heart, mall: Buildings,
  landmark: Tree, university: Buildings,
}

export default function ProjectCard({ project, userId, index = 0, onDetailOpen }: Props) {
  const [imgIdx, setImgIdx] = useState(0)
  const [saved, setSaved] = useState(false)
  const [saving, setSaving] = useState(false)

  const isRTM = project.status === 'ready_to_move'
  const isNew = project.status === 'new_launch'
  const statusLabel = isRTM ? 'Ready to Move' : isNew ? 'New Launch' : 'Under Construction'
  const StatusIcon = isRTM ? CheckCircle : ClockCountdown

  const uniqueBhk = [...new Set(project.unit_types.map((u) => `${u.bhk}BHK`))]

  // Build image list: hero first, then other exterior/hero images
  const cardImages = [
    ...(project.hero_image_url ? [project.hero_image_url] : []),
    ...(project.images ?? [])
      .filter((i) => (i.type === 'exterior' || i.type === 'hero') && i.url !== project.hero_image_url)
      .map((i) => i.url),
  ].filter(Boolean) as string[]
  const hasMultiple = cardImages.length > 1

  const prevImg = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setImgIdx((i) => (i - 1 + cardImages.length) % cardImages.length)
  }, [cardImages.length])

  const nextImg = useCallback((e: React.MouseEvent) => {
    e.stopPropagation()
    setImgIdx((i) => (i + 1) % cardImages.length)
  }, [cardImages.length])

  const handleSave = async (e: React.MouseEvent) => {
    e.stopPropagation()
    if (!userId || saving) return
    setSaving(true)
    try {
      if (saved) {
        await fetch(`${API_BASE}/saved/${project.id}`, {
          method: 'DELETE',
          headers: { 'X-User-Id': userId },
        })
        setSaved(false)
      } else {
        await fetch(`${API_BASE}/saved`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'X-User-Id': userId },
          body: JSON.stringify({ project_id: project.id }),
        })
        setSaved(true)
      }
    } catch {
      // silent
    } finally {
      setSaving(false)
    }
  }

  const handleAskAI = (e: React.MouseEvent) => {
    e.stopPropagation()
    window.dispatchEvent(
      new CustomEvent('realtypals:ask-ai', {
        detail: { text: `Tell me more about ${project.name} by ${project.builder.name}` },
      }),
    )
  }

  return (
    <div
      onClick={() => onDetailOpen?.(project)}
      className="group relative w-full rounded-2xl overflow-hidden bg-white border border-gray-100/80 shadow-[0_2px_12px_rgba(0,0,0,0.06)] hover:shadow-[0_8px_30px_rgba(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* ── Hero image carousel ── */}
      <div className="relative h-[220px] overflow-hidden bg-gray-100">
        {cardImages.length > 0 ? (
          <>
            {cardImages.map((src, i) => (
              <Image
                key={src}
                src={src}
                alt={project.name}
                fill
                unoptimized
                priority={index < 4 && i === 0}
                className={`object-cover transition-all duration-500 ${
                  i === imgIdx ? 'opacity-100 scale-100' : 'opacity-0 scale-105 absolute inset-0'
                } ${i === imgIdx ? 'group-hover:scale-105' : ''}`}
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            ))}
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-50">
            <Buildings size={40} weight="duotone" className="text-blue-200" />
          </div>
        )}

        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* Carousel controls */}
        {hasMultiple && (
          <>
            <button
              onClick={prevImg}
              className="absolute left-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <CaretLeft size={14} weight="bold" />
            </button>
            <button
              onClick={nextImg}
              className="absolute right-2 top-1/2 -translate-y-1/2 w-7 h-7 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white opacity-0 group-hover:opacity-100 transition-opacity z-10"
            >
              <CaretRight size={14} weight="bold" />
            </button>
            <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1 z-10">
              {cardImages.map((_, i) => (
                <button
                  key={i}
                  onClick={(e) => { e.stopPropagation(); setImgIdx(i) }}
                  className={`rounded-full transition-all ${i === imgIdx ? 'w-4 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/50'}`}
                />
              ))}
            </div>
          </>
        )}

        {/* Status badge */}
        <div className={`absolute top-3 left-3 flex items-center gap-1 text-[10px] font-bold px-2.5 py-1.5 rounded-lg backdrop-blur-sm ${
          isRTM ? 'bg-emerald-500/90 text-white' : isNew ? 'bg-blue-500/90 text-white' : 'bg-amber-500/90 text-white'
        }`}>
          <StatusIcon size={10} weight="fill" />
          {statusLabel}
        </div>

        {/* RERA + Save */}
        <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
          {project.rera_number && (
            <div className="flex items-center gap-1 text-[10px] font-bold text-white bg-blue-600/90 backdrop-blur-sm px-2 py-1.5 rounded-lg">
              <SealCheck size={10} weight="fill" />
              RERA
            </div>
          )}
          <button
            onClick={handleSave}
            className={`w-8 h-8 rounded-full backdrop-blur-sm flex items-center justify-center transition-all ${
              saved ? 'bg-red-500 text-white' : 'bg-black/30 hover:bg-black/50 text-white'
            }`}
            title={saved ? 'Unsave' : 'Save property'}
          >
            {saved
              ? <BookmarkSimple size={15} weight="fill" />
              : <BookmarkSimple size={15} weight="regular" />
            }
          </button>
        </div>
      </div>

      {/* ── Body ── */}
      <div className="p-5">
        {/* Name */}
        <div className="mb-3">
          <h3 className="text-[17px] font-bold text-gray-900 tracking-tight leading-snug">
            {project.name}
          </h3>
          {project.tagline && (
            <p className="text-[11px] text-blue-600 font-semibold mt-0.5 line-clamp-1">{project.tagline}</p>
          )}
          <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-400">
            <MapPin size={10} weight="duotone" />
            <span>{project.builder.name} · {project.sector}, {project.city}</span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-3">
          <p className="text-[22px] font-black text-gray-900 tracking-tight leading-none">
            {project.price_range_label}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5 font-medium">
            {uniqueBhk.join(' · ')}
            {project.possession_label && <span className="ml-1.5 text-gray-300">· {project.possession_label}</span>}
          </p>
        </div>

        {/* Design credit */}
        {project.architect && (
          <p className="text-[10.5px] text-indigo-500 font-semibold mb-3 flex items-center gap-1">
            <Sparkle size={10} weight="duotone" />
            {project.architect}{project.interior_designer ? ` × ${project.interior_designer}` : ''}
          </p>
        )}

        {/* Amenities */}
        {project.top_amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {project.top_amenities.slice(0, 5).map((a) => {
              const Icon = AMENITY_ICONS[a.category] ?? Buildings
              return (
                <span key={a.name} className="flex items-center gap-1 text-[10.5px] text-gray-500 bg-gray-50 border border-gray-100 px-2 py-1 rounded-full font-medium">
                  <Icon size={10} weight="duotone" />
                  {a.name}
                </span>
              )
            })}
          </div>
        )}

        {/* Connectivity */}
        {project.top_connectivity.length > 0 && (
          <div className="flex flex-wrap gap-3 pb-3 border-b border-gray-50">
            {project.top_connectivity.slice(0, 2).map((c) => {
              const Icon = CONN_ICONS[c.type] ?? Path
              return (
                <span key={c.name} className="flex items-center gap-1 text-[10.5px] text-gray-400">
                  <Icon size={12} weight="duotone" />
                  {c.name}
                </span>
              )
            })}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-3">
          <button
            onClick={() => onDetailOpen?.(project)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white text-[12px] font-bold py-2.5 rounded-xl transition-colors"
          >
            View Details
            <ArrowRight size={12} weight="bold" />
          </button>
          <button
            onClick={handleAskAI}
            className="flex items-center justify-center gap-1 bg-gray-50 hover:bg-blue-50 hover:text-blue-600 text-gray-400 text-[11px] font-semibold px-3 py-2.5 rounded-xl transition-colors border border-gray-100 hover:border-blue-100"
            title="Ask AI about this"
          >
            <Sparkle size={14} weight="duotone" />
          </button>
        </div>
      </div>
    </div>
  )
}
