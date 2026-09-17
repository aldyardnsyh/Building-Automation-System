'use client';

import { useEffect, useRef } from 'react';

interface DataPoint {
  timestamp: number;
  value: number;
}

interface TrendChartProps {
  id: string;
  label: string;
  unit: string;
  minValue: number;
  maxValue: number;
  color?: string;
  data: DataPoint[];
  warningThreshold?: number;
  criticalThreshold?: number;
  emptyMessage?: string;
}

export default function TrendChart({
  id,
  label,
  unit,
  minValue,
  maxValue,
  color = '#1d4ed8',
  data = [],
  warningThreshold,
  criticalThreshold,
  emptyMessage = 'Menunggu data...'
}: TrendChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    if (data.length < 2) return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;
    const padding = { top: 20, right: 20, bottom: 30, left: 50 };
    const chartWidth = width - padding.left - padding.right;
    const chartHeight = height - padding.top - padding.bottom;

    ctx.clearRect(0, 0, width, height);

    ctx.fillStyle = '#f8fafc';
    ctx.fillRect(0, 0, width, height);

    const gridLines = 5;
    ctx.strokeStyle = '#cbd5e1';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (chartHeight / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      const value = maxValue - ((maxValue - minValue) / gridLines) * i;
      ctx.fillStyle = '#475569';
      ctx.font = '10px "Fira Code", monospace';
      ctx.textAlign = 'right';
      ctx.fillText(value.toFixed(1), padding.left - 8, y + 4);
    }
    ctx.setLineDash([]);

    if (criticalThreshold !== undefined) {
      const critY = padding.top + ((maxValue - criticalThreshold) / (maxValue - minValue)) * chartHeight;
      ctx.strokeStyle = '#b91c1c';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 5]);
      ctx.beginPath();
      ctx.moveTo(padding.left, critY);
      ctx.lineTo(width - padding.right, critY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    if (warningThreshold !== undefined) {
      const warnY = padding.top + ((maxValue - warningThreshold) / (maxValue - minValue)) * chartHeight;
      ctx.strokeStyle = '#b45309';
      ctx.lineWidth = 2;
      ctx.setLineDash([10, 5]);
      ctx.beginPath();
      ctx.moveTo(padding.left, warnY);
      ctx.lineTo(width - padding.right, warnY);
      ctx.stroke();
      ctx.setLineDash([]);
    }

    if (data.length > 1) {
      const gradient = ctx.createLinearGradient(0, padding.top, 0, height - padding.bottom);
      gradient.addColorStop(0, color + '40');
      gradient.addColorStop(1, color + '05');

      ctx.beginPath();
      ctx.moveTo(padding.left, height - padding.bottom);

      data.forEach((point, i) => {
        const x = padding.left + (i / (data.length - 1)) * chartWidth;
        const y = padding.top + ((maxValue - point.value) / (maxValue - minValue)) * chartHeight;
        if (i === 0) {
          ctx.lineTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });

      ctx.lineTo(width - padding.right, height - padding.bottom);
      ctx.closePath();
      ctx.fillStyle = gradient;
      ctx.fill();

      ctx.beginPath();
      data.forEach((point, i) => {
        const x = padding.left + (i / (data.length - 1)) * chartWidth;
        const y = padding.top + ((maxValue - point.value) / (maxValue - minValue)) * chartHeight;
        if (i === 0) {
          ctx.moveTo(x, y);
        } else {
          ctx.lineTo(x, y);
        }
      });
      ctx.strokeStyle = color;
      ctx.lineWidth = 2;
      ctx.stroke();
    }

    ctx.fillStyle = '#475569';
    ctx.font = '11px "Fira Code", monospace';
    ctx.textAlign = 'center';
    const timeLabels = 5;
    for (let i = 0; i <= timeLabels; i++) {
      const x = padding.left + (chartWidth / timeLabels) * i;
      const idx = Math.floor((data.length - 1) * (i / timeLabels));
      if (data[idx]) {
        const date = new Date(data[idx].timestamp);
        ctx.fillText(date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' }), x, height - 8);
      }
    }

    ctx.fillStyle = '#1e293b';
    ctx.font = 'bold 12px "Fira Sans", sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${label} (${unit})`, padding.left, 14);

    // Alasan chip nilai terakhir: nilai per titik tidak bisa di-hover di kanvas, jadi angka mutakhir selalu terlihat.
    const lastPoint = data[data.length - 1];
    if (lastPoint) {
      ctx.fillStyle = '#1e293b';
      ctx.font = 'bold 11px "Fira Code", monospace';
      ctx.textAlign = 'right';
      ctx.fillText(`Terakhir ${lastPoint.value} ${unit}`, width - padding.right, 14);
    }

  }, [data, minValue, maxValue, color, label, unit, warningThreshold, criticalThreshold]);

  if (data.length < 2) {
    return (
      <div className="detail-section">
        <div className="chart-container flex items-center justify-center">
          <p className="text-sm text-slate-500">{emptyMessage}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="detail-section">
      <div className="chart-container">
        <canvas
          ref={canvasRef}
          id={id}
          width={600}
          height={200}
          className="w-full h-full"
          role="img"
          aria-label={`${label} tren ${unit}, ${data.length} titik sekitar 60 detik terakhir`}
        />
      </div>
    </div>
  );
}
