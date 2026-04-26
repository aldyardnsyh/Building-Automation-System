'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const NAV_ITEMS = [
  { href: '/', label: 'Overview', icon: '📊' },
  { href: '/wwtp', label: 'WWTP', icon: '🏭' },
  { href: '/clean-water', label: 'Clean Water', icon: '💧' },
  { href: '/fire-system', label: 'Fire System', icon: '🔥' },
];

function Header() {
  const pathname = usePathname();

  return (
    <header className="bg-white shadow-sm border-b border-slate-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">
              BAS
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-800">Building Automation System</h1>
              <p className="text-xs text-slate-500">Lab. Perancangan Politeknik Negeri Bandung</p>
            </div>
          </div>
          
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map((item) => {
              const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'bg-blue-50 text-blue-700'
                      : 'text-slate-600 hover:bg-slate-100 hover:text-slate-800'
                  }`}
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <div className="flex items-center gap-3">
            <span className="flex items-center gap-2 px-3 py-1.5 bg-emerald-50 text-emerald-700 rounded-full text-xs font-medium">
              <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse"></span>
              Online
            </span>
          </div>
        </div>
      </div>
    </header>
  );
}

function ProjectInfo() {
  return (
    <div className="bg-slate-50 border-b border-slate-200 py-3">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-4">
            <span className="text-slate-500">Tugas Akhir:</span>
            <span className="font-semibold text-slate-700">Redesain Sistem Kontrol Terminal Utama BAS Berbasis OPC UA dan IoT</span>
          </div>
          <div className="flex items-center gap-4 text-slate-400">
            <span>OPC UA + MQTT Protocol</span>
            <span className="text-slate-300">|</span>
            <span>Modbus TCP/IP</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <Header />
      <ProjectInfo />
      <main>{children}</main>
    </>
  );
}