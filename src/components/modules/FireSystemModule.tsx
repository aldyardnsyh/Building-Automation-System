'use client';

import SystemCard from '../SystemCard';
import Gauge from '../Gauge';
import StatusIndicator from '../StatusIndicator';
import { FireSystemSlave } from '@/types/bas';

interface FireSystemProps {
  data: FireSystemSlave | null;
}

export default function FireSystemModule({ data }: FireSystemProps) {
  if (!data) return null;

  return (
    <SystemCard
      title="Fire Protection System"
      subtitle="Slave 3 - Modbus Address %MW300"
      icon="🔥"
      iconBg="bg-red-50"
      isAlert={data.status === 1}
    >
      <div className="metric-grid">
        <Gauge
          type="linear"
          id="fire-temp"
          minValue={0}
          maxValue={100}
          units="°C"
          value={data.temp}
          label="Suhu Ruangan"
        />
        <Gauge
          type="linear"
          id="fire-smoke"
          minValue={0}
          maxValue={1023}
          units="ppm"
          value={data.smoke}
          label="Sensor Asap"
        />
      </div>
      <div className="indicators-row">
        <StatusIndicator
          id="fire-status"
          label={data.status === 1 ? '🚨 FIRE ALARM - EVACUATE!' : 'Status Normal'}
          isActive={data.status === 1}
        />
      </div>
    </SystemCard>
  );
}