'use client'

export function BlogFeaturesBand() {
  return (
    <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 mb-16 mt-8">
      <div className="bg-[#F7F4EF]/60 rounded-xl px-8 py-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4 border border-[#E8DFD2]">
        
        <div className="flex items-center gap-4">
          <div className="text-[#C89B5E] shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><path d="M3.27 6.96L12 12.01l8.73-5.05"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>
          </div>
          <div>
            <div className="text-[14px] font-bold text-black mb-1">Expert Content</div>
            <div className="text-[13px] text-gray-700 font-medium">Industry professionals</div>
          </div>
        </div>

        <div className="hidden md:block w-px h-12 bg-gray-200"></div>

        <div className="flex items-center gap-4">
          <div className="text-[#C89B5E] shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><path d="M12 2a14.5 14.5 0 0 0 0 20 14.5 14.5 0 0 0 0-20"/><path d="M2 12h20"/></svg>
          </div>
          <div>
            <div className="text-[14px] font-bold text-black mb-1">SEO Optimized</div>
            <div className="text-[13px] text-gray-700 font-medium">For better insights</div>
          </div>
        </div>

        <div className="hidden md:block w-px h-12 bg-gray-200"></div>

        <div className="flex items-center gap-4">
          <div className="text-[#C89B5E] shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          </div>
          <div>
            <div className="text-[14px] font-bold text-black mb-1">Regular Updates</div>
            <div className="text-[13px] text-gray-700 font-medium">Fresh knowledge</div>
          </div>
        </div>

        <div className="hidden md:block w-px h-12 bg-gray-200"></div>

        <div className="flex items-center gap-4">
          <div className="text-[#C89B5E] shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
          </div>
          <div>
            <div className="text-[14px] font-bold text-black mb-1">Trusted Information</div>
            <div className="text-[13px] text-gray-700 font-medium">Reliable & accurate</div>
          </div>
        </div>

      </div>
    </div>
  )
}
