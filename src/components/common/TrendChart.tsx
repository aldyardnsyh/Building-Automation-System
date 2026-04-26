'use client';

import { useEffect, useRef, useState } from 'react';

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
}

export default function TrendChart({ 
  id, 
  label, 
  unit, 
  minValue, 
  maxValue, 
  color = '#3b82f6',
  data = [],
  warningThreshold,
  criticalThreshold 
}: TrendChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
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
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 1;
    ctx.setLineDash([5, 5]);

    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (chartHeight / gridLines) * i;
      ctx.beginPath();
      ctx.moveTo(padding.left, y);
      ctx.lineTo(width - padding.right, y);
      ctx.stroke();

      const value = maxValue - ((maxValue - minValue) / gridLines) * i;
      ctx.fillStyle = '#94a3b8';
      ctx.font = '10px Inter, sans-serif';
      ctx.textAlign = 'right';
      ctx.fillText(value.toFixed(1), padding.left - 8, y + 4);
    }
    ctx.setLineDash([]);

    if (criticalThreshold !== undefined) {
      const critY = padding.top + ((maxValue - criticalThreshold) / (maxValue - minValue)) * chartHeight;
      ctx.strokeStyle = '#ef4444';
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
      ctx.strokeStyle = '#f59e0b';
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

    ctx.fillStyle = '#64748b';
    ctx.font = '11px Inter, sans-serif';
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
    ctx.font = 'bold 12px Inter, sans-serif';
    ctx.textAlign = 'left';
    ctx.fillText(`${label} (${unit})`, padding.left, 14);

  }, [data, minValue, maxValue, color, label, unit, warningThreshold, criticalThreshold]);

  return (
    <div className="detail-section">
      <div className="chart-container">
        <canvas ref={canvasRef} width={600} height={200} className="w-full h-full" />
      </div>
    </div>
  );
}