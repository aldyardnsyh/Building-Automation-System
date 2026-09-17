'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { cn } from '@/lib/utils';
import { useBASData } from '@/hooks/useBASData';
import { Separator } from '@/components/ui/separator';
import { Sheet, SheetClose, SheetContent, SheetTitle, SheetTrigger } from '@/components/ui/sheet';

function IconGrid() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="3" y="3" width="7" height="7" rx="1.5" />
      <rect x="14" y="3" width="7" height="7" rx="1.5" />
      <rect x="3" y="14" width="7" height="7" rx="1.5" />
      <rect x="14" y="14" width="7" height="7" rx="1.5" />
    </svg>
  );
}

function IconWwtp() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M5 8h14v9a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8Z" />
      <path d="M9 8V5.5h6V8" />
      <path d="M5 12.5c1.7 0 1.7 1.2 3.5 1.2s1.8-1.2 3.5-1.2 1.8 1.2 3.5 1.2 1.8-1.2 3.5-1.2" />
      <path d="M12 16.2h.01" />
    </svg>
  );
}

function IconDroplet() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3.5c3.2 3.9 5.8 6.9 5.8 9.8a5.8 5.8 0 0 1-11.6 0c0-2.9 2.6-5.9 5.8-9.8Z" />
      <path d="M9.4 13.4a2.7 2.7 0 0 0 2 2.7" />
    </svg>
  );
}

function IconFire() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M12 3c2 3.2 5 5.3 5 9a5 5 0 0 1-10 0c0-1.4.5-2.6 1.3-3.7.2.8.7 1.4 1.4 1.8C9.6 7.7 10.6 5 12 3Z" />
      <path d="M12 12.8c.6.7 1.2 1.3 1.2 2.2a1.2 1.2 0 0 1-2.4 0c0-.4.1-.7.3-1 .1.2.3.4.5.4 0-.5.1-1.1.4-1.6Z" />
    </svg>
  );
}

function IconBell() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M6 9a6 6 0 0 1 12 0c0 5 2 6 2 6H4s2-1 2-6Z" />
      <path d="M10 20a2 2 0 0 0 4 0" />
    </svg>
  );
}

function IconSliders() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M4 7h10M18 7h2M4 17h4M12 17h8" />
      <circle cx="16" cy="7" r="2" />
      <circle cx="10" cy="17" r="2" />
    </svg>
  );
}

// Alasan ikon grid untuk Ringkasan karena mewakili dasbor multi panel sekilas.
// Alasan ikon tangki bergelombang untuk WWTP karena mewakili proses olah limbah cair.
// Alasan ikon tetes air untuk Air Bersih karena simbol air yang paling mudah dikenali.
// Alasan ikon api untuk Proteksi Kebakaran karena simbol bahaya yang dipantau sensor.
// Alasan ikon lonceng untuk Alarm karena pola standar pusat notifikasi.
// Alasan ikon slider untuk Ambang Batas karena mewakili pengaturan nilai batas.
const NAV_GROUPS = [
  {
    label: 'Monitoring',
    items: [
      { href: '/', label: 'Ringkasan', title: 'Ringkasan sistem', Icon: IconGrid },
      { href: '/wwtp', label: 'WWTP', title: 'Instalasi Pengolahan Air Limbah', Icon: IconWwtp },
      { href: '/clean-water', label: 'Air Bersih', title: 'Sistem Air Bersih', Icon: IconDroplet },
      { href: '/fire-system', label: 'Proteksi Kebakaran', title: 'Sistem Proteksi Kebakaran', Icon: IconFire },
    ],
  },
  {
    label: 'Sistem',
    items: [
      { href: '/alarm', label: 'Alarm', title: 'Riwayat dan status alarm', Icon: IconBell },
      { href: '/ambang', label: 'Ambang Batas', title: 'Konfigurasi ambang batas sensor', Icon: IconSliders },
    ],
  },
];

function isActivePath(pathname: string, href: string) {
  return pathname === href || (href !== '/' && pathname.startsWith(href));
}

function NavList({ pathname, alarmCount, onNavigate }: { pathname: string; alarmCount: number; onNavigate?: () => void }) {
  return (
    <div className="flex flex-col gap-5">
      {NAV_GROUPS.map((group) => (
        <div key={group.label}>
          <p className="px-3 mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-muted-foreground">
            {group.label}
          </p>
          <nav aria-label={group.label} className="flex flex-col gap-1">
            {group.items.map((item) => {
              const active = isActivePath(pathname, item.href);
              const Icon = item.Icon;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  title={item.title}
                  aria-current={active ? 'page' : undefined}
                  onClick={onNavigate}
                  className={cn(
                    'flex items-center gap-2.5 rounded-md px-3 py-2 min-h-[44px] text-sm font-medium transition-colors',
                    active
                      ? 'bg-accent text-accent-foreground'
                      : 'text-muted-foreground hover:bg-accent/60 hover:text-accent-foreground'
                  )}
                >
                  <Icon />
                  <span className="flex-1">{item.label}</span>
                  {item.href === '/alarm' && alarmCount > 0 && (
                    <span
                      className="inline-flex min-w-5 h-5 items-center justify-center rounded-full bg-destructive px-1 text-[11px] font-bold text-destructive-foreground"
                      aria-label={`${alarmCount} alarm aktif`}
                    >
                      {alarmCount}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>
        </div>
      ))}
    </div>
  );
}

function BrandBlock() {
  return (
    <div className="flex items-center gap-3">
      {/* Logo memakai biru tua solid agar identitas lab konsisten. */}
      <div
        style={{ backgroundColor: '#1d4ed8' }}
        className="w-10 h-10 rounded-lg flex items-center justify-center text-white text-sm font-bold shrink-0"
      >
        BAS
      </div>
      <div className="min-w-0">
        <p className="text-sm font-bold leading-tight truncate">Building Automation System</p>
        <p className="text-xs text-muted-foreground truncate">Lab. Perancangan Polban</p>
      </div>
    </div>
  );
}

// Alasan kartu koneksi jujur soal status: hijau saat daring, merah saat luring agar operator tahu data berhenti.
function ConnectionCard({ online }: { online: boolean }) {
  return (
    <div className="rounded-lg border bg-card p-3">
      <div className="flex items-center gap-2">
        <span aria-hidden="true" className={`w-2 h-2 rounded-full ${online ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
        <span className="text-xs font-semibold">{online ? 'Terhubung' : 'Luring'}</span>
      </div>
      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
        {online ? 'OPC UA + MQTT • Modbus TCP/IP' : 'Data simulasi lokal tetap berjalan.'}
      </p>
    </div>
  );
}

export default function ClientLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [online, setOnline] = useState(true);
  const mainRef = useRef<HTMLElement>(null);
  const { alarms } = useBASData(2000);
  const alarmCount = alarms.filter((a: any) => a.level === 'critical' || a.level === 'warning').length;

  useEffect(() => {
    setOpen(false);
    // Alasan: fokus ikut pindah ke konten agar pembaca layar tidak tertinggal di navigasi.
    mainRef.current?.focus({ preventScroll: true });
  }, [pathname]);

  useEffect(() => {
    const update = () => setOnline(navigator.onLine);
    update();
    window.addEventListener('online', update);
    window.addEventListener('offline', update);
    return () => {
      window.removeEventListener('online', update);
      window.removeEventListener('offline', update);
    };
  }, []);

  return (
    <div className="min-h-dvh bg-slate-100 lg:flex">
      {/* Alasan skip link: pengguna keyboard melompati sidebar langsung ke konten tiap halaman. */}
      <a
        href="#konten-utama"
        className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 focus:z-[60] focus:inline-flex focus:min-h-[44px] focus:items-center focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-primary-foreground"
      >
        Lewati ke konten utama
      </a>
      {/* Sidebar desktop ala shadcn: navigasi dikelompokkan agar operator menemukan halaman di tempat yang diduga. */}
      <aside className="hidden lg:flex w-64 shrink-0 flex-col border-r bg-card sticky top-0 h-dvh">
        <div className="p-4">
          <BrandBlock />
        </div>
        <Separator />
        <div className="flex-1 overflow-y-auto p-3">
          <NavList pathname={pathname} alarmCount={alarmCount} />
        </div>
        <div className="p-3 flex flex-col gap-3">
          <ConnectionCard online={online} />
          <p className="px-1 text-[11px] leading-relaxed text-muted-foreground">
            Redesain Sistem Kontrol Terminal Utama BAS Berbasis OPC UA dan IoT
          </p>
        </div>
      </aside>

      <div className="flex-1 min-w-0 flex flex-col min-h-dvh">
        {/* Topbar mobile dengan drawer navigasi. */}
        <header className="lg:hidden sticky top-0 z-40 border-b bg-card">
          <div className="flex items-center justify-between gap-3 px-4 h-16">
            <BrandBlock />
            <div className="flex items-center gap-2">
              <span className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium whitespace-nowrap ${online ? 'bg-emerald-50 text-emerald-700' : 'bg-red-50 text-red-700'}`}>
                <span aria-hidden="true" className={`w-2 h-2 rounded-full ${online ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`} />
                {online ? 'Terhubung' : 'Luring'}
              </span>
              <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                  <button
                    type="button"
                    aria-label="Buka navigasi"
                    className="flex w-11 h-11 min-w-[44px] min-h-[44px] items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                  >
                    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                      <path d="M4 7h16M4 12h16M4 17h16" />
                    </svg>
                  </button>
                </SheetTrigger>
                <SheetContent side="left">
                  <div className="flex items-center justify-between p-4 pb-0">
                    <SheetTitle>Navigasi BAS</SheetTitle>
                    <SheetClose asChild>
                      <button
                        type="button"
                        aria-label="Tutup navigasi"
                        className="flex w-11 h-11 min-w-[44px] min-h-[44px] items-center justify-center rounded-md text-muted-foreground hover:bg-accent hover:text-accent-foreground"
                      >
                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d="M6 6l12 12M18 6L6 18" />
                        </svg>
                      </button>
                    </SheetClose>
                  </div>
                  <div className="flex-1 overflow-y-auto p-3">
                    <NavList pathname={pathname} alarmCount={alarmCount} onNavigate={() => setOpen(false)} />
                  </div>
                  <div className="p-3">
                    <ConnectionCard online={online} />
                  </div>
                </SheetContent>
              </Sheet>
            </div>
          </div>
        </header>

        <main ref={mainRef} id="konten-utama" tabIndex={-1} className="flex-1 focus:outline-none">{children}</main>

        <footer className="border-t bg-card">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
            <p className="text-xs leading-relaxed text-muted-foreground">
              Data simulasi untuk pengujian, bukan data produksi
            </p>
          </div>
        </footer>
      </div>
    </div>
  );
}
