'use client';

import dynamic from 'next/dynamic';
import Link from 'next/link';
import { useBASData } from '@/hooks/useBASData';
import SystemCard from '@/components/SystemCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';

// Sparkline dimuat dinamis tanpa SSR agar tidak ada layout shift saat hidrasi.
const Sparkline = dynamic(() => import('@/components/charts/Sparkline'), {
  ssr: false,
  loading: () => <Skeleton className="h-11 w-full" />,
});

// Jumlah unit PLC Modbus di dashboard ini: Unit 1 (%MW100), Unit 2 (%MW200), Unit 3 (%MW300).
const UNIT_COUNT = 3;
// Total titik data 11 (WWTP 5 + Air Bersih 3 + Kebakaran 3), status Kebakaran adalah turunan alarm
// bukan sensor fisik sehingga sensor terpasang dihitung 10.
const SENSOR_COUNT = 10;

function formatKoma(value: number): string {
  return String(value).replace('.', ',');
}

function getPhColor(ph: number): string {
  if (ph < 6 || ph > 8.5) return '#ef4444';
  return '#1e293b';
}

export default function Dashboard() {
  const { data, isLoading, trendHistory, alarms } = useBASData(2000);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96 mb-8" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} className="h-36" />
          ))}
        </div>
      </div>
    );
  }

  const activeAlarms = alarms.filter((a: any) => {
    return a.level === 'critical' || a.level === 'warning';
  });

  const isFireAlarm = (data?.fire_system?.status ?? 0) === 1;
  const wwtpPh = data?.wwtp?.ph ?? 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="page-title">Ringkasan Sistem</h1>
        <p className="page-subtitle">Kondisi terkini seluruh unit BAS</p>
        <p className="text-xs text-slate-500 -mt-4 mb-0">
          {UNIT_COUNT} Unit PLC • {SENSOR_COUNT} Sensor • OPC UA + MQTT
        </p>
      </div>

      {/* Kartu KPI ala shadcn: nilai live besar + sparkline tren. */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Laju Alir IPAL</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold font-mono">
              {data?.wwtp?.flow || 0} <span className="text-xs font-medium text-muted-foreground">L/min</span>
            </div>
            <Sparkline data={trendHistory['wwtp-flow'] || []} color="#3b82f6" id="kpi-wwtp-flow" label="Laju alir IPAL" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Laju Air Bersih</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold font-mono">
              {data?.clean_water?.flow || 0} <span className="text-xs font-medium text-muted-foreground">L/min</span>
            </div>
            <Sparkline data={trendHistory['cw-flow'] || []} color="#06b6d4" id="kpi-cw-flow" label="Laju air bersih" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Suhu Zona A</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="text-2xl font-bold font-mono">
              {data?.fire_system?.temp || 0} <span className="text-xs font-medium text-muted-foreground">°C</span>
            </div>
            <Sparkline data={trendHistory['fire-temp'] || []} color="#f97316" id="kpi-fire-temp" label="Suhu zona A" />
          </CardContent>
        </Card>
        <Card className={activeAlarms.length > 0 ? 'border-red-300' : ''}>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Alarm Aktif</CardTitle>
          </CardHeader>
          <CardContent className="p-4 pt-0">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold font-mono">{activeAlarms.length}</span>
              <Badge variant={activeAlarms.length > 0 ? 'destructive' : 'success'}>
                {activeAlarms.length > 0 ? 'Perlu perhatian' : 'Semua normal'}
              </Badge>
            </div>
            <div className="h-11 flex items-end">
              <Link href="/alarm" className="text-sm font-medium text-primary underline-offset-4 hover:underline">
                Lihat semua alarm
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <SystemCard
          title="IPAL (Instalasi Pengolahan Air Limbah)"
          subtitle="Unit 1 • %MW100"
          initial="W"
          detailHref="/wwtp"
          detailLabel="Lihat detail IPAL"
        >
          <div className="mini-stat mb-3">
            <span className="mini-stat-label">Laju Alir</span>
            <span className="mini-stat-value">{data?.wwtp?.flow || 0}</span>
            <span className="mini-stat-unit">L/min</span>
          </div>
          <div className="mini-stat mb-3">
            <span className="mini-stat-label">Tekanan</span>
            <span className="mini-stat-value">{formatKoma(data?.wwtp?.pressure || 0)}</span>
            <span className="mini-stat-unit">bar</span>
          </div>
          <div className="mini-stat mb-3">
            <span className="mini-stat-label">Nilai pH</span>
            {/* Alasan: batas tampil di samping nilai agar operator langsung tahu ambang tanpa membuka halaman detail. */}
            <span className="mini-stat-value" style={{ color: getPhColor(wwtpPh) }}>
              {formatKoma(wwtpPh)}{' '}
              <span className="text-xs font-normal text-slate-500">(batas 6,0-8,5)</span>
            </span>
            <span className="mini-stat-unit">pH</span>
          </div>
          <div className="indicators-row">
            <div className={`indicator-card ${data?.wwtp?.pump_status ? 'active' : 'inactive'}`}>
              <span className={`status-dot ${data?.wwtp?.pump_status ? 'active' : 'inactive'}`} />
              <span className="indicator-text">Pompa {data?.wwtp?.pump_status ? 'Aktif' : 'Mati'}</span>
            </div>
            <div className={`indicator-card ${data?.wwtp?.valve_status ? 'active' : 'inactive'}`}>
              <span className={`status-dot ${data?.wwtp?.valve_status ? 'active' : 'inactive'}`} />
              <span className="indicator-text">Katup {data?.wwtp?.valve_status ? 'Terbuka' : 'Tertutup'}</span>
            </div>
          </div>
        </SystemCard>

        <SystemCard
          title="Air Bersih"
          subtitle="Unit 2 • %MW200"
          initial="A"
          detailHref="/clean-water"
          detailLabel="Lihat detail Air Bersih"
        >
          <div className="mini-stat mb-3">
            <span className="mini-stat-label">Laju Alir</span>
            <span className="mini-stat-value">{data?.clean_water?.flow || 0}</span>
            <span className="mini-stat-unit">L/min</span>
          </div>
          <div className="mini-stat mb-3">
            <span className="mini-stat-label">Tekanan</span>
            <span className="mini-stat-value">{formatKoma(data?.clean_water?.pressure || 0)}</span>
            <span className="mini-stat-unit">bar</span>
          </div>
          <div className="indicators-row">
            <div className={`indicator-card ${data?.clean_water?.dist_status ? 'active' : 'inactive'}`}>
              <span className={`status-dot ${data?.clean_water?.dist_status ? 'active' : 'inactive'}`} />
              <span className="indicator-text">
                Distribusi {data?.clean_water?.dist_status ? 'Aktif' : 'Nonaktif'}
              </span>
            </div>
          </div>
        </SystemCard>

        {/* Alasan: hanya kartu kebakaran yang mendapat penekanan penuh saat status 1 agar perhatian tidak terpecah ke kartu netral. */}
        <SystemCard
          title="Proteksi Kebakaran"
          subtitle="Unit 3 • %MW300"
          initial="F"
          tone={isFireAlarm ? 'danger' : 'normal'}
          isAlert={isFireAlarm}
          detailHref="/fire-system"
          detailLabel="Lihat detail Proteksi Kebakaran"
        >
          <div className="mini-stat mb-3">
            <span className="mini-stat-label">Suhu Ruangan</span>
            <span className="mini-stat-value">{data?.fire_system?.temp || 0}</span>
            <span className="mini-stat-unit">°C</span>
          </div>
          <div className="mini-stat mb-3">
            <span className="mini-stat-label">Sensor Asap</span>
            <span
              className="mini-stat-value"
              style={{ color: data?.fire_system?.smoke && data.fire_system.smoke > 500 ? '#ef4444' : undefined }}
            >
              {data?.fire_system?.smoke || 0}
            </span>
            <span className="mini-stat-unit">ADC</span>
          </div>
          <div className="indicators-row">
            <div className={`indicator-card ${isFireAlarm ? 'inactive' : 'active'}`}>
              <span className={`status-dot ${isFireAlarm ? 'inactive' : 'active'}`} />
              <span className="indicator-text">{isFireAlarm ? 'Kebakaran' : 'Normal'}</span>
            </div>
          </div>
        </SystemCard>
      </div>

      {activeAlarms.length > 0 && (
        <Card className="mb-8">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-3">
            <CardTitle className="text-sm font-semibold">Alarm Aktif</CardTitle>
            <Badge variant="destructive">{activeAlarms.length} alarm</Badge>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {activeAlarms.slice(0, 5).map((alarm: any) => (
                <div
                  key={alarm.id}
                  className={`flex items-center justify-between gap-3 p-3 rounded-lg ${alarm.level === 'critical' ? 'bg-red-50' : 'bg-amber-50'}`}
                >
                  <div className="flex items-center gap-3 min-w-0">
                    <Badge variant={alarm.level === 'critical' ? 'destructive' : 'warning'}>
                      {alarm.level === 'critical' ? 'KRITIS' : 'PERINGATAN'}
                    </Badge>
                    <span className="text-sm font-medium truncate">{alarm.source}</span>
                  </div>
                  <span className="text-sm text-slate-600 text-right shrink-0">{alarm.message}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mt-8 text-center text-sm text-slate-600">
        <p>Terakhir diperbarui: {data?.timestamp ? new Date(data.timestamp).toLocaleString('id-ID') : '-'}</p>
      </div>
    </div>
  );
}
