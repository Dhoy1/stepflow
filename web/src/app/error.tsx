'use client';

import React, { useEffect } from 'react';
import Link from 'next/link';
import { AlertCircle, RefreshCw, Home } from 'lucide-react';

export default function RootError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error('Root application error:', error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4 font-sans">
      <div className="max-w-md w-full bg-white rounded-2xl border border-slate-200 shadow-sm p-6 text-center flex flex-col items-center gap-4">
        <div className="w-12 h-12 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center text-rose-600">
          <AlertCircle size={24} />
        </div>
        <div>
          <h2 className="text-base font-bold text-slate-800">Terjadi Kesalahan Aplikasi</h2>
          <p className="text-xs text-slate-500 mt-1 leading-relaxed">
            Sistem mengalami kendala saat memproses permintaan Anda. Silakan coba muat ulang halaman.
          </p>
        </div>
        <div className="flex items-center gap-2 mt-2 w-full">
          <button
            onClick={() => reset()}
            className="flex-1 flex items-center justify-center gap-1.5 px-4 py-2 bg-[#FF5C35] hover:bg-[#E54A24] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <RefreshCw size={14} />
            <span>Muat Ulang</span>
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

