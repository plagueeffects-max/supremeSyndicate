'use client'

import { Truck, PenToolIcon as Tool, Award, Settings } from 'lucide-react'

export function ProductsFeaturesBand() {
  return (
    <div className="max-w-[1440px] mx-auto w-full px-6 md:px-12 mb-16 mt-8">
      <div className="bg-bg-primary/60 rounded-xl px-8 py-10 flex flex-col md:flex-row justify-between items-start md:items-center gap-8 md:gap-4 border border-border-soft">
        
        <div className="flex items-center gap-4">
          <div className="text-accent-primary shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect width="16" height="13" x="2" y="4" rx="2"/><path d="M18 17h2a2 2 0 0 0 2-2V9a2 2 0 0 0-2-2h-2"/><circle cx="7.5" cy="17.5" r="2.5"/><circle cx="17.5" cy="17.5" r="2.5"/></svg>
          </div>
          <div>
            <div className="text-[14px] font-bold text-black mb-1">Pan India Delivery</div>
            <div className="text-[13px] text-gray-700 font-medium">Fast & Reliable</div>
          </div>
        </div>

        <div className="hidden md:block w-px h-12 bg-gray-200"></div>

        <div className="flex items-center gap-4">
          <div className="text-accent-primary shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/></svg>
          </div>
          <div>
            <div className="text-[14px] font-bold text-black mb-1">Installation Support</div>
            <div className="text-[13px] text-gray-700 font-medium">Professional Setup</div>
          </div>
        </div>

        <div className="hidden md:block w-px h-12 bg-gray-200"></div>

        <div className="flex items-center gap-4">
          <div className="text-accent-primary shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
          </div>
          <div>
            <div className="text-[14px] font-bold text-black mb-1">100% Genuine Products</div>
            <div className="text-[13px] text-gray-700 font-medium">Trusted Brands Only</div>
          </div>
        </div>

        <div className="hidden md:block w-px h-12 bg-gray-200"></div>

        <div className="flex items-center gap-4">
          <div className="text-accent-primary shrink-0">
            <svg xmlns="http://www.w3.org/2000/svg" width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M15.05 5A5 5 0 0 1 19 8.95M15.05 1A9 9 0 0 1 23 8.94m-1 7.98v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
          </div>
          <div>
            <div className="text-[14px] font-bold text-black mb-1">After Sales Support</div>
            <div className="text-[13px] text-gray-700 font-medium">Always Here To Help</div>
          </div>
        </div>

      </div>
    </div>
  )
}
