import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { Toaster } from "sonner";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  display: "swap",
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "MDF Enterprises — Sports · Fitness · Music · Awards",
  description: "Premium sports equipment, fitness gear, musical instruments, and awards. Trusted by institutions and individuals across India.",
  icons: {
    icon: "/mdfFavicon.png",
    apple: "/mdfFavicon.png",
  },
  openGraph: {
    title: "MDF Enterprises",
    description: "Where Excellence Meets Every Domain",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="bg-deep text-white font-body antialiased min-h-full flex flex-col">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <Toaster theme="dark" toastOptions={{ style: { background: '#0d1f4a', border: '1px solid rgba(201,162,39,0.2)', color: '#fff' } }} />
      </body>
    </html>
  );
}
