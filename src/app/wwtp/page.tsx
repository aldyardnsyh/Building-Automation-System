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

export default function WWTPPage() {
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

  const wwtpAlarms = alarms.filter((a: any) => a.source === 'WWTP');

  const handleResetAlarm = () => {
    setAcknowledged(true);
  };

  const handleExportData = () => {
    const ts = data?.timestamp ? new Date(data.timestamp).toISOString() : new Date().toISOString();
    const header = ['timestamp', 'laju_alir_L_min', 'tekanan_bar', 'nilai_ph', 'pompa', 'katup'];
    const row = [
      ts,
      String(data?.wwtp?.flow ?? ''),
      String(data?.wwtp?.pressure ?? ''),
      String(data?.wwtp?.ph ?? ''),
      data?.wwtp?.pump_status ? 'Aktif' : 'Mati',
      data?.wwtp?.valve_status ? 'Terbuka' : 'Tertutup',
    ];
    const csv = [header.join(','), row.join(',')].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'wwtp-data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportTrend = () => {
    const series = [
      { key: 'wwtp-flow', name: 'laju_alir_L_min' },
      { key: 'wwtp-pressure', name: 'tekanan_bar' },
      { key: 'wwtp-ph', name: 'nilai_ph' },
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
    a.download = 'wwtp-tren.csv';
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
        <span className="text-slate-800">WWTP</span>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="page-title flex items-center gap-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
            <rect x="3" y="8" width="18" height="12" rx="2" stroke="#0f766e" strokeWidth="1.8" />
            <path d="M7 8V6a5 5 0 0 1 10 0v2" stroke="#0f766e" strokeWidth="1.8" />
          </svg>
          Waste Water Treatment Plant
        </h1>
        <p className="page-subtitle">Unit 1 • Alamat %MW100 • ID 255</p>
      </div>

      {/* System Status Banner */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="font-medium text-slate-700">PLC Slave 1</span>
            </div>
            <span className="text-slate-600">|</span>
            <span className="text-sm text-slate-600">Modbus TCP/IP • 192.168.1.101</span>
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
                  <div className="text-sm font-medium text-slate-700">Laju Alir</div>
                  <div className="text-xs text-slate-600">%MW100 • 40101</div>
                  <p className="text-xs text-slate-600 mt-1">Batas operasi 0-500 L/min</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-blue-600">{data?.wwtp?.flow}</div>
                  <div className="text-xs text-slate-600">L/min</div>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-slate-700">Tekanan</div>
                  <div className="text-xs text-slate-600">%MW101 • 40102</div>
                  <p className="text-xs text-slate-600 mt-1">Batas operasi 0-10 bar</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-blue-600">{data?.wwtp?.pressure}</div>
                  <div className="text-xs text-slate-600">bar</div>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-slate-700">Nilai pH</div>
                  <div className="text-xs text-slate-600">%MW102 • 40103</div>
                  <p className="text-xs text-slate-600 mt-1">Batas aman 6,0-8,5</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold font-mono" style={{ color: getPhColor(data?.wwtp?.ph || 7) }}>
                    {data?.wwtp?.ph}
                  </div>
                  <div className="text-xs text-slate-600">pH (0-14)</div>
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
              {/* Alasan: boks netral, status hanya di Badge agar satu sinyal dan sejajar dengan tabel alarm. */}
              <div className="p-4 rounded-lg border border-slate-200 bg-white">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium text-slate-700">Status Pompa</div>
                    <div className="text-xs text-slate-600 font-mono">%MW103:X0 • Bit 0</div>
                  </div>
                  <Badge variant={data?.wwtp?.pump_status ? 'success' : 'destructive'} className="gap-1.5 shrink-0">
                    <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-current" />
                    {data?.wwtp?.pump_status ? 'Pompa Aktif' : 'Pompa Mati'}
                  </Badge>
                </div>
              </div>
              <div className="p-4 rounded-lg border border-slate-200 bg-white">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <div className="font-medium text-slate-700">Status Katup</div>
                    <div className="text-xs text-slate-600 font-mono">%MW103:X1 • Bit 1</div>
                  </div>
                  <Badge variant={data?.wwtp?.valve_status ? 'success' : 'destructive'} className="gap-1.5 shrink-0">
                    <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-current" />
                    {data?.wwtp?.valve_status ? 'Katup Terbuka' : 'Katup Tertutup'}
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
            {/* Alasan: satu varian primer untuk aksi utama, sekunder untuk pendukung, agar hierarki jelas. */}
            <Button
              type="button"
              onClick={handleResetAlarm}
              aria-label="Ambil tindakan: Reset Alarm"
              className="w-full min-h-[44px]"
            >
              Reset Alarm
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
            {/* TODO: hubungkan Konfigurasi ke backend saat API tersedia */}
            <Button
              type="button"
              variant="secondary"
              disabled
              title="Segera hadir: konfigurasi belum tersedia"
              aria-label="Ambil tindakan: Konfigurasi, segera hadir"
              className="w-full min-h-[44px]"
            >
              Konfigurasi (Segera hadir)
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white border-x border-b border-slate-200">
          <TrendChart
            id="wwtp-flow-trend"
            label="Laju Alir"
            unit="L/min"
            minValue={0}
            maxValue={500}
            color="#3b82f6"
            data={trendHistory['wwtp-flow'] || []}
          />
          <TrendChart
            id="wwtp-pressure-trend"
            label="Tekanan"
            unit="bar"
            minValue={0}
            maxValue={10}
            color="#10b981"
            data={trendHistory['wwtp-pressure'] || []}
          />
          <TrendChart
            id="wwtp-ph-trend"
            label="Nilai pH"
            unit="pH"
            minValue={0}
            maxValue={14}
            color="#8b5cf6"
            warningThreshold={8.5}
            criticalThreshold={6}
            data={trendHistory['wwtp-ph'] || []}
          />
        </div>
          <div className="mt-4 flex justify-end">
            <Button type="button" variant="outline" onClick={handleExportTrend} className="min-h-[44px]">
              Export Tren CSV
            </Button>
          </div>

        </TabsContent>
        <TabsContent value="skema">
          <PIDDiagram type="wwtp" data={data?.wwtp} />
        </TabsContent>
        <TabsContent value="alarm">
          <AlarmTable alarms={wwtpAlarms as AlarmItem[]} />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function getPhColor(ph: number): string {
  if (ph < 6 || ph > 8.5) return '#ef4444';
  return '#1e293b';
}
