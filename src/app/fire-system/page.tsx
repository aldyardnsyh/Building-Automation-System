'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useBASData } from '@/hooks/useBASData';
import TrendChart from '@/components/common/TrendChart';
import AlarmTable, { AlarmItem } from '@/components/common/AlarmTable';
import PIDDiagram from '@/components/common/PIDDiagram';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

export default function FireSystemPage() {
  const { data, isLoading, trendHistory, alarms } = useBASData(2000);
  const [acknowledged, setAcknowledged] = useState(false);
  const [tab, setTab] = useState('sensor');

  // Alasan hash: tab bisa dibagikan via link dan tombol kembali browser tetap sinkron.
  useEffect(() => {
    const syncTab = () => {
      const h = window.location.hash.replace('#', '');
      if (['sensor', 'tren', 'skema', 'alarm'].includes(h)) setTab(h);
    };
    syncTab();
    window.addEventListener('hashchange', syncTab);
    return () => window.removeEventListener('hashchange', syncTab);
  }, []);

  const handleTabChange = (v: string) => {
    setTab(v);
    window.location.hash = v;
  };

  if (isLoading) {
    return (
      <div className="min-h-dvh flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Memuat Data...</p>
        </div>
      </div>
    );
  }

  const fireAlarms = alarms.filter((a: any) => a.source === 'Fire System');
  const isFire = data?.fire_system?.status === 1;

  const handleAcknowledge = () => {
    setAcknowledged(true);
  };

  const handleExportData = () => {
    const ts = data?.timestamp ? new Date(data.timestamp).toISOString() : new Date().toISOString();
    const header = ['timestamp', 'suhu_ruangan_C', 'sensor_asap_ADC', 'status_kebakaran'];
    const row = [
      ts,
      String(data?.fire_system?.temp ?? ''),
      String(data?.fire_system?.smoke ?? ''),
      data?.fire_system?.status ? 'Kebakaran' : 'Normal',
    ];
    const csv = [header.join(','), row.join(',')].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fire-system-data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportTrend = () => {
    const series = [
      { key: 'fire-temp', name: 'suhu_C' },
      { key: 'fire-smoke', name: 'asap_ADC' },
    ];
    const header = ['timestamp', ...series.map((s) => s.name)];
    const n = Math.max(0, ...series.map((s) => (trendHistory[s.key] || []).length));
    const rows: string[] = [];
    for (let i = 0; i < n; i++) {
      const points = series.map((s) => (trendHistory[s.key] || [])[i]);
      const tsPoint = points.find((p) => p);
      rows.push(
        [tsPoint ? new Date(tsPoint.timestamp).toISOString() : '', ...points.map((p) => (p ? String(p.value) : ''))].join(',')
      );
    }
    const blob = new Blob([[header.join(','), ...rows].join('\n')], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'fire-system-tren.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="breadcrumb mb-4">
        <Link href="/">Ringkasan</Link>
        <span>›</span>
        <span className="text-slate-800">Sistem Kebakaran</span>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="page-title flex items-center gap-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
            <path d="M12 3c1.5 3 5 5.5 5 9.5a5 5 0 0 1-10 0c0-2 1-3.5 2-5c.5 1 1.2 1.7 2 2c-.3-2 .3-4.5 1-6.5z" stroke="#dc2626" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
          Fire Protection System
        </h1>
        <p className="page-subtitle">Unit 3 • Alamat %MW300 • ID 255</p>
      </div>

      {/* Fire Alert Banner */}
      {isFire && !acknowledged && (
        <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 mb-6">
          <div className="flex items-center gap-4 flex-wrap">
            <span aria-hidden="true" className="w-3 h-3 bg-red-500 rounded-full"></span>
            <div className="flex-1 min-w-52">
              <h2 className="text-xl font-bold text-red-700">Alarm Kebakaran Aktif</h2>
              <p className="text-red-600">Terdeteksi indikasi kebakaran di Zona A. Evakuasi area dan periksa panel.</p>
            </div>
            <button
              type="button"
              onClick={handleAcknowledge}
              aria-label="Ambil tindakan: Tandai sudah dibaca"
              className="py-2 px-4 bg-red-600 text-white rounded-lg font-medium hover:bg-red-700 transition-colors text-sm"
            >
              Tandai sudah dibaca
            </button>
          </div>
        </div>
      )}

      {/* System Status Banner */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${isFire ? 'bg-red-500' : 'bg-emerald-500'}`}></span>
              <span className="font-medium text-slate-700">PLC Slave 3</span>
            </div>
            <span className="text-slate-600">|</span>
            <span className="text-sm text-slate-600">Modbus TCP/IP • 192.168.1.103</span>
          </div>
          <div className="text-sm text-slate-600">
            Terakhir diperbarui: {data?.timestamp ? new Date(data.timestamp).toLocaleString('id-ID') : '-'}
          </div>
        </div>
      </div>

      {/* Tab navigasi ala shadcn agar tiap grup informasi punya ruang sendiri. */}
      <Tabs value={tab} onValueChange={handleTabChange} className="mb-6">
        <TabsList className="grid w-full sm:w-auto sm:min-w-[440px] grid-cols-4">
          <TabsTrigger value="sensor" className="px-1 sm:px-3">Sensor</TabsTrigger>
          <TabsTrigger value="tren" className="px-1 sm:px-3">Tren</TabsTrigger>
          <TabsTrigger value="skema" className="px-1 sm:px-3">Skema</TabsTrigger>
          <TabsTrigger value="alarm" className="px-1 sm:px-3">Alarm</TabsTrigger>
        </TabsList>
        <TabsContent value="sensor">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="detail-section">
          <div className="detail-section-header">Sensor Analog</div>
          <div className="detail-section-body">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-slate-700">Suhu Ruangan</div>
                  <div className="text-xs text-slate-600">%MW300 • 40301</div>
                  <p className="text-xs text-slate-600 mt-1">Ambang peringatan 45°C, kritis 60°C</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold font-mono" style={{ color: data?.fire_system?.temp && data.fire_system.temp > 50 ? '#ef4444' : '#1e293b' }}>
                    {data?.fire_system?.temp}
                  </div>
                  <div className="text-xs text-slate-600">°C</div>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-slate-700">Sensor Asap</div>
                  <div className="text-xs text-slate-600">%MW301 • 40302</div>
                  <p className="text-xs text-slate-600 mt-1">Peringatan &gt;500, kritis &gt;700 (ADC)</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold font-mono" style={{ color: data?.fire_system?.smoke && data.fire_system.smoke > 500 ? '#ef4444' : '#1e293b' }}>
                    {data?.fire_system?.smoke}
                  </div>
                  <div className="text-xs text-slate-600">ADC 0-1023</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Status Digital */}
        <div className="detail-section">
          <div className="detail-section-header">Status Digital</div>
          <div className="detail-section-body">
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-slate-200 bg-white">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium text-slate-700">Status Kebakaran</div>
                    <div className="text-xs text-slate-600 font-mono">%MW302:X0 • Bit 0</div>
                  </div>
                  <Badge variant={data?.fire_system?.status === 0 ? 'success' : 'destructive'} className="gap-1.5 shrink-0">
                    <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-current" />
                    {data?.fire_system?.status === 0 ? 'Normal' : 'Kebakaran'}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="detail-section">
          <div className="detail-section-header">Kontrol</div>
          <div className="detail-section-body space-y-2.5">
            <Button
              type="button"
              variant="destructive"
              onClick={handleAcknowledge}
              aria-label="Ambil tindakan: Tandai sudah dibaca"
              className="w-full min-h-[44px]"
            >
              Tandai sudah dibaca
            </Button>
            <Button
              type="button"
              variant="secondary"
              onClick={handleExportData}
              aria-label="Ambil tindakan: Export Data"
              className="w-full min-h-[44px]"
            >
              Export Data
            </Button>
            {/* TODO: hubungkan Test System ke backend saat API tersedia */}
            <Button
              type="button"
              variant="secondary"
              disabled
              title="Segera hadir: uji sistem belum tersedia"
              aria-label="Ambil tindakan: Test System, segera hadir"
              className="w-full min-h-[44px]"
            >
              Test System (Segera hadir)
            </Button>
            {/* TODO: hubungkan Laporan Kejadian ke backend saat API tersedia */}
            <Button
              type="button"
              variant="secondary"
              disabled
              title="Segera hadir: laporan kejadian belum tersedia"
              aria-label="Ambil tindakan: Laporan Kejadian, segera hadir"
              className="w-full min-h-[44px]"
            >
              Laporan Kejadian (Segera hadir)
            </Button>
            <div role="status" aria-live="polite" className="text-sm text-slate-600">
              {acknowledged ? 'Alarm ditandai sudah dibaca' : ''}
            </div>
          </div>
        </div>
      </div>

        </TabsContent>
        <TabsContent value="tren">
          <div className="detail-section-header">Tren Pemantauan Real-time</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white border-x border-b border-slate-200">
          <TrendChart
            id="fire-temp-trend"
            label="Suhu Ruangan"
            unit="°C"
            minValue={0}
            maxValue={100}
            color="#ef4444"
            warningThreshold={45}
            criticalThreshold={60}
            data={trendHistory['fire-temp'] || []}
          />
          <TrendChart
            id="fire-smoke-trend"
            label="Sensor Asap"
            unit="ADC"
            minValue={0}
            maxValue={1023}
            color="#f97316"
            warningThreshold={500}
            criticalThreshold={700}
            data={trendHistory['fire-smoke'] || []}
          />
        </div>
          <div className="mt-4 flex justify-end">
            <Button type="button" variant="outline" onClick={handleExportTrend} className="min-h-[44px]">
              Export Tren CSV
            </Button>
          </div>

        </TabsContent>
        <TabsContent value="skema">
          <PIDDiagram type="fire-system" data={data?.fire_system} />
        </TabsContent>
        <TabsContent value="alarm">
          <AlarmTable alarms={fireAlarms as AlarmItem[]} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
