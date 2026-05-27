import { InfiniteMarquee } from '@/components/ui/InfiniteMarquee'

const items = [
  'GeM Registered Supplier',
  'MSME Certified Enterprise',
  'Est. 2006 · 18+ Years',
  '1000+ Institutions Served',
  'Pan India Delivery',
  '500+ Installations',
  'COSCO · NIVIA · YAMAHA · YONEX',
  'Sports · Fitness · Music · Awards',
]

export function TrustMarquee() {
  return (
    <div className="w-full bg-[#0a0a0a] border-y border-white/[0.05] py-4 overflow-hidden">
      <InfiniteMarquee speed={40} pauseOnHover>
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-6 px-8">
            <span className="text-[11px] font-bold tracking-[0.18em] uppercase text-white/40 whitespace-nowrap">
              {item}
            </span>
            <span className="w-1 h-1 rounded-full bg-[#C89B5E]/50 flex-shrink-0" aria-hidden />
          </span>
        ))}
      </InfiniteMarquee>
    </div>
  )
}
