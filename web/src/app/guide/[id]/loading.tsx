import React from 'react';
import { Loader2 } from 'lucide-react';

export default function GuideLoading() {
  return (
    <div className="min-h-screen bg-slate-50/60 flex flex-col font-sans">
      {/* Top Navbar Skeleton */}
      <nav className="bg-white border-b border-slate-200 px-4 sm:px-8 py-3.5 sticky top-0 z-20 flex items-center justify-between shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-orange-100 flex items-center justify-center animate-pulse">
            <span className="font-extrabold text-[#FF5C35] text-xs">S</span>
          </div>
          <div className="h-5 w-48 bg-slate-200 rounded-md animate-pulse hidden sm:block" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-24 bg-slate-200 rounded-lg animate-pulse" />
          <div className="h-8 w-20 bg-slate-200 rounded-lg animate-pulse" />
        </div>
      </nav>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-4 sm:p-8 flex flex-col gap-6">
        {/* Loading Indicator Floating Pill */}
        <div className="flex items-center justify-center py-2">
          <div className="flex items-center gap-2.5 px-4 py-2 bg-white border border-orange-200 rounded-full shadow-sm animate-pulse">
            <Loader2 size={16} className="animate-spin text-[#FF5C35]" />
            <span className="text-xs font-bold text-slate-700">Memuat panduan langkah demi langkah...</span>
          </div>
        </div>

        {/* Document Header Card Skeleton */}
        <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm flex flex-col gap-4 animate-pulse">
          <div className="flex items-center gap-2">
            <div className="h-5 w-24 bg-orange-100 rounded-full" />
            <div className="h-5 w-36 bg-slate-200 rounded-full" />
            <div className="h-5 w-28 bg-slate-200 rounded-full" />
          </div>
          <div className="h-8 w-3/4 bg-slate-200 rounded-lg" />
          <div className="h-4 w-1/2 bg-slate-100 rounded-md" />
          <div className="h-6 w-80 bg-purple-50 rounded-lg mt-2" />
        </div>

        {/* Step Cards Skeleton */}
        <div className="space-y-6">
          {[1, 2].map((i) => (
            <div
              key={i}
              className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden animate-pulse"
            >
              <div className="p-5 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-orange-200" />
                  <div className="h-5 w-64 bg-slate-200 rounded-md" />
                </div>
              </div>
              <div className="bg-slate-100 h-72 flex items-center justify-center">
                <div className="text-slate-300 text-xs font-medium">Memuat tangkapan layar...</div>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

