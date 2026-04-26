'use client';

import { useBASData } from '@/hooks/useBASData';
import Link from 'next/link';

export default function Dashboard() {
  const { data, isLoading, alarms } = useBASData(2000);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
          <p className="text-gray-500 font-medium">Memuat Dashboard...</p>
        </div>
      </div>
    );
  }

  const activeAlarms = alarms.filter((a: any) => {
    return a.level === 'critical' || a.level === 'warning';
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="page-title">Dashboard Overview</h1>
        <p className="page-subtitle">Ringkasan kondisi seluruh sistem monitoring BAS</p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 uppercase tracking-wide">Total Slave</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">3</div>
          <div className="text-xs text-emerald-600 mt-1">Modbus TCP/IP</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 uppercase tracking-wide">Sensor Aktif</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">10</div>
          <div className="text-xs text-blue-600 mt-1">Analog + Digital</div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 uppercase tracking-wide">Alarm Aktif</div>
          <div className="text-2xl font-bold text-slate-800 mt-1">{activeAlarms.length}</div>
          <div className={`text-xs mt-1 ${activeAlarms.length > 0 ? 'text-red-600' : 'text-emerald-600'}`}>
            {activeAlarms.length > 0 ? 'Perlu Perhatian' : 'Semua Normal'}
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 border border-slate-200 shadow-sm">
          <div className="text-xs text-slate-500 uppercase tracking-wide">Status Sistem</div>
          <div className="text-2xl font-bold text-emerald-600 mt-1">Online</div>
          <div className="text-xs text-slate-400 mt-1">OPC UA + MQTT</div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="system-card">
          <div className="card-header">
            <div className="card-header-left">
              <div className="card-icon bg-amber-50">🏭</div>
              <div>
                <h2>WWTP</h2>
                <div className="subtitle">Waste Water Treatment</div>
              </div>
            </div>
            <Link href="/wwtp" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Detail
            </Link>
          </div>
          <div className="card-body">
            <div className="mini-stat mb-3">
              <span className="mini-stat-label">Flow Rate</span>
              <span className="mini-stat-value">{data?.wwtp?.flow || 0}</span>
              <span className="mini-stat-unit">L/min</span>
            </div>
            <div className="mini-stat mb-3">
              <span className="mini-stat-label">Pressure</span>
              <span className="mini-stat-value">{data?.wwtp?.pressure || 0}</span>
              <span className="mini-stat-unit">Bar</span>
            </div>
            <div className="mini-stat mb-3">
              <span className="mini-stat-label">pH Level</span>
              <span className="mini-stat-value" style={{ color: getPhColor(data?.wwtp?.ph || 7) }}>
                {data?.wwtp?.ph || 0}
              </span>
              <span className="mini-stat-unit">pH</span>
            </div>
            <div className="indicators-row">
              <div className={`indicator-card ${data?.wwtp?.pump_status ? 'active' : 'inactive'}`}>
                <span className={`status-dot ${data?.wwtp?.pump_status ? 'active' : 'inactive'}`} />
                <span className="indicator-text">Pompa {data?.wwtp?.pump_status ? 'ON' : 'OFF'}</span>
              </div>
              <div className={`indicator-card ${data?.wwtp?.valve_status ? 'active' : 'inactive'}`}>
                <span className={`status-dot ${data?.wwtp?.valve_status ? 'active' : 'inactive'}`} />
                <span className="indicator-text">Katup {data?.wwtp?.valve_status ? 'Open' : 'Close'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="system-card">
          <div className="card-header">
            <div className="card-header-left">
              <div className="card-icon bg-cyan-50">💧</div>
              <div>
                <h2>Clean Water</h2>
                <div className="subtitle">Distribution System</div>
              </div>
            </div>
            <Link href="/clean-water" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Detail
            </Link>
          </div>
          <div className="card-body">
            <div className="mini-stat mb-3">
              <span className="mini-stat-label">Flow Rate</span>
              <span className="mini-stat-value">{data?.clean_water?.flow || 0}</span>
              <span className="mini-stat-unit">L/min</span>
            </div>
            <div className="mini-stat mb-3">
              <span className="mini-stat-label">Pressure</span>
              <span className="mini-stat-value">{data?.clean_water?.pressure || 0}</span>
              <span className="mini-stat-unit">Bar</span>
            </div>
            <div className="indicators-row">
              <div className={`indicator-card ${data?.clean_water?.dist_status ? 'active' : 'inactive'}`}>
                <span className={`status-dot ${data?.clean_water?.dist_status ? 'active' : 'inactive'}`} />
                <span className="indicator-text">Distribution {data?.clean_water?.dist_status ? 'Active' : 'Inactive'}</span>
              </div>
            </div>
          </div>
        </div>

        <div className={`system-card ${data?.fire_system?.status ? 'alert' : ''}`}>
          <div className="card-header">
            <div className="card-header-left">
              <div className="card-icon bg-red-50">🔥</div>
              <div>
                <h2>Fire System</h2>
                <div className="subtitle">Protection System</div>
              </div>
            </div>
            <Link href="/fire-system" className="text-sm text-blue-600 hover:text-blue-800 font-medium">
              Detail
            </Link>
          </div>
          <div className="card-body">
            <div className="mini-stat mb-3">
              <span className="mini-stat-label">Room Temp</span>
              <span className="mini-stat-value">{data?.fire_system?.temp || 0}</span>
              <span className="mini-stat-unit">°C</span>
            </div>
            <div className="mini-stat mb-3">
              <span className="mini-stat-label">Smoke Level</span>
              <span className="mini-stat-value" style={{ color: data?.fire_system?.smoke && data.fire_system.smoke > 500 ? '#ef4444' : undefined }}>
                {data?.fire_system?.smoke || 0}
              </span>
              <span className="mini-stat-unit">ppm</span>
            </div>
            <div className="indicators-row">
              <div className={`indicator-card ${data?.fire_system?.status ? 'inactive' : 'active'}`}>
                <span className={`status-dot ${data?.fire_system?.status ? 'inactive' : 'active'}`} />
                <span className="indicator-text">
                  {data?.fire_system?.status ? 'FIRE ALARM' : 'Normal'}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {activeAlarms.length > 0 && (
        <div className="detail-section">
          <div className="detail-section-header flex items-center justify-between">
            <span>Alarm Aktif</span>
            <span className="text-xs font-normal text-red-600">{activeAlarms.length} alarm</span>
          </div>
          <div className="detail-section-body">
            <div className="space-y-2">
              {activeAlarms.slice(0, 5).map((alarm: any) => (
                <div key={alarm.id} className={`flex items-center justify-between p-3 rounded-lg ${alarm.level === 'critical' ? 'bg-red-50' : 'bg-amber-50'}`}>
                  <div className="flex items-center gap-3">
                    <span className={`px-2 py-1 rounded text-xs font-semibold ${alarm.level === 'critical' ? 'bg-red-100 text-red-700' : 'bg-amber-100 text-amber-700'}`}>
                      {alarm.level.toUpperCase()}
                    </span>
                    <span className="text-sm font-medium">{alarm.source}</span>
                  </div>
                  <span className="text-sm text-slate-600">{alarm.message}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <div className="mt-8 text-center text-sm text-slate-400">
        <p>Last Update: {data?.timestamp ? new Date(data.timestamp).toLocaleString('id-ID') : '-'}</p>
        <p className="text-xs mt-1">Simulated Data - Modbus TCP/IP Architecture - OPC UA Protocol</p>
      </div>
    </div>
  );
}

function getPhColor(ph: number): string {
  if (ph < 6 || ph > 8.5) return '#ef4444';
  return '#1e293b';
}