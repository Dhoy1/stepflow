import React from 'react';
import { Loader2 } from 'lucide-react';

export default function GlobalLoading() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4 font-sans">
      <div className="flex flex-col items-center gap-4 bg-white p-8 rounded-2xl border border-slate-200 shadow-sm max-w-sm w-full text-center">
        <div className="w-12 h-12 rounded-2xl bg-orange-50 border border-orange-200 flex items-center justify-center shadow-xs">
          <Loader2 size={24} className="animate-spin text-[#FF5C35]" />
        </div>
        <div>
          <h3 className="text-sm font-bold text-slate-800">Sedang Memuat...</h3>
          <p className="text-xs text-slate-500 mt-1">Menyiapkan halaman StepFlow</p>
        </div>
        <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden">
          <div className="bg-[#FF5C35] h-full w-2/3 animate-[pulse_1s_infinite] rounded-full" />
        </div>
      </div>
    </div>
  );
}

