'use client';

import { useBASData } from '@/hooks/useBASData';
import TrendChart from '@/components/common/TrendChart';
import AlarmTable, { AlarmItem } from '@/components/common/AlarmTable';
import PIDDiagram from '@/components/common/PIDDiagram';

export default function FireSystemPage() {
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

  const fireAlarms = alarms.filter((a: any) => a.source === 'Fire System');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <div className="breadcrumb mb-4">
        <a href="/">Overview</a>
        <span>›</span>
        <span className="text-slate-800">Fire System Detail</span>
      </div>

      {/* Page Header */}
      <div className="mb-8">
        <h1 className="page-title flex items-center gap-3">
          <span className="text-2xl">🔥</span>
          Fire Protection System
        </h1>
        <p className="page-subtitle">Slave 3 • Modbus Address %MW300 • Unit ID: 255</p>
      </div>

      {/* Fire Alert Banner */}
      {data?.fire_system?.status === 1 && (
        <div className="bg-red-50 border-2 border-red-500 rounded-xl p-4 mb-6 animate-pulse">
          <div className="flex items-center gap-4">
            <span className="text-4xl">🚨</span>
            <div>
              <h2 className="text-xl font-bold text-red-700">FIRE ALARM ACTIVE</h2>
              <p className="text-red-600">Segera evacuate area! Sistem mendeteksi kebakaran.</p>
            </div>
          </div>
        </div>
      )}

      {/* System Status Banner */}
      <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm mb-6">
        <div className="flex items-center justify-between flex-wrap gap-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className={`w-3 h-3 rounded-full ${data?.fire_system?.status === 1 ? 'bg-red-500 animate-pulse' : 'bg-emerald-500 animate-pulse'}`}></span>
              <span className="font-medium text-slate-700">PLC Slave 3</span>
            </div>
            <span className="text-slate-400">|</span>
            <span className="text-sm text-slate-500">Modbus TCP/IP • 192.168.1.103</span>
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
                  <div className="text-sm font-medium text-slate-700">Suhu Ruangan</div>
                  <div className="text-xs text-slate-400">%MW300 • 40301</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold" style={{ color: data?.fire_system?.temp && data.fire_system.temp > 50 ? '#ef4444' : '#1e293b' }}>
                    {data?.fire_system?.temp}
                  </div>
                  <div className="text-xs text-slate-400">°C</div>
                </div>
              </div>
              <div className="flex justify-between items-center p-3 bg-slate-50 rounded-lg">
                <div>
                  <div className="text-sm font-medium text-slate-700">Sensor Asap</div>
                  <div className="text-xs text-slate-400">%MW301 • 40302</div>
                </div>
                <div className="text-right">
                  <div className="text-xl font-bold" style={{ color: data?.fire_system?.smoke && data.fire_system.smoke > 500 ? '#ef4444' : '#1e293b' }}>
                    {data?.fire_system?.smoke}
                  </div>
                  <div className="text-xs text-slate-400">ppm (0-1023)</div>
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
              <div className={`p-4 rounded-lg border ${data?.fire_system?.status === 0 ? 'bg-emerald-50 border-emerald-200' : 'bg-red-50 border-red-200'}`}>
                <div className="flex items-center justify-between">
                  <div>
                    <div className="font-medium text-slate-700">Status Kebakaran</div>
                    <div className="text-xs text-slate-400">%MW302:X0 • Bit 0</div>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-medium ${data?.fire_system?.status === 0 ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'}`}>
                    {data?.fire_system?.status === 0 ? 'NORMAL' : 'FIRE ALARM'}
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
            <button className="w-full py-3 px-4 bg-red-50 text-red-700 rounded-lg font-medium hover:bg-red-100 transition-colors text-sm">
              Acknowledge Alarm
            </button>
            <button className="w-full py-3 px-4 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition-colors text-sm">
              Test System
            </button>
            <button className="w-full py-3 px-4 bg-slate-100 text-slate-600 rounded-lg font-medium hover:bg-slate-200 transition-colors text-sm">
              Laporan Kejadian
            </button>
          </div>
        </div>
      </div>

      {/* Trend Charts */}
      <div className="mb-6">
        <div className="detail-section-header">Trend Monitoring (Real-time)</div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-white border-x border-b border-slate-200">
          <TrendChart
            id="fire-temp-trend"
            label="Room Temperature"
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
            label="Smoke Level"
            unit="ppm"
            minValue={0}
            maxValue={1023}
            color="#f97316"
            warningThreshold={500}
            criticalThreshold={700}
            data={trendHistory['fire-smoke'] || []}
          />
        </div>
      </div>

      {/* P&ID Diagram and Alarm Table */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <PIDDiagram type="fire-system" />
        <AlarmTable alarms={fireAlarms as AlarmItem[]} />
      </div>
    </div>
  );
}