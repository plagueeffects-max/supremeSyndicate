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
      <div className="border-t border-[#e5e5e5] pt-10" />

      <div className="md:grid md:grid-cols-2 gap-12">
        <div>
          <p className="text-sm text-[#777169] mb-4">Our Story</p>
          <h2 className="font-display text-[36px] md:text-[48px] leading-[1.1] font-light text-[#000] mb-6">
            Founded in 1997. Built for institutions.
          </h2>
          <p className="text-sm text-[#777169] leading-relaxed mb-4">
            MDF Enterprises was established in 1997 by Mr. Syed Mumtaz with a single goal: reliable, institutional-grade supply across Kashmir. For over 25 years, we have served schools, colleges, universities, and government bodies with premium products and dependable service.
          </p>
          <p className="text-sm text-[#777169] leading-relaxed mb-4">
            From sports infrastructure to fitness centres, musical instruments to award ceremonies — we handle the complete supply chain so your institution can focus on what matters.
          </p>
        </div>

        <div>
          <p className="text-sm text-[#777169] mb-4">What We Do</p>
          <div className="flex flex-wrap gap-3">
            {SERVICES.map((service) => (
              <span
                key={service}
                className="px-4 py-2 rounded-full border border-[#e5e5e5] text-sm text-[#000] bg-[#fff]"
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
