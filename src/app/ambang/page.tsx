'use client';

import { useState } from 'react';
import { useBASData } from '@/hooks/useBASData';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

interface ThresholdDef {
  key: string;
  sensor: string;
  address: string;
  unit: string;
  min: number;
  max: number;
  warn: number;
  crit: number;
  critHigh: boolean;
  live: number;
}

// Batas awal mengikuti ambang operasional yang dipakai di halaman detail dan hook data.
// TODO: hubungkan ke backend/PLC saat API konfigurasi tersedia.
const DEFS: Omit<ThresholdDef, 'live'>[] = [
  { key: 'ph', sensor: 'Nilai pH IPAL', address: '%MW102 • 40103', unit: 'pH', min: 0, max: 14, warn: 8.5, crit: 6, critHigh: false },
  { key: 'temp', sensor: 'Suhu Zona A', address: '%MW300 • 40301', unit: '°C', min: 0, max: 100, warn: 45, crit: 60, critHigh: true },
  { key: 'smoke', sensor: 'Sensor Asap', address: '%MW301 • 40302', unit: 'ADC', min: 0, max: 1023, warn: 500, crit: 700, critHigh: true },
];

function RangeBar({ def }: { def: ThresholdDef }) {
  const pct = (v: number) => Math.min(100, Math.max(0, ((v - def.min) / (def.max - def.min)) * 100));
  const livePct = pct(def.live);
  // Zona aman selalu di antara ambang peringatan dan kritis.
  const safeFrom = def.critHigh ? 0 : pct(def.crit);
  const safeTo = def.critHigh ? pct(def.warn) : pct(def.warn);
  const warnFrom = def.critHigh ? pct(def.warn) : pct(def.warn);
  const warnTo = def.critHigh ? pct(def.crit) : 100;
  return (
    <div
      className="relative h-4 rounded-full bg-slate-200 overflow-visible"
      role="img"
      aria-label={`${def.sensor}: nilai ${def.live} ${def.unit}, peringatan ${def.warn}, kritis ${def.crit}`}
    >
      <div className="absolute top-0 bottom-0 bg-emerald-400 rounded-full" style={{ left: `${safeFrom}%`, width: `${Math.max(0, safeTo - safeFrom)}%` }} />
      <div className="absolute top-0 bottom-0 bg-amber-400" style={{ left: `${warnFrom}%`, width: `${Math.max(0, warnTo - warnFrom)}%` }} />
      <div
        className="absolute top-0 bottom-0 bg-red-500 rounded-r-full"
        style={def.critHigh ? { left: `${pct(def.crit)}%`, width: `${100 - pct(def.crit)}%` } : { left: '0%', width: `${pct(def.crit)}%` }}
      />
      <div
        className="absolute w-1 bg-slate-900 rounded"
        style={{ left: `calc(${livePct}% - 2px)`, top: -4, bottom: -4 }}
        aria-hidden="true"
      />
    </div>
  );
}

export default function AmbangPage() {
  const { data, isLoading } = useBASData(2000);
  const [thresholds, setThresholds] = useState<Record<string, { warn: number; crit: number }>>({
    ph: { warn: 8.5, crit: 6 },
    temp: { warn: 45, crit: 60 },
    smoke: { warn: 500, crit: 700 },
  });
  const [saved, setSaved] = useState(false);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96 mb-8" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  const liveValues: Record<string, number> = {
    ph: data?.wwtp?.ph ?? 0,
    temp: data?.fire_system?.temp ?? 0,
    smoke: data?.fire_system?.smoke ?? 0,
  };

  const defs: ThresholdDef[] = DEFS.map((d) => ({
    ...d,
    warn: thresholds[d.key].warn,
    crit: thresholds[d.key].crit,
    live: liveValues[d.key] ?? 0,
  }));

  const handleSave = () => {
    // Mode demo: hanya state lokal, penanda umpan balik ditampilkan di bawah.
    setSaved(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="page-title">Ambang Batas</h1>
        <p className="page-subtitle">Batas peringatan dan kritis tiap sensor beserta posisi nilai live</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {defs.map((def) => (
          <Card key={def.key}>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between gap-2">
                <CardTitle className="text-sm font-semibold">{def.sensor}</CardTitle>
                <Badge variant="outline" className="font-mono text-[11px]">{def.address}</Badge>
              </div>
              <CardDescription>
                Live: <span className="font-mono font-semibold text-foreground">{def.live} {def.unit}</span>
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <RangeBar def={def} />
              <div className="flex items-center justify-between text-xs text-muted-foreground">
                <span>{def.min}</span>
                <span className="font-mono">Peringatan {def.warn} • Kritis {def.crit} {def.unit}</span>
                <span>{def.max}</span>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <label className="flex flex-col gap-1 text-xs font-medium">
                  Peringatan
                  <input
                    type="number"
                    value={thresholds[def.key].warn}
                    min={def.min}
                    max={def.max}
                    onChange={(e) => {
                      setSaved(false);
                      setThresholds((t) => ({ ...t, [def.key]: { ...t[def.key], warn: Number(e.target.value) } }));
                    }}
                    className="h-11 rounded-md border border-input bg-background px-3 font-mono text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </label>
                <label className="flex flex-col gap-1 text-xs font-medium">
                  Kritis
                  <input
                    type="number"
                    value={thresholds[def.key].crit}
                    min={def.min}
                    max={def.max}
                    onChange={(e) => {
                      setSaved(false);
                      setThresholds((t) => ({ ...t, [def.key]: { ...t[def.key], crit: Number(e.target.value) } }));
                    }}
                    className="h-11 rounded-md border border-input bg-background px-3 font-mono text-base focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  />
                </label>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="flex items-center gap-3">
        <Button type="button" onClick={handleSave}>
          Simpan ambang
        </Button>
        <span className="text-xs text-muted-foreground">Mode demo: tersimpan di browser saja, belum ke PLC.</span>
      </div>
      <div role="status" aria-live="polite" className="mt-2 text-sm text-slate-600 min-h-5">
        {saved ? 'Ambang tersimpan lokal untuk sesi ini.' : ''}
      </div>
    </div>
  );
}
