'use client';

import { useState, useEffect, useCallback, useRef } from 'react';
import { BASData, WWTPSlave, CleanWaterSlave, FireSystemSlave } from '@/types/bas';

interface TrendDataPoint {
  timestamp: number;
  value: number;
}

interface TrendHistory {
  [key: string]: TrendDataPoint[];
}

export function useBASData(interval: number = 2000) {
  const [data, setData] = useState<BASData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [trendHistory, setTrendHistory] = useState<TrendHistory>({});
  const [alarms, setAlarms] = useState<any[]>([]);
  const historyRef = useRef<TrendHistory>({});
  const alarmsRef = useRef<any[]>([]);

  const generateValue = (base: number, variance: number): number => {
    return base + (Math.random() - 0.5) * variance * 2;
  };

  const updateData = useCallback(() => {
    const newData: BASData = {
      wwtp: {
        flow: Math.floor(generateValue(250, 100)),
        pressure: parseFloat(generateValue(4.5, 2).toFixed(1)),
        ph: parseFloat(generateValue(7, 1).toFixed(1)),
        pump_status: Math.random() > 0.2 ? 1 : 0,
        valve_status: Math.random() > 0.15 ? 1 : 0,
      },
      clean_water: {
        flow: Math.floor(generateValue(450, 200)),
        pressure: parseFloat(generateValue(5, 2).toFixed(1)),
        dist_status: Math.random() > 0.1 ? 1 : 0,
      },
      fire_system: {
        temp: Math.floor(generateValue(28, 5)),
        smoke: Math.floor(generateValue(200, 150)),
        status: Math.random() > 0.95 ? 1 : 0,
      },
      timestamp: new Date().toISOString(),
    };

    const now = Date.now();
    
    const updateHistory = (key: string, value: number) => {
      const history = historyRef.current[key] || [];
      const newHistory = [...history, { timestamp: now, value }].slice(-30);
      historyRef.current[key] = newHistory;
    };

    updateHistory('wwtp-flow', newData.wwtp.flow);
    updateHistory('wwtp-pressure', newData.wwtp.pressure);
    updateHistory('wwtp-ph', newData.wwtp.ph);
    updateHistory('cw-flow', newData.clean_water.flow);
    updateHistory('cw-pressure', newData.clean_water.pressure);
    updateHistory('fire-temp', newData.fire_system.temp);
    updateHistory('fire-smoke', newData.fire_system.smoke);

    if (newData.wwtp.ph < 6 || newData.wwtp.ph > 8.5) {
      const phStr = newData.wwtp.ph.toFixed(1).replace('.', ',');
      const newAlarm = {
        id: `alarm-${now}`,
        timestamp: new Date().toLocaleString('id-ID'),
        source: 'WWTP',
        message: `pH ${phStr} di luar batas aman (6,0-8,5)`,
        level: 'warning',
        acknowledged: false,
      };
      alarmsRef.current = [newAlarm, ...alarmsRef.current].slice(0, 20);
    }

    if (newData.fire_system.status === 1) {
      const newAlarm = {
        id: `alarm-${now}`,
        timestamp: new Date().toLocaleString('id-ID'),
        source: 'Fire System',
        zona: 'Zona A',
        message: 'Indikasi kebakaran terdeteksi, evakuasi Area A (Zona A)',
        level: 'critical',
        acknowledged: false,
      };
      alarmsRef.current = [newAlarm, ...alarmsRef.current].slice(0, 20);
    }

    if (newData.fire_system.smoke > 500) {
      const newAlarm = {
        id: `alarm-${now}`,
        timestamp: new Date().toLocaleString('id-ID'),
        source: 'Fire System',
        zona: 'Zona A',
        message: `Asap tinggi: ${newData.fire_system.smoke} (ambang 500)`,
        level: 'warning',
        acknowledged: false,
      };
      alarmsRef.current = [newAlarm, ...alarmsRef.current].slice(0, 20);
    }

    setData(newData);
    setTrendHistory({ ...historyRef.current });
    setAlarms([...alarmsRef.current]);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    for (let i = 0; i < 20; i++) {
      const pastTime = Date.now() - (20 - i) * 2000;
      historyRef.current = {
        'wwtp-flow': [...(historyRef.current['wwtp-flow'] || []), { timestamp: pastTime, value: Math.floor(generateValue(250, 100)) }],
        'wwtp-pressure': [...(historyRef.current['wwtp-pressure'] || []), { timestamp: pastTime, value: generateValue(4.5, 2) }],
        'wwtp-ph': [...(historyRef.current['wwtp-ph'] || []), { timestamp: pastTime, value: generateValue(7, 1) }],
        'cw-flow': [...(historyRef.current['cw-flow'] || []), { timestamp: pastTime, value: Math.floor(generateValue(450, 200)) }],
        'cw-pressure': [...(historyRef.current['cw-pressure'] || []), { timestamp: pastTime, value: generateValue(5, 2) }],
        'fire-temp': [...(historyRef.current['fire-temp'] || []), { timestamp: pastTime, value: Math.floor(generateValue(28, 5)) }],
        'fire-smoke': [...(historyRef.current['fire-smoke'] || []), { timestamp: pastTime, value: Math.floor(generateValue(200, 150)) }],
      };
    }
    setTrendHistory({ ...historyRef.current });
  }, []);

  useEffect(() => {
    updateData();
    const timer = setInterval(updateData, interval);
    return () => clearInterval(timer);
  }, [updateData, interval]);

  return { data, isLoading, trendHistory, alarms };
}

export function useTrendHistory(key: string, interval: number = 2000) {
  const [history, setHistory] = useState<TrendDataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialData: TrendDataPoint[] = [];
    const now = Date.now();
    for (let i = 0; i < 20; i++) {
      initialData.push({
        timestamp: now - (20 - i) * interval,
        value: Math.random() * 100,
      });
    }
    setHistory(initialData);
    setIsLoading(false);

    const timer = setInterval(() => {
      setHistory(prev => {
        const newPoint: TrendDataPoint = {
          timestamp: Date.now(),
          value: Math.random() * 100,
        };
        return [...prev.slice(-29), newPoint];
      });
    }, interval);

    return () => clearInterval(timer);
  }, [interval]);

  return { history, isLoading };
}