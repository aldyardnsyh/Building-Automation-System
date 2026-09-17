'use client';

import { Area, AreaChart, ResponsiveContainer } from 'recharts';

interface SparkPoint {
  timestamp: number;
  value: number;
}

interface SparklineProps {
  data: SparkPoint[];
  color: string;
  id: string;
  label: string;
}

// Alasan Recharts + ResponsiveContainer: sparkline mengikuti lebar kartu di semua breakpoint tanpa overflow.
export default function Sparkline({ data, color, id, label }: SparklineProps) {
  if (data.length < 2) {
    return <div className="h-11" role="img" aria-label={`${label} menunggu data`} />;
  }
  const gradientId = `spark-${id}`;
  return (
    <div className="h-11" role="img" aria-label={`Tren ${label}`}>
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
          <defs>
            <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity={0.35} />
              <stop offset="100%" stopColor={color} stopOpacity={0.02} />
            </linearGradient>
          </defs>
          <Area
            type="monotone"
            dataKey="value"
            stroke={color}
            strokeWidth={2}
            fill={`url(#${gradientId})`}
            isAnimationActive={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
