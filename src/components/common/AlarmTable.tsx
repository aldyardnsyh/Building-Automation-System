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
      case 'critical': return { bg: '#fef2f2', text: '#dc2626', label: 'CRITICAL' };
      case 'warning': return { bg: '#fffbeb', text: '#d97706', label: 'WARNING' };
      default: return { bg: '#f0fdf4', text: '#16a34a', label: 'NORMAL' };
    }
  };

  return (
    <div className="detail-section">
      <div className="detail-section-header flex items-center justify-between">
        <span>Alarm History</span>
        <span className="text-xs font-normal text-slate-500">{alarms.length} events</span>
      </div>
      <div className="detail-section-body" style={{ maxHeight, overflowY: 'auto' }}>
        <table className="alarm-table">
          <thead>
            <tr>
              <th>Time</th>
              <th>Source</th>
              <th>Alarm</th>
              <th>Level</th>
            </tr>
          </thead>
          <tbody>
            {alarms.length === 0 ? (
              <tr>
                <td colSpan={4} className="text-center text-slate-400 py-8">
                  No alarms recorded
                </td>
              </tr>
            ) : (
              alarms.map((alarm) => {
                const badge = getLevelBadge(alarm.level);
                return (
                  <tr key={alarm.id} className={getLevelClass(alarm.level)}>
                    <td className="font-mono text-xs">{alarm.timestamp}</td>
                    <td className="font-medium">{alarm.source}</td>
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