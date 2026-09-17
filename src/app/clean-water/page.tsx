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

export default function CleanWaterPage() {
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

  const cwAlarms = alarms.filter((a: any) => a.source === 'Clean Water' || a.source === 'WWTP');

  const handleResetAlarm = () => {
    setAcknowledged(true);
  };

  const handleExportData = () => {
    const ts = data?.timestamp ? new Date(data.timestamp).toISOString() : new Date().toISOString();
    const header = ['timestamp', 'laju_alir_L_min', 'tekanan_bar', 'distribusi'];
    const row = [
      ts,
      String(data?.clean_water?.flow ?? ''),
      String(data?.clean_water?.pressure ?? ''),
      data?.clean_water?.dist_status ? 'Aktif' : 'Nonaktif',
    ];
    const csv = [header.join(','), row.join(',')].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'clean-water-data.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleExportTrend = () => {
    const series = [
      { key: 'cw-flow', name: 'laju_alir_L_min' },
      { key: 'cw-pressure', name: 'tekanan_bar' },
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
    a.download = 'clean-water-tren.csv';
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
        <span className="text-slate-800">Air Bersih</span>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="page-title flex items-center gap-3">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" aria-hidden="true" className="shrink-0">
            <path d="M12 3c3 4 6 7 6 10a6 6 0 1 1-12 0c0-3 3-6 6-10z" stroke="#0284c7" strokeWidth="1.8" strokeLinejoin="round" />
          </svg>
          Clean Water Distribution
        </h1>
        <p className="page-subtitle">Unit 2 • Alamat %MW200 • ID 255</p>
      </div>

      {/* System Status Banner */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="font-medium text-slate-700">PLC Slave 2</span>
            </div>
            <span className="text-slate-600">|</span>
            <span className="text-sm text-slate-600">Modbus TCP/IP • 192.168.1.102</span>
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
                  <div className="text-xs text-slate-600">%MW200 • 40201</div>
                  <p className="text-xs text-slate-600 mt-1">Batas operasi 0-1000 L/min</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-blue-600">{data?.clean_water?.flow}</div>
                  <div className="text-xs text-slate-600">L/min</div>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-slate-700">Tekanan</div>
                  <div className="text-xs text-slate-600">%MW201 • 40202</div>
                  <p className="text-xs text-slate-600 mt-1">Batas operasi 0-10 bar</p>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-blue-600">{data?.clean_water?.pressure}</div>
                  <div className="text-xs text-slate-600">bar</div>
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
                    <div className="font-medium text-slate-700">Status Distribusi</div>
                    <div className="text-xs text-slate-600 font-mono">%MW203:X0 • Bit 0</div>
                  </div>
                  <Badge variant={data?.clean_water?.dist_status ? 'success' : 'destructive'} className="gap-1.5 shrink-0">
                    <span aria-hidden="true" className="w-1.5 h-1.5 rounded-full bg-current" />
                    {data?.clean_water?.dist_status ? 'Distribusi Aktif' : 'Distribusi Nonaktif'}
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white border-x border-b border-slate-200">
          <TrendChart
            id="cw-flow-trend"
            label="Laju Alir"
            unit="L/min"
            minValue={0}
            maxValue={1000}
            color="#06b6d4"
            data={trendHistory['cw-flow'] || []}
          />
          <TrendChart
            id="cw-pressure-trend"
            label="Tekanan"
            unit="bar"
            minValue={0}
            maxValue={10}
            color="#10b981"
            data={trendHistory['cw-pressure'] || []}
          />
        </div>
          <div className="mt-4 flex justify-end">
            <Button type="button" variant="outline" onClick={handleExportTrend} className="min-h-[44px]">
              Export Tren CSV
            </Button>
          </div>

        </TabsContent>
        <TabsContent value="skema">
          <PIDDiagram type="clean-water" data={data?.clean_water} />
        </TabsContent>
        <TabsContent value="alarm">
          <AlarmTable alarms={cwAlarms as AlarmItem[]} maxHeight="300px" />
        </TabsContent>
      </Tabs>
    </div>
  );
}
