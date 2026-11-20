'use client';

import React, { useEffect, useState, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export const TopProgressBar: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [progress, setProgress] = useState(0);
  const [visible, setVisible] = useState(false);
  const timersRef = useRef<NodeJS.Timeout[]>([]);
  const prevPathRef = useRef(pathname);

  const clearAllTimers = () => {
    timersRef.current.forEach((t) => clearTimeout(t));
    timersRef.current = [];
  };

  const startProgress = () => {
    clearAllTimers();
    setVisible(true);
    setProgress(30);

    const t1 = setTimeout(() => setProgress(60), 200);
    const t2 = setTimeout(() => setProgress(85), 500);
    const t3 = setTimeout(() => setProgress(92), 1200);
    timersRef.current = [t1, t2, t3];
  };

  const completeProgress = () => {
    clearAllTimers();
    setProgress(100);
    const tEnd = setTimeout(() => {
      setVisible(false);
      setProgress(0);
    }, 300);
    timersRef.current = [tEnd];
  };

  // Selesaikan loading setiap kali rute atau parameter URL berubah
  useEffect(() => {
    if (visible || prevPathRef.current !== pathname) {
      prevPathRef.current = pathname;
      completeProgress();
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    const handleCustomStart = () => {
      startProgress();
    };

    const handleCustomEnd = () => {
      completeProgress();
    };

    window.addEventListener('stepflow-start-progress', handleCustomStart);
    window.addEventListener('stepflow-end-progress', handleCustomEnd);

    // Deteksi klik link internal
    const handleDocumentClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      const targetAttr = target.getAttribute('target');

      if (
        href &&
        href.startsWith('/') &&
        targetAttr !== '_blank' &&
        !href.startsWith('#') &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey
      ) {
        const currentUrl = window.location.pathname + window.location.search;
        if (href === currentUrl) return;

        startProgress();
      }
    };

    // Deteksi navigasi Back / Forward browser
    const handlePopState = () => {
      startProgress();
    };

    document.addEventListener('click', handleDocumentClick, { capture: true });
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('stepflow-start-progress', handleCustomStart);
      window.removeEventListener('stepflow-end-progress', handleCustomEnd);
      document.removeEventListener('click', handleDocumentClick, { capture: true });
      window.removeEventListener('popstate', handlePopState);
      clearAllTimers();
    };
  }, []);

  if (!visible && progress === 0) return null;

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-[99999] pointer-events-none h-[3.5px] transition-opacity duration-300 ${
        progress === 100 ? 'opacity-0' : 'opacity-100'
      }`}
    >
      <div
        className="h-full bg-gradient-to-r from-orange-500 via-[#FF5C35] to-amber-400 shadow-[0_0_12px_#FF5C35] transition-all duration-200 ease-out relative"
        style={{ width: `${progress}%` }}
      >
        {/* Efek kilau di ujung garis */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-white/50 blur-[2px] animate-pulse" />
      </div>
    </div>
  );
};
