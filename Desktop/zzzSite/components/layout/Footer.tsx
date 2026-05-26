import Link from 'next/link'
import Image from 'next/image'
import { Share2, Mail, Phone, MapPin } from 'lucide-react'

const quickLinks = [
  { label: 'Home', href: '/' },
  { label: 'Products', href: '/products' },
  { label: 'Blog', href: '/blog' },
  { label: 'About Us', href: '/#about' },
  { label: 'Contact', href: '/#contact' },
]

const categories = [
  { label: 'Sports Equipment', href: '/products?category=sports' },
  { label: 'Fitness & Wellness', href: '/products?category=fitness' },
  { label: 'Musical Instruments', href: '/products?category=music' },
  { label: 'Awards & Trophies', href: '/products?category=awards' },
]

export function Footer() {
  return (
    <footer className="bg-deep border-t border-gold/10">
      <div className="mx-auto max-w-7xl section-padding">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand column */}
          <div className="lg:col-span-1">
            <Image
              src="/mdfLogoWtext.webp"
              alt="MDF Enterprises"
              width={130}
              height={44}
              className="h-11 w-auto object-contain mb-5"
            />
            <p className="text-white/50 text-sm leading-relaxed mb-6">
              Excellence across sports, fitness, music, and recognition. Trusted by institutions and individuals across India.
            </p>
            <div className="flex gap-4">
              {[
                { icon: Share2, href: '#', label: 'Instagram' },
                { icon: Share2, href: '#', label: 'LinkedIn' },
                { icon: Share2, href: '#', label: 'Facebook' },
              ].map(({ icon: Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-9 h-9 border border-gold/20 rounded-sm flex items-center justify-center text-gold/50 hover:text-gold hover:border-gold/60 transition-colors duration-200"
                >
                  <Icon size={15} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick links */}
          <div>
            <p className="label-gold mb-5">Quick Links</p>
            <ul className="space-y-3">
              {quickLinks.map(link => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-white/50 text-sm hover:text-gold transition-colors duration-200"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Categories */}
          <div>
            <p className="label-gold mb-5">Categories</p>
            <ul className="space-y-3">
              {categories.map(cat => (
                <li key={cat.href}>
                  <Link
                    href={cat.href}
                    className="text-white/50 text-sm hover:text-gold transition-colors duration-200"
                  >
                    {cat.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <p className="label-gold mb-5">Contact</p>
            <ul className="space-y-4">
              {[
                { icon: MapPin, text: 'New Delhi, India' },
                { icon: Phone, text: '+91 98765 43210' },
                { icon: Mail, text: 'info@mdfenterprises.in' },
              ].map(({ icon: Icon, text }) => (
                <li key={text} className="flex items-start gap-3 text-white/50 text-sm">
                  <Icon size={14} className="text-gold/60 mt-0.5 shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-gold/10 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-white/30 text-xs tracking-wider">
            © {new Date().getFullYear()} MDF Enterprises. All rights reserved.
          </p>
          <p className="text-white/20 text-xs">
            Sports · Fitness · Music · Awards
          </p>
        </div>
      </div>
    </footer>
  )
}
