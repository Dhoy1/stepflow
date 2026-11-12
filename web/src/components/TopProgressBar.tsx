'use client';

import React, { useEffect, useState } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';

export const TopProgressBar: React.FC = () => {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);

  // When pathname or searchParams change, navigation is complete
  useEffect(() => {
    if (loading) {
      setProgress(100);
      const timer = setTimeout(() => {
        setLoading(false);
        setProgress(0);
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [pathname, searchParams]);

  useEffect(() => {
    let p1: NodeJS.Timeout;
    let p2: NodeJS.Timeout;
    let p3: NodeJS.Timeout;

    const startProgress = () => {
      setLoading(true);
      setProgress(30);

      // Gradually advance progress for slow networks
      p1 = setTimeout(() => setProgress(60), 180);
      p2 = setTimeout(() => setProgress(82), 500);
      p3 = setTimeout(() => setProgress(92), 1200);
    };

    const handleCustomStart = () => {
      startProgress();
    };

    window.addEventListener('stepflow-start-progress', handleCustomStart);

    // Global click interceptor on internal links
    const handleDocumentClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;

      const href = target.getAttribute('href');
      const targetAttr = target.getAttribute('target');

      // Check if it's an internal navigation link
      if (
        href &&
        href.startsWith('/') &&
        targetAttr !== '_blank' &&
        !href.startsWith('#') &&
        !e.ctrlKey &&
        !e.metaKey &&
        !e.shiftKey
      ) {
        // If clicking the exact same URL, don't start loading bar
        const currentUrl = window.location.pathname + window.location.search;
        if (href === currentUrl) return;

        startProgress();
      }
    };

    document.addEventListener('click', handleDocumentClick, { capture: true });
    return () => {
      window.removeEventListener('stepflow-start-progress', handleCustomStart);
      document.removeEventListener('click', handleDocumentClick, { capture: true });
      clearTimeout(p1);
      clearTimeout(p2);
      clearTimeout(p3);
    };
  }, []);

  if (!loading && progress === 0) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[99999] pointer-events-none h-[3.5px] bg-transparent">
      <div
        className="h-full bg-gradient-to-r from-orange-500 via-[#FF5C35] to-amber-400 shadow-[0_0_12px_#FF5C35] transition-all duration-300 ease-out relative"
        style={{
          width: `${progress}%`,
          opacity: progress === 100 ? 0 : 1
        }}
      >
        {/* Glowing tip indicator */}
        <div className="absolute right-0 top-0 bottom-0 w-8 bg-white/50 blur-[2px] animate-pulse" />
      </div>
    </div>
  );
};
