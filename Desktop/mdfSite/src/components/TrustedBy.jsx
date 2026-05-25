const CLIENTS = [
  { src: '/assets/clients/crpfLogo.webp',       alt: 'CRPF' },
  { src: '/assets/clients/kuLogo.webp',          alt: 'Kashmir University' },
  { src: '/assets/clients/dsekLogo.webp',        alt: 'DSEK' },
  { src: '/assets/clients/dyssLogo.webp',        alt: 'DYSS' },
  { src: '/assets/clients/skaustLogo.webp',      alt: 'SKAUST' },
  { src: '/assets/clients/gmcLogo.webp',         alt: 'GMC' },
  { src: '/assets/clients/jkpLogo.webp',         alt: 'JKP' },
  { src: '/assets/clients/clusterUniLogo.webp',  alt: 'Cluster University' },
]

export default function TrustedBy() {
  return (
    <section id="clients" className="max-w-[1200px] mx-auto px-6 pb-[96px]">
      <div className="border-t border-[#e5e5e5] pt-10 mb-10">
        <div className="flex items-end justify-between gap-4 flex-wrap">
          <div>
            <p className="text-[11px] text-[#777169] uppercase tracking-[0.2em] mb-3">Trusted By</p>
            <h2 className="font-display text-[32px] md:text-[44px] font-light text-[#000] leading-[1.1] m-0">
              Leading institutions<br className="hidden md:block" /> across Kashmir.
            </h2>
          </div>
          <a
            href="https://wa.me/917006252334"
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm text-[#000] font-medium px-5 py-2.5 rounded-full border border-[#e5e5e5] bg-[#fff] no-underline hover:bg-[#f5f3f1] transition-colors duration-150 flex-shrink-0"
          >
            Get in Touch
          </a>
        </div>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-10 md:gap-14">
        {CLIENTS.map(({ src, alt }) => (
          <img
            key={alt}
            src={src}
            alt={alt}
            className="h-9 w-auto grayscale opacity-50 hover:opacity-75 transition-opacity duration-200"
          />
        ))}
      </div>
    </section>
  )
}
