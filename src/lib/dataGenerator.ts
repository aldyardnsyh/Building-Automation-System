import { BASData } from '@/types/bas';

export function generateDummyData(): BASData {
  return {
    wwtp: {
      flow: Math.floor(Math.random() * 450) + 50,
      pressure: parseFloat((Math.random() * 8 + 1).toFixed(1)),
      ph: parseFloat((Math.random() * 2 + 6.5).toFixed(1)),
      pump_status: Math.random() > 0.3 ? 1 : 0,
      valve_status: Math.random() > 0.2 ? 1 : 0,
    },
    clean_water: {
      flow: Math.floor(Math.random() * 900) + 100,
      pressure: parseFloat((Math.random() * 7 + 2).toFixed(1)),
      dist_status: Math.random() > 0.1 ? 1 : 0,
    },
    fire_system: {
      temp: Math.floor(Math.random() * 15) + 25,
      smoke: Math.floor(Math.random() * 800),
      status: Math.random() > 0.95 ? 1 : 0,
    },
    timestamp: new Date().toISOString(),
  };
}