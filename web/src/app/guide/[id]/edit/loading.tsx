import React from 'react';
import { Loader2 } from 'lucide-react';

export default function EditLoading() {
  return (
    <div className="min-h-screen bg-slate-100 flex flex-col font-sans">
      <nav className="bg-white border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-xl bg-slate-200 animate-pulse" />
          <div className="h-5 w-40 bg-slate-200 rounded-md animate-pulse" />
        </div>
        <div className="flex items-center gap-2">
          <div className="h-8 w-20 bg-slate-200 rounded-lg animate-pulse" />
        </div>
      </nav>
      <div className="flex-1 flex items-center justify-center p-8">
        <div className="flex flex-col items-center gap-3 bg-white p-6 rounded-2xl border border-slate-200 shadow-sm">
          <Loader2 size={24} className="animate-spin text-[#FF5C35]" />
          <span className="text-xs font-bold text-slate-700">Membuka editor panduan...</span>
        </div>
      </div>
    </div>
  );
}

