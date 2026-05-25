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
      <div className="flex items-center justify-between mb-10 border-t border-[#e5e5e5] pt-10">
        <p className="text-sm text-[#777169] m-0">
          Trusted by institutions across Kashmir
        </p>
        <a
          href="https://wa.me/917006252334"
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm text-[#000] font-medium px-4 py-2 rounded-full border border-[#e5e5e5] bg-[#fff] no-underline hover:bg-[#f5f3f1] transition-colors duration-150"
        >
          Get in Touch
        </a>
      </div>

      <div className="flex flex-wrap items-center justify-center gap-8 md:gap-12">
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
