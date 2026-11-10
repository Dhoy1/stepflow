import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StepFlow - Dokumentasi & Pelatihan Tim Otomatis',
  description: 'Ekstensi dan platform dokumentasi langkah demi langkah berbasis web untuk tim Kanmo.'
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="antialiased">{children}</body>
    </html>
  );
}

