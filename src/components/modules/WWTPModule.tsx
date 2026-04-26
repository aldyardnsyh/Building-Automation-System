'use client';

import SystemCard from '../SystemCard';
import Gauge from '../Gauge';
import StatusIndicator from '../StatusIndicator';
import { WWTPSlave } from '@/types/bas';

interface WWTPProps {
  data: WWTPSlave | null;
}

export default function WWTPModule({ data }: WWTPProps) {
  if (!data) return null;

  return (
    <SystemCard 
      title="Waste Water Treatment Plant" 
      subtitle="Slave 1 - Modbus Address %MW100"
      icon="🏭"
      iconBg="bg-amber-50"
    >
      <div className="metric-grid">
        <Gauge
          type="linear"
          id="wwtp-flow"
          minValue={0}
          maxValue={500}
          units="L/min"
          value={data.flow}
          label="Laju Alir"
        />
        <Gauge
          type="linear"
          id="wwtp-pressure"
          minValue={0}
          maxValue={10}
          units="Bar"
          value={data.pressure}
          label="Tekanan"
        />
        <Gauge
          type="radial"
          id="wwtp-ph"
          minValue={0}
          maxValue={14}
          units="pH"
          value={data.ph}
          label="Nilai pH"
          highlights={[
            { from: 0, to: 6, color: '#ef4444' },
            { from: 6, to: 8.5, color: '#10b981' },
            { from: 8.5, to: 14, color: '#ef4444' },
          ]}
        />
      </div>
      <div className="indicators-row">
        <StatusIndicator
          id="wwtp-pump"
          label={data.pump_status === 1 ? 'Pompa ON' : 'Pompa OFF'}
          isActive={data.pump_status === 1}
        />
        <StatusIndicator
          id="wwtp-valve"
          label={data.valve_status === 1 ? 'Katup Terbuka' : 'Katup Tertutup'}
          isActive={data.valve_status === 1}
        />
      </div>
    </SystemCard>
  );
}