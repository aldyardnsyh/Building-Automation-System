'use client';

export interface AlarmItem {
  id: string;
  timestamp: string;
  source: string;
  message: string;
  level: 'critical' | 'warning' | 'normal';
  acknowledged: boolean;
}

interface AlarmTableProps {
  alarms: AlarmItem[];
  maxHeight?: string;
}

export default function AlarmTable({ alarms, maxHeight = '300px' }: AlarmTableProps) {
  const getLevelClass = (level: string) => {
    switch (level) {
      case 'critical': return 'alarm-critical';
      case 'warning': return 'alarm-warning';
      default: return 'alarm-normal';
    }
  };

  const getLevelBadge = (level: string) => {
    switch (level) {
      case 'critical': return { bg: '#fef2f2', text: '#b91c1c', label: 'KRITIS' };
      case 'warning': return { bg: '#fffbeb', text: '#b45309', label: 'PERINGATAN' };
      default: return { bg: '#f0fdf4', text: '#15803d', label: 'NORMAL' };
    }
  };

  return (
    <div className="detail-section" role="status" aria-live="polite">
      <div className="detail-section-header flex items-center justify-between">
        <span>Riwayat Alarm</span>
        <span className="text-xs font-normal text-slate-500">{alarms.length} kejadian</span>
      </div>
      <div className="detail-section-body" style={{ maxHeight, overflowY: 'auto' }}>
        <table className="alarm-table">
          <thead className="sticky top-0 z-10">
            <tr>
              <th>Waktu</th>
              <th>Sumber</th>
              <th>Alarm</th>
              <th>Level</th>
            </tr>
          </thead>
          <tbody>
            {alarms.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-slate-500 py-8">
                  <div className="font-semibold">Belum ada alarm tercatat. Sistem memantau normal.</div>
                  <div className="text-xs mt-2">Alarm baru muncul di sini otomatis.</div>
                </td>
              </tr>
            ) : (
              alarms.map((alarm) => {
                const badge = getLevelBadge(alarm.level);
                return (
                  <tr key={alarm.id} className={getLevelClass(alarm.level)}>
                    <td className="font-mono text-xs">{alarm.timestamp}</td>
                    <td>{alarm.source}</td>
                    <td>{alarm.message}</td>
                    <td>
                      <span
                        className="px-2 py-1 rounded-full text-xs font-semibold"
                        style={{ backgroundColor: badge.bg, color: badge.text }}
                      >
                        {badge.label}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
