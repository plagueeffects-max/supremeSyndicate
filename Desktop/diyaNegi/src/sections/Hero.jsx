// src/sections/Hero.jsx
import ScrollExpandMedia from '../components/ScrollExpandMedia'

export default function Hero() {
  return (
    <div id="home">
      <ScrollExpandMedia
        mediaType="image"
        mediaSrc="/images/myPortfolio1.webp"
        bgImageSrc="/images/thankYou2.webp"
        title="DIYA NEGI"
        date="Content Creator · Delhi"
        scrollToExpand="Scroll to explore"
        textBlend
      >
        <div className="flex flex-col items-center text-center gap-3 py-10 border-b border-white/[0.06]">
          <p className="text-[10px] tracking-[0.32em] uppercase text-white/55 font-mono">
            Lifestyle · Beauty · Fashion · Fragrance
          </p>
          <p className="text-[9px] tracking-[0.25em] uppercase text-white/35 font-mono">
            @dianegi_ · Delhi, India
          </p>
        </div>
      </ScrollExpandMedia>
    </div>
  )
}
