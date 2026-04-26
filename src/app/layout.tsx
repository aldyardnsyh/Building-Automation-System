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
      <body className="bg-slate-100 min-h-screen">
        <ClientLayout>{children}</ClientLayout>
      </body>
    </html>
  );
}