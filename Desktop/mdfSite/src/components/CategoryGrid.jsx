const CATEGORIES = [
  {
    src: '/assets/sportsGoods.webp',
    alt: 'Sports equipment',
    label: 'Sports Equipment',
    large: true,
  },
  { src: '/assets/fitness.webp', alt: 'Fitness equipment', label: 'Fitness & Wellness' },
  { src: '/assets/music.webp',   alt: 'Musical instruments', label: 'Musical Instruments' },
  { src: '/assets/awards.webp',  alt: 'Awards and trophies', label: 'Awards & Trophies' },
]

export default function CategoryGrid() {
  return (
    <section id="categories" className="max-w-[1200px] mx-auto px-6 pb-[96px]">
      <p className="text-sm text-[#777169] mb-6">What We Supply</p>

      <div
        className="grid gap-2 category-grid"
        style={{ gridTemplateColumns: '1.5fr 1fr 1fr', gridTemplateRows: '280px 280px' }}
      >
        {/* Large sports card — col 1, spans both rows */}
        <div
          className="row-span-2 relative rounded-[16px] overflow-hidden"
          style={{ boxShadow: 'rgba(0,0,0,0.4) 0px 0px 1px 0px, rgba(0,0,0,0.04) 0px 2px 4px' }}
        >
          <img src="/assets/sportsGoods.webp" alt="Sports equipment" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <span className="absolute bottom-4 left-4 text-white text-sm font-medium">
            Sports Equipment
          </span>
        </div>

        {/* Fitness — col 2 row 1 */}
        <div
          className="relative rounded-[16px] overflow-hidden"
          style={{ boxShadow: 'rgba(0,0,0,0.4) 0px 0px 1px 0px, rgba(0,0,0,0.04) 0px 2px 4px' }}
        >
          <img src="/assets/fitness.webp" alt="Fitness equipment" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <span className="absolute bottom-4 left-4 text-white text-sm font-medium">Fitness & Wellness</span>
        </div>

        {/* Music — col 3 row 1 */}
        <div
          className="relative rounded-[16px] overflow-hidden"
          style={{ boxShadow: 'rgba(0,0,0,0.4) 0px 0px 1px 0px, rgba(0,0,0,0.04) 0px 2px 4px' }}
        >
          <img src="/assets/music.webp" alt="Musical instruments" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <span className="absolute bottom-4 left-4 text-white text-sm font-medium">Musical Instruments</span>
        </div>

        {/* Awards — col 2 row 2 */}
        <div
          className="relative rounded-[16px] overflow-hidden"
          style={{ boxShadow: 'rgba(0,0,0,0.4) 0px 0px 1px 0px, rgba(0,0,0,0.04) 0px 2px 4px' }}
        >
          <img src="/assets/awards.webp" alt="Awards and trophies" className="w-full h-full object-cover" />
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <span className="absolute bottom-4 left-4 text-white text-sm font-medium">Awards & Trophies</span>
        </div>

        {/* Institutional Supply — text card, col 3 row 2 */}
        <div
          className="rounded-[16px] bg-[#f5f3f1] p-6 flex flex-col justify-between"
          style={{ boxShadow: 'rgba(0,0,0,0.075) 0px 0px 0px 0.5px inset' }}
        >
          <div>
            <p className="text-xs text-[#777169] uppercase tracking-widest mb-3">Service</p>
            <h3 className="font-display text-xl font-light text-[#000] m-0 mb-3">
              Institutional Supply
            </h3>
            <p className="text-sm text-[#777169] leading-relaxed m-0">
              Full-scale procurement for schools, colleges & government bodies across Kashmir.
            </p>
          </div>
          <a
            href="https://wa.me/917006252334"
            target="_blank"
            rel="noopener noreferrer"
            className="mt-4 text-sm text-[#000] font-medium no-underline inline-flex items-center gap-1 hover:gap-2 transition-all duration-150"
          >
            Enquire →
          </a>
        </div>
      </div>
    </section>
  )
}
