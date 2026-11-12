'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RefreshCw, Home } from 'lucide-react';

export default function GuideError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Guide loading error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-600">
          <AlertTriangle size={24} />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800">Gagal Memuat Panduan</h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Terjadi kendala saat mengambil data panduan dari server. Hal ini biasanya terjadi karena koneksi jaringan lambat atau terputus.
          </p>
        </div>
        <div className="flex items-center gap-2 mt-2 w-full">
          <button
            onClick={() => reset()}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-[#FF5C35] hover:bg-[#E54A24] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <RefreshCw size={14} />
            <span>Coba Lagi</span>
          </button>
          <Link
            href="/"
            className="flex items-center justify-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-xl transition-colors"
          >
            <Home size={14} />
            <span>Beranda</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

