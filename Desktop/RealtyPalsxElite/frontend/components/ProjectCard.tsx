'use client'

import Image from 'next/image'
import {
  ClockCountdown, CheckCircle, SealCheck,
  Subway, AirplaneTakeoff, Path,
  SoccerBall, Buildings, Leaf, Baby, Heart, Tree,
  MapPin, ArrowRight, Sparkle,
} from '@phosphor-icons/react'
import type { ProjectCard as ProjectCardType, AmenitySummary, ConnSummary } from '@/types/project'

interface Props {
  project: ProjectCardType
  userId: string | null
  index?: number
  onDetailOpen?: (project: ProjectCardType) => void
}

const AMENITY_ICONS: Record<AmenitySummary['category'], React.ElementType> = {
  sports:    SoccerBall,
  lifestyle: Buildings,
  wellness:  Leaf,
  kids:      Baby,
  security:  SealCheck,
  parking:   Buildings,
}

const CONN_ICONS: Record<ConnSummary['type'], React.ElementType> = {
  metro:      Subway,
  airport:    AirplaneTakeoff,
  road:       Path,
  school:     Buildings,
  hospital:   Heart,
  mall:       Buildings,
  landmark:   Tree,
  university: Buildings,
}

export default function ProjectCard({ project, index = 0, onDetailOpen }: Props) {
  const isRTM  = project.status === 'ready_to_move'
  const isNew  = project.status === 'new_launch'
  const statusLabel = isRTM ? 'Ready to Move' : isNew ? 'New Launch' : 'Under Construction'
  const StatusIcon  = isRTM ? CheckCircle : ClockCountdown

  const uniqueBhk = [...new Set(project.unit_types.map((u) => `${u.bhk}BHK`))]

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
      className="group relative w-full rounded-2xl overflow-hidden bg-white border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
    >
      {/* Hero image */}
      <div className="relative h-[168px] overflow-hidden bg-gray-100">
        {project.hero_image_url ? (
          <Image
            src={project.hero_image_url}
            alt={project.name}
            fill
            unoptimized
            priority={index < 6}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Buildings size={36} weight="duotone" className="text-gray-200" />
          </div>
        )}

        {/* Gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent pointer-events-none" />

        {/* Status */}
        <div className={`absolute top-2.5 left-2.5 flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg backdrop-blur-sm ${
          isRTM  ? 'bg-emerald-500/90 text-white' :
          isNew  ? 'bg-blue-500/90 text-white' :
                   'bg-amber-500/90 text-white'
        }`}>
          <StatusIcon size={10} weight="fill" />
          {statusLabel}
        </div>

        {/* RERA */}
        {project.rera_number && (
          <div className="absolute top-2.5 right-2.5 flex items-center gap-1 text-[10px] font-bold text-white bg-blue-600/90 backdrop-blur-sm px-2 py-1 rounded-lg">
            <SealCheck size={10} weight="fill" />
            RERA
          </div>
        )}
      </div>

      {/* Body */}
      <div className="p-4">
        {/* Name + builder */}
        <div className="mb-2.5">
          <h3 className="text-[15px] font-bold text-gray-900 tracking-tight leading-snug">
            {project.name}
          </h3>
          <div className="flex items-center gap-1 mt-0.5 text-[11px] text-gray-400">
            <MapPin size={10} weight="duotone" />
            <span>{project.builder.name} · {project.sector}</span>
          </div>
        </div>

        {/* Price */}
        <div className="mb-3">
          <p className="text-[20px] font-black text-gray-900 tracking-tight leading-none">
            {project.price_range_label}
          </p>
          <p className="text-[11px] text-gray-400 mt-0.5">
            {uniqueBhk.join(' · ')}
            {project.possession_label && ` · ${project.possession_label}`}
          </p>
        </div>

        {/* Top amenities */}
        {project.top_amenities.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {project.top_amenities.slice(0, 4).map((a) => {
              const Icon = AMENITY_ICONS[a.category] ?? Buildings
              return (
                <span key={a.name} className="flex items-center gap-1 text-[10px] text-gray-500 bg-gray-50 border border-gray-100 px-2 py-1 rounded-full font-medium">
                  <Icon size={10} weight="duotone" />
                  {a.name}
                </span>
              )
            })}
          </div>
        )}

        {/* Connectivity */}
        {project.top_connectivity.length > 0 && (
          <div className="flex flex-wrap gap-2.5 mb-3">
            {project.top_connectivity.slice(0, 2).map((c) => {
              const Icon = CONN_ICONS[c.type] ?? Path
              return (
                <span key={c.name} className="flex items-center gap-1 text-[10px] text-gray-400 font-medium">
                  <Icon size={11} weight="duotone" />
                  {c.name}
                </span>
              )
            })}
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-2 pt-2 border-t border-gray-50">
          <button
            onClick={() => onDetailOpen?.(project)}
            className="flex-1 flex items-center justify-center gap-1.5 bg-blue-600 hover:bg-blue-500 text-white text-[11px] font-bold py-2 rounded-xl transition-colors"
          >
            View Details
            <ArrowRight size={11} weight="bold" />
          </button>
          <button
            onClick={handleAskAI}
            className="flex items-center justify-center gap-1 bg-gray-50 hover:bg-gray-100 text-gray-500 hover:text-blue-600 text-[11px] font-semibold px-3 py-2 rounded-xl transition-colors border border-gray-100"
            title="Ask AI"
          >
            <Sparkle size={13} weight="duotone" />
          </button>
        </div>
      </div>
    </div>
  )
}
