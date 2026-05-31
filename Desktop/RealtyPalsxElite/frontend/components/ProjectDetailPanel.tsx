'use client'

import { useState, useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import Image from 'next/image'
import {
  X, CheckCircle2, Clock, Shield, MapPin, Building2, Award,
  Ruler, BedDouble, Bath, ChevronRight, ExternalLink,
  Sparkles, Star, Trophy, Layers, Phone,
} from 'lucide-react'
import {
  Subway, AirplaneTakeoff, Path, Buildings, Heart, Tree,
  SoccerBall, Leaf, Baby, SealCheck, MapTrifold,
} from '@phosphor-icons/react'
import type { ProjectCard as ProjectCardType, ProjectDetail } from '@/types/project'
import { API_BASE } from '@/lib/env'
import AmenityIcon from '@/components/AmenityIcon'

interface Props {
  project: ProjectCardType | null
  onClose: () => void
}

const AMENITY_ICONS: Record<string, React.ElementType> = {
  sports: SoccerBall, lifestyle: Buildings, wellness: Leaf,
  kids: Baby, security: SealCheck, parking: Buildings,
}

const CONN_ICONS: Record<string, React.ElementType> = {
  metro: Subway, airport: AirplaneTakeoff, road: Path,
  school: Buildings, hospital: Heart, mall: Buildings,
  landmark: Tree, university: Buildings,
}

const AMENITY_COLORS: Record<string, string> = {
  sports: 'bg-orange-50 text-orange-600 border-orange-100',
  lifestyle: 'bg-blue-50 text-blue-600 border-blue-100',
  wellness: 'bg-green-50 text-green-600 border-green-100',
  kids: 'bg-pink-50 text-pink-600 border-pink-100',
  security: 'bg-purple-50 text-purple-600 border-purple-100',
  parking: 'bg-gray-50 text-gray-600 border-gray-100',
}

const WhatsAppIcon = ({ size = 16 }: { size?: number }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
)

function buildWhatsAppUrl(project: {
  name: string
  builder: { name: string }
  sector: string
  price_range_label: string
  status: string
  rera_number?: string | null
  unit_types: Array<{ bhk: number }>
}): string | null {
  const number = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER
  if (!number) return null

  const bhkList = [...new Set(project.unit_types.map((u) => `${u.bhk}BHK`))].join(' / ')
  const statusLabel =
    project.status === 'ready_to_move' ? 'Ready to Move'
    : project.status === 'new_launch' ? 'New Launch'
    : 'Under Construction'

  const lines = [
    `Hi! I'm interested in *${project.name}* by ${project.builder.name} in ${project.sector}, Noida.`,
    ``,
    `Configuration: ${bhkList}`,
    `Price: ${project.price_range_label}`,
    `Status: ${statusLabel}`,
    ...(project.rera_number ? [`RERA: ${project.rera_number}`] : []),
    ``,
    `Could you help me with more details and a site visit?`,
  ]

  return `https://wa.me/${number}?text=${encodeURIComponent(lines.join('\n'))}`
}

const SECTION_TABS = ['Overview', 'Units', 'Amenities', 'Builder'] as const
type Tab = typeof SECTION_TABS[number]

export default function ProjectDetailPanel({ project, onClose }: Props) {
  const [detail, setDetail] = useState<ProjectDetail | null>(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<Tab>('Overview')
  const [imgIdx, setImgIdx] = useState(0)

  useEffect(() => {
    if (!project) { setDetail(null); return }
    setLoading(true)
    setActiveTab('Overview')
    setImgIdx(0)
    fetch(`${API_BASE}/projects/${project.slug}`)
      .then((r) => r.json())
      .then((data) => setDetail(data.project ?? null))
      .catch(() => setDetail(null))
      .finally(() => setLoading(false))
  }, [project?.slug])

  const isOpen = !!project

  const heroImages = detail?.images?.filter((i) => i.type === 'hero' || i.type === 'exterior') ?? []
  const allImages  = detail?.images ?? []
  const currentImg = allImages[imgIdx]?.url ?? project?.hero_image_url

  const d = detail ?? project

  const isRTM = d?.status === 'ready_to_move'
  const isNew = d?.status === 'new_launch'

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40"
            onClick={onClose}
          />

          {/* Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed right-0 top-0 h-full w-full sm:w-[600px] lg:w-[680px] xl:w-[720px] bg-[#fafafa] shadow-2xl z-50 flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="relative flex-shrink-0">
              {/* Hero image */}
              <div className="relative h-72 bg-gray-100 overflow-hidden">
                {currentImg ? (
                  <Image src={currentImg} alt={d?.name ?? ''} fill unoptimized className="object-cover" sizes="600px" />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
                    <Building2 size={48} className="text-blue-200" />
                  </div>
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />

                {/* Image carousel dots */}
                {allImages.length > 1 && (
                  <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                    {allImages.map((_, i) => (
                      <button
                        key={i}
                        onClick={() => setImgIdx(i)}
                        className={`w-1.5 h-1.5 rounded-full transition-all ${i === imgIdx ? 'bg-white w-4' : 'bg-white/40'}`}
                      />
                    ))}
                  </div>
                )}

                {/* Status */}
                <div className={`absolute top-3 left-3 flex items-center gap-1 text-[10px] font-bold px-2 py-1 rounded-lg backdrop-blur-sm ${
                  isRTM ? 'bg-emerald-500/90 text-white' : isNew ? 'bg-blue-500/90 text-white' : 'bg-amber-500/90 text-white'
                }`}>
                  {isRTM ? <CheckCircle2 size={10} /> : <Clock size={10} />}
                  {isRTM ? 'Ready to Move' : isNew ? 'New Launch' : 'Under Construction'}
                </div>

                {d?.rera_number && (() => {
                  const reraUrl = d?.rera_url ?? null
                  const content = (
                    <>
                      <Shield size={10} />
                      RERA {d.rera_number}
                      {reraUrl && <ExternalLink size={8} className="ml-0.5 opacity-80" />}
                    </>
                  )
                  return reraUrl ? (
                    <a
                      href={reraUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="absolute top-3 right-12 flex items-center gap-1 text-[10px] font-bold text-white bg-blue-600/90 backdrop-blur-sm px-2 py-1 rounded-lg hover:bg-blue-500/90 transition-colors cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    >
                      {content}
                    </a>
                  ) : (
                    <div className="absolute top-3 right-12 flex items-center gap-1 text-[10px] font-bold text-white bg-blue-600/90 backdrop-blur-sm px-2 py-1 rounded-lg">
                      {content}
                    </div>
                  )
                })()}

                {/* Close */}
                <button
                  onClick={onClose}
                  className="absolute top-3 right-3 w-8 h-8 bg-black/40 hover:bg-black/60 backdrop-blur-sm rounded-full flex items-center justify-center text-white transition-colors"
                >
                  <X size={16} />
                </button>
              </div>

              {/* Name bar */}
              <div className="px-5 pt-4 pb-3 border-b border-gray-100">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-xl font-black text-gray-900 tracking-tight">{d?.name}</h2>
                    {d?.tagline && <p className="text-[12px] text-blue-600 font-semibold mt-0.5">{d.tagline}</p>}
                    <div className="flex items-center gap-1.5 mt-1 text-[11px] text-gray-400">
                      <MapPin size={11} className="text-gray-300" />
                      {d?.builder.name} · {d?.sector}, {d?.city}
                    </div>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[22px] font-black text-gray-900 tracking-tight leading-none">{d?.price_range_label}</p>
                    <p className="text-[11px] text-gray-400 mt-0.5">{[...new Set(d?.unit_types.map((u) => `${u.bhk}BHK`))].join(' · ')}</p>
                  </div>
                </div>

                {/* Tabs */}
                <div className="flex gap-0.5 mt-4 bg-gray-100 rounded-xl p-1">
                  {SECTION_TABS.map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`flex-1 py-1.5 text-[11px] font-semibold rounded-lg transition-all ${
                        activeTab === tab ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-400 hover:text-gray-700'
                      }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Body — scrollable */}
            <div className="flex-1 overflow-y-auto bg-[#fafafa]">
              {loading && (
                <div className="flex items-center justify-center py-20">
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                </div>
              )}

              {!loading && activeTab === 'Overview' && (
                <div className="p-5 space-y-6">
                  {/* Key stats */}
                  <div className="grid grid-cols-3 gap-3.5">
                    {[
                      { label: 'Towers', value: d?.total_towers ? `${d.total_towers}` : '—' },
                      { label: 'Units', value: (detail?.total_units ?? (d as any)?.total_units) ? `${(detail?.total_units ?? (d as any)?.total_units)}` : '—' },
                      { label: 'Land', value: d?.land_area_acres ? `${d.land_area_acres} Ac` : '—' },
                    ].map((s) => (
                      <div key={s.label} className="bg-white rounded-2xl p-4 text-center border border-gray-100 shadow-sm">
                        <p className="text-[20px] font-black text-gray-900">{s.value}</p>
                        <p className="text-[10px] text-gray-400 font-semibold mt-0.5 uppercase tracking-wider">{s.label}</p>
                      </div>
                    ))}
                  </div>

                  {/* Design team */}
                  {(d?.architect || d?.interior_designer) && (
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Design Team</p>
                      <div className="flex flex-wrap gap-2">
                        {d.architect && (
                          <span className="flex items-center gap-1.5 bg-indigo-50 text-indigo-700 text-[11px] font-semibold px-3 py-1.5 rounded-full border border-indigo-100">
                            <Sparkles size={11} />
                            {d.architect} (Architect)
                          </span>
                        )}
                        {d.interior_designer && (
                          <span className="flex items-center gap-1.5 bg-purple-50 text-purple-700 text-[11px] font-semibold px-3 py-1.5 rounded-full border border-purple-100">
                            <Star size={11} />
                            {d.interior_designer} (Interior)
                          </span>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Description */}
                  {(detail?.long_description ?? project?.tagline) && (
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">About</p>
                      <p className="text-[13px] text-gray-600 leading-relaxed">
                        {detail?.long_description ?? project?.tagline}
                      </p>
                    </div>
                  )}

                  {/* Connectivity */}
                  {(detail?.all_connectivity ?? d?.top_connectivity ?? []).length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Connectivity</p>
                      <div className="space-y-2">
                        {(detail?.all_connectivity ?? d?.top_connectivity ?? []).map((c: any) => {
                          const Icon = CONN_ICONS[c.type] ?? Path
                          return (
                            <div key={c.name} className="flex items-center gap-3 text-[12px] text-gray-600 py-1.5 border-b border-gray-50 last:border-0">
                              <div className="w-7 h-7 rounded-lg bg-blue-50 flex items-center justify-center flex-shrink-0">
                                <Icon size={14} weight="duotone" className="text-blue-500" />
                              </div>
                              <span className="flex-1">{c.name}</span>
                              {c.distance_km && <span className="text-gray-400 text-[11px]">{c.distance_km} km</span>}
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )}

                  {/* USPs */}
                  {(detail?.marketing_claims ?? (d as any)?.marketing_claims ?? []).length > 0 && (
                    <div>
                      <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Key Highlights</p>
                      <div className="flex flex-wrap gap-1.5">
                        {(detail?.marketing_claims ?? (d as any)?.marketing_claims ?? []).map((c: string) => (
                          <span key={c} className="flex items-center gap-1 text-[11px] text-blue-700 bg-blue-50 border border-blue-100 px-2.5 py-1 rounded-full font-medium">
                            <ChevronRight size={10} />
                            {c}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {!loading && activeTab === 'Units' && (
                <div className="p-5 space-y-4">
                  <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Unit Configurations</p>

                  {(d?.unit_types ?? []).map((u, i) => (
                    <div key={i} className="border border-gray-100 rounded-2xl overflow-hidden bg-white shadow-sm">
                      <div className="bg-gradient-to-r from-gray-50 to-blue-50/30 px-5 py-3 flex items-center justify-between border-b border-gray-100">
                        <span className="text-[13px] font-bold text-gray-900">{u.name}</span>
                        <span className="text-[13px] font-black text-blue-600">
                          {u.price_label ?? (u.price_min_cr != null && u.price_max_cr != null
                            ? u.price_min_cr === u.price_max_cr
                              ? `₹${u.price_min_cr.toFixed(2)} Cr`
                              : `₹${u.price_min_cr.toFixed(2)} – ${u.price_max_cr.toFixed(2)} Cr`
                            : 'Price on request')}
                        </span>
                      </div>
                      <div className="px-5 py-4 grid grid-cols-2 gap-3">
                        <div className="flex items-center gap-2 text-[12px] text-gray-600">
                          <BedDouble size={14} className="text-gray-400" />
                          <span>{u.bhk} Bedrooms</span>
                        </div>
                        {u.super_area_sqft && (
                          <div className="flex items-center gap-2 text-[12px] text-gray-600">
                            <Ruler size={14} className="text-gray-400" />
                            <span>{u.super_area_sqft.toLocaleString()} sqft super</span>
                          </div>
                        )}
                        {u.carpet_area_sqft && (
                          <div className="flex items-center gap-2 text-[12px] text-gray-600">
                            <Layers size={14} className="text-gray-400" />
                            <span>{u.carpet_area_sqft.toLocaleString()} sqft carpet</span>
                          </div>
                        )}
                      </div>

                      {/* Floor plan placeholder */}
                      <div className="mx-5 mb-5 rounded-2xl bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/30 border border-dashed border-blue-100 h-44 flex flex-col items-center justify-center gap-2">
                        <Layers size={24} className="text-gray-300" />
                        <p className="text-[11px] text-gray-400 font-medium">Floor Plan</p>
                        <p className="text-[10px] text-gray-300">Image coming soon</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {!loading && activeTab === 'Amenities' && (
                <div className="p-5">
                  {Object.entries(
                    ((detail?.all_amenities ?? d?.top_amenities ?? []) as { name: string; category: string }[]).reduce(
                      (acc, a) => { (acc[a.category] = acc[a.category] ?? []).push(a.name); return acc },
                      {} as Record<string, string[]>
                    )
                  ).map(([cat, names]) => {
                    const Icon = AMENITY_ICONS[cat] ?? Buildings
                    const colorClass = AMENITY_COLORS[cat] ?? 'bg-gray-50 text-gray-600 border-gray-100'
                    const catLabel = cat.charAt(0).toUpperCase() + cat.slice(1)
                    return (
                      <div key={cat} className="mb-6">
                        <div className="flex items-center gap-2 mb-3">
                          <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${colorClass}`}>
                            <Icon size={13} weight="duotone" />
                          </div>
                          <p className="text-[12px] font-bold text-gray-700 uppercase tracking-wider">{catLabel}</p>
                        </div>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                          {(names as string[]).map((name: string) => (
                            <AmenityIcon key={name} amenity={name} size="md" showLabel={true} />
                          ))}
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}

              {!loading && activeTab === 'Builder' && (() => {
                const b = detail?.builder_detail
                if (!b) return (
                  <div className="p-5 text-center text-gray-400 text-sm py-20">Loading builder details...</div>
                )
                return (
                  <div className="p-5 space-y-5">
                    {/* Builder header */}
                    <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-4 border border-blue-100">
                      <h3 className="text-[18px] font-black text-gray-900">{b.name}</h3>
                      {b.tagline && <p className="text-[12px] text-blue-600 font-semibold mt-0.5">{b.tagline}</p>}
                      {b.description && <p className="text-[12px] text-gray-600 mt-2 leading-relaxed">{b.description}</p>}
                    </div>

                    {/* Stats */}
                    <div className="grid grid-cols-2 gap-3">
                      {b.founded_year && (
                        <div className="bg-gray-50 rounded-xl p-3">
                          <p className="text-[18px] font-black text-gray-900">{b.founded_year}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">Founded</p>
                        </div>
                      )}
                      {b.delivered_units && (
                        <div className="bg-gray-50 rounded-xl p-3">
                          <p className="text-[18px] font-black text-gray-900">{b.delivered_units.toLocaleString()}+</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">Delivered Units</p>
                        </div>
                      )}
                      {b.headquarters && (
                        <div className="bg-gray-50 rounded-xl p-3">
                          <p className="text-[14px] font-bold text-gray-900">{b.headquarters}</p>
                          <p className="text-[10px] text-gray-400 mt-0.5">Headquarters</p>
                        </div>
                      )}
                      {b.credai_member && (
                        <div className="bg-green-50 rounded-xl p-3 border border-green-100">
                          <div className="flex items-center gap-1.5">
                            <SealCheck size={16} weight="duotone" className="text-green-600" />
                            <p className="text-[13px] font-bold text-green-700">CREDAI Member</p>
                          </div>
                          <p className="text-[10px] text-green-600 mt-0.5">Verified Developer</p>
                        </div>
                      )}
                    </div>

                    {/* Awards */}
                    {b.awards.length > 0 && (
                      <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Awards</p>
                        <div className="space-y-1.5">
                          {b.awards.map((a) => (
                            <div key={a} className="flex items-center gap-2 text-[12px] text-gray-700">
                              <Trophy size={13} className="text-amber-500 flex-shrink-0" />
                              {a}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Delivered projects */}
                    {b.delivered_projects.length > 0 && (
                      <div>
                        <p className="text-[11px] font-bold text-gray-400 uppercase tracking-wider mb-2">Delivered Projects</p>
                        <div className="flex flex-wrap gap-1.5">
                          {b.delivered_projects.map((p) => (
                            <span key={p} className="text-[11px] text-green-700 bg-green-50 border border-green-100 px-2.5 py-1 rounded-full font-medium">
                              {p}
                            </span>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Website */}
                    {b.website && (
                      <a
                        href={b.website}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between bg-blue-50 hover:bg-blue-100 border border-blue-100 rounded-xl px-4 py-3 transition-colors group"
                      >
                        <span className="text-[12px] font-semibold text-blue-700">Visit Builder Website</span>
                        <ExternalLink size={14} className="text-blue-400 group-hover:text-blue-600 transition-colors" />
                      </a>
                    )}
                  </div>
                )
              })()}
            </div>

            {/* Footer CTA */}
            <div className="flex-shrink-0 border-t border-gray-100 p-4 bg-white">
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    window.dispatchEvent(new CustomEvent('realtypals:ask-ai', {
                      detail: { text: `I want to schedule a site visit for ${d?.name}` },
                    }))
                    onClose()
                  }}
                  className="flex-1 bg-blue-600 hover:bg-blue-500 active:bg-blue-700 text-white font-bold py-4 rounded-2xl text-[14px] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-blue-600/20"
                >
                  <MapTrifold size={16} weight="duotone" />
                  Request Site Visit
                </button>

                {(() => {
                  const waUrl = d ? buildWhatsAppUrl(d as any) : null
                  return waUrl ? (
                    <a
                      href={waUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex-1 bg-[#25D366] hover:bg-[#1da851] text-white font-bold py-4 rounded-2xl text-[14px] transition-colors flex items-center justify-center gap-2 shadow-lg shadow-green-500/20"
                    >
                      <WhatsAppIcon size={16} />
                      WhatsApp Us
                    </a>
                  ) : null
                })()}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
