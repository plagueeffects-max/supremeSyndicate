import type { Metadata } from 'next'
import { Inter, Cormorant_Garamond } from 'next/font/google'
import './globals.css'
import { Navbar } from '@/components/layout/Navbar'
import { Footer } from '@/components/layout/Footer'
import { LenisProvider } from '@/providers/LenisProvider'
import { Toaster } from 'sonner'

const inter = Inter({
  variable: '--font-inter',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

const cormorant = Cormorant_Garamond({
  variable: '--font-cormorant',
  subsets: ['latin'],
  display: 'swap',
  weight: ['300', '400', '500', '600', '700'],
})

export const metadata: Metadata = {
  title: 'MDF Enterprises | Sports, Fitness, Music & Awards — J&K',
  description: "J&K's one-stop supplier of sports goods, fitness equipment, musical instruments and custom awards. GeM-registered, MSME-certified. Supply, installation and service.",
  icons: {
    icon: '/mdfFavicon.png',
    apple: '/mdfFavicon.png',
  },
  openGraph: {
    title: 'MDF Enterprises — One Stop. Every Need.',
    description: "J&K's one-stop supplier of sports goods, fitness equipment, musical instruments and custom awards. GeM-registered, MSME-certified.",
    type: 'website',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${cormorant.variable}`}>
      <body className="bg-[#050505] text-white antialiased min-h-screen flex flex-col">
        <LenisProvider>
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
        </LenisProvider>
        <Toaster
          theme="dark"
          toastOptions={{
            style: {
              background: '#111',
              border: '1px solid rgba(255,255,255,0.08)',
              color: '#fff',
            },
          }}
        />
      </body>
    </html>
  )
}
