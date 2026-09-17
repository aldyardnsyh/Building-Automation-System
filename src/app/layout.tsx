import './globals.css';
import type { Metadata } from 'next';
import ClientLayout from './ClientLayout';

export const metadata: Metadata = {
  title: 'BAS IoT Monitoring Dashboard',
  description: 'Building Automation System - Politeknik Negeri Bandung',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id">
      <body className="bg-slate-100 min-h-dvh antialiased">
        {/* Link font wajib di dalam <body> agar diangkat otomatis ke <head> oleh Next.js.
            Menaruhnya langsung di bawah <html> merusak struktur root layout dan memicu error. */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Fira+Code:wght@400;500;600;700&family=Fira+Sans:wght@300;400;500;600;700&display=swap"
          rel="stylesheet"
        />
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}
