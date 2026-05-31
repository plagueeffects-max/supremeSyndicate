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
} from '@phosphor-icons/react'
import type { ProjectCard as ProjectCardType, AmenitySummary, ConnSummary } from '@/types/project'

interface Props {
  project: ProjectCardType
  userId: string | null
}

const AMENITY_ICONS: Record<AmenitySummary['category'], React.ElementType> = {
  sports: SoccerBall,
  lifestyle: Buildings,
  wellness: Leaf,
  kids: Baby,
  security: SealCheck,
  parking: Buildings,
}

const CONN_ICONS: Record<ConnSummary['type'], React.ElementType> = {
  metro: Subway,
  airport: AirplaneTakeoff,
  road: Path,
  school: Buildings,
  hospital: Heart,
  mall: Buildings,
  landmark: Tree,
  university: Buildings,
}

export default function ProjectCard({ project }: Props) {
  const isRTM = project.status === 'ready_to_move'
  const StatusIcon = isRTM ? CheckCircle : ClockCountdown
  const statusLabel = isRTM
    ? 'Ready to Move'
    : project.status === 'new_launch'
    ? 'New Launch'
    : 'Under Construction'

  const uniqueBhk = [...new Set(project.unit_types.map((u) => `${u.bhk}BHK`))]

  return (
    <div className="group relative w-full rounded-[22px] overflow-hidden bg-[#0f0f0f] border border-[#191919] transition-all duration-200 ease-out hover:-translate-y-1.5 hover:border-[#252525] hover:shadow-[0_28px_80px_rgba(0,0,0,0.75)]">

      {/* ── Hero ── */}
      <div className="relative h-[196px] overflow-hidden bg-[#111122]">
        {project.hero_image_url ? (
          <Image
            src={project.hero_image_url}
            alt={project.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 352px"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <span className="text-[11px] tracking-widest text-[#1e1e30] uppercase font-semibold">
              Hero Image
            </span>
          </div>
        )}
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-[#0f0f0f] to-transparent pointer-events-none" />
        <div
          className={`absolute top-3.5 left-3.5 flex items-center gap-1.5 text-[10px] font-bold tracking-[0.07em] px-2.5 py-[5px] rounded-[8px] backdrop-blur-md ${
            isRTM
              ? 'bg-[rgba(34,197,94,0.1)] border border-[rgba(34,197,94,0.25)] text-[#22c55e]'
              : 'bg-[rgba(251,146,60,0.1)] border border-[rgba(251,146,60,0.25)] text-[#fb923c]'
          }`}
        >
          <StatusIcon size={12} weight="duotone" />
          {statusLabel}
        </div>
      </div>

      {/* ── Body ── */}
      <div className="p-[22px]">
        <div className="flex justify-between items-start mb-[3px]">
          <h3 className="text-[19px] font-extrabold text-[#f0f0f0] tracking-[-0.025em] leading-[1.15] flex-1 pr-2.5">
            {project.name}
          </h3>
          {project.rera_number && (
            <div className="flex-shrink-0 mt-0.5 flex items-center gap-1 text-[10px] font-bold text-[#3b7fff] bg-[rgba(59,127,255,0.07)] border border-[rgba(59,127,255,0.18)] px-2.5 py-1 rounded-[7px] tracking-[0.05em]">
              <SealCheck size={13} weight="duotone" />
              RERA
            </div>
          )}
        </div>

        <p className="text-[12px] text-[#383838] font-medium mb-[18px] mt-[3px]">
          {project.builder.name}
          {project.sector && (
            <>
              <span className="mx-1.5 text-[#222]">·</span>
              {project.sector}
            </>
          )}
          {project.city && (
            <>
              <span className="mx-1.5 text-[#222]">·</span>
              {project.city}
            </>
          )}
        </p>

        {(project.architect || project.interior_designer) && (
          <p className="text-[10px] text-[#3b7fff] font-semibold tracking-[0.04em] mb-[18px] opacity-65 flex items-center gap-1.5">
            <PaintBrushBroad size={11} weight="duotone" />
            {project.architect && project.interior_designer
              ? `${project.architect} × ${project.interior_designer}`
              : (project.architect ?? project.interior_designer)}
          </p>
        )}

        <p className="text-[27px] font-black text-white tracking-[-0.035em] leading-none mb-1.5">
          {project.price_range_label}
        </p>
        <p className="text-[11px] text-[#2e2e2e] font-semibold tracking-[0.03em]">
          {uniqueBhk.join(' · ')}
        </p>

        <div className="h-px bg-[#161616] my-[17px]" />

        <div className="flex flex-wrap gap-1.5 mb-[17px]">
          {project.top_amenities.map((a) => {
            const Icon = AMENITY_ICONS[a.category] ?? Buildings
            return (
              <span
                key={a.name}
                className="flex items-center gap-1.5 text-[11px] text-[#404040] bg-[#111] border border-[#1a1a1a] px-2.5 py-[5px] rounded-full font-medium"
              >
                <Icon size={13} weight="duotone" />
                {a.name}
              </span>
            )
          })}
        </div>

        <div className="flex flex-wrap gap-4">
          {project.top_connectivity.map((c) => {
            const Icon = CONN_ICONS[c.type] ?? Path
            return (
              <span
                key={c.name}
                className="flex items-center gap-1.5 text-[11px] text-[#2e2e2e] font-medium"
              >
                <Icon size={14} weight="duotone" className="opacity-70" />
                {c.distance_km ? `${c.distance_km}km ` : ''}
                {c.name}
              </span>
            )
          })}
        </div>
      </div>
    </div>
  )
}
