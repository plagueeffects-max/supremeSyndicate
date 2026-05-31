'use client'

import type { ProjectCard } from '@/types/project'
import { SealCheck, CheckCircle, Clock } from '@phosphor-icons/react'

interface Props {
  left: ProjectCard
  right: ProjectCard
}

const statusLabel = (s: ProjectCard['status']) =>
  s === 'ready_to_move' ? 'Ready to Move' : s === 'new_launch' ? 'New Launch' : 'Under Construction'

const statusColor = (s: ProjectCard['status']) =>
  s === 'ready_to_move' ? 'text-emerald-600' : s === 'new_launch' ? 'text-blue-600' : 'text-amber-600'

function Row({ label, left, right, highlight }: {
  label: string
  left: React.ReactNode
  right: React.ReactNode
  highlight?: boolean
}) {
  return (
    <tr className={highlight ? 'bg-blue-50/40' : 'bg-white'}>
      <td className="py-2.5 px-3 text-[10px] font-bold text-gray-400 uppercase tracking-wider border-r border-gray-100 w-24 align-top">{label}</td>
      <td className="py-2.5 px-4 text-[12px] text-gray-800 border-r border-gray-100">{left}</td>
      <td className="py-2.5 px-4 text-[12px] text-gray-800">{right}</td>
    </tr>
  )
}

export default function ComparisonTable({ left, right }: Props) {
  const leftBhk = [...new Set(left.unit_types.map((u) => `${u.bhk}BHK`))].join(' · ')
  const rightBhk = [...new Set(right.unit_types.map((u) => `${u.bhk}BHK`))].join(' · ')

  const leftAmenities = left.top_amenities.slice(0, 3).map((a) => a.name).join(', ') || '—'
  const rightAmenities = right.top_amenities.slice(0, 3).map((a) => a.name).join(', ') || '—'

  const connStr = (p: ProjectCard) => {
    const c = p.top_connectivity[0]
    if (!c) return '—'
    return c.distance_km ? `${c.name} (${c.distance_km}km)` : c.name
  }

  return (
    <div className="mt-3 rounded-2xl border border-gray-200 overflow-hidden shadow-sm text-left">
      {/* Header row */}
      <div className="grid grid-cols-[6rem_1fr_1fr] bg-gray-900 text-white">
        <div className="py-3 px-3" />
        <div className="py-3 px-4 border-r border-white/10">
          <p className="text-[13px] font-bold leading-tight truncate">{left.name}</p>
          <p className="text-[10px] text-gray-400 mt-0.5 truncate">{left.builder.name}</p>
        </div>
        <div className="py-3 px-4">
          <p className="text-[13px] font-bold leading-tight truncate">{right.name}</p>
          <p className="text-[10px] text-gray-400 mt-0.5 truncate">{right.builder.name}</p>
        </div>
      </div>

      <table className="w-full border-collapse">
        <tbody className="divide-y divide-gray-100">
          <Row
            label="Price"
            left={<span className="font-black text-gray-900 text-[13px]">{left.price_range_label}</span>}
            right={<span className="font-black text-gray-900 text-[13px]">{right.price_range_label}</span>}
            highlight
          />
          <Row
            label="Config"
            left={leftBhk || '—'}
            right={rightBhk || '—'}
          />
          <Row
            label="Status"
            left={<span className={`font-semibold ${statusColor(left.status)}`}>{statusLabel(left.status)}</span>}
            right={<span className={`font-semibold ${statusColor(right.status)}`}>{statusLabel(right.status)}</span>}
          />
          <Row
            label="Location"
            left={left.sector}
            right={right.sector}
            highlight
          />
          <Row
            label="RERA"
            left={left.rera_number
              ? <span className="flex items-center gap-1 text-blue-600 font-medium"><SealCheck size={11} weight="fill" />{left.rera_number}</span>
              : <span className="text-gray-300">—</span>}
            right={right.rera_number
              ? <span className="flex items-center gap-1 text-blue-600 font-medium"><SealCheck size={11} weight="fill" />{right.rera_number}</span>
              : <span className="text-gray-300">—</span>}
          />
          <Row
            label="Amenities"
            left={<span className="text-gray-600 leading-relaxed">{leftAmenities}</span>}
            right={<span className="text-gray-600 leading-relaxed">{rightAmenities}</span>}
            highlight
          />
          <Row
            label="Nearest"
            left={<span className="text-gray-600">{connStr(left)}</span>}
            right={<span className="text-gray-600">{connStr(right)}</span>}
          />
          {(left.possession_label || right.possession_label) && (
            <Row
              label="Possession"
              left={<span className="text-gray-700 font-medium">{left.possession_label ?? '—'}</span>}
              right={<span className="text-gray-700 font-medium">{right.possession_label ?? '—'}</span>}
              highlight
            />
          )}
        </tbody>
      </table>
    </div>
  )
}
