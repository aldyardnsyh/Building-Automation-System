'use client';

interface GaugeProps {
  type: 'linear' | 'radial';
  id: string;
  minValue: number;
  maxValue: number;
  units: string;
  value: number;
  label?: string;
  highlights?: Array<{ from: number; to: number; color: string }>;
}

function getColorForValue(val: number, min: number, max: number, highlights?: Array<{ from: number; to: number; color: string }>): string {
  if (!highlights) return '#3b82f6';
  const range = max - min;
  for (const h of highlights) {
    if (val >= h.from && val <= h.to) {
      return h.color;
    }
  }
  return '#3b82f6';
}

export default function Gauge({ type, id, minValue, maxValue, units, value, label, highlights }: GaugeProps) {
  const percentage = Math.min(100, Math.max(0, ((value - minValue) / (maxValue - minValue)) * 100));
  const color = getColorForValue(value, minValue, maxValue, highlights);

  if (type === 'linear') {
    return (
      <div className="gauge-wrapper">
        <div className="w-full">
          <div className="relative h-4 bg-slate-200 rounded-full overflow-hidden">
            <div 
              className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
              style={{ width: `${percentage}%`, backgroundColor: color }}
            />
          </div>
          <div className="flex justify-between mt-1 text-xs text-slate-500">
            <span>{minValue}</span>
            <span className="font-bold" style={{ color: color }}>{value} {units}</span>
            <span>{maxValue}</span>
          </div>
        </div>
        {label && <span className="gauge-label">{label}</span>}
      </div>
    );
  }

  const radius = 60;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = circumference - (percentage / 100) * circumference;

  return (
    <div className="gauge-wrapper">
      <div className="relative" style={{ width: 160, height: 160 }}>
        <svg width="160" height="160" viewBox="0 0 160 160">
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
          />
          <circle
            cx="80"
            cy="80"
            r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={dashOffset}
            strokeLinecap="round"
            className="transition-all duration-500"
            transform="rotate(-90 80 80)"
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="text-2xl font-bold" style={{ color: '#334155' }}>{value}</span>
          <span className="text-xs" style={{ color: '#64748b' }}>{units}</span>
        </div>
      </div>
      {label && <span className="gauge-label">{label}</span>}
    </div>
  );
}