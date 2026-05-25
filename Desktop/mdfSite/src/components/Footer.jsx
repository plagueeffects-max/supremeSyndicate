const NAV_LINKS = [
  { label: 'Products', href: '#categories' },
  { label: 'Clients', href: '#clients' },
  { label: 'About', href: '#about' },
  { label: 'Contact', href: '#contact' },
]

export default function Footer() {
  return (
    <footer className="border-t border-[#e5e5e5] bg-[#fdfcfc]">
      <div className="max-w-[1200px] mx-auto px-6 py-10 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Logo */}
        <img src="/assets/mdfLogoWtext.webp" alt="MDF Enterprises" className="h-8 w-auto" />

        {/* Nav links */}
        <nav aria-label="Footer navigation">
          <ul className="flex items-center gap-6 list-none m-0 p-0">
            {NAV_LINKS.map(({ label, href }) => (
              <li key={label}>
                <a href={href} className="text-sm text-[#777169] no-underline hover:text-[#000] transition-colors duration-150">
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </nav>

        {/* Copyright */}
        <p className="text-sm text-[#777169] m-0">
          © 2025 MDF Enterprises · Kashmir
        </p>
      </div>
    </footer>
  )
}
