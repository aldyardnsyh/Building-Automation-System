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
  thresholdText?: string;
  warningThreshold?: number;
  criticalThreshold?: number;
}

function getColorForValue(val: number, min: number, max: number, highlights?: Array<{ from: number; to: number; color: string }>): string {
  if (!highlights) return '#3b82f6';
  for (const h of highlights) {
    if (val >= h.from && val <= h.to) {
      return h.color;
    }
  }
  return '#3b82f6';
}

export default function Gauge({ type, id, minValue, maxValue, units, value, label, highlights, thresholdText, warningThreshold, criticalThreshold }: GaugeProps) {
  const percentage = Math.min(100, Math.max(0, ((value - minValue) / (maxValue - minValue)) * 100));
  const color = getColorForValue(value, minValue, maxValue, highlights);
  const range = maxValue - minValue;
  const warningPct =
    warningThreshold !== undefined && range > 0
      ? Math.min(100, Math.max(0, ((warningThreshold - minValue) / range) * 100))
      : null;
  const criticalPct =
    criticalThreshold !== undefined && range > 0
      ? Math.min(100, Math.max(0, ((criticalThreshold - minValue) / range) * 100))
      : null;

  if (type === 'linear') {
    return (
      <div className="gauge-wrapper" id={id}>
        <div className="w-full">
          <div className="relative h-4 bg-slate-200 rounded-full overflow-hidden">
            <div
              className="absolute top-0 left-0 h-full rounded-full transition-all duration-500"
              style={{ width: `${percentage}%`, backgroundColor: color }}
            />
            {warningPct !== null && (
              <span
                aria-hidden="true"
                className="absolute top-0 bottom-0 w-0.5 bg-amber-500"
                style={{ left: `${warningPct}%` }}
              />
            )}
            {criticalPct !== null && (
              <span
                aria-hidden="true"
                className="absolute top-0 bottom-0 w-0.5 bg-red-600"
                style={{ left: `${criticalPct}%` }}
              />
            )}
          </div>
          <div className="flex justify-between mt-1 text-xs text-slate-500">
            <span>{minValue}</span>
            <span className="font-bold" style={{ color: color }}>{value} {units}</span>
            <span>{maxValue}</span>
          </div>
          {thresholdText && (
            <p className="mt-1 text-xs text-slate-500">{thresholdText}</p>
          )}
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
    <div className="gauge-wrapper" id={id}>
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
          <span className="text-2xl font-bold font-mono" style={{ color: '#334155' }}>{value}</span>
          <span className="text-xs" style={{ color: '#64748b' }}>{units}</span>
        </div>
      </div>
      {label && <span className="gauge-label">{label}</span>}
      {thresholdText && (
        <p className="mt-1 text-xs text-slate-500 text-center">{thresholdText}</p>
      )}
    </div>
  );
}
