import React, { Suspense } from 'react';
import type { Metadata } from 'next';
import { TopProgressBar } from '@/components/TopProgressBar';
import './globals.css';

export const metadata: Metadata = {
  title: 'StepFlow - Dokumentasi & Pelatihan Tim Otomatis',
  description: 'Ekstensi dan platform dokumentasi langkah demi langkah berbasis web untuk tim Kanmo.',
  icons: {
    icon: '/icon.png',
    shortcut: '/favicon.ico',
    apple: '/icon.png'
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <head>
        <link rel="icon" href="/icon.png" sizes="any" />
      </head>
      <body className="antialiased">
        <Suspense fallback={null}>
          <TopProgressBar />
        </Suspense>
        {children}
      </body>
    </html>
  );
}

