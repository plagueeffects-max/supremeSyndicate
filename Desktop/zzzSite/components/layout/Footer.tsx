import Link from 'next/link'
import Image from 'next/image'

const productLinks = [
  { label: 'Sports Goods', href: '/products?category=sports' },
  { label: 'Fitness & Wellness', href: '/products?category=fitness' },
  { label: 'Musical Instruments', href: '/products?category=music' },
  { label: 'Awards & Trophies', href: '/products?category=awards' },
]
const companyLinks = [
  { label: 'About Us', href: '/#about' },
  { label: 'Our Process', href: '/#process' },
  { label: 'Portfolio', href: '/#portfolio' },
  { label: 'Blog', href: '/blog' },
]
const serviceLinks = [
  { label: 'Supply', href: '/#who-we-serve' },
  { label: 'Installation', href: '/#who-we-serve' },
  { label: 'Annual Maintenance', href: '/#who-we-serve' },
  { label: 'GeM Orders', href: '/#who-we-serve' },
]

export function Footer() {
  return (
    <footer className="bg-[#050505] border-t border-white/[0.06]">
      <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-16 md:py-20">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-12">

          {/* Brand column */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex flex-col select-none mb-6 w-fit">
              <span className="text-[36px] font-bold text-white tracking-tight leading-none" style={{ fontFamily: 'var(--font-cormorant), serif' }}>
                MDF
              </span>
              <span className="text-[9px] font-bold text-white tracking-[0.3em] uppercase leading-none mt-1">ENTERPRISES</span>
              <span className="text-[8px] font-bold text-[#C89B5E] tracking-[0.25em] uppercase leading-none mt-0.5">SINCE 2006</span>
            </Link>
            <p className="text-white/40 text-[13px] leading-relaxed mb-6 max-w-[260px]">
              One-stop supplier of sports goods, fitness equipment, musical instruments and awards. Supply · Installation · Service.
            </p>
            <div className="flex items-center gap-4">
              <Image src="/assets/gemLogo.webp" alt="GeM Registered" width={56} height={22} className="h-7 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity" style={{ width: 'auto' }} />
              <Image src="/assets/msmeLogo.webp" alt="MSME Registered" width={56} height={22} className="h-7 w-auto object-contain opacity-60 hover:opacity-100 transition-opacity" style={{ width: 'auto' }} />
              <span className="text-[9px] font-bold text-white/30 tracking-[0.2em] uppercase">Est. 2006</span>
            </div>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-[#C89B5E] tracking-[0.2em] uppercase mb-5">Products</h4>
            <ul className="flex flex-col gap-3">
              {productLinks.map(l => (
                <li key={l.href}><Link href={l.href} className="text-[13px] text-white/40 hover:text-white transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-[#C89B5E] tracking-[0.2em] uppercase mb-5">Company</h4>
            <ul className="flex flex-col gap-3">
              {companyLinks.map(l => (
                <li key={l.href}><Link href={l.href} className="text-[13px] text-white/40 hover:text-white transition-colors">{l.label}</Link></li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-[10px] font-bold text-[#C89B5E] tracking-[0.2em] uppercase mb-5">Services</h4>
            <ul className="flex flex-col gap-3">
              {serviceLinks.map(l => (
                <li key={l.href}><Link href={l.href} className="text-[13px] text-white/40 hover:text-white transition-colors">{l.label}</Link></li>
              ))}
            </ul>
            <div className="mt-8">
              <h4 className="text-[10px] font-bold text-[#C89B5E] tracking-[0.2em] uppercase mb-4">Contact</h4>
              <address className="not-italic text-[12px] text-white/40 leading-relaxed">
                Srinagar, Jammu & Kashmir<br />
                India — 190001<br />
                <a href="tel:+917006252334" className="hover:text-white transition-colors">+91 70062 52334</a>
              </address>
            </div>
          </div>

        </div>
      </div>

      <div className="border-t border-white/[0.04]">
        <div className="max-w-[1440px] mx-auto px-6 md:px-12 py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/25">© {new Date().getFullYear()} MDF Enterprises. All rights reserved.</p>
          <p className="text-[11px] text-white/20">One Stop. Every Need.</p>
        </div>
      </div>
    </footer>
  )
}
