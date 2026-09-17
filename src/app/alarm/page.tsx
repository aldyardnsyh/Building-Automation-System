'use client';

import { useState } from 'react';
import { useBASData } from '@/hooks/useBASData';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

type LevelFilter = 'all' | 'critical' | 'warning';

export default function AlarmPage() {
  const { alarms, isLoading } = useBASData(2000);
  const [filter, setFilter] = useState<LevelFilter>('all');
  const [sort, setSort] = useState<{ key: 'level' | 'source'; dir: 'asc' | 'desc' } | null>(null);

  if (isLoading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Skeleton className="h-8 w-64 mb-2" />
        <Skeleton className="h-4 w-96 mb-8" />
        <Skeleton className="h-64" />
      </div>
    );
  }

  const criticalCount = alarms.filter((a: any) => a.level === 'critical').length;
  const warningCount = alarms.filter((a: any) => a.level === 'warning').length;
  const visible = alarms.filter((a: any) => filter === 'all' || a.level === filter);

  // Alasan sortir: Level diurutkan berdasar severity (bukan abjad) agar kritis selalu di atas saat ascending.
  const severity = (level: string) => (level === 'critical' ? 0 : 1);
  const sorted = [...visible].sort((a: any, b: any) => {
    if (!sort) return 0;
    const diff =
      sort.key === 'level'
        ? severity(a.level) - severity(b.level)
        : String(a.source).localeCompare(String(b.source), 'id');
    return sort.dir === 'asc' ? diff : -diff;
  });

  const toggleSort = (key: 'level' | 'source') => {
    setSort((s) => {
      if (s?.key !== key) return { key, dir: 'asc' };
      if (s.dir === 'asc') return { key, dir: 'desc' };
      return null;
    });
  };

  const sortArrow = (key: 'level' | 'source') => {
    if (sort?.key !== key) return null;
    return (
      <span aria-hidden="true" className="ml-1">
        {sort.dir === 'asc' ? '▲' : '▼'}
      </span>
    );
  };

  const handleExport = () => {
    const header = ['waktu', 'sumber', 'pesan', 'level'];
    const rows = visible.map((a: any) => [a.timestamp, a.source, `"${a.message}"`, a.level]);
    const csv = [header.join(','), ...rows.map((r: string[]) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'bas-alarm.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-6">
        <h1 className="page-title">Alarm</h1>
        <p className="page-subtitle">Seluruh kejadian dari ketiga unit BAS</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Kritis</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold font-mono text-red-600">{criticalCount}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Peringatan</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold font-mono text-amber-600">{warningCount}</span>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="p-4 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Total</CardTitle>
          </CardHeader>
          <CardContent>
            <span className="text-2xl font-bold font-mono">{alarms.length}</span>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 space-y-0 pb-3">
          <CardTitle className="text-sm font-semibold">Riwayat Alarm</CardTitle>
          <div className="flex items-center gap-2">
            <div className="flex gap-2" role="group" aria-label="Filter level alarm">
              {(
                [
                  { value: 'all', label: 'Semua' },
                  { value: 'critical', label: 'Kritis' },
                  { value: 'warning', label: 'Peringatan' },
                ] as const
              ).map((opt) => (
                <Button
                  key={opt.value}
                  type="button"
                  variant={filter === opt.value ? 'default' : 'outline'}
                  onClick={() => setFilter(opt.value)}
                  aria-pressed={filter === opt.value}
                  className="min-h-[44px]"
                >
                  {opt.label}
                </Button>
              ))}
            </div>
            <Button type="button" variant="outline" onClick={handleExport} className="min-h-[44px]">
              Export CSV
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          {visible.length === 0 ? (
            <div className="py-10 text-center" role="status">
              <p className="text-sm font-semibold">Belum ada alarm tercatat. Sistem memantau normal.</p>
              <p className="text-xs text-muted-foreground mt-1">Alarm baru muncul di sini otomatis.</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Waktu</TableHead>
                  <TableHead aria-sort={sort?.key === 'source' ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}>
                    <button
                      type="button"
                      onClick={() => toggleSort('source')}
                      className="inline-flex items-center font-medium hover:text-foreground min-h-[44px]"
                      aria-label={`Urutkan berdasar sumber${sort?.key === 'source' ? (sort.dir === 'asc' ? ', menaik' : ', menurun') : ''}`}
                    >
                      Sumber{sortArrow('source')}
                    </button>
                  </TableHead>
                  <TableHead>Pesan</TableHead>
                  <TableHead aria-sort={sort?.key === 'level' ? (sort.dir === 'asc' ? 'ascending' : 'descending') : undefined}>
                    <button
                      type="button"
                      onClick={() => toggleSort('level')}
                      className="inline-flex items-center font-medium hover:text-foreground min-h-[44px]"
                      aria-label={`Urutkan berdasar level${sort?.key === 'level' ? (sort.dir === 'asc' ? ', kritis dulu' : ', peringatan dulu') : ''}`}
                    >
                      Level{sortArrow('level')}
                    </button>
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sorted.map((alarm: any) => (
                  <TableRow key={alarm.id}>
                    <TableCell className="font-mono text-xs whitespace-nowrap">{alarm.timestamp}</TableCell>
                    <TableCell className="font-medium">{alarm.source}</TableCell>
                    <TableCell>{alarm.message}</TableCell>
                    <TableCell>
                      <Badge variant={alarm.level === 'critical' ? 'destructive' : 'warning'}>
                        {alarm.level === 'critical' ? 'KRITIS' : 'PERINGATAN'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
