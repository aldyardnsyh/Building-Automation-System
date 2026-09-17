'use client';

import SystemCard from '../SystemCard';
import Gauge from '../Gauge';
import StatusIndicator from '../StatusIndicator';
import { CleanWaterSlave } from '@/types/bas';

interface CleanWaterProps {
  data: CleanWaterSlave | null;
}

export default function CleanWaterModule({ data }: CleanWaterProps) {
  if (!data) return null;

  return (
    <SystemCard
      title="Clean Water Distribution"
      subtitle="Slave 2 - Modbus Address %MW200"
      icon="C"
      iconBg="bg-cyan-50"
    >
      <div className="metric-grid">
        <Gauge
          type="linear"
          id="cw-flow"
          minValue={0}
          maxValue={1000}
          units="L/min"
          value={data.flow}
          label="Laju Alir"
          thresholdText="Batas operasi 0-1000 L/min"
        />
        <Gauge
          type="linear"
          id="cw-pressure"
          minValue={0}
          maxValue={10}
          units="bar"
          value={data.pressure}
          label="Tekanan"
          thresholdText="Batas operasi 0-10 bar"
        />
      </div>
      <div className="indicators-row">
        <StatusIndicator
          id="cw-dist"
          label={data.dist_status === 1 ? 'Distribusi Aktif' : 'Distribusi Nonaktif'}
          isActive={data.dist_status === 1}
        />
      </div>
    </SystemCard>
  );
}
