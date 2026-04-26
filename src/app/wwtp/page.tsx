'use client';

import { useBASData } from '@/hooks/useBASData';
import TrendChart from '@/components/common/TrendChart';
import AlarmTable, { AlarmItem } from '@/components/common/AlarmTable';
import PIDDiagram from '@/components/common/PIDDiagram';

export default function WWTPPage() {
  const { data, isLoading, trendHistory, alarms } = useBASData(2000);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Memuat Data...</p>
        </div>
      </div>
    );
  }

  const wwtpAlarms = alarms.filter((a: any) => a.source === 'WWTP');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="breadcrumb mb-4">
        <Link href="/">Overview</Link>
        <span>›</span>
        <span className="text-slate-800">WWTP Detail</span>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="page-title flex items-center gap-3">
          <span className="text-2xl">🏭</span>
          Waste Water Treatment Plant
        </h1>
        <p className="page-subtitle">Slave 1 • Modbus Address %MW100 • Unit ID: 255</p>
      </div>

      {/* System Status Banner */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 bg-emerald-500 rounded-full animate-pulse"></span>
              <span className="font-medium text-slate-700">PLC Slave 1</span>
            </div>
            <span className="text-slate-400">|</span>
            <span className="text-sm text-slate-500">Modbus TCP/IP • 192.168.1.101</span>
          </div>
          <div className="text-sm text-slate-400">
            Last Update: {data?.timestamp ? new Date(data.timestamp).toLocaleString('id-ID') : '-'}
          </div>
        </div>
      </div>

      {/* Analog Data Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="detail-section">
          <div className="detail-section-header">Analog Sensors</div>
          <div className="detail-section-body">
            <div className="space-y-4">
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-slate-700">Laju Alir Air</div>
                  <div className="text-xs text-slate-400">%MW100 • 40101</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-blue-600">{data?.wwtp?.flow}</div>
                  <div className="text-xs text-slate-400">L/min</div>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-slate-700">Tekanan Pipa</div>
                  <div className="text-xs text-slate-400">%MW101 • 40102</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold text-blue-600">{data?.wwtp?.pressure}</div>
                  <div className="text-xs text-slate-400">Bar</div>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-slate-700">Nilai pH Air</div>
                  <div className="text-xs text-slate-400">%MW102 • 40103</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold" style={{ color: getPhColor(data?.wwtp?.ph || 7) }}>
                    {data?.wwtp?.ph}
                  </div>
                  <div className="text-xs text-slate-400">pH (0-14)</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Digital Status Section */}
        <div className="detail-section">
          <div className="detail-section-header">Digital Status</div>
          <div className="detail-section-body">
            <div className="space-y-4">
              <div className={`p-4 rounded-lg border ${data?.wwtp?.pump_status ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-700">Status Pompa</div>
                    <div className="text-xs text-slate-400">%MW103:X0 • Bit 0</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${data?.wwtp?.pump_status ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {data?.wwtp?.pump_status ? 'ON' : 'OFF'}
                  </div>
                </div>
              </div>
              <div className={`p-4 rounded-lg border ${data?.wwtp?.valve_status ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-700">Status Katup</div>
                    <div className="text-xs text-slate-400">%MW103:X1 • Bit 1</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${data?.wwtp?.valve_status ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {data?.wwtp?.valve_status ? 'TERBUKA' : 'TERTUTUP'}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="detail-section">
          <div className="detail-section-header">Kontrol</div>
          <div className="detail-section-body space-y-3">
            <button className="w-full py-3 px-4 bg-blue-50 text-blue-700 rounded-lg font-medium hover:bg-blue-100 transition-colors text-sm">
              Reset Alarm
            </button>
            <button className="w-full py-3 px-4 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition-colors text-sm">
              Export Data
            </button>
            <button className="w-full py-3 px-4 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition-colors text-sm">
              Konfigurasi
            </button>
          </div>
        </div>
      </div>

      {/* Trend Charts */}
      <div className="mb-6">
        <div className="detail-section-header">Trend Monitoring (Real-time)</div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 bg-white border-x border-b border-slate-200">
          <TrendChart
            id="wwtp-flow-trend"
            label="Flow Rate"
            unit="L/min"
            minValue={0}
            maxValue={500}
            color="#3b82f6"
            data={trendHistory['wwtp-flow'] || []}
          />
          <TrendChart
            id="wwtp-pressure-trend"
            label="Pressure"
            unit="Bar"
            minValue={0}
            maxValue={10}
            color="#10b981"
            data={trendHistory['wwtp-pressure'] || []}
          />
          <TrendChart
            id="wwtp-ph-trend"
            label="pH Level"
            unit="pH"
            minValue={0}
            maxValue={14}
            color="#8b5cf6"
            warningThreshold={8.5}
            criticalThreshold={6}
            data={trendHistory['wwtp-ph'] || []}
          />
        </div>
      </div>

      {/* P&ID Diagram and Alarm Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PIDDiagram type="wwtp" />
        <AlarmTable alarms={wwtpAlarms as AlarmItem[]} />
      </div>
    </div>
  );
}

function getPhColor(ph: number): string {
  if (ph < 6 || ph > 8.5) return '#ef4444';
  return '#1e293b';
}

function Link({ href, children, className }: { href: string; children: React.ReactNode; className?: string }) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}