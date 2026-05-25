const BRANDS = [
  { src: '/assets/brands/yonexLogo.webp',   alt: 'Yonex' },
  { src: '/assets/brands/stagLogo.webp',    alt: 'Stag' },
  { src: '/assets/brands/sslogo.webp',      alt: 'SS' },
  { src: '/assets/brands/spartanLogo.webp', alt: 'Spartan' },
  { src: '/assets/brands/sgLogo.webp',      alt: 'SG' },
  { src: '/assets/brands/niviaLogo.webp',   alt: 'Nivia' },
  { src: '/assets/brands/netcoLogo.webp',   alt: 'Netco' },
  { src: '/assets/brands/jonexLogo.webp',   alt: 'Jonex' },
  { src: '/assets/brands/coscoLogo.webp',   alt: 'Cosco' },
]

export default function BrandsMarquee() {
  return (
    <section className="pb-[96px]">
      <p className="text-sm text-[#777169] text-center mb-6">Brands We Carry</p>

      <div className="border-t border-b border-[#e5e5e5] py-6 overflow-hidden">
        {/*
          Two identical sets of logos placed side by side.
          CSS animation scrolls the whole track left by 50% (= one full set width),
          then loops back to start — creating a seamless infinite scroll.
        */}
        <div className="flex gap-12 marquee-track w-max">
          {[...BRANDS, ...BRANDS].map(({ src, alt }, i) => (
            <img
              key={`${alt}-${i}`}
              src={src}
              alt={alt}
              className="h-7 w-auto flex-shrink-0 grayscale opacity-50"
            />
          ))}
        </div>
      </div>
    </section>
  )
}
