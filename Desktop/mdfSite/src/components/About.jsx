const STATS = [
  { value: '25+', label: 'Years' },
  { value: '100+', label: 'Institutions' },
  { value: '9', label: 'Brands' },
]

const SERVICES = [
  'Supply & Procurement',
  'Installation Services',
  'Gym Setup',
  'Sports Infrastructure',
  'Trophy Customization',
  'Institutional Procurement',
]

export default function About() {
  return (
    <section id="about" className="max-w-[1200px] mx-auto px-6 pb-[96px]">
      <div className="border-t border-[#e5e5e5] pt-10 mb-12" />

      <div className="md:grid md:grid-cols-2 gap-16">

        {/* Left — story */}
        <div>
          <p className="text-[11px] text-[#777169] uppercase tracking-[0.2em] mb-6">Our Story</p>
          <h2 className="font-display text-[36px] md:text-[52px] leading-[1.05] font-light text-[#000] mb-8">
            Founded in 1997.<br />Built for institutions.
          </h2>
          <p className="text-sm text-[#777169] leading-[1.75] mb-5">
            MDF Enterprises was established in 1997 by Mr. Syed Mumtaz with a single goal: reliable, institutional-grade supply across Kashmir. For over 25 years, we have served schools, colleges, universities, and government bodies with premium products and dependable service.
          </p>
          <p className="text-sm text-[#777169] leading-[1.75]">
            From sports infrastructure to fitness centres, musical instruments to award ceremonies — we handle the complete supply chain so your institution can focus on what matters.
          </p>
        </div>

        {/* Right — stats + services */}
        <div>
          {/* Large stat numbers */}
          <div className="grid grid-cols-3 gap-4 mb-8 pb-8 border-b border-[#e5e5e5]">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="font-display text-[48px] md:text-[56px] leading-none font-light text-[#000] mb-2">{value}</p>
                <p className="text-[10px] text-[#b1b0b0] uppercase tracking-[0.15em]">{label}</p>
              </div>
            ))}
          </div>

          {/* Service pills */}
          <p className="text-[11px] text-[#777169] uppercase tracking-[0.2em] mb-4">What We Do</p>
          <div className="flex flex-wrap gap-2">
            {SERVICES.map((service) => (
              <span
                key={service}
                className="px-4 py-2 rounded-full border border-[#e5e5e5] text-sm text-[#000] bg-[#fff] hover:bg-[#f5f3f1] transition-colors duration-150"
              >
                {service}
              </span>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}
