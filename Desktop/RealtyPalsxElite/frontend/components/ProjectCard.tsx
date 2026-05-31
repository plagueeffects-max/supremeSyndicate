'use client'

import Image from 'next/image'
import {
  ClockCountdown,
  CheckCircle,
  SealCheck,
  Subway,
  AirplaneTakeoff,
  Path,
  SoccerBall,
  Buildings,
  Leaf,
  Baby,
  Heart,
  Tree,
  PaintBrushBroad,
  MapPin,
  SparkleIcon,
  ArrowRight,
} from '@phosphor-icons/react'
import type { ProjectCard as ProjectCardType, AmenitySummary, ConnSummary } from '@/types/project'

interface Props {
  project: ProjectCardType
  userId: string | null
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

export default function ProjectCard({ project }: Props) {
  const isRTM    = project.status === 'ready_to_move'
  const isNew    = project.status === 'new_launch'
  const statusLabel = isRTM ? 'Ready to Move' : isNew ? 'New Launch' : 'Under Construction'
  const StatusIcon  = isRTM ? CheckCircle : ClockCountdown

  const uniqueBhk = [...new Set(project.unit_types.map((u) => `${u.bhk}BHK`))]

  const handleAskAI = () => {
    window.dispatchEvent(
      new CustomEvent('realtypals:ask-ai', {
        detail: { text: `Tell me more about ${project.name} by ${project.builder.name}` },
      }),
    )
  }

  return (
    <div className="group relative w-full rounded-[24px] overflow-hidden bg-[#0d0d0d] border border-[#1a1a1a] transition-all duration-300 ease-out hover:-translate-y-2 hover:border-[#262626] hover:shadow-[0_32px_80px_rgba(0,0,0,0.8)] cursor-pointer">

      {/* ── Hero image ── */}
      <div className="relative h-[200px] overflow-hidden bg-[#0a0a14]">
        {project.hero_image_url ? (
          <Image
            src={project.hero_image_url}
            alt={project.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, 380px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <Buildings size={40} weight="duotone" className="text-[#1e1e30]" />
          </div>
        )}

        {/* Gradient overlays */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#0d0d0d] via-transparent to-transparent pointer-events-none" />
        <div className="absolute inset-0 bg-gradient-to-b from-black/30 to-transparent pointer-events-none" />

        {/* Status badge */}
        <div className={`absolute top-3.5 left-3.5 flex items-center gap-1.5 text-[10px] font-bold tracking-[0.06em] px-2.5 py-1.5 rounded-[9px] backdrop-blur-md ${
          isRTM
            ? 'bg-emerald-500/10 border border-emerald-500/25 text-emerald-400'
            : isNew
            ? 'bg-blue-500/10 border border-blue-500/25 text-blue-400'
            : 'bg-amber-500/10 border border-amber-500/25 text-amber-400'
        }`}>
          <StatusIcon size={11} weight="duotone" />
          {statusLabel}
        </div>

        {/* RERA badge */}
        {project.rera_number && (
          <div className="absolute top-3.5 right-3.5 flex items-center gap-1 text-[10px] font-bold text-blue-400 bg-blue-500/10 border border-blue-500/20 px-2 py-1.5 rounded-[9px] backdrop-blur-md">
            <SealCheck size={11} weight="duotone" />
            RERA
          </div>
        )}
      </div>

      {/* ── Content ── */}
      <div className="px-5 pt-4 pb-5">

        {/* Name + location */}
        <div className="mb-3">
          <h3 className="text-[18px] font-black text-white tracking-[-0.03em] leading-tight mb-0.5">
            {project.name}
          </h3>
          {project.tagline && (
            <p className="text-[11px] text-[#3a6fff] font-semibold tracking-[0.02em] mb-1.5 opacity-80">
              {project.tagline}
            </p>
          )}
          <div className="flex items-center gap-1.5 text-[11px] text-[#333]">
            <MapPin size={11} weight="duotone" className="opacity-60" />
            <span>{project.builder.name}</span>
            <span className="text-[#222]">·</span>
            <span>{project.sector}, {project.city}</span>
          </div>
        </div>

        {/* Design credit */}
        {(project.architect || project.interior_designer) && (
          <div className="flex items-center gap-1.5 text-[10px] text-blue-500/60 font-semibold tracking-[0.03em] mb-3">
            <PaintBrushBroad size={10} weight="duotone" />
            {project.architect && project.interior_designer
              ? `${project.architect} × ${project.interior_designer}`
              : project.architect ?? project.interior_designer}
          </div>
        )}

        {/* Price */}
        <div className="mb-1">
          <p className="text-[26px] font-black text-white tracking-[-0.04em] leading-none">
            {project.price_range_label}
          </p>
          <p className="text-[11px] text-[#2a2a2a] font-semibold mt-1 tracking-[0.02em]">
            {uniqueBhk.join(' · ')}
            {project.possession_label && (
              <span className="ml-2 text-[#252525]">· {project.possession_label}</span>
            )}
          </p>
        </div>

        <div className="h-px bg-[#141414] my-4" />

        {/* Amenities */}
        {project.top_amenities.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {project.top_amenities.map((a) => {
              const Icon = AMENITY_ICONS[a.category] ?? Buildings
              return (
                <span
                  key={a.name}
                  className="flex items-center gap-1 text-[10.5px] text-[#383838] bg-[#0f0f0f] border border-[#181818] px-2.5 py-[5px] rounded-full font-medium"
                >
                  <Icon size={12} weight="duotone" className="opacity-70" />
                  {a.name}
                </span>
              )
            })}
          </div>
        )}

        {/* Connectivity */}
        {project.top_connectivity.length > 0 && (
          <div className="flex flex-wrap gap-3 mb-4">
            {project.top_connectivity.map((c) => {
              const Icon = CONN_ICONS[c.type] ?? Path
              return (
                <span
                  key={c.name}
                  className="flex items-center gap-1.5 text-[10.5px] text-[#2a2a2a] font-medium"
                >
                  <Icon size={13} weight="duotone" className="opacity-50" />
                  {c.distance_km ? `${c.distance_km}km · ` : ''}{c.name}
                </span>
              )
            })}
          </div>
        )}

        {/* Ask AI CTA */}
        <button
          onClick={handleAskAI}
          className="w-full flex items-center justify-between gap-2 bg-[#0f0f0f] hover:bg-[#141422] border border-[#1a1a1a] hover:border-blue-500/20 rounded-xl px-4 py-2.5 transition-all duration-200 group/btn"
        >
          <span className="flex items-center gap-2 text-[11.5px] text-[#333] group-hover/btn:text-blue-400 font-semibold transition-colors">
            <SparkleIcon size={13} weight="duotone" className="text-blue-500/50 group-hover/btn:text-blue-400 transition-colors" />
            Ask AI about this property
          </span>
          <ArrowRight size={13} className="text-[#222] group-hover/btn:text-blue-400 transition-colors" />
        </button>
      </div>
    </div>
  )
}
